# webcomponent-template

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Latest Version @ Cloudsmith](https://api-prd.cloudsmith.io/badges/version/elency/webcomponent/npm/@webcomponent/webcomponent-template/latest/x/?render=true&badge_token=gAAAAABe7MmdjVng7xeqVcz76W8CvPhsNqVsW-2Qdm6TqYuMTkN1pOwQOOUtz0GbUCL4IW_iZkWbQrYaP8IkrFGz2MaA-UFp-cyfXiVUwPkzQEetXGRdXOA%3D)](https://cloudsmith.io/~elency/repos/webcomponent/packages/detail/npm/@webcomponent%252Fwebcomponent-template/latest/)
![release](https://github.com/elency/webcomponent-template/workflows/release/badge.svg)
![test](https://github.com/elency/webcomponent-template/workflows/test/badge.svg)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)

Template for webcomponents

## Installation

### Registry setup

[![Hosted By: Cloudsmith](https://img.shields.io/badge/OSS%20hosting%20by-cloudsmith-blue?logo=cloudsmith&style=flat-square)](https://cloudsmith.com)

Package repository hosting is graciously provided by [Cloudsmith](https://cloudsmith.com).
Cloudsmith is the only fully hosted, cloud-native, universal package management solution, that
enables your organization to create, store and share packages in any format, to any place, with total
confidence.

To use/set the registry as the default for your user, execute the following:

```shell
npm config set '@elency:registry' https://npm.cloudsmith.io/elency/webcomponents/
```

You can set it globally (with permissions) by using the -g argument.

Alternatively, you can add it directly to your user or project `.npmrc` file:

```text
@elency:registry=https://npm.cloudsmith.io/elency/webcomponents/
```

### Install as dev dependency

```shell
npm install --save @evenly/webcomponent-template
```

## Usage

### Load webcomponent

#### With script tag

```html
<head>
    <!-- import component -->
    <script type="module" src="./src/web-component.js"></script>
</head>
```

#### With javascript/typescript import

```typescript
// using named import
import { WebcomponentTemplateElement } from "@evenly/webcomponent-template";

// using default import
import WhatYouWant from "@evenly/webcomponent-template";
```

### HTML

```html
<form action="..." method="...">
    <label>
        foobar
        <webcomponent-template
            id="pin"
            name="verification_code"
        ></webcomponent-template>
    </label>
</form>
```

| Attribute | Description | Allowed values |
| --------: | :---------- | :------------- |
|           |             |                |

### CSS

```css
webcomponent-template:valid {
    background-color: green;
}
webcomponent-template:invalid {
    background-color: red;
}
webcomponent-template:disabled {
    background-color: grey;
}
```

### Typescript

#### Use Element

```typescript
// access custom element
window.customElements.whenDefined("webcomponent-template").then(() => {
    console.log(document.querySelector("webcomponent-template").value);
});
```

#### Properties

| Properties | Description |
| ---------: | :---------- |
|            |             |

#### Methods

| Methods | Description |
| ------: | :---------- |
|         |             |

## Documentation

[open generated typescript documentation](./doc/index.html)

## Development

### Auto test on save

Saving a source or test file will trigger a task (`.vscode/task.json`). To make it possible we use `Trigger Task on Save` extension on VS Code. It's settings are located in `.vscode/settings.json`.

### Local git hooks

Git hooks are available thanks to `git-hooks` npm module. Goal is:

-   to reject not acceptable commit message
-   to prevent committing for failing build
-   to prevent pushing failing unit tests

You can update them in `.githooks`.

### CI

We use github workflows in order to release faster and to improve quality. You can update them in `.github/workflows`.
