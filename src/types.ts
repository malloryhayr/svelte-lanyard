export interface LanyardMethod {
	type: 'socket' | 'rest';
	restInterval?: number;
}

export enum LanyardWebSocketOpcode {
	EVENT = 0,
	HELLO = 1,
	INITIALIZE = 2,
	HEARTBEAT = 3,
}

export type LanyardWebSocketEvent = 'INIT_STATE' | 'PRESENCE_UPDATE';

export interface LanyardWebSocketMessage {
	op: LanyardWebSocketOpcode;
	seq: number;
	t: LanyardWebSocketEvent;
	d: LanyardData;
}

export type LanyardRestResponse = {
	success: boolean;
} & LanyardRestPossibleResponse;

type LanyardRestPossibleResponse =
	| { data: LanyardData }
	| { error: { message: string; code: string } };

export interface LanyardData {
	spotify: LanyardSpotifyData | null;
	kv: { [key: string]: string };
	listening_to_spotify: boolean;
	discord_user: LanyardDiscordUser;
	discord_status: string;
	activities: LanyardDiscordActivity[];
	active_on_discord_mobile: boolean;
	active_on_discord_desktop: boolean;
}

export interface LanyardTimestamps {
	start: number;
	end: number;
}

export interface LanyardSpotifyData {
	track_id: string;
	timestamps: LanyardTimestamps;
	song: string;
	artist: string;
	album_art_url: string;
	album: string;
}

export interface LanyardDiscordUser {
	username: string;
	public_flags: number;
	id: number;
	discriminator: string;
	avatar: string;
}

export interface LanyardDiscordEmoji {
	name: string;
	id: number;
	animated: boolean;
}

export interface LanyardDiscordParty {
	id: string;
}

export interface LanyardDiscordAssets {
	small_text: string;
	small_image: string;
	large_text: string;
	large_image: string;
}

export interface LanyardDiscordActivity {
	type: number;
	state: string;
	name: string;
	id: string;
	emoji?: LanyardDiscordEmoji;
	created_at: number;
	timestamps?: LanyardTimestamps;
	sync_id?: string;
	session_id?: string;
	party?: LanyardDiscordParty;
	flags?: number;
	details?: string;
	assets?: LanyardDiscordAssets;
	application_id?: number;
}
