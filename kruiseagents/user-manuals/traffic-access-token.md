---
id: traffic-access-token
title: Traffic Access Token Rotation
---

# Traffic Access Token Rotation

Sandboxes protected by Traffic JWT authentication receive a traffic access token for data-plane requests. OpenKruise
Agents can return the token expiration time, issue a replacement token, and refresh tokens automatically through its
customized E2B client patch.

This feature applies only to JWT traffic tokens. Legacy opaque tokens remain usable but have no expiration-based
refresh behavior. For API-key and Traffic JWT setup, see [API Keys and Teams](./api-keys-and-teams.md).

## Client Requirements

Automatic refresh requires Python 3.10 or newer, `e2b>=2.35.0,<2.38.0`, and
`e2b-code-interpreter>=2.9.0,<2.10.0`. Enable the independent traffic-token patch after the regular OpenKruise Agents
E2B patch:

```python
from kruise_agents.patch_e2b import patch_e2b
from kruise_agents.patch_traffic_token import patch_traffic_access_token

patch_e2b(https=False)
patch_traffic_access_token()
```

Synchronous and asynchronous envd HTTP/RPC calls and Code Interpreter Jupyter requests read the latest token just
before sending. The client refreshes a JWT before expiration and exposes its UTC expiration time. Overlapping refreshes
for one Sandbox on the same `sandbox-manager` replica are combined into one issuance.

## Refresh Explicitly

Applications can request a new token before their next data-plane call:

```python
token = sandbox.refresh_traffic_access_token(force=True)
print(token.expires_at)

token = await async_sandbox.refresh_traffic_access_token(force=True)
```

The private-protocol endpoint is `POST /kruise/api/sandboxes/{sandboxID}/traffic-access-token`. It returns
`trafficAccessToken` and `trafficAccessTokenExpiration` in RFC 3339 format. The caller must own the Sandbox; unauthorized
and nonexistent Sandboxes both return `404`.

## Failure and Rollout Behavior

- A refresh failure continues using the previous token while it remains valid. After expiration, the patched client
  fails locally instead of sending a known-invalid credential.
- `Sandbox.connect(sandbox_id)` resumes or extends a Sandbox but does not issue a token. For a JWT-protected Sandbox
  connected without a token, the patched client refreshes on the first data-plane request.
- `sandbox-manager` keeps the legacy long validity by default. Deploy refresh-capable clients before shortening
  `--traffic-access-token-validity`; clients without refresh support lose access after a short-lived token expires.
- Treat traffic tokens as credentials. Do not log them or store them in Sandbox metadata.
