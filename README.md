# Oasis Explorer Frontend

## Oasis Indexer API

Deployed version is at https://index.oasislabs.com/v1/ with OpenAPI spec at https://index.oasislabs.com/v1/spec/v1.html (and https://index.oasislabs.com/v1/spec/v1.yaml).

<details>
<summary>
Bleeding-edge API version
</summary>

OpenAPI spec for the bleeding-edge version is at https://github.com/oasisprotocol/oasis-indexer/blob/main/api/spec/v1.yaml.

To quickly run latest emerald indexer locally without running a node, replace https://github.com/oasisprotocol/oasis-indexer/blob/d48de37/tests/e2e/config/e2e-dev.yml#L1-L8 with:
```yaml
analysis:
  analyzers:
    - name: emerald_main_damask
      chain_id: oasis-3
      rpc: grpc.oasis.dev:443
      chaincontext: b11b369e0da5bb230b220127f5e7b242d385ef8c6f54906243f30af63c815535
      # Use the latest round from oasisscan (easier than gRPC)
      # https://www.oasisscan.com/paratimes/000000000000000000000000000000000000000000000000e2eaa99fc008f87f/roundList
      to: <latest round>
      from: <latest round - 500>
```

and run

```sh
make start-docker-e2e
REACT_APP_API=http://localhost:8008/v1/ yarn start
```

</details>

