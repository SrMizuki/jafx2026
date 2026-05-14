/* JAFX Hero Mesh — Three.js forex-themed background variations.
   API: window.JAFXMesh.mount(canvas, {variation, accent}); .setVariation(name); .destroy() */
(function () {
  const w = window;
  if (!w.THREE) { console.warn('[hero-mesh] THREE not loaded'); return; }
  const THREE = w.THREE;

  const VARIATIONS = ['candles', 'flow', 'mesh', 'particles', 'orderbook'];

  class HeroMesh {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.variation = opts.variation || 'candles';
      this.accent = new THREE.Color(opts.accent || '#00E599');
      this.mouse = new THREE.Vector2(0, 0);
      this.mouseT = new THREE.Vector2(0, 0);
      this.start = performance.now();
      this.disposed = false;

      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      this.camera.position.set(0, 0, 18);

      this.resize();
      this.buildVariation();

      this.onResize = () => this.resize();
      this.onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        this.mouseT.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        this.mouseT.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      };
      window.addEventListener('resize', this.onResize);
      window.addEventListener('mousemove', this.onMove);

      this.tick();
    }

    resize() {
      const c = this.canvas;
      const r = c.getBoundingClientRect();
      const w = Math.max(2, r.width), h = Math.max(2, r.height);
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    clearScene() {
      while (this.scene.children.length) {
        const obj = this.scene.children.pop();
        obj.traverse?.((c) => {
          c.geometry?.dispose?.();
          if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
          else c.material?.dispose?.();
        });
      }
      this.update = null;
    }

    setVariation(name) {
      if (!VARIATIONS.includes(name)) return;
      this.variation = name;
      this.clearScene();
      this.buildVariation();
    }

    setAccent(hex) {
      this.accent = new THREE.Color(hex);
      this.clearScene();
      this.buildVariation();
    }

    buildVariation() {
      switch (this.variation) {
        case 'candles': return this.buildCandles();
        case 'flow': return this.buildFlow();
        case 'mesh': return this.buildMesh();
        case 'particles': return this.buildParticles();
        case 'orderbook': return this.buildOrderbook();
      }
    }

    /* ----- 1. CANDLES — drifting field of 3D candlesticks ----- */
    buildCandles() {
      const group = new THREE.Group();
      const cols = 14, rows = 8;
      const spacingX = 1.6, spacingY = 1.4;
      const candles = [];
      const upMat = new THREE.MeshBasicMaterial({ color: this.accent, transparent: true });
      const downMat = new THREE.MeshBasicMaterial({ color: 0xff5a6c, transparent: true });
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x9aa3ad, transparent: true, opacity: 0.5 });
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const seed = Math.sin(i * 12.9 + j * 7.7) * 43758.5;
          const up = (seed - Math.floor(seed)) > 0.45;
          const h = 0.5 + Math.abs(Math.sin(i * 0.6 + j * 0.9)) * 1.8;
          const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, h, 0.55), up ? upMat.clone() : downMat.clone());
          const wick = new THREE.Mesh(new THREE.BoxGeometry(0.05, h * 1.7, 0.05), wickMat);
          const x = (i - cols / 2) * spacingX + (j % 2 === 0 ? 0.4 : -0.4);
          const y = (j - rows / 2) * spacingY;
          const z = -8 - (Math.abs(j - rows / 2) + Math.abs(i - cols / 2)) * 0.3;
          body.position.set(x, y, z);
          wick.position.set(x, y, z);
          body.userData = { baseY: y, h, up, phase: i * 0.2 + j * 0.4 };
          group.add(wick); group.add(body);
          candles.push(body);
        }
      }
      this.scene.add(group);
      this.update = (t) => {
        group.rotation.y = Math.sin(t * 0.06) * 0.12 + this.mouse.x * 0.1;
        group.rotation.x = Math.cos(t * 0.05) * 0.06 + this.mouse.y * 0.08;
        candles.forEach((c) => {
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.8 + c.userData.phase);
          c.material.opacity = 0.55 + pulse * 0.4;
          c.scale.y = 1 + Math.sin(t * 1.1 + c.userData.phase) * 0.1;
        });
      };
    }

    /* ----- 2. FLOW — flowing ribbon of price action ----- */
    buildFlow() {
      const ribbons = 8;
      const segs = 220;
      const lines = [];
      for (let r = 0; r < ribbons; r++) {
        const positions = new Float32Array(segs * 3);
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const isUp = r % 2 === 0;
        const mat = new THREE.LineBasicMaterial({
          color: isUp ? this.accent : new THREE.Color(0xff5a6c),
          transparent: true,
          opacity: 0.18 + (r / ribbons) * 0.35,
        });
        const line = new THREE.Line(geom, mat);
        line.userData = { r, segs, positions };
        this.scene.add(line);
        lines.push(line);
      }
      this.update = (t) => {
        lines.forEach((line) => {
          const { r, segs, positions } = line.userData;
          for (let i = 0; i < segs; i++) {
            const x = (i / segs) * 30 - 15;
            const phase = i * 0.15 + r * 0.6 + t * (0.4 + r * 0.05);
            const y = Math.sin(phase) * (1.2 + r * 0.35) + Math.cos(phase * 0.7) * 0.6 + (r - ribbons / 2) * 0.5;
            const z = Math.sin(phase * 0.5) * 1.2 - 4;
            positions[i * 3] = x;
            positions[i * 3 + 1] = y + this.mouse.y * 0.5;
            positions[i * 3 + 2] = z + this.mouse.x * 0.5;
          }
          line.geometry.attributes.position.needsUpdate = true;
        });
      };
    }

    /* ----- 3. MESH — neural grid of price nodes ----- */
    buildMesh() {
      const cols = 34, rows = 22;
      const spacing = 1.05;
      const points = [];
      const dotGeom = new THREE.SphereGeometry(0.06, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({ color: this.accent, transparent: true });
      const lineMat = new THREE.LineBasicMaterial({ color: this.accent, transparent: true, opacity: 0.15 });
      const group = new THREE.Group();

      const grid = [];
      for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
          const x = (i - (cols - 1) / 2) * spacing;
          const y = (j - (rows - 1) / 2) * spacing;
          const z = -6 - Math.random() * 2;
          const dot = new THREE.Mesh(dotGeom, dotMat.clone());
          dot.position.set(x, y, z);
          dot.userData = { ix: i, iy: j, baseZ: z, phase: i * 0.4 + j * 0.7 };
          group.add(dot);
          grid[i][j] = dot;
        }
      }
      // diagonal connections
      const linePositions = [];
      for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
          if (Math.random() > 0.5) {
            linePositions.push(grid[i][j].position.x, grid[i][j].position.y, grid[i][j].position.z);
            linePositions.push(grid[i + 1][j].position.x, grid[i + 1][j].position.y, grid[i + 1][j].position.z);
          }
          if (Math.random() > 0.5) {
            linePositions.push(grid[i][j].position.x, grid[i][j].position.y, grid[i][j].position.z);
            linePositions.push(grid[i][j + 1].position.x, grid[i][j + 1].position.y, grid[i][j + 1].position.z);
          }
        }
      }
      const lineGeom = new THREE.BufferGeometry();
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lines = new THREE.LineSegments(lineGeom, lineMat);
      group.add(lines);
      this.scene.add(group);

      this.update = (t) => {
        const flat = group.children;
        for (let k = 0; k < flat.length - 1; k++) {
          const dot = flat[k];
          if (!dot.userData) continue;
          const dist = Math.hypot(dot.position.x - this.mouse.x * 15, dot.position.y - this.mouse.y * 9);
          const proximity = Math.max(0, 1 - dist / 6.5);
          const pulse = 0.4 + 0.6 * Math.sin(t * 0.8 + dot.userData.phase);
          dot.material.opacity = 0.25 + pulse * 0.4 + proximity * 0.5;
          dot.scale.setScalar(1 + proximity * 2 + pulse * 0.3);
          dot.position.z = dot.userData.baseZ + Math.sin(t + dot.userData.phase) * 0.4 + proximity * 1.5;
        }
        group.rotation.y = this.mouse.x * 0.08;
        group.rotation.x = -this.mouse.y * 0.06;
      };
    }

    /* ----- 4. PARTICLES — currency tickers as motes ----- */
    buildParticles() {
      const count = 1400;
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      const colors = new Float32Array(count * 3);
      const upCol = this.accent;
      const downCol = new THREE.Color(0xff5a6c);
      const dimCol = new THREE.Color(0x9aa3ad);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = -Math.random() * 12;
        seeds[i] = Math.random() * 6.28;
        const r = Math.random();
        const c = r < 0.45 ? upCol : (r < 0.75 ? downCol : dimCol);
        colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.075, vertexColors: true, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const points = new THREE.Points(geom, mat);
      this.scene.add(points);

      this.update = (t) => {
        const arr = geom.attributes.position.array;
        const seedArr = geom.attributes.seed.array;
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          arr[idx] += 0.03 + Math.sin(t * 0.5 + seedArr[i]) * 0.005;
          arr[idx + 1] += Math.sin(t * 0.3 + seedArr[i] * 2) * 0.004;
          if (arr[idx] > 15) arr[idx] = -15;
        }
        geom.attributes.position.needsUpdate = true;
        points.rotation.y = this.mouse.x * 0.04;
        points.rotation.x = -this.mouse.y * 0.03;
      };
    }

    /* ----- 5. ORDERBOOK — depth chart cliffs receding into space ----- */
    buildOrderbook() {
      const group = new THREE.Group();
      const layers = 14;
      const barsPerLayer = 40;
      const upMat = new THREE.MeshBasicMaterial({ color: this.accent, transparent: true });
      const downMat = new THREE.MeshBasicMaterial({ color: 0xff5a6c, transparent: true });
      const bars = [];
      for (let l = 0; l < layers; l++) {
        for (let i = 0; i < barsPerLayer; i++) {
          const isAsk = i >= barsPerLayer / 2;
          const distFromMid = Math.abs(i - barsPerLayer / 2);
          const h = Math.max(0.1, 2.5 - distFromMid * 0.1 + Math.sin(l + i * 0.4) * 0.5);
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, h, 0.18),
            (isAsk ? downMat : upMat).clone(),
          );
          const x = (i - barsPerLayer / 2) * 0.42;
          const z = -2 - l * 1.2;
          const y = isAsk ? -3 + h / 2 : -3 + h / 2;
          bar.position.set(x, y, z);
          bar.material.opacity = 0.15 + (1 - l / layers) * 0.5;
          bar.userData = { l, i, baseH: h, phase: l * 0.5 + i * 0.2 };
          group.add(bar);
          bars.push(bar);
        }
      }
      group.position.y = 1;
      group.rotation.x = -0.3;
      this.scene.add(group);
      this.update = (t) => {
        bars.forEach((b) => {
          const flicker = 0.85 + Math.sin(t * 1.2 + b.userData.phase) * 0.15;
          b.scale.y = flicker;
          b.material.opacity = (0.15 + (1 - b.userData.l / layers) * 0.5) * (0.7 + Math.sin(t + b.userData.phase) * 0.3);
        });
        group.rotation.y = Math.sin(t * 0.1) * 0.15 + this.mouse.x * 0.15;
      };
    }

    tick = () => {
      if (this.disposed) return;
      const t = (performance.now() - this.start) / 1000;
      // ease mouse
      this.mouse.x += (this.mouseT.x - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouseT.y - this.mouse.y) * 0.05;
      if (this.update) this.update(t);
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(this.tick);
    };

    destroy() {
      this.disposed = true;
      cancelAnimationFrame(this.raf);
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('mousemove', this.onMove);
      this.clearScene();
      this.renderer.dispose();
    }
  }

  w.JAFXMesh = {
    VARIATIONS,
    instance: null,
    mount(canvas, opts) {
      if (this.instance) this.instance.destroy();
      this.instance = new HeroMesh(canvas, opts);
      return this.instance;
    },
    setVariation(name) { this.instance?.setVariation(name); },
    setAccent(hex) { this.instance?.setAccent(hex); },
  };
})();
