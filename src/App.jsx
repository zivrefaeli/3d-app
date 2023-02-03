import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import VisibleLight from './VisibleLight'
import CubeModel from './CubeModel'

export default function App() {
  return (<>
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <VisibleLight position={[10, 10, 10]} />

      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial attach={'material-0'} color={0x00ff00} />
        <meshStandardMaterial attach={'material-1'} color={0x000ff0} />
        <meshStandardMaterial attach={'material-2'} color={0x0000ff} />
      </mesh> */}

      <CubeModel />

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-3}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={0xf0f0f0} />
      </mesh>
    </Canvas>
  </>)
}