import {
  JSX,
  createContext,
  useContext,
  createMemo,
  Show,
  mergeProps,
} from 'solid-js';
import { RouterTree } from '../core/create-router-tree';
import {
  matchRoute,
  RouterParams,
} from '../core/router';
import useLocation, { UseLocation, UseLocationOptions } from '../core/use-location';

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

export default function Router(
  props: RouterProps,
): JSX.Element {
  const location = useLocation(() => props.routes, props.location);

  const matchedRoute = createMemo(() => (
    matchRoute(props.routes, location.pathname.split('/'))
  ));

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
