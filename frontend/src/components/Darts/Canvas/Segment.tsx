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
    const value = segment.value;
    const isEvenIndex = index % 2 === 0;

    const arcSize = 100 * (dartboardRadius / 300);
    const multiplierSize = 10 * (dartboardRadius / 300);
    const angleStepRad = (Math.PI * 2) / 20;
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

    const wireRadius = 0.8; // Thickness of the metal bars
    const wireColor = "#d1d1d1";
    const wireMaterial = new THREE.MeshStandardMaterial({
        color: wireColor,
        metalness: 0.9,
        roughness: 0.2
    });
    const wireGeometries = useMemo(() => {
        // 1. Radial Bar (The vertical bars separating numbers)
        // Length is from the very center (or firstArcInner) to the outer edge
        const radialLength = doubleOuter - firstArcInner;
        const radialBar = new THREE.CylinderGeometry(wireRadius, wireRadius, radialLength, 8);

        // 2. Circular Rings (The horizontal arcs)
        // We create arcs that match the angleStepRad
        const createRingArc = (radius: number) =>
            new THREE.TorusGeometry(radius, wireRadius, 8, 32, angleStepRad);

        return {
            radialBar,
            ringFirstInner: createRingArc(firstArcInner),
            ringTrebleInner: createRingArc(trebleInner),
            ringTrebleOuter: createRingArc(trebleOuter),
            ringDoubleInner: createRingArc(doubleInner),
            ringDoubleOuter: createRingArc(doubleOuter),
        };
    }, [angleStepRad, doubleOuter, firstArcInner]);

    const geometries = useMemo(() => {
        const extrudeSettings = { depth: 2, bevelEnabled: false };
        // Slightly taller extrude for the wires to sit "on top"
        const wireExtrudeSettings = { depth: 3, bevelEnabled: false };

        const innerWedgeShape = createWedgeShape(firstArcInner, firstArcOuter, angleStepRad);
        const trebleShape = createWedgeShape(trebleInner, trebleOuter, angleStepRad);
        const outerWedgeShape = createWedgeShape(secondArcInner, secondArcOuter, angleStepRad);
        const doubleShape = createWedgeShape(doubleInner, doubleOuter, angleStepRad);

        return {
            innerWedge: new THREE.ExtrudeGeometry(innerWedgeShape, extrudeSettings),
            trebleRing: new THREE.ExtrudeGeometry(trebleShape, extrudeSettings),
            outerWedge: new THREE.ExtrudeGeometry(outerWedgeShape, extrudeSettings),
            doubleRing: new THREE.ExtrudeGeometry(doubleShape, extrudeSettings),

            // Railings/Wires: Using EdgesGeometry for a clean wire look
            // We only need to outline the full segment length to avoid overlapping internal wires
            wireFrame: new THREE.EdgesGeometry(
                new THREE.ExtrudeGeometry(
                    createWedgeShape(firstArcInner, doubleOuter, angleStepRad),
                    wireExtrudeSettings
                )
            )
        };
    }, [arcSize, multiplierSize]);

    return (
        <group rotation={[0, 0, rotation]}>
            {/* --- Metal Railings (The Spider) --- */}
            <group position={[0, 0, 2.5]}> {/* Lifted slightly above the wedges */}

                {/* Left Radial Bar */}
                <mesh
                    geometry={wireGeometries.radialBar}
                    material={wireMaterial}
                    rotation={[0, 0, angleStepRad / 2]} // Align to edge of segment
                    position={[(firstArcInner + doubleOuter) / 2, 0, 0]}
                    rotation-z={Math.PI / 2} // Lay flat
                />

                {/* Horizontal Arcs (Rings) */}
                {[
                    wireGeometries.ringFirstInner,
                    wireGeometries.ringTrebleInner,
                    wireGeometries.ringTrebleOuter,
                    wireGeometries.ringDoubleInner,
                    wireGeometries.ringDoubleOuter
                ].map((geo, i) => (
                    <mesh
                        key={i}
                        geometry={geo}
                        material={wireMaterial}
                        rotation={[0, 0, -angleStepRad / 2]} // Offset to match wedge start
                    />
                ))}
            </group>

            {/* Sisal Wedges */}
            <NoiseMesh geometry={geometries.innerWedge} color={wedgeColor} />

            <NoiseMesh
                geometry={geometries.trebleRing}
                position={[0, 0, 0.5]}
                color={multiColor}
                bumpy
            />

            <NoiseMesh geometry={geometries.outerWedge} color={wedgeColor} />

            <NoiseMesh
                geometry={geometries.doubleRing}
                position={[0, 0, 0.5]}
                color={multiColor}
                bumpy
            />

            {/* Railing / Wire Spider */}
            <lineSegments geometry={geometries.wireFrame} position={[0, 0, 0.1]}>
                <lineBasicMaterial color={wireColor} linewidth={2} />
            </lineSegments>

            {/* Individual Multiplier Railings (Horizontal Wires) */}
            {/* These create the rings for Treble and Double boundaries */}
            <lineSegments geometry={new THREE.EdgesGeometry(geometries.trebleRing)} position={[0, 0, 0.6]}>
                <lineBasicMaterial color={wireColor} />
            </lineSegments>
            <lineSegments geometry={new THREE.EdgesGeometry(geometries.doubleRing)} position={[0, 0, 0.6]}>
                <lineBasicMaterial color={wireColor} />
            </lineSegments>

            {/* Number Text */}
            <Text
                position={[doubleOuter + 15, 0, 1]}
                rotation={[0, 0, -rotation - angleStepRad / 2]}
                fontSize={16}
                color="white"
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
