document.addEventListener("DOMContentLoaded", () => {
  // Grid size
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

  // Auto-create grid
  const grid = createGrid();

  // Show up-next tetromino in mini-grid
  const displaySquares = Array.from(
    document.querySelectorAll(".mini-grid div")
  );
  const displayWidth = 4;
  let displayIndex = 0;

  // The Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // jTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, 0], // lTetromino
    [
      displayWidth * 2,
      displayWidth * 2 + 1,
      displayWidth + 1,
      displayWidth + 2,
    ], // sTetromino
    [
      displayWidth,
      displayWidth * 2 + 1,
      displayWidth + 1,
      displayWidth * 2 + 2,
    ], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
  ];

  const colors = [
    "url(./images/game/tetrominoes/block-blue.png)",
    "url(./images/game/tetrominoes/block-orange.png)",
    "url(./images/game/tetrominoes/block-green.png)",
    "url(./images/game/tetrominoes/block-red.png)",
    "url(./images/game/tetrominoes/block-purple.png)",
    "url(./images/game/tetrominoes/block-lime.png)",
    "url(./images/game/tetrominoes/block-aquamarine.png)",
  ];

  // The Tetrominoes
  const jTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
  ];

  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 0],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2],
  ];

  const sTetromino = [
    [GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
  ];

  const zTetromino = [
    [GRID_WIDTH, GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2],
  ];

  const tTetromino = [
    [GRID_WIDTH, 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH + 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH + 2],
    [GRID_WIDTH, 1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
  ];

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
  ];

  const theTetrominoes = [
    jTetromino,
    lTetromino,
    sTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  // Init html elements
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-btn");
  const resetBtn = document.querySelector("#reset-btn");
  const muteBtn = document.querySelector("#mute-btn");
  const player = document.getElementById("player");
  const speedCtrlBtns = Array.from(
    document.querySelectorAll(".btn-group-vertical input")
  );
  const rulesModalBtn = document.querySelector("#rules-modal-btn");
  const defaultSpeedBtn = document.querySelector("#default-speed-btn");
  const rulesModal = document.getElementById("rules-modal");

  let squares = Array.from(document.querySelectorAll(".grid div"));
  let timerId = null;
  let score = 0;
  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation
  let nextRandoms = [];
  nextRandoms.push(Math.floor(Math.random() * theTetrominoes.length));
  nextRandoms.push(Math.floor(Math.random() * theTetrominoes.length));
  nextRandoms.push(Math.floor(Math.random() * theTetrominoes.length));

  //let nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  let myModal = new bootstrap.Modal(rulesModal, {
    keyboard: true,
  });

  // Init EventListeners
  startBtn.addEventListener("click", startPauseGame);
  startBtn.addEventListener("click", playPauseMusic);
  document.addEventListener("keyup", function (e) {
    if (
      !rulesModal.classList.contains("show") &&
      ["Space"].indexOf(e.code) != -1
    ) {
      startBtn.click();
    }
  });
  resetBtn.addEventListener("click", resetGame);
  rulesModalBtn.addEventListener("click", rulesShow);
  speedCtrlBtns.forEach((element) => {
    element.addEventListener("click", changeSpeed);
  });
  muteBtn.addEventListener("click", muteUnmuteMusic);
  window.addEventListener(
    "keydown",
    function (e) {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
    },
    false
  );

  initLocalStorage();
  rulesShow();

  function createGrid() {
    // Main grid
    let grid = document.querySelector(".grid");
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div");
      grid.appendChild(gridElement);
    }

    // Base of grid
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div");
      gridElement.setAttribute("class", "taken");
      grid.appendChild(gridElement);
    }

    // Display grid
    let miniGrids = Array.from(document.querySelectorAll(".mini-grid"));

    let miniGrid = miniGrids[0];
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div");
      miniGrid.appendChild(gridElement);
    }
    miniGrid = miniGrids[1];
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div");
      miniGrid.appendChild(gridElement);
    }
    miniGrid = miniGrids[2];
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div");
      miniGrid.appendChild(gridElement);
    }

    return grid;
  }

  // Draw the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundImage = colors[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundImage = "none";
    });
  }

  // Assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  function moveDown() {
    undraw();
    currentPosition += GRID_WIDTH;
    draw();
    freeze();
  }

  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + GRID_WIDTH].classList.contains(
          "taken"
        )
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      // Start a new tetromino falling
      currentPosition = 4;
      currentRotation = 0;
      random = nextRandoms[0];
      nextRandoms[0] = nextRandoms[1];
      nextRandoms[1] = nextRandoms[2];
      nextRandoms[2] = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      displayShape();
      addScore();
      gameOver();
    }
  }

  // Move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % GRID_WIDTH === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }

  // Move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some(
      (index) => (currentPosition + index + 1) % GRID_WIDTH === 0
    );
  }

  function isAtLeft() {
    return current.some(
      (index) => (currentPosition + index) % GRID_WIDTH === 0
    );
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % GRID_WIDTH < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % GRID_WIDTH > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }

  // Display the shape in the mini-grid display
  function displayShape() {
    displayShapeClear();
    for (let i = 0; i < nextRandoms.length; i++) {
      upNextTetrominoes[nextRandoms[i]].forEach((index) => {
        displaySquares[displayIndex + index].classList.add("tetromino");
        displaySquares[displayIndex + index].style.backgroundImage =
          colors[nextRandoms[i]];
      });
      displayIndex += 16;
    }
    displayIndex = 0;
  }

  function displayShapeClear() {
    // Remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundImage = "none";
    });
  }

  // Add functionality to the button Start/Pause
  function startPauseGame() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener("keyup", control);
      startBtn.innerHTML =
        '<img src="./images/controls/play.png" alt="play/pause">';
    } else {
      draw();
      timerId = setInterval(moveDown, 1000 / getCurrentSpeed());
      displayShape();
      document.addEventListener("keyup", control);
      startBtn.innerHTML =
        '<img src="./images/controls/pause.png" alt="play/pause">';
    }
    this.blur();
  }

  // Add function to reset grid
  function clearGrid() {
    for (let i = 0; i < 199; i += GRID_WIDTH) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("tetromino");
        squares[index].style.backgroundColor = "";
        squares[index].style.backgroundImage = "none";
      });
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }

  // Add functionality to the button Reset
  function resetGame() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    startBtn.innerHTML =
      '<img src="./images/controls/play.png" alt="play/pause">';
    speedCtrlBtns.forEach((element) => {
      element.checked = false;
    });
    defaultSpeedBtn.checked = true;

    score = 0;
    scoreDisplay.innerHTML = score;

    // nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    random = Math.floor(Math.random() * theTetrominoes.length);
    nextRandoms[0] = Math.floor(Math.random() * theTetrominoes.length);
    nextRandoms[1] = Math.floor(Math.random() * theTetrominoes.length);
    nextRandoms[2] = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];

    currentPosition = 4;
    currentRotation = 0;

    displayShapeClear();
    clearGrid();

    startBtn.disabled = false;
    document.addEventListener("keyup", control);

    player.pause();

    this.blur();
  }

  // Add score
  function addScore() {
    let lines = 0;
    for (let i = 0; i < 199; i += GRID_WIDTH) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
          squares[index].style.backgroundImage = "none";
        });

        const squaresRemoved = squares.splice(i, GRID_WIDTH);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));

        lines++;
      }
    }

    score += lines * 100;
    if (lines === 4) {
      score += 400;
    }
    scoreDisplay.innerHTML = score;

    draw();
  }

  function initLocalStorage() {
    if (localStorage.getItem("bestScore") === null) {
      localStorage.setItem("bestScore", 0);
    }
  }

  // Game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      let bestScore = localStorage.getItem("bestScore");
      if (bestScore < score) {
        alert("Congratulations! New best: " + score + " pts.");
        localStorage.setItem("bestScore", score);
      } else {
        alert("Game over! Your score: " + score + " pts.");
      }
      score = 0;

      clearInterval(timerId);
      document.removeEventListener("keyup", control);
      startBtn.disabled = true;

      player.pause();
    }
  }

  function rulesShow() {
    if (timerId) {
      startPauseGame();
      playPauseMusic();
    }
    this.blur();
    myModal.show();
  }

  // Play music on play/pause
  function playPauseMusic() {
    if (player.paused === true) {
      player.play();
    } else {
      player.pause();
    }
  }

  function muteUnmuteMusic() {
    if (
      muteBtn.innerHTML ===
      '<img src="./images/controls/mute.png" alt="volume/mute">'
    ) {
      muteBtn.innerHTML =
        '<img src="./images/controls/volume.png" alt="volume/mute">';
      player.muted = false;
    } else {
      muteBtn.innerHTML =
        '<img src="./images/controls/mute.png" alt="volume/mute">';
      player.muted = true;
    }
    this.blur();
  }

  function changeSpeed() {
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(moveDown, 1000 / getCurrentSpeed());
    }
    this.blur();
  }

  function getCurrentSpeed() {
    for (let element = 0; element < speedCtrlBtns.length; element++) {
      if (speedCtrlBtns[element].checked) {
        return speedCtrlBtns[element].value;
      }
    }
  }
});
