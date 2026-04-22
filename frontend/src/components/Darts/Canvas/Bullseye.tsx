import { useMemo } from "react";
import * as THREE from "three";
import { createWedgeShape } from "./Segment";
import { generateNoiseTexture } from "./helperFunctions";



const bullseyeRadius = 8;
const multiplierSize = 8;

const bigNoiseTexture = generateNoiseTexture(1256);

export function Bullseye() {
    const extrudeSettings = { depth: 2.5, bevelEnabled: false };
    const outerBullShape = createWedgeShape(bullseyeRadius, bullseyeRadius + multiplierSize, Math.PI * 2);
    const innerBullShape = createWedgeShape(0, bullseyeRadius, Math.PI * 2);

    const bumpTexture = useMemo(() => {
        const tex = generateNoiseTexture(256);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.repeat.set(0.1, 0.1);
        return tex;
    }, []);
    const bumpValues = useMemo(() => {
        return {
            roughness: 0.8,
            metalness: 0,
            aoMap: bumpTexture,
            aoMapIntensity: 0.8,
            bumpMap: bumpTexture,
            bumpScale: 0.8,
            displacementMap: bumpTexture,
            displacementScale: 0.8,
            envMapIntensity: 1
        }
    }, [bumpTexture]);

    return (
        <group>
            <mesh position={[0, 0, 0]}>
                <extrudeGeometry args={[outerBullShape, extrudeSettings]} />
                <meshStandardMaterial color="#25662a" {...bumpValues} />
            </mesh>
            <mesh position={[0, 0, 0.5]}>
                <extrudeGeometry args={[innerBullShape, extrudeSettings]} />
                <meshStandardMaterial color="#931e1e" {...bumpValues} />
            </mesh>
        </group>
    );
}