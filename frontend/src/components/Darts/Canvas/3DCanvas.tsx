import { Cylinder, PresentationControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { dartboardPadding, ThrownDart } from "../functionality/interface";
import { throwDart } from "../functionality/throwDart";
import { useGame } from "../GameContext";
import { useRound } from "../RoundContext";
import { Bullseye } from "./Bullseye";
import { DartSegment } from "./Segment";


const boardRadius = 150;
const boardThickness = 15;
/*
const numbers = new Array(20).fill(0)
const dartBoardNumbers = numbers.map((_, i) => {
  const angleStep = 360 / numbers.length;
  const offsetToPut20AtTop = angleStep / 2 + 90;
  const rotation = i * angleStep - offsetToPut20AtTop;
  return new DartBoardSegment({
    index: i,
    value: i + 1,
    rotation,
    offset: offsetToPut20AtTop,
    isEven: i % 2 === 0,
    angleStep,
  });
});*/
//const angleStep = 360 / dartBoardNumbers.length;

export function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function toDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

export function DartsCanvas3D() {
  const { accuracy, dartBoard } = useGame();
  const { addThrownDart, currentDart, thrownDarts } = useRound();
  const boardRef = useRef<THREE.Group>(null);
  const aimRef = useRef<THREE.Mesh>(null);
  const offsetToCenterScreenRightSide = new THREE.Vector3(0, 0, 0); //new THREE.Vector3(500, 0, 0);

  const handleBoardClick = (e: any) => {
    e.stopPropagation();
    if (!currentDart) return;
    const box = new THREE.Box3().setFromObject(boardRef.current);
    const size = box.getSize(new THREE.Vector3());
    const sizeAdjust = size.clone().sub(new THREE.Vector3(dartboardPadding, dartboardPadding, 0));
    const offsetHalfSize = sizeAdjust.clone().multiplyScalar(0.5);

    const board = {
      size: sizeAdjust,
      radius: size.x / 2,
      center: offsetHalfSize,
      padding: dartboardPadding,
      bullseye: {
        radius: 10 * (sizeAdjust.x / 300),
      },
    }

    const hitResult = throwDart({
      board,
      accuracy: accuracy,
      pointOfAim: aimRef.current.position.clone().add(offsetHalfSize), // Convert to local coordinates relative to the board center
      adjustments: [],
      segments: dartBoard,
    });

    addThrownDart(new ThrownDart({
      ...currentDart,
      ...hitResult,
      pointOfAim: aimRef.current.position.clone(),
      pointsScored: hitResult.hitSegment ? hitResult.hitSegment.value * (hitResult.hitResult?.multiplier || 1) : 0,
    }));
  };

  const [x, y] = [(boardRadius + 40) * 2, (boardRadius + 40) * 2]

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#121212" }}>
      <Canvas camera={{ position: [0, 0, 800/*800*/], fov: 55, near: 0.1, far: 8000 }}>
        {/* Simplified, robust lighting to prevent errors */}
        <ambientLight intensity={0.6} />

        {/*<Html position={[1280, 0, 0]} portal={uiRef}/>/*/}
        {/*<Html className="content" transform occlude
          position={[0, 0, 2470]}
          zIndexRange={[100, 0]} sprite
          style={{ filter: 'url(#pixelate-filter) blur(2px)' }}
        >
          <iframe title="embed" width={700} height={1080} src={`${window.location.origin}/dartUi`} frameBorder={0} />
        </Html>
        */}

        <directionalLight position={[100, 100, 200]} intensity={1.5} />
        {/*<EffectComposer>
          <Pixelation
            granularity={2} // Represents the size of the pixels
          />
          <Bloom intensity={0.5} luminanceThreshold={1} />
        </EffectComposer>
        */}
        {/* The Board Assembly */}
        <PresentationControls
          enabled={true} // the controls can be disabled by setting this to false
          global={false} // Spin globally or by dragging the model
          cursor={false} // Whether to toggle cursor style on drag
          snap={true} // Snap-back to center (can also be a spring config)
          speed={1} // Speed factor
          zoom={3} // Zoom factor when half the polar-max is reached
          rotation={[0, 0, 0]} // Default rotation
          polar={[0, Math.PI / 2]} // Vertical limits
          azimuth={[-Infinity, Infinity]} // Horizontal limits
          config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
        //domElement={events.connected} // The DOM element events for this controller will attach to
        >
          <group
            ref={boardRef}
            //position={[offsetToCenterScreenRightSide.x, offsetToCenterScreenRightSide.y, offsetToCenterScreenRightSide.z]}
          //onPointerMove={(e) => setAimPos(e.point)}
          //onClick={handleBoardClick}
          >
            {/* Thick Base Board */}
            <Cylinder
              args={[x, y, boardThickness + 15, 64]}
              rotation={[-Math.PI / 2, Math.PI, 0]}
              position={[0, 0, -boardThickness / 2]} // Push it back so the face is at Z=0

              //onPointerMove={(e) => setAimPos(e.point)}
              onPointerMove={(e) => {
                const localPoint = e.point.clone();
                localPoint.sub(offsetToCenterScreenRightSide); // Convert to local coordinates relative to the board center
                aimRef.current?.position.copy(localPoint);
              }}
              onClick={handleBoardClick}
              visible={false} // Make the large hitbox invisible
            >
              <meshStandardMaterial color="#0b0b0b" roughness={0.8} />
            </Cylinder>

            <Cylinder
              args={[x, y, boardThickness / 2, 64]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, -boardThickness / 2]} // Push it back so the face is at Z=0
            >
              <meshStandardMaterial color="#0b0b0b" roughness={0.8} />
            </Cylinder>

            {/* Wedges */}
            {dartBoard.map((segment, i) => (
              <DartSegment key={i} index={i} segment={segment} />
            ))}

            {/* Bullseyes */}
            <group position={[0, 0, 1]}>
              <Bullseye />
            </group>

            {/* Aim Indicator */}
            <mesh ref={aimRef} /*position={[aimPos.x, aimPos.y, 2]}*/>
              <ringGeometry args={[accuracy, accuracy + 10, 32]} />
              {/*<meshBasicMaterial color="white" transparent opacity={0.3} side={THREE.DoubleSide} />*/}

              {/* NOISE MATERIAL */}
              <meshStandardMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} roughness={0.5} metalness={0.5} />
            </mesh>


            {/* Render the Hit Red Balls */}
            {thrownDarts.map((dart, i) => (
              <mesh key={i} position={[dart.pointOfAim.x, dart.pointOfAim.y, 5]}>
                <sphereGeometry args={[4, 32, 32]} />
                <meshStandardMaterial color="#ff0000" roughness={0.2} metalness={0.5} />
                <Text
                  position={[0, 5, 5]}
                  fontSize={34}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {dart.pointsScored > 0 ? `+${dart.pointsScored}` : "Miss"}
                </Text>
              </mesh>
            ))}
          </group>
        </PresentationControls>
        {/* Let the user rotate slightly, but keep them looking mostly at the front */}
        {/*<OrbitControls

        //enablePan={false}
        //minAzimuthAngle={-Math.PI / 4}
        //maxAzimuthAngle={Math.PI / 4}
        //minPolarAngle={Math.PI / 4}
        //maxPolarAngle={Math.PI - Math.PI / 4}
        />
        */}
      </Canvas>
    </div>
  );
}

