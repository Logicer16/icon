<h1 align="center">
<img width="50%" src="https://github.com/Logicer16/icon/raw/main/icon%20rainbow.svg">
<br>
Logicer's Icon Generator
</h1>

[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/Logicer16/icon/publish.yml)](https://github.com/Logicer16/icon/actions)
[![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/Logicer16/icon)](https://github.com/Logicer16/icon/graphs/contributors)
[![Type Coverage](https://img.shields.io/badge/dynamic/json.svg?label=type%20coverage&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2FLogicer16%2Ficon%2Fmain%2Fpackage.json)](https://github.com/plantain-00/type-coverage)

Generate variations of [Logicer](https://github.com/Logicer16)'s icon in formats, sizes, and colours of your choice.

Designed to be deployed on GitHub Pages.

[Go to the site](https://icon.logicer.cc/)

## Install

If you're seeing this, you've probably already done this step. Congrats!

```bash
git clone https://github.com/Logicer16/icon
cd icon
pnpm install
```

## Building

To build a production version:

```bash
pnpm build
```

To preview this build:

```bash
pnpm preview
```

To automatically open a browser once the server has successfully started:

```bash
pnpm preview:open
```

## Debugging

To start a development server:

```bash
pnpm dev
```

To automatically open a browser once the server has successfully started:

```bash
pnpm dev:open
```

## Deploy

GitHub Actions will automatically deploy change on each commit to main
