import { JSX } from 'solid-js';
import { Link } from 'solid-tiny-router';

export default function Index(): JSX.Element {
  return (
    <div class="p-4 rounded-lg bg-indigo-900 bg-opacity-25 flex flex-col space-y-4">
      <span class="text-2xl text-white font-sans">
        {'Welcome to '}
        <span class="bg-white bg-opacity-25 font-mono p-2 rounded m-1">solid-tiny-router</span>
        !
      </span>
      <div class="flex flex-col space-y-1">
        <Link href="/a" class="text-white underline bg-white bg-opacity-25 rounded px-2 py-1">Go to page A</Link>
        <Link href="/b" class="text-white underline bg-white bg-opacity-25 rounded px-2 py-1">Go to page B</Link>
      </div>
    </div>
  );
}
