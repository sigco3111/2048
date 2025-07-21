
export interface TileState {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface Coords {
  row: number;
  col: number;
}
