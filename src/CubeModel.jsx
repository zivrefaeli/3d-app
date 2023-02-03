import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Cube, { Face, Type, size, r, R } from './structure'

export default function CubeModel() {
  const [cube, setCube] = useState(new Cube())
  const [rotate, setRotate] = useState({
    moving: false,
    currentAngle: 0,
    targetAngle: 0,
    delta: 1
  })
  const [face, setFace] = useState(null)
  const refs = useRef([])

  const degreesToRadians = degrees => degrees * Math.PI / 180

  useFrame(() => {
    if (face == null) {
      return
    }
    if (rotate.currentAngle === rotate.targetAngle) {
      setRotate({ ...rotate, moving: false })
      return
    }

    const angle = rotate.currentAngle

    const centerPiece = refs.current[face[4].index]
    if (angle === 0) {
      console.log(centerPiece.position)
    }
    centerPiece.rotation.y = degreesToRadians(angle)

    for (let i = 0; i < cube.angles.length; i++) {
      const radius = i % 2 === 0 ? r : R
      const faceIndex = cube.angles[i]

      const piece = refs.current[face[faceIndex].index]

      const newX = centerPiece.position.x + radius * Math.cos(degreesToRadians(angle + i * 45))
      const newZ = centerPiece.position.z - radius * Math.sin(degreesToRadians(angle + i * 45))

      if (faceIndex === 6) {
        console.log(face[faceIndex].position, face[faceIndex].transformedPos)
        console.log('x:', piece.position.x, '->', newX)
        console.log('z:', piece.position.z, '->', newZ)
      }

      piece.position.x = newX
      piece.position.z = newZ
      piece.rotation.y = degreesToRadians(angle)
    }

    setRotate({ ...rotate, currentAngle: angle + rotate.delta })
  })

  return (
    cube.piecesArray.map((piece, index) => (
      <mesh
        ref={ref => refs.current[index] = ref}
        position={piece.transformedPos}
        key={index}
        onClick={e => {
          if (e.object.uuid !== e.intersections[0].object.uuid)
            return
          console.log(piece.position)
          if (piece.type !== Type.center) {
            return
          }
          const selectedFace = Face.getByIndex(index)
          if (selectedFace !== Face.top && selectedFace !== Face.bottom) {
            return
          }
          setRotate({ ...rotate, moving: true, targetAngle: rotate.targetAngle + 90 })
          setFace(cube.getFace(selectedFace))
        }}
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={index === 0 ? 'hotpink' : 0xff0000} />
      </mesh>
    ))
  )
}

// console.log('rotate face', face)
// console.log('center position', piece.position)
// const sharedIndex = Face.getSharedValueIndex(index)
// const sharedAxis = 'xyz'.charAt(sharedIndex)
// console.log('shared face value is', sharedAxis, '=', piece.position[sharedIndex])
// console.log('surface', 'xyz'.replace(sharedAxis, ''))