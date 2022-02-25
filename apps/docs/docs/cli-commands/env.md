---
sidebar_position: 2
---

# env

The `env` command is a proxy to the Architect env command. However, it scrubs the output to prevent leaking keys.

## Usage

```sh
npx @calatrava/cli env
```

or

```sh
npm run env
```

## Options

No options are currently supported since you would need to leak a key to set one anyway.

We plan on supporting a hidden input field to solve that problem. [link to issue goes here]
