import { PlayerEngine } from "../engine";
import { PlayerStatus } from "../types";

export function bindHtmlAudio(
  engine: PlayerEngine,
  audio: HTMLAudioElement
) {
  // Reflect engine → audio
  const unsubscribe = engine.subscribe((state) => {
    if (state.status === PlayerStatus.Playing) {
      audio.play().catch(() => {});
    }

    if (state.status === PlayerStatus.Paused) {
      audio.pause();
    }
  });

  // Reflect audio → engine
  audio.addEventListener("timeupdate", () => {
    engine.seek(Math.floor(audio.currentTime));
  });

  audio.addEventListener("ended", () => {
    engine.pause();
  });

  return () => {
    unsubscribe();
  };
}
