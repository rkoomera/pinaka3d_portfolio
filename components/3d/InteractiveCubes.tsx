'use client';

import * as THREE from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei';
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import { easing } from 'maath';
import { Section } from '@/components/ui/Section';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';

// Model configuration
const modelConfig = { scale: 3 };
const MODEL_URL = 'https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/3d-assets//cube1.glb';

// Use brand color as the only accent color
// Define the two colors we want to use for all cubes
const brandPurple = '#3b3b3b';
const accentGreen = '#c6fb50';

// Create a single shuffle function for both modes
const shuffleCubes = () => [
  { color: brandPurple, roughness: 0.1 },
  { color: brandPurple, roughness: 0.75 },
  { color: brandPurple, roughness: 0.1 },
  { color: accentGreen, roughness: 0.1 },
  { color: accentGreen, roughness: 0.75 },
  { color: accentGreen, roughness: 0.1 },
  { color: brandPurple, roughness: 0.1, accent: true },
  { color: accentGreen, roughness: 0.75, accent: true },
  { color: brandPurple, roughness: 0.75, accent: true }
];

export function InteractiveCubes() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  
  // This should match the scene background color
  const sectionBgColor = 'gray-950';  // Or any Tailwind color class that matches your scene background

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      // Preload the model on the client side - use the imported useGLTF directly
      useGLTF.preload(MODEL_URL);
    }
  }, []);

  if (!isMounted) {
    return (
      <Section background={sectionBgColor} containerSize="full" className="w-full h-screen px-0 py-0 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-white">Loading 3D experience...</div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section background={sectionBgColor} containerSize="full" className="w-full h-screen px-0 py-0 flex items-center justify-center relative overflow-hidden">
      {/* Absolute positioned 3D canvas in the background */}
      <div className="absolute inset-0 z-0">
        <Canvas className="w-full h-full" shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}>
          <Scene isDarkMode={theme === 'dark'} />
        </Canvas>
      </div>
      
      {/* Content overlay - centered text and button */}
      <div className="z-20 text-center max-w-4xl mx-auto px-8 py-10 pointer-events-none relative">
        <h2 className="text-7xl md:text-7xl lg:text-9xl font-normal mb-8 text-white relative pointer-events-none">
          Let's work together!
        </h2>
        <Button
          href="/contact"
          size="lg"
          variant="primary"
          className="relative pointer-events-auto !bg-white !text-gray-900 hover:!bg-gray-100 focus:!ring-gray-300"
        >
          Contact Me
        </Button>
      </div>
    </Section>
  );
}

interface SceneProps {
  isDarkMode: boolean;
}

function Scene({ isDarkMode }: SceneProps) {
  // Using a fixed accent color instead of changing it on click
  const connectors = useMemo(() => shuffleCubes(), []);
  
  // Generate additional cubes with random positions
  const additionalCubes = useMemo(() => {
    const cubes = [];
    // Generate 15 more cubes with random positions
    for (let i = 0; i < 15; i++) {
      cubes.push({
        position: [
          THREE.MathUtils.randFloatSpread(20),
          THREE.MathUtils.randFloatSpread(20),
          THREE.MathUtils.randFloatSpread(10)
        ] as [number, number, number],
        color: i % 2 === 0 ? brandPurple : accentGreen,
        roughness: Math.random() > 0.5 ? 0.1 : 0.75,
        accent: i % 5 === 0
      });
    }
    return cubes;
  }, []); // No dependencies needed anymore as colors are constant
  
  // Background color
  const bgColor = '#000000'; // Pure black background
  
  return (
    <>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isDarkMode ? 1 : 1.2} castShadow />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => <Connector key={`original-${i}`} {...props} />)}
        {additionalCubes.map((props, i) => (
          <Connector 
            key={`additional-${i}`} 
            position={props.position}
            color={props.color}
            roughness={props.roughness}
            accent={props.accent}
          />
        ))}
        <Connector position={[10, 10, 5]}>
          <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
        </Connector>
      </Physics>
      <EffectComposer>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={isDarkMode ? 4 : 2} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={isDarkMode ? 4 : 3} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={isDarkMode ? 2 : 1.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={isDarkMode ? 2 : 1.5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={isDarkMode ? 2 : 1.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </>
  );
}

interface ConnectorProps {
  position?: [number, number, number];
  children?: React.ReactNode;
  color?: string;
  roughness?: number;
  accent?: boolean;
}

function Connector({ position, children, color, roughness, accent }: ConnectorProps) {
  const api = useRef<any>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const r = (range: number) => THREE.MathUtils.randFloatSpread(range);
  const pos = useMemo(() => position || [r(10), r(10), r(10)] as [number, number, number], [position]);
  
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    if (api.current) {
      api.current.applyImpulse(
        vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
      );
    }
  });
  
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <ConnectorModel color={color} roughness={roughness} />}
      {accent && <pointLight intensity={4} distance={2.5} color={color} />}
    </RigidBody>
  );
}

interface ConnectorModelProps {
  color?: string;
  roughness?: number;
}

function ConnectorModel({ color = 'white', roughness = 0 }: ConnectorModelProps) {
  const modelRef = useRef<THREE.Object3D>(null);
  
  // Load the cube model
  const { scene } = useGLTF(MODEL_URL);
  
  // Clone the scene to avoid issues with reusing the same object
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Apply material to all meshes in the scene
    clone.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        (node as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: roughness,
          metalness: 0.2
        });
        (node as THREE.Mesh).castShadow = true;
        (node as THREE.Mesh).receiveShadow = true;
      }
    });
    
    return clone;
  }, [scene, color, roughness]);
  
  // Update material color
  useFrame((state, delta) => {
    clonedScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh && (node as THREE.Mesh).material) {
        const material = (node as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (material.color) {
          easing.dampC(material.color, color, 0.2, delta);
        }
      }
    });
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={clonedScene} 
      scale={modelConfig.scale} 
    />
  );
}

function Pointer() {
  const ref = useRef<any>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  
  useFrame(({ mouse, viewport }) => {
    if (ref.current) {
      ref.current.setNextKinematicTranslation(
        vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)
      );
    }
  });
  
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
} 