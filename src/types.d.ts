export interface GridSize {
  width: number;
  height: number;
}

export interface Matrix<T = unknown> extends Array<Array<T>> {}
