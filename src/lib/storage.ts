import type { Point } from "../types/point";

const POINTS_KEY = 'sales_points';
const ORIGINAL_POINTS_KEY = 'original_sale_points';

export const loadPoints = (): Point[] => {
    const data = localStorage.getItem(POINTS_KEY);
    if (data) return JSON.parse(data);

    fetch('/points.json')
        .then(r => r.json())
        .then(json => {
            const points = json.map((p: any, i: number) => ({...p, id: String(i+1)}));
            localStorage.setItem(POINTS_KEY, JSON.stringify(points));
            localStorage.setItem(ORIGINAL_POINTS_KEY, JSON.stringify(points));
            return points
        })
        .catch(() => []);

        return [];
};

export const savePoints = (points: Point[]) => {
    localStorage.setItem(POINTS_KEY, JSON.stringify(points));
};

export const resetPoints = () => {
    const original = localStorage.getItem(ORIGINAL_POINTS_KEY);
    if (original) {
        localStorage.setItem(POINTS_KEY, original);
    }
};