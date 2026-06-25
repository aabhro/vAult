# vAult

<img width="1366" height="658" alt="vAult hero" src="https://github.com/user-attachments/assets/4b6f3d04-42db-419f-9ad8-78bb7777aa79" />
<img width="1366" height="659" alt="vAult search" src="https://github.com/user-attachments/assets/3f0855d5-c6fb-468a-a046-17414db88739" />
<img width="1366" height="656" alt="vAult player" src="https://github.com/user-attachments/assets/02d166cd-5162-4018-a903-077bf2758499" />

## Overview

vAult is a lightweight, client-side web application for discovering and streaming movies, TV shows, and anime. Built entirely with vanilla HTML, CSS, and JavaScript, it requires no frameworks or external dependencies. Content metadata is sourced from TMDB, while your watchlist and viewing history are stored securely in your browser's localStorage.

The application provides a seamless experience for browsing trending content, searching across media types, filtering by genre, and switching between multiple playback sources without leaving the interface.

## Features

* Trending content discovery with day and week views
* Unified search across movies, television shows, and anime
* Genre-based filtering and discovery
* Persistent watchlist and viewing history saved locally
* Multiple playback sources with on-the-fly switching
* Anime-specific support via Jikan integration for subtitle and dubbing preferences
* Clean URL structure with Apache-based routing
* Intelligent caching and header optimization
* Custom error pages for improved user experience

## Getting Started

### Local Development

To run vAult locally, you have two options.

**Python HTTP Server** (for quick testing)

```bash
cd htdocs
python -m http.server 8080
```

Then visit:
* http://localhost:8080/ (landing page)
* http://localhost:8080/vault/ (main application)

Note that Apache-specific features such as clean URL rewriting and cache headers will not function with this method.

**Apache Server** (recommended for full functionality)

Configure Apache with the `vault/htdocs` directory as your DocumentRoot. This enables:
* Clean URLs without .html extensions
* Cache control headers
* Custom error pages

## Configuration

### TMDB API Key

vAult requires a TMDB API key for content metadata. Update the `TMDB_KEY` constant in both locations:

1. `htdocs/index.html` (for landing page backdrops and search)
2. `htdocs/vault/app.js` (for the main application)

You can obtain a free API key from your TMDB account settings.

### Application Settings

Runtime configuration is managed through `htdocs/vault/config.js`. The following options are available:

* `defaultServer`: Sets the default playback source ID
* `maintenance`: Toggles maintenance mode display
* `heroOverride`: Specifies a custom featured content ID
* `heroType`: Sets the type of featured content (movie or show)
* `notification`: Displays an optional announcement message

## Project Structure

```
vault/
├── README.md
├── LICENSE
└── htdocs/
    ├── .htaccess
    ├── index.html
    ├── app.js
    ├── elements.css
    ├── err/
    │   ├── 400.html
    │   ├── 401.html
    │   ├── 403.html
    │   ├── 404.html
    │   └── 503.html
    └── vault/
        ├── index.html
        ├── app.js
        ├── config.js
        ├── style.css
        ├── watchlist.html
        ├── history.html
        ├── settings.html
        ├── contact.html
        └── vault-logo.png
```

## Data Storage

vAult uses browser localStorage to maintain user data between sessions.

* Watchlist data is stored under the key `vault_watchlist`
* Viewing history is stored under the key `vault_history`

Both datasets persist until the user clears their browser's site data or storage explicitly. No server-side storage is involved.

## Deployment

vAult is a fully static web application and can be deployed to any hosting platform that serves HTML, CSS, and JavaScript files.

**Apache Hosting**: Provides the optimal experience with full support for clean URL rewriting, cache headers, and custom error pages via the included .htaccess file.

**Other Platforms**: The application functions on static hosting services, though you should link to explicit .html pages or configure platform-specific URL rewriting to replicate the clean URL behavior.

## Troubleshooting

**Blank poster images or missing metadata**

Verify that your TMDB API key is valid and not being blocked by your browser or network. Check the browser console for any API errors.

**Clean URLs returning 404 errors**

This occurs when running outside of Apache with mod_rewrite enabled. Ensure your server has the .htaccess file configured and that rewrite rules are active.

**Playback not loading**

Embed providers may be region-restricted or temporarily unavailable. Try switching to an alternative playback source through the application settings.

## Technology

vAult is built with:
* HTML (47.7% of codebase)
* JavaScript (41.3% of codebase)
* CSS (11% of codebase)

The application contains no external dependencies and runs entirely in the browser.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Disclaimer

vAult integrates with third-party services and embed providers. Users are responsible for complying with the terms of service of TMDB, any playback providers enabled in the application, and their hosting platform. Use responsibly and ensure compliance with all applicable agreements and regulations.
