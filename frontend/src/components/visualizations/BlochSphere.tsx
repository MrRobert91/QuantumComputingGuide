import { useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  vector: { x: number; y: number; z: number };
  size?: number;
}

// Physics Bloch coords (x,y,z; +z = |0>) -> three.js axes (+Y is up on screen).
function toThree(v: { x: number; y: number; z: number }): [number, number, number] {
  return [v.x, v.z, v.y];
}

function ring(plane: "equator" | "xy" | "zy", color: string) {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    if (plane === "equator") pts.push([c, 0, s]);
    else if (plane === "xy") pts.push([c, s, 0]);
    else pts.push([0, s, c]);
  }
  return <Line points={pts} color={color} lineWidth={1} transparent opacity={0.35} />;
}

function AxisLabel({ pos, children }: { pos: [number, number, number]; children: ReactNode }) {
  return (
    <Html position={pos} center distanceFactor={undefined} zIndexRange={[10, 0]}>
      <span className="pointer-events-none select-none text-[11px] font-mono text-gray-400 whitespace-nowrap">
        {children}
      </span>
    </Html>
  );
}

function StateArrow({ vector }: { vector: Props["vector"] }) {
  const tip = toThree(vector);
  const { quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3(...tip);
    const len = dir.length();
    const q = new THREE.Quaternion();
    if (len > 1e-6) {
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    }
    return { quaternion: q, length: len };
  }, [tip]);

  return (
    <>
      <Line points={[[0, 0, 0], tip]} color="#2dd4bf" lineWidth={3} />
      {/* glowing base dot */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#0d9488" emissiveIntensity={0.6} />
      </mesh>
      {length > 1e-6 && (
        <mesh position={tip} quaternion={quaternion}>
          <coneGeometry args={[0.06, 0.16, 20]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#0d9488" emissiveIntensity={0.5} />
        </mesh>
      )}
    </>
  );
}

export function BlochSphere({ vector, size = 300 }: Props) {
  return (
    <div
      style={{ height: size }}
      className="w-full rounded-2xl bg-gradient-to-b from-black/40 to-black/10 border border-white/10 overflow-hidden"
    >
      <Canvas camera={{ position: [2.3, 1.7, 2.3], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={0.7} />
        <pointLight position={[-5, -3, -5]} intensity={0.25} color="#7c6cff" />

        {/* Sphere body */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#7c6cff"
            transparent
            opacity={0.1}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>

        {/* Guide rings */}
        {ring("equator", "#3a4467")}
        {ring("xy", "#2b3553")}
        {ring("zy", "#2b3553")}

        {/* Axes */}
        <Line points={[[-1.25, 0, 0], [1.25, 0, 0]]} color="#3a4467" lineWidth={1} />
        <Line points={[[0, -1.25, 0], [0, 1.25, 0]]} color="#3a4467" lineWidth={1} />
        <Line points={[[0, 0, -1.25], [0, 0, 1.25]]} color="#3a4467" lineWidth={1} />

        {/* Labels (HTML, no external font) */}
        <AxisLabel pos={[0, 1.42, 0]}>|0⟩</AxisLabel>
        <AxisLabel pos={[0, -1.42, 0]}>|1⟩</AxisLabel>
        <AxisLabel pos={[1.45, 0, 0]}>x</AxisLabel>
        <AxisLabel pos={[0, 0, 1.45]}>y</AxisLabel>

        <StateArrow vector={vector} />

        <OrbitControls enablePan={false} enableZoom minDistance={2} maxDistance={6} />
      </Canvas>
    </div>
  );
}
