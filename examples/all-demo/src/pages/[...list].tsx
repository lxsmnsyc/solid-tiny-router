import { JSX } from 'solid-js';
import { Link, useRouter, RouterParams } from 'solid-tiny-router';

interface Param extends RouterParams {
  list: string[];
}

export default function CaptureAllRoute(): JSX.Element {
  const router = useRouter<Param>();
  return (
    <div class="p-4 rounded-lg bg-indigo-900 bg-opacity-25 flex flex-col space-y-4">
      <span class="text-2xl text-white font-sans">
        {'Welcome to '}
        <span class="bg-white bg-opacity-25 font-mono p-2 rounded m-1">{`Page ${router.params.list.join(', ')}`}</span>
        !
      </span>
      <div class="flex flex-col space-y-1">
        <Link href="/" class="text-white underline bg-white bg-opacity-25 rounded px-2 py-1">Go to home</Link>
      </div>
    </div>
  );
}
