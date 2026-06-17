import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  vector: { x: number; y: number; z: number };
  size?: number;
}

// Maps the physics Bloch coordinates (x,y,z; +z = |0>) to three.js axes
// where +Y is up on screen. We put |0> at the top (three +Y).
function toThree(v: { x: number; y: number; z: number }): [number, number, number] {
  return [v.x, v.z, v.y];
}

function Axis({
  dir,
  label,
}: {
  dir: [number, number, number];
  label: string;
}) {
  const end = new THREE.Vector3(...dir).multiplyScalar(1.3);
  return (
    <>
      <Line
        points={[
          [-end.x, -end.y, -end.z],
          [end.x, end.y, end.z],
        ]}
        color="#3b4252"
        lineWidth={1}
      />
      <Text position={[end.x * 1.12, end.y * 1.12, end.z * 1.12]} fontSize={0.16} color="#94a3b8">
        {label}
      </Text>
    </>
  );
}

function StateArrow({ vector }: { vector: Props["vector"] }) {
  const tip = toThree(vector);
  return (
    <>
      <Line points={[[0, 0, 0], tip]} color="#22d3ee" lineWidth={3} />
      <mesh position={tip}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0e7490" />
      </mesh>
    </>
  );
}

export function BlochSphere({ vector, size = 320 }: Props) {
  return (
    <div
      style={{ width: "100%", height: size }}
      className="rounded-xl bg-black/30 border border-white/10"
    >
      <Canvas camera={{ position: [2.4, 1.8, 2.4], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={0.6} />

        {/* Sphere */}
        <mesh>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color="#6e5cf6"
            transparent
            opacity={0.12}
            roughness={0.4}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#6e5cf6" wireframe transparent opacity={0.15} />
        </mesh>

        <Axis dir={[1, 0, 0]} label="x" />
        <Axis dir={[0, 1, 0]} label="|0⟩" />
        <Axis dir={[0, 0, 1]} label="y" />

        <StateArrow vector={vector} />

        <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
      </Canvas>
    </div>
  );
}
