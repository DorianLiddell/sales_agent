import type { Point } from '../../types/point';
import '../../assets/styles/components/Map/_PointMarker.scss';

interface Props {
  point: Point;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Point>) => void;
}

export default function PointMarker({ point, isSelected, onSelect, onUpdate }: Props) {
  const handleDragStart = (e: React.MouseEvent<SVGCircleElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const svg = e.currentTarget.ownerSVGElement!;
    const point = svg.createSVGPoint();

    const move = (moveEvent: MouseEvent) => {
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const cursor = point.matrixTransform(svg.getScreenCTM()!.inverse());

      const x = Number(((cursor.x / 1000) * 100).toFixed(2));
      const y = Number(((cursor.y / 800) * 100).toFixed(2));

      if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
        onUpdate({ x, y });
      }
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const handleClick = (e: React.MouseEvent<SVGCircleElement>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <g className="point-marker">
      <circle
        cx={`${point.x}%`}
        cy={`${point.y}%`}
        r={isSelected ? 15 : 11}
        className={`point-marker__circle ${isSelected ? 'point-marker__circle--selected' : ''}`}
        onMouseDown={handleDragStart}
        onClick={handleClick}
      />
      <text
        x={`${point.x}%`}
        y={`${point.y}%`}
        dy="-18"
        className="point-marker__label"
      >
        {point.name} {point.amount > 0 && `(${point.amount})`}
      </text>
    </g>
  );
}