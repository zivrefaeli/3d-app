import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Layer, {r} from './Layer'


function CustomPlane(props) {
  return (
    <mesh {...props}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color={"#d9d9d9"} />
    </mesh>
  )
}

export default function Temp2() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
      
      <CustomPlane position={[0, 0, -r]} />
      <Layer />
    </Canvas>
  )
}