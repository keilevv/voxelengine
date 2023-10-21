function useShaders() {
    const vertexShader = `
    // Define the precision and attribute for position
    precision highp float;
    attribute vec3 position;
    
    // Uniforms
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    // Instanced attributes
    attribute vec3 instancePosition; // Position of each instance
    
    void main() {
        // Calculate the final position of the vertex
        vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
        modelPosition.xyz += instancePosition;
    
        // Set the gl_Position for rendering
        gl_Position = projectionMatrix * modelPosition;
    }
    `
    const fragmentShader = `
    // Define the precision and uniform for color
    precision highp float;
    uniform vec3 voxelColor; // Uniform color for each voxel

    void main() {
    // Set the color of the fragment to the uniform voxelColor
    gl_FragColor = vec4(voxelColor, 1.0);
    }
    `
    return { vertexShader, fragmentShader }
}
export default useShaders