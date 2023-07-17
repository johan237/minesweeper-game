function newGame() {
    location.reload();
    return
}

let timeBoxes = Array.from(document.querySelectorAll('.time span'));
console.log(timeBoxes)
let currentTime = 0
let remainingBombs = 20

function timeArray(t) {
    if (t <= 9) {
        t = '00' + t
    } else if (t <= 99) {
        t = '0' + t
    }
    return (t.toString()).split('')
}

const timeMapObject = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine'
}

console.log(timeArray(4))
setInterval(() => {
    let currentTimeArray = timeArray(currentTime)
    currentTimeArray.forEach((time, i) => {
        timeBoxes[i].style.backgroundImage = `url('assets/${timeMapObject[time]}.svg')`
    })
    currentTime++
}, 1000)

let BOXES = []
let revealedArray = new Array(81).fill(false)
const BOMBS_ARRAY = []

const showBomb = (i) => {
    const box = BOXES[i]
        // box.textContent = '💣'
    box.style.backgroundImage = "url('assets/mine.svg')"
    box.style.backgroundColor = '#FC0D1B'
    box.classList.add('selected')
}


const handleBoxClick = (i) => {
    console.log('box clicked')
    console.log(i)

    if (BOMBS_ARRAY.indexOf(i) !== -1) {
        return showAllBombs()

    } else {
        showBoxValue(i)
        revealAdjacentSquares(i)
    }
}

function showBoxValue(i) {
    const numberOfBombs = findNumberOfBombsNear(i)
    placeNumber(i, numberOfBombs)
}


function placeNumber(index, numberOfBombs) {
    const box = BOXES[index]
    console.log(numberOfBombs)
    box.classList.add('selected')
    box.textContent = numberOfBombs
}


function showAllBombs() {
    BOXES.forEach((box, i) => {
        if (BOMBS_ARRAY.indexOf(i) !== -1) {
            showBomb(i)
        }
    })
    console.log('game is finished')
    setTimeout(() => {
        alert('Game is finished, restarting')
    }, 500)
    setTimeout(() => {
        console.log('running finished due to bomb')
        newGame()
    }, 600)
}


BOXES.forEach((box, i) => {
    box.addEventListener('click', () => handleBoxClick(i))
})



const randomBombNumber = () => {
    return Math.floor(Math.random() * 81)
}

const placeBombs = () => {
    // const bombsArray = []

    while (BOMBS_ARRAY.length < 20) {
        const bombNumber = randomBombNumber()
        if (BOMBS_ARRAY.indexOf(bombNumber) === -1) {
            BOMBS_ARRAY.push(bombNumber)
        }
    }

    // bombsArray.forEach((bomb) => BOMBS_ARRAY.push(bomb))
    console.log(BOMBS_ARRAY)
}

function findNumberOfBombsNear(index) {
    // const bombs = placeBombs()
    let numberOfBombs = 0
        // const row = Math.floor(index / 9)
    const column = index % 9

    if (BOMBS_ARRAY.indexOf(index - 10) !== -1 && !ignoreJumpingColumns(column, index - 10)) {
        numberOfBombs++
    }
    if (BOMBS_ARRAY.indexOf(index - 9) !== -1 && !ignoreJumpingColumns(column, index - 9)) {
        numberOfBombs++
    }
    if (BOMBS_ARRAY.indexOf(index - 8) !== -1 && !ignoreJumpingColumns(column, index - 8)) {
        numberOfBombs++
    }
    if (BOMBS_ARRAY.indexOf(index - 1) !== -1 && !ignoreJumpingColumns(column, index - 1)) {
        numberOfBombs++
    }
    if (BOMBS_ARRAY.indexOf(index + 1) !== -1 && !ignoreJumpingColumns(column, index + 1)) {
        numberOfBombs++
    }
    if (BOMBS_ARRAY.indexOf(index + 8) !== -1 && !ignoreJumpingColumns(column, index + 8)) {
        numberOfBombs++
    }
    if (BOMBS_ARRAY.indexOf(index + 9) !== -1 && !ignoreJumpingColumns(column, index + 9)) {
        numberOfBombs++
    }
    if (BOMBS_ARRAY.indexOf(index + 10) !== -1 && !ignoreJumpingColumns(column, index + 10)) {
        numberOfBombs++
    }
    return numberOfBombs

}

const initialiseGame = () => {
    const bombs = placeBombs()

    const mineboard = document.getElementsByClassName('mineboard')[0]
    for (let i = 0; i < 81; i++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.onclick = () => handleBoxClick(i)
        box.oncontextmenu = (e) => {
                e.preventDefault()
                if (!box.classList.contains('selected') && !box.classList.contains('flagged')) {
                    box.style.backgroundImage = 'url("assets/flag.svg")'
                    box.classList.add('flagged')
                    adjustRemainingBombs(false)
                } else if (!box.classList.contains('selected') && box.classList.contains('flagged')) {
                    box.style.backgroundImage = ''
                    box.classList.remove('flagged')
                    adjustRemainingBombs(true)
                }

            }
            // BOXES.push(box)
        const flag = '🚩'
        mineboard.append(box)
    }
    handleBombDisplay(remainingBombs)
    BOXES = Array.from(document.querySelectorAll('.box'))
    return bombs
}

function handleBombDisplay(num) {
    document.querySelector('.bombs--remaining--number').textContent = num
}

function adjustRemainingBombs(increase) {
    let theyAreAllBombs = true
    if (increase) {
        remainingBombs++

    } else {
        remainingBombs--
    }

    handleBombDisplay(remainingBombs)

    if (remainingBombs == 0) {
        BOXES.forEach((box, i) => {
                if (isABomb(i) && !box.classList.contains('flagged')) {
                    console.log('my friend check your bombs')
                    theyAreAllBombs = false
                }
            })
            // BOMBS_ARRAY.forEach((bomb) => showBomb(bomb))
        if (theyAreAllBombs) {
            alert('You won the game!')
            newGame()
        }
    }
}

initialiseGame()
    // showAllBombs()
    // BOXES[0].style.backgroundColor = 'green'

function revealAdjacentSquares(position) {
    if (isABomb(position) || revealedArray[position]) return
    revealedArray[position] = true
        // BOXES[position].style.backgroundColor = 'green'
        // console.log('Boxes are ', BOXES)
    let otherSquares = adjacentSquares(position)
    console.log(otherSquares)
    otherSquares.forEach((square, i) => {
        showBoxValue(square)
        revealedArray[square] = true
    })
    console.log('And its adjacent squares are: ', otherSquares)
}

// function revealSquare(square)

function ignoreJumpingColumns(column, newPosition) {
    console.log('Column number is', column)
    if (!(column == 0 || column == 8)) {
        return false
    }
    let newColumn = newPosition % 9

    if (newColumn === 0 && column == 8) return true
    if (newColumn === 8 && column == 0) return true

    return false

}

function adjacentSquares(position) {
    let row = Math.floor(position / 9)
    let column = position % 9
    let adjacentSquares = []
        // arr.hasOwnProperty(1)
    if (BOXES.hasOwnProperty(position - 10) && !revealedArray[position - 10] && !isABomb(position - 10) && !ignoreJumpingColumns(column, position - 10)) {
        adjacentSquares.push(position - 10)
    }

    if (BOXES.hasOwnProperty(position - 9) && !revealedArray[position - 9] && !isABomb(position - 9) && !ignoreJumpingColumns(column, position - 9)) {
        adjacentSquares.push(position - 9)
    }

    if (BOXES.hasOwnProperty(position - 8) && !revealedArray[position - 8] && !isABomb(position - 8) && !ignoreJumpingColumns(column, position - 8)) {
        adjacentSquares.push(position - 8)
    }
    if (BOXES.hasOwnProperty(position - 1) && !revealedArray[position - 1] && !isABomb(position - 1) && !ignoreJumpingColumns(column, position - 1)) {
        adjacentSquares.push(position - 1)
    }
    if (BOXES.hasOwnProperty(position + 1) && !revealedArray[position + 1] && !isABomb(position + 1) && !ignoreJumpingColumns(column, position + 1)) {
        adjacentSquares.push(position + 1)
    }
    if (BOXES.hasOwnProperty(position + 10) && !revealedArray[position + 10] && !isABomb(position + 10) && !ignoreJumpingColumns(column, position + 10)) {
        adjacentSquares.push(position + 10)
    }
    if (BOXES.hasOwnProperty(position + 9) && !revealedArray[position + 9] && !isABomb(position + 9) && !ignoreJumpingColumns(column, position + 9)) {
        adjacentSquares.push(position + 9)
    }
    if (BOXES.hasOwnProperty(position + 8) && !revealedArray[position + 8] && !isABomb(position + 8) && !ignoreJumpingColumns(column, position + 8)) {
        adjacentSquares.push(position + 8)
    }

    return adjacentSquares
}

function isABomb(i) {
    return BOMBS_ARRAY.indexOf(i) !== -1
}