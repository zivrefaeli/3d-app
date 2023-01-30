import React from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls, useHelper } from '@react-three/drei'
// import { PointLightHelper } from 'three'

const SIZE = 1
const GAP = 0.2

function Layer(props) {
  /*

  (-1, 1), (0, 1), (1, 1)

  (-1, 0), (0, 0), (1, 0)

  (-1,-1), (0,-1), (1,-1) 

  */

  const pos = props.position || [0, 0, 0]

  const blocks = []

  for (let y = 1; y >= -1; y--) {
    for (let x = -1; x <= 1; x++) {
      blocks.push([
        pos[0] + x * (GAP + SIZE),
        pos[1] + y * (GAP + SIZE),
        pos[2]
      ])
    }
  }

  const colors = {
    0: 'red', // right
    1: 'hotpink', // left
    2: 'blue', // top
    3: 'green', // bottom
    4: 'purple', // front
    5: 'gray' // back
  }

  const entries = Object.entries(colors)

  return (
    blocks.map((value, index) => (
      <mesh
        key={index}
        position={value}>
        <boxGeometry args={[SIZE, SIZE, SIZE]} />

        {
          entries.map((value, index) => (
            <meshStandardMaterial
              key={index}
              attach={`material-${value[0]}`}
              color={value[1]} />
          ))
        }
      </mesh>
    ))
  )
}


export default function Cube(props) {
  const mid = props.position || [0, 0, 0]

  const layers = []

  for (let z = 1; z >= -1; z--) {
    const pos = [...mid]
    pos[2] = z * (GAP + SIZE)
    layers.push(pos)
  }

  return (
    layers.map((pos, index) => (
      <Layer key={index} position={pos} />
    ))
  )
}