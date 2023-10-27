import Noise from "noisejs";
import { grassTexture, glassTexture, dirtTexture } from "../assets/images/textures";

function useVoxelWorld(worldSizeX, worldSizeY, worldSizeZ) {
    // Initialize the noise generator
    const noise = new Noise.Noise(Math.random());
    const frequency = 0.02;
    const amplitude = 30;
    const lacunarity = 2;
    const octaves = 5;
    // Set up a 3D array to store voxel data

    const voxelData = new Array(worldSizeX);
    const blockTypes = [
        { name: "grass", material: grassTexture, color: "#00FF00", minHeight: 10, maxHeight: 5 },
        { name: "stone", material: glassTexture, color: "#A9A9A9", minHeight: 0, maxHeight: 8 },
        { name: "dirt", material: dirtTexture, color: "#8B4513", minHeight: 0, maxHeight: 10 },
        // Add more block types as needed
    ];

    for (let x = 0; x < worldSizeX; x++) {
        voxelData[x] = new Array(worldSizeY);
        for (let y = 0; y < worldSizeY; y++) {
            voxelData[x][y] = new Array(worldSizeZ);
            for (let z = 0; z < worldSizeZ; z++) {
                // Use Simplex noise to determine if a voxel should exist at this position
                const noiseValue = noise.simplex3(x * frequency, y * frequency, z * frequency); // Adjust the parameters as needed
                const terrainHeight = Math.floor(noiseValue * amplitude);

                for (const blockType of blockTypes) {
                    if (y <= terrainHeight && y <= blockType.maxHeight) {
                        voxelData[x][y][z] = {
                            position: { x, y, z },
                            material: blockType.material,
                            type: blockType.name,
                            color: blockType.color,
                            isWireframe: false,
                        };
                        // If this voxel matches a block type, break the loop to avoid further assignments
                        break;
                    }
                }
            }
        }
    }

    function isVoxelSurrounded(x, y, z, voxelData) {
        // Define relative positions for the six neighbors
        const neighbors = [
            [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
        ];

        for (const neighbor of neighbors) {
            const neighborX = x + neighbor[0];
            const neighborY = y + neighbor[1];
            const neighborZ = z + neighbor[2];

            // Check if the neighbor is within bounds and if it has a voxel
            if (
                neighborX < 0 || neighborX >= voxelData.length ||
                neighborY < 0 || neighborY >= voxelData[0].length ||
                neighborZ < 0 || neighborZ >= voxelData[0][0].length ||
                !voxelData[neighborX][neighborY][neighborZ]
            ) {
                // If any neighbor is missing a voxel, the voxel is not surrounded
                return false;
            }
        }

        // All six neighbors have voxels, so this voxel is completely surrounded
        return true;
    }



    return { voxelData, isVoxelSurrounded, blockTypes }
}

export default useVoxelWorld