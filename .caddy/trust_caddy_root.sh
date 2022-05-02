#!/usr/bin/env bash

# This script is used to trust the Caddy root certificate.
#
# It makes the root certificate available from the Caddy container and adds it
# to the host OS trust store. On Linux, the CA is also added to the browser
# stores.

# What OS are we running on?
host_os=$(uname -s)

# Get the container ID for Caddy if it is running
caddy_container_id=$(docker compose ps | grep caddy | awk '{print $1;}')

# If Caddy is not running, start it and get the container ID
if [ -z "$caddy_container_id" ]; then
  caddy_was_running=false
  docker compose up -d caddy
  caddy_container_id=$(docker compose ps | grep caddy | awk '{print $1;}')
else
  caddy_was_running=true
fi

# A temporary file to store the root certificate
temp_cert=$(mktemp)
temp_cert_label="Caddy Local Authority - ECC Root CA"

# Get the Caddy container's root certificate
docker exec -t "$caddy_container_id" cat /data/caddy/pki/authorities/local/root.crt > "$temp_cert"

if [ "$host_os" == "Darwin" ]; then
  # Trust the root certificate
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$temp_cert"
elif [ "$host_os" == "Linux" ]; then
  # Trust the root certificate
  sudo mkdir -p /usr/share/ca-certificates/caddy
  sudo cp "$temp_cert" "/usr/share/ca-certificates/caddy/$caddy_container_id.pem"
  echo "caddy/$caddy_container_id.pem" | sudo tee -a /etc/ca-certificates.conf &> /dev/null
  sudo update-ca-certificates

  # Ensure the `certutil` command is available
  if ! apt list --installed | grep -q libnss3-tools &> /dev/null; then
    sudo apt install -qy libnss3-tools &> /dev/null
  fi

  # Update each browser's trust stores
  for cert_db in $(find ~/ -name 'cert9.db')
  do
    cert_db_dir=$(dirname "${cert_db}");
    certutil -A -n "${temp_cert_label}" -t "TCu,Cu,Tu" -i "${temp_cert}" -d sql:"${cert_db_dir}"
  done
fi

# Clean up
rm "$temp_cert"

if [ "$caddy_was_running" = false ]; then
  docker compose stop caddy
fi
