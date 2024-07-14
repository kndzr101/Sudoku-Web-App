const tableBody = document.querySelector('tbody');

for (let row = 0; row < 9; row++) {
    const tr = document.createElement('tr');
    for (let col = 0; col < 9; col++) {
        const td = document.createElement('td');
        if (row % 3 === 0 && row !== 0) td.classList.add('top-border');
        if (col % 3 === 0 && col !== 0) td.classList.add('left-border');
        if (row === 8) td.classList.add('bottom-border');
        if (col === 8) td.classList.add('right-border');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.dataset.row = row;
        input.dataset.col = col;
        input.addEventListener('keydown', handleNavigation);
        td.appendChild(input);
        tr.appendChild(td);
    }
    tableBody.appendChild(tr);
}

function handleNavigation(event) {
    const key = event.key;
    const currentInput = event.target;
    const row = parseInt(currentInput.dataset.row);
    const col = parseInt(currentInput.dataset.col);

    let newRow = row;
    let newCol = col;

    switch (key) {
        case 'ArrowUp':
            newRow = row > 0 ? row - 1 : 8;
            break;
        case 'ArrowDown':
            newRow = row < 8 ? row + 1 : 0;
            break;
        case 'ArrowLeft':
            newCol = col > 0 ? col - 1 : 8;
            break;
        case 'ArrowRight':
            newCol = col < 8 ? col + 1 : 0;
            break;
        default:
            return;
    }

    const newInput = document.querySelector(`input[data-row='${newRow}'][data-col='${newCol}']`);
    newInput.focus();
    event.preventDefault(); 
}

function processInput() {
    const inputs = document.querySelectorAll('input');
    const board = Array.from(Array(9), () => Array(9).fill('.'));

   
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const value = input.value.trim(); 
        board[row][col] = value !== '' ? value : '.';
    });

   
    let isValid = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === '.') {
                isValid = false;
                break;
            }
        }
        if (!isValid) {
            break;
        }
    }

  
    if (isValid) {
        isValid = isValidSudoku(board);
    }

   
    const resultMessage = isValid ? "The Sudoku is valid!" : "The Sudoku is invalid!";
    document.getElementById('result').textContent = resultMessage;
}


function isValidSudoku(board) {
    function isValid(arr) {
        const seen = new Set();
        for (let num of arr) {
            if (num !== '.' && seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    }

    
    for (let i = 0; i < 9; i++) {
        if (!isValid(board[i])) return false;
    }

   
    for (let i = 0; i < 9; i++) {
        const col = board.map(row => row[i]);
        if (!isValid(col)) return false;
    }

  
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            const grid = [];
            for (let row = i; row < i + 3; row++) {
                for (let col = j; col < j + 3; col++) {
                    grid.push(board[row][col]);
                }
            }
            if (!isValid(grid)) return false;
        }
    }

    return true;
}
function generateEasySudoku() {
    const inputs = document.querySelectorAll('input');

    
    inputs.forEach(input => {
        input.value = '';
    });

    
    const board = generateValidSudoku();

   
    const cellsToPopulate = 40; 
    let count = 0;
    let attempts = 0;

    while (count < cellsToPopulate && attempts < 1000) { 
        const randomIndex = Math.floor(Math.random() * 81);
        const row = Math.floor(randomIndex / 9);
        const col = randomIndex % 9;

        if (board[row][col] === '.') {
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * 9) + 1;
            } while (!isValidPlacement(board, row, col, String(randomNumber)) && attempts++ < 1000);

            if (attempts < 1000) {
                board[row][col] = String(randomNumber);
                inputs[randomIndex].value = String(randomNumber);
                count++;
            }
        }
    }
}

function generateValidSudoku() {
    const board = Array.from(Array(9), () => Array(9).fill('.'));
    fillSudoku(board);
    return board;
}

function fillSudoku(board) {
    return backtrack(board, 0, 0);
}
function fillSudoku() {
    console.log("Clicked Fill Sudoku Button");
    
    
    const inputs = document.querySelectorAll('input');
    const board = Array.from(Array(9), () => Array(9).fill('.'));

    
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const value = input.value.trim(); 
        board[row][col] = value !== '' ? value : '.';
    });
    if(!isValidSudoku(board)){
        alert("Sudoku is already invalid!");
    }else{

        
        backtrack(board, 0, 0);

       
        board.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                inputs[rowIndex * 9 + colIndex].value = value;
            });
        });
    }
}

function backtrack(board, row, col) {
    if (row === 9) {
        return true; 
    }

    if (col === 9) {
        return backtrack(board, row + 1, 0); 
    }

    if (board[row][col] !== '.') {
        return backtrack(board, row, col + 1);
    }

    const numbers = shuffle([...Array(9).keys()]).map(x => x + 1); 

    for (let num of numbers) {
        if (isValidPlacement(board, row, col, String(num))) {
            board[row][col] = String(num);
            if (backtrack(board, row, col + 1)) {
                return true; 
            }
            board[row][col] = '.';
        }
    }

    return false; 
}

function isValidPlacement(board, row, col, number) {
    
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === number) return false;
    }

   
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === number) return false;
    }

  
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let i = boxRowStart; i < boxRowStart + 3; i++) {
        for (let j = boxColStart; j < boxColStart + 3; j++) {
            if (board[i][j] === number) return false;
        }
    }

    return true;
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}






function generateMediumSudoku(){
    inputs.forEach(input => {
        if (Math.random() < 0.75) {
            input.value = '';
        } else {
            const randomNumber = Math.floor(Math.random() * 9) + 1;
            input.value = randomNumber;
        }
    });
}
function generateHardSudoku(){
    inputs.forEach(input => {
        if (Math.random() < 0.9) {
            input.value = '';
        } else {
            const randomNumber = Math.floor(Math.random() * 9) + 1;
            input.value = randomNumber;
        }
    });
}
function clearSudoku() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    document.getElementById('result').textContent = ''; 
}