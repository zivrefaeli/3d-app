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
        return 0xffe417
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

  getByPosition([x, y, z]) {
    if (x === 1 && y === 1 && z === 1) {
      return this.core
    }

    if (z === 1) {
      if (x === 1 || y === 1) {
        return this.center
      }
      return this.edge
    }

    if (x === 1 || y === 1) {
      return x === y ? this.center : this.edge
    }
    return this.corner
  },

  getByBlocks(blocks) {
    switch (blocks) {
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

export const Face = {
  front: 'front',
  back: 'back',
  top: 'top',
  bottom: 'bottom',
  right: 'right',
  left: 'left',

  getByIndex(index) {
    switch (index) {
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

  getSharedValue(face) {
    switch (face) {
      case this.left:
      case this.right:
        return 'x' // x [yz]

      case this.top:
      case this.bottom:
        return 'y' // y [xz]

      case this.front:
      case this.back:
        return 'z' // z [xy]

      default:
        return null
    }
  }
}

export const size = 1, gap = 0.3
export const r = size + gap, R = Math.SQRT2 * r

function transform(position) {
  const [x, y, z] = position
  return [x - 1, 1 - y, 1 - z].map(dim => dim * r)
}

function insert(array, value) {
  array.splice(0, 0, value)
}

class Piece {
  constructor(meshIndex, position, materials) {
    // constants
    this.position = position
    this.realPos = transform(position)
    this.materials = materials
    this.type = Type.getByBlocks(materials.length)

    // mutable
    this.meshIndex = meshIndex
    this.blocks = materials.map(value => Blocks.getInitial(value))

    // add materials with innerColor
    for (let mat = 0; mat < 6; mat++) {
      if (!this.materials.includes(mat))
        this.materials.push(mat)
    }
  }
}

class Cube {
  /* Face indexes
   0 | 1 | 2 
  ---+---+---
   3 | 4 | 5 
  ---+---+---
   6 | 7 | 8 */
  angles = [5, 2, 1, 0, 3, 6, 7, 8]

  constructor() {
    this.pieces = [] // this.pieces[z][y][x]
    let meshIndex = 0

    for (let z = 0; z < 3; z++) {
      this.pieces.push([])

      for (let y = 0; y < 3; y++) {
        this.pieces[z].push([])
        const middle = this.#getMidIndexes(z)

        for (let x = 0; x < 3; x++) {
          const blocks = this.#getBlocksIndexes(y, middle[x])
          const piece = new Piece(meshIndex, [x, y, z], blocks)

          this.pieces[z][y].push(piece)
          meshIndex++
        }
      }
    }

    this.piecesArray = this.pieces.flat(3)
  }

  getFace(face) {
    const facePieces = []

    switch (face) {
      case Face.front:
        for (let y = 0; y < 3; y++) {
          for (let x = 0; x < 3; x++) {
            facePieces.push(this.pieces[0][y][x])
          }
        }
        break

      case Face.back:
        for (let y = 0; y < 3; y++) {
          for (let x = 2; x >= 0; x--) {
            facePieces.push(this.pieces[2][y][x])
          }
        }
        break

      case Face.top:
        for (let z = 2; z >= 0; z--) {
          for (let x = 0; x < 3; x++) {
            facePieces.push(this.pieces[z][0][x])
          }
        }
        break

      case Face.bottom:
        for (let z = 0; z < 3; z++) {
          for (let x = 0; x < 3; x++) {
            facePieces.push(this.pieces[z][2][x])
          }
        }
        break

      case Face.right:
        for (let y = 0; y < 3; y++) {
          for (let z = 0; z < 3; z++) {
            facePieces.push(this.pieces[z][y][2])
          }
        }
        break

      case Face.left:
        for (let y = 0; y < 3; y++) {
          for (let z = 2; z >= 0; z--) {
            facePieces.push(this.pieces[z][y][0])
          }
        }
        break

      default:
        return null
    }

    return facePieces
  }

  rotateFace(pieces, clockwise) {
    let [start, end, delta] = [0, this.angles.length - 2, 1]

    if (!clockwise) {
      start = this.angles.length - 1
      end = 1
      delta = -1
    }

    let i = start
    const edgeIndex = pieces[this.angles[start]].meshIndex
    const cornerIndex = pieces[this.angles[start + delta]].meshIndex

    while (i !== end) {
      const [current, next] = [this.angles[i], this.angles[i + 2 * delta]]
      pieces[current].meshIndex = pieces[next].meshIndex
      i += delta
    }

    pieces[this.angles[i]].meshIndex = edgeIndex
    pieces[this.angles[i + delta]].meshIndex = cornerIndex
  }

  #getMidIndexes(z) {
    const mid = [[1], [], [0]]
    switch (z) {
      case 0:
        mid[0].push(4)
        mid[1].push(4)
        insert(mid[2], 4)

      case 1:
        break

      case 2:
        insert(mid[0], 5)
        mid[1].push(5)
        mid[2].push(5)
        break

      default:
        return null
    }
    return mid
  }

  #getBlocksIndexes(y, mid) {
    switch (y) {
      case 0:
        insert(mid, 2) // top

      case 1:
        break

      case 2:
        mid.reverse()
        insert(mid, 3) // bottom
        break

      default:
        return null
    }
    return mid
  }
}

export default Cube