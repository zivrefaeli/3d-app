import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useHelper } from '@react-three/drei'
import { PointLightHelper } from 'three'

function VisibleLight(props) {
  const ref = useRef()
  useHelper(ref, PointLightHelper, 1, 'red')
  return <pointLight ref={ref} {...props} />
}

function RotatedBox(props) {
  const ref = useRef()

  useFrame(() => {
    ref.current.rotation.y += 0.01
  })

  return <mesh ref={ref} {...props}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={props.color} />
  </mesh>
}

export default function App() {
  const [selectedColor, setSelectedColor] = useState('#000000')

  return (
    <>
      <h1>3D objects</h1>
      <a href='https://docs.pmnd.rs/react-three-fiber/getting-started/introduction'
        target={'_blank'}
        rel="noreferrer">R3F - React three fiber documentation</a>
      <Canvas>
        <OrbitControls />
        {/* <ambientLight /> */}
        <VisibleLight position={[5, 5, 5]} />
        <VisibleLight position={[-5, 5, 5]} />
        <RotatedBox position={[2, 0, 0]} color={selectedColor} />
        <RotatedBox position={[-2, 0, 0]} color={selectedColor} />
      </Canvas>
      <p className='colorInput'>
        <input
          type={'color'}
          value={selectedColor}
          onChange={e => {
            setSelectedColor(e.target.value)
          }} />
        <label>{selectedColor}</label>
      </p>
    </>
  )
}