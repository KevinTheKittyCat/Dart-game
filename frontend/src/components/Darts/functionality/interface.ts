export const width = window.innerWidth;
export const height = window.innerHeight;
export const dartboardPadding = 50;
export const dartboardRadius = Math.min(width, height) / 2 - dartboardPadding;


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

export class DartTip {
    weight: number = 20;
    multiplier: number = 1;
    tags: string[] = []; // Example: "sharp", "steel", "soft", "magnetic", etc.
    id: string = "steel-rod"; // Unique identifier for the tip type to match with json data
    constructor() { }
}
export class DartBarrel {
    weight: number = 20;
    constructor() { }
}
export class DartShaft {
    constructor() { }
}
export class DartFlight {
    constructor() { }
}

export class Dart {
    id: number = Math.floor(Math.random() * 1000000);

    // Components
    tip: DartTip = new DartTip();
    barrel: DartBarrel = new DartBarrel();
    shaft: DartShaft = new DartShaft();
    flight: DartFlight = new DartFlight();

    constructor(props?: Dart) {
        if (!props) return;
        const { tip, barrel, shaft, flight } = props;
        this.tip = tip;
        this.barrel = barrel;
        this.shaft = shaft;
        this.flight = flight;
    }
}

export class ThrownDart extends Dart {
    pointsScored: number = 0;
    hitPosition: Position | null = null;
    hitSegment: DartBoardSegment | null = null;
    hitResult: any = null;
    pointOfAim: Position = { x: 0, y: 0 };
    parentId: any = null;

    constructor(props: Dart & {
        hitPosition: Position | null,
        hitSegment: DartBoardSegment | null,
        hitResult: any,
        pointsScored: number,
        pointOfAim: Position,
    }) {
        super(props);
        this.hitSegment = props.hitSegment;
        this.hitPosition = props.hitPosition;
        this.hitResult = props.hitResult;
        this.pointsScored = props.pointsScored;
        this.pointOfAim = props.pointOfAim;
        this.parentId = props.id;
    }
}

export class Relic { }


