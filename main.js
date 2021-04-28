const board = document.querySelector('canvas')
const ctx = board.getContext('2d')

const puyoColors = ['red', 'blue', 'yellow', 'green']
//radio de los circulos
const puyoRadius = 20
const boardBottom = board.height - puyoRadius
//modificar velocidad del juego
const gameSpeed = 10
let idCounter = 1
//profundidad de cada columna
const colsLimits = [
    boardBottom, 
    boardBottom,
    boardBottom,
    boardBottom,
    boardBottom,
    boardBottom
]

class Puyo {
    constructor(x){
        this.width = puyoRadius * 2
        this.x = x
        this.y = puyoRadius
        this.color = puyoColors[Math.floor(Math.random() * puyoColors.length)]
        this.id = idCounter++
        this.rotateCounter = 1
        this.bottom = colsLimits[((x+20) / this.width) - 1]
        this.reachedBottom = true
        this.initialPosition = x
    }

    update(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color
        ctx.fill();
    }

    rotate(){
        switch(this.rotateCounter){
            case 1:
                this.x += this.width
                this.y -= this.width
                break
            case 2:
                this.x += this.width
                this.y += this.width
                break
            case 3:
                this.x -= this.width
                this.y += this.width
                break
            case 4:
                this.x -= this.width
                this.y -= this.width
                this.rotateCounter = 0
                break
        }
        this.rotateCounter++
    }

    advance(){
        if(this.y >= this.bottom){
            this.update()
            if(this.reachedBottom){
                let puyoPosition = (this.x + 20) / this.width
                colsLimits[puyoPosition - 1] -= this.width
                puyos.push(new Puyo(this.initialPosition))
                this.reachedBottom = false
            }
        } else {
            this.y += 1
            this.update()
        }
    }

    moveLeft(){
        const leftLimit = puyoRadius
        if(this.x <= leftLimit){
            return false
        } 
        this.x -= this.width
        this.bottom = colsLimits[((this.x+20) / this.width) - 1]
    }

    moveRight(){
        const rigthLimit = board.width - puyoRadius
        if(this.x >= rigthLimit){
            return false
        }
        this.x += this.width
        this.bottom = colsLimits[((this.x+20) / this.width) - 1]
    }

    moveDown(){
        this.y = this.bottom
    }
}

const puyos = [new Puyo(100), new Puyo(140)]

document.onkeyup = (e) => {
    const index1 = puyos.length - 2
    const index2 = puyos.length - 1
    switch(e.keyCode){
        case 37:
            puyos[index1].moveLeft()
            puyos[index2].moveLeft()
            break
        case 38:
            puyos[index1].rotate()
            // puyos[index2].rotate()
            break
        case 39:
            puyos[index1].moveRight()
            puyos[index2].moveRight()
            break
        case 40:
            puyos[index1].moveDown()
            puyos[index2].moveDown()
            break 
        default:
            console.log('tecla invalida')
            break
    }
}

function updateGame(){
    ctx.clearRect(0, 0, board.width, board.height)
    puyos.map(puyo => {
        puyo.advance()
    })
}

function startGame(e){
    setInterval(updateGame, gameSpeed)
    e.style.visibility = 'hidden'
}



