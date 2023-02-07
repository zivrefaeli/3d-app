import React, { useState, useRef, useEffect } from 'react'
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

function format3D(object) {
  return [object.x, object.y, object.z]
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}

function getColor(index) {
  switch (index) {
    case 0:
      return 0x8ecae6

    case 2:
      return 0x023047

    case 6:
      return 0x8ac926

    case 8:
      return 0xfb8500

    case 18:
      return 0xbc6c25

    case 20:
      return 0x606c38

    case 24:
      return 0xffafcc

    case 26:
      return 0x48cae4

    default:
      return 0xff0000
  }
}


const log = console.log
const cube = new Cube()
const rotateInit = { face: null, moving: false, angle: 0, target: 0, delta: -1 }

log('%cCube Initialize', 'color:red; font-size:1rem')

export default function CubeModel() {
  const [clockwise, setClockwise] = useState(true)
  const [rotate, setRotate] = useState(rotateInit)
  const [settings, setSettings] = useState(getFaceSettings(null))
  const [face, setFace] = useState(null) // array of Pieces
  const meshes = useRef([]) // array of Meshes

  const getMesh = index => meshes.current[index]

  const resetFaceMeshes = () => {
    face.forEach(piece => {
      const mesh = getMesh(piece.meshIndex)
      // reset rotation
      mesh.rotation.x = 0
      mesh.rotation.y = 0
      mesh.rotation.z = 0
      // TODO: set position to realPos
      const [x, y, z] = piece.realPos
      mesh.position.x = x
      mesh.position.y = y
      mesh.position.z = z
    })
  }

  useEffect(() => {
    log('effect called')

    window.onkeydown = e => e.key === 'Shift' && setClockwise(false)
    window.onkeyup = e => e.key === 'Shift' && setClockwise(true)
  }, [])

  useEffect(() => {
    log('direction:', clockwise ? 'clockwise' : 'counterclockwise')
  }, [clockwise])

  useFrame(() => {
    if (face == null)
      return // if haven't clicked on center / completed rotation, wait...

    // if cube completed full 90deg rotation, stop
    if (rotate.angle === rotate.target + rotate.delta) {
      cube.rotateFace(face, rotate.delta === -1)
      resetFaceMeshes()
      log(cube)

      setRotate(rotateInit)
      setFace(null)
      return
    }

    // rotate meshes by settings

    const { commonAxis, cosAxis, sinAxis, angleSign, cosSign, sinSign } = settings
    const angle = rotate.angle

    const centerMesh = getMesh(face[4].meshIndex)
    centerMesh.rotation[commonAxis] = degreesToRadians(angleSign * angle)

    for (let i = 0; i < cube.angles.length; i++) {
      const radius = i % 2 === 0 ? r : R
      const faceIndex = cube.angles[i]

      const mesh = getMesh(face[faceIndex].meshIndex)

      mesh.position[cosAxis] = centerMesh.position[cosAxis] + cosSign * radius * Math.cos(degreesToRadians(angle + i * 45))
      mesh.position[sinAxis] = centerMesh.position[sinAxis] + sinSign * radius * Math.sin(degreesToRadians(angle + i * 45))
      mesh.rotation[commonAxis] = centerMesh.rotation[commonAxis]
    }

    setRotate({ ...rotate, angle: angle + rotate.delta })
  })

  return (
    cube.piecesArray.map((piece, index) => (
      <mesh
        ref={meshRef => meshes.current[index] = meshRef} // init meshes
        position={piece.realPos}
        key={index}
        onClick={e => {
          if (e.object.uuid !== e.intersections[0].object.uuid)
            return // preform click only on the clicked piece, and not its intersections

          log(format3D(getMesh(index).position))
          if (piece.type !== Type.center || rotate.moving)
            return

          const selectedFace = Face.getByIndex(index)
          setRotate({ face: selectedFace, moving: true, angle: 0, target: clockwise ? -90 : 90, delta: clockwise ? -1 : 1 })
          setSettings(getFaceSettings(selectedFace))
          setFace(cube.getFace(selectedFace))
        }}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={getColor(index)} />
      </mesh>
    ))
  )
}