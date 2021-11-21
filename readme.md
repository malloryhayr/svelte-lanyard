# svelte-lanyard

A [Lanyard](https://github.com/Phineas/lanyard) API wrapper for [Svelte](https://svelte.dev)

## How to Use

Currently, svelte-lanyard only works clientside, meaning SvelteKit SSR will not work.
Learn how to disable SSR on a page-by-page basis [here](https://kit.svelte.dev/docs#ssr-and-javascript-ssr).

By default, svelte-lanyard will attempt to use the WebSocket method of fetching data. See below:

```svelte
<script lang="ts">
	import { useLanyard } from 'svelte-lanyard';

	const data = useLanyard('182292736790102017');
</script>

{#if $data}
	<p>My Discord username is {$data.discord_user.username}#{$data.discord_user.discriminator}</p>
{:else}
	<p>Waiting to fetch Discord data...</p>
{/if}
```

If you are building your website for browsers that don't support WebSockets or want to use the REST API instead, you must specify that you want to use the REST API and specify an interval at which to refresh the data:

```svelte
<script lang="ts">
	import { useLanyard } from 'svelte-lanyard';

	const data = useLanyard('182292736790102017', { type: 'rest', restInterval: 1e3 });
</script>

{#if $data}
	<p>My Discord username is {$data.discord_user.username}#{$data.discord_user.discriminator}</p>
{:else}
	<p>Waiting to fetch Discord data...</p>
{/if}
```
