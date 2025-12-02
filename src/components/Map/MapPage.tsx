import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { loadPoints, savePoints, resetPoints } from '../../lib/storage';
import type { Point } from '../../types/point';
import PointMarker from './PointMarker';
import Controls from './Controls';

export default function MapPage() {
  const { logout } = useAuth();

  const [points, setPoints] = useState<Point[]>(() => {
    return loadPoints();
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);


  useEffect(() => {
    savePoints(points);
  }, [points]);


  const selectedPoint = useMemo(() => {
    return points.find(p => p.id === selectedId) || null;
  }, [points, selectedId]);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

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
    setSelectedId(prev => prev === id ? null : prev);
  };

  const handleReset = () => {
    if (confirm('Сбросить все изменения и вернуть исходные точки?')) {
      resetPoints();
      setPoints(loadPoints()); 
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Controls onLogout={logout} onReset={handleReset} />
      
      <svg
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', background: '#f5f5f5' }}
        onClick={handleMapClick}
      >
        <image href="/tutzing.svg" width="1000" height="800" preserveAspectRatio="xMidYMid meet" />
        
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
          position: 'absolute',
          top: 70,
          right: 20,
          background: 'white',
          padding: 20,
          border: '1px solid #ccc',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: 320,
          zIndex: 100
        }}>
          <h3 style={{ margin: '0 0 16px' }}>Редактирование точки</h3>
          
          <label style={{ display: 'block', marginBottom: 8 }}>Название</label>
          <input
            value={selectedPoint.name}
            onChange={e => updatePoint(selectedPoint.id, { name: e.target.value })}
            style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ddd' }}
            autoFocus
          />
          
          <label style={{ display: 'block', marginBottom: 8 }}>Количество товара (шт.)</label>
          <input
            type="number"
            value={selectedPoint.amount}
            onChange={e => updatePoint(selectedPoint.id, { amount: Number(e.target.value) || 0 })}
            style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd' }}
          />
          
          <div style={{ marginBottom: 16, color: '#666', fontSize: '14px' }}>
            Координаты: X: {selectedPoint.x}% | Y: {selectedPoint.y}%
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => deletePoint(selectedPoint.id)} style={{ flex: 1, padding: 10, background: '#ff4444', color: 'white', border: 'none', borderRadius: 6 }}>
              Удалить
            </button>
            <button onClick={() => setSelectedId(null)} style={{ flex: 1, padding: 10, background: '#666', color: 'white', border: 'none', borderRadius: 6 }}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}