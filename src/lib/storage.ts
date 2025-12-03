import type { Point } from "../types/point";

const POINTS_KEY = 'sales_points';
const ORIGINAL_POINTS_KEY = 'original_sale_points';

interface RawPoint {
    x: number;
    y: number;
    name: string;
    [key: string]: unknown; 
}

export const loadPoints = (): Point[] => {
  const saved = localStorage.getItem(POINTS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const getInitialPoints = async (): Promise<Point[]> => {
  const savedPoints = loadPoints();
  if (savedPoints.length > 0) {
    return savedPoints;
  }

  try {
    const response = await fetch('/model.json');
    if (!response.ok) {
      console.warn('model.json не найден или ошибка сети');
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.warn('model.json должен быть массивом');
      return [];
    }

    const points: Point[] = data.map((item: RawPoint, index: number) => ({
      id: `point-${Date.now()}-${index}`,
      x: Number(item.x ?? 50),
      y: Number(item.y ?? 50),
      name: String(item.name || `Точка ${index + 1}`),
      amount: Number(item.amount || 0),
    }));

    localStorage.setItem(POINTS_KEY, JSON.stringify(points));
    if (!localStorage.getItem(ORIGINAL_POINTS_KEY)) {
      localStorage.setItem(ORIGINAL_POINTS_KEY, JSON.stringify(points));
    }

    return points;
  } catch (err) {
    console.error('Ошибка загрузки model.json:', err);
    return [];
  }
};

export const savePoints = (points: Point[]) => {
  localStorage.setItem(POINTS_KEY, JSON.stringify(points));
};

export const resetPoints = () => {
  const original = localStorage.getItem(ORIGINAL_POINTS_KEY);
  if (original) {
    localStorage.setItem(POINTS_KEY, original);
  } else {
    localStorage.removeItem(POINTS_KEY);
  }
};