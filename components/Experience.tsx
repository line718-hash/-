import React from 'react';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { Star } from './Star';
import { TreeState } from '../types';

interface ExperienceProps {
  state: TreeState;
}

export const Experience: React.FC<ExperienceProps> = ({ state }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 18]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={30}
        autoRotate={state === TreeState.FORMED}
        autoRotateSpeed={0.5}
      />

      {/* Lighting & Environment */}
      <Environment preset="lobby" background={false} />
      <ambientLight intensity={0.2} color="#001a00" />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        color="#fffaed" 
        castShadow 
      />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#Gold" />

      {/* The Tree System */}
      <group position={[0, -5, 0]}>
        {/* Main Foliage: Emerald Green Balloons */}
        <Foliage state={state} count={3500} />
        
        {/* Ornaments: Gold Baubles */}
        <Ornaments 
          state={state} 
          count={150} 
          type="sphere" 
          color="#FFD700" 
          scale={0.25}
          chaosRadius={15}
          treeHeight={12}
          treeRadius={4.5}
          speedMultiplier={1.2}
        />
        
        {/* Ornaments: Red Baubles */}
        <Ornaments 
          state={state} 
          count={80} 
          type="sphere" 
          color="#8B0000" 
          scale={0.3}
          chaosRadius={16}
          treeHeight={12}
          treeRadius={4.8}
          speedMultiplier={1.0}
        />

        {/* Ornaments: Gifts (Boxes) - Heavy weight (slower) */}
        <Ornaments 
          state={state} 
          count={40} 
          type="box" 
          color="#ffffff" 
          scale={0.4}
          chaosRadius={12}
          treeHeight={6} // Lower on tree
          treeRadius={5.5}
          speedMultiplier={0.8}
        />
        
        {/* Ornaments: Lights (Emissive small spheres) */}
        <Ornaments 
          state={state} 
          count={400} 
          type="sphere" 
          color="#ffffee" 
          scale={0.08}
          chaosRadius={20}
          treeHeight={12}
          treeRadius={4.2}
          speedMultiplier={2.5}
          emissive={true}
        />

        {/* Star Topper */}
        <Star state={state} />
      </group>

      {/* Post Processing */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.8} 
          luminanceSmoothing={0.9} 
          intensity={1.5} 
          mipmapBlur 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};