import React from 'react';
import {Composition, staticFile} from 'remotion';
import {Frame} from './Frame';
import {Nativo} from './Nativo';

// Duración leída de public/config.json (la copia build/render_remotion.sh).
export const Root: React.FC = () => (
  <>
  <Composition
    id="Nativo"
    component={Nativo as React.FC<any>}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={900}
    defaultProps={{subs: []}}
    calculateMetadata={async () => ({props: {subs: await (await fetch(staticFile('subs_clip.json'))).json()}})}
  />
  <Composition
    id="Video"
    component={Frame}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{src: 'dev.html'}}
    calculateMetadata={async () => {
      const cfg = await (await fetch(staticFile('config.json'))).json();
      return {durationInFrames: Math.round(cfg.dur * 30)};
    }}
  />
  </>
);
