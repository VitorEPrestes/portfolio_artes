import { useState, useEffect, useMemo } from "react";
import LowPolyViewer, { MODELS } from "./LowPolyViewer";
import "./LowPolyPage.css";

const PIXEL_COLORS = ["#39ff14", "#00d4ff", "#b026ff", "#ffe600", "#ff006e"];

function generateBgShapes() {
  const shapes = [];
  const types = ["triangle", "diamond", "hexagon"];
  for (let i = 0; i < 15; i++) {
    shapes.push({
      id: i,
      type: types[i % types.length],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: PIXEL_COLORS[i % PIXEL_COLORS.length],
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 15}s`,
    });
  }
  return shapes;
}

function generateBgPixels() {
  const pixels = [];
  for (let i = 0; i < 42; i++) {
    pixels.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: PIXEL_COLORS[i % PIXEL_COLORS.length],
      size: `${2 + Math.floor(Math.random() * 4)}px`,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 8}s`,
      driftX: `${-40 + Math.random() * 80}px`,
      driftY: `${-20 + Math.random() * 40}px`,
    });
  }
  return pixels;
}

function generateBeams() {
  const beams = [];
  for (let i = 0; i < 7; i++) {
    beams.push({
      id: i,
      top: `${8 + i * 14}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${6 + Math.random() * 5}s`,
      angle: `${-15 + Math.random() * 30}deg`,
    });
  }
  return beams;
}

export default function LowPolyPage({ onClose }) {
  const [visible, setVisible] = useState(false);
  const bgShapes = useMemo(() => generateBgShapes(), []);
  const bgPixels = useMemo(() => generateBgPixels(), []);
  const beams = useMemo(() => generateBeams(), []);

  useEffect(() => {
    // Fade in after mount
    const t = setTimeout(() => setVisible(true), 50);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
      return;
    }
    setVisible(false);
    setTimeout(() => onClose?.(), 200);
  };

  return (
    <div
      className="lowpoly-page"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Background decorative shapes */}
      <div className="lowpoly-page__bg">
        <div className="lowpoly-page__bg-aurora" />
        <div className="lowpoly-page__bg-aurora lowpoly-page__bg-aurora--alt" />

        <div className="lowpoly-page__bg-beams">
          {beams.map((beam) => (
            <span
              key={beam.id}
              className="lowpoly-page__bg-beam"
              style={{
                top: beam.top,
                animationDelay: beam.delay,
                animationDuration: beam.duration,
                "--beam-angle": beam.angle,
              }}
            />
          ))}
        </div>

        <div className="lowpoly-page__bg-pixels">
          {bgPixels.map((px) => (
            <span
              key={px.id}
              className="lowpoly-page__bg-pixel"
              style={{
                left: px.left,
                top: px.top,
                background: px.color,
                width: px.size,
                height: px.size,
                animationDelay: px.delay,
                animationDuration: px.duration,
                "--drift-x": px.driftX,
                "--drift-y": px.driftY,
              }}
            />
          ))}
        </div>

        {bgShapes.map((shape) => (
          <div
            key={shape.id}
            className={`lowpoly-page__bg-shape lowpoly-page__bg-shape--${shape.type}`}
            style={{
              left: shape.left,
              top: shape.top,
              borderColor: shape.color,
              animationDelay: shape.delay,
              animationDuration: shape.duration,
            }}
          />
        ))}
      </div>

      {/* Pixel grid overlay */}
      <div className="lowpoly-page__grid-overlay" />

      {/* Content */}
      <div className="lowpoly-page__content">
        {/* Header */}
        <header className="lowpoly-page__header">
          <button className="lowpoly-page__back" onClick={handleClose}>
            <span className="lowpoly-page__back-arrow">◄</span>
            Voltar
          </button>
          <span className="lowpoly-page__logo">◆ Low Poly Studio ◆</span>
        </header>

        {/* Title */}
        <div
          className="lowpoly-page__title-section lowpoly-page__fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h1 className="lowpoly-page__title">Comissões Low Poly 3D</h1>
          <p className="lowpoly-page__subtitle">
            Modelos 3D estilizados em low poly para avatares, cenários e assets.
            Arraste para rotacionar cada modelo.
          </p>
          <div className="lowpoly-page__pixel-divider">
            {PIXEL_COLORS.map((color, i) => (
              <span key={i} style={{ background: color }} />
            ))}
          </div>
        </div>

        {/* Models grid */}
        <div className="lowpoly-page__grid">
          {MODELS.map((model, i) => (
            <div
              key={model.name}
              className="lowpoly-page__card lowpoly-page__fade-in"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              {/* Corner decorations */}
              <div className="lowpoly-page__card-corner lowpoly-page__card-corner--tl" />
              <div className="lowpoly-page__card-corner lowpoly-page__card-corner--tr" />
              <div className="lowpoly-page__card-corner lowpoly-page__card-corner--bl" />
              <div className="lowpoly-page__card-corner lowpoly-page__card-corner--br" />

              {/* 3D Viewer */}
              <div className="lowpoly-page__viewer">
                <LowPolyViewer modelIndex={i} />
                <span className="lowpoly-page__viewer-hint">
                  ↻ arraste para girar
                </span>
              </div>

              {/* Info */}
              <div className="lowpoly-page__card-info">
                <span className="lowpoly-page__card-name">{model.name}</span>
                <span className="lowpoly-page__card-tag">Low Poly</span>
              </div>
            </div>
          ))}
        </div>

        <section
          className="lowpoly-page__pricing lowpoly-page__fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          <h2 className="lowpoly-page__pricing-title">Valores e Entregáveis</h2>
          <p className="lowpoly-page__pricing-price">A partir de R$70</p>
          <p className="lowpoly-page__pricing-text">
            Inclui modelo texturizado em <strong>.bbmodel</strong> (modelo base,
            feito no Blockbench), <strong>.obj</strong>, <strong>.fbx</strong> e
            qualquer outro formato que o cliente solicitar.
          </p>
          <p className="lowpoly-page__pricing-warning">
            Prazo de entrega é de no minimo 1 mês, pode passar e irei te
            informar se for o caso.
          </p>
          <p className="lowpoly-page__pricing-warning">
            NÃO inclui rig. Caso queira que eu entregue com rig, o valor sobe (
            podendo sair pelo dobro do preço ).{" "}
          </p>
        </section>

        <section
          className="lowpoly-page__rig-info lowpoly-page__fade-in"
          style={{ animationDelay: "0.95s" }}
        >
          <h2 className="lowpoly-page__rig-title">Rig por Parenting (sem custo extra)</h2>
          <p className="lowpoly-page__rig-text">
            Também posso montar uma rig por <strong>parenting</strong>, em vez de
            uma rig com deformação do modelo, <strong>sem valor adicional</strong>.
          </p>

          <div className="lowpoly-page__rig-gallery">
            <figure className="lowpoly-page__rig-figure">
              <div className="lowpoly-page__rig-placeholder">Imagem: rig por parenting</div>
              <figcaption>Exemplo do tipo de rig por parenting</figcaption>
            </figure>
            <figure className="lowpoly-page__rig-figure">
              <div className="lowpoly-page__rig-placeholder">Imagem: rig com deformação</div>
              <figcaption>Comparação com rig que deforma o modelo</figcaption>
            </figure>
          </div>

          <p className="lowpoly-page__terms-note">
            Fora o prazo de entrega, os mesmos termos das comissões de desenho
            também se aplicam aqui.
          </p>
        </section>

        {/* CTA Section */}
        <div
          className="lowpoly-page__cta lowpoly-page__fade-in"
          style={{ animationDelay: "1s" }}
        >
          <h2 className="lowpoly-page__cta-title">Quer um modelo exclusivo?</h2>
          <p className="lowpoly-page__cta-text">
            Aceito comissões de modelos low poly personalizados para seu
            projeto.
            <br />
            VTuber, avatares, cenários e mais.
          </p>
          <a
            className="lowpoly-page__cta-btn"
            href="https://twitter.com/isolasbs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar Comissão
          </a>
        </div>
      </div>
    </div>
  );
}
