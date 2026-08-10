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
 * Scroll drives the whole shot. As the hero leaves the viewport the form
 * rotates, recedes and drifts upward, so the 3D reads as one continuous camera
 * move rather than an ambient loop that happens to be playing.
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
    // The copy is left-aligned, so on wide viewports the form is pushed into
    // the right third rather than sitting behind the headline. On narrow ones
    // it recentres, because there is no free column to move into.
    let offsetX = 0;
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      offsetX = width < 900 ? 0 : 1.4;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Pull the camera back on narrow viewports so the form is never cropped.
      camera.position.z = width < 720 ? 6.2 : 4.6;
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

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;
      pointUniforms.uTime.value = elapsed;

      // Pointer parallax, eased so it trails the cursor rather than snapping.
      pointerX += (targetPointerX - pointerX) * 0.05;
      pointerY += (targetPointerY - pointerY) * 0.05;

      const p = scrollProgress;
      group.rotation.y = elapsed * 0.12 + p * Math.PI * 1.15 + pointerX * 0.35;
      group.rotation.x = pointerY * 0.25 + p * 0.5;
      // Recede and lift as the hero leaves — the exit is the scroll payoff.
      group.scale.setScalar((offsetX ? 0.92 : 0.78) * (1 - p * 0.42));
      group.position.y = p * 1.1;
      group.position.x = offsetX + p * -0.35;

      uniforms.uOpacity.value = 0.4 * (1 - p * 0.85);
      pointUniforms.uOpacity.value = 0.9 * (1 - p * 0.85);
      uniforms.uAmplitude.value = 0.32 + p * 0.22;
      pointUniforms.uAmplitude.value = uniforms.uAmplitude.value;

      renderer.render(scene, camera);
    };

    const tick = () => {
      renderFrame();
      frame = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      // One frame, no loop: the form is present but completely still.
      renderFrame();
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
