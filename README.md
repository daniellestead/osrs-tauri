# OSRS Tracker

![Version](https://img.shields.io/github/v/release/daniellestead/osrs-tauri)

A desktop application for tracking OSRS player stats, skill goals, and rare drop collections. Built with Tauri, React, and TypeScript.

## Download

Download the latest release for your platform:

- **Windows**: `.exe` or `.msi` installer
- **macOS**: `.dmg` or `.app`

[Download Latest Release](https://github.com/daniellestead/osrs-tauri/releases)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/daniellestead/osrs-tauri.git
    cd osrs-tauri
    ```

2. Install frontend dependencies:

    ```bash
    cd src
    npm install --legacy-peer-deps
    ```

3. Run the development server:

    ```bash
    cd ..
    cargo tauri dev
    ```

The app will open automatically with hot-reload enabled.

## Building

### Local Build

Build for your current platform:

```bash
cargo tauri build
```

Artifacts will be in `src-tauri/target/release/bundle/`

### Cross-Platform Builds

The project uses GitHub Actions to build for all platforms:

1. Update the version in the tauri.conf.json.

2. Push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically build:

- Windows installers (.exe, .msi)
- macOS bundles (.dmg, .app)

1. Releases are published at: `https://github.com/daniellestead/osrs-tauri/releases`

## API

The app uses the official [Old School RuneScape Hiscores API](https://secure.runescape.com/m=hiscore_oldschool/). No authentication required. All requests are made from the Rust backend for CORS compatibility.

---

**Note**: This is an unofficial third-party tool and is not affiliated with or endorsed by Jagex Ltd.

## Features to add

- Group tasks/drops []
- Add task/drop dependencies []
- Add tests and better error handling []
