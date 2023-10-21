import React, { useRef } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
extend({ OrbitControls });

const CameraController = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useFrame(() => controls.current.update());

  return <OrbitControls ref={controls} args={[camera, gl.domElement]} />;
};

export default CameraController;