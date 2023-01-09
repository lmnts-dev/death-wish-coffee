# dwc/shopify

# Add a few libraries to the shopify-cli image
FROM dylansmith/shopify-cli:2.22.0

RUN apk add git
