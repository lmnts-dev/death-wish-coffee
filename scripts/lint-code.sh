#!/bin/bash

####################################################################
## This script is responsible for performing linting and syntax
## checks on js, css, and php files.
##
## - PHP: uses php-cli and checks all php files changed since master
## - CSS: uses stylelint with stylelint-config-standard config
## - JS : uses standardjs for code style enforcement
## - ECL: uses editorconfig to check that files match the rules
## - BUILD: uses node to install and run theme build process
##
## Note: Tests can be run locally by running `npm test` command.
##
####################################################################

# Terminal colors
DEFAULT=$(tput setaf 7 -T xterm)
RED=$(tput setaf 1 -T xterm)
GREEN=$(tput setaf 2 -T xterm)
YELLOW=$(tput setaf 3 -T xterm)
BLUE=$(tput setaf 4 -T xterm)
OK="${GREEN}OK${DEFAULT}"

# echo "${YELLOW}Performing PHP syntax check...${DEFAULT}"
# git diff --diff-filter=ACMR --name-only origin/master -- '*.php' | xargs -L1 php -d short_open_tag=Off -l
# if [[ "$?" -ne 0 ]]; then
#     echo "${RED}PHP syntax check failed!${DEFAULT}"
#     exit 1
# fi
# echo $OK

echo "${YELLOW}Installing dependencies...${DEFAULT}"
npm ci --loglevel=silent
if [[ "$?" -ne 0 ]]; then
    echo "${RED}Dependency installation failed!${DEFAULT}"
    exit 2
fi
echo $OK

echo "${YELLOW}Testing js against eslint configs...${DEFAULT}"
npm run test-js

if [[ "$?" -ne 0 ]]; then
    echo "${RED}Conformance to eslint failed!${DEFAULT}"
    exit 3
fi
echo $OK

echo "${YELLOW}Testing css against stylelint...${DEFAULT}"
npm run test-css
if [[ "$?" -ne 0 ]]; then
    echo "${RED}Conformance to stylelint failed!${DEFAULT}"
    exit 4
fi
echo $OK

echo "${GREEN}Code has passed all linting tests successfully!${DEFAULT}"
exit 0
