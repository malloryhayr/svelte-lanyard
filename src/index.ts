import { readable } from 'svelte/store';

import type { LanyardData, LanyardWebSocketMessage, LanyardMethod } from './types';

const API_URL = 'https://api.lanyard.rest/v1';
const WS_URL = 'wss://api.lanyard.rest/socket';
const WS_HEARTBEAT = 30e3;

export function useLanyard(id: string, method?: LanyardMethod) {
	if (!id) throw new Error('A Discord user ID must be specified');

	const lanyardData = readable<LanyardData>(undefined, set => {
		if (method && method.type === 'rest') {
			if (!('fetch' in window)) throw new Error('svelte-lanyard only works clientside');

			function fetchLanyardData() {
				fetch(`${API_URL}/users/${id}`).then(res => {
					res.json().then(res => {
						if (!res.success) throw new Error(res.error?.message || 'An unknown error occurred');

						set(res.data as LanyardData);
					});
				});
			}

			fetchLanyardData();

			const interval = setInterval(() => {
				fetchLanyardData();
			}, method.restInterval);

			return function stop() {
				clearInterval(interval);
			};
		} else {
			if (!('WebSocket' in window || 'MozWebSocket' in window))
				throw new Error('svelte-lanyard only works clientside');

			const socket = new WebSocket(WS_URL);
			let interval: any;

			socket.addEventListener('open', () => {
				socket.send(
					JSON.stringify({
						op: 2,
						d: {
							subscribe_to_id: id,
						},
					})
				);

				interval = setInterval(() => {
					socket.send(JSON.stringify({ op: 3 }));
				}, WS_HEARTBEAT);
			});

			socket.addEventListener('message', ({ data }: { data: string }) => {
				const { op, seq, t, d }: LanyardWebSocketMessage = JSON.parse(data);

				if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') set(d);
			});

			return function stop() {
				socket.close();
				clearInterval(interval);
			};
		}
	});

	return lanyardData;
}
