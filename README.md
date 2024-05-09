# <img src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-golden-giraffes/assets/33956381/86000a76-a73b-4abe-8c61-05dbfecbec40" width="24" height="24" /> Blurple Canvas Web

## <img src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-golden-giraffes/assets/33956381/02ac039f-67da-4aeb-a7be-c0363fee3917" width="20" height="20" /> Project Blurple

[Project Blurple](https://projectblurple.com) is an annual, week-long, community-run event which celebrates Discord’s anniversary. Part of this is Blurple Canvas where people in participating servers create pixel art on a shared canvas.

Blurple Canvas Web is a web alternative to the [existing Discord bot](https://github.com/Rocked03/Blurple-Canvas) Discord bot, which brings canvas to the web!

If you’d like a bit more context, [we have a wiki!](https://github.com/UOA-CS732-SE750-Students-2024/project-group-golden-giraffes/wiki)

## 🧚 Features

### Viewing canvases

- **View canvases.** View the current canvas (if/when there is an active event), or view archived canvases from past events. Pick which canvas to view from the dropdown in the navbar.
- **Pan and zoom.** Pan around the canvas by dragging, and scroll to zoom.
- **Live updates.** When there’s an ongoing Project Blurple event, the active canvas will update in real time as people place pixels.
- **Pixel history.** Select a pixel to see what colours have been placed there, and who placed it.

### Placing pixels

> [!NOTE]
> Pixel placement is only enabled for canvases that are part of an ongoing Project Blurple event. Once that year’s Project Blurple ends, the canvas is locked.

- **Sign in with Discord.** Anyone can view canvases (no account needed), but you’ll need to sign with Discord to place pixels. (You can also sign out.)
- **View colour palette.** As you switch between events, see the colours which were/are allowed on that canvas.
- **Place pixels.** When there is an active Project Blurple event (and you aren’t in cooldown), you can place pixels on the canvas.
  - **…Or not.** Placing pixels via Blurple Canvas Web can be disabled by unsetting an environment variable when deploying.
- **Bot command.** When you select a pixel and colour, it’ll show the `/place` Discord bot command for placing a pixel—along with a button to copy it.
- **Partnered colours.** Each server participating in Project Blurple gets a _partnered_ pixel colour which can only be used from within that server. For these, Blurple Canvas Web gives a link to join the server.

### Statistics

- **Leaderboard.** View the top 10 participants for each canvas, ranked by the number of pixels they’ve placed on that canvas.
- **User stats.** View your own stats for each canvas, including how you rank against everyone else for that canvas (by pixels placed) and your most frequently used colour—among other details.

## 🥪 Tech stack & repo structure

This is a [monorepo](https://monorepo.tools), with three packages:

- **[@blurple-canvas-web/backend](/packages/backend#readme)**: The [Node](https://nodejs.org)–[Express](https://expressjs.com) back-end server
- **[@blurple-canvas-web/frontend](/packages/frontend#readme)**: The [Next.js](https://nextjs.org) front-end
- **[@blurple-canvas-web/types](/packages/types#readme)**: Where [TypeScript](https://www.typescriptlang.org) types shared by the front- and back-end live

All packages are written in [TypeScript](https://www.typescriptlang.org). **backend** talks to the same [PostgreSQL](http://www.postgresql.org) as the [Blurple Canvas](https://github.com/Rocked03/Blurple-Canvas) Discord bot. [Prisma](https://www.prisma.io) serves as the ORM layer. **frontend** uses [Axios](https://axios-http.com) and [TanStack Query](https://tanstack.com/query) to query the **backend** API. Realtime canvas updates are pushed to clients with [Socket.IO](https://socket.io). Testing is conducted with [Vitest](https://vitest.dev). [GitHub Actions](https://docs.github.com/en/actions) handles CI.

## 🌱 Getting started

> [!TIP]
> We suggest opening this project as a Visual Studio Code [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces): just open the [`blurple-canvas-web.code-workspace`](/blurple-canvas-web.code-workspace) file. The workspace is configured to use the right linter and formatter, and recommends a few extensions. But, you’re welcome to use your preferred editor.

### ☑️ Prerequisites

> [!WARNING]
> Windows users, these instructions assume you use [WSL](https://learn.microsoft.com/en-us/windows/wsl). You’re welcome to use PowerShell—things still work—but you’ll have to “translate” these steps for yourself.

**Install [Node Version Manager](https://github.com/nvm-sh/nvm).** If you don’t use Homebrew, see [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) for other ways to install.

```sh
brew install nvm
```

**Use the appropriate version of Node.** You may be prompted to run `nvm install`. (If for whatever reason you aren’t using nvm, make sure to install _and use_ the Node version specified in [`/.nvmrc`](/.nvmrc).)

```sh
nvm use
```

**Enable [Corepack](https://nodejs.org/api/corepack.html).** We use [pnpm](https://pnpm.io) to manage dependencies. We recommend using Corepack to manage your pnpm version, but if you’d prefer installing pnpm a different way, [go ahead](https://pnpm.io/installation).

```sh
corepack enable pnpm
```

**Verify pnpm is working.** By now the package manager should be good to go. Double check with this command, and make sure it matches the version number specified in the [root manifest file](/package.json).

```sh
pnpm --version
```

### 🤫 Secrets & environment variables

The **[backend](/packages/backend/.env.example)** and **[frontend](/packages/frontend/.env.example)** packages need to have some environment variables set work correctly (in `/packages/backend/.env` and `/packages/frontend/.env`, respectively). Consult the `.env.example` files in each of those packages to see what variables are needed, and contact one of the [contributors](https://github.com/UOA-CS732-SE750-Students-2024/project-group-golden-giraffes/graphs/contributors) if you need any secrets.

### 🚀 Build & deploy

**Install dependencies.** Run this from the monorepo root, and it will install dependencies for all packages.

```sh
pnpm install
```

**Deploy!** With hot-reloading:

```sh
pnpm dev
```

Or without:

```sh
pnpm build && pnpm start
```

If you want to run the front- and back-ends in different terminals[^filter]:

[^filter]: These are shorthand for `pnpm --filter @blurple-canvas-web/backend dev` and `pnpm --filter @blurple-canvas-web/frontend dev`.

```sh
# Start the back-end
pnpm -F backend dev
```

```sh
# Start the front-end
pnpm -F frontend dev
```

## 🤓 Contributors

Blurple Canvas Web started as a [SOFTENG 750](https://courseoutline.auckland.ac.nz/dco/course/SOFTENG/750) project at [Waipapa Taumata Rau](https://www.auckland.ac.nz). We are Team Golden Giraffes.[^teamname]

[^teamname]: Not sure we would’ve chosen this name for ourselves, though…

- Aaron Guo
- Emily Zou
- [Henry Wang](http://henryh.wang)
- [Jasper Lai](https://lai.nz)
- [Josh Jeffers](https://pumbas.net)
- Samuel Ou

![](./group-image/Golden%20Giraffes.webp)

## 💌 Acknowledgements

Blurple Canvas Web wouldn’t exist without these lovely people and projects. Thanks to:

- [Project Blurple](https://projectblurple.com) and the Project Blurple community, for obvious reasons;
- [Rocked03](https://github.com/Rocked03) for creating the [Blurple Canvas](https://github.com/Rocked03/Blurple-Canvas) Discord bot;[^samuel]
- the [Place Atlas Initiative](https://github.com/placeAtlas) for their efforts cataloguing r/Place;
- [Josh Wardle](https://www.powerlanguage.co.uk) and [r/Place](https://www.reddit.com/r/place) participants (no introduction needed); and
- you, for your interest in this project!

[^samuel]: Pretty sure Samuel isn’t happy about me putting him on this list. Tough cookies.&emsp;—Jasper

## 📜 Licence

The code for Blurple Canvas Web is licensed under the [Apache License, Version 2.0](https://github.com/UOA-CS732-SE750-Students-2024/project-group-golden-giraffes?tab=License-1-ov-file#readme).
