import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import RotatedLayer from './RotatedLayer'

export default function Test() {
  return <Canvas>
    <OrbitControls />
    <ambientLight />
    <pointLight position={[-10, 10, -10]} />

    <RotatedLayer />
  </Canvas>
}