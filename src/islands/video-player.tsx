"use client";

import "plyr-react/plyr.css";

import { useEffect } from "react";
import Plyr from "plyr-react";

type IVideoPlayerProps = {
  videoId: string;
  provider: Plyr.Provider;
};

const VideoPlayer = ({ videoId, provider }: IVideoPlayerProps) => {
  useEffect(() => {
    const playButton = document.querySelector(
      ".plyr__control--overlaid",
    ) as HTMLElement;
    if (playButton) playButton.focus();
  }, []);

  return (
    <Plyr
      source={{
        type: "video",
        sources: [
          {
            src: videoId,
            provider,
          },
        ],
        tracks: [
          {
            kind: "captions",
            label: "Español",
            src: "ruta/a/tus/subtitulos_es.vtt",
            srcLang: "es",
            default: true,
          },
          {
            kind: "captions",
            label: "English",
            src: "ruta/a/tus/subtitulos_en.vtt",
            srcLang: "en",
          },
        ],
      }}
      options={{
        captions: { active: true, language: "ES", update: true },
        tooltips: { controls: true, seek: true },
        quality: { options: [560, 720, 1080], default: 720 },
        speed: { options: [0.75, 1, 1.5, 2], selected: 1 },
      }}
    />
  );
};

export default VideoPlayer;
