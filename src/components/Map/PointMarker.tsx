import type { Point } from "../../types/point";

interface Props {
    point: Point;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<Point>) => void;
}

export default function PointMarker ({point, isSelected, onSelect, onUpdate}: Props) {
    const handleDrag = (e: React.MouseEvent<SVGCircleElement>) => {
        e.stopPropagation();
        const svg = e.currentTarget.ownerSVGElement!;
        const move = (moveEvent: MouseEvent) => {
            const rect = svg.getBoundingClientRect();
            const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
            const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
            onUpdate({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2))});
        };

        const up = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        };

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    };

    return (
    <g>
      <circle
        cx={point.x + '%'}
        cy={point.y + '%'}
        r="12"
        fill={isSelected ? '#ff0000' : '#0066ff'}
        stroke="#fff"
        strokeWidth="3"
        style={{ cursor: 'move' }}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onMouseDown={handleDrag}
      />
      <text
        x={point.x + '%'}
        y={point.y + '%'}
        dy="-15"
        textAnchor="middle"
        fontSize="14"
        fill="#333"
        pointerEvents="none"
      >
        {point.name} ({point.amount})
      </text>
    </g>
  );
}