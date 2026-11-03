import type { JSX } from 'solid-js';
import { lazy } from 'solid-js';
import { Router, createRouterTree } from 'solid-tiny-router';

const routes = createRouterTree([
  {
    path: '/',
    component: lazy(async () => import('./pages')),
  },
  {
    path: '/a',
    component: lazy(async () => import('./pages/a')),
  },
  {
    path: '/b',
    component: lazy(async () => import('./pages/b')),
  },
  {
    path: '/parameter/[id]',
    component: lazy(async () => import('./pages/[id]')),
  },
  {
    path: '/wildcard/[...list]',
    component: lazy(async () => import('./pages/[...list]')),
  },
]);

const NotFound = lazy(async () => import('./pages/404'));

export default function App(): JSX.Element {
  return (
    <div class="flex items-center justify-center bg-gradient-to-l from-sky-400 to-indigo-600 min-h-screen">
      <Router routes={routes} fallback={<NotFound />} />
    </div>
  );
}
