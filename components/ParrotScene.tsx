"use client";

/**
 * The Curio parrot — built entirely in code from simple low-poly shapes,
 * so there is no 3D model file to download.
 *
 * Behaviour:
 *  - idles: breathes, bobs, blinks and tilts its head now and then
 *  - eyes and head follow the mouse anywhere on the page
 *  - reacts to scrolling (turns and flaps its wings)
 *  - tap / click / stroke it to "pet" it → calls onPet()
 */

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
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
  body: "#10b981",
  head: "#34d399",
  belly: "#6ee7b7",
  wing: "#047857",
  wingTip: "#14b8a6",
  tailA: "#0d9488",
  tailB: "#115e59",
  crest: "#2dd4bf",
  face: "#f1f7f4",
  eye: "#050c0a",
  beak: "#efe9d6",
  beakLow: "#2b2f2d",
  feet: "#6b7280",
  perch: "#3a2a1d",
};

function useMaterials() {
  return useMemo(() => {
    const m = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, flatShading: true, ...extra });
    return {
      body: m(COLORS.body),
      head: m(COLORS.head),
      belly: m(COLORS.belly),
      wing: m(COLORS.wing),
      wingTip: m(COLORS.wingTip, { emissive: COLORS.wingTip, emissiveIntensity: 0.15 }),
      tailA: m(COLORS.tailA),
      tailB: m(COLORS.tailB),
      crest: m(COLORS.crest, { emissive: COLORS.crest, emissiveIntensity: 0.35 }),
      face: m(COLORS.face, { roughness: 0.8 }),
      eye: new THREE.MeshStandardMaterial({ color: COLORS.eye, roughness: 0.08, metalness: 0.3 }),
      shine: new THREE.MeshBasicMaterial({ color: "#ffffff" }),
      beak: m(COLORS.beak, { roughness: 0.35 }),
      beakLow: m(COLORS.beakLow),
      feet: m(COLORS.feet),
      perch: m(COLORS.perch, { roughness: 0.9 }),
    };
  }, []);
}

function Parrot({ onPet, reduced }: { onPet: () => void; reduced: boolean }) {
  const mat = useMaterials();
  const ico = useMemo(() => new THREE.IcosahedronGeometry(1, 2), []);
  const smooth = useMemo(() => new THREE.SphereGeometry(1, 24, 16), []);

  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const crest = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const pupils = useRef<THREE.Group[]>([]);
  const lids = useRef<THREE.Mesh[]>([]);

  const anim = useRef({
    nextBlink: 1.5,
    blinkStart: -10,
    nextTilt: 2,
    tilt: 0,
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
    h.rotation.y = damp(h.rotation.y, lx * 0.75, 5, dt);
    h.rotation.x = damp(h.rotation.x, -ly * 0.35 + input.scroll * 0.35, 5, dt);
    for (const p of pupils.current) {
      if (!p) continue;
      p.position.x = damp(p.position.x, lx * 0.03, 8, dt);
      p.position.y = damp(p.position.y, ly * 0.025, 8, dt);
    }

    // ---- scroll reaction: turn toward the page + flap when scrolling fast ----
    r.rotation.y = damp(r.rotation.y, lx * 0.2 + input.scroll * 0.9, 3, dt);
    const flapAmt = Math.min(Math.abs(input.velocity) / 40, 1);
    input.velocity *= Math.pow(0.02, dt); // decay

    // ---- petting reaction ----
    const petT = now - a.petStart;
    const petting = petT >= 0 && petT < 0.9;
    const squish = petting ? Math.sin((petT / 0.9) * Math.PI) : 0;

    if (reduced) {
      h.rotation.z = damp(h.rotation.z, 0, 4, dt);
      for (const lid of lids.current) if (lid) lid.visible = false;
      b.scale.set(1, 1, 1);
      if (wingL.current) wingL.current.rotation.z = 0.12;
      if (wingR.current) wingR.current.rotation.z = -0.12;
      return;
    }

    // ---- idle: head tilts ----
    if (t > a.nextTilt) {
      a.tilt = Math.random() < 0.35 ? 0 : (Math.random() - 0.5) * 0.8;
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
    lid = Math.max(lid, squish * 0.65);
    for (const l of lids.current) {
      if (!l) continue;
      l.visible = lid > 0.02;
      l.scale.set(1, Math.max(lid, 0.02), 1);
    }

    // ---- idle: breathing + bob ----
    const breathe = Math.sin(t * 2.1) * 0.018;
    b.scale.set(1 + squish * 0.08 - breathe * 0.5, 1 + breathe - squish * 0.07, 1 + squish * 0.05);
    r.position.y = 0.02 + Math.sin(t * 1.3) * 0.025 - squish * 0.04;

    // ---- wings: rest, flutter on scroll / pet ----
    const flutter = Math.max(flapAmt, squish * 0.6);
    const wing = 0.12 + flutter * (0.35 + Math.sin(t * 22) * 0.35);
    if (wingL.current) wingL.current.rotation.z = damp(wingL.current.rotation.z, wing, 12, dt);
    if (wingR.current) wingR.current.rotation.z = damp(wingR.current.rotation.z, -wing, 12, dt);

    // ---- tail sway + crest perk ----
    if (tail.current) tail.current.rotation.z = Math.sin(t * 1.1) * 0.06 + flutter * Math.sin(t * 15) * 0.1;
    if (crest.current) crest.current.rotation.x = damp(crest.current.rotation.x, squish * 0.45 + flapAmt * 0.2, 6, dt);
  });

  const eye = (side: 1 | -1, i: number) => (
    <group position={[0.19 * side, 0.2, 0.36]} rotation={[0, 0.45 * side, 0]}>
      {/* white face patch (like a macaw) */}
      <mesh geometry={ico} material={mat.face} position={[0.02 * side, -0.02, -0.04]} scale={[0.16, 0.17, 0.07]} />
      <group ref={(g) => { if (g) pupils.current[i] = g; }}>
        <mesh geometry={smooth} material={mat.eye} scale={0.075} position={[0, 0, 0.03]} />
        <mesh geometry={smooth} material={mat.shine} scale={0.022} position={[0.025, 0.028, 0.095]} />
      </group>
      {/* eyelid */}
      <mesh
        ref={(m) => { if (m) lids.current[i] = m; }}
        geometry={smooth}
        material={mat.head}
        scale={[0.095, 0.095, 0.095]}
        position={[0, 0, 0.035]}
        visible={false}
      />
    </group>
  );

  return (
    <group ref={root} position={[0, 0.02, 0]}>
      {/* perch */}
      <mesh material={mat.perch} position={[0, -1.18, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.085, 3.4, 10]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={ico} material={mat.feet} position={[0.17 * s, -1.11, 0.2]} scale={[0.1, 0.06, 0.15]} />
      ))}

      {/* interactive bird (perch excluded) */}
      <group onPointerDown={handleDown} onPointerMove={handleMove}>
        <group ref={body} position={[0, -0.38, 0]}>
          <mesh geometry={ico} material={mat.body} scale={[0.6, 0.82, 0.56]} />
          <mesh geometry={ico} material={mat.belly} position={[0, -0.12, 0.3]} scale={[0.42, 0.6, 0.3]} />

          {/* wings, pivoting at the shoulder */}
          {(
            [
              [wingL, 1],
              [wingR, -1],
            ] as const
          ).map(([ref, s]) => (
            <group key={s} ref={ref} position={[0.5 * s, 0.38, -0.04]}>
              <mesh geometry={ico} material={mat.wing} position={[0.02 * s, -0.42, 0]} rotation={[0.15, 0, 0.12 * s]} scale={[0.18, 0.6, 0.4]} />
              <mesh geometry={ico} material={mat.wingTip} position={[0.06 * s, -0.86, -0.12]} rotation={[0.3, 0, 0.1 * s]} scale={[0.13, 0.36, 0.27]} />
            </group>
          ))}

          {/* tail feathers */}
          <group ref={tail} position={[0, -0.72, -0.28]} rotation={[-0.38, 0, 0]}>
            <mesh material={mat.tailA} position={[-0.07, -0.5, 0]} rotation={[Math.PI, 0, 0.1]}>
              <coneGeometry args={[0.15, 1.05, 5]} />
            </mesh>
            <mesh material={mat.tailB} position={[0.08, -0.45, -0.04]} rotation={[Math.PI, 0, -0.12]}>
              <coneGeometry args={[0.13, 0.9, 5]} />
            </mesh>
          </group>
        </group>

        {/* head, pivoting at the neck */}
        <group ref={head} position={[0, 0.35, 0.04]}>
          <mesh geometry={ico} material={mat.head} position={[0, 0.2, 0]} scale={[0.44, 0.44, 0.43]} />
          {eye(1, 0)}
          {eye(-1, 1)}

          {/* hooked beak */}
          <mesh material={mat.beak} position={[0, 0.16, 0.42]} scale={[0.15, 0.17, 0.16]} geometry={smooth} />
          <mesh material={mat.beak} position={[0, 0.02, 0.55]} rotation={[Math.PI / 2 + 1.05, 0, 0]}>
            <coneGeometry args={[0.1, 0.32, 8]} />
          </mesh>
          <mesh material={mat.beakLow} position={[0, 0.0, 0.42]} rotation={[Math.PI / 2 + 0.35, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
          </mesh>

          {/* crest */}
          <group ref={crest} position={[0, 0.56, -0.04]}>
            {[0, 1, 2].map((i) => (
              <mesh
                key={i}
                material={mat.crest}
                position={[0, 0.08 - i * 0.02, -i * 0.11]}
                rotation={[-0.35 - i * 0.28, 0, 0]}
              >
                <coneGeometry args={[0.065 - i * 0.008, 0.38 - i * 0.04, 5]} />
              </mesh>
            ))}
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
      aria-label="Curio the 3D parrot. Tap to pet it and flip the card."
      role="img"
    >
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#bff7e6", "#04140f", 0.6]} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <pointLight position={[-3, 1.2, 2]} color="#2dd4bf" intensity={14} />
      <pointLight position={[2.5, 0.5, -2.5]} color="#10b981" intensity={22} />
      <ResponsiveCamera />
      <Parrot onPet={onPet} reduced={reduced} />
    </Canvas>
  );
}
