export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface PositionData {
  chaos: Float32Array;
  target: Float32Array;
}

export interface OrnamentType {
  color: string;
  type: 'bauble' | 'gift' | 'light';
  scale: number;
}