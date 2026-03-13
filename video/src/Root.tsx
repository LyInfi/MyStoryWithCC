import React from "react";
import { Composition } from "remotion";
import { ChatScene, calcDuration } from "./ChatScene";
import { video20260312Config } from "./config/video-2026-03-12";
import { video20260313Config } from "./config/video-2026-03-13";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Video-2026-03-12"
        component={ChatScene}
        durationInFrames={calcDuration(video20260312Config.conversation)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={video20260312Config}
      />
      <Composition
        id="Video-2026-03-13"
        component={ChatScene}
        durationInFrames={calcDuration(video20260313Config.conversation)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={video20260313Config}
      />
      {/* 下一个视频：在此添加 */}
    </>
  );
};
