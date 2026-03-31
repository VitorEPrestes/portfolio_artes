import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const MODELS = [
  {
    name: "Cristal",
    geometry: "icosahedron",
    color: 0x39ff14,
    wireColor: 0x00d4ff,
    scale: 1.6,
  },
  {
    name: "Totem",
    geometry: "cylinder",
    color: 0xff006e,
    wireColor: 0xffe600,
    scale: 1.4,
  },
  {
    name: "Esfera Geo",
    geometry: "dodecahedron",
    color: 0x00d4ff,
    wireColor: 0xb026ff,
    scale: 1.5,
  },
  {
    name: "Pirâmide",
    geometry: "tetrahedron",
    color: 0xffe600,
    wireColor: 0xff006e,
    scale: 1.8,
  },
  {
    name: "Cubo Pixel",
    geometry: "box",
    color: 0xb026ff,
    wireColor: 0x39ff14,
    scale: 1.4,
  },
  {
    name: "Torus Poly",
    geometry: "torus",
    color: 0xff6b00,
    wireColor: 0x00d4ff,
    scale: 1.3,
  },
];

function createGeometry(type) {
  switch (type) {
    case "icosahedron":
      return new THREE.IcosahedronGeometry(1, 1);
    case "cylinder":
      return new THREE.CylinderGeometry(0.6, 1, 2, 6);
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(1, 0);
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(1.2, 1);
    case "box":
      return new THREE.BoxGeometry(1.4, 1.4, 1.4);
    case "torus":
      return new THREE.TorusGeometry(0.8, 0.35, 6, 8);
    default:
      return new THREE.IcosahedronGeometry(1, 1);
  }
}

export default function LowPolyViewer({
  modelIndex = 0,
  lowPower = false,
  interactive = true,
}) {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const renderFrameRef = useRef(() => {});
  const zoomRef = useRef(4);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(true);
  const resumeRotateTimerRef = useRef(null);
  const rafRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (webglFailed) return;
    const container = mountRef.current;
    if (!container) return;

    const isMobile =
      lowPower ||
      (typeof window !== "undefined" &&
        window.matchMedia("(max-width: 900px)").matches);

    const model = MODELS[modelIndex % MODELS.length];

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 4;
    cameraRef.current = camera;
    zoomRef.current = 4;

    // Renderer — wrap in try/catch for mobile WebGL failures
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    if (!renderer.domElement) {
      setWebglFailed(true);
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2),
    );
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(3, 4, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(model.wireColor, 0.3);
    backLight.position.set(-3, -2, -3);
    scene.add(backLight);

    // Create mesh group
    const group = new THREE.Group();

    const geometry = createGeometry(model.geometry);

    // Solid mesh with flat shading
    const material = new THREE.MeshStandardMaterial({
      color: model.color,
      flatShading: true,
      roughness: 0.6,
      metalness: 0.2,
    });
    const solidMesh = new THREE.Mesh(geometry, material);
    group.add(solidMesh);

    // Wireframe overlay
    const wireGeometry = new THREE.WireframeGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: model.wireColor,
      transparent: true,
      opacity: 0.3,
    });
    const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    group.add(wireframe);

    group.scale.setScalar(model.scale);
    scene.add(group);

    let autoRotate = !isMobile;

    const renderFrame = () => {
      if (!isVisibleRef.current) return;
      renderer.render(scene, camera);
    };
    renderFrameRef.current = renderFrame;

    // Handle resize — also handles initial 0×0 sizing
    const applySize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderFrame();
    };

    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(container);

    // Initial sizing (may be 0 on mobile, ResizeObserver will catch it)
    applySize();

    let visibilityObserver;
    if (typeof IntersectionObserver !== "undefined") {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) renderFrame();
        },
        { threshold: 0.1 },
      );
      visibilityObserver.observe(container);
    }

    // Drag rotation
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      autoRotate = false;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      container.style.cursor = "grabbing";
      if (resumeRotateTimerRef.current) {
        clearTimeout(resumeRotateTimerRef.current);
        resumeRotateTimerRef.current = null;
      }
      if (typeof container.setPointerCapture === "function") {
        container.setPointerCapture(e.pointerId);
      }
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;
      group.rotation.x += dy * 0.005;
      group.rotation.y += dx * 0.005;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      if (isMobile) renderFrame();
    };

    const onPointerUp = (e) => {
      isDraggingRef.current = false;
      container.style.cursor = interactive ? "grab" : "default";
      if (typeof container.releasePointerCapture === "function") {
        try {
          container.releasePointerCapture(e.pointerId);
        } catch {
          // no-op
        }
      }
      if (!isMobile) {
        resumeRotateTimerRef.current = setTimeout(() => {
          if (!isDraggingRef.current) autoRotate = true;
        }, 3000);
      }
    };

    if (interactive) {
      container.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    }

    if (!isMobile) {
      const animate = () => {
        rafRef.current = requestAnimationFrame(animate);
        if (!isVisibleRef.current) return;

        if (autoRotate && !isDraggingRef.current) {
          group.rotation.y += 0.005;
          group.rotation.x += 0.002;
        }

        renderer.render(scene, camera);
      };
      animate();
    } else {
      renderFrame();
    }

    container.style.cursor = interactive ? "grab" : "default";

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeRotateTimerRef.current)
        clearTimeout(resumeRotateTimerRef.current);
      if (visibilityObserver) visibilityObserver.disconnect();
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelIndex, webglFailed, lowPower, interactive]);

  const zoomBy = (delta) => {
    const camera = cameraRef.current;
    if (!camera) return;
    const nextZoom = Math.min(7, Math.max(2.2, zoomRef.current + delta));
    if (nextZoom === zoomRef.current) return;
    zoomRef.current = nextZoom;
    camera.position.z = nextZoom;
    camera.updateProjectionMatrix();
    renderFrameRef.current();
  };

  if (webglFailed) {
    const model = MODELS[modelIndex % MODELS.length];
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          background: `radial-gradient(circle, #${model.color.toString(16).padStart(6, "0")}22, #0d0d0d)`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.45rem",
            color: `#${model.wireColor.toString(16).padStart(6, "0")}`,
            textTransform: "uppercase",
            letterSpacing: "1px",
            textAlign: "center",
            padding: "12px",
          }}
        >
          3D indisponível
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          touchAction: interactive ? "none" : "pan-y",
        }}
      />

      {interactive && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            zIndex: 3,
          }}
        >
          <button
            type="button"
            aria-label="Aproximar modelo"
            onClick={() => zoomBy(-0.35)}
            style={{
              width: 28,
              height: 28,
              border: "1px solid rgba(57, 255, 20, 0.35)",
              background: "rgba(8, 8, 8, 0.78)",
              color: "#39ff14",
              fontFamily: "var(--font-pixel)",
              fontSize: "0.65rem",
              lineHeight: 1,
            }}
          >
            +
          </button>
          <button
            type="button"
            aria-label="Afastar modelo"
            onClick={() => zoomBy(0.35)}
            style={{
              width: 28,
              height: 28,
              border: "1px solid rgba(57, 255, 20, 0.35)",
              background: "rgba(8, 8, 8, 0.78)",
              color: "#39ff14",
              fontFamily: "var(--font-pixel)",
              fontSize: "0.65rem",
              lineHeight: 1,
            }}
          >
            -
          </button>
        </div>
      )}
    </div>
  );
}

export { MODELS };
