import { Text } from "@react-three/drei";
import { JSX, useMemo } from "react";
import * as THREE from "three";
import { dartboardRadius, DartBoardSegment, } from "../functionality/interface";
import { toRadians } from "./3DCanvas";
import { generateNoiseTexture } from "./helperFunctions";


/*const noiseTexture = generateNoiseTexture(256);
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;
noiseTexture.magFilter = THREE.LinearFilter; // Smooths out the pixels
noiseTexture.minFilter = THREE.LinearMipmapLinearFilter; // Better for distant viewing
noiseTexture.generateMipmaps = true; // Required for the minFilter above
noiseTexture.needsUpdate = true;*/

export function createWedgeShape(innerRadius: number, outerRadius: number, angle: number) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, angle, false);
    shape.absarc(0, 0, innerRadius, angle, 0, true);
    return shape;
}


export function DartSegment({ index, segment }: { index: number, segment: DartBoardSegment }) {
    const value = segment.value;;
    const isEvenIndex = index % 2 === 0; // To alternate colors

    const arcSize = 100 * (dartboardRadius / 300)
    const multiplierSize = 10 * (dartboardRadius / 300);

    //const arcSize = 45;

    const angleStepRad = (Math.PI * 2) / 20;

    // Mathematically offset so the first segment (20) sits exactly at the top center
    //const offsetToTop = Math.PI / 2 - angleStepRad / 2; 
    const offsetToTop = toRadians(segment.offset);
    const rotation = toRadians(-segment.rotation);

    // Radii logic
    const firstArcInner = multiplierSize + multiplierSize;
    const firstArcOuter = firstArcInner + arcSize;

    const trebleInner = firstArcOuter;
    const trebleOuter = trebleInner + multiplierSize;

    const secondArcInner = trebleOuter;
    const secondArcOuter = secondArcInner + arcSize;

    const doubleInner = secondArcOuter;
    const doubleOuter = doubleInner + multiplierSize;

    // Colors
    const darkWedge = "#222222";
    const lightWedge = "#ececec";
    const redMultiplier = "#931e1e";
    const greenMultiplier = "#25662a";

    const wedgeColor = isEvenIndex ? darkWedge : lightWedge;
    const multiColor = isEvenIndex ? redMultiplier : greenMultiplier;

    // Pre-calculate geometry shapes once to save memory
    const geometries = useMemo(() => {
        const extrudeSettings = { depth: 2, bevelEnabled: false }; // 2 units thick
        return {
            innerWedge: new THREE.ExtrudeGeometry(createWedgeShape(firstArcInner, firstArcOuter, angleStepRad), extrudeSettings),
            trebleRing: new THREE.ExtrudeGeometry(createWedgeShape(trebleInner, trebleOuter, angleStepRad), extrudeSettings),
            outerWedge: new THREE.ExtrudeGeometry(createWedgeShape(secondArcInner, secondArcOuter, angleStepRad), extrudeSettings),
            doubleRing: new THREE.ExtrudeGeometry(createWedgeShape(doubleInner, doubleOuter, angleStepRad), extrudeSettings),
        };
    }, []);

    return (
        <group rotation={[0, 0, rotation]}>
            {/* Inner Single */}
            <NoiseMesh
                geometry={geometries.innerWedge}
                position={[0, 0, 0]}
                blendingMode={wedgeColor !== "#222222" ? THREE.MultiplyBlending : THREE.AdditiveBlending}
                color={wedgeColor}
            />

            {/* Treble */}
            <NoiseMesh
                geometry={geometries.trebleRing}
                position={[0, 0, 0.5]}
                blendingMode={THREE.MultiplyBlending}
                blendOpacity={0.9}
                color={multiColor}
                bumpy
            />

            {/* Outer Single */}
            <NoiseMesh
                geometry={geometries.outerWedge}
                position={[0, 0, 0]}
                blendingMode={wedgeColor !== "#222222" ? THREE.MultiplyBlending : THREE.AdditiveBlending}
                color={wedgeColor}
            />

            {/* Double */}
            <NoiseMesh
                geometry={geometries.doubleRing}
                position={[0, 0, 0.5]}
                blendingMode={THREE.MultiplyBlending}
                color={multiColor}
                bumpy
            />

            {/* Number Text */}
            <Text
                position={[doubleOuter + 15, 0, 1]}
                rotation={[0, 0, -rotation - angleStepRad / 2]} // Counter-rotate text so it stays upright relative to center
                fontSize={16}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {value.toString()}
            </Text>
        </group>
    );
}


const bigNoiseTexture = generateNoiseTexture(1256);
// FOR SPONGE-LIKE TEXTURE
function NoiseMesh({ geometry, blendingMode, children, position, blendOpacity, color, bumpy, ...props }:
    {
        geometry: THREE.ExtrudeGeometry,
        blendingMode?: THREE.Blending,
        blendOpacity?: number,
        color: string,
        bumpy?: boolean,
    }
    & JSX.IntrinsicElements['mesh']) {
    const noiseTexture = useMemo(() => {
        const tex = bigNoiseTexture
        //tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        // This is the big one for brightness:
        tex.colorSpace = THREE.SRGBColorSpace;
        //tex.repeat.set(0.4, 0.4);
        tex.repeat.set(0.025, 0.025);
        return tex;
    }, []);
    const noiseValues = useMemo(() => ({
        roughness: 0.8,
        metalness: 0,
        map: noiseTexture,
        aoMap: noiseTexture,
        aoMapIntensity: 10.1,
        bumpMap: noiseTexture,
        bumpScale: 0.8,
        displacementMap: noiseTexture,
        displacementScale: 3.8,
        envMapIntensity: 1
    }), [noiseTexture]);

    const bumpTexture = useMemo(() => {
        if (!bumpy) return null;
        const tex = generateNoiseTexture(256);
        //tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        // This is the big one for brightness:
        tex.colorSpace = THREE.SRGBColorSpace;
        //tex.repeat.set(0.4, 0.4);
        tex.repeat.set(0.1, 0.1);
        return tex;
    }, []);
    const bumpValues = useMemo(() => {
        if (!bumpy || !bumpTexture) return {
            roughness: 0.8,
            metalness: 0,
        };
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
    }, [bumpy, bumpTexture]);

    return (
        <group position={position} >
            <mesh geometry={geometry} position={[0, 0, 0]} {...props}>
                <meshStandardMaterial color={color} {...bumpValues} />
            </mesh>
            <mesh geometry={geometry} position={[0, 0, 0]}>
                <meshStandardMaterial
                    blending={blendingMode || THREE.MultiplyBlending}
                    {...noiseValues}
                    opacity={blendOpacity || 0.2}
                    transparent
                    premultipliedAlpha={true}
                    polygonOffset
                    polygonOffsetFactor={-2}
                />
            </mesh>
        </group >
    );
}
