document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const resetBtn = document.querySelector("#reset-button");
  const muteBtn = document.querySelector(".mute");
  const player = document.getElementById("player");
  const width = 10;
  let timerId = null;
  let score = 0;
  const colors = [
    "url(./images/block-orange.png)",
    "url(./images/block-red.png)",
    "url(./images/block-purple.png)",
    "url(./images/block-green.png)",
    "url(./images/block-blue.png)",
  ];

  // The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
  ];

  const tTetromino = [
    [width, 1, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width + 2],
    [width, width + 1, width * 2 + 1, width + 2],
    [width, 1, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation
  let nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

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
    } else if (e.keyCode === 32) {
      StartPauseBtnClick();
    }
  }

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // Freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      // Start a new tetromino falling
      currentPosition = 4;
      currentRotation = 0;
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
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
      (index) => (currentPosition + index) % width === 0
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
      (index) => (currentPosition + index) % width === width - 1
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
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
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
  /////////

  // // Rotate the tetromino
  // function rotate() {
  //   undraw();
  //   currentRotation++;
  //   if (currentRotation === current.length) {
  //     currentRotation = 0;
  //   }
  //   current = theTetrominoes[random][currentRotation];
  //   draw();
  // }

  // Show up-next tetromino in mini-grid
  const displaySquares = Array.from(
    document.querySelectorAll(".mini-grid div")
  );
  const displayWidth = 4;
  let displayIndex = 0;

  // The Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [
      displayWidth * 2,
      displayWidth * 2 + 1,
      displayWidth + 1,
      displayWidth + 2,
    ], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
  ];

  // Display the shape in the mini-grid display
  function displayShape() {
    displayShapeClear();
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundImage =
        colors[nextRandom];
    });
  }

  function displayShapeClear() {
    // Remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundImage = "none";
    });
  }

  // Add functionality to the button Start/Pause
  function StartPauseBtnClick() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener("keyup", control);
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      displayShape();
      document.addEventListener("keyup", control);
    }
  }
  startBtn.addEventListener("click", StartPauseBtnClick);

  // Add function to reset grid
  function clearGrid() {
    for (let i = 0; i < 199; i += width) {
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
  function resetBtnClick() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    score = 0;
    scoreDisplay.innerHTML = score;

    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];

    currentPosition = 4;
    currentRotation = 0;

    displayShapeClear();
    clearGrid();

    startBtn.disabled = false;
    document.addEventListener("keyup", control);

    document.getElementById("player").pause();
  }
  resetBtn.addEventListener("click", resetBtnClick);

  // Add score
  function addScore() {
    let lines = 0;
    for (let i = 0; i < 199; i += width) {
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

        const squaresRemoved = squares.splice(i, width);
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

  if (localStorage.getItem("bestScore") === null) {
    localStorage.setItem("bestScore", 0);
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

      document.getElementById("player").pause();
    }
  }

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btnRules = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btnRules.onclick = function () {
    modal.style.display = "block";
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener("keyup", control);
    }
    document.getElementById("player").pause();
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  btnRules.onclick();

  // Play music on play/pause
  startBtn.addEventListener("click", musicPlay);
  function musicPlay() {
    if (player.paused === true) {
      player.play();
    } else {
      player.pause();
    }
  }

  muteBtn.onclick = function () {
    if (muteBtn.innerHTML === "🔇") {
      muteBtn.innerHTML = "&#128266";
      player.muted = false;
    } else {
      muteBtn.innerHTML = "&#128263;";
      player.muted = true;
    }
  };
});
