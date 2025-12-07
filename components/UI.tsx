import React from 'react';
import { TreeState } from '../types';

interface UIProps {
  state: TreeState;
  onToggle: () => void;
}

export const UI: React.FC<UIProps> = ({ state, onToggle }) => {
  const isFormed = state === TreeState.FORMED;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8 z-10">
      
      {/* Header */}
      <div className="text-center mt-4 space-y-2 opacity-90">
        <h2 className="text-amber-400 font-bold tracking-[0.3em] text-sm uppercase">The Presidential Collection</h2>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 drop-shadow-lg font-serif">
          GRAND CHRISTMAS
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4"></div>
      </div>

      {/* Center Controls */}
      <div className="pointer-events-auto flex flex-col items-center gap-4">
        <button
          onClick={onToggle}
          className={`
            relative group px-12 py-4 overflow-hidden rounded-full 
            transition-all duration-500 ease-out transform hover:scale-105 active:scale-95
            border-2 border-amber-400/50 shadow-[0_0_40px_rgba(251,191,36,0.2)]
            ${isFormed ? 'bg-emerald-900/80' : 'bg-red-900/80'}
          `}
        >
          {/* Button Gloss Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <span className={`
            relative z-10 font-serif font-bold text-xl tracking-widest
            ${isFormed ? 'text-amber-100' : 'text-amber-100'}
          `}>
            {isFormed ? 'RELEASE CHAOS' : 'ASSEMBLE GRANDEUR'}
          </span>
        </button>
        
        <p className="text-amber-200/60 text-xs tracking-widest uppercase font-sans">
          {isFormed ? 'Luxury Mode Active' : 'Waiting for Authorization'}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mb-4">
         <p className="text-emerald-800/50 text-[10px] uppercase tracking-widest">Interactive 3D Experience</p>
      </div>
    </div>
  );
};