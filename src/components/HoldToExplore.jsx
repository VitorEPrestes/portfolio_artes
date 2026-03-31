import { useState, useRef, useCallback, useEffect } from "react";
import "./HoldToExplore.css";

const HOLD_DURATION = 2500; // ms to fully charge
const PIXEL_SPAWN_INTERVAL = 60; // ms between pixel spawns
const PIXEL_COLORS = ["#39ff14", "#00d4ff", "#b026ff", "#ffe600", "#ff006e"];
const POP_FLASH_DURATION = 130;
const NOTICE_DURATION = 2600;

export default function HoldToExplore({ onActivate }) {
  const [progress, setProgress] = useState(0);
  const [pixels, setPixels] = useState([]);
  const [isHolding, setIsHolding] = useState(false);
  const [popState, setPopState] = useState(null); // null | 'flash' | 'black'
  const [popPixels, setPopPixels] = useState([]);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [nucleus, setNucleus] = useState({ x: 0.5, y: 0.5 });
  const [fxOrigin, setFxOrigin] = useState({ x: 50, y: 50 });

  const holdStartRef = useRef(null);
  const rafRef = useRef(null);
  const pixelTimerRef = useRef(null);
  const btnRef = useRef(null);
  const pixelIdRef = useRef(0);
  const activatedRef = useRef(false);

  const getGlowClass = (p) => {
    if (p > 0.7) return "hold-explore__btn--glow-3";
    if (p > 0.35) return "hold-explore__btn--glow-2";
    if (p > 0.1) return "hold-explore__btn--glow-1";
    return "";
  };

  const spawnPixel = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const side = Math.floor(Math.random() * 4);
    const outside = Math.max(56, Math.min(rect.width, rect.height) * 0.6);
    const nucleusX = nucleus.x * rect.width;
    const nucleusY = nucleus.y * rect.height;
    let startX, startY, endX, endY;

    // Pixels enter from outside the button toward the center
    switch (side) {
      case 0: // top
        startX = Math.random() * rect.width;
        startY = -outside;
        endX = nucleusX + (Math.random() - 0.5) * rect.width * 0.12;
        endY = nucleusY + (Math.random() - 0.5) * rect.height * 0.12;
        break;
      case 1: // right
        startX = rect.width + outside;
        startY = Math.random() * rect.height;
        endX = nucleusX + (Math.random() - 0.5) * rect.width * 0.12;
        endY = nucleusY + (Math.random() - 0.5) * rect.height * 0.12;
        break;
      case 2: // bottom
        startX = Math.random() * rect.width;
        startY = rect.height + outside;
        endX = nucleusX + (Math.random() - 0.5) * rect.width * 0.12;
        endY = nucleusY + (Math.random() - 0.5) * rect.height * 0.12;
        break;
      default: // left
        startX = -outside;
        startY = Math.random() * rect.height;
        endX = nucleusX + (Math.random() - 0.5) * rect.width * 0.12;
        endY = nucleusY + (Math.random() - 0.5) * rect.height * 0.12;
    }

    const id = ++pixelIdRef.current;
    const color = PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)];
    const duration = 300 + Math.random() * 400;

    setPixels((prev) => [
      ...prev.slice(-30), // keep max 30 pixels
      { id, startX, startY, endX, endY, color, duration },
    ]);
  }, [nucleus.x, nucleus.y]);

  const createPopPixels = useCallback(() => {
    if (!btnRef.current) return [];
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const burst = [];
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.5;
      const dist = 100 + Math.random() * 300;
      burst.push({
        id: i,
        x: cx,
        y: cy,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        color: PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)],
        size: 4 + Math.random() * 8,
      });
    }
    return burst;
  }, []);

  const tick = useCallback(() => {
    if (!holdStartRef.current) return;
    const elapsed = Date.now() - holdStartRef.current;
    const p = Math.min(elapsed / HOLD_DURATION, 1);
    setProgress(p);

    if (btnRef.current && typeof window !== "undefined") {
      const rect = btnRef.current.getBoundingClientRect();
      setFxOrigin({
        x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      });
    }

    // Orbiting nucleus for pixel convergence while charging.
    setNucleus({
      x: 0.5 + Math.sin(elapsed * 0.004) * 0.2,
      y: 0.5 + Math.cos(elapsed * 0.003) * 0.16,
    });

    if (p >= 1 && !activatedRef.current) {
      activatedRef.current = true;
      setIsHolding(false);
      holdStartRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pixelTimerRef.current) clearInterval(pixelTimerRef.current);

      // Pop!
      setPopPixels(createPopPixels());
      setPopState("flash");
      setNoticeVisible(true);

      onActivate?.();

      setTimeout(() => {
        setPopState(null);
      }, POP_FLASH_DURATION);

      setTimeout(() => {
        setNoticeVisible(false);
      }, NOTICE_DURATION);

      setTimeout(() => {
        activatedRef.current = false;
        setProgress(0);
        setPixels([]);
        setNucleus({ x: 0.5, y: 0.5 });
      }, POP_FLASH_DURATION + 120);

      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [onActivate, createPopPixels]);

  const startHold = useCallback(
    (e) => {
      e.preventDefault();
      if (activatedRef.current) return;
      holdStartRef.current = Date.now();
      setIsHolding(true);
      setPixels([]);
      setNucleus({ x: 0.5, y: 0.5 });
      rafRef.current = requestAnimationFrame(tick);

      pixelTimerRef.current = setInterval(() => {
        spawnPixel();
      }, PIXEL_SPAWN_INTERVAL);
    },
    [tick, spawnPixel],
  );

  const endHold = useCallback(() => {
    if (activatedRef.current) return;
    holdStartRef.current = null;
    setIsHolding(false);
    setProgress(0);
    setPixels([]);
    setNucleus({ x: 0.5, y: 0.5 });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (pixelTimerRef.current) clearInterval(pixelTimerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pixelTimerRef.current) clearInterval(pixelTimerRef.current);
    };
  }, []);

  const glowClass = isHolding ? getGlowClass(progress) : "";
  const isMobileHold =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;
  const buttonScale = isMobileHold ? 1 + progress * 0.06 : 1 + progress * 0.16;
  const vibrateX = isMobileHold ? 0.5 + progress * 1.5 : 1 + progress * 4.5;
  const vibrateY = isMobileHold ? 0.4 + progress * 1.2 : 0.8 + progress * 3.8;
  const vibrateDuration = Math.max(0.05, 0.16 - progress * 0.1);
  const tunnelPulse = Math.max(0.4, 1.2 - progress * 0.7);
  const pageFxOpacity = isHolding ? 0.15 + progress * 0.65 : 0;

  return (
    <div className="hold-explore">
      <div
        className={`hold-explore__page-fx ${isHolding ? "hold-explore__page-fx--active" : ""}`}
        style={{
          "--fx-x": `${fxOrigin.x}%`,
          "--fx-y": `${fxOrigin.y}%`,
          "--fx-opacity": pageFxOpacity,
          "--fx-speed": `${Math.max(0.4, 1.4 - progress)}s`,
        }}
      />

      <span className="hold-explore__hint">◆ Modelos Low Poly 3D ◆</span>

      <div
        className={`hold-explore__tunnel ${isHolding ? "hold-explore__tunnel--active" : ""}`}
        style={{ "--tunnel-pulse": `${tunnelPulse}s` }}
      >
        <span className="hold-explore__tunnel-ring hold-explore__tunnel-ring--1" />
        <span className="hold-explore__tunnel-ring hold-explore__tunnel-ring--2" />
        <span className="hold-explore__tunnel-ring hold-explore__tunnel-ring--3" />
        <span className="hold-explore__orbit hold-explore__orbit--a" />
        <span className="hold-explore__orbit hold-explore__orbit--b" />

        <button
          ref={btnRef}
          className={`hold-explore__btn ${isHolding ? "hold-explore__btn--vibrate" : ""} ${glowClass}`}
          style={{
            "--btn-scale": buttonScale,
            "--vibe-x": `${vibrateX}px`,
            "--vibe-y": `${vibrateY}px`,
            "--vibe-duration": `${vibrateDuration}s`,
          }}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onPointerCancel={endHold}
        >
          {/* Progress fill */}
          <div
            className="hold-explore__progress"
            style={{ width: `${progress * 100}%` }}
          />

          {/* Pixel particles */}
          <div className="hold-explore__pixels">
            {pixels.map((px) => (
              <PixelParticle key={px.id} pixel={px} />
            ))}
          </div>

          <span
            className="hold-explore__nucleus"
            style={{
              left: `${nucleus.x * 100}%`,
              top: `${nucleus.y * 100}%`,
            }}
          />

          <span className="hold-explore__btn-text">
            {progress >= 1
              ? "▶ ENTRAR ◀"
              : isHolding
                ? `[ ${Math.floor(progress * 100)}% ]`
                : "Segure para Explorar"}
          </span>
        </button>
        <div className="hold-explore__tunnel-core" />
      </div>

      {noticeVisible && (
        <p className="hold-explore__construction-msg" role="status" aria-live="polite">
          Esta pagina esta em construcao.
        </p>
      )}

      {/* Pop explosion */}
      {popState === "flash" && (
        <div className="hold-explore__pop">
          <div className="hold-explore__pop-flash" />
          {popPixels.map((px) => (
            <div
              key={px.id}
              className="hold-explore__pop-pixel"
              style={{
                left: px.x,
                top: px.y,
                width: px.size,
                height: px.size,
                background: px.color,
                "--dx": `${px.dx}px`,
                "--dy": `${px.dy}px`,
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}

function PixelParticle({ pixel }) {
  const { startX, startY, endX, endY, color, duration } = pixel;

  return (
    <div
      className="hold-explore__pixel"
      style={{
        left: endX,
        top: endY,
        background: color,
        boxShadow: `0 0 4px ${color}`,
        animationDuration: `${duration}ms`,
        "--sx": `${startX - endX}px`,
        "--sy": `${startY - endY}px`,
      }}
    />
  );
}
