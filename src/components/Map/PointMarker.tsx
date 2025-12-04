import { useRef } from 'react';
import type { Point } from '../../types/point';
import '../../assets/styles/components/Map/_PointMarker.scss';

interface Props {
  point: Point;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Point>) => void;
  clientToPercent: (clientX: number, clientY: number) => { x: number; y: number };
}

export default function PointMarker({
  point,
  isSelected,
  onSelect,
  onUpdate,
  clientToPercent,
}: Props) {
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement>) => {
    e.stopPropagation();
    e.preventDefault(); 

    isDraggingRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = Math.abs(moveEvent.clientX - startPosRef.current.x);
      const dy = Math.abs(moveEvent.clientY - startPosRef.current.y);

      if (dx > 3 || dy > 3) {
        isDraggingRef.current = true;
      }

      if (isDraggingRef.current) {
        const { x, y } = clientToPercent(moveEvent.clientX, moveEvent.clientY);
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
          onUpdate({ x, y });
        }
      }
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) {
        onSelect();
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <g className="point-marker">
      <circle
        cx={`${point.x}%`}
        cy={`${point.y}%`}
        r={isSelected ? 16 : 12}
        className={`point-marker__circle ${isSelected ? 'point-marker__circle--selected' : ''}`}
        onMouseDown={handleMouseDown}
        style={{ cursor: 'move' }}
      />

      <text
        x={`${point.x}%`}
        y={`${point.y}%`}
        dy="-20"
        textAnchor="middle"
        className="point-marker__label"
        pointerEvents="none"
      >
        {point.name}
        {point.amount > 0 && ` (${point.amount})`}
      </text>
    </g>
  );
}