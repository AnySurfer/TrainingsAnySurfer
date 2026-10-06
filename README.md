# Installation and prerequisites

## Prerequisites

- **Node.js**, install via https://nodejs.org .
- **Git** to clone the repository.

## Installation

1. Clone the repository and open a terminal in the project root.

2. Install dependencies from the lockfile:

   ```sh
   npm i
   ```

3. Start the development server in the background:

   ```sh
   npm run dev
   ```

   The site is available at `http://localhost:4321` by default.

# Deployments

- `.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`.
- `.github/workflows/deploy-ionos.yml` builds the site and uploads `dist/`
  to IONOS on every push to `release` or a `release/*` branch
  (for example, `release/1.0`, including nested branches).
- The same workflow deploys `projet/*` branches to an IONOS subdirectory
  named after the project, creating it automatically if needed.
  For example, `projet/sncb` publishes to `${IONOS_FTP_SERVER_DIR}sncb/`.
  Project names must start with a letter or digit and contain only ASCII
  letters, digits, hyphens, or underscores, with no nested branches.

Each workflow can also be triggered manually on its allowed branches.
All release branches publish to the same IONOS directory, without concurrent
transfers. The Astro configuration adapts URLs to the target: the repository
prefix for GitHub Pages, and `SITE_URL` and `BASE_PATH` for IONOS.
For project branches, the project name is also appended to `BASE_PATH`:
`projet/sncb` uses `/sncb/` by default, or `/intro/sncb/` if `BASE_PATH=/intro/`.
Release and project deployments share the same configuration and run without
concurrent transfers.

## IONOS configuration

In the GitHub repository's **Settings → Secrets and variables → Actions**, add:

| Type              | Name                   | Value                                                                                                                                                   |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secret            | `IONOS_FTP_SERVER`     | SFTP hostname provided by IONOS, without a protocol or path                                                                                             |
| Secret            | `IONOS_FTP_USERNAME`   | SFTP account username                                                                                                                                   |
| Secret            | `IONOS_FTP_PASSWORD`   | SFTP account password                                                                                                                                   |
| Variable          | `IONOS_FTP_SERVER_DIR` | Site directory as seen from the FTP account, with a trailing `/` (for example, `./intro/`, or `./` if the account already points to the site directory) |
| Optional variable | `IONOS_FTP_PORT`       | Defaults to `22` (SFTP)                                                                                                                                 |
| Optional variable | `SITE_URL`             | Public site URL, for example, `https://formation.example.org`                                                                                           |
| Optional variable | `BASE_PATH`            | Public path if the site is in a subdirectory, for example, `/intro/`; defaults to `/`                                                                   |

The IONOS domain must point to the selected destination directory.
The FTP path and the public path are separate: an FTP directory of `./intro/`
can correspond to the domain root `/`.

Use `IONOS_FTP_SERVER_DIR=./` to publish to the SFTP account's login directory.
The workflow also interprets `/` as `./` to avoid creating project directories
at the server root: with `projet/stib`, the destination will be `./stib/`.
Other absolute paths remain unchanged and must point to a writable directory.

Deployment uses **SFTP on port 22**, through `lftp`. FTPS is a different protocol
and does not work on this port. The `IONOS_FTP_*` names are retained to reuse
existing secrets.

The transfer adds and replaces build files without deleting other files
on the server.

Values from the local `.env` file are not passed to GitHub Actions:
configure secrets and variables in the repository settings.

# Commands

Run all commands from a terminal in the project root:

| Command                       | Action                                                                    |
| ----------------------------- | ------------------------------------------------------------------------- |
| `npm ci`                      | Installs dependencies from the lockfile                                   |
| `npm run dev -- --background` | Starts the local development server in the background at `localhost:4321` |
| `npm run astro -- dev status` | Checks the background development server's status                         |
| `npm run astro -- dev logs`   | Shows the background development server's logs                            |
| `npm run astro -- dev stop`   | Stops the background development server                                   |
| `npm run build`               | Builds the production site in `./dist/`                                   |
| `npm run preview`             | Previews the production build locally before deployment                   |

# Documentation

See the [Astro documentation](https://docs.astro.build).
