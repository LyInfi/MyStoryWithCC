import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// TikTok 红色
const TT_RED = "#FE2C55";

// 心形 SVG
const HeartIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={TT_RED}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// 关注按钮（头像 + 红色 + 徽章）
const FollowButton: React.FC = () => (
  <div style={{ position: "relative", width: 80, height: 80 }}>
    <Img
      src={staticFile("shared/avatar1.jpg")}
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #fff",
      }}
    />
    {/* 红色 + 徽章 */}
    <div
      style={{
        position: "absolute",
        bottom: -12,
        left: "50%",
        transform: "translateX(-50%)",
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: TT_RED,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #0D1117",
      }}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    </div>
  </div>
);

// 单个侧边栏动作项
const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  delay: number;
}> = ({ icon, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 180 },
    durationInFrames: 70,
  });

  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [60, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {icon}
      <span
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: 600,
          fontFamily:
            "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 80,
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleScale = interpolate(titleEntrance, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 80,
        fontFamily:
          "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* @我和CC */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 3,
            borderRadius: 2,
            background: "linear-gradient(90deg, #6C63FF, #00C896)",
          }}
        />
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            background: "linear-gradient(135deg, #6C63FF 0%, #00C896 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 4,
          }}
        >
          @我和CC
        </div>
      </div>

      {/* 关注/点赞出现音效 */}
      <Sequence from={50} durationInFrames={60}>
        <Audio src={staticFile("shared/sfx_confirm.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <Audio src={staticFile("shared/sfx_confirm.mp3")} volume={0.7} />
      </Sequence>

      {/* TikTok 风格侧边栏按钮 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 80,
          alignItems: "flex-start",
        }}
      >
        <SidebarItem
          icon={<FollowButton />}
          label="关注"
          delay={50}
        />
        <SidebarItem
          icon={<HeartIcon size={80} />}
          label="点赞"
          delay={90}
        />
      </div>
    </AbsoluteFill>
  );
};
