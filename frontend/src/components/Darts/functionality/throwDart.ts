import { DartBoardSegment, Wedge } from "./interface"

type Position = { x: number, y: number }
interface DartBoard {
    size: Position,
    radius: number,
    center: Position,
    padding: number,
    bullseye: {
        radius: number,
    }
}

interface DartThrow {
    board: DartBoard
    accuracy: number
    pointOfAim: Position
    adjustments: any[]
    segments: DartBoardSegment[]
}

// This is because the hitPosition is from window.innerWidth & Height
const fullWindowSize = { x: window.innerWidth, y: window.innerHeight }

export function throwDart({
    board,
    accuracy,
    pointOfAim,
    adjustments,
    segments
}: DartThrow) {
    const hitPosition = noiseHit({ accuracy, pointOfAim });
    const adjustedPosition = adjustThrow({ adjustments, pointOfAim: hitPosition });
    const hitSegment = determineHitSegment(adjustedPosition, segments, fullWindowSize);
    if (!hitSegment) return { hitPosition: adjustedPosition, hitSegment: null };
    const hitResult = determineSegmentMultiplier(adjustedPosition, hitSegment, board);

    return {
        hitPosition: adjustedPosition,
        hitSegment,
        hitResult,
    };
}


function noiseHit({ accuracy, pointOfAim }: Pick<DartThrow, 'accuracy' | 'pointOfAim'>): Position {
    const noiseX = (Math.random() - 0.5) * (accuracy * 2)
    const noiseY = (Math.random() - 0.5) * (accuracy * 2)
    const finalX = pointOfAim.x //+ noiseX;
    const finalY = pointOfAim.y //+ noiseY;
    return { x: finalX, y: finalY };
}

function adjustThrow({ adjustments, pointOfAim }: Pick<DartThrow, 'adjustments' | 'pointOfAim'>): Position {
    // Add adjustments logic here - like magnetic fields, wind, etc.
    // For now, we'll just return the point of aim without adjustments.
    return { x: pointOfAim.x, y: pointOfAim.y };
}

function getHitAngle(boardSize: Position, position: Position): number {
    const centerX = boardSize.x / 2;
    const centerY = boardSize.y / 2;
    return (360 + Math.atan2(position.y - centerY, position.x - centerX) * (180 / Math.PI)) % 360;
}


function determineHitSegment(position: Position, segments: DartBoardSegment[], boardSize: Position): DartBoardSegment | null {
    const hitAngle = getHitAngle(boardSize, position);
    console.log({ hitAngle })
    const segmentAngleHit = segments.find(segment => {
        const adjustedHitAngle = hitAngle; // Adjust hit angle based on segment offset
        if ( segment.angleStart < 0 || segment.angleEnd < 0) {
            const adjustedAngleStart = (segment.angleStart + 360) % 360;
            const adjustedAngleEnd = (segment.angleEnd + 360) % 360;
            if (adjustedAngleStart > adjustedAngleEnd) {
                return adjustedHitAngle >= adjustedAngleStart || adjustedHitAngle < adjustedAngleEnd;
            }
            return adjustedHitAngle >= adjustedAngleStart && adjustedHitAngle < adjustedAngleEnd;
        }
        return segment.angleStart <= adjustedHitAngle && adjustedHitAngle < segment.angleEnd;
    });
    console.log({ segmentsWithAnglesOver270: segments.reduce((acc, segment) => {
        if (segment.angleStart > 270 || segment.angleEnd > 270) {
            acc.push({ value: segment.value, angleStart: segment.angleStart, angleEnd: segment.angleEnd });
        }        return acc;
    }, [] as any[]) })
    return segmentAngleHit || null;
}

function determineSegmentMultiplier(position: Position, segment: DartBoardSegment, board: DartBoard): Wedge | null {
    const centerX = board.center.x;
    const centerY = board.center.y;
    const distanceFromCenter = Math.sqrt((position.x - centerX) ** 2 + (position.y - centerY) ** 2);
    const boardPercentDistance = (distanceFromCenter / (board.radius - board.padding)) * 100; // Convert to percentage of board radius
    const bullseyePercentage = (board.bullseye.radius / (board.radius - board.padding)) * 100;
    const paddingPercentage = (board.padding / (board.radius - board.padding)) * 100;
    const boardWedgePercent = boardPercentDistance + bullseyePercentage + paddingPercentage / 2; // Adjust distance to account for bullseye radius 

    let currentWedgePercentage = 0;
    for (const wedge of segment.wedges || []) {
        const wedgeInnerRadius = currentWedgePercentage;
        const wedgeOuterRadius = currentWedgePercentage + wedge.size;
        //console.log({ wedge, distanceFromCenter, wedgeInnerRadius, wedgeOuterRadius });
        if (boardWedgePercent >= wedgeInnerRadius && boardWedgePercent <= wedgeOuterRadius) {
            return wedge;
        }
        currentWedgePercentage += wedge.size;
    }
    return null;
}

/*
function determineSegmentMultiplier(position: Position, segment: DartBoardSegment, board: DartBoard): Wedge | null {
    const centerX = board.size.x / 2;
    const centerY = board.size.y / 2;
    const distanceFromCenter = Math.sqrt((position.x - centerX) ** 2 + (position.y - centerY) ** 2);
    const boardPercentDistance = (distanceFromCenter / (board.size.x / 2)) * 100; // Convert to percentage of board radius

    let currentWedgePercentage = 0;
    console.log(boardPercentDistance)
    for (const wedge of segment.wedges || []) {
        const wedgeInnerRadius = currentWedgePercentage;
        const wedgeOuterRadius = currentWedgePercentage + wedge.size;
        console.log({ wedge, distanceFromCenter, wedgeInnerRadius, wedgeOuterRadius });
        if (boardPercentDistance >= wedgeInnerRadius && boardPercentDistance <= wedgeOuterRadius) {
            return wedge;
        }
        currentWedgePercentage += wedge.size;
    }
    return null;
}
*/