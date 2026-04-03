
const boardEl = document.getElementById('board');
const winnerEl = document.getElementById('winner');
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const restartBtn = document.getElementById('restartBtn');
const settingsBtn = document.getElementById('settingsBtn');
const hackerBox = document.getElementById('hackerBox');

let board = [];
let currentPlayer = 'X';
let selected = null;
let gameOver = false;

// ------------------ Initialize Board ------------------
function initBoard() {
    board = [];
    for (let r = 0; r < 8; r++) {
        board[r] = [];
        for (let c = 0; c < 8; c++) {
            if ((r + c) % 2 !== 0 && r < 3) board[r][c] = { player: 'O', king: false };
            else if ((r + c) % 2 !== 0 && r > 4) board[r][c] = { player: 'X', king: false };
            else board[r][c] = null;
        }
    }
    currentPlayer = 'X';
    selected = null;
    gameOver = false;
    winnerEl.classList.remove('show');
    hackerBox.innerHTML = "";
}

// ------------------ Update Cards ------------------
function updateCards() {
    let Xnormal = 0, Xking = 0, Onormal = 0, Oking = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let p = board[r][c];
            if (p) {
                if (p.player === 'X') p.king ? Xking++ : Xnormal++;
                else p.king ? Oking++ : Onormal++;
            }
        }
    }
    document.getElementById('X-normal').textContent = Xnormal;
    document.getElementById('X-king').textContent = Xking;
    document.getElementById('O-normal').textContent = Onormal;
    document.getElementById('O-king').textContent = Oking;
}

// ------------------ Draw Board ------------------
function drawBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((r + c) % 2 === 0 ? 'white' : 'black');
            const pieceObj = board[r][c];
            if (pieceObj) {
                const piece = document.createElement('div');
                piece.className = 'piece ' + pieceObj.player;
                if (pieceObj.king) {
                    piece.classList.add('king');
                    const img = document.createElement('img');
                    img.src = pieceObj.player === 'O'
                        ? 'https://i.pinimg.com/736x/cc/23/aa/cc23aa999e0423b68f16d0d2ef240acc.jpg'
                        : 'https://i.pinimg.com/736x/cc/23/aa/cc23aa999e0423b68f16d0d2ef240acc.jpg';
                    piece.appendChild(img);
                }
                if (selected && selected.row === r && selected.col === c) piece.classList.add('selected');
                cell.appendChild(piece);
            } else if (selected && isValidMove(selected.row, selected.col, r, c)) {
                cell.classList.add('highlight');
            }
            cell.addEventListener('click', () => handleClick(r, c));
            boardEl.appendChild(cell);
        }
    }
    updateCards();
}

// ------------------ Human Move ------------------
function handleClick(r, c) {
    if (gameOver || currentPlayer !== 'X') return;
    const cellPiece = board[r][c];
    if (selected) {
        if (isValidMove(selected.row, selected.col, r, c)) {
            makeMove(selected.row, selected.col, r, c);
            selected = null;
            if (!checkWin()) {
                currentPlayer = 'O';
                setTimeout(aiMove, 300);
            }
        } else {
            selected = null;
        }
    } else if (cellPiece && cellPiece.player === 'X') {
        selected = { row: r, col: c };
    }
    drawBoard();
}

// ------------------ AI Move (Hacker) ------------------
function aiMove() {
    if (gameOver || currentPlayer !== 'O') return;

    // Find all human pieces
    const targets = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.player === 'X') targets.push({ r, c });
        }
    }
    if (targets.length === 0) return;

    // Pick random target to capture
    const target = targets[Math.floor(Math.random() * targets.length)];

    // Pick random AI piece to "jump"
    const aiPieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.player === 'O') aiPieces.push({ r, c });
        }
    }
    const mover = aiPieces[Math.floor(Math.random() * aiPieces.length)];

    // Perform "illegal" capture
    board[target.r][target.c] = board[mover.r][mover.c];
    board[mover.r][mover.c] = null;

    // Hacker terminal message
    const line = document.createElement('span');
    line.className = 'typingLine';
    line.textContent = `HACKER AI captured piece at (${target.r},${target.c})`;
    hackerBox.appendChild(line);
    hackerBox.scrollTop = hackerBox.scrollHeight;

    // Animate
    const anim = document.createElement('div');
    anim.className = 'aiMoveAnim';
    anim.style.left = (mover.col * 70 + 15) + 'px';
    anim.style.top = (mover.row * 70 + 15) + 'px';
    document.body.appendChild(anim);
    setTimeout(() => anim.remove(), 500);

    drawBoard();
    if (!checkWin()) setTimeout(aiMove, 300);
}

// ------------------ Valid Move ------------------
function isValidMove(r1, c1, r2, c2) {
    const p = board[r1][c1];
    if (!p || board[r2][c2]) return false;

    const dr = r2 - r1, dc = c2 - c1;
    const directions = p.king
        ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        : p.player === 'X'
            ? [[-1, 1], [-1, -1]]
            : [[1, 1], [1, -1]];

    // Normal move
    for (const [dR, dC] of directions) {
        if (dr === dR && dc === dC) return true;
        if (dr === 2 * dR && dc === 2 * dC) {
            const mid = board[r1 + dR][c1 + dC];
            if (mid && mid.player !== p.player) return true;
        }
    }
    return false;
}

// ------------------ Make Move ------------------
function makeMove(r1, c1, r2, c2) {
    const p = board[r1][c1];
    if (Math.abs(r2 - r1) === 2) board[(r1 + r2) / 2][(c1 + c2) / 2] = null;
    board[r2][c2] = p;
    board[r1][c1] = null;

    // King promotion
    if (p.player === 'X' && r2 === 0) p.king = true;
    if (p.player === 'O' && r2 === 7) p.king = true;
}

// ------------------ Check Win ------------------
function checkWin() {
    let X = 0, O = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) p.player === 'X' ? X++ : O++;
        }
    }
    if (X === 0) return showWinner('O');
    if (O === 0) return showWinner('X');
    return false;
}

// ------------------ Show Winner ------------------
function showWinner(player) {
    gameOver = true;
    winnerEl.textContent = player + " Wins! 🎉";
    winnerEl.classList.add('show');

    // Confetti
    for (let i = 0; i < 100; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
        c.style.animationDuration = (2 + Math.random() * 3) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
}

// ------------------ Menu ------------------
menuBtn.addEventListener('click', () => {
    menuDropdown.style.display = menuDropdown.style.display === 'flex' ? 'none' : 'flex';
});
restartBtn.addEventListener('click', () => {
    initBoard();
    drawBoard();
    menuDropdown.style.display = 'none';
    if (currentPlayer === 'O') setTimeout(aiMove, 500);
});
settingsBtn.addEventListener('click', () => { window.location.href = 'set.html'; });

// ------------------ Start Game ------------------
initBoard();
drawBoard();
if (currentPlayer === 'O') setTimeout(aiMove, 500);
