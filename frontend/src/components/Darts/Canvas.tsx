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
});
const angleStep = 360 / dartBoardNumbers.length;

export function DartsCanvas() {
    const [dartPos, setDartPos] = useState<{ x: number; y: number } | null>(null);
    const [aimPos, setAimPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hit, setHit] = useState<any>(null);
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
                    setHit(hitResult);
                }}>
                <Layer>
                    <Group x={width / 2} y={height / 2}>
                        <Circle // Board Background
                            radius={dartboardRadius}
                            fill="#000000"
                        />
                        {dartBoardNumbers.map(({ value, rotation, isEven, wedges }) => {
                            return (
                                <Group // Wedges
                                    key={`seg-${value}`}
                                    rotation={rotation}
                                >
                                    {wedges?.map((wedge, i) => {
                                        const beforeWedges = wedges.slice(0, i).reduce(
                                            (sum, w) => {
                                                sum += w.size;
                                                return sum;
                                            },
                                            (board.bullseye.radius + multiplierSize) / (board.radius - board.padding) * 100
                                        );
                                        const radius = (board.radius - board.padding) / 100;
                                        const wedgeInnerRadius = radius * beforeWedges;
                                        const wedgeOuterRadius = wedgeInnerRadius + radius * wedge.size;
                                        const wedgeColor = wedge.color ?
                                            wedge.color === "multiplier" ? (wedge.multiplier === 2 ? "#25662a" : "#931e1e") : wedge.color
                                            : (isEven ? "#222" : "#ececec");
                                        return (
                                            <Arc
                                                key={`wedge-${value}-${i}`}
                                                innerRadius={wedgeInnerRadius}
                                                outerRadius={wedgeOuterRadius}
                                                angle={angleStep}
                                                fill={wedgeColor}
                                                stroke={hit?.hitSegment?.value === value && hit.hitResult?.multiplier === wedge.multiplier ? "yellow" : undefined}
                                            />
                                        )
                                    })}
                                    <Text
                                        text={value.toString()}
                                        fontSize={fontSize}
                                        fill={"#fff"}
                                        rotation={-rotation}
                                        x={board.radius - board.padding + 50}
                                        y={60 * (dartboardRadius / 300)}
                                        align="center"
                                        verticalAlign="middle"
                                        offsetX={30}
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
            <h2 style={{ position: 'absolute', top: 20, left: 20, color: '#ffffff' }}>{
                hit ? `Hit: ${hit.hitSegment?.value} ${hit.hitResult?.multiplier}x` : ''
            }</h2>
        </div>
    );
}