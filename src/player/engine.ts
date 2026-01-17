import { PlayerState, PlayerStatus, Track } from "./types";

export type PlayerEngine = {
  getState(): PlayerState;
  load(track: Track): void;
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  subscribe(fn: (state: PlayerState) => void): () => void;
};

export function createPlayerEngine(): PlayerEngine {
  let state: PlayerState = {
    status: PlayerStatus.Idle,
    currentTrack: null,
    positionSeconds: 0
  };

  const listeners = new Set<(s: PlayerState) => void>();

  const notify = () => {
    listeners.forEach((fn) => fn({ ...state }));
  };

  const assertState = (
    allowed: PlayerStatus[],
    action: string
  ): boolean => {
    if (!allowed.includes(state.status)) {
      console.warn(
        `[PlayerEngine] Ignored "${action}" in state "${state.status}"`
      );
      return false;
    }
    return true;
  };

  return {
    getState() {
      return state;
    },

    load(track) {
      state = {
        status: PlayerStatus.Paused,
        currentTrack: track,
        positionSeconds: 0
      };
      notify();
    },

    play() {
      if (!state.currentTrack) return;
      if (
        !assertState(
          [PlayerStatus.Paused, PlayerStatus.Loading],
          "play"
        )
      )
        return;

      state = { ...state, status: PlayerStatus.Playing };
      notify();
    },

    pause() {
      if (!state.currentTrack) return;
      if (!assertState([PlayerStatus.Playing], "pause")) return;

      state = { ...state, status: PlayerStatus.Paused };
      notify();
    },

    seek(seconds) {
      if (!state.currentTrack) return;
      if (
        !assertState(
          [PlayerStatus.Playing, PlayerStatus.Paused],
          "seek"
        )
      )
        return;

      state = {
        ...state,
        positionSeconds: Math.max(0, seconds)
      };
      notify();
    },

    subscribe(fn) {
      listeners.add(fn);
      fn({ ...state });
      return () => listeners.delete(fn);
    }
  };
}
