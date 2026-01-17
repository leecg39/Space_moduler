// 2D 기하학

export interface Point2D {
  x: number;
  y: number;
}

export interface Line2D {
  start: Point2D;
  end: Point2D;
  thickness: number;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface BoundingBox2D {
  min: Point2D;
  max: Point2D;
}
