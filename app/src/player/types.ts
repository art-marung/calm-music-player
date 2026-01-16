/**
 * Player Engine Types
 *
 * This file defines the public contract for the playback engine.
 * It contains no implementation logic.
 *
 * Playback is treated as a critical, isolated domain.
 * UI, AI, and backend systems depend on this contract,
 * never the other way around.
 */

export interface Track {
  id: string;
  title: string;
  artist?: string;
  durationSeconds: number;
  source: string; // URL or local reference
}

export enum PlayerStatus {
  Idle = "idle",
  Loading = "loading",
  Playing = "playing",
  Paused = "paused",
  Ended = "ended",
  Error = "error"
}

export interface PlayerState {
  status: PlayerStatus;
  currentTrack: Track | null;
  positionSeconds: number;
  bufferedSeconds: number;
  volume: number; // 0.0 – 1.0
}

export type PlayerEvent =
  | { type: "TRACK_LOADED"; track: Track }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SEEK"; positionSeconds: number }
  | { type: "ENDED" }
  | { type: "ERROR"; message: string };

  export interface PlayerEngine {
  load(track: Track): Promise<void>;
  play(): void;
  pause(): void;
  seek(positionSeconds: number): void;
  setVolume(volume: number): void;

  getState(): PlayerState;

  subscribe(
    listener: (state: PlayerState, event?: PlayerEvent) => void
  ): () => void;
}
