import { Object3DNode } from '@react-three/fiber';
import { Mesh, Group } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: Object3DNode<Mesh, typeof Mesh>;
      group: Object3DNode<Group, typeof Group>;
      perspectiveCamera: Object3DNode<any, any>;
      ambientLight: Object3DNode<any, any>;
      directionalLight: Object3DNode<any, any>;
      spotLight: Object3DNode<any, any>;
      pointLight: Object3DNode<any, any>;
    }
  }
}

export {};
