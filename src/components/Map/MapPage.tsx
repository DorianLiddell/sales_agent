import { useEffect, useMemo, useRef, useState } from 'react';
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

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    getInitialPoints().then((pts) => {
      setPoints(pts);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) savePoints(points);
  }, [points, isLoading]);

  const clientToPercent = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const cursor = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    return {
      x: Number(((cursor.x / 1000) * 100).toFixed(2)),
      y: Number(((cursor.y / 800) * 100).toFixed(2)),
    };
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target instanceof SVGCircleElement || e.target instanceof SVGTextElement) {
      return;
    }

    const { x, y } = clientToPercent(e.clientX, e.clientY);
    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newPoint: Point = {
      id: Date.now().toString(),
      x,
      y,
      name: 'Новая точка',
      amount: 0,
    };

    setPoints((p) => [...p, newPoint]);
    setSelectedId(newPoint.id);
  };

  const updatePoint = (id: string, updates: Partial<Point>) => {
    setPoints((p) => p.map((pt) => (pt.id === id ? { ...pt, ...updates } : pt)));
  };

  const deletePoint = (id: string) => {
    setPoints((p) => p.filter((pt) => pt.id !== id));
    setSelectedId(null);
  };

  const handleReset = () => {
    if (confirm('Сбросить все изменения и вернуть исходные точки?')) {
      resetPoints();
      setPoints(loadPoints());
      setSelectedId(null);
    }
  };

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedId) || null,
    [points, selectedId]
  );

  if (isLoading) {
    return <div className="map-page__loader">Загрузка карты...</div>;
  }

  return (
    <div className="map-page">
      <Controls onLogout={logout} onReset={handleReset} />

      <svg
        ref={svgRef}
        viewBox="0 0 1000 800"
        className="map-page__svg"
        onClick={handleMapClick}
      >
        <image href="/tutzing.svg" width="1000" height="800" />

        {points.map((point) => (
          <PointMarker
            key={point.id}
            point={point}
            isSelected={point.id === selectedId}
            onSelect={() => setSelectedId(point.id)}
            onUpdate={(updates) => updatePoint(point.id, updates)}
            clientToPercent={clientToPercent}
          />
        ))}
      </svg>

      {selectedPoint && (
        <div className="editor-panel">
          <h3 className="editor-panel__title">Редактирование</h3>
          <label className="editor-panel__label">Название</label>
          <input
            className="editor-panel__input"
            value={selectedPoint.name}
            onChange={(e) => updatePoint(selectedPoint.id, { name: e.target.value })}
            autoFocus
          />
          <label className="editor-panel__label">Количество товара (шт.)</label>
          <input
            className="editor-panel__input"
            type="number"
            value={selectedPoint.amount || ''}
            onChange={(e) => updatePoint(selectedPoint.id, { amount: Number(e.target.value) || 0 })}
          />
          <div className="editor-panel__actions">
            <button onClick={() => deletePoint(selectedPoint.id)}>Удалить</button>
            <button onClick={() => setSelectedId(null)}>Готово</button>
          </div>
        </div>
      )}
    </div>
  );
}