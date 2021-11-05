# solid-tiny-router

> Tiny routing library for SolidJS

[![NPM](https://img.shields.io/npm/v/solid-tiny-router.svg)](https://www.npmjs.com/package/solid-tiny-router) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/LXSMNSYC/solid-tiny-router/tree/main/examples/all-demo)

## Install

```bash
npm i solid-tiny-router
```

```bash
yarn add solid-tiny-router
```

```bash
pnpm add solid-tiny-router
```

## Features

- Easy to use: Only 2 components and a single utility: `<Router>`, `<Link>` and `useRouter`!
- Link prefetching: load pages ahead of time with `router.prefetch` and `<Link prefetch>`.

## Usage

```js
import { JSX, lazy } from 'solid-js';
import { Route, Router } from 'solid-tiny-router';

// Declare routes
const routes = [
  {
    path: '/',
    component: lazy(() => import('./pages')),
  },
  {
    path: '/a',
    component: lazy(() => import('./pages/a')),
  },
  {
    path: '/b',
    component: lazy(() => import('./pages/b')),
  },
  // Parametized route
  {
    path: '/[id]',
    component: lazy(() => import('./pages/[id]')),
  },
  // Wildcard Route
  {
    path: '/[...list]',
    component: lazy(() => import('./pages/[...list]')),
  },
];

const NotFound = lazy(() => import('./pages/404'));

export default function App() {
  return (
    <div>
      <Router
        // Pass routes
        routes={routes}
        // Used for 404
        fallback={<NotFound />}
      />
    </div>
  );
}

// [id].tsx
export default function ParametizedRoute() {
  // Access router
  const router = useRouter();
  // Access parameters
  // For wildcard routes, the params will be an array of string
  const id = () => router.params.id;
  return (
    <div>
      <span>
        {'Welcome to '}
        <span>{`Page ${id()}`}</span>
        !
      </span>
      <div class="flex flex-col space-y-1">
        <Link href="/">Go to home</Link>
      </div>
    </div>
  );
}
```

### `<Router>`

The main routing component. `<Router>` builds a routing switch from `routes` and then reactively matches the pages from the `window.location`. If no matching route is found, `fallback` rendered, which behaves like a 404 page.

### `<Link>`

Navigation component. Must be used within pages and components controlled by `<Router`>. `<Link>` controls the page history and prevents page reload when navigating between local pages.

- `prefetch` allows the given page to be prefetched.
- `replace` replaces the current history instead of pushing a new history.
- `scroll` scrolls the window to the top of the page after navigation. (Possible values is `"auto"`, `"smooth"` or just `undefined`, defaults to `"auto"`.)

### `useRouter`

`useRouter` provides the router instance for controlling navigation imperatively. This can only be used within pages and components controlled by `<Router>`.

- `pathname` is a reactive property for tracking the `window.location.pathname`.
- `search` is a reactive property for tracking the `window.location.search`.
- `push` pushes a new URL and navigates to the given URL.
- `replace` replaces the current history and navigates to the given URL.
- `prefetch` prefetches the given URL.
- `back` is used to navigate back in history.
- `forward` is used to navigate forward in history.
- `reload` performs page reload.
- `params` provides the object based on the parsed URL (if the path of the page is either a wildcard route, a parametized route or a combination of both).

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
