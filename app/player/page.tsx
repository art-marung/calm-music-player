"use client";

import { useEffect, useRef, useState } from "react";
import { createPlayerEngine } from "@/src/player/engine";
import { PlayerState, Track } from "@/src/player/types";
import { bindHtmlAudio } from "@/src/player/audio/htmlAudioAdapter";

const demoTrack: Track = {
  id: "calm-001",
  title: "Calm Waves",
  artist: "Ambient Lab",
  durationSeconds: 180,
  source: "/audio/calm-waves.mp3",
};

export default function PlayerPage() {
  const engineRef = useRef<ReturnType<typeof createPlayerEngine> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!engineRef.current) {
    engineRef.current = createPlayerEngine();
  }

  const engine = engineRef.current;
  const [state, setState] = useState<PlayerState>(engine.getState());

  // UI ← engine
  useEffect(() => {
    return engine.subscribe(setState);
  }, [engine]);

  // Engine ↔ audio
  useEffect(() => {
    if (!audioRef.current) return;

    const unbind = bindHtmlAudio(engine, audioRef.current);
    return unbind;
  }, [engine]);

  return (
    <main style={{ padding: 32, fontFamily: "sans-serif", maxWidth: 600 }}>
      <h1>Calm Music Player</h1>
      <p>Take a breath. Press play when ready.</p>

      {/* Visible for debugging; can be hidden later */}
      <audio ref={audioRef} controls />

      <pre>{JSON.stringify(state, null, 2)}</pre>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => engine.load(demoTrack)}>Load</button>
        <button
  onClick={() => {
    engine.play();
    audioRef.current?.play().catch(() => {});
  }}
>
  Play
</button>
        <button onClick={() => engine.pause()}>Pause</button>
        <button onClick={() => engine.seek(60)}>Seek 60s</button>
      </div>

      {/* Emergency browser-gesture unlock */}
      <button
        onClick={() => {
          audioRef.current?.play().catch(console.error);
        }}
        style={{ marginTop: 12 }}
      >
        Force Audio Play
      </button>

      <p style={{ marginTop: 16 }}>
        Status: <strong>{state.status}</strong>
      </p>
    </main>
  );
}
