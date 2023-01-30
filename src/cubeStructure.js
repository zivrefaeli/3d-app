const Blocks = {
    green: 'green',
    blue: 'blue',
    white: 'white',
    yellow: 'yellow',
    red: 'red',
    orange: 'orange'
}


const Type = {
    corner: 'corner',
    edge: 'edge',
    center: 'center',
    core: 'core',

    getByPosition(x, y, z) {
        let type = this.core
        if (x === 1 && y === 1 && z === 1) {
            return type
        }

        if (z === 1) {
            if (x === 1 || y === 1) {
                type = this.center
            } else {
                type = this.edge
            }
        } else {
            if (x === 1 || y === 1) {
                type = x === y ? this.center : this.edge
            } else {
                type = this.corner
            }
        }

        return type
    },

    getByBlocks(blocks) {
        switch (blocks) {
            case 0:
                return Type.core

            case 1:
                return Type.center

            case 2:
                return Type.edge

            case 3:
                return Type.corner

            default:
                return null
        }
    }
}


class Piece {
    constructor(...blocks) {
        this.blocks = blocks
        this.type = Type.getByBlocks(blocks.length)
    }

    getType() {
        return this.type
    }

    toString() {
        return this.blocks.join('-')
    }
}


class Cube {
    constructor() {
        this.pieces = []

        for (let z = 0; z < 3; z++) {
            this.pieces.push([]) // layer #z

            for (let y = 0; y < 3; y++) {
                this.pieces[z].push([]) // row #y

                for (let x = 0; x < 3; x++) {
                    let type = Type.getByPosition(x, y, z)

                    this.pieces[z][y].push([type, x, y, z].join('-'))
                }
            }
        }

        console.log(this.pieces)
    }
}


/*
            __  Piece __
          /              \
       Corner           Edge
       /  \           /   |  \
    TopC  BottomC   Top  Mid  Bottom
*/

const p1 = new Piece(Blocks.white, Blocks.green, Blocks.red)
//                      TOP        LEFT          RIGHT 
console.log(p1.getType())
console.log(p1.blocks)
console.log(p1.toString())

const cube = new Cube()
console.log(cube.pieces)