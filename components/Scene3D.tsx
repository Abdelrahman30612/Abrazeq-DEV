import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Explicitly define Three.js elements in JSX.IntrinsicElements to resolve TypeScript errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      icosahedronGeometry: any;
    }
  }
}

const FloatingCube = ({ position, color, wireframe = false }: { position: [number, number, number], color: string, wireframe?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color} 
          wireframe={wireframe} 
          emissive={color}
          emissiveIntensity={wireframe ? 2 : 0.5}
          transparent
          opacity={wireframe ? 0.3 : 0.8}
        />
      </mesh>
    </Float>
  );
};

const FloatingIcosahedron = ({ position, scale }: { position: [number, number, number], scale: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
  
    useFrame((state, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.z += delta * 0.1;
        meshRef.current.rotation.y -= delta * 0.2;
      }
    });
  
    return (
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={meshRef} position={position} scale={scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color="#d8b4fe" 
            wireframe 
            emissive="#a855f7"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>
    );
  };

const Scene3D: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-1 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4c1d95" />
        
        {/* Abstract shapes representing structure and code */}
        <FloatingCube position={[-4, 2, -5]} color="#7e22ce" wireframe />
        <FloatingCube position={[4, -2, -3]} color="#a855f7" wireframe />
        <FloatingCube position={[0, 4, -8]} color="#4c1d95" />
        
        <FloatingIcosahedron position={[3, 3, -4]} scale={0.8} />
        <FloatingIcosahedron position={[-3, -3, -2]} scale={0.5} />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default Scene3D;