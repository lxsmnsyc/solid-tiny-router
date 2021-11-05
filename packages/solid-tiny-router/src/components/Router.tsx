import {
  JSX,
  createContext,
  useContext,
  createMemo,
  Show,
  mergeProps,
} from 'solid-js';
import {
  addRoute,
  createRouterNode,
  matchRoute,
  RouterParams,
} from '../core/router';
import useLocation, { UseLocation, UseLocationOptions } from '../core/use-location';

export interface RouterInstance<P extends RouterParams = RouterParams> extends UseLocation {
  params: P;
}

const LocationContext = createContext<UseLocation>();
const ParamsContext = createContext<RouterParams>();

export interface Route {
  path: string;
  component: () => JSX.Element;
}

export interface RouterProps {
  routes: Route[];
  fallback?: JSX.Element;
  location?: UseLocationOptions;
}

export default function Router(
  props: RouterProps,
): JSX.Element {
  const location = useLocation(props.location);

  const routerNode = createMemo(() => {
    const root = createRouterNode<Route['component']>('');
    const routesProp = props.routes;

    for (let i = 0, len = routesProp.length; i < len; i += 1) {
      const route = routesProp[i];
      addRoute(root, route.path.split('/'), route.component);
    }

    return root;
  });

  const matchedRoute = createMemo(() => matchRoute(routerNode(), location.pathname.split('/')));

  return (
    <LocationContext.Provider value={location}>
      <Show when={matchedRoute()} fallback={props.fallback}>
        {(result) => (
          <ParamsContext.Provider value={result.params}>
            <Show when={result.value}>
              {(Comp) => <Comp />}
            </Show>
          </ParamsContext.Provider>
        )}
      </Show>
    </LocationContext.Provider>
  );
}

export function useRouter<P extends RouterParams>(): RouterInstance<P> {
  const location = useContext(LocationContext);
  const params = useContext(ParamsContext);
  if (location && params) {
    return mergeProps(location, {
      params: params as P,
    });
  }
  throw new Error('useRouter must be used in a component within <Router>');
}
