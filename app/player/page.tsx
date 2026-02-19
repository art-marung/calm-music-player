"use client";

import { useRef, useState } from "react";

export default function PlayerPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState("idle");

  const source = "/audio/calm-waves.mp3";

  return (
    <main style={{ padding: 40 }}>
      <h1>Calm Music Player (Minimal)</h1>

      <audio ref={audioRef} src={source} />

      <p>Status: {status}</p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => {
            if (!audioRef.current) return;
            audioRef.current.play();
            setStatus("playing");
          }}
        >
          Play
        </button>

        <button
          onClick={() => {
            if (!audioRef.current) return;
            audioRef.current.pause();
            setStatus("paused");
          }}
        >
          Pause
        </button>
      </div>
    </main>
  );
}