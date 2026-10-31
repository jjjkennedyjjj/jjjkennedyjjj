import React from 'react';
import {Composition, staticFile} from 'remotion';
import {Frame} from './Frame';

// Duración leída de public/config.json (la copia build/render_remotion.sh).
export const Root: React.FC = () => (
  <Composition
    id="Video"
    component={Frame}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    calculateMetadata={async () => {
      const cfg = await (await fetch(staticFile('config.json'))).json();
      return {durationInFrames: Math.round(cfg.dur * 30)};
    }}
  />
);
