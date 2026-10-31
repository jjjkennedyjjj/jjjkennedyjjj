import React, {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// El motor de SABIDURÍA 72 (dev.html) dibuja un fotograma determinista con renderFrame(t).
// Remotion fija el tiempo, pide el fotograma al motor y lo captura: sin relojes ni rAF.
export const Frame: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [boot] = useState(() => delayRender('Cargando el motor'));

  useEffect(() => {
    const f = ref.current!;
    const wait = () => {
      const w = f.contentWindow as any;
      if (w && w.__listo === true) {
        setReady(true);
        continueRender(boot);
      } else {
        setTimeout(wait, 40);
      }
    };
    f.addEventListener('load', wait);
    return () => f.removeEventListener('load', wait);
  }, [boot]);

  useEffect(() => {
    if (!ready) return;
    const h = delayRender('Fotograma ' + frame);
    (ref.current!.contentWindow as any).renderFrame(frame / fps);
    requestAnimationFrame(() => continueRender(h));
  }, [frame, ready, fps]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <iframe
        ref={ref}
        src={staticFile('dev.html') + '?cap=1&t=0'}
        style={{width: 1080, height: 1920, border: 0, display: 'block'}}
      />
      <Audio src={staticFile('mix.wav')} />
    </AbsoluteFill>
  );
};
