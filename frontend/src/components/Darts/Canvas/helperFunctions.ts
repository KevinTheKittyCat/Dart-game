

import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

export function generateNoiseTexture(size: number) {
    const noise = new SimplexNoise();
    const data = new Uint8Array(size * size * 4);

    for (let i = 0; i < size * size; i++) {
        const x = (i % size) / size;
        const y = Math.floor(i / size) / size;
        // Inside your loop:
        /* OLD - TO CREATE SMOOTH, SUBTLE NOISE
        const val1 = noise.noise(x * 1, y * 1) * 0.7;    // Big bumps
        const val2 = noise.noise(x * 2, y * 2) * 0.3;  // Small pores
        */
        const val1 = noise.noise(x * 3, y * 3) * 0.7;    // Big bumps
        const val2 = noise.noise(x * 8, y * 8) * 0.3;  // Small pores
        const value = (val1 + val2 + 1) * 128;
        //const value = (noise.noise(x * 10, y * 10) + 1) * 128; // Normalize to 0-255
        data[i * 4] = value;     // Red
        data[i * 4 + 1] = value; // Green
        data[i * 4 + 2] = value; // Blue
        data[i * 4 + 3] = 85;   // Alpha
    }

    const texture = new THREE.DataTexture(data, size, size);
    texture.needsUpdate = true;
    return texture;
}

export const generateNoiseTexturesWithReverse = (size: number) => {
    const noise = new SimplexNoise();
    const data = new Uint8Array(size * size * 4);
    const reverseData = new Uint8Array(size * size * 4);

    for (let i = 0; i < size * size; i++) {
        const x = (i % size) / size;
        const y = Math.floor(i / size) / size;

        // Calculate original noise
        const val1 = noise.noise(x * 1, y * 1) * 0.7;
        const val2 = noise.noise(x * 2, y * 2) * 0.3;
        const value = (val1 + val2 + 1) * 128; // Standard 0-255

        // Calculate inverse value (White becomes Black, Black becomes White)
        const reverseValue = 255 - value;

        // Fill Standard Data
        data[i * 4] = value;
        data[i * 4 + 1] = value;
        data[i * 4 + 2] = value;
        data[i * 4 + 3] = 255;

        // Fill Reverse Data
        reverseData[i * 4] = reverseValue;
        reverseData[i * 4 + 1] = reverseValue;
        reverseData[i * 4 + 2] = reverseValue;
        reverseData[i * 4 + 3] = 255;
    }

    const tex = new THREE.DataTexture(data, size, size);
    const rev = new THREE.DataTexture(reverseData, size, size);

    tex.needsUpdate = true;
    rev.needsUpdate = true;

    return [tex, rev];
};

