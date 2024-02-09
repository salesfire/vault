# salesfire/vault

## Building Locally

docker build -t salesfire/vault:latest .

## Deployment

### Manually publish

```
export VERSION=latest
docker buildx create --driver cloud salesfire/mybuilder
docker buildx build --builder cloud-salesfire-mybuilder --platform linux/arm64,linux/amd64 -t salesfire/vault:${VERSION} --push .
```
