# PDF.js Static Assets

This directory is populated at install/build time with the assets that PDF.js needs for reliable text rendering within the Unimog Community Hub PDF viewer.

- `standard_fonts/`: Standard font program files copied from `pdfjs-dist@3.11.174`. These files allow the PDF canvas renderer to embed fallback fonts without relying on external CDNs that are blocked by the current Content Security Policy.
- `cmaps/`: Character map data copied from `pdfjs-dist@3.11.174`. The viewer uses these files to correctly decode embedded fonts and render glyphs.

The contents of these folders are not committed to the repository (to avoid storing large/binary assets). Instead they are copied from `node_modules/pdfjs-dist` by `scripts/setup-pdf-assets.js`, which is executed automatically via the `postinstall` npm script and during the Netlify build pipeline. If you ever need to refresh the assets manually you can run:

```
npm run setup:pdf-assets
```

Hosting these assets locally ensures that Chromium-based browsers can render PDF text even when network access to external CDNs is restricted.
