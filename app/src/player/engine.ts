/**
 * Player Engine (Skeleton)
 *
 * This is a minimal, non-audio implementation of the PlayerEngine.
 * It manages state transitions and subscriptions only.
 *
 * Audio playback will be added later behind this abstraction.
 */

import {
  PlayerEngine,
  PlayerEvent,
  PlayerState,
  PlayerStatus,
  Track
} from "./types";

export function createPlayerEngine(): PlayerEngine {
  let state: PlayerState = {
    status: PlayerStatus.Idle,
    currentTrack: null,
    positionSeconds: 0,
    bufferedSeconds: 0,
    volume: 1
  };

  const listeners = new Set<
    (state: PlayerState, event?: PlayerEvent) => void
  >();

  function emit(event?: PlayerEvent) {
    listeners.forEach((listener) => listener({ ...state }, event));
  }

  return {
    async load(track: Track) {
      state = {
        ...state,
        status: PlayerStatus.Loading,
        currentTrack: track,
        positionSeconds: 0,
        bufferedSeconds: 0
      };
      emit({ type: "TRACK_LOADED", track });

      // Skeleton: immediately transition to paused
      state = {
        ...state,
        status: PlayerStatus.Paused
      };
      emit();
    },

    play() {
      if (!state.currentTrack) return;
      state = { ...state, status: PlayerStatus.Playing };
      emit({ type: "PLAY" });
    },

    pause() {
      if (state.status !== PlayerStatus.Playing) return;
      state = { ...state, status: PlayerStatus.Paused };
      emit({ type: "PAUSE" });
    },

    seek(positionSeconds: number) {
      if (!state.currentTrack) return;
      state = { ...state, positionSeconds };
      emit({ type: "SEEK", positionSeconds });
    },

    setVolume(volume: number) {
      state = { ...state, volume };
      emit();
    },

    getState() {
      return { ...state };
    },

    subscribe(listener) {
      listeners.add(listener);
      // Immediately notify with current state
      listener({ ...state });
      return () => listeners.delete(listener);
    }
  };
}

export function createPlayerEngine(): PlayerEngine {
  let state: PlayerState = {
    status: PlayerStatus.Idle,
    currentTrack: null,
    positionSeconds: 0,
    bufferedSeconds: 0,
    volume: 1
  };

  const listeners = new Set<
    (state: PlayerState, event?: PlayerEvent) => void
  >();

  function emit(event?: PlayerEvent) {
    listeners.forEach((listener) => listener({ ...state }, event));
  }

  return {
    async load(track: Track) {
      state = {
        ...state,
        status: PlayerStatus.Loading,
        currentTrack: track,
        positionSeconds: 0,
        bufferedSeconds: 0
      };
      emit({ type: "TRACK_LOADED", track });

      // Skeleton: immediately transition to paused
      state = {
        ...state,
        status: PlayerStatus.Paused
      };
      emit();
    },

    play() {
      if (!state.currentTrack) return;
      state = { ...state, status: PlayerStatus.Playing };
      emit({ type: "PLAY" });
    },

    pause() {
      if (state.status !== PlayerStatus.Playing) return;
      state = { ...state, status: PlayerStatus.Paused };
      emit({ type: "PAUSE" });
    },

    seek(positionSeconds: number) {
      if (!state.currentTrack) return;
      state = { ...state, positionSeconds };
      emit({ type: "SEEK", positionSeconds });
    },

    setVolume(volume: number) {
      state = { ...state, volume };
      emit();
    },

    getState() {
      return { ...state };
    },

    subscribe(listener) {
      listeners.add(listener);
      // Immediately notify with current state
      listener({ ...state });
      return () => listeners.delete(listener);
    }
  };
}
