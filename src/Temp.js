import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useHelper } from '@react-three/drei'
import { PointLightHelper } from 'three'


function VisibleLight(props) {
  const ref = useRef()
  useHelper(ref, PointLightHelper, 1, 'red')
  return <pointLight ref={ref} {...props} />
}


function CustomPlane(props) {
  return (
    <mesh rotation-x={-0.5 * Math.PI} {...props}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color={"#d9d9d9"} />
    </mesh>
  )
}


function RotatedMesh(props) {
  const ref = useRef()

  const colors = ['blue', 'red', 'green', 'pink', 'yellow', 'purple']

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      {colors.map((value, index) => (
        <meshStandardMaterial key={index} attach={`material-${index}`} color={value} />
      ))}
    </mesh>
  )
}


export default function Temp() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <VisibleLight position={[5, 5, 5]} />
      
      <CustomPlane />
      <RotatedMesh position={[0, 0.5, 0]} />
    </Canvas>
  )
}