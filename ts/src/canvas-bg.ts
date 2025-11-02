// Simple animated gradient background on a full-screen canvas.
// Keeps CPU low and looks pleasant.

function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(window.innerWidth * dpr));
  const height = Math.max(1, Math.floor(window.innerHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
}

export default function startCanvasBackground(id = 'bg-canvas') {
  let canvas = document.getElementById(id) as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = id;
    document.body.insertBefore(canvas, document.body.firstChild);
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // nothing to do

  let t = 0;
  function draw() {
    fitCanvas(canvas as HTMLCanvasElement);
    const w = canvas!.width;
    const h = canvas!.height;

    // moving radial gradient (much slower motion)
    const cx = w * (0.5 + 0.25 * Math.sin(t * 0.03));
    const cy = h * (0.5 + 0.25 * Math.cos(t * 0.028));
    const r = Math.max(w, h) * 0.8;

    const g = ctx!.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
    const a = (Math.sin(t * 0.005) + 1) / 2;
    g.addColorStop(0, `rgba(40,120,255,${0.95 - 0.25 * a})`);
    g.addColorStop(0.5, `rgba(26,200,180,${0.6 + 0.2 * a})`);
    g.addColorStop(1, `rgba(10,10,30,${0.95})`);

    ctx!.fillStyle = g;
    ctx!.fillRect(0, 0, w, h);

    // subtle, slow noise overlay
    ctx!.globalCompositeOperation = 'overlay';
    ctx!.fillStyle = `rgba(255,255,255,${0.01 + 0.005 * Math.sin(t * 0.01)})`;
    ctx!.fillRect(0, 0, w, h);
    ctx!.globalCompositeOperation = 'source-over';

    // advance time slowly for a gentle animation
    t += 0.25;
    requestAnimationFrame(draw);
  }

  // resize handling
  window.addEventListener('resize', () => fitCanvas(canvas as HTMLCanvasElement));
  draw();
}
