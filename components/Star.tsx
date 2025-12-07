import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';

interface StarProps {
  state: TreeState;
}

export const Star: React.FC<StarProps> = ({ state }) => {
  const meshRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(0, 20, 0)); // Start high up/random
  const targetPos = new THREE.Vector3(0, 6.2, 0); // Tip of tree (height is ~12 centered around offset)
  const chaosPos = new THREE.Vector3(0, 20, 0);

  useFrame((stateThree, delta) => {
    if (!meshRef.current) return;
    
    const target = state === TreeState.FORMED ? targetPos : chaosPos;
    
    currentPos.current.lerp(target, delta * 1.5);
    
    meshRef.current.position.copy(currentPos.current);
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.z = Math.sin(stateThree.clock.elapsedTime * 2) * 0.1;
    
    // Scale up when formed
    const targetScale = state === TreeState.FORMED ? 1 : 0.1;
    const currentScale = meshRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2);
    meshRef.current.scale.setScalar(nextScale);
  });

  return (
    <group ref={meshRef}>
      {/* Outer Glow */}
      <mesh>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
      </mesh>
      
      {/* Core Star */}
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={4} 
          toneMapped={false}
        />
      </mesh>
      
      {/* Rays */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, 0, (Math.PI / 3) * i]}>
          <boxGeometry args={[0.1, 2.5, 0.1]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={2} 
          />
        </mesh>
      ))}
    </group>
  );
};