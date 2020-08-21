#!/usr/bin/env bash

# Build the front-end packages ready

# This should be moved into devkit at some point as a library builder

# Script folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
STRATOS="`cd "${DIR}/..";pwd`"

# Colours
CYAN="\033[96m"
YELLOW="\033[93m"
RED="\033[91m"
RESET="\033[0m"
BOLD="\033[1m"

BUILD="false"
PUBLISH="false"
UNPUBLISH="false"
LINK="false"
INSTALL_LINKS="false"

function show_help() {

  echo
  echo -e "${CYAN}${BOLD}ngbuild - tool to help build Stratos as packages${RESET}"
  echo
  echo -e "Run with: ${BOLD}build/ngbuild.sh <Flags> <Packages>${RESET}"
  echo
  echo "Flags can be:"
  echo
  echo "  -b Build packages"
  echo "  -p Publish packages to npm"
  echo "  -u Unpublish packages from npm"
  echo "  -l Link packages using npm link"
  echo "  -i Install linked packages into node_modules"
  echo
  echo "With no packages specified, all are used, otherwise you can specify one or more of:"
  echo "  core"
  echo "  store"
  echo "  devkit"
  echo "  theme"
  echo "  shared"
  echo
}

while getopts "hbpuli" opt; do
  case $opt in
    h)
      show_help
      exit 0
      ;;
    b)
      BUILD="true"
      ;;
    p)
      PUBLISH="true"
      ;;
    u)
      UNPUBLISH="true"
      ;;
    l)
      LINK="true"
      ;;
    i)
      INSTALL_LINKS="true"
      ;;
  esac
done

shift $(expr $OPTIND - 1 )

PKGS="$@"
if [ -z "$PKGS" ]; then
  PKGS="shared store devkit theme core"
fi

echo -e "${CYAN}${BOLD}=============================${RESET}"
echo -e "${CYAN}${BOLD}= Building Stratos packages =${RESET}"
echo -e "${CYAN}${BOLD}=============================${RESET}"

# ===================================================================================================
# Store
# ===================================================================================================

function build_store() {
  echo
  echo -e "${YELLOW}${BOLD}= Package: @stratosui/store${RESET}"
  echo

  ng build store

  rm -rf ${STRATOS}/npm_pkg/store
  cp -r ${STRATOS}/dist/store ${STRATOS}/npm_pkg

  # Patch version number
  jq '.version = "'${VERSION}'"' ${STRATOS}/npm_pkg/store/package.json > ${STRATOS}/npm_pkg/store/package.json.up
  # Remove script
  jq '.scripts = {}' ${STRATOS}/npm_pkg/store/package.json.up > ${STRATOS}/npm_pkg/store/package.json
}

# ===================================================================================================
# Shared
# ===================================================================================================

function build_shared() {
  echo
  echo -e "${YELLOW}${BOLD}= Package: @stratosui/shared${RESET}"
  echo

  ng build shared

  rm -rf ${STRATOS}/npm_pkg/shared
  cp -r ${STRATOS}/dist/shared ${STRATOS}/npm_pkg

  # Patch version number
  jq '.version = "'${VERSION}'"' ${STRATOS}/npm_pkg/shared/package.json > ${STRATOS}/npm_pkg/shared/package.json.up
  # Remove script
  jq '.scripts = {}' ${STRATOS}/npm_pkg/shared/package.json.up > ${STRATOS}/npm_pkg/shared/package.json
  rm ${STRATOS}/npm_pkg/shared/package.json.up

  # Need to copy other files - sass files for shared
  cp -r ${STRATOS}/src/frontend/packages/shared/sass ${STRATOS}/npm_pkg/shared/sass
}

# ===================================================================================================
# Theme
# ===================================================================================================

function build_theme() {
  echo
  echo -e "${YELLOW}${BOLD}= Package: @stratosui/theme${RESET}"
  echo

  ng build theme

  rm -rf ${STRATOS}/npm_pkg/theme
  cp -r ${STRATOS}/dist/theme ${STRATOS}/npm_pkg

  # Patch version number
  jq '.version = "'${VERSION}'"' ${STRATOS}/npm_pkg/theme/package.json > ${STRATOS}/npm_pkg/theme/package.json.up
  mv ${STRATOS}/npm_pkg/theme/package.json.up ${STRATOS}/npm_pkg/theme/package.json
}

# ===================================================================================================
# Devkit
# ===================================================================================================

function build_devkit() {
  echo
  echo -e "${YELLOW}${BOLD}= Package: @stratosui/devkit${RESET}"
  echo

  npm run build-devkit

  rm -rf ${STRATOS}/npm_pkg/devkit
  cp -r ${STRATOS}/dist-devkit ${STRATOS}/npm_pkg/devkit

  # Patch version number
  jq '.version = "'${VERSION}'"' ${STRATOS}/npm_pkg/devkit/package.json > ${STRATOS}/npm_pkg/devkit/package.json.up
  jq '.scripts = {}' ${STRATOS}/npm_pkg/devkit/package.json.up > ${STRATOS}/npm_pkg/devkit/package.json
  rm ${STRATOS}/npm_pkg/devkit/package.json.up
}

# ===================================================================================================
# Core
# ===================================================================================================

function build_core {
  echo
  echo -e "${YELLOW}${BOLD}= Package: @stratosui/core${RESET}"
  echo

  rm -rf ${STRATOS}/npm_pkg/core
  mkdir -p ${STRATOS}/npm_pkg/core
  cp -r ${STRATOS}/src/frontend/packages/core/ ${STRATOS}/npm_pkg

  # Some files/folder we don't need
  rm -rf ${STRATOS}/npm_pkg/core/test-framework
  rm -rf ${STRATOS}/npm_pkg/core/tsconfig.spec.json
  rm -rf ${STRATOS}/npm_pkg/core/tsconfig.lib.json

  # Patch version
  jq '.version = "'${VERSION}'"' ${STRATOS}/npm_pkg/core/package.json > ${STRATOS}/npm_pkg/core/package.json.up
  mv ${STRATOS}/npm_pkg/core/package.json.up ${STRATOS}/npm_pkg/core/package.json

  # # Need to copy other files - sass files for shared
  # cp -r ${STRATOS}/src/frontend/packages/shared/sass ${STRATOS}/npm_pkg/shared/sass
}

echo -e "${CYAN}${BOLD}Packages: $PKGS${RESET}"
VERSION=$(cat "${STRATOS}/package.json" | jq -r .version)
echo -e "${CYAN}Current version: ${BOLD}${VERSION}${RESET}"

if [ ${BUILD} == "true" ]; then
  echo
  echo -e "${CYAN}${BOLD}Building packages to ${STRATOS}/npm_pkg${RESET}"
  mkdir -p ${STRATOS}/npm_pkg
  for pkg in $PKGS
  do
    BUILD_TARGET="build_$pkg"
    $BUILD_TARGET
  done
fi
<!--- Provide a general summary of your changes in the Title above -->
a
## Description
<!--- Describe your changes in detail -->

## Motivation and Context
<!--- Why is this change required? What problem does it solve? -->
<!--- If it fixes an open issue, please link to the issue here. -->

## How Has This Been Tested?
<!--- Please describe in detail how you tested your changes. -->
<!--- Include details of your testing environment, tests ran to see how -->
<!--- your change affects other areas of the code, etc. -->

## Types of changes
<!--- What types of changes does your code introduce? Put an `x` in all the boxes that apply: -->
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Docs update
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Checklist:
<!--- Go over all the following points, and put an `x` in all the boxes that apply. -->
<!--- If you're unsure about any of these, don't hesitate to ask. We're here to help! -->
- [ ] My code follows the code style of this project.
- [ ] My change requires a change to the documentation.
- [ ] I have updated the documentation accordingly.
- [ ] I have followed the guidelines in CONTRIBUTING.md, including the required formatting of the commit message
if [ "${UNPUBLISH}" == "true" ]; then
  for PKG in "$PKGS"
  do
    echo
    echo -e "${YELLOW}${BOLD}= Unpublishing package: @stratosui/${PKG}${RESET}"
    echo    
    npm unpublish "@stratosui/${PKG}@${VERSION}"
  done
fi
 
if [ ${PUBLISH} == "true" ]; then
  echo
  echo -e "${CYAN}${BOLD}Publishing packages to npm${RESET}"
  echo

  for PKG in $PKGS
  do
    echo
    echo -e "${YELLOW}${BOLD}= Publishing package: @stratosui/${PKG}${RESET}"
    echo    
    pushd ${STRATOS}/npm_pkg/$PKG > /dev/null
    npm publish --access public
    popd > /dev/null
  done
fi

# Run npm link
if [ ${LINK} == "true" ]; then
  echo
  echo -e "${CYAN}${BOLD}Linking packages${RESET}"
  echo

  for PKG in $PKGS
  do
    echo -e "${YELLOW}${BOLD}= Linking package: @stratosui/${PKG}${RESET}"
    pushd ${STRATOS}/npm_pkg/$PKG > /dev/null
    npm link
    popd > /dev/null
  done
fi

# Run npm link for each of the packages to install them in the node_modules folder
if [ ${INSTALL_LINKS} == "true" ]; then
  echo
  echo -e "${CYAN}${BOLD}NPM Linking packages${RESET}"
  echo

  for PKG in $PKGS
  do
    echo -e "${YELLOW}${BOLD}= NPM Linking package: @stratosui/${PKG}${RESET}"
    npm link @stratosui/${PKG}
  done
fi


