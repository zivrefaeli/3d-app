export const Blocks = {
  green: 'green',
  blue: 'blue',
  white: 'white',
  yellow: 'yellow',
  red: 'red',
  orange: 'orange'
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

class Piece {
  constructor(meshIndex, position, blocks) {
    this.meshIndex = meshIndex
    this.position = position
    this.blocks = blocks

    this.realPos = transform(position)
    this.type = Type.getByPosition(position)
  }
}

class Cube {
  angles = [5, 2, 1, 0, 3, 6, 7, 8]

  constructor() {
    this.pieces = [] // this.pieces[z][y][x]
    let meshIndex = 0

    for (let z = 0; z < 3; z++) {
      this.pieces.push([])

      for (let y = 0; y < 3; y++) {
        this.pieces[z].push([])

        for (let x = 0; x < 3; x++) {
          this.pieces[z][y].push(new Piece(meshIndex, [x, y, z], []))
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

  // TODO: rotate face clockwise / counterclockwise - more efficient
  rotateFace(pieces, clockwise) {
    let index = pieces[0].meshIndex
    pieces[0].meshIndex = pieces[2].meshIndex
    pieces[2].meshIndex = pieces[8].meshIndex
    pieces[8].meshIndex = pieces[6].meshIndex
    pieces[6].meshIndex = index

    index = pieces[1].meshIndex
    pieces[1].meshIndex = pieces[5].meshIndex
    pieces[5].meshIndex = pieces[7].meshIndex
    pieces[7].meshIndex = pieces[3].meshIndex
    pieces[3].meshIndex = index
  }
}

export default Cube


/* let constValue, outerStart, innerStart
let constIndex, outerIndex, innerIndex
 
front:
constIndex = 0
outerIndex = 1
innerIndex = 2

constValue = 0
outerStart = 0
innerStart = 0

let outerEnd = 2 - outerStart, innerEnd = 2 - innerStart
const outerDelta = outerStart < outerEnd ? 1 : -1
const innerDelta = innerStart < innerEnd ? 1 : -1

outerEnd += outerDelta
innerEnd += innerDelta

console.log(outerStart, outerEnd)

const values = Array(3).fill(0)
values[constIndex] = constValue

let i = outerStart, j
while (i !== outerEnd) {
  j = innerStart

  while (j < innerEnd) {
    values[outerIndex] = i
    values[innerIndex] = j
    console.log('v', values);
    facePieces.push(this.pieces[values[0]][values[1]][values[2]])

    j += innerDelta
  }
  i += outerDelta
} */