import { useState } from "react";
import { Arc, Circle, Group, Layer, Ring, Stage, Text } from "react-konva";
import { DartBoardSegment } from "./functionality/interface";
import { throwDart } from "./functionality/throwDart";



const width = window.innerWidth;
const height = window.innerHeight;
const dartboardPadding = 50;
const dartboardRadius = Math.min(width, height) / 2 - dartboardPadding;
const board = {
    size: { x: dartboardRadius * 2, y: dartboardRadius * 2 },
    radius: dartboardRadius,
    center: { x: width / 2, y: height / 2 },
    padding: dartboardPadding,
    bullseye: {
        radius: 10 * (dartboardRadius / 300),
    },
}

const arcSize = 100 * (dartboardRadius / 300)
const multiplierSize = 10 * (dartboardRadius / 300);

const firstArcInnerRadius = (multiplierSize + multiplierSize);



const secondMultiplierInnerRadius = firstArcInnerRadius + arcSize
const secondArcInnerRadius = secondMultiplierInnerRadius + multiplierSize;
const thirdMultiplierInnerRadius = secondArcInnerRadius + arcSize

const fontSize = 30 * (dartboardRadius / 300);


const numbers = new Array(20).fill(0)
const dartBoardNumbers = numbers.map((_, i) => {
    const angleStep = 360 / numbers.length;
    const rotation = i * angleStep - angleStep / 2 - 90;
    return new DartBoardSegment({
        index: i,
        value: i + 1,
        rotation,
        isEven: i % 2 === 0,
        angleStep,
    });
});

export function DartsCanvas() {
    const [dartPos, setDartPos] = useState<{ x: number; y: number } | null>(null);
    const [aimPos, setAimPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const accuracy = 40 * (dartboardRadius / 300); // Max distance from center for a "perfect" throw

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#282828' }}>
            <Stage width={width} height={height}
                onMouseMove={(e) => {
                    const stage = e.target.getStage();
                    const pointerPosition = stage?.getPointerPosition();
                    if (pointerPosition) {
                        setAimPos(pointerPosition);
                    }
                }}
                onClick={(e) => {
                    const hitResult = throwDart({
                        board,
                        accuracy,
                        pointOfAim: aimPos,
                        adjustments: [],
                        segments: dartBoardNumbers,
                    });
                    console.log('Dart hit result:', hitResult);
                    setDartPos(hitResult.hitPosition);
                }}>
                <Layer>
                    <Group x={width / 2} y={height / 2}>
                        <Circle // Board Background
                            radius={dartboardRadius}
                            fill="#000000"
                        />
                        {dartBoardNumbers.map(({ value, rotation, isEven }, i) => {
                            const angleStep = 360 / dartBoardNumbers.length;
                            //const rotation = i * angleStep - angleStep / 2 - 90;
                            //const isEven = i % 2 === 0;

                            return (
                                <Group // Wedges
                                    key={`seg-${value}`}
                                    rotation={rotation}
                                >
                                    <Arc // Inner-wedge
                                        innerRadius={firstArcInnerRadius}
                                        outerRadius={firstArcInnerRadius + arcSize}
                                        angle={angleStep}
                                        fill={isEven ? "#222" : "#ececec"}
                                    />
                                    <Arc // Multiplier middle
                                        innerRadius={secondMultiplierInnerRadius}
                                        outerRadius={secondMultiplierInnerRadius + multiplierSize}
                                        angle={angleStep}
                                        fill={isEven ? "#931e1e" : "#25662a"}
                                    />

                                    <Arc // Outer-wedge
                                        innerRadius={secondArcInnerRadius}
                                        outerRadius={secondArcInnerRadius + arcSize}
                                        angle={angleStep}
                                        fill={isEven ? "#222" : "#ececec"}
                                    />
                                    <Arc // Multiplier edge
                                        innerRadius={thirdMultiplierInnerRadius}
                                        outerRadius={thirdMultiplierInnerRadius + multiplierSize}
                                        angle={angleStep}
                                        fill={isEven ? "#931e1e" : "#25662a"}
                                    />
                                    <Text
                                        x={thirdMultiplierInnerRadius + multiplierSize + 100 - fontSize}
                                        y={fontSize / 2 + 50}
                                        text={`${value.toString()}`}
                                        fontSize={fontSize}
                                        fontFamily="Calibri"
                                        fill="white"
                                        rotation={-rotation} // Counter-rotate text
                                        offsetX={20} // Approximate half width
                                    />
                                </Group>
                            )
                        })}
                        <Ring // 50 point ring. 
                            innerRadius={board.bullseye.radius}
                            outerRadius={board.bullseye.radius + multiplierSize}
                            fill="#25662a"
                        //stroke="#000"
                        />
                        <Circle
                            radius={board.bullseye.radius}
                            fill="#931e1e"
                        //stroke="#000"
                        />

                    </Group>



                    <Circle // Aim indicator
                        fill="#ffffff2c"
                        stroke={"white"}
                        radius={accuracy}
                        x={aimPos?.x || 0}
                        y={aimPos?.y || 0}
                    />
                    {dartPos && (
                        <Circle // Dart hit position
                            fill="#ff0000"
                            stroke={"white"}
                            radius={10}
                            x={dartPos.x}
                            y={dartPos.y}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
}