import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Arc, Circle, Group, Layer, Stage } from 'react-konva';

export const Route = createFileRoute('/_layout/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DartboardGame />;
}

// --- PURE LOGIC ---
export interface HitResult {
  score: number;
  multiplier: number;
  label: string;
}

const DARTBOARD_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

const calculateHit = (x: number, y: number, radius: number): HitResult => {
  const dx = x - radius;
  const dy = y - radius;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const normalizedRadius = distance / radius;

  // Calculate angle: 0 degrees is top (the 20 segment)
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 90 + 360) % 360; 

  const sliceWidth = 360 / DARTBOARD_NUMBERS.length;
  const sectionIndex = Math.floor(((angle + sliceWidth / 2) % 360) / sliceWidth);
  const score = DARTBOARD_NUMBERS[sectionIndex];

  if (normalizedRadius > 1) return { score: 0, multiplier: 0, label: "Miss!" };
  if (normalizedRadius <= 0.05) return { score: 50, multiplier: 1, label: "Double Bull!" };
  if (normalizedRadius <= 0.12) return { score: 25, multiplier: 1, label: "Single Bull" };
  
  // Ratios for standard board rings
  if (normalizedRadius >= 0.92 && normalizedRadius <= 1) 
    return { score: score * 2, multiplier: 2, label: `Double ${score}` };
  if (normalizedRadius >= 0.55 && normalizedRadius <= 0.62) 
    return { score: score * 3, multiplier: 3, label: `Triple ${score}` };

  return { score, multiplier: 1, label: `Single ${score}` };
};

// --- REACT COMPONENT ---
export const DartboardGame: React.FC = () => {
  const [lastHit, setLastHit] = useState<HitResult | null>(null);
  const [dartPos, setDartPos] = useState<{ x: number; y: number } | null>(null);
  
  const boardRadius = 250;
  const stageSize = boardRadius * 2;

  const handleThrow = () => {
    // Random throw within the stage
    const x = Math.random() * stageSize;
    const y = Math.random() * stageSize;
    
    const result = calculateHit(x, y, boardRadius);
    setDartPos({ x, y });
    setLastHit(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ textAlign: 'center', height: '50px' }}>
        {lastHit ? (
          <h2>{lastHit.label} ({lastHit.score} pts)</h2>
        ) : (
          <h2>Ready to throw?</h2>
        )}
      </div>

      <Stage width={stageSize} height={stageSize} style={{ border: '1px solid #ccc', borderRadius: '50%' }}>
        <Layer>
          <Group x={boardRadius} y={boardRadius}>
            {DARTBOARD_NUMBERS.map((num, i) => {
              const angleStep = 360 / DARTBOARD_NUMBERS.length;
              const rotation = i * angleStep - angleStep / 2 - 90;
              const isEven = i % 2 === 0;

              return (
                <Group key={`seg-${num}`} rotation={rotation}>
                  {/* Main Wedges */}
                  <Arc
                    innerRadius={boardRadius * 0.12}
                    outerRadius={boardRadius}
                    angle={angleStep}
                    fill={isEven ? "#222" : "#f0e68c"}
                    stroke="#444"
                  />
                  {/* Triple Ring */}
                  <Arc
                    innerRadius={boardRadius * 0.55}
                    outerRadius={boardRadius * 0.62}
                    angle={angleStep}
                    fill={isEven ? "#e91e63" : "#4caf50"}
                    stroke="#000"
                  />
                  {/* Double Ring */}
                  <Arc
                    innerRadius={boardRadius * 0.92}
                    outerRadius={boardRadius}
                    angle={angleStep}
                    fill={isEven ? "#e91e63" : "#4caf50"}
                    stroke="#000"
                  />
                </Group>
              );
            })}

            {/* Bullseyes */}
            <Circle radius={boardRadius * 0.12} fill="#4caf50" stroke="#000" />
            <Circle radius={boardRadius * 0.05} fill="#e91e63" stroke="#000" />
          </Group>

          {/* Visual Dart Marker */}
          {dartPos && (
            <Circle 
              x={dartPos.x} 
              y={dartPos.y} 
              radius={6} 
              fill="white" 
              stroke="black" 
              strokeWidth={2} 
              shadowBlur={5}
            />
          )}
        </Layer>
      </Stage>

      <button 
        onClick={handleThrow}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          cursor: 'pointer',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        🎯 Throw Dart
      </button>
    </div>
  );
};