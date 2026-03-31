import { useEffect, useRef } from "react";
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

export default function LowPolyViewer({ modelIndex = 0 }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshGroupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationVelRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const rafRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const model = MODELS[modelIndex % MODELS.length];

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 4;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
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
    meshGroupRef.current = group;

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

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Initial sizing
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Drag rotation
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      rotationVelRef.current = { x: 0, y: 0 };
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      rotationVelRef.current = { x: dy * 0.005, y: dx * 0.005 };
      group.rotation.x += dy * 0.005;
      group.rotation.y += dx * 0.005;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      container.style.cursor = "grab";
      // Resume auto rotation after 3s
      setTimeout(() => {
        if (!isDraggingRef.current) autoRotateRef.current = true;
      }, 3000);
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Animation loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      if (autoRotateRef.current) {
        group.rotation.y += 0.005;
        group.rotation.x += 0.002;
      } else if (!isDraggingRef.current) {
        // Apply inertia
        group.rotation.x += rotationVelRef.current.x;
        group.rotation.y += rotationVelRef.current.y;
        rotationVelRef.current.x *= 0.95;
        rotationVelRef.current.y *= 0.95;
      }

      renderer.render(scene, camera);
    };
    animate();

    container.style.cursor = "grab";

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelIndex]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

export { MODELS };
