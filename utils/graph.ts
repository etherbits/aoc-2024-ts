export type Vec2D = { x: number; y: number };

export function vec2DSub(a: Vec2D, b: Vec2D): Vec2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vec2DAdd(a: Vec2D, b: Vec2D): Vec2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vec2DNeg(a: Vec2D): Vec2D {
  return { x: -a.x, y: -a.y };
}

export function vec2DEq(a: Vec2D, b: Vec2D) {
  return a.x == b.x && a.y == b.y;
}

export function check2DInRange(a: Vec2D, max: Vec2D, min = { x: 0, y: 0 }) {
  return !(a.x < min.x || a.x >= max.x || a.y < min.y || a.y >= max.y);
}

export const straightDirs: Vec2D[] = [
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];
