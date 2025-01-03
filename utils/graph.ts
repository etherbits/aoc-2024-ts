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

export function wrap2D(a: Vec2D, max: Vec2D, min = { x: 0, y: 0 }): Vec2D {
  return { x: wrap(a.x, max.x, min.x), y: wrap(a.y, max.y, min.y) };
}

function wrap(num: number, max: number, min: number) {
  if (num < min) {
    return max - Math.abs(min - num);
  } else if (num >= max) {
    return min + Math.abs(num - max);
  }

  return num;
}

export const straightDirs: Vec2D[] = [
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];
