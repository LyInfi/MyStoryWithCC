import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MessageBubble } from "./components/MessageBubble";
import { Header } from "./components/Header";
import { Intro, INTRO_DURATION, CLICK_FRAME } from "./components/Intro";
import { Outro } from "./components/Outro";
import { Message } from "./data/conversation";
import { VideoConfig } from "./config/video-2026-03-12";

const CHARS_PER_FRAME = 3.0;
const GAP_FRAMES = 60;
const HEADER_DURATION = 80;

function buildTimeline(messages: Message[]) {
  const timeline: number[] = [];
  let cursor = INTRO_DURATION + HEADER_DURATION;

  for (const msg of messages) {
    timeline.push(cursor);
    const typingFrames = Math.ceil(msg.text.length / CHARS_PER_FRAME);
    cursor += typingFrames + GAP_FRAMES;
  }
  const outroFrame = cursor + 360; // 冻结3秒 + 截图3秒
  return { timeline, outroFrame, totalFrames: outroFrame + 240 };
}

/** 供 Root.tsx 计算 Composition 时长 */
export function calcDuration(conversation: Message[]) {
  return buildTimeline(conversation).totalFrames;
}

const PauseImage: React.FC<{ screenshot: string }> = ({ screenshot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1117", justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile(screenshot)}
        style={{ width: "100%", height: "100%", objectFit: "contain", opacity }}
      />
    </AbsoluteFill>
  );
};

export const ChatScene: React.FC<VideoConfig> = ({ title, date, screenshot, conversation }) => {
  const { timeline, outroFrame } = buildTimeline(conversation);
  const pauseStart = outroFrame - 90;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117",
        fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* BGM：全程循环，低音量 */}
      <Audio src={staticFile("shared/bgm.mp3")} volume={0.08} loop />

      {/* 点击图标音效 */}
      <Sequence from={CLICK_FRAME} durationInFrames={25}>
        <Audio src={staticFile("shared/sfx_click.mp3")} volume={0.9} />
      </Sequence>

      {/* 开场动画 */}
      <Sequence from={0} durationInFrames={INTRO_DURATION} premountFor={30}>
        <Intro title={title} />
      </Sequence>

      {/* 用户消息打字音效 */}
      <Sequence from={INTRO_DURATION} layout="none">
        {conversation.map((msg, i) => {
          if (msg.role !== "user") return null;
          const typingFrames = Math.ceil(msg.text.length / CHARS_PER_FRAME);
          return (
            <Sequence key={`typing-${i}`} from={timeline[i] - INTRO_DURATION} durationInFrames={typingFrames}>
              <Audio src={staticFile("shared/sfx_typing.mp3")} volume={0.35} loop />
            </Sequence>
          );
        })}
      </Sequence>

      {/* 对话内容（Intro 结束后开始） */}
      <Sequence from={INTRO_DURATION} layout="none">
        {/* 背景装饰 */}
        <div
          style={{
            position: "absolute",
            top: -200, right: -200,
            width: 600, height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200, left: -200,
            width: 500, height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            padding: "200px 80px 60px",
          }}
        >
          <Header date={date} />

          <div style={{ marginTop: 60 }}>
            {conversation.map((msg, i) => (
              <MessageBubble
                key={i}
                role={msg.role}
                text={msg.text}
                startFrame={timeline[i] - INTRO_DURATION}
                charsPerFrame={CHARS_PER_FRAME}
              />
            ))}
          </div>
        </div>
      </Sequence>

      {/* 截图停顿3秒 */}
      <Sequence from={pauseStart} durationInFrames={90}>
        <PauseImage screenshot={screenshot} />
      </Sequence>

      {/* Outro */}
      <Sequence from={outroFrame}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
