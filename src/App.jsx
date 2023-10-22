import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import VoxelWorld from "./Components/VoxelWorld";
function App() {
  return (
    <Canvas>
      <VoxelWorld />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
