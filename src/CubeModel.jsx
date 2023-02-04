import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Cube, { Face, Type, size, r, R } from './structure'

function getFaceSettings(face) {
  switch (face) {
    case Face.front:
      return { commonAxis: 'z', cosAxis: 'x', sinAxis: 'y', angleSign: 1, cosSign: 1, sinSign: 1 }

    case Face.back:
      return { commonAxis: 'z', cosAxis: 'x', sinAxis: 'y', angleSign: -1, cosSign: -1, sinSign: 1 }

    case Face.top:
      return { commonAxis: 'y', cosAxis: 'x', sinAxis: 'z', angleSign: 1, cosSign: 1, sinSign: -1 }

    case Face.bottom:
      return { commonAxis: 'y', cosAxis: 'x', sinAxis: 'z', angleSign: -1, cosSign: 1, sinSign: 1 }

    case Face.right:
      return { commonAxis: 'x', cosAxis: 'z', sinAxis: 'y', angleSign: 1, cosSign: -1, sinSign: 1 }

    case Face.left:
      return { commonAxis: 'x', cosAxis: 'z', sinAxis: 'y', angleSign: -1, cosSign: 1, sinSign: 1 }

    default:
      return { commonAxis: '', cosAxis: '', sinAxis: '', angleSign: 0, cosSign: 0, sinSign: 0 }
  }
}

function convert(obj) {
  return [obj.x, obj.y, obj.z]
}

// TODO: on rotate animation completed, swap face pieces !
//       start at line #82

export default function CubeModel() {
  const [cube, setCube] = useState(new Cube())
  const [rotate, setRotate] = useState({ face: null, moving: false, angle: 0, target: 0 })
  const [settings, setSettings] = useState(getFaceSettings(null))
  const [face, setFace] = useState(null) // Array of Pieces
  const refs = useRef([]) // Array of Meshes

  const degreesToRadians = degrees => degrees * Math.PI / 180

  const getColor = index => {
    switch (index) {
      case 0:
        return 0xfcba03

      case 2:
        return 0x45fc03

      case 6:
        return 0x33ffe4

      case 8:
        return 0x3a1d91

      case 18:
        return 0xc40ec4

      case 20:
        return 0xf56122

      case 24:
        return 0xff45ae

      case 26:
        return 0x0b00b0

      default:
        return 0xff0000
    }
  }

  useFrame(() => {
    if (face == null) {
      return
    }
    if (rotate.angle === rotate.target) {
      cube.faceAngles[rotate.face] = rotate.angle % 360
      setRotate({ face: null, moving: false, angle: 0, target: 0 })
      setFace(null)
      return
    }

    const { commonAxis, cosAxis, sinAxis, angleSign, cosSign, sinSign } = settings
    const angle = rotate.angle

    if (angle === 0) {
      console.log(commonAxis, cosAxis, sinAxis, angleSign, cosSign, sinSign)
    }

    const centerMesh = refs.current[face[4].index]
    centerMesh.rotation[commonAxis] = degreesToRadians(angleSign * angle)

    for (let i = 0; i < cube.angles.length; i++) {
      const radius = i % 2 === 0 ? r : R
      const faceIndex = cube.angles[i]

      const mesh = refs.current[face[faceIndex].index]
      // if (angle === 0 || angle === 89) {
      //   console.log(face[faceIndex].index, convert(mesh.position), convert(mesh.rotation))
      // }

      mesh.position[cosAxis] = centerMesh.position[cosAxis] + cosSign * radius * Math.cos(degreesToRadians(angle + i * 45))
      mesh.position[sinAxis] = centerMesh.position[sinAxis] + sinSign * radius * Math.sin(degreesToRadians(angle + i * 45))

      mesh.rotation[commonAxis] = degreesToRadians(angleSign * angle)
    }

    
    setRotate({ ...rotate, angle: angle + 1 })
  })

  return (
    cube.piecesArray.map((piece, index) => (
      <mesh
        ref={meshRef => refs.current[index] = meshRef}
        position={piece.transformedPos}
        key={index}
        onClick={e => {
          if (e.object.uuid !== e.intersections[0].object.uuid)
            return
          console.log(refs.current[index].position)
          if (piece.type !== Type.center || rotate.moving) {
            return
          }

          const selectedFace = Face.getByIndex(index)
          // const angle = cube.faceAngles[selectedFace]
          // console.log(angle)

          setRotate({ face: selectedFace, moving: true, angle: rotate.angle, target: rotate.angle + 90 })
          setSettings(getFaceSettings(selectedFace))
          setFace(cube.getFace(selectedFace))
        }}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={getColor(index)} />
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