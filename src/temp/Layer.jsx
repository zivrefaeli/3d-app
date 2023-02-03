import React, { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useHelper } from '@react-three/drei'
import { PointLightHelper } from 'three'

const SIZE = 1, GAP = 0.2
export const r = SIZE + GAP, R = Math.SQRT2 * r



function degToRad(deg) {
  return deg * Math.PI / 180
}

export default function Layer(props) {
  const center = props.position || [0, 0, 0]

  const [pos, setPos] = useState([0, 0, -R])

  const [angle, setAngle] = useState(270)

  useFrame(() => {
    setAngle(old => (old - 1) % 360)
    setPos(old => {
      const newP = [...old]
      newP[0] = R * Math.cos(degToRad(angle))
      newP[2] = R * Math.sin(degToRad(angle))
      return newP
    })
  })

  return (<>
    <mesh position={center}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={'gray'} />
    </mesh>

    <mesh position={pos} rotation-y={degToRad(90 - angle)}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={'red'} />
    </mesh>
  </>)
}