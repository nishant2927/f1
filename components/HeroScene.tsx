"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function EnergyRing({ radius, color, speed }: { radius: number; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12, side: THREE.DoubleSide }), [color]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.4;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <mesh ref={ref} material={mat}>
      <torusGeometry args={[radius, 0.006, 8, 64]} />
    </mesh>
  );
}

function SpeedLines() {
  const count = 80;
  const ref = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      vel[i] = 0.03 + Math.random() * 0.06;
    }
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] -= velocities[i];
      if (arr[i * 3] < -10) arr[i * 3] = 10;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#E8002D" size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function ParticleCloud() {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const palette = [
      [0.91, 0, 0.176],
      [0.212, 0.443, 0.776],
      [0.153, 0.957, 0.824],
      [1, 0.502, 0],
    ];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c[0];
      cols[i * 3 + 1] = c[1];
      cols[i * 3 + 2] = c[2];
    }
    return [pos, cols];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function F1CarWireframe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.3 + t * 0.05;
  });

  const wireframeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#E8002D", wireframe: true, transparent: true, opacity: 0.1 }),
    []
  );
  const accentMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#27F4D2", wireframe: true, transparent: true, opacity: 0.06 }),
    []
  );

  return (
    <group ref={groupRef} scale={0.8}>
      <mesh position={[0, 0, 0]} material={wireframeMat}>
        <boxGeometry args={[2.8, 0.3, 0.7]} />
      </mesh>
      <mesh position={[1.7, 0.05, 0]} rotation={[0, 0, -0.1]} material={wireframeMat}>
        <boxGeometry args={[0.8, 0.15, 0.4]} />
      </mesh>
      <mesh position={[-1.5, 0.35, 0]} material={accentMat}>
        <boxGeometry args={[0.05, 0.4, 0.9]} />
      </mesh>
      <mesh position={[-1.5, 0.55, 0]} material={wireframeMat}>
        <boxGeometry args={[0.3, 0.06, 0.85]} />
      </mesh>
      <mesh position={[1.85, -0.08, 0]} material={wireframeMat}>
        <boxGeometry args={[0.35, 0.04, 0.8]} />
      </mesh>
      {[
        [-0.85, -0.2, 0.45],
        [-0.85, -0.2, -0.45],
        [1.1, -0.2, 0.4],
        [1.1, -0.2, -0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} material={i < 2 ? wireframeMat : accentMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 8]} />
        </mesh>
      ))}
      <mesh position={[0.6, 0.35, 0]} material={accentMat}>
        <torusGeometry args={[0.25, 0.02, 6, 12, Math.PI]} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050709"]} />
      <fog attach="fog" args={["#050709", 5, 16]} />

      <ambientLight intensity={0.1} />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <F1CarWireframe />
      </Float>

      <EnergyRing radius={3} color="#E8002D" speed={0.4} />
      <EnergyRing radius={4} color="#3671C6" speed={0.3} />
      <EnergyRing radius={5} color="#27F4D2" speed={0.2} />

      <SpeedLines />
      <ParticleCloud />

      <Stars radius={60} depth={40} count={600} factor={2} saturation={0} fade speed={0.3} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 50 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop="demand"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
