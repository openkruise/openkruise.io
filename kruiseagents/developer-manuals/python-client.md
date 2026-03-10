---
title: Python Client
---

## Overview

We provide the [agents-api](https://github.com/openkruise/agents-api/tree/master/clients/python/openkruise) repository,
which contains the Python Client library for Agents resources.

## Prerequisites

Before using the Python Client, please note the following:

- **Python Version**: Python 3.7 or higher
- **Dependency Requirements**: You must use the Kubernetes Python client library, `kubernetes.client`.

## Installation

### Install via Git

```bash
pip install git+https://github.com/openkruise/agents-api.git@master#subdirectory=clients/python/openkruise
```

## Usage Example

Two demos are provided below for reference, demonstrating the basic operations of SandboxSet and SandboxClaim
respectively.

```
The following code is only a simple demo example. In a production environment, you need to encapsulate a high-availability Client yourself (such as connection pool management, timeout and retry mechanisms, etc.) and complete exception handling logic.
```

```python
from agents import SandboxSet, SandboxSetClient, SandboxSetSpec
from kubernetes.client import V1ObjectMeta, V1Container, V1PodSpec, V1PodTemplateSpec


class SandboxSetExample:

    def __init__(self, namespace="default"):
        self.client = SandboxSetClient(namespace=namespace)

    def create_sandboxset(self, name: str, replicas: int, image: str) -> dict:
        """
        Create SandboxSet
        """
        try:
            sandboxset = self._build_sandboxset(name, replicas, image)
            result = self.client.create_sandboxset(sandboxset)
            print(f"SandboxSet created: {name}")
            return result
        except Exception as e:
            print(f"Failed to create sandboxset: {e}")
            return None

    def get_sandboxset(self, name: str) -> dict:
        """
        Get SandboxSet
        """
        try:
            result = self.client.get_sandboxset(name)
            print(f"SandboxSet retrieved: {name}")
            return result
        except Exception as e:
            print(f"Failed to get sandboxset: {e}")
            return None

    def delete_sandboxset(self, name: str):
        """
        Delete SandboxSet
        """
        try:
            self.client.delete_sandboxset(name)
            print(f"SandboxSet deleted: {name}")
        except Exception as e:
            print(f"Failed to delete sandboxset: {e}")

    def _build_sandboxset(self, name: str, replicas: int, image: str) -> SandboxSet:
        """
        Build SandboxSet
        """
        labels = {"sandboxset": "true"}
        container_name = "test-container"

        # Build Metadata
        metadata = V1ObjectMeta(
            name=name,
            labels=labels,
        )

        # Build Container
        container = V1Container(
            name=container_name,
            image=image,
        )

        # Build PodSpec
        pod_spec = V1PodSpec(
            containers=[container],
        )

        # Build PodTemplateSpec
        template = V1PodTemplateSpec(
            metadata=V1ObjectMeta(labels={"sandboxset": "true"}),
            spec=pod_spec,
        )

        # Build SandboxSetSpec
        spec = SandboxSetSpec(
            replicas=replicas,
            template=template,
        )

        return SandboxSet(
            metadata=metadata,
            spec=spec,
        )


if __name__ == '__main__':
    import time

    namespace = "default"
    name = f"test-sandboxset-{int(time.time() * 1000)}"
    replicas = 1
    image = "nginx:stable-alpine3.23"

    example = SandboxSetExample(namespace=namespace)

    # create
    example.create_sandboxset(name, replicas, image)

    # get
    example.get_sandboxset(name)

    # delete
    example.delete_sandboxset(name)
```

```python
import time
from agents import (
    SandboxSet, SandboxSetClient, SandboxSetSpec,
    SandboxClaim, SandboxClaimClient, SandboxClaimSpec
)
from kubernetes.client import V1ObjectMeta, V1Container, V1PodSpec, V1PodTemplateSpec


class SandboxClaimExample:

    def __init__(self, namespace="default"):
        self.sandboxset_client = SandboxSetClient(namespace=namespace)
        self.sandboxclaim_client = SandboxClaimClient(namespace=namespace)

    def create_sandboxset(self, name: str, replicas: int, image: str) -> dict:
        """
        Create SandboxSet (pool)
        """
        try:
            sandboxset = self._build_sandboxset(name, replicas, image)
            result = self.sandboxset_client.create_sandboxset(sandboxset)
            print(f"SandboxSet created: {name}")
            return result
        except Exception as e:
            print(f"Failed to create sandboxset: {e}")
            return None

    def create_sandboxclaim(self, name: str, template_name: str, replicas: int) -> dict:
        """
        Create SandboxClaim
        """
        try:
            sandboxclaim = self._build_sandboxclaim(name, template_name, replicas)
            result = self.sandboxclaim_client.create_sandboxclaim(sandboxclaim)
            print(f"SandboxClaim created: {name}")
            return result
        except Exception as e:
            print(f"Failed to create sandboxclaim: {e}")
            return None

    def get_sandboxclaim(self, name: str) -> dict:
        """
        Get SandboxClaim
        """
        try:
            result = self.sandboxclaim_client.get_sandboxclaim(name)
            print(f"SandboxClaim retrieved: {name}")
            return result
        except Exception as e:
            print(f"Failed to get sandboxclaim: {e}")
            return None

    def delete_sandboxclaim(self, name: str):
        """
        Delete SandboxClaim
        """
        try:
            self.sandboxclaim_client.delete_sandboxclaim(name)
            print(f"SandboxClaim deleted: {name}")
        except Exception as e:
            print(f"Failed to delete sandboxclaim: {e}")

    def delete_sandboxset(self, name: str):
        """
        Delete SandboxSet
        """
        try:
            self.sandboxset_client.delete_sandboxset(name)
            print(f"SandboxSet deleted: {name}")
        except Exception as e:
            print(f"Failed to delete sandboxset: {e}")

    def _build_sandboxset(self, name: str, replicas: int, image: str) -> SandboxSet:
        """
        Build SandboxSet
        """

        metadata = V1ObjectMeta(name=name)

        # build Container
        container = V1Container(
            name="test-container",
            image=image,
        )

        # build PodSpec
        pod_spec = V1PodSpec(containers=[container])

        # build PodTemplateSpec
        template = V1PodTemplateSpec(spec=pod_spec)

        # build SandboxSetSpec
        spec = SandboxSetSpec(
            replicas=replicas,
            template=template,
        )

        return SandboxSet(metadata=metadata, spec=spec)

    def _build_sandboxclaim(self, name: str, template_name: str, replicas: int) -> SandboxClaim:
        """
        Build SandboxClaim
        """
        # build Metadata
        metadata = V1ObjectMeta(name=name)

        # build SandboxClaimSpec
        spec = SandboxClaimSpec(
            templateName=template_name,
            replicas=replicas,
        )

        return SandboxClaim(metadata=metadata, spec=spec)


if __name__ == '__main__':
    namespace = "default"

    sandboxset_name = f"test-pool-{int(time.time() * 1000)}"
    sandboxclaim_name = f"test-claim-{int(time.time() * 1000)}"

    pool_replicas = 5
    claim_replicas = 1
    image = "nginx:stable-alpine3.23"

    example = SandboxClaimExample(namespace=namespace)

    try:
        # Step 1: Creating SandboxSet (pool)
        print("=== Step 1: Creating SandboxSet (pool) ===")
        created_pool = example.create_sandboxset(sandboxset_name, pool_replicas, image)
        if not created_pool:
            print("Failed to create pool, exiting")
            exit(1)

        # Waiting SandboxSet ready
        print("Waiting for SandboxSet to be ready...")
        time.sleep(10)

        # Step 2: Creating SandboxClaim
        print("\n=== Step 2: Creating SandboxClaim ===")
        created_claim = example.create_sandboxclaim(sandboxclaim_name, sandboxset_name, claim_replicas)
        if not created_claim:
            print("Failed to create claim, cleaning up pool")
            example.delete_sandboxset(sandboxset_name)
            exit(1)

        # Waiting claim
        print("Waiting for claim to be processed...")
        time.sleep(5)

        # Step 3: Getting SandboxClaim
        print("\n=== Step 3: Getting SandboxClaim ===")
        example.get_sandboxclaim(sandboxclaim_name)

        # Step 4: Deleting SandboxClaim
        print("\n=== Step 4: Deleting SandboxClaim ===")
        example.delete_sandboxclaim(sandboxclaim_name)

        # Step 5: Cleaning SandboxSet
        print("\n=== Step 5: Cleaning up SandboxSet ===")
        example.delete_sandboxset(sandboxset_name)

        print("\n=== Example completed successfully ===")

    except KeyboardInterrupt:
        print("\nInterrupted by user")
```

