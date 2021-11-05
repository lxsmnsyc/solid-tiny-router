import {
  createEffect,
  createSignal,
  JSX,
  onCleanup,
  Show,
} from 'solid-js';
import { excludeProps } from '../utils/exclude-props';
import { useRouter } from './Router';

function getLocationOrigin() {
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
}

function isLocalURL(url: string): boolean {
  // prevent a hydration mismatch on href for url with anchor refs
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return true;
  }
  try {
    // absolute urls can be local if they are on the same origin
    const locationOrigin = getLocationOrigin();
    const resolved = new URL(url, locationOrigin);
    return resolved.origin === locationOrigin;
  } catch (_) {
    return false;
  }
}

function isModifiedEvent(event: MouseEvent): boolean {
  const { target } = event.currentTarget as HTMLAnchorElement;
  return (
    (target && target !== '_self')
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey // triggers resource download
  );
}

function Throwable(props: { error: Error }): JSX.Element {
  throw props.error;
}

type BaseAnchorAttributes = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface LinkProps extends BaseAnchorAttributes {
  href: string;
  scroll?: ScrollBehavior;
  replace?: boolean;
  prefetch?: boolean;
  children?: JSX.Element;
}

export default function Link(
  props: LinkProps,
): JSX.Element {
  const router = useRouter();

  let anchorRef!: HTMLAnchorElement;

  // Override click behavior
  createEffect(() => {
    const shouldScroll = props.scroll;
    const anchorHref = props.href;
    const shouldReplace = props.replace;

    const onClick = (ev: MouseEvent) => {
      if (isModifiedEvent(ev) || !isLocalURL(anchorHref)) {
        return;
      }
      ev.preventDefault();

      // avoid scroll for urls with anchor refs
      let scroll = shouldScroll;
      if (scroll == null && anchorHref.indexOf('#') >= 0) {
        scroll = undefined;
      }

      router[shouldReplace ? 'replace' : 'push'](anchorHref, {
        scroll,
      });
    };

    anchorRef.addEventListener('click', onClick);
    onCleanup(() => {
      anchorRef.removeEventListener('click', onClick);
    });
  });

  const [error, setError] = createSignal<Error>();

  // Lazy prefetching
  createEffect(() => {
    // TODO intersection observer
    const anchorHref = props.href;
    const shouldPrefetch = isLocalURL(anchorHref);
    if (shouldPrefetch) {
      router.prefetch(anchorHref).catch((err) => {
        setError(err);
      });
    }
  });

  // Priotized prefetching on mouse enter
  createEffect(() => {
    const anchorHref = props.href;
    const shouldPrefetch = isLocalURL(anchorHref);
    const onMouseEnter = () => {
      if (shouldPrefetch) {
        router.prefetch(anchorHref, true).catch((err) => {
          setError(err);
        });
      }
    };

    anchorRef.addEventListener('mouseenter', onMouseEnter);
    onCleanup(() => {
      anchorRef.removeEventListener('mouseenter', onMouseEnter);
    });
  });

  return (
    <>
      <Show when={error()}>
        {(err) => <Throwable error={err} />}
      </Show>
      <a
        ref={(e) => {
          if (typeof props.ref === 'function') {
            props.ref(e);
          }
          anchorRef = e;
        }}
        {...excludeProps(props, [
          'prefetch',
          'scroll',
          'ref',
          'replace',
        ])}
      >
        {props.children}
      </a>
    </>
  );
}
