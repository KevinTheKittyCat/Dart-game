
export type Position = { x: number, y: number }

export class Wedge {
    size: number
    color: string | "override"
    multiplier: number

    constructor({ size, color, multiplier }: { size: number, color: string | "override", multiplier: number }) {
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

    constructor({
        angleStep, index, value, rotation, isEven, wedges
    }: {
        index: number,
        value: number,
        rotation: number,
        isEven: boolean,
        angleStep: number,
        wedges?: Wedge[]
    }) {
        this.index = index;
        this.value = value;
        this.rotation = rotation;
        this.isEven = isEven;
        this.angleStart =  ((rotation + 360) ) % 360,
        this.angleEnd = ((rotation + angleStep + 360) % 360),
        this.wedges = wedges ?? this.createNewDefaultWedges();
    }


    createNewDefaultWedges(): Wedge[] {
        return [
            new Wedge({ size: 46, color: "override", multiplier: 1 }),
            new Wedge({ size: 2, color: "override", multiplier: 2 }),
            new Wedge({ size: 46, color: "override", multiplier: 1 }),
            new Wedge({ size: 2, color: "override", multiplier: 3 }),
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