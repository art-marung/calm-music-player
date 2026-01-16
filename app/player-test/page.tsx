"use client";

import { useEffect, useRef, useState } from "react";
import { createPlayerEngine } from "@/src/player/engine";
import { PlayerState, Track } from "@/src/player/types";

const mockTrack: Track = {
  id: "test-track-1",
  title: "Test Track",
  artist: "Local",
  durationSeconds: 180,
  source: "mock"
};

export default function PlayerTestPage() {
  // Create exactly one engine instance per browser session
  const engineRef = useRef<ReturnType<typeof createPlayerEngine> | null>(null);

  if (!engineRef.current) {
    engineRef.current = createPlayerEngine();
  }

  const engine = engineRef.current;

  const [state, setState] = useState<PlayerState>(engine.getState());

  useEffect(() => {
    return engine.subscribe((nextState) => {
      setState(nextState);
    });
  }, [engine]);

  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1>Player Engine Test</h1>

      <pre>{JSON.stringify(state, null, 2)}</pre>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => engine.load(mockTrack)}>Load</button>
        <button onClick={() => engine.play()}>Play</button>
        <button onClick={() => engine.pause()}>Pause</button>
        <button onClick={() => engine.seek(60)}>Seek 60s</button>
      </div>

      <p style={{ marginTop: 16 }}>
        Status: <strong>{state.status}</strong>
      </p>
    </main>
  );
}
