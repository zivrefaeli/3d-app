import React, { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useHelper } from '@react-three/drei'
import { PointLightHelper } from 'three'
import Cube from './Cube'


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
  //               right   left    top     bottom   front    back
  //                0       1       2         3       4        

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
  const [controls, setControls] = useState(true)

  // useEffect(() => {
  //   window.addEventListener('keydown', e => {
  //     setControls(e.key === 'f')
  //     console.log('hi')
  //   })
  // }, [])

  return (
    <Canvas>
      {controls && <OrbitControls />}
      <ambientLight />
      <VisibleLight position={[5, 5, 5]} />
      
      <CustomPlane position={[0, -3, 0]} />

      <mesh position={[5, 0, 0]}>
        <boxGeometry args={[1, 5, 1]} />
        <meshStandardMaterial color={'blue'} />
      </mesh>

      <mesh position={[-5, 0, 0]}>
        <boxGeometry args={[1, 5, 1]} />
        <meshStandardMaterial color={'red'} />
      </mesh>

      <mesh position={[0, 0, 5]}>
        <boxGeometry args={[1, 5, 1]} />
        <meshStandardMaterial color={'#3d3d3d'} />
      </mesh>
      <RotatedMesh position={[0, -2.5, 0]} />

      <Cube position={[0, 0, 0]} />
    </Canvas>
  )
}