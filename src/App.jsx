import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CubeModel from './CubeModel'

export default function App() {
  return (<>
    <Canvas>
      <OrbitControls />
      <ambientLight />

      <CubeModel />

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-6}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={0xf0f0f0} />
      </mesh>
    </Canvas>
  </>)
}