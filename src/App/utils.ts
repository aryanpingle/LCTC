export function isPowerOfTwo(n: number): boolean {
  return Math.round(Math.sqrt(n)) ** 2 == n;
}

export const print = (...args: any) => console.log;

export const linkRef = (obj: any, name: string) => {
  const refName = `$$ap_${name}`;
  let ref = obj[refName];
  if (!ref) {
    ref = obj[refName] = (element: any) => {
      obj[name] = element;
    };
  }
  return ref;
};

export function removeUnit(s: string): number {
  if (s.endsWith('px') || s.endsWith('em'))
    return parseFloat(s.substring(0, s.length - 2));

  return parseFloat(s);
}

export function getLetterWidth(
  canvas: HTMLCanvasElement,
  font_size: number,
): number {
  const ctx = canvas.getContext('2d');
  ctx.font = `${font_size}px Courier New`;
  return ctx.measureText('IM').width / 2;
}

export class Box {
  left: number;
  top: number;
  width: number;
  height: number;

  constructor(left: number, top: number, width: number, height: number) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }

  fill(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(0, ${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255,
    )}, 0.25)`;
    ctx.fillRect(this.left, this.top, this.width, this.height);
    ctx.fill();
  }

  getCenter(): [number, number] {
    return [
      Math.floor(this.left + this.width / 2),
      Math.floor(this.top + this.height / 2),
    ];
  }

  joinByLine(ctx: CanvasRenderingContext2D, box2: Box) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(...this.getCenter());
    ctx.lineTo(...box2.getCenter());
    ctx.closePath();
    ctx.stroke();
  }
}
