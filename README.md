# Astro Starter Kit: Minimal

```sh
bun create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 🚀 Deploying

Deployment is automated via [.github/workflows/deploy.yml](./.github/workflows/deploy.yml):

1. Every push to `main` (or a manual run from the Actions tab) builds the site with `bun run build`.
2. The `dist/` output is force-pushed to the `publish` branch — that branch contains only the built site.
3. GitHub Pages is configured to serve from the root of the `publish` branch, so the site goes live at <https://pritam-dey3.github.io/alo-wedding-card/> shortly after.

The workflow sets `SITE_BASE=/alo-wedding-card/` when building so asset URLs work under the project Pages URL. Local development is unaffected — without the env var, `base` defaults to `/`.

To serve from a custom domain instead:

- In the workflow, set `SITE_URL` to the domain and `SITE_BASE` to `/`.
- Add your domain under **Settings → Pages → Custom domain** (drop a `CNAME` file into the `publish` branch or manage it in the repo settings).

> Note: the first run needs the `gh api` step to enable Pages. If you've previously switched Pages to "GitHub Actions" mode, set **Settings → Pages → Source** to **Deploy from a branch** and pick `publish` / `/(root)` once.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
