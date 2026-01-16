export type Track = {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  source: "mock" | "stream" | "download";
};

export enum PlayerStatus {
  Idle = "idle",
  Loading = "loading",
  Playing = "playing",
  Paused = "paused",
  Error = "error"
}

export type PlayerState = {
  status: PlayerStatus;
  currentTrack: Track | null;
  positionSeconds: number;
};
