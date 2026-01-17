import { PlayerEngine } from "../engine";
import { PlayerStatus, Track } from "../types";

export function bindHtmlAudio(
  engine: PlayerEngine,
  audio: HTMLAudioElement
) {
  let lastTrack: Track | null = null;
  let lastStatus: PlayerStatus | null = null;
  let syncing = false;

  const unsubscribe = engine.subscribe((state) => {
    // 1. Handle track changes (LOAD ONCE)
    if (state.currentTrack && state.currentTrack !== lastTrack) {
      lastTrack = state.currentTrack;
      syncing = true;

      audio.src = state.currentTrack.source;
      audio.currentTime = 0;
      audio.load();

      syncing = false;
    }

    // 2. Handle play / pause transitions ONLY
    if (state.status !== lastStatus && !syncing) {
      lastStatus = state.status;

      if (state.status === PlayerStatus.Playing) {
        audio.play().catch(() => {
          // Autoplay or interruption errors are expected
        });
      }

      if (state.status === PlayerStatus.Paused) {
        audio.pause();
      }
    }
  });

  // 3. Reflect audio time → engine (guarded)
  audio.addEventListener("timeupdate", () => {
    if (syncing) return;
    engine.seek(Math.floor(audio.currentTime));
  });

  audio.addEventListener("ended", () => {
    engine.pause();
  });

  return () => {
    unsubscribe();
  };
}
