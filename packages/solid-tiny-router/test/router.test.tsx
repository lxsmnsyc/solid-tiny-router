import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';
import { afterEach, expect, test } from 'vitest';
import { Link, Router, createRouterTree, useRouter } from '../src';

// jsdom has no IntersectionObserver. Link uses it to prefetch visible links.
function noop(): void {
  // no-op
}

function StubIntersectionObserver(): Pick<
  IntersectionObserver,
  'observe' | 'unobserve' | 'disconnect'
> {
  return { observe: noop, unobserve: noop, disconnect: noop };
}

Object.assign(globalThis, { IntersectionObserver: StubIntersectionObserver });

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.innerHTML = '';
});

function Post(): JSX.Element {
  const router = useRouter<{ id: string }>();
  return <p>post {router.params.id}</p>;
}

function Home(): JSX.Element {
  return <Link href="/posts/42">open</Link>;
}

function NotFound(): JSX.Element {
  return <p>not found</p>;
}

const routes = createRouterTree([
  { path: '/', component: Home },
  { path: '/posts/[id]', component: Post },
]);

function mount(pathname: string): HTMLElement {
  window.history.replaceState(null, '', pathname);
  const root = document.createElement('div');
  document.body.append(root);
  dispose = render(() => <Router routes={routes} fallback={<NotFound />} />, root);
  return root;
}

test('renders the matched page with its params', () => {
  const root = mount('/posts/42');
  expect(root.textContent).toBe('post 42');
});

test('renders the fallback when no route matches', () => {
  const root = mount('/missing');
  expect(root.textContent).toBe('not found');
});

test('Link navigates to the matched page', () => {
  const root = mount('/');
  root
    .querySelector('a')
    ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(window.location.pathname).toBe('/posts/42');
  expect(root.textContent).toBe('post 42');
});
