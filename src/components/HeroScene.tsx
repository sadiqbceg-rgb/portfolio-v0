'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';

/* ============================================================================
 * HERO SCENE — a scroll-driven 3D object.
 *
 * A geodesic sphere displaced by 3D simplex noise, drawn as a wireframe with
 * lit vertices. It is deliberately a wireframe rather than a glossy solid: the
 * rest of the site is hairlines, contour lines and node graphs, and a chrome
 * blob would belong to a different design system.
 *
 * Scroll drives the whole shot, and nothing else does. There is deliberately
 * no time-based rotation: an object that spins on its own reads as a widget
 * playing in the corner, while one that only moves when you scroll reads as a
 * camera you are steering. The only motion at rest is the surface breathing
 * under the noise field, which is what stops it looking like a still image.
 *
 * THE SHOT
 *
 *   0.0 – 0.2   barely moves; the headline is still being read
 *   0.2 – 0.6   rotation opens up across all three axes, the form grows and
 *               lifts, and the camera widens — the middle of the move
 *   0.6 – 1.0   settles into its final orientation and dissolves out, handing
 *               off to the Intro panel sliding up over it
 *
 * Two things make it feel like film rather than a slider:
 *
 *   - scroll is SMOOTHED before use. The raw value snaps with a trackpad
 *     flick; easing toward it means a fast scroll still arrives smoothly and
 *     the form never jumps.
 *   - the smoothed value is then EASED (cubic in-out), so the move is slow at
 *     both ends and quickest through the middle. Linear scroll mapping is the
 *     single biggest reason this kind of effect reads as cheap.
 *
 * Reversing is free: everything is a pure function of scroll position, so
 * scrolling back up runs the same curve backwards with no extra state.
 *
 * Performance notes, in order of how much they matter:
 *   - the render loop stops entirely when the hero scrolls out of view
 *   - device pixel ratio is capped at 2; retina at 3x is invisible here and
 *     costs ~2.25x the fragments
 *   - reduced motion renders exactly one static frame and never starts a loop
 *   - everything is disposed on unmount, so navigation cannot leak GPU memory
 * ==========================================================================*/

/* Ashima / Stefan Gustavson simplex noise (MIT). Standard inline GLSL — the
 * displacement needs 3D noise on the GPU and this is the canonical version. */
const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/* Shared displacement: two octaves, the second finer and weaker, so the form
 * has both a large swell and surface detail. `vDisplace` is handed to the
 * fragment stage to colour peaks differently from troughs. */
const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uAmplitude;
varying float vDisplace;

${SIMPLEX_3D}

void main() {
  float n = snoise(position * 1.5 + vec3(0.0, 0.0, uTime * 0.22));
  n += 0.5 * snoise(position * 3.4 - vec3(0.0, 0.0, uTime * 0.16));
  vDisplace = n;
  vec3 displaced = position + normal * n * uAmplitude;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  gl_PointSize = 2.0;
}
`;

/* Peaks run toward Signal Blue and white, troughs sit in Twilight Blue —
 * the same three colours the rest of the page uses. */
const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform float uOpacity;
varying float vDisplace;

void main() {
  float t = clamp(vDisplace * 0.72 + 0.5, 0.0, 1.0);
  vec3 color = mix(uLow, uMid, smoothstep(0.0, 0.6, t));
  color = mix(color, uHigh, smoothstep(0.62, 1.0, t));
  gl_FragColor = vec4(color, uOpacity);
}
`;

/** Cubic in-out: slow at both ends, quickest through the middle. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** GLSL-style smoothstep, used to hold the form solid before dissolving it. */
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Frame-rate independent lerp factor.
 *
 * A fixed `value += (target - value) * 0.09` converges twice as fast on a
 * 120Hz display as on 60Hz, so the same scroll feels different on different
 * machines. This rescales the rate by actual frame time, expressed as "what
 * 0.09 per frame would mean at 60fps".
 */
const damp = (rate: number, dt: number) => 1 - Math.pow(1 - rate, dt * 60);

export function HeroScene({
  className = '',
  progress,
}: {
  className?: string;
  /**
   * External scroll progress, 0 at rest and 1 once the hero has left.
   *
   * Required once the hero is `position: sticky`. The internal fallback
   * measures `-rect.top / height`, and a pinned element's rect.top stays at 0
   * for the whole time it is stuck — so the form would never recede. When the
   * hero shares a ScrollScene with its text layer, both move as one shot.
   */
  progress?: MotionValue<number>;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  // Kept in a ref so the Three.js effect never re-runs when the value changes.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Fail soft: a machine without WebGL keeps the page, just without the 3D.
    const canvas = document.createElement('canvas');
    const supported = !!(
      canvas.getContext('webgl2') || canvas.getContext('webgl')
    );
    if (!supported) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.6;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    // Detail 5 gives a dense enough net to read as a surface while staying
    // well inside the vertex budget of an integrated GPU.
    const geometry = new THREE.IcosahedronGeometry(1.35, 5);

    const uniforms = {
      uTime: { value: 0 },
      uAmplitude: { value: 0.32 },
      uOpacity: { value: 0.4 },
      uLow: { value: new THREE.Color('#426188') }, // Twilight Blue
      uMid: { value: new THREE.Color('#2b7fff') }, // Signal Blue
      uHigh: { value: new THREE.Color('#ffffff') }, // Whiteout
    };

    const wireMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Vertices as points, sharing the identical displacement so they sit
    // exactly on the wireframe's nodes.
    const pointUniforms = {
      ...uniforms,
      uOpacity: { value: 0.9 },
    };
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: pointUniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const group = new THREE.Group();
    const mesh = new THREE.Mesh(geometry, wireMaterial);
    const points = new THREE.Points(geometry, pointMaterial);
    group.add(mesh, points);
    scene.add(group);

    /* --- Sizing ---------------------------------------------------------- */
    /**
     * The form is centred on the viewport, not offset into a column.
     *
     * This is the object's own position in the scene — `group.position.x` in
     * the render loop — not a camera shift and not CSS. The canvas is
     * `absolute inset-0` inside a full-bleed section, so the frustum is
     * centred on the viewport and x = 0 puts the object's centre at 50vw by
     * construction, at every width, with nothing to keep in sync.
     *
     * Earlier versions pushed it right to sit beside the copy. It now sits
     * behind the copy instead, which is why `baseOpacity` below is lower than
     * it was: a backdrop has to lose the contrast fight with the text on top
     * of it, deliberately and every time.
     */
    // Declared here rather than beside the loop: `resize()` runs immediately
    // below and reads it, so a later `const` would be in its dead zone.
    const BASE_FOV = 45;
    /** Base size, independent of placement — the two were previously tied. */
    let baseScale = 0.92;
    /** Strength of the form as a backdrop. Lower where text sits over it. */
    let baseOpacity = 1;
    // Rest positions the scroll choreography moves away from. Held separately
    // because the loop offsets the camera every frame, and resize must not
    // read back a value the loop already displaced.
    let baseCameraZ = 4.6;
    /**
     * How much of the choreography a viewport gets.
     *
     * A phone shows the same move in a third of the width, so the identical
     * rotation and drift read as far more violent and make the page feel like
     * it is fighting the thumb. Scaling the deltas keeps the shot recognisable
     * while staying comfortable, and costs nothing — the same maths runs
     * either way.
     */
    let motionScale = 1;

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      motionScale = width < 720 ? 0.5 : width < 1000 ? 0.75 : 1;
      // Narrow viewports stack the copy over the middle of the form rather
      // than beside it, so it has to sit further back to stay out of the way.
      baseScale = width < 900 ? 0.78 : 0.92;
      baseOpacity = width < 900 ? 0.45 : 0.7;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Pull the camera back on narrow viewports so the form is never cropped.
      baseCameraZ = width < 720 ? 6.2 : 4.6;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    /* --- Input ----------------------------------------------------------- */
    let scrollProgress = 0; // 0 at the top of the hero, 1 once it has left
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    // Fallback measurement, used only when no external progress is supplied.
    const onScroll = () => {
      const rect = mount.getBoundingClientRect();
      const travel = rect.height || window.innerHeight;
      scrollProgress = Math.min(Math.max(-rect.top / travel, 0), 1);
    };

    // When a ScrollScene drives the hero, subscribe to it instead.
    const external = progressRef.current;
    const unsubscribe = external
      ? external.on('change', (v) => {
          scrollProgress = Math.min(Math.max(v, 0), 1);
        })
      : null;
    if (external) scrollProgress = Math.min(Math.max(external.get(), 0), 1);
    const onPointerMove = (event: PointerEvent) => {
      targetPointerX = (event.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    if (!reduceMotion) {
      if (!external) {
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
      }
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    /* --- Loop ------------------------------------------------------------ */
    const clock = new THREE.Clock();
    let frame = 0;
    let visible = true;
    let elapsed = 0;
    // Trails `scrollProgress`. Starting it level with the target means the
    // first frame is already correct rather than easing in from zero.
    let eased = scrollProgress;
    let lastFov = BASE_FOV;

    const renderFrame = (dt: number) => {
      // getDelta() and getElapsedTime() both advance the clock internally, so
      // calling both per frame double-counts. Accumulate from the delta.
      elapsed += dt;
      uniforms.uTime.value = elapsed;
      pointUniforms.uTime.value = elapsed;

      // Smooth the raw scroll value before anything reads it: a trackpad
      // flick delivers large jumps, and mapping those straight onto rotation
      // is what makes scroll-driven 3D look janky.
      eased += (scrollProgress - eased) * damp(0.09, dt);

      // Pointer parallax, eased so it trails the cursor rather than snapping.
      const pointerDamp = damp(0.05, dt);
      pointerX += (targetPointerX - pointerX) * pointerDamp;
      pointerY += (targetPointerY - pointerY) * pointerDamp;

      /* The hero is sticky and the Intro panel slides up over it, which means
       * the form is fully covered by roughly 60% of the hero's scroll range.
       * Mapping the choreography across the full 0..1 would spend its whole
       * second half — the part with the most rotation — hidden behind that
       * panel. Compressing it into the window that is actually on screen is
       * what makes the move readable without lengthening the page. */
      const shot = Math.min(eased / 0.6, 1);
      const p = easeInOutCubic(shot);
      const m = motionScale;

      // Rotation on all three axes, but restrained — well under a half turn
      // on the widest, so the form reorients rather than spins. Pointer
      // parallax is added on top rather than replacing it, so the mouse
      // nudges the shot without ever taking it over.
      group.rotation.y = p * Math.PI * 0.85 * m + pointerX * 0.35;
      group.rotation.x = p * 0.42 * m + pointerY * 0.25;
      group.rotation.z = p * 0.18 * m;

      // Grows and lifts as the hero leaves, rather than shrinking away: with
      // the opacity dissolve below, growing reads as the form passing the
      // camera, which is a handoff. Shrinking just reads as leaving.
      group.scale.setScalar(baseScale * (1 + p * 0.14 * m));
      group.position.y = p * 0.9 * m;
      // Starts centred on the viewport and drifts only slightly, so it stays
      // read as the centre of the composition rather than sliding out of it.
      group.position.x = p * 0.18 * m;

      // Hold at full strength through the first half, then dissolve. Fading
      // from the very start would leave the middle of the shot — where the
      // rotation is most interesting — already half gone.
      const fade = (1 - smoothstep(0.55, 1, shot)) * baseOpacity;
      uniforms.uOpacity.value = 0.4 * fade;
      pointUniforms.uOpacity.value = 0.9 * fade;

      // Surface turbulence rises through the move, so the form feels like it
      // is gaining energy as it exits.
      const amplitude = 0.32 + p * 0.26 * m;
      uniforms.uAmplitude.value = amplitude;
      pointUniforms.uAmplitude.value = amplitude;

      // Camera: a short dolly in with a widening lens. Changing both together
      // exaggerates perspective as the shot progresses, which is what sells
      // depth on a wireframe that has no shading to read it from.
      camera.position.z = baseCameraZ - p * 0.5 * m;
      const fov = BASE_FOV + p * 6 * m;
      // updateProjectionMatrix() is only worth calling when the lens actually
      // moved — at rest, and once the shot settles, this is a no-op.
      if (Math.abs(fov - lastFov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
        lastFov = fov;
      }

      renderer.render(scene, camera);
    };

    const tick = () => {
      // Clamped so a backgrounded tab returning after seconds does not apply
      // one enormous smoothing step and snap everything into place.
      renderFrame(Math.min(clock.getDelta(), 0.1));
      frame = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      // One frame, no loop: the form is present but completely still. dt of 0
      // holds the smoothing where it starts, so this renders the rest pose.
      renderFrame(0);
    } else {
      // Only run while the hero is on screen. Scrolling to the contact form
      // should not keep a GPU loop alive.
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !visible) {
            visible = true;
            frame = requestAnimationFrame(tick);
          } else if (!entry.isIntersecting && visible) {
            visible = false;
            cancelAnimationFrame(frame);
          }
        },
        { threshold: 0 },
      );
      io.observe(mount);
      frame = requestAnimationFrame(tick);

      return () => {
        io.disconnect();
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        unsubscribe?.();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('pointermove', onPointerMove);
        geometry.dispose();
        wireMaterial.dispose();
        pointMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => {
      resizeObserver.disconnect();
      unsubscribe?.();
      geometry.dispose();
      wireMaterial.dispose();
      pointMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`absolute inset-0 -z-10 ${className}`}
    />
  );
}
