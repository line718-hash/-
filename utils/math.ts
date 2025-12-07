import * as THREE from 'three';

// Helper to generate random point in a sphere
export const getRandomSpherePoint = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius; // Cubic root for uniform distribution
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// Helper to generate point in a cone (Tree shape)
export const getTreePoint = (height: number, baseRadius: number, yOffset: number = -height / 2): THREE.Vector3 => {
  const y = Math.random() * height; // Height from base
  // The radius at height y (linear taper)
  const currentRadius = baseRadius * (1 - y / height);
  
  // Random point in circle at height y
  const angle = Math.random() * Math.PI * 2;
  // Distribute points more towards surface but fill inside too for volume
  const r = Math.sqrt(Math.random()) * currentRadius; 
  
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  
  return new THREE.Vector3(x, y + yOffset, z);
};

export const generatePositions = (count: number, chaosRadius: number, treeHeight: number, treeRadius: number): { chaos: Float32Array, target: Float32Array } => {
  const chaos = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const c = getRandomSpherePoint(chaosRadius);
    chaos[i * 3] = c.x;
    chaos[i * 3 + 1] = c.y;
    chaos[i * 3 + 2] = c.z;

    const t = getTreePoint(treeHeight, treeRadius);
    target[i * 3] = t.x;
    target[i * 3 + 1] = t.y;
    target[i * 3 + 2] = t.z;
  }

  return { chaos, target };
};