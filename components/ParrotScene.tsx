"use client";

/**
 * The Curio parrot — a chubby cartoon lovebird (lime body, coral face,
 * orange neck band, red hooked beak) built entirely in code with toon
 * shading and black outlines, so there is no 3D model file to download.
 *
 * Behaviour:
 *  - idles: breathes, bobs, blinks and tilts its head now and then
 *  - eyes and head follow the mouse anywhere on the page
 *  - reacts to scrolling (turns and flaps its wings)
 *  - tap / click / stroke it to "pet" it → calls onPet()
 */

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type Ref } from "react";
import * as THREE from "three";

const damp = THREE.MathUtils.damp;

/* Shared, mutable input state (kept outside React to avoid re-renders) */
const input = { x: 0, y: 0, scroll: 0, velocity: 0, lastY: 0 };

type SceneProps = {
  onPet: () => void;
  reduced: boolean;
  active: boolean;
};

const COLORS = {
  body: "#8cc63f", // lime green
  bodyBack: "#6fb02e",
  face: "#fb4a40", // coral red
  neck: "#f9954f", // orange band
  beak: "#ec1940", // crimson
  wing: "#2ba24c", // leaf green
  wingDark: "#1f7a3a",
  eye: "#050505",
  feet: "#55575a",
  perch: "#3a2a1d",
  outline: "#050505",
};

/** Outline thickness in world units (inverted-hull technique) */
const LINE = 0.045;

function useToon() {
  return useMemo(() => {
    // 3-step gradient gives the flat, sticker-like cartoon shading
    const data = new Uint8Array([110, 110, 110, 255, 190, 190, 190, 255, 255, 255, 255, 255]);
    const gradient = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
    gradient.minFilter = THREE.NearestFilter;
    gradient.magFilter = THREE.NearestFilter;
    gradient.needsUpdate = true;
    const toon = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: gradient });
    return {
      body: toon(COLORS.body),
      bodyBack: toon(COLORS.bodyBack),
      face: toon(COLORS.face),
      neck: toon(COLORS.neck),
      beak: toon(COLORS.beak),
      wing: toon(COLORS.wing),
      wingDark: toon(COLORS.wingDark),
      feet: toon(COLORS.feet),
      perch: toon(COLORS.perch),
      eye: new THREE.MeshBasicMaterial({ color: COLORS.eye }),
      shine: new THREE.MeshBasicMaterial({ color: "#ffffff" }),
      outline: new THREE.MeshBasicMaterial({ color: COLORS.outline, side: THREE.BackSide }),
    };
  }, []);
}

type V3 = [number, number, number];

/** An ellipsoid with a black cartoon outline */
function Blob({
  geometry,
  material,
  outline,
  position,
  scale,
  rotation,
  line = LINE,
  meshRef,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  outline?: THREE.Material;
  position?: V3;
  scale: V3;
  rotation?: V3;
  line?: number;
  meshRef?: Ref<THREE.Mesh>;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} geometry={geometry} material={material} scale={scale} />
      {outline && (
        <mesh geometry={geometry} material={outline} scale={[scale[0] + line, scale[1] + line, scale[2] + line]} />
      )}
    </group>
  );
}

function Parrot({ onPet, reduced }: { onPet: () => void; reduced: boolean }) {
  const mat = useToon();
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 40, 28), []);

  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const pupils = useRef<THREE.Group[]>([]);
  const lids = useRef<THREE.Mesh[]>([]);

  const anim = useRef({
    nextBlink: 1.5,
    blinkStart: -10,
    nextTilt: 2,
    tilt: 0.12,
    petStart: -10,
    stroke: 0,
    lastPet: -10,
  });

  const pet = (t: number) => {
    const a = anim.current;
    if (t - a.lastPet < 1.2) return;
    a.lastPet = t;
    a.petStart = t;
    a.stroke = 0;
    onPet();
  };

  const handleDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    pet(performance.now() / 1000);
  };

  // Stroking the parrot (moving the pointer across it) also counts as petting
  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    const a = anim.current;
    a.stroke += Math.hypot(e.nativeEvent.movementX || 0, e.nativeEvent.movementY || 0);
    if (a.stroke > 900) pet(performance.now() / 1000);
  };

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    const a = anim.current;
    const r = root.current;
    const h = head.current;
    const b = body.current;
    if (!r || !h || !b) return;

    // ---- look at the pointer ----
    const lx = input.x;
    const ly = input.y;
    h.rotation.y = damp(h.rotation.y, lx * 0.6, 5, dt);
    h.rotation.x = damp(h.rotation.x, -ly * 0.3 + input.scroll * 0.3, 5, dt);
    for (const p of pupils.current) {
      if (!p) continue;
      p.position.x = damp(p.position.x, lx * 0.035, 8, dt);
      p.position.y = damp(p.position.y, ly * 0.03, 8, dt);
    }

    // ---- scroll reaction: turn toward the page + flap when scrolling fast ----
    r.rotation.y = damp(r.rotation.y, -0.25 + lx * 0.2 + input.scroll * 0.9, 3, dt);
    const flapAmt = Math.min(Math.abs(input.velocity) / 40, 1);
    input.velocity *= Math.pow(0.02, dt); // decay

    // ---- petting reaction ----
    const petT = now - a.petStart;
    const petting = petT >= 0 && petT < 0.9;
    const squish = petting ? Math.sin((petT / 0.9) * Math.PI) : 0;

    if (reduced) {
      h.rotation.z = damp(h.rotation.z, 0.12, 4, dt);
      for (const lid of lids.current) if (lid) lid.visible = false;
      b.scale.set(1, 1, 1);
      if (wingL.current) wingL.current.rotation.z = 0.1;
      if (wingR.current) wingR.current.rotation.z = -0.1;
      return;
    }

    // ---- idle: head tilts (lovebirds love a curious tilt) ----
    if (t > a.nextTilt) {
      a.tilt = Math.random() < 0.3 ? 0 : (Math.random() - 0.4) * 0.7;
      a.nextTilt = t + 2.2 + Math.random() * 3;
    }
    h.rotation.z = damp(h.rotation.z, a.tilt - lx * 0.08 + squish * 0.25, 3, dt);

    // ---- idle: blink (and happy squint while petted) ----
    if (t > a.nextBlink) {
      a.blinkStart = t;
      a.nextBlink = t + 2 + Math.random() * 3.5;
      if (Math.random() < 0.25) a.nextBlink = t + 0.28; // double blink
    }
    const bt = t - a.blinkStart;
    let lid = bt < 0.16 ? Math.sin((bt / 0.16) * Math.PI) : 0;
    lid = Math.max(lid, squish * 0.7);
    for (const l of lids.current) {
      if (!l) continue;
      l.visible = lid > 0.02;
      l.scale.set(1, Math.max(lid, 0.02), 1);
    }

    // ---- idle: breathing + bob ----
    const breathe = Math.sin(t * 2.1) * 0.02;
    b.scale.set(1 + squish * 0.09 - breathe * 0.5, 1 + breathe - squish * 0.08, 1 + squish * 0.06);
    r.position.y = Math.sin(t * 1.3) * 0.025 - squish * 0.05;

    // ---- wings: rest, flutter on scroll / pet ----
    const flutter = Math.max(flapAmt, squish * 0.6);
    const wing = 0.1 + flutter * (0.35 + Math.sin(t * 22) * 0.35);
    if (wingL.current) wingL.current.rotation.z = damp(wingL.current.rotation.z, wing, 12, dt);
    if (wingR.current) wingR.current.rotation.z = damp(wingR.current.rotation.z, -wing, 12, dt);

    // ---- tail sway ----
    if (tail.current) tail.current.rotation.z = Math.sin(t * 1.1) * 0.06 + flutter * Math.sin(t * 15) * 0.1;
  });

  const o = mat.outline;

  const eye = (side: 1 | -1, i: number) => (
    <group position={[0.27 * side, 0.48, 0.58]} rotation={[0, 0.42 * side, 0]}>
      <group ref={(g) => { if (g) pupils.current[i] = g; }}>
        {/* big round cartoon eye */}
        <mesh geometry={sphere} material={mat.eye} scale={[0.135, 0.145, 0.06]} position={[0, 0, 0.02]} />
        <mesh geometry={sphere} material={mat.shine} scale={0.025} position={[0.035, 0.045, 0.075]} />
      </group>
      {/* eyelid (coral, like the face) */}
      {/* the outer group sets the lid's size; the blink animates the inner mesh's height */}
      <group scale={[0.16, 0.17, 0.09]} position={[0, 0, 0.03]}>
        <mesh
          ref={(m) => { if (m) lids.current[i] = m; }}
          geometry={sphere}
          material={mat.face}
          visible={false}
        />
      </group>
    </group>
  );

  return (
    <group ref={root}>
      {/* perch */}
      <mesh material={mat.perch} position={[0, -1.24, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.08, 3.2, 12]} />
      </mesh>

      {/* interactive bird (perch excluded) */}
      <group onPointerDown={handleDown} onPointerMove={handleMove}>
        {/* feet */}
        {[-1, 1].map((s) => (
          <Blob key={s} geometry={sphere} material={mat.feet} outline={o} line={0.03} position={[0.24 * s, -1.15, 0.22]} scale={[0.15, 0.06, 0.12]} />
        ))}

        <group ref={body} position={[0, -0.42, 0]}>
          {/* chubby egg-shaped body */}
          <Blob geometry={sphere} material={mat.body} outline={o} scale={[0.7, 0.78, 0.66]} />
          {/* darker back for depth */}
          <mesh geometry={sphere} material={mat.bodyBack} position={[0, 0.02, -0.08]} scale={[0.69, 0.76, 0.6]} />
          {/* orange neck band */}
          <Blob geometry={sphere} material={mat.neck} position={[0, 0.5, 0.08]} scale={[0.6, 0.3, 0.56]} />

          {/* wings, pivoting at the shoulder */}
          {(
            [
              [wingL, 1],
              [wingR, -1],
            ] as const
          ).map(([ref, s]) => (
            <group key={s} ref={ref} position={[0.66 * s, 0.28, 0.02]}>
              <Blob
                geometry={sphere}
                material={mat.wing}
                outline={o}
                position={[0.02 * s, -0.36, -0.02]}
                rotation={[0.2, 0.25 * s, 0.18 * s]}
                scale={[0.16, 0.48, 0.36]}
              />
            </group>
          ))}

          {/* tail feathers */}
          <group ref={tail} position={[0, -0.45, -0.55]} rotation={[-0.9, 0, 0]}>
            <Blob geometry={sphere} material={mat.wing} outline={o} position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.25]} scale={[0.1, 0.36, 0.07]} />
            <Blob geometry={sphere} material={mat.wingDark} outline={o} position={[0.1, -0.26, 0.02]} rotation={[0, 0, -0.25]} scale={[0.1, 0.32, 0.07]} />
          </group>
        </group>

        {/* head, pivoting at the neck */}
        <group ref={head} position={[0, 0.05, 0.05]}>
          {/* green crown/back of the head */}
          <Blob geometry={sphere} material={mat.body} outline={o} position={[0, 0.48, -0.1]} scale={[0.68, 0.66, 0.64]} />
          {/* coral face */}
          <mesh geometry={sphere} material={mat.face} position={[0.03, 0.42, 0.08]} scale={[0.66, 0.62, 0.6]} />

          {eye(1, 0)}
          {eye(-1, 1)}

          {/* hooked red beak */}
          <group position={[0, 0.3, 0.68]}>
            <Blob geometry={sphere} material={mat.beak} outline={o} line={0.035} rotation={[0.3, 0, 0]} scale={[0.17, 0.17, 0.14]} />
            {/* hooked tip */}
            <Blob
              geometry={sphere}
              material={mat.beak}
              outline={o}
              line={0.03}
              position={[0, -0.15, 0.05]}
              rotation={[0.45, 0, 0]}
              scale={[0.075, 0.12, 0.07]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

/** Pull the camera back on tall, narrow screens so the whole bird fits */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.position.z = aspect < 0.95 ? 7.6 : 6.6;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function ParrotScene({ onPet, reduced, active }: SceneProps) {
  // Track pointer across the whole page and scroll over the hero
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      input.x = (e.clientX / window.innerWidth) * 2 - 1;
      input.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const y = window.scrollY;
      input.velocity += y - input.lastY;
      input.velocity = Math.max(-200, Math.min(200, input.velocity));
      input.lastY = y;
      input.scroll = Math.min(y / window.innerHeight, 1);
    };
    input.lastY = window.scrollY;
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, -0.15, 6.6], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={active ? "always" : "never"}
      aria-label="Curio the 3D lovebird. Tap to pet it and flip the card."
      role="img"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[2.5, 4, 5]} intensity={2.4} />
      {/* soft teal rim to tie into the site's glow */}
      <pointLight position={[-2.5, 1.5, -2]} color="#2dd4bf" intensity={10} />
      <ResponsiveCamera />
      <Parrot onPet={onPet} reduced={reduced} />
    </Canvas>
  );
}
