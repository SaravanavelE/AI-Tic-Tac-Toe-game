let board = ["", "", "", "", "", "", "", "", ""];
let isGameOver = false;
const boardDiv = document.getElementById("board");
const statusDiv = document.getElementById("status");

function renderBoard() {
  boardDiv.innerHTML = "";
  board.forEach((cell, i) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    cellDiv.innerText = cell;
    cellDiv.addEventListener("click", () => handleMove(i));
    boardDiv.appendChild(cellDiv);
  });
}

function handleMove(index) {
  if (board[index] !== "" || isGameOver) return;
  board[index] = "X";
  updateGame();
  if (!isGameOver) setTimeout(aiMove, 300);
}

function aiMove() {
  let move = getBestMove();
  if (move !== -1) board[move] = "O";
  updateGame();
}

function getBestMove() {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) return result === "O" ? 1 : result === "X" ? -1 : 0;
  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function checkWinner() {
  const winLines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let line of winLines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.includes("") ? null : "Draw";
}

function updateGame() {
    renderBoard();
    let result = checkWinner();
    if (result) {
      statusDiv.innerText = result === "Draw" ? "It's a draw!" : `${result} wins!`;
      isGameOver = true;
      updateLeaderboard(result === "Draw" ? "Draw" : result);
    }
  }
  

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameOver = false;
  statusDiv.innerText = "Your turn (You = X)";
  renderBoard();
}
function updateLeaderboard(winner) {
    let xWins = parseInt(localStorage.getItem("xWins")) || 0;
    let oWins = parseInt(localStorage.getItem("oWins")) || 0;
    let draws = parseInt(localStorage.getItem("draws")) || 0;
  
    if (winner === "X") xWins++;
    else if (winner === "O") oWins++;
    else if (winner === "Draw") draws++;
  
    localStorage.setItem("xWins", xWins);
    localStorage.setItem("oWins", oWins);
    localStorage.setItem("draws", draws);
  
    document.getElementById("xWins").innerText = xWins;
    document.getElementById("oWins").innerText = oWins;
    document.getElementById("draws").innerText = draws;
  }
  
  function loadLeaderboard() {
    document.getElementById("xWins").innerText = localStorage.getItem("xWins") || 0;
    document.getElementById("oWins").innerText = localStorage.getItem("oWins") || 0;
    document.getElementById("draws").innerText = localStorage.getItem("draws") || 0;
  }
  
renderBoard();
renderBoard();
loadLeaderboard();

