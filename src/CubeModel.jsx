import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import NewCube, { Blocks, Type, Face, size, r, R, transform } from './structure'

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}

const log = console.log
const rotateInit = { moving: false, angle: 0, target: 0, delta: -1 }


export default function CubeModel() {
  const cube = useRef(new NewCube())
  const meshes = useRef([])
  const rotate = useRef(rotateInit)
  const settings = useRef(Face.getSettings())
  const face = useRef(null)
  const [clockwise, setClockwise] = useState(true)

  const initMesh = mesh => {
    if (!meshes.current.includes(mesh))
      meshes.current.push(mesh)
  }

  const getMesh = idx => meshes.current[idx]

  const rotateMeshes = idx => {
    const selectedFace = Face.get(idx)
    const delta = clockwise ? -1 : 1

    rotate.current = {
      moving: true,
      angle: 0,
      target: 90 * delta,
      delta: delta
    }
    settings.current = Face.getSettings(selectedFace)
    face.current = cube.current.get(selectedFace)
  }

  const resetMeshes = () => {
    face.current.forEach(piece => {
      const mesh = getMesh(piece.idx)
      mesh.rotation.x = 0
      mesh.rotation.y = 0
      mesh.rotation.z = 0

      const [x, y, z] = transform(piece.getDimensions())
      mesh.position.x = x
      mesh.position.y = y
      mesh.position.z = z
    })
  }


  useEffect(() => {
    log('effect called []')
    window.addEventListener('keydown', e => e.key === 'Shift' && setClockwise(false))
    window.addEventListener('keyup', e => e.key === 'Shift' && setClockwise(true))
  }, [])

  useEffect(() => {
    log('direction:', clockwise ? 'clockwise' : 'counterclockwise')
  }, [clockwise])

  useFrame(() => {
    if (face.current == null)
      return // if haven't clicked on center / completed rotation, wait...

    const { angle, target, delta } = rotate.current

    // if cube completed full 90deg rotation, stop
    if (angle === target + delta) {
      cube.current.rotate(face.current, delta === -1)

      resetMeshes()

      rotate.current = { ...rotateInit }
      face.current = null

      return
    }

    // rotate meshes by settings
    const { commonAxis, cosAxis, sinAxis, angleSign, cosSign, sinSign } = settings.current

    const centerMesh = getMesh(face.current[4].idx)
    centerMesh.rotation[commonAxis] = degreesToRadians(angleSign * angle)

    for (let i = 0; i < Face.angles.length; i++) {
      const radius = i % 2 === 0 ? r : R
      const mesh = getMesh(face.current[Face.angles[i]].idx)

      mesh.position[cosAxis] = centerMesh.position[cosAxis] + cosSign * radius * Math.cos(degreesToRadians(angle + i * 45))
      mesh.position[sinAxis] = centerMesh.position[sinAxis] + sinSign * radius * Math.sin(degreesToRadians(angle + i * 45))
      mesh.rotation[commonAxis] = centerMesh.rotation[commonAxis]
    }

    rotate.current.angle = angle + delta
  })


  return (
    cube.current.pieces.map((piece, idx) => (
      <mesh
        ref={initMesh}
        position={piece.position}
        key={idx}
        onClick={e => {
          if (e.object.uuid !== e.intersections[0].object.uuid)
            return // preform click only on the clicked piece, and not its intersections
          if (piece.type !== Type.center || rotate.current.moving)
            return
          rotateMeshes(idx)
        }}>
        <boxGeometry args={[size, size, size]} />
        { // calls once, no React rendering...
          cube.current.getData(piece).materials.map((material, index) => (
            <meshStandardMaterial
              key={index}
              attach={`material-${material}`}
              color={Blocks.getValue(piece.blocks[index])}
            />
          ))
        }
      </mesh>
    ))
  )
}