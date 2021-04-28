const board = document.querySelector('canvas')
const ctx = board.getContext('2d')

const puyoColors = ['red', 'blue', 'yellow', 'green']
const puyoRadius = 20
const boardBottom = board.height - puyoRadius
const colsLimits = [
    boardBottom, 
    boardBottom,
    boardBottom,
    boardBottom,
    boardBottom,
    boardBottom
]
let idCounter = 1


class Puyo {
    constructor(x){
        this.id = idCounter++
        this.width = puyoRadius * 2
        this.x = x
        this.y = puyoRadius
        this.color = puyoColors[Math.floor(Math.random() * puyoColors.length)]
    }

    update(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color
        ctx.fill();
    }
}

class PuyoDuo {
    constructor(){
        this.left = new Puyo(100)
        this.right = new Puyo(140)
        this.rotateCounter = 1
        this.desplazamiento = puyoRadius * 2
        this.downReference = this.right
        this.leftBottom = colsLimits[2]
        this.rightBottom = colsLimits[3]
        this.reachedBottom = false
    }

    rotate(){
        switch(this.rotateCounter){
            case 1:
                this.left.x += this.desplazamiento
                this.left.y -= this.desplazamiento
                break
            case 2:
                this.left.x += this.desplazamiento
                this.left.y += this.desplazamiento
                break
            case 3:
                this.left.x -= this.desplazamiento
                this.left.y += this.desplazamiento
                this.downReference = this.left
                break
            case 4:
                this.left.x -= this.desplazamiento
                this.left.y -= this.desplazamiento
                this.downReference = this.right
                this.rotateCounter = 0
                break
        }
        this.rotateCounter++
    }

    advance(){
        if(this.left.y >= this.leftBottom){
            this.left.update()
        } else {
            this.left.y += 1
            this.left.update()
        }

        if(this.right.y >= this.rightBottom){
            this.right.update()
        } else {
            this.right.y += 1
            this.right.update()
        }

        //crear nuevo par de puyos
        if(this.left.y >= this.leftBottom || this.right.y >= this.rightBottom){
            if(!this.reachedBottom){
                puyos.push(new PuyoDuo())
                this.reachedBottom = true
            }
        }
    }

    moveLeft(){
        if(this.left.x <= this.desplazamiento || this.right.x <= this.desplazamiento){
            return false
        } 
        this.left.x -= this.desplazamiento
        this.right.x -= this.desplazamiento
    }

    moveRight(){
        const rigthLimit = board.width - puyoRadius
        if(this.left.x >= rigthLimit || this.right.x >= rigthLimit){
            return false
        }
        this.left.x += this.desplazamiento
        this.left.columna++
        this.right.x += this.desplazamiento 
        this.right.columna++   
    }

    moveDown(){
        let leftPuyoPosition = (this.left.x + 20) / this.left.width
        let rightPuyoPosition = (this.right.x + 20) / this.right.width
        this.leftBottom = colsLimits[leftPuyoPosition - 1]
        this.rightBottom = colsLimits[rightPuyoPosition - 1]
        this.left.y = this.leftBottom
        colsLimits[leftPuyoPosition - 1] -= this.left.width
        this.right.y = this.rightBottom
        colsLimits[rightPuyoPosition - 1] -= this.left.width
    }
}

const puyos = [new PuyoDuo()]

document.onkeyup = (e) => {
    const index = puyos.length - 1
    switch(e.keyCode){
        case 37:
            puyos[index].moveLeft()
            break
        case 38:
            puyos[index].rotate()
            break
        case 39:
            puyos[index].moveRight()
            break
        case 40:
            puyos[index].moveDown()
            break 
        default:
            console.log('tecla invalida')
            break
    }
}

function updateGame(){
    ctx.clearRect(0, 0, board.width, board.height)
    puyos.map(puyoPair => {
        puyoPair.advance()
    })
}

function startGame(e){
    setInterval(updateGame, 50)
    e.style.visibility = 'hidden'
}



