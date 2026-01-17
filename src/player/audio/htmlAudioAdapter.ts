import { PlayerEngine } from "../engine";
import { PlayerStatus } from "../types";

export function bindHtmlAudio(
  engine: PlayerEngine,
  audio: HTMLAudioElement
) {
  let suppressSeek = false;

  const unsubscribe = engine.subscribe((state) => {
    if (state.currentTrack && audio.src !== state.currentTrack.source) {
      audio.src = state.currentTrack.source;
      audio.load();
    }

    if (state.status === PlayerStatus.Paused && !audio.paused) {
      audio.pause();
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (suppressSeek) return;
    engine.seek(Math.floor(audio.currentTime));
  });

  audio.addEventListener("seeked", () => {
    suppressSeek = false;
  });

  audio.addEventListener("ended", () => {
    engine.pause();
  });

  return () => {
    unsubscribe();
  };
}
