// 3D 기하학

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Size3D {
  width: number;
  height: number;
  depth: number;
}

export interface BoundingBox3D {
  min: Point3D;
  max: Point3D;
}
