"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function EnergyRing({ radius, color, speed, delay }: { radius: number; color: string; speed: number; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15, side: THREE.DoubleSide }), [color]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + delay;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.4;
    ref.current.rotation.y = t * 0.5;
    ref.current.rotation.z = Math.cos(t * 0.2) * 0.2;
  });

  return (
    <mesh ref={ref} material={mat}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
    </mesh>
  );
}

function SpeedLines() {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i] = 0.02 + Math.random() * 0.08;
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
      <pointsMaterial color="#E8002D" size={0.03} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function ParticleCloud() {
  const count = 500;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const palette = [
      [0.91, 0, 0.176],
      [0.212, 0.443, 0.776],
      [0.153, 0.957, 0.824],
      [1, 0.502, 0],
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c[0];
      cols[i * 3 + 1] = c[1];
      cols[i * 3 + 2] = c[2];
    }
    return cols;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function GlowOrb({ color, position, scale }: { color: string; position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
    ref.current.scale.setScalar(scale + Math.sin(t * 0.8) * 0.1);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  );
}

function F1CarWireframe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.3 + t * 0.05;
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.05;
  });

  const wireframeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#E8002D",
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
    []
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#27F4D2",
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      }),
    []
  );

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} material={wireframeMat}>
        <boxGeometry args={[2.8, 0.3, 0.7]} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[1.7, 0.05, 0]} rotation={[0, 0, -0.1]} material={wireframeMat}>
        <boxGeometry args={[0.8, 0.15, 0.4]} />
      </mesh>

      {/* Rear wing */}
      <mesh position={[-1.5, 0.35, 0]} material={accentMat}>
        <boxGeometry args={[0.05, 0.4, 0.9]} />
      </mesh>
      <mesh position={[-1.5, 0.55, 0]} material={wireframeMat}>
        <boxGeometry args={[0.3, 0.06, 0.85]} />
      </mesh>

      {/* Front wing */}
      <mesh position={[1.85, -0.08, 0]} material={wireframeMat}>
        <boxGeometry args={[0.35, 0.04, 0.8]} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.85, -0.2, 0.45],
        [-0.85, -0.2, -0.45],
        [1.1, -0.2, 0.4],
        [1.1, -0.2, -0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} material={i < 2 ? wireframeMat : accentMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
        </mesh>
      ))}

      {/* Halo */}
      <mesh position={[0.6, 0.35, 0]} material={accentMat}>
        <torusGeometry args={[0.25, 0.02, 8, 16, Math.PI]} />
      </mesh>

      {/* Sidepods */}
      <mesh position={[0.1, 0.1, 0.35]} material={wireframeMat}>
        <boxGeometry args={[1.2, 0.2, 0.15]} />
      </mesh>
      <mesh position={[0.1, 0.1, -0.35]} material={wireframeMat}>
        <boxGeometry args={[1.2, 0.2, 0.15]} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050709"]} />
      <fog attach="fog" args={["#050709", 5, 18]} />

      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#E8002D" />
      <pointLight position={[-5, 3, -5]} intensity={0.2} color="#27F4D2" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <F1CarWireframe />
      </Float>

      <EnergyRing radius={3} color="#E8002D" speed={0.4} delay={0} />
      <EnergyRing radius={3.8} color="#3671C6" speed={0.3} delay={2} />
      <EnergyRing radius={4.5} color="#27F4D2" speed={0.25} delay={4} />
      <EnergyRing radius={5.2} color="#FF8000" speed={0.2} delay={1} />

      <SpeedLines />
      <ParticleCloud />

      <GlowOrb color="#E8002D" position={[3, 1, -2]} scale={1} />
      <GlowOrb color="#3671C6" position={[-3, -1, -3]} scale={0.8} />
      <GlowOrb color="#27F4D2" position={[2, -2, -4]} scale={0.6} />

      <Stars radius={80} depth={60} count={1500} factor={3} saturation={0} fade speed={0.5} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
