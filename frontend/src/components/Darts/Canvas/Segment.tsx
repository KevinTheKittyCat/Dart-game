import { Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { dartboardRadius, DartBoardSegment, } from "../functionality/interface";
import { toRadians } from "./3DCanvas";


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
            <mesh geometry={geometries.innerWedge} position={[0, 0, 0]}>
                <meshStandardMaterial color={wedgeColor} roughness={0.9} />
            </mesh>

            {/* Treble */}
            <mesh geometry={geometries.trebleRing} position={[0, 0, 0.5]}>
                <meshStandardMaterial color={multiColor} roughness={0.6} />
            </mesh>

            {/* Outer Single */}
            <mesh geometry={geometries.outerWedge} position={[0, 0, 0]}>
                <meshStandardMaterial color={wedgeColor} roughness={0.9} />
            </mesh>

            {/* Double */}
            <mesh geometry={geometries.doubleRing} position={[0, 0, 0.5]}>
                <meshStandardMaterial color={multiColor} roughness={0.6} />
            </mesh>

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