import { useHelper } from '@react-three/drei'
import React, { useRef } from 'react'
import { PointLightHelper } from 'three'

export default function VisibleLight(props) {
  const lightRef = useRef()
  useHelper(lightRef, PointLightHelper, 1, 0xff0000)
  
  return <pointLight ref={lightRef} {...props} />
}