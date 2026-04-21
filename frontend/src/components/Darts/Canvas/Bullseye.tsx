import { createWedgeShape } from "./Segment";




const bullseyeRadius = 8;
const multiplierSize = 8;



export function Bullseye() {
  const extrudeSettings = { depth: 2.5, bevelEnabled: false };
  const outerBullShape = createWedgeShape(bullseyeRadius, bullseyeRadius + multiplierSize, Math.PI * 2);
  const innerBullShape = createWedgeShape(0, bullseyeRadius, Math.PI * 2);

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <extrudeGeometry args={[outerBullShape, extrudeSettings]} />
        <meshStandardMaterial color="#25662a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.5]}>
        <extrudeGeometry args={[innerBullShape, extrudeSettings]} />
        <meshStandardMaterial color="#931e1e" roughness={0.6} />
      </mesh>
    </group>
  );
}