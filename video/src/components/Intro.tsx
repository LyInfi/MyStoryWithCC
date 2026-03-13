import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const INTRO_DURATION = 180;
export const CLICK_FRAME = 58;

// 时序
const ICON_IN = 0;        // Claude 图标入场
const MOUSE_START = 20;   // 鼠标开始移动
const TERMINAL_IN = 70;   // 终端弹出
const TITLE_IN = 105;     // 标题打字开始

// Claude 图标（圆形背景 + avatar）
const ClaudeIcon: React.FC<{ pressing: boolean }> = ({ pressing }) => {
  const scale = pressing ? 0.88 : 1;
  return (
    <div
      style={{
        width: 140,
        height: 140,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: pressing
          ? "0 0 0 6px rgba(207,120,52,0.5), 0 8px 32px rgba(0,0,0,0.6)"
          : "0 0 0 3px rgba(207,120,52,0.3), 0 16px 48px rgba(0,0,0,0.5)",
        transform: `scale(${scale})`,
        background: "#CF7834",
      }}
    >
      <Img
        src={staticFile("shared/avatar.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

// 箭头光标（热点在左上角 x=0, y=0）
const Cursor: React.FC<{ pressing: boolean }> = ({ pressing }) => (
  <svg
    width={38}
    height={44}
    viewBox="0 0 38 44"
    style={{
      transform: pressing ? "scale(0.87)" : "scale(1)",
      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
    }}
  >
    <path
      d="M6 2 L6 34 L14 26 L20 40 L25 38 L19 24 L30 24 Z"
      fill="white"
      stroke="#333"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// 点击涟漪
const Ripple: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const progress = interpolate(localFrame, [0, 28], [0, 1], { extrapolateRight: "clamp" });
  const size = interpolate(progress, [0, 1], [0, 200]);
  const opacity = interpolate(progress, [0, 0.2, 1], [0.7, 0.5, 0]);
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid rgba(207,120,52,0.9)",
        backgroundColor: "rgba(207,120,52,0.1)",
        transform: "translate(-50%, -50%)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// Mac 终端（大尺寸）
const Terminal: React.FC<{ title: string; typedChars: number }> = ({ title, typedChars }) => (
  <div
    style={{
      width: 820,
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
      fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    }}
  >
    {/* 标题栏 */}
    <div
      style={{
        backgroundColor: "#2D2D2D",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {[["#FF5F57","#C0403B"],["#FEBC2E","#C79920"],["#28C840","#1B9E2B"]].map(
        ([c, b], i) => (
          <div key={i} style={{ width: 15, height: 15, borderRadius: "50%", backgroundColor: c, border: `1px solid ${b}` }} />
        )
      )}
      <span style={{ flex: 1, textAlign: "center", fontSize: 14, color: "#9A9A9A", marginLeft: -55 }}>
        zsh — MyStoryWithCC
      </span>
    </div>

    {/* 终端内容：只显示标题 */}
    <div
      style={{
        backgroundColor: "#1A1A1A",
        padding: "48px 40px",
        minHeight: 180,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div>
        <span style={{
          color: "#FFFFFF",
          fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: 2,
        }}>
          {title.slice(0, typedChars)}
        </span>
        {typedChars < title.length && typedChars > 0 && (
          <span style={{
            display: "inline-block", width: 16, height: "1em",
            backgroundColor: "#fff", marginLeft: 4, verticalAlign: "text-bottom",
          }} />
        )}
      </div>
    </div>
  </div>
);

export const Intro: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Claude 图标入场
  const iconEntrance = spring({ frame: frame - ICON_IN, fps, config: { damping: 12, stiffness: 180 }, durationInFrames: 25 });
  const iconScale = interpolate(iconEntrance, [0, 1], [0, 1]);
  const iconOpacity = interpolate(iconEntrance, [0, 1], [0, 1]);

  // 图标点击后淡出
  const iconFadeOut = interpolate(frame, [CLICK_FRAME, TERMINAL_IN], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 鼠标位置（从右下移向图标中心）
  const mouseProgress = interpolate(frame, [MOUSE_START, CLICK_FRAME], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // 箭头热点在左上角，目标对准画布中心 (540, 960)
  const mouseX = interpolate(mouseProgress, [0, 1], [900, 540]);
  const mouseY = interpolate(mouseProgress, [0, 1], [1500, 960]);
  const mouseOpacity = interpolate(frame, [MOUSE_START, MOUSE_START + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 鼠标在终端弹出后淡出
  const mouseFadeOut = interpolate(frame, [TERMINAL_IN, TERMINAL_IN + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isPressing = frame >= CLICK_FRAME && frame < CLICK_FRAME + 14;

  // 终端弹出
  const terminalEntrance = spring({ frame: frame - TERMINAL_IN, fps, config: { damping: 16, stiffness: 200 }, durationInFrames: 35 });
  const terminalScale = interpolate(terminalEntrance, [0, 1], [0.4, 1]);
  const terminalOpacity = interpolate(terminalEntrance, [0, 1], [0, 1]);

  // 标题打字
  const charsToShow = Math.max(0, Math.floor((frame - TITLE_IN) * 2));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Claude 图标（点击后淡出） */}
      <div
        style={{
          position: "absolute",
          opacity: iconOpacity * iconFadeOut,
          transform: `scale(${iconScale})`,
        }}
      >
        <ClaudeIcon pressing={isPressing} />
      </div>

      {/* 终端窗口 */}
      {frame >= TERMINAL_IN && (
        <div
          style={{
            opacity: terminalOpacity,
            transform: `scale(${terminalScale})`,
          }}
        >
          <Terminal title={title} typedChars={charsToShow} />
        </div>
      )}

      {/* 鼠标 */}
      <div
        style={{
          position: "absolute",
          left: mouseX,
          top: mouseY,
          opacity: mouseOpacity * mouseFadeOut,
          pointerEvents: "none",
        }}
      >
        <Cursor pressing={isPressing} />
        {frame >= CLICK_FRAME && frame < CLICK_FRAME + 30 && (
          <Ripple localFrame={frame - CLICK_FRAME} />
        )}
      </div>
    </AbsoluteFill>
  );
};
