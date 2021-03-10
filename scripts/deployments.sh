#!/usr/bin/env bash

## This file is used to automatically deploy to shopify. 
## It is intended to only be run when code is pushed to the <develop> or <master> branch
## This file needs to be executed from the root of the project to be successful.
##
## The following variables need to be present for this script to complete. 
## These can be set in the GitLab repository Settings > CI/CD
## If these variables are not found, the script will prompt for them
##
## Assumptions
## This script will attempt to pull varaibles from either GitLab CI/CD variables or a local config.yml file. 
## In the case of pulling variables from config.yml, the script will use the production environment to determine the 
## API Key, Store Name, and Password.
##
## Variables
## SHOPIFY_STORE - the URL of the shopify store. something like example.myshopify.com
## STAGING_THEME - the theme ID for the dedicated Staging theme
## LIVE_THEME - the theme ID for the dedicated Live theme
## API_PASSWORD - the password value from the shopify private app used for development
## API_KEY - the api key from the shopify private app used for development

# Get helper functions
source $(dirname $0)/functions.sh

# Setup variables
THEME_NAME=" (v$(npm version | grep -o  '[0-9.]\+' | head -n1)) - $(date '+%m-%d-%Y %H:%M:%S')"
CURRENT_BRANCH="$(get_current_branch)"
IFS=','

if [ -f "config.yml" ]; then 
    printf "Config file found. Loading it for fallback variables...\n";
    eval $(parse_yaml config.yml "config_");
fi

# Set up default variables and request any missing variables.
if [ -z ${SHOPIFY_STORE+x} ]; then
    if ! [ -z ${config_production_store+x} ]; then
      SHOPIFY_STORE="$config_production_store"
    else
      printf "Hmm... doesn't look like the shopify store URL is defined yet.. What's store are we deploying to? - Example: domain.myshopify.com\n";
      read SHOPIFY_STORE;
    fi
fi

if [ -z ${API_PASSWORD+x} ]; then
    if ! [ -z ${config_production_password+x} ]; then
      API_PASSWORD="$config_production_password"
    else
      printf "Hmm... I don't see an API Password here - please enter the API Password from the Shopify Private App used for development.\n";
      read API_PASSWORD;
    fi
fi

if [ -z ${API_KEY+x} ]; then
    if ! [ -z ${config_production_api_key+x} ]; then
      API_KEY="$config_production_api_key"
    else
      printf "Hmm... I don't see an API Key here - please enter the API Key from the Shopify Private App used for development.\n";
      read API_KEY;
    fi
fi

# Make sure NPM is installed
echo "Checking to see if NPM is available.."
if [ ! -x "$(command -v npm)" ]; then
  echo "npm must be available"
  exit 1;
fi

npm set progress=false

# Install dependencies via NPM 
echo -e "\nInstalling node modules..\n"
if [ ! -d "node_modules" ]; then
  npm i --quiet
fi

# Makes sure that themekit is installed
echo -e "\nDownloading themekit..\n"
download_themekit

# Get all active themes
echo "Getting information on current themes...\n"
ALL_THEMES_JSON="$(
  request \
    "$API_KEY" \
    "$API_PASSWORD" \
    "$SHOPIFY_STORE/admin/themes.json" \
    "GET"
)"

# Parse out JSON and turn it into a nice clean string
# with following format: <id>:<role>,<id>:<role>
ALL_THEMES_STRING=$(get_all_themes_from_json "$ALL_THEMES_JSON")

echo "Establishing which theme we should push code to...\n"
if [ "$CURRENT_BRANCH" = 'master' ]; then
  if [ -z ${LIVE_THEME+x} ]; then
      if ! [ -z ${config_production_theme_id+x} ]; then
        LIVE_THEME="$config_production_theme_id"
      else
        printf "Hmm... I don't see a ID for the production theme. What's the production theme ID?\n";
        read LIVE_THEME;
      fi
  fi
  THEME_TO_DEPLOY_TO="$LIVE_THEME"
  THEME_NAME_PREFIX="LIVE"
else
  if [ -z ${STAGING_THEME+x} ]; then
    if ! [ -z ${config_staging_theme_id+x} ]; then
      STAGING_THEME="$config_staging_theme_id"
    else
      printf "Hmm... I don't see a ID for the staging theme. What's the staging theme ID?\n";
      read STAGING_THEME;
    fi
  fi
  THEME_TO_DEPLOY_TO="$STAGING_THEME"
  THEME_NAME_PREFIX="STAGING"
fi

if ! [ "$THEME_TO_DEPLOY_TO" ]; then
  echo -e "\nNo theme found!!"
fi

# Create an empty yaml file if doesn't exit
if ! [ -f "config.yml" ]; then
  echo "Setting temporary config for build purposes"
  create_config_for_build $SHOPIFY_STORE $API_KEY $API_PASSWORD $THEME_TO_DEPLOY_TO
fi

# Build current theme
echo "Building theme...\n"
npm run build

# Deploy current theme
echo "Uploading theme to shopify...\n"
upload_theme "$THEME_TO_DEPLOY_TO" "dist"

# change theme name
if ! [ -z ${THEME_TO_DEPLOY_TO+x} ]; then
  echo "Updating theme name"
  NEW_THEME_JSON="$(
    request \
      "$API_KEY" \
      "$API_PASSWORD" \
      "$SHOPIFY_STORE/admin/themes/$THEME_TO_DEPLOY_TO.json" \
      "PUT" \
      "{\"theme\": {\"name\": \"$THEME_NAME_PREFIX $THEME_NAME\"} }"
  )"
fi

echo -e "\nAll done!!"
