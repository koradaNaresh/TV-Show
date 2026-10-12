# Rick and Morty Character Explorer

A responsive Angular 20 explorer for characters and episode appearances from the [Rick and Morty API](https://rickandmortyapi.com/).

## Run locally

- Install Node.js 20.19+ (or 22.12+) and npm.
- Run `npm install`.
- Run `npm start` and open the local URL printed by Angular CLI.
- Run `npm run build` to create a production build in `dist/character-explorer`.

The app needs an internet connection to reach the public API. No API key is needed.

## Features

- Loads every matching character across API pages; name search uses the API's `name` and `page` query parameters.
- Grid and compact list layouts; character cards show avatar, status, species, gender and episode count.
- Character routes show all episode appearances with a client-side free-text episode-name filter.
- Demo role selector supports Admin and Viewer. Viewers may browse the character catalog; restricted detail access redirects to a clear 403-style page. The role is retained in local storage for convenient demos.
- Responsive layout, loading/empty/error states, lazy-loaded character images and accessible control labels.

## Design and implementation rationale

- **Angular 20 standalone APIs:** standalone components and lazy route loading avoid NgModule boilerplate. Angular's `@if` / `@for` control-flow blocks and signals manage template branches, view mode, API state and derived episode filtering.
- **Typed API service:** `RickAndMortyApiService` owns HTTP access and model types. It follows every `info.next` link so the catalog covers all API pages, and fetches character episodes through `/api/episode/{id}`.
- **Client-side episode filtering:** episodes are loaded for the selected character and filtered locally as the user types, as requested.
- **Shared technical constants:** API URLs and endpoint names, route paths, role values, status/layout values, and numeric settings are centralized in `src/app/constants/constants.ts`. Display labels remain next to their templates.
- **Authorization demonstration:** roles are simulated in the browser; the route guard is not a security boundary. Production authorization must be enforced by a trusted server.
- **Component-library choice:** custom CSS keeps this focused interface lean without adding a large component dependency. The dark observatory palette, green portal accents and responsive cards keep the large catalog readable.

## Routes

- `/characters` — character catalog (Admin and Viewer)
- `/characters/:id` — character profile and episode table (Admin only)
- `/access-denied` — access explanation and role recovery
