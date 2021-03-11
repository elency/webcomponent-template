#!make

# SETTINGS
MAKEFLAGS += --silent # Hey make, please shut up !
.DEFAULT_GOAL := help # default command if unset on makefile's call
_HELP_TAB_SIZE = 20 # tab size when displaying help

_ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# COLORS VARS
_BLACK=$(shell tput setaf 0)
_RED=$(shell tput setaf 1)
_GREEN=$(shell tput setaf 2)
_YELLOW=$(shell tput setaf 3)
_BLUE=$(shell tput setaf 4)
_MAGENTA=$(shell tput setaf 5)
_CYAN=$(shell tput setaf 6)
_WHITE=$(shell tput setaf 7)

_BG_BLACK=$(shell tput setab 0)
_BG_RED=$(shell tput setab 1)
_BG_GREEN=$(shell tput setab 2)
_BG_YELLOW=$(shell tput setab 3)
_BG_BLUE=$(shell tput setab 4)
_BG_MAGENTA=$(shell tput setab 5)
_BG_CYAN=$(shell tput setab 6)
_BG_WHITE=$(shell tput setab 7)

_BOLD=$(shell tput bold)

_RESET=$(shell tput sgr0)

##@ Helpers

.PHONY: help clean clean_doc clean_build clean_dist clean_coverage

help: ## Display this help
	echo "${_YELLOW}command list$(_RESET)"
	awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-$(_HELP_TAB_SIZE)s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

clean_doc: ## Clean doc directory
	mkdir -p doc
	rm -rf doc/*

clean_build: ## Clean build directory
	mkdir -p build
	rm -rf build/*

clean_dist: ## Clean distribution directory
	mkdir -p dist
	rm -rf dist/*

clean_public: ## Clean public directory
	mkdir -p public
	rm -rf public/*

clean_tmp: ## Clean temporary directory
	mkdir -p tmp
	rm -rf tmp/*

clean_screenshot: ## Clean screenshot directory
	mkdir -p screenshot
	rm -rf screenshot/*

clean_coverage: ## Clean build directory
	mkdir -p coverage
	rm -rf coverage/*

clean: ## Clean
	make clean_doc
	make clean_build
	make clean_dist
	make clean_public
	make clean_coverage
	make clean_tmp
	make clean_screenshot

##@ Typescript

.PHONY: lint build doc show-doc

lint: ## Lint
	npx wotan -p tsconfig.json

build: clean_build clean_dist ## Build
	npx tsc --build tsconfig.json
	cp ./website/* ./build
	rm ./dist/tsconfig.*

doc: clean_doc ## Generate typescript documentation
	npx typedoc --tsconfig ./src/tsconfig.dist.json

show-doc: ## Show typescript documentation
	xdg-open doc/index.html

##@ NPM dependencies management

.PHONY: install update

install: ## Install dependancies
	npm install

update: ## Update dependancies
	npx ncu -u && npm install

##@ Development

.PHONY: watch serve

watch: build ##
	npx onchange 'src/*' 'website/*' -- make build

serve: build ##
	npx concurrently "npx onchange 'src/*' 'website/*' -- make build" "npx aliv"

##@ Tests

.PHONY: test unit-test e2e-test

test: unit-test e2e-test ## Launch all tests

unit-test: ## Launch unit tests
	echo "no unit test currently"

e2e-test: clean_screenshot ## Launch e2e tests
	echo "process.exit(0);" | INDENT=true node -r ts-node/register ./test/end2end/*.spec.ts | npx tap-mocha-reporter spec
