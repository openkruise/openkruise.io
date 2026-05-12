---
id: api-keys-and-teams
title: API Keys and Teams
sidebar_label: User Management
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Keys and Teams

`sandbox-manager` exposes a set of E2B-compatible HTTP endpoints for managing **API Keys** and **Teams**. These
endpoints allow cluster administrators and tenant users to provision API keys programmatically, enumerate the teams
they belong to, and revoke keys that are no longer needed.

> These APIs do **not** have a dedicated E2B SDK or Kubernetes CRD binding. They must be invoked directly over HTTP.
> This document provides `curl` and Python `requests` examples for each endpoint.

## Overview

### Teams

A **Team** is the authorization boundary of API keys. In OpenKruise Agents, team identity is represented by the
team name, and **a team name is mapped directly to a Kubernetes Namespace**:

- The built-in `admin` team is cluster-scoped and managed by the administrator. It owns the admin API key that is
  bootstrapped together with `sandbox-manager`.
- Any other team name must correspond to an **existing** Kubernetes Namespace. When a tenant creates an API key for
  team `foo`, the namespace `foo` must already exist; otherwise the request is rejected.

Because the namespace uniqueness guarantees the isolation boundary, additional team UUIDs are treated as display-only
metadata and are **not** used for authorization or resource lookup.

### API Keys

An **API Key** is a long-lived credential owned by a team. Clients authenticate every request to `sandbox-manager`
by setting the `X-API-KEY` request header. The API key determines:

- Which team the caller belongs to.
- Whether the caller is a regular tenant or the cluster administrator (i.e. belongs to the `admin` team).
- Which sandboxes the caller is allowed to access — a caller may only operate on sandboxes owned by its own API key
  (admin can access every sandbox).

### Authorization Model

| Role                 | List own team's keys | List all teams | Create key for own team | Create key for other team | Delete own team's keys | Delete admin key |
|----------------------|----------------------|----------------|-------------------------|---------------------------|------------------------|------------------|
| Admin (`admin` team) | ✅                    | ✅              | ✅                       | ✅                         | ✅                      | ❌ (forbidden)    |
| Tenant user          | ✅                    | ✅ (own only)   | ✅                       | ❌                         | ✅                      | ❌                |

The built-in admin key is **non-deletable by design** to avoid accidentally locking the cluster out.

## Prerequisites

- Authentication must be enabled on `sandbox-manager` (default: `--e2b-enable-auth=true`). When authentication is
  disabled, the `/teams` and `/api-keys` endpoints are not registered.
- You must have a valid API key. The admin key is generated or provided at startup via the `--e2b-admin-key` flag of
  `sandbox-manager`. Non-admin tenants obtain their initial key from the administrator.

## URL Conventions

`sandbox-manager` accepts both the **native E2B protocol** and the **private protocol** introduced by OpenKruise Agents.
The examples below assume your configured `E2B_DOMAIN` is `your.domain.com`.

| Protocol                  | Base URL                                |
|---------------------------|-----------------------------------------|
| Native E2B                | `https://api.your.domain.com`           |
| Private (OpenKruise)      | `https://your.domain.com/kruise/api`    |

> For more details on domain and certificate configuration, see the
> [E2B SDK integration documentation](../developer-manuals/e2b-client.md).

All examples below use the **native** URL form. If you are using the private protocol, just replace the base URL
accordingly. For example `GET /api-keys` becomes `GET https://your.domain.com/kruise/api/api-keys`.

## Endpoints

| Method   | Path                  | Description                                                |
|----------|-----------------------|------------------------------------------------------------|
| `GET`    | `/teams`              | List teams the current user can see                        |
| `GET`    | `/api-keys`           | List API keys owned by the current user's team             |
| `POST`   | `/api-keys`           | Create a new API key for the current user's team (or another team if admin) |
| `DELETE` | `/api-keys/{id}`      | Delete the API key with the given UUID                     |

Every request must set the header `X-API-KEY: <your-api-key>`.

### List Teams

Returns all teams visible to the current user. Non-admin tenants see their own team; the admin sees all teams.

Response body (schema):

```json
[
  {
    "teamID":    "550e8400-e29b-41d4-a716-446655449999",
    "name":      "admin",
    "apiKey":    "sk-xxxxxxxx",
    "isDefault": true
  }
]
```

<Tabs>
  <TabItem value="curl" label="curl">

```shell
curl -sS \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  "https://api.your.domain.com/teams"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

resp = requests.get(
    "https://api.your.domain.com/teams",
    headers={"X-API-KEY": os.environ["E2B_API_KEY"]},
    timeout=10,
)
resp.raise_for_status()
print(resp.json())
```

  </TabItem>
</Tabs>

### List API Keys

Returns the API keys owned by the caller's team. Plaintext key values are **not** returned — only masked metadata
(`mask.maskedValuePrefix`, `mask.maskedValueSuffix`, etc.).

<Tabs>
  <TabItem value="curl" label="curl">

```shell
curl -sS \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  "https://api.your.domain.com/api-keys"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

resp = requests.get(
    "https://api.your.domain.com/api-keys",
    headers={"X-API-KEY": os.environ["E2B_API_KEY"]},
    timeout=10,
)
resp.raise_for_status()
for key in resp.json():
    print(key["id"], key["name"], key["mask"])
```

  </TabItem>
</Tabs>

### Create API Key

Creates a new API key. The plaintext key value is returned **exactly once** in the response body under `key` — make
sure to persist it, as it cannot be retrieved again.

Request body:

| Field      | Type   | Required | Description                                                                                                          |
|------------|--------|----------|----------------------------------------------------------------------------------------------------------------------|
| `name`     | string | Yes      | Human-readable name for the key.                                                                                     |
| `teamName` | string | No       | Target team name. Defaults to the caller's team. Only the admin team may specify a value different from its own team. |

> When `teamName` is set to a non-admin team, the corresponding Kubernetes Namespace must already exist.

<Tabs>
  <TabItem value="curl" label="curl">

```shell
curl -sS -X POST \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"name": "ci-runner", "teamName": "team-a"}' \
  "https://api.your.domain.com/api-keys"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

resp = requests.post(
    "https://api.your.domain.com/api-keys",
    headers={
        "X-API-KEY": os.environ["E2B_API_KEY"],
        "Content-Type": "application/json",
    },
    json={"name": "ci-runner", "teamName": "team-a"},
    timeout=10,
)
resp.raise_for_status()
created = resp.json()
# Persist `created["key"]` now — it will NOT be returned again.
print(created["id"], created["key"])
```

  </TabItem>
</Tabs>

### Delete API Key

Deletes the API key identified by its UUID. A tenant can only delete keys that belong to its own team; the admin can
delete any non-admin key. Attempting to delete the well-known admin key returns `403 Forbidden`.

<Tabs>
  <TabItem value="curl" label="curl">

```shell
API_KEY_ID="<uuid-from-list-api-keys>"

curl -sS -X DELETE \
  -H "X-API-KEY: ${E2B_API_KEY}" \
  "https://api.your.domain.com/api-keys/${API_KEY_ID}"
```

  </TabItem>
  <TabItem value="python" label="Python requests">

```python
import os
import requests

api_key_id = "<uuid-from-list-api-keys>"
resp = requests.delete(
    f"https://api.your.domain.com/api-keys/{api_key_id}",
    headers={"X-API-KEY": os.environ["E2B_API_KEY"]},
    timeout=10,
)
# 204 No Content on success.
resp.raise_for_status()
```

  </TabItem>
</Tabs>

## Error Handling

| HTTP Status | Scenario                                                                      |
|-------------|-------------------------------------------------------------------------------|
| `400`       | Malformed body, missing `teamName`, or the target namespace does not exist    |
| `401`       | Missing / invalid `X-API-KEY` header                                          |
| `403`       | Attempting to act on a team other than your own (non-admin), or deleting admin key |
| `404`       | Target API key UUID does not exist                                            |
| `500`       | Backend error (e.g. Kubernetes API unavailable, MySQL unreachable)            |

## API Key Storage Backend Configuration

`sandbox-manager` supports two pluggable storage backends for API keys. The backend is selected via command-line
flags of the `sandbox-manager` binary (see [cmd/sandbox-manager/main.go](https://github.com/openkruise/agents/blob/master/cmd/sandbox-manager/main.go)).

### Common Flags

| Flag                   | Default    | Description                                                                                                      |
|------------------------|------------|------------------------------------------------------------------------------------------------------------------|
| `--e2b-enable-auth`    | `true`     | Enable API-key authentication. When `false`, the `/teams` and `/api-keys` endpoints are disabled.                |
| `--e2b-admin-key`      | *(random)* | Bootstrap admin API key. If empty, a random UUID is generated at startup. Set this to a stable value in production. |
| `--e2b-key-storage`    | `secret`   | Storage backend for API keys. Valid values: `secret`, `mysql`.                                                   |

### Backend: `secret` (Default)

Stores API keys as a Kubernetes `Secret` named `e2b-key-store` inside `sandbox-manager`'s own system namespace
(typically `sandbox-system`). This is the zero-dependency default and is suitable for evaluation or single-tenant
deployments.

Example flags:

```shell
sandbox-manager \
  --e2b-enable-auth=true \
  --e2b-admin-key=sk-admin-xxxx \
  --e2b-key-storage=secret
```

> The Secret is created/read at startup using the system namespace resolved from `--system-namespace`.

### Backend: `mysql`

Stores API keys in a MySQL database via GORM. Only a deterministic `HMAC-SHA256(pepper, rawKey)` hash is persisted —
**plaintext keys are never written to MySQL**. This backend is recommended for multi-tenant deployments that require
auditability and horizontal scalability.

| Parameter                                     | Source                            | Required | Description                                                                                                              |
|-----------------------------------------------|-----------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------|
| `--e2b-key-storage=mysql`                     | Flag                              | Yes      | Select MySQL backend.                                                                                                    |
| `E2B_KEY_STORAGE_DSN`                         | Environment variable              | Yes      | GORM-compatible MySQL DSN, e.g. `user:pass@tcp(mysql:3306)/e2b?charset=utf8mb4&parseTime=True&loc=Local`.                |
| `E2B_KEY_HASH_PEPPER`                         | Environment variable              | Yes      | Pepper used for HMAC-SHA256 hashing. Rotating it invalidates all existing keys, so treat it as a durable secret.         |
| `--e2b-key-storage-disable-schema-auto-update`| Flag (default `false`)            | No       | When `true`, GORM schema auto-migration is skipped. Admin team/key bootstrap still runs. Use this when DDL is managed externally. |

Example deployment (MySQL mode):

```shell
export E2B_KEY_STORAGE_DSN='e2b:secretpwd@tcp(mysql.sandbox-system.svc:3306)/e2b?charset=utf8mb4&parseTime=True&loc=Local'
export E2B_KEY_HASH_PEPPER='please-rotate-me-in-production'

sandbox-manager \
  --e2b-enable-auth=true \
  --e2b-admin-key=sk-admin-xxxx \
  --e2b-key-storage=mysql \
  --e2b-key-storage-disable-schema-auto-update=false
```

Notes:

- `E2B_KEY_STORAGE_DSN` and `E2B_KEY_HASH_PEPPER` are read from the environment (not from flags) so that they can be
  injected via Kubernetes `Secret` references without appearing on the command line.
- When auth is disabled (`--e2b-enable-auth=false`), these flags/env vars are ignored and no key storage is
  initialized.
- If `--e2b-key-storage=mysql` is set but the DSN or pepper is empty, `sandbox-manager` fails fast at startup.

### Choosing a Backend

| Scenario                                              | Recommended Backend |
|-------------------------------------------------------|---------------------|
| Local development, evaluation, single tenant          | `secret`            |
| Production, multi-tenant, multiple `sandbox-manager` replicas with shared storage | `mysql`             |
| Schema is managed by an external migration tool       | `mysql` with `--e2b-key-storage-disable-schema-auto-update=true` |

#### Capacity Threshold Between `secret` and `mysql`

Kubernetes enforces a hard limit of **1 MiB per object** on a `Secret`, shared by `metadata`, `managedFields`, and the
`Data` map. In `secret` mode, every API key is serialized as a JSON blob under a UUID key (~0.4 – 0.6 KB per entry).
After excluding metadata / `managedFields` overhead, the usable budget is roughly **~900 KB**, and every create / delete
rewrites the whole `Secret`, which keeps inflating `managedFields` as usage grows.

Taking room for future field additions and burst growth into account, the conservative recommendation is:

| Total API Keys     | Recommendation                                                                    |
|--------------------|-----------------------------------------------------------------------------------|
| **≤ 500**          | `secret` is safe to use.                                                          |
| **500 – 1000**     | Still works, but start planning migration to `mysql`.                             |
| **> 1000**         | Must switch to `mysql`; otherwise writes will eventually fail when approaching the 1 MiB hard limit. |

> Rule of thumb: if you expect **more than a few hundred API keys** in a single cluster, pick `mysql` from day one
> to avoid a disruptive migration later.
