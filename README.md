# cockpit-sample-app

Minimal example of a [Cockpit](https://cockpit-project.org/) tool page: a tab layout, dark/light theme sync with the shell, and a debug tab that spawns `dd` on the managed system to prove `cockpit.spawn()` works end to end.

Feel free to expand from base code to add your functionality and share your projects. Someone might find it interesting and/or useful :)

Requires no build step, compared to official Cockpit template; Just static HTML/CSS/JS dropped into a Cockpit package directory.

## Layout

- `manifest.json` - package metadata, tells the Cockpit shell about this tool
- `index.html` - page markup
- `index.js` - hash routing between tabs + the debug button handler
- `theme.js` - keeps `pf-v6-theme-dark` in sync with the shell's theme, loaded in `<head>` since Cockpit's CSP blocks inline `<script>`
- `index.css`, `cockpit-glue.css` - page-specific styles and the layout glue every embedded Cockpit page needs (no masthead/sidebar of its own)
- `vendor/patternfly/` - vendored PatternFly CSS

## "Installing"

Symlink or copy this directory into `/usr/share/cockpit/cockpit-sample-app` and then reload Cockpit in the browser. You shoul have a new sidebar entry taking you to the app..