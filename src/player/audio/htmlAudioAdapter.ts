import { PlayerEngine } from "../engine";
import { PlayerStatus } from "../types";

export function bindHtmlAudio(
  engine: PlayerEngine,
  audio: HTMLAudioElement
) {
  let lastSource: string | null = null;
  let isSyncingFromAudio = false;

  const unsubscribe = engine.subscribe((state) => {
    const track = state.currentTrack;

    // 1️⃣ Handle track loading
    if (track?.source && track.source !== lastSource) {
      console.log("[audio] loading source:", track.source);

      audio.src = track.source;
      audio.load();
      lastSource = track.source;
    }

    // 2️⃣ Handle play / pause
    if (state.status === PlayerStatus.Playing) {
      if (audio.src) {
        audio
          .play()
          .then(() => console.log("[audio] playing"))
          .catch((err) =>
            console.warn("[audio] play blocked:", err.message)
          );
      }
    }

    if (state.status === PlayerStatus.Paused) {
      if (!audio.paused) {
        audio.pause();
        console.log("[audio] paused");
      }
    }

    // 3️⃣ Handle seek (engine → audio)
    if (
      track &&
      !isSyncingFromAudio &&
      Math.abs(audio.currentTime - state.positionSeconds) > 0.5
    ) {
      audio.currentTime = state.positionSeconds;
    }
  });

  // 4️⃣ Handle time updates (audio → engine)
  const onTimeUpdate = () => {
    isSyncingFromAudio = true;
    engine.seek(Math.floor(audio.currentTime));
    isSyncingFromAudio = false;
  };

  audio.addEventListener("timeupdate", onTimeUpdate);

  // 5️⃣ Handle end of track
  audio.addEventListener("ended", () => {
    console.log("[audio] ended");
    engine.pause();
  });

  return () => {
    unsubscribe();
    audio.removeEventListener("timeupdate", onTimeUpdate);
  };
}
