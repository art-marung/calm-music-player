import { PlayerState, PlayerStatus, Track } from "./types";

export type PlayerEngine = {
  getState: () => PlayerState;
  load: (track: Track) => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  subscribe: (fn: (state: PlayerState) => void) => () => void;
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
      state = { ...state, status: PlayerStatus.Playing };
      notify();
    },

    pause() {
      if (!state.currentTrack) return;
      state = { ...state, status: PlayerStatus.Paused };
      notify();
    },

    seek(seconds) {
      if (!state.currentTrack) return;
      state = { ...state, positionSeconds: seconds };
      notify();
    },

    subscribe(fn) {
      listeners.add(fn);
      fn({ ...state });
      return () => listeners.delete(fn);
    }
  };
}
