import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generatePositions } from '../utils/math';
import { TreeState } from '../types';

// Custom Shader for "Balloon" look on points
const balloonVertexShader = `
  attribute vec3 targetPos;
  attribute vec3 chaosPos;
  attribute float size;
  
  uniform float uMix;
  uniform float uTime;
  
  varying vec3 vColor;
  varying vec3 vPos;
  
  void main() {
    // Lerp between positions
    vec3 pos = mix(chaosPos, targetPos, uMix);
    
    // Add a slight hover/breathing effect
    pos.y += sin(uTime * 2.0 + pos.x) * 0.05;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = size * (300.0 / -mvPosition.z);
    
    vPos = pos;
  }
`;

const balloonFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uLightPos;
  
  varying vec3 vPos;
  
  void main() {
    // Make it a circle
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;
    
    // Fake 3D Normal for balloon effect
    float z = sqrt(1.0 - r);
    vec3 normal = normalize(vec3(cxy, z));
    
    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
    
    // Diffuse
    float diffuse = max(0.0, dot(normal, lightDir));
    
    // Specular (High gloss)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 reflectDir = reflect(-lightDir, normal);
    float specular = pow(max(0.0, dot(viewDir, reflectDir)), 32.0);
    
    // Mix colors based on position to give depth/variety
    // Mostly Emerald Green (uColor1) with some Gold (uColor2) variance
    float noise = fract(sin(dot(vPos.xy ,vec2(12.9898,78.233))) * 43758.5453);
    vec3 baseColor = mix(uColor1, uColor2, noise * 0.2); // Mostly green
    
    // Final Color composition
    vec3 finalColor = baseColor * (0.3 + 0.7 * diffuse) + vec3(1.0, 0.9, 0.6) * specular * 0.8;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface FoliageProps {
  state: TreeState;
  count?: number;
}

export const Foliage: React.FC<FoliageProps> = ({ state, count = 4000 }) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  
  // Define geometry data
  const { positions, sizes } = useMemo(() => {
    const { chaos, target } = generatePositions(count, 15, 12, 5);
    const sizesArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Varying balloon sizes
      sizesArray[i] = Math.random() * 0.5 + 0.3;
    }
    return {
      positions: { chaos, target },
      sizes: sizesArray
    };
  }, [count]);

  // Animation Loop
  useFrame((stateThree, delta) => {
    if (shaderRef.current) {
      // Smoothly interpolate the mix factor based on state
      const targetMix = state === TreeState.FORMED ? 1.0 : 0.0;
      // Linear interpolation for the uMix uniform
      shaderRef.current.uniforms.uMix.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uMix.value,
        targetMix,
        delta * 2.0 // Speed of morph
      );
      
      shaderRef.current.uniforms.uTime.value = stateThree.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uMix: { value: 0.0 },
    uTime: { value: 0.0 },
    uColor1: { value: new THREE.Color("#004225") }, // Emerald Green
    uColor2: { value: new THREE.Color("#FFD700") }, // Gold highlights
  }), []);

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-chaosPos"
          name="chaosPos"
          count={count}
          array={positions.chaos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPos"
          name="targetPos"
          count={count}
          array={positions.target}
          itemSize={3}
        />
        {/* We need a dummy position attribute for three.js to render, though we use shader logic */}
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.chaos} 
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          name="size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={balloonVertexShader}
        fragmentShader={balloonFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};