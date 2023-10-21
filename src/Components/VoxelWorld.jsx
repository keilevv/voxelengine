import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import useVoxelWorld from "../hooks/useVoxelWorld";
import { grassTexture } from "../assets/images/textures";
import Stats from "stats.js";

const VoxelGame = () => {
  const stats = new Stats();
  // stats.showPanel(1); // 0: FPS, 1: MS (frame time), 2: MB (memory usage)
  // Add it to your HTML page
  stats.dom.style.width = "100px";
  document.body.appendChild(stats.dom);

  // Generate 3D array for voxels
  const { voxelData, isVoxelSurrounded } = useVoxelWorld(50, 50, 50);
  // Initialize Three.js scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional shadow typ

  document.body.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(1, 1, 1);
  directionalLight.castShadow = true; // Enable shadow casting
  scene.add(directionalLight);

  const voxelSize = 0.1; // Size of your smaller cubes
  const geometry = new THREE.BoxGeometry(
    voxelSize,
    voxelSize,
    voxelSize
  );
  const instancedGeometry = new THREE.InstancedBufferGeometry();

  for (let x = 0; x < voxelData.length; x++) {
    for (let y = 0; y < voxelData[0].length; y++) {
      for (let z = 0; z < voxelData[0][0].length; z++) {
        if (voxelData[x][y][z] && !isVoxelSurrounded(x, y, z, voxelData)) {
          // Adjust the threshold for voxel existence

          const instancedGeometry = new THREE.InstancedBufferGeometry();

          const material = new THREE.MeshStandardMaterial({
            map: grassTexture,
          });
          material.receiveShadows = true;
          const voxel = new THREE.Mesh(geometry, material);
          voxel.position.set(x * voxelSize, y * voxelSize, z * voxelSize);
          scene.add(voxel);
        }
      }
    }
  }
  // Set up the camera position and controls
  camera.position.x = -5;
  camera.position.y = 10;
  camera.position.z = 5;

  const canvas = renderer.domElement;
  canvas.style.top = "0px";
  canvas.style.position = "absolute";

  // Animation/render loop
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    // Update the Stats object
    stats.update();
  };

  animate();
};

export default VoxelGame;
