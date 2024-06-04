# boilerplate-backend-node

Boilerplate code for Backend (Node.js)

## Docker / Podman

### Building

```bash
podman build -t "backend:latest" --ulimit nofile=4096:4096 .;
```

### Running

```bash
podman run --rm -it -p 8080:8080 -e NODE_ENV="development" -e LISTEN="0.0.0.0" backend:latest;
```
