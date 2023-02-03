import { useFrame } from '@react-three/fiber'
import React, { useState } from 'react'

// r = SIZE + GAP  |   edge distance from center 
// R = r * sqrt(2) | corner distance from center

const SIZE = 1, GAP = 0.3
const r = SIZE + GAP, R = Math.SQRT2 * r


export function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}


export default function RotatedLayer() {
  const centerPosition = [0, 0, 0]
  const edgeInitPosition = [r, 0, 0]
  const cornerInitPosition = [r, 0, -r]
  const angleDelta = 1

  const [edgePosition, setEdgePosition] = useState(edgeInitPosition)
  const [cornerPosition, setCornerPosition] = useState(cornerInitPosition)
  const [angles, setAngles] = useState({
    current: 0,
    target: 0
  })

  useFrame(() => {
    if (angles.current < angles.target) {
      setAngles(old => {
        return { ...old, current: old.current + angleDelta }
      })
    }

    setEdgePosition([
      centerPosition[0] + r * Math.cos(degreesToRadians(angles.current)),
      centerPosition[1],
      centerPosition[2] - r * Math.sin(degreesToRadians(angles.current))
    ])

    setCornerPosition([
      centerPosition[0] + R * Math.cos(degreesToRadians(angles.current + 45)),
      centerPosition[1],
      centerPosition[2] - R * Math.sin(degreesToRadians(angles.current + 45))
    ])
  })

  return (<>
    <mesh name='center'
      position={centerPosition}
      onClick={() => {
        console.log('one click')
        setAngles(old => {
          return { ...old, target: old.target + 90 }
        })
      }}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>

    <mesh name='edge'
      position={edgePosition}
      rotation-y={degreesToRadians(angles.current)}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={'red'} />
    </mesh>

    <mesh name='corner'
      position={cornerPosition}
      rotation-y={degreesToRadians(angles.current)}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={'green'} />
    </mesh>

    <mesh name='center2'
      position={[r, -r, 0]}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  </>)
}