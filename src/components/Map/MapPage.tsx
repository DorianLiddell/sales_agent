import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { loadPoints, savePoints, resetPoints, Point } from '../../lib/storage';


export default function MapPage() {
  const { logout } = useAuth();
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setPoints(loadPoints());
  }, []);

  useEffect(() => {
    if (points.length > 0) savePoints(points);
  }, [points]);

  const selectedPoint = points.find(p => p.id === selectedId);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!e.target) return;
    const svg = e.currentTarget;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const cursor = point.matrixTransform(svg.getScreenCTM()!.inverse());

    const rect = svg.getBoundingClientRect();
    const x = ((cursor.x - rect.left) / rect.width) * 100;
    const y = ((cursor.y - rect.top) / rect.height) * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newPoint: Point = {
      id: Date.now().toString(),
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      name: 'Новая точка',
      amount: 0,
    };
    setPoints(prev => [...prev, newPoint]);
    setSelectedId(newPoint.id);
  };

  const updatePoint = (id: string, updates: Partial<Point>) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePoint = (id: string) => {
    setPoints(prev => prev.filter(p => p.id !== id));
    setSelectedId(null);
  };

  const handleReset = () => {
    if (confirm('Сбросить все изменения?')) {
      resetPoints();
      setPoints(loadPoints());
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Controls onLogout={() => { logout(); }} onReset={handleReset} />
      
      <svg
        viewBox="0 0 1000  800"
        style={{ width: '100%', height: '100%', background: '#f5f5f5' }}
        onClick={handleMapClick}
      >
        <image href="/map.svg" width="1000" height="800" />
        
        {points.map(point => (
          <PointMarker
            key={point.id}
            point={point}
            isSelected={point.id === selectedId}
            onSelect={() => setSelectedId(point.id)}
            onUpdate={(updates) => updatePoint(point.id, updates)}
          />
        ))}
      </svg>

      {selectedPoint && (
        <div style={{
          position: 'absolute', top: 70, right: 20, background: 'white',
          padding: 15, border: '1px solid #ccc', borderRadius: 8, width: 300
        }}>
          <h3>Редактирование точки</h3>
          <input
            value={selectedPoint.name}
            onChange={e => updatePoint(selectedPoint.id, { name: e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <input
            type="number"
            value={selectedPoint.amount}
            onChange={e => updatePoint(selectedPoint.id, { amount: +e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <div style={{ marginBottom: 10 }}>
            X: {selectedPoint.x}% | Y: {selectedPoint.y}%
          </div>
          <button onClick={() => deletePoint(selectedPoint.id)} style={{ color: 'red' }}>
            Удалить точку
          </button>
          <button onClick={() => setSelectedId(null)} style={{ float: 'right' }}>
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
}