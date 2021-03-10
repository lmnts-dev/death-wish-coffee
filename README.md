# Shopify Base Theme
See package.json for theme version.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Developing](#developing)
2. [Deploying](#deploying)
3. [Pre-requisites](#pre-requisites)
4. [Misc](#misc)

For contributing process and guidelines, check CONTRIBUTING.md.

## Getting Started

#### Get API Key and Password
* If you're jumping on a project, please ask the lead developer and/or producer for the credentials of the development private app.
* If you're starting on a project, please follow the steps described [here|(https://shopify.github.io/themekit/#get-api-access)] to create a new private app and retrieve from it the API key and password.

#### Edit Config File
* Duplicate `config-example.yml` and rename it to `config.yml`
* Open `config.yml`
* For each of your environments `development`, `staging` and `production`:
** Set the credentials for `api_key` and `password` based on the private app generated in the previous step
** Set the store url for `store`
** Set the theme id for `theme_id`
** (Optional) If there are some files that should remain untouched and not uploaded to your theme, add `ignore_files` to your environment config. e.g. `ignore_files: - config/settings_data.json` 

The `config.yml` should look similar to:
```
production:
	theme_id: 12345678901
	api_key: 4636bc042223f53fa4e79c77bf810ea6
	password: bb1c31588ca73c6096d6b60a045e6919
	store: my-store.myshopify.com
	ignore_files:
	- config/settings_data.json
staging:
	theme_id: 12345678902
	api_key: 4636bc042223f53fa4e79c77bf810ea6
	password: bb1c31588ca73c6096d6b60a045e6919
	store: my-store.myshopify.com
development:
	theme_id: 12345678903
	api_key: 4636bc042223f53fa4e79c77bf810ea6
	password: bb1c31588ca73c6096d6b60a045e6919
	store: my-store.myshopify.com

```

## Developing

#### Installing dependencies
Open up a terminal window, navigate to the theme root folder and run `npm i` to install all the dependencies referencered in `package.json`.

#### Start development
Open up a terminal window, navigate to the theme root folder and run `npm start`. This will compile, watch and hot reload your javascript and css. It'll also lint your js using [standardjs](https://standardjs.com/) best practices. If you make a change to a file that needs to be uploaded to Shopify, the process will handle it and reload your browser once it's been uploaded. 

Note: In your Shopify Theme Settings, there is a setting called *Access site through BrowserSync?*, under the Dev, Logo, Favicon section. Make sure that this option is checked for your development themes, unchecked for your staging and production themes. 

## Deploying
There are build scripts provided in the `package.json` that will build and deploy theme code directly to Shopify. All scripts can be run via `npm run <scriptName>`, with the exception of `npm start`. The build scripts are:
* `npm run development`
* `npm run staging`
* `npm run production`

Each of the scripts reference a different environment as defined in your `config.yml` file. The tasks will review your Git tree and only upload the files that have changed since your last deployment. CSS and Javascript will always be deployed. 

## Misc

#### Using Liquid in CSS and JS
It is possible to use Shopify's Liquid templating language in your CSS and Javascript. However, for most custom builds we do, we don't generally need this functionality outside of our markup.If you choose to use Liquid in your asset files, be aware that some features of this base theme may be unusable to you and the liquid syntax may cause build errors.
