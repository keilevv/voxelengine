import Noise from "noisejs";

function useVoxelWorld(worldSizeX, worldSizeY, worldSizeZ) {
    // Initialize the noise generator
    const noise = new Noise.Noise();

    // Set up a 3D array to store voxel data

    const voxelData = new Array(worldSizeX);

    for (let x = 0; x < worldSizeX; x++) {
        voxelData[x] = new Array(worldSizeY);
        for (let y = 0; y < worldSizeY; y++) {
            voxelData[x][y] = new Array(worldSizeZ);
            for (let z = 0; z < worldSizeZ; z++) {
                // Use Simplex noise to determine if a voxel should exist at this position
                const noiseValue = noise.simplex3(x / 10, y / 10, z / 10); // Adjust the parameters as needed
                if (noiseValue > 0.02) {
                    voxelData[x][y][z] = 1;
                } else {
                    voxelData[x][y][z] = 0;
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



    return { voxelData, isVoxelSurrounded }
}

export default useVoxelWorld