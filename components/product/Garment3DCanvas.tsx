"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface Garment3DCanvasProps {
  skuId?: string; // TC-TEE-001, TC-HOODIE-001, TC-JERSEY-001
  garmentType?: "tee" | "hoodie" | "jersey";
  colorHex?: string;
  designUrl?: string | null;
  className?: string;
}

// ─── PROCEDURAL 3D GARMENT MESH ───
function GarmentMesh({
  type = "tee",
  color = "#121212",
  designUrl,
  wireframe = false,
}: {
  type: "tee" | "hoodie" | "jersey";
  color: string;
  designUrl?: string | null;
  wireframe: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [decalTexture, setDecalTexture] = useState<THREE.Texture | null>(null);

  // Load design texture safely without crashing on data URIs
  useEffect(() => {
    let active = true;
    let createdTexture: THREE.Texture | null = null;

    if (designUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!active) return;
        const tex = new THREE.Texture(img);
        tex.needsUpdate = true;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        createdTexture = tex;
        setDecalTexture(tex);
      };
      img.src = designUrl;
    }

    return () => {
      active = false;
      if (createdTexture) createdTexture.dispose();
    };
  }, [designUrl]);

  const activeDecalTexture = designUrl ? decalTexture : null;

  // Main fabric material
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.88,
      metalness: 0.08,
      wireframe,
      side: THREE.DoubleSide,
    });
  }, [color, wireframe]);

  // Accent/trim material (ribbed collar, cuffs, hem)
  const trimMaterial = useMemo(() => {
    const darker = new THREE.Color(color).multiplyScalar(0.75);
    return new THREE.MeshStandardMaterial({
      color: darker,
      roughness: 0.95,
      metalness: 0.02,
      wireframe,
    });
  }, [color, wireframe]);

  // Geometry dimensions based on garment type
  const isHoodie = type === "hoodie";
  const isJersey = type === "jersey";

  const torsoWidth = isHoodie ? 2.4 : isJersey ? 2.1 : 2.2;
  const torsoHeight = isHoodie ? 2.8 : 2.6;
  const torsoDepth = isHoodie ? 0.9 : 0.7;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ─── TORSO / BODY ─── */}
      <mesh position={[0, 0, 0]} material={fabricMaterial} castShadow receiveShadow>
        <boxGeometry args={[torsoWidth, torsoHeight, torsoDepth, 16, 16, 16]} />
      </mesh>

      {/* ─── COLLAR / NECK ─── */}
      {!isHoodie && (
        <mesh position={[0, torsoHeight / 2 + 0.1, 0]} material={trimMaterial}>
          <cylinderGeometry args={[0.55, 0.65, 0.22, 32, 1, true]} />
        </mesh>
      )}

      {/* ─── HOODIE HOOD ─── */}
      {isHoodie && (
        <group position={[0, torsoHeight / 2 + 0.65, -0.1]}>
          <mesh material={fabricMaterial} castShadow>
            <sphereGeometry args={[0.85, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
          </mesh>
          {/* Hood Opening Trim */}
          <mesh position={[0, -0.1, 0.45]} rotation={[Math.PI / 4, 0, 0]} material={trimMaterial}>
            <torusGeometry args={[0.5, 0.06, 16, 32]} />
          </mesh>
          {/* Drawstrings */}
          <mesh position={[-0.2, -0.7, 0.4]} material={trimMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          </mesh>
          <mesh position={[0.2, -0.7, 0.4]} material={trimMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          </mesh>
        </group>
      )}

      {/* ─── SLEEVES (LEFT & RIGHT) ─── */}
      {/* Left Sleeve */}
      <group
        position={[-torsoWidth / 2 - 0.45, torsoHeight / 2 - 0.45, 0]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry
            args={[
              0.42,
              isHoodie ? 0.35 : 0.38,
              isHoodie ? 2.2 : isJersey ? 1.0 : 1.2,
              24,
            ]}
          />
        </mesh>
        {/* Sleeve Cuff */}
        <mesh
          position={[0, -(isHoodie ? 1.1 : isJersey ? 0.5 : 0.6), 0]}
          material={trimMaterial}
        >
          <cylinderGeometry args={[0.36, 0.36, 0.15, 24]} />
        </mesh>
      </group>

      {/* Right Sleeve */}
      <group
        position={[torsoWidth / 2 + 0.45, torsoHeight / 2 - 0.45, 0]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry
            args={[
              0.42,
              isHoodie ? 0.35 : 0.38,
              isHoodie ? 2.2 : isJersey ? 1.0 : 1.2,
              24,
            ]}
          />
        </mesh>
        {/* Sleeve Cuff */}
        <mesh
          position={[0, -(isHoodie ? 1.1 : isJersey ? 0.5 : 0.6), 0]}
          material={trimMaterial}
        >
          <cylinderGeometry args={[0.36, 0.36, 0.15, 24]} />
        </mesh>
      </group>

      {/* ─── BOTTOM HEM TRIM ─── */}
      <mesh position={[0, -torsoHeight / 2 - 0.06, 0]} material={trimMaterial}>
        <boxGeometry args={[torsoWidth + 0.04, 0.16, torsoDepth + 0.04]} />
      </mesh>

      {/* ─── KANGAROO POCKET (HOODIE ONLY) ─── */}
      {isHoodie && (
        <mesh position={[0, -0.4, torsoDepth / 2 + 0.08]} material={fabricMaterial}>
          <boxGeometry args={[1.3, 0.75, 0.12]} />
        </mesh>
      )}

      {/* ─── ATHLETIC V-INSET / PIPING (JERSEY ONLY) ─── */}
      {isJersey && (
        <group position={[0, 0.4, torsoDepth / 2 + 0.02]}>
          <mesh material={trimMaterial}>
            <torusGeometry args={[0.4, 0.03, 12, 24, Math.PI]} />
          </mesh>
        </group>
      )}

      {/* ─── PRINT ZONE / DECAL TEXTURE MAPPING ─── */}
      {activeDecalTexture && (
        <mesh
          position={[0, isHoodie ? 0.25 : 0.15, torsoDepth / 2 + 0.015]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[1.35, 1.35]} />
          <meshBasicMaterial
            map={activeDecalTexture}
            transparent={true}
            opacity={0.96}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ─── DEFAULT THREADCORE INSIGNIA WHEN NO CUSTOM GRAPHIC ─── */}
      {!activeDecalTexture && (
        <mesh
          position={[0, isHoodie ? 0.25 : 0.15, torsoDepth / 2 + 0.01]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[0.9, 0.4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} wireframe />
        </mesh>
      )}
    </group>
  );
}

// ─── SCENE ENVIRONMENT WITH LIGHTS & TURNTABLE ───
function SceneContent({
  type,
  color,
  designUrl,
  autoRotate,
  wireframe,
  controlsRef,
}: {
  type: "tee" | "hoodie" | "jersey";
  color: string;
  designUrl?: string | null;
  autoRotate: boolean;
  wireframe: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const rootRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && rootRef.current) {
      rootRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <>
      {/* Brutalist Studio Lighting Setup */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 4, -4]} intensity={0.6} color="#e4e4e7" />
      <directionalLight position={[0, -5, -5]} intensity={0.25} />
      <pointLight position={[0, 3, 2]} intensity={0.5} />

      {/* Rotating Garment Container */}
      <group ref={rootRef}>
        <Center top>
          <GarmentMesh
            type={type}
            color={color}
            designUrl={designUrl}
            wireframe={wireframe}
          />
        </Center>
      </group>

      {/* Studio Floor Contact Shadow */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.65}
        scale={8}
        blur={2}
        far={4}
      />

      {/* Coordinate Grid for Brutalist Engineering Feel */}
      <gridHelper args={[10, 10, 0x333333, 0x1f1f1f]} position={[0, -1.81, 0]} />

      {/* Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={9.0}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

export default function Garment3DCanvas({
  skuId,
  garmentType = "tee",
  colorHex = "#121212",
  designUrl,
  className = "",
}: Garment3DCanvasProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Resolve garment type from SKU if available
  const resolvedType = useMemo<"tee" | "hoodie" | "jersey">(() => {
    if (skuId?.includes("HOD") || skuId?.includes("HOODIE")) return "hoodie";
    if (skuId?.includes("JER") || skuId?.includes("JERSEY")) return "jersey";
    return garmentType;
  }, [skuId, garmentType]);

  const resetView = (angle: "front" | "back" | "angle") => {
    if (!controlsRef.current) return;
    setAutoRotate(false);
    if (angle === "front") {
      controlsRef.current.setAzimuthalAngle(0);
      controlsRef.current.setPolarAngle(Math.PI / 2.1);
    } else if (angle === "back") {
      controlsRef.current.setAzimuthalAngle(Math.PI);
      controlsRef.current.setPolarAngle(Math.PI / 2.1);
    } else if (angle === "angle") {
      controlsRef.current.setAzimuthalAngle(Math.PI / 4);
      controlsRef.current.setPolarAngle(Math.PI / 2.3);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[380px] bg-surface-1 border border-border-subtle flex flex-col select-none ${className}`}
    >
      {/* 3D Canvas Header Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-surface-2/80 backdrop-blur-md px-2.5 py-1 border border-border-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[8px] uppercase tracking-widest text-text-secondary font-bold">
            Three.js WebGL Engine • 360° Turntable
          </span>
        </div>

        {/* Quick Angle Presets */}
        <div className="flex items-center gap-1 pointer-events-auto bg-surface-2/80 backdrop-blur-md p-1 border border-border-subtle font-mono text-[8px] uppercase">
          <button
            onClick={() => resetView("front")}
            className="px-2 py-0.5 hover:bg-surface-3 text-text-secondary hover:text-foreground cursor-pointer"
          >
            Front
          </button>
          <button
            onClick={() => resetView("angle")}
            className="px-2 py-0.5 hover:bg-surface-3 text-text-secondary hover:text-foreground cursor-pointer"
          >
            45°
          </button>
          <button
            onClick={() => resetView("back")}
            className="px-2 py-0.5 hover:bg-surface-3 text-text-secondary hover:text-foreground cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>

      {/* R3F WebGL Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent
            type={resolvedType}
            color={colorHex}
            designUrl={designUrl}
            autoRotate={autoRotate}
            wireframe={wireframe}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      {/* Bottom Interactive Toolbar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="font-mono text-[8px] uppercase tracking-wider text-text-muted bg-surface-2/80 px-2 py-1 border border-border-subtle hidden sm:inline">
          Drag to rotate • Scroll to zoom
        </span>

        <div className="flex items-center gap-1.5 pointer-events-auto ml-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider border transition-colors cursor-pointer ${
              autoRotate
                ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-400 font-bold"
                : "bg-surface-2/90 border-border-subtle text-text-muted hover:text-foreground"
            }`}
          >
            Auto Rotate: {autoRotate ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider border transition-colors cursor-pointer ${
              wireframe
                ? "bg-foreground text-background font-bold"
                : "bg-surface-2/90 border-border-subtle text-text-muted hover:text-foreground"
            }`}
          >
            Wireframe: {wireframe ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}
