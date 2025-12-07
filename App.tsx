import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UI } from './components/UI';
import { TreeState } from './types';

export default function App() {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CHAOS);

  const toggleState = () => {
    setTreeState(prev => prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS);
  };

  return (
    <div className="w-full h-screen bg-black">
      <UI state={treeState} onToggle={toggleState} />
      
      <Canvas
        dpr={[1, 2]} // Optimize pixel ratio
        gl={{ 
          antialias: false, // Postprocessing handles AA better typically or adds blur
          toneMapping: 3, // THREE.ReinhardToneMapping
          toneMappingExposure: 1.5
        }}
      >
        <Suspense fallback={null}>
          <Experience state={treeState} />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#050a05' }}
        innerStyles={{ width: '200px', background: '#333' }}
        barStyles={{ background: '#FFD700', height: '5px' }}
        dataStyles={{ color: '#FFD700', fontFamily: 'serif' }}
      />
    </div>
  );
}