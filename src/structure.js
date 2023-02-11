/* eslint-disable no-fallthrough */
export const Blocks = {
  green: 'green',
  blue: 'blue',
  white: 'white',
  yellow: 'yellow',
  red: 'red',
  orange: 'orange',

  getInitial(material) {
    switch (material) {
      case 0:
        return this.red
      case 1:
        return this.orange
      case 2:
        return this.white
      case 3:
        return this.yellow
      case 4:
        return this.green
      case 5:
        return this.blue
      default:
        return null
    }
  },

  getValue(block) {
    switch (block) {
      case this.red:
        return 0xff4040
      case this.orange:
        return 0xfc9e3f
      case this.white:
        return 0xffffff
      case this.yellow:
        return 0xe3dd22
      case this.green:
        return 0x36d600
      case this.blue:
        return 0x483efa
      default:
        return 0x404040 // innerColor
    }
  }
}

export const Type = {
  core: 'core',
  center: 'center',
  edge: 'edge',
  corner: 'corner',

  get(size) {
    switch (size) {
      case 0:
        return this.core
      case 1:
        return this.center
      case 2:
        return this.edge
      case 3:
        return this.corner
      default:
        return null
    }
  }
}

/* Face indexes
    0 | 1 | 2 
   ---+---+---
    3 | 4 | 5 
   ---+---+---
    6 | 7 | 8 
*/
export const Face = {
  front: 'front',
  back: 'back',
  top: 'top',
  bottom: 'bottom',
  right: 'right',
  left: 'left',
  angles: [5, 2, 1, 0, 3, 6, 7, 8],

  get(idx) {
    switch (idx) {
      case 4:
        return this.front  // z = 0 [xy]
      case 10:
        return this.top    // y = 0 [xz]
      case 12:
        return this.left   // x = 0 [yz]
      case 14:
        return this.right  // x = 2 [yz]
      case 16:
        return this.bottom // y = 2 [xz]
      case 22:
        return this.back   // z = 2 [xy]
      default:
        return null
    }
  },

  getSettings(face) {
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
}

export const size = 1, gap = 0.3
export const r = size + gap, R = Math.SQRT2 * r

export function transform(position) {
  position[0] = position[0] - 1
  position[1] = 1 - position[1]
  position[2] = 1 - position[2]
  return position.map(dim => dim * r)
}

export function idxToDimensions(idx) {
  const x = idx % 3
  const y = Math.floor(idx / 3) % 3
  const z = Math.floor(idx / 9)
  return [x, y, z]
}

function insert(array, value) {
  array.splice(0, 0, value)
}

class NewPiece {
  constructor(idx, position, blocks) {
    [this.x, this.y, this.z] = position
    this.idx = idx
    this.position = transform(position)
    this.blocks = blocks
    this.type = Type.get(blocks.length)
  }

  getDimensions() {
    return [this.x, this.y, this.z]
  }

  setDimensions(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
}

class NewCube {
  constructor() {
    this.pieces = [] // 1D array
    this.data = []   // 3D array

    let pieceIdx = 0

    for (let z = 0; z < 3; z++) {
      this.data.push([])

      for (let y = 0; y < 3; y++) {
        this.data[z].push([])
        const middle = this.#getMiddleMaterials(z)

        for (let x = 0; x < 3; x++) {
          const materials = this.#getMaterials(y, middle[x])
          const blocks = materials.map(material => Blocks.getInitial(material))
          const piece = new NewPiece(pieceIdx, [x, y, z], blocks)

          for (let i = 0; i < 6; i++) {
            if (!materials.includes(i))
              materials.push(i)
          }

          this.data[z][y].push({ idx: pieceIdx, materials: materials })
          this.pieces.push(piece)

          pieceIdx++
        }
      }
    }
  }

  getData(piece) {
    return this.data[piece.z][piece.y][piece.x]
  }

  get(face) {
    const facePieces = []

    switch (face) {
      case Face.front:
        for (let y = 0; y < 3; y++)
          for (let x = 0; x < 3; x++)
            facePieces.push(this.pieces[this.data[0][y][x].idx])
        break

      case Face.back:
        for (let y = 0; y < 3; y++)
          for (let x = 2; x >= 0; x--)
            facePieces.push(this.pieces[this.data[2][y][x].idx])
        break

      case Face.top:
        for (let z = 2; z >= 0; z--)
          for (let x = 0; x < 3; x++)
            facePieces.push(this.pieces[this.data[z][0][x].idx])
        break

      case Face.bottom:
        for (let z = 0; z < 3; z++)
          for (let x = 0; x < 3; x++)
            facePieces.push(this.pieces[this.data[z][2][x].idx])
        break

      case Face.right:
        for (let y = 0; y < 3; y++)
          for (let z = 0; z < 3; z++)
            facePieces.push(this.pieces[this.data[z][y][2].idx])
        break

      case Face.left:
        for (let y = 0; y < 3; y++)
          for (let z = 2; z >= 0; z--)
            facePieces.push(this.pieces[this.data[z][y][0].idx])
        break

      default:
        return null
    }

    return facePieces
  }

  rotate(face, clockwise) {
    let [start, end, delta] = [0, Face.angles.length - 2, 1]
    if (clockwise) {
      start = Face.angles.length - 1
      end = 1
      delta = -1
    }

    let i = start, j

    const dims = [
      face[Face.angles[i]].getDimensions(),
      face[Face.angles[i + delta]].getDimensions()
    ]

    while (i !== end) {
      const [current, next] = [Face.angles[i], Face.angles[i + 2 * delta]]
      const [currentPiece, nextPiece] = [face[current], face[next]]

      const [nextX, nextY, nextZ] = nextPiece.getDimensions()

      this.data[nextZ][nextY][nextX].idx = currentPiece.idx
      currentPiece.setDimensions(nextX, nextY, nextZ)

      i += delta
    }

    for (j = 0; j < 2; j++) {
      const currentPiece = face[Face.angles[i + j * delta]]

      const [nextX, nextY, nextZ] = dims[j]

      this.data[nextZ][nextY][nextX].idx = currentPiece.idx
      currentPiece.setDimensions(nextX, nextY, nextZ)
    }
  }

  #getMiddleMaterials(z) {
    const middle = [[1], [], [0]]
    switch (z) {
      case 0:
        middle[0].push(4)
        middle[1].push(4)
        insert(middle[2], 4)
      case 1:
        break

      case 2:
        insert(middle[0], 5)
        middle[1].push(5)
        middle[2].push(5)
        break

      default:
        return null
    }
    return middle
  }

  #getMaterials(y, middle) {
    switch (y) {
      case 0:
        insert(middle, 2) // top
      case 1:
        break // middle

      case 2:
        middle.reverse()
        insert(middle, 3) // bottom
        break

      default:
        return null
    }
    return middle
  }
}

export default NewCube