import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { generatePositions } from '../utils/math';

interface OrnamentsProps {
  state: TreeState;
  count: number;
  type: 'sphere' | 'box';
  color: string;
  scale: number;
  chaosRadius: number;
  treeHeight: number;
  treeRadius: number;
  speedMultiplier?: number;
  emissive?: boolean;
}

export const Ornaments: React.FC<OrnamentsProps> = ({
  state,
  count,
  type,
  color,
  scale,
  chaosRadius,
  treeHeight,
  treeRadius,
  speedMultiplier = 1.5,
  emissive = false
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Data generation
  const { chaos, target } = useMemo(() => {
    // Generate positions. Ornaments are slightly outside foliage for visibility
    return generatePositions(count, chaosRadius, treeHeight, treeRadius + 0.5); 
  }, [count, chaosRadius, treeHeight, treeRadius]);

  // Current positions state (to support individual particle lerping if we wanted, but here we do it in loop)
  // We use a temp object to update matrices
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const currentPositions = useMemo(() => new Float32Array(chaos), [chaos]); // Start at chaos

  useFrame((stateThree, delta) => {
    if (!meshRef.current) return;

    const targetFactor = state === TreeState.FORMED ? 1.0 : 0.0;
    const isForming = state === TreeState.FORMED;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      
      // Determine target for this frame
      const targetX = isForming ? target[ix] : chaos[ix];
      const targetY = isForming ? target[ix + 1] : chaos[ix + 1];
      const targetZ = isForming ? target[ix + 2] : chaos[ix + 2];

      // Lerp current position towards target
      // We add some randomness to speed based on index to make it feel organic
      const speed = delta * speedMultiplier * (1 + (i % 5) * 0.1);
      
      currentPositions[ix] = THREE.MathUtils.lerp(currentPositions[ix], targetX, speed);
      currentPositions[ix + 1] = THREE.MathUtils.lerp(currentPositions[ix + 1], targetY, speed);
      currentPositions[ix + 2] = THREE.MathUtils.lerp(currentPositions[ix + 2], targetZ, speed);

      // Add a subtle rotation or bobbing
      tempObject.position.set(
        currentPositions[ix],
        currentPositions[ix + 1],
        currentPositions[ix + 2]
      );
      
      // Rotate based on time and index
      tempObject.rotation.set(
        stateThree.clock.elapsedTime * 0.5 + i,
        stateThree.clock.elapsedTime * 0.3 + i,
        0
      );
      
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {type === 'sphere' ? (
        <sphereGeometry args={[1, 32, 32]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.9}
        emissive={emissive ? color : '#000000'}
        emissiveIntensity={emissive ? 2 : 0}
      />
    </instancedMesh>
  );
};