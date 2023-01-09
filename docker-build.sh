#!/bin/sh
VERSION=latest
export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker build -t dwc/shopify:$VERSION --build-arg version=$VERSION $@ .
