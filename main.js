const board = document.querySelector('canvas')
const ctx = board.getContext('2d')
const gameOver = document.querySelector('.gameOverModal')

const puyoColors = ['red', 'blue', 'yellow', 'green']
//radio de los circulos
const puyoRadius = 20
const puyoWidth = puyoRadius * 2
const boardBottom = board.height - puyoRadius
//modificar velocidad del juego
const gameSpeed = 30
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
        this.initialPosition = x
        this.bottom = colsLimits[((this.x + 20) / this.width) - 1]
    }

    //genera los circulos de colores
    update(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color
        ctx.fill();
    }

    advance(){
        if(this.y < this.bottom){
            this.y++
        }
        this.update()
    }

    moveLeft(){
        this.x -= this.width
    }

    moveRight(){
        this.x += this.width
    }

    moveDown(){
        this.y = this.bottom
    }

    //calcula el top de los puyos cada que hay un cambio en su posición
    calculateNewbottom(){
        let position = (this.x + 20) / this.width
        this.bottom = colsLimits[position - 1]
    }
}

class PuyoPair {
    constructor(){
        this.left = new Puyo(100)
        this.right = new Puyo(140)
        this.rotateCounter = 1
        this.reachedBottom = true
        this.downReference = this.right
        this.upReference = this.left
    }

    advance(){
        if(this.downReference.y >= this.downReference.bottom){
            //fijar los nuevos límites de cada columna
            if(this.reachedBottom){
                colsLimits[((this.downReference.x + 20) / puyoWidth) - 1] -= puyoWidth
                colsLimits[((this.upReference.x + 20) / puyoWidth) - 1] -= puyoWidth
                this.createNewPair()
                this.reachedBottom = false
            }
        } 

        //si las columans alcanzaron su límite máximo, detiene el juego
        for(var i=0; i < colsLimits.length; i++){
            if(colsLimits[i] < -puyoWidth)[
                stopGame()
            ]
        }

        this.left.advance()
        this.right.advance()
    }

    moveLeft(){
        if(this.left.x <= puyoRadius || this.right.x <= puyoRadius) return false
        this.left.moveLeft()
        this.right.moveLeft()
        this.calculateNewbottom()
    }

    moveRight(){
        let rightLimit = board.width - puyoRadius
        if(this.left.x >=  rightLimit || this.right.x >= rightLimit) return false
        this.left.moveRight()
        this.right.moveRight()
        this.calculateNewbottom()
    }

    moveDown(){
        this.downReference.moveDown()
        this.upReference.moveDown()
    }

    rotate(){
        switch(this.rotateCounter){
            case 1:
                this.upReference.x += puyoWidth
                this.upReference.y -= puyoWidth
                break
            case 2:
                this.upReference.x += puyoWidth
                this.upReference.y += puyoWidth
                break
            case 3:
                this.upReference.x -= puyoWidth
                this.upReference.y += puyoWidth
                this.downReference = this.left
                this.upReference = this.right
                break
            case 4:
                this.downReference.x -= puyoWidth
                this.downReference.y -= puyoWidth
                this.downReference = this.right
                this.upReference = this.left
                this.rotateCounter = 0
                break
        }
        this.rotateCounter++
        this.calculateNewbottom()
    }

    //crear el nuevo par de puyos en el tablero
    createNewPair(){
        puyos.push(new PuyoPair())
    }

    //calcula las posiciones del par de puyos 
    calculateNewbottom(){
        switch(this.rotateCounter){
            case 1:
            case 3:
                this.left.calculateNewbottom()
                this.right.calculateNewbottom()
                break
            case 2:
            case 4:
                this.downReference.calculateNewbottom()
                this.upReference.bottom = this.downReference.bottom - puyoWidth
                break            
        }
    }
}

const puyos = [new PuyoPair()]

document.onkeyup = (e) => {
    const currentPuyo = puyos.length - 1
    switch(e.keyCode){
        case 37:
            puyos[currentPuyo].moveLeft()
            break
        case 38:
            puyos[currentPuyo].rotate()
            break
        case 39:
            puyos[currentPuyo].moveRight()
            break
        case 40:
            puyos[currentPuyo].moveDown()
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
    refreshGame = setInterval(updateGame, gameSpeed)
    e.style.visibility = 'hidden'
}

function stopGame(){
    clearInterval(refreshGame)
    ctx.clearRect(0, 0, board.width, board.height)
    gameOver.style.display ='block'
}


