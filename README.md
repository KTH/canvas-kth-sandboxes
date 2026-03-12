# canvas-kth-sandboxes

A web application for IT-support staff at KTH to create sandbox course rooms in Canvas LMS. Users authenticate via Canvas OAuth and can create either sandbox rooms (under predefined sub-accounts, with test students automatically enrolled) or custom course rooms with a specified name and course code.

## Environment variables

Create a `.env` file in the project root with the following variables:

```
CANVAS_API_URL=        # Base URL to the Canvas instance, e.g. https://kth.instructure.com/
CANVAS_API_KEY=        # Canvas API token (for admin operations)
CANVAS_DEVELOPER_KEY_ID=      # OAuth developer key client ID
CANVAS_DEVELOPER_KEY_SECRET=  # OAuth developer key client secret
PROXY_HOST=            # Public base URL of this app, e.g. https://localdev.kth.se:3000
PORT=3000
SESSION_SECRET=        # Secret used to sign the session cookie
```

For local development, `localdev.kth.se` should resolve to `127.0.0.1` (add it to `/etc/hosts`). The dev server runs over HTTPS using a self-signed certificate.

## Run locally

```bash
npm install
npm run dev
```

The app will be available at `https://localdev.kth.se:3000/canvas-kth-sandboxes/public`.

## Run in production

```bash
npm install
npm start
```

## Tests

```bash
npm test
```
