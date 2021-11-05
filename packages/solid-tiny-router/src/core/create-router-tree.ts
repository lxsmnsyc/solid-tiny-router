import {
  JSX,
} from 'solid-js';
import { addRoute, createRouterNode, RouterNode } from './router';

export interface Page {
  (): JSX.Element;
  preload?: () => (void | Promise<Page>);
}

export interface Route {
  path: string;
  component: Page;
}

export type RouterTree = RouterNode<Page>;

export default function createRouterTree(routes: Route[]): RouterTree {
  const root = createRouterNode<Route['component']>('');

  for (let i = 0, len = routes.length; i < len; i += 1) {
    const route = routes[i];
    addRoute(root, route.path.split('/'), route.component);
  }

  return root;
}
