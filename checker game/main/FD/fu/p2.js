const boardEl=document.getElementById('board');
const winnerEl=document.getElementById('winner');
const menuBtn=document.getElementById('menuBtn');
const menuDropdown=document.getElementById('menuDropdown');
const restartBtn=document.getElementById('restartBtn');
const settingsBtn=document.getElementById('settingsBtn');

let board=[];
let currentPlayer='X'; // X human, O AI
let selected=null;
let mustContinueCapture=false;
let gameOver=false;

function initBoard(){
    board=[];
    for(let r=0;r<8;r++){
        board[r]=[];
        for(let c=0;c<8;c++){
            if((r+c)%2!==0 && r<3) board[r][c]={player:'O',king:false};
            else if((r+c)%2!==0 && r>4) board[r][c]={player:'X',king:false};
            else board[r][c]=null;
        }
    }
    currentPlayer='X';
    selected=null;
    mustContinueCapture=false;
    gameOver=false;
    winnerEl.classList.remove('show');
}

function updateCards(){
    let Xnormal=0,Xking=0,Onormal=0,Oking=0;

    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            let p=board[r][c];
            if(p){
                if(p.player==='X'){
                    p.king?Xking++:Xnormal++;
                }else{
                    p.king?Oking++:Onormal++;
                }
            }
        }
    }

    document.getElementById('X-normal').textContent=Xnormal;
    document.getElementById('X-king').textContent=Xking;
    document.getElementById('O-normal').textContent=Onormal;
    document.getElementById('O-king').textContent=Oking;
}

function drawBoard(){
    boardEl.innerHTML='';

    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            const cell=document.createElement('div');
            cell.className='cell '+((r+c)%2===0?'white':'black');

            const pieceObj=board[r][c];

            if(pieceObj){
                const piece=document.createElement('div');
                piece.className='piece '+pieceObj.player;

                if(pieceObj.king){
                    piece.classList.add('king');
                    const img=document.createElement('img');

                    img.src = pieceObj.player==='O'
                        ? 'https://i.pinimg.com/736x/65/41/00/654100d3a9cf91320485029f6840aa02.jpg'
                        : 'https://i.pinimg.com/736x/69/fd/03/69fd03bc1a065d2a18a31933fc9c53a8.jpg';

                    piece.appendChild(img);
                }

                if(selected && selected.row===r && selected.col===c){
                    piece.classList.add('selected');
                }

                cell.appendChild(piece);

            }else if(selected && isValidMove(selected.row,selected.col,r,c)){
                cell.classList.add('highlight');
            }

            cell.addEventListener('click',()=>handleClick(r,c));
            boardEl.appendChild(cell);
        }
    }

    updateCards();
}

// ------------------ AI Logic for Player O ---------------------
function aiMove(){
    if(gameOver || currentPlayer!=='O') return;

    let moves=[];
    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            const p = board[r][c];
            if(p && p.player==='O'){
                for(let tr=0;tr<8;tr++){
                    for(let tc=0;tc<8;tc++){
                        if(isValidMove(r,c,tr,tc)){
                            const captured = Math.abs(tr-r)===2;
                            moves.push({fr:r,fc:c,tr,tc,captured});
                        }
                    }
                }
            }
        }
    }

    if(moves.length===0) return;

    moves.sort((a,b)=>b.captured-a.captured); // capture prioritize
    const move = moves[0];
    const captured = makeMove(move.fr,move.fc,move.tr,move.tc);

    if(captured && hasCapture(move.tr,move.tc,board[move.tr][move.tc].king)){
        setTimeout(()=>aiMove(),200);
    }else{
        currentPlayer='X';
        drawBoard();
    }
}

// ------------------ Human Player Logic for X ---------------------
function handleClick(r,c){
    if(gameOver || currentPlayer!=='X') return;

    const cellPiece=board[r][c];

    if(selected){
        if(isValidMove(selected.row,selected.col,r,c)){
            const captured=makeMove(selected.row,selected.col,r,c);

            if(captured && hasCapture(r,c,board[r][c].king)){
                selected={row:r,col:c};
                mustContinueCapture=true;
            }else{
                selected=null;
                mustContinueCapture=false;
                if(!checkWin()){
                    currentPlayer='O';
                    setTimeout(()=>aiMove(),500);
                }
            }
        }else{
            selected=null;
        }
    }else if(cellPiece && cellPiece.player===currentPlayer){
        selected={row:r,col:c};
    }

    drawBoard();
}

// ------------------ Remaining Game Logic ---------------------
function isValidMove(fr,fc,tr,tc){
    const piece=board[fr][fc];
    if(!piece || board[tr][tc]) return false;

    const dr=tr-fr;
    const dc=tc-fc;

    let directions = piece.king
        ? [[1,1],[1,-1],[-1,1],[-1,-1]]
        : piece.player==='X'
        ? [[-1,1],[-1,-1]]
        : [[1,1],[1,-1]];

    for(const [dR,dC] of directions){
        if(dr===dR && dc===dC && !mustContinueCapture) return true;
        if(dr===2*dR && dc===2*dC){
            const mid=board[fr+dR][fc+dC];
            if(mid && mid.player!==piece.player) return true;
        }
    }

    return false;
}

function makeMove(fr,fc,tr,tc){
    const piece=board[fr][fc];
    let captured=false;

    if(Math.abs(tr-fr)===2){
        board[(fr+tr)/2][(fc+tc)/2]=null;
        captured=true;
    }

    board[tr][tc]=piece;
    board[fr][fc]=null;

    if(piece.player==='X' && tr===0) piece.king=true;
    if(piece.player==='O' && tr===7) piece.king=true;

    return captured;
}

function hasCapture(r,c,isKing){
    const piece=board[r][c];
    const directions=isKing?[[2,2],[2,-2],[-2,2],[-2,-2]]
        : piece.player==='X'?[[-2,2],[-2,-2]]:[[2,2],[2,-2]];

    for(const [dR,dC] of directions){
        const tr=r+dR, tc=c+dC;
        if(tr<0||tr>7||tc<0||tc>7) continue;

        const mid=board[r+dR/2][c+dC/2];
        if(board[tr][tc]===null && mid && mid.player!==piece.player) return true;
    }
    return false;
}

function showWinner(player){
    gameOver=true;
    winnerEl.textContent=player+" Wins! 🎉";
    winnerEl.classList.add('show');

    for(let i=0;i<100;i++){
        const c=document.createElement('div');
        c.className='confetti';
        c.style.left=Math.random()*100+'vw';
        c.style.background=`hsl(${Math.random()*360},100%,50%)`;
        c.style.animationDuration=(2+Math.random()*3)+'s';
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),4000);
    }
}

function checkWin(){
    let X=0,O=0;

    for(let row of board){
        for(let p of row){
            if(p) p.player==='X'?X++:O++;
        }
    }

    if(X===0){ showWinner("O"); return true; }
    if(O===0){ showWinner("X"); return true; }

    return false;
}

// ------------------ Menu ---------------------
menuBtn.addEventListener('click',()=>{
    menuDropdown.style.display = menuDropdown.style.display==='flex'?'none':'flex';
});

restartBtn.addEventListener('click',()=>{
    initBoard();
    drawBoard();
    menuDropdown.style.display='none';
    if(currentPlayer==='O') setTimeout(()=>aiMove(),500);
});

settingsBtn.addEventListener('click',()=>{
    window.location.href='set.html';
});

// ------------------ Initialize ---------------------
initBoard();
drawBoard();
if(currentPlayer==='O') setTimeout(()=>aiMove(),500);
