import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getInitialPoints, savePoints, resetPoints, loadPoints } from '../../lib/storage';
import type { Point } from '../../types/point';
import PointMarker from './PointMarker';
import Controls from './Controls';
import '../../assets/styles/components/Map/_MapPage.scss';

export default function MapPage() {
  const { logout } = useAuth();
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getInitialPoints().then((pts) => {
      setPoints(pts);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) savePoints(points);
  }, [points, isLoading]);

  const selectedPoint = useMemo(
    () => points.find(p => p.id === selectedId) || null,
    [points, selectedId]
  );

  const getPointFromEvent = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const cursor = point.matrixTransform(svg.getScreenCTM()!.inverse());

    const x = Number(((cursor.x / 1000) * 100).toFixed(2));
    const y = Number(((cursor.y / 800) * 100).toFixed(2));

    return { x, y };
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = getPointFromEvent(e);
    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newPoint: Point = {
      id: Date.now().toString(),
      x,
      y,
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

  if (isLoading) {
    return <div className="map-page__loader">Загрузка карты...</div>;
  }

  return (
    <div className="map-page">
      <Controls onLogout={logout} onReset={handleReset} />

      <svg
        viewBox="0 0 1000 800"
        className="map-page__svg"
        onClick={handleMapClick}
      >
        <image href="/tutzing.svg" width="1000" height="800" />

        {points.map(point => (
          <PointMarker
            key={point.id}
            point={point}
            isSelected={point.id === selectedId}
            onSelect={() => setSelectedId(point.id)}
            onUpdate={updatePoint.bind(null, point.id)}
          />
        ))}
      </svg>

      {selectedPoint && (
        <div className="editor-panel">
          <h3 className="editor-panel__title">Редактирование точки</h3>
          <label className="editor-panel__label">Название</label>
          <input
            className="editor-panel__input"
            value={selectedPoint.name}
            onChange={e => updatePoint(selectedPoint.id, { name: e.target.value })}
            autoFocus
          />
          <label className="editor-panel__label">Количество товара (шт.)</label>
          <input
            className="editor-panel__input"
            type="number"
            value={selectedPoint.amount}
            onChange={e => updatePoint(selectedPoint.id, { amount: Number(e.target.value) || 0 })}
          />
          <div className="editor-panel__coords">
            X: {selectedPoint.x}% | Y: {selectedPoint.y}%
          </div>
          <div className="editor-panel__actions">
            <button onClick={() => deletePoint(selectedPoint.id)}>Удалить</button>
            <button onClick={() => setSelectedId(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}