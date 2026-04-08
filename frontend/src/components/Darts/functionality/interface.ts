
export type Position = { x: number, y: number }

export class Wedge {
    size: number
    color: string | "override" | null
    multiplier: number

    constructor({ size, color, multiplier }: { size: number, color: string | "override" | null, multiplier: number }) {
        this.size = size;
        this.color = color;
        this.multiplier = multiplier;
    }
}

export class DartBoardSegment {
    index: number;
    value: number;
    rotation: number;
    isEven: boolean;
    angleStart: number;
    angleEnd: number;
    wedges?: Wedge[];
    offset: number;

    constructor({
        angleStep, index, value, rotation, isEven, wedges, offset
    }: {
        index: number,
        value: number,
        rotation: number,
        isEven: boolean,
        angleStep: number,
        wedges?: Wedge[],
        offset: number,
    }) {
        this.index = index;
        this.value = value;
        this.rotation = rotation;
        this.isEven = isEven;
        this.offset = offset;
        this.angleStart = rotation;
        this.angleEnd = rotation + angleStep;
        this.wedges = wedges ?? this.createNewDefaultWedges();
    }


    createNewDefaultWedges(): Wedge[] {
        const multiplierPercentage = 5
        const normalPercentage = 45
        return [
            new Wedge({ size: normalPercentage, color: null, multiplier: 1 }),
            new Wedge({ size: multiplierPercentage, color: "multiplier", multiplier: 2 }),
            new Wedge({ size: normalPercentage, color: null, multiplier: 1 }),
            new Wedge({ size: multiplierPercentage, color: "multiplier", multiplier: 3 }),
        ];
    }
}

export class Bullseye {
    radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }
}

export class DartBoard {
    size: Position;
    radius: number;
    center: Position;
    padding: number;
    bullseye: Bullseye;

    constructor({
        size, radius, center, padding, bullseye
    }: {
        size: Position,
        radius: number,
        center: Position,
        padding: number,
        bullseye: Bullseye,
    }) {
        this.size = size;
        this.radius = radius;
        this.center = center;
        this.padding = padding;
        this.bullseye = bullseye;
    }
}