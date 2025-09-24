Character Creator for Cubicle 7's Imperium Maledictum ttrpg

## Node.js bootstrap for Foundry actor lookups

The project now includes a tiny Node.js server that serves the static site and
proxies actor lookups to a FoundryVTT REST API module. The proxy keeps your
Foundry credentials out of the browser while offering a straightforward endpoint
for the front-end.

### Configuration

Set the following environment variables before starting the server:

* `FOUNDRY_API_BASE_URL` – Base URL for the REST module. Include the `/` at the
  end if your module expects it (for example
  `https://example.com/foundryvtt/api/`).
* `FOUNDRY_API_KEY` – Optional bearer token that should be sent with requests
  to Foundry. Leave unset if the module is exposed without authentication.

### Run locally

```bash
npm start
```

The site will be available at `http://localhost:3000`. Use the "Load Actor From
Foundry" panel to test an actor fetch. Errors from the Foundry instance are
relayed back to the browser to aid debugging. Node.js 18+ (20+ recommended) is
required so the built-in `fetch` API is available on the server.

---

notes:
trying out kebab-case for classes. This'll alow me to query all sheet-* elements and so forth. ID's still camelCase

Layout:
Forms:
1. Character Name
2. Stats
3. Origin
4. Faction
5. Role

Output to sheet