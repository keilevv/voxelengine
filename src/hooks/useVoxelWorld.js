import Noise from "noisejs";

function useVoxelWorld(worldSizeX, worldSizeY, worldSizeZ) {
    // Initialize the noise generator
    const noise = new Noise.Noise(Math.random());
    const frequency = 0.01;
    const amplitude = 20;
    const lacunarity = 2;
    const octaves = 5;
    // Set up a 3D array to store voxel data

    const voxelData = new Array(worldSizeX);
    const blockTypes = [
        { name: "grass", material: "green", color: "#00FF00", minHeight: 0, maxHeight: 500 },
        { name: "stone", material: "gray", color: "#A9A9A9", minHeight: 0, maxHeight: 500 },
        { name: "dirt", material: "brown", color: "#8B4513", minHeight: 0, maxHeight: 500 },
        // Add more block types as needed
    ];

    const voxelDataList = [];

    for (let x = 0; x < worldSizeX; x++) {
        voxelData[x] = new Array(worldSizeY);
        for (let y = 0; y < worldSizeY; y++) {
            voxelData[x][y] = new Array(worldSizeZ);
            for (let z = 0; z < worldSizeZ; z++) {
                // Use Simplex noise to determine if a voxel should exist at this position
                const noiseValue = noise.simplex3(x * frequency, y * frequency, z * frequency); // Adjust the parameters as needed
                const terrainHeight = Math.floor(noiseValue * amplitude);
                // Iterate through block types and assign the appropriate one based on noise value
                for (const blockType of blockTypes) {

                    if (y <= terrainHeight && y >= blockType.minHeight && y <= blockType.maxHeight || y == 0) {

                        voxelData[x][y][z] = {
                            position: { x, y, z },
                            material: blockType.material,
                            type: blockType.name,
                            color: blockType.color,
                            isWireframe: false,
                        }
                        voxelDataList.push(voxelData[x][y][z])
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
        if (!voxelData[x][y][z].isWireframe) {
            return false
        }
        // All six neighbors have voxels, so this voxel is completely surrounded
        return true;
    }



    return { voxelData, voxelDataList, isVoxelSurrounded }
}

export default useVoxelWorld