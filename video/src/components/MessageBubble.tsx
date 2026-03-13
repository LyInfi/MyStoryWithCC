import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

type Props = {
  role: "user" | "assistant";
  text: string;
  /** 该气泡开始出现的帧 */
  startFrame: number;
  /** 每帧打出的字符数（速度控制） */
  charsPerFrame?: number;
};

export const MessageBubble: React.FC<Props> = ({
  role,
  text,
  startFrame,
  charsPerFrame = 1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  // 气泡整体弹入动画
  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 200 },
    durationInFrames: 20,
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [30, 0]);

  // 打字机效果：字符数随帧增长
  const charsToShow = Math.min(
    text.length,
    Math.floor(localFrame * charsPerFrame)
  );
  const displayText = text.slice(0, charsToShow);

  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 24,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* 头像 */}
      <Img
        src={staticFile(isUser ? "shared/avatar1.jpg" : "shared/avatar.jpg")}
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: isUser
            ? "2px solid #6C63FF"
            : "2px solid #00C896",
        }}
      />

      {/* 气泡 */}
      <div
        style={{
          maxWidth: "65%",
          backgroundColor: isUser ? "#6C63FF" : "#1E2A3A",
          color: "#FFFFFF",
          borderRadius: isUser
            ? "20px 20px 4px 20px"
            : "20px 20px 20px 4px",
          padding: "18px 22px",
          fontSize: 26,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {displayText}
        {/* 打字光标：只在还没打完时显示 */}
        {charsToShow < text.length && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              backgroundColor: "#FFFFFF",
              marginLeft: 3,
              verticalAlign: "text-bottom",
              opacity: Math.floor(localFrame / 8) % 2 === 0 ? 1 : 0,
            }}
          />
        )}
      </div>
    </div>
  );
};
