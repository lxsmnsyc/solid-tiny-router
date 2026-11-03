import { type JSX, Show, createContext, createMemo, mergeProps, useContext } from 'solid-js';
import type { RouterTree } from '../core/create-router-tree';
import { type RouterParams, matchRoute } from '../core/router';
import useLocation, { type UseLocation, type UseLocationOptions } from '../core/use-location';

export interface RouterInstance<P extends RouterParams = RouterParams> extends UseLocation {
  params: P;
}

const LocationContext = createContext<UseLocation>();
const ParamsContext = createContext<RouterParams>();

export interface RouterProps {
  routes: RouterTree;
  fallback?: JSX.Element;
  location?: UseLocationOptions;
}

export default function Router(props: RouterProps): JSX.Element {
  const location = useLocation(() => props.routes, props.location);

  const matchedRoute = createMemo(() => matchRoute(props.routes, location.pathname));

  return (
    <LocationContext.Provider value={location}>
      <Show keyed when={matchedRoute()} fallback={props.fallback}>
        {(result) => (
          <ParamsContext.Provider value={result.params}>
            <Show keyed when={result.value}>
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
  if (location) {
    return mergeProps(location, {
      // The caller picks P to match its route pattern.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      params: params as P,
    });
  }
  throw new Error('useRouter must be used in a component within <Router>');
}
