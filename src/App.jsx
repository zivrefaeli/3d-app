import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CubeModel from './CubeModel'
import VisibleLight from './VisibleLight'

export default function App() {
  return (<>
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <VisibleLight position={[10, 10, 10]} />

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