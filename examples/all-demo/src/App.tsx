import { JSX, lazy } from 'solid-js';
import { Route, Router } from 'solid-tiny-router';

const routes: Route[] = [
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
  {
    path: '/[id]',
    component: lazy(() => import('./pages/[id]')),
  },
  {
    path: '/[...list]',
    component: lazy(() => import('./pages/[...list]')),
  },
];

const NotFound = lazy(() => import('./pages/404'));

export default function App(): JSX.Element {
  return (
    <div class="flex items-center justify-center bg-gradient-to-l from-sky-400 to-indigo-600 min-h-screen">
      <Router
        routes={routes}
        fallback={<NotFound />}
      />
    </div>
  );
}