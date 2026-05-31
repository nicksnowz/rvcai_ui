import { useEffect, useRef, useState } from 'react';

const VIDEO_SEQUENCE = [
  '/workflow.mp4',
  '/data-center.mp4',
  '/meeting.mp4',
  '/ship.mp4',
  '/stock-market.mp4',
];
const LAST_VIDEO_IDX = VIDEO_SEQUENCE.length - 1;
const CROSSFADE_MS = 300;

export default function HeroVideoLoop() {
  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const [videoLayerAIdx, setVideoLayerAIdx] = useState(0);
  const [videoLayerBIdx, setVideoLayerBIdx] = useState(Math.min(1, LAST_VIDEO_IDX));
  const [activeVideoLayer, setActiveVideoLayer] = useState('A');

  // Reload a layer when its source index changes so the new clip is fetched.
  useEffect(() => { videoRefA.current?.load(); }, [videoLayerAIdx]);
  useEffect(() => { videoRefB.current?.load(); }, [videoLayerBIdx]);

  // Kick off playback of the initial active layer on mount.
  useEffect(() => { videoRefA.current?.play()?.catch(() => {}); }, []);

  const advanceVideo = (fromLayer) => {
    if (fromLayer !== activeVideoLayer) return;

    const next = fromLayer === 'A' ? 'B' : 'A';
    setActiveVideoLayer(next);

    const nextRef = next === 'A' ? videoRefA.current : videoRefB.current;
    if (nextRef) {
      nextRef.currentTime = 0;
      nextRef.play()?.catch(() => {});
    }

    const nextActiveIdx = next === 'A' ? videoLayerAIdx : videoLayerBIdx;
    const nextNextIdx = (nextActiveIdx + 1) % VIDEO_SEQUENCE.length;
    setTimeout(() => {
      if (fromLayer === 'A') setVideoLayerAIdx(nextNextIdx);
      else setVideoLayerBIdx(nextNextIdx);
    }, CROSSFADE_MS + 60);
  };

  return (
    <>
      <video
        ref={videoRefA}
        className={`hero-video ${activeVideoLayer === 'A' ? '' : 'hero-video--hidden'}`}
        src={VIDEO_SEQUENCE[videoLayerAIdx]}
        muted
        playsInline
        preload="auto"
        poster="/hero-poster.jpg"
        onEnded={() => advanceVideo('A')}
        onError={() => advanceVideo('A')}
        aria-hidden="true"
      />
      <video
        ref={videoRefB}
        className={`hero-video ${activeVideoLayer === 'B' ? '' : 'hero-video--hidden'}`}
        src={VIDEO_SEQUENCE[videoLayerBIdx]}
        muted
        playsInline
        preload="auto"
        poster="/hero-poster.jpg"
        onEnded={() => advanceVideo('B')}
        onError={() => advanceVideo('B')}
        aria-hidden="true"
      />
      <div className="hero-video-scrim" aria-hidden="true" />
    </>
  );
}
