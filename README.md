# <img src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-golden-giraffes/assets/33956381/02ac039f-67da-4aeb-a7be-c0363fee3917" width="23" height="23" /> Blurple Canvas Web

A [SOFTENG 750](https://courseoutline.auckland.ac.nz/dco/course/SOFTENG/750) project, by Team Golden Giraffes

> [!IMPORTANT]
> Blurple Canvas Web is under development. It’s not even in alpha yet.

Blurple Canvas Web is a web alternative to the [Blurple Canvas](https://github.com/Rocked03/Blurple-Canvas) Discord bot with (hopefully, eventually) a couple extra bells and whistles.

## 🥪 Tech stack & logistics

This is a [monorepo](https://monorepo.tools), with three packages:

- **[@blurple-canvas-web/backend](/packages/backend#readme)**: The [Node](https://nodejs.org)–[Express](https://expressjs.com) back-end server
- **[@blurple-canvas-web/frontend](/packages/frontend#readme)**: The [React](https://react.dev) front-end
- **[@blurple-canvas-web/types](/packages/types#readme)**: Where [TypeScript](https://www.typescriptlang.org) types shared by the front- and back-end live

## 🌱 Getting started

We suggest opening this project as a Visual Studio Code [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces): just open the [`blurple-canvas-web.code-workspace`](/blurple-canvas-web.code-workspace) file. The workspace is configured to use the right linter and formatter, and recommends a few extensions. But, you’re welcome to use your preferred editor.

> [!NOTE]
> Windows users, the instructions below assume you use [WSL](https://learn.microsoft.com/en-us/windows/wsl). You’re welcome to use PowerShell—things still work—but you’ll have to “translate” these steps for yourself.

### ☑️ Prerequisites

**Install [Node Version Manager](https://github.com/nvm-sh/nvm).** If you don’t use Homebrew, see [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) for other ways to install.

```sh
brew install nvm
```

**Use the appropriate version of Node.** You may be prompted to run `nvm install`.

```sh
nvm use
```

**Enable [Corepack](https://nodejs.org/api/corepack.html).** We recommend using Corepack to manage your pnpm version, but if you’d prefer installing pnpm a different way, [go ahead](https://pnpm.io/installation).

```sh
corepack enable pnpm
```

### 🚀 Build and deploy

**Install dependencies.** Run this from the monorepo root, and it will install dependencies for all packages.

```sh
pnpm install
```

**Deploy!** Run these in separate terminals.[^filter] Things will hot-reload as you make changes.

[^filter]: You can also use `-F` instead of `--filter`.

```sh
# Start the back-end
pnpm --filter backend dev
```

```sh
# Start the front-end
pnpm --filter frontend dev
```

## 🤓 Contributors

- Aaron Guo
- Emily Zou
- Henry Wang
- Jasper Lai
- Josh Jeffers
- Samuel Ou

![](./group-image/Golden%20Giraffes.webp)

## 📜 Licence

We’ll open source this at some point—probably after deadline—we just haven’t decided on a licence yet. Will likely end up being MIT.
