class Sudoku {
  constructor() {
    this.rowSet = new Map();
    this.colSet = new Map();
    this.rcSet = new Map();
    this.red = new Set();
    this.ready = new Set();
    this.board = [];
    this.time = "";
    for (let r = 0; r < 9; r++) {
      this.board[r] = [];
      for (let c = 0; c < 9; c++) {
        this.board[r][c] = "";
      }
    }
  }

  isAvail(row, col, value) {
    if (!this.rowSet.has(row)) {
      this.rowSet.set(row, new Set());
    }

    if (!this.colSet.has(col)) {
      this.colSet.set(col, new Set());
    }

    const rcKey = `${Math.floor(row / 3)}-${Math.floor(col / 3)}`;
    if (!this.rcSet.has(rcKey)) {
      this.rcSet.set(rcKey, new Set());
    }
    return (
      !this.rowSet.get(row).has(value) &&
      !this.colSet.get(col).has(value) &&
      !this.rcSet
        .get(`${Math.floor(row / 3)}-${Math.floor(col / 3)}`)
        .has(value)
    );
  }

  async checkAnswer() {
    let rowSet = new Map(this.rowSet);
    let colSet = new Map(this.colSet);
    let rcSet = new Map(this.rcSet);

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const button = document.getElementById(`text-${r}-${c}`);
        const button_value = button.value;
        if (
          (rowSet.has(r) && rowSet.get(r).has(button_value)) ||
          (rowSet.has(c) && colSet.get(c).has(button_value)) ||
          (rcSet.has(`${Math.floor(r / 3)}-${Math.floor(c / 3)}`) &&
            rcSet
              .get(`${Math.floor(r / 3)}-${Math.floor(c / 3)}`)
              .has(button_value)) ||
          button_value === ""
        ) {
          alert("Fail");
          return false;
        }
        if (!rowSet.has(r)) {
          rowSet.set(r, new Set());
        }
        rowSet.get(r).add(button_value);

        if (!colSet.has(c)) {
          colSet.set(c, new Set());
        }
        colSet.get(c).add(button_value);

        const rcKey = `${Math.floor(r / 3)}-${Math.floor(c / 3)}`;
        if (!rcSet.has(rcKey)) {
          rcSet.set(rcKey, new Set());
        }
        rcSet.get(rcKey).add(button_value);
      }
    }
    alert(
      "Solved with time of " + document.getElementById("timer").textContent
    );
    return true;
  }

  addValue(row, col, value) {
    if (!this.rowSet.has(row)) {
      this.rowSet.set(row, new Set());
    }
    this.rowSet.get(row).add(value);

    if (!this.colSet.has(col)) {
      this.colSet.set(col, new Set());
    }
    this.colSet.get(col).add(value);

    const rcKey = `${Math.floor(row / 3)}-${Math.floor(col / 3)}`;
    if (!this.rcSet.has(rcKey)) {
      this.rcSet.set(rcKey, new Set());
    }
    this.rcSet.get(rcKey).add(value);
  }

  removeValue(row, col, value) {
    this.rowSet.get(row).delete(value);
    this.colSet.get(col).delete(value);
    const rcKey = `${Math.floor(row / 3)}-${Math.floor(col / 3)}`;
    this.rcSet.get(rcKey).delete(value);
  }

  dfs(row, col) {
    if (row === this.board.length) {
      return true;
    }
    if (col === this.board[0].length) {
      return this.dfs(row + 1, 0);
    }
    let row_array = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    row_array.sort((a, b) => 0.5 - Math.random());
    if (this.board[row][col] === "") {
      for (let i = 0; i < 8; i++) {
        const strI = row_array[i];
        if (this.isAvail(row, col, strI)) {
          this.addValue(row, col, strI);
          this.board[row][col] = strI;
          if (this.dfs(row, col + 1)) {
            return true;
          }
          this.removeValue(row, col, strI);
          this.board[row][col] = "";
        }
      }
    } else {
      return this.dfs(row, col + 1);
    }
  }

  write(first_button, second_button) {
    const button = document.getElementById(second_button);
    const buttonValue = button.value;
    const myButton = document.getElementById(first_button);
    myButton.value = buttonValue;
  }

  show() {
    while (this.ready.size !== 60) {
      let r = Math.floor(Math.random() * 9);
      let c = Math.floor(Math.random() * 9);
      const buttonId = `text-${r}-${c}`;
      const myButton = document.getElementById(buttonId);
      myButton.value = this.board[r][c];
      this.ready.add(`${r}-${c}`);
      myButton.style.backgroundColor = "lightgray";
      document.getElementById(`text-${r}-${c}`).disabled = true;
    }
  }

  read() {
    this.rowSet = new Map();
    this.colSet = new Map();
    this.rcSet = new Map();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const buttonId = `text-${r}-${c}`;
        const myButton = document.getElementById(buttonId);
        this.board[r][c] = myButton.value;
        this.addValue(r, c, this.board[r][c]);
      }
    }
  }
}

const sudoku = new Sudoku();

function startOver() {
  location.reload();
}

let clickCount = 0;
let firstElementId = null;
let secondElementId = null;

function handleClick(button) {
  const clickedElementId = button.id;
  if (clickCount === 0 && button.type === "text") {
    firstElementId = clickedElementId;
    clickCount++;
  } else if (clickCount === 1 && button.type === "button") {
    secondElementId = clickedElementId;
    clickCount = 0;
    sudoku.write(firstElementId, secondElementId);
  } else {
    firstElementId = clickedElementId;
  }
}

setInterval(myTimer, 1000);

var ss = 0;
function myTimer() {
  ss++;
  let mm = Math.floor(ss / 60);
  let hh = Math.floor(mm / 60);
  sudoku.time = "" + (hh % 60) + " : " + (mm % 60) + " : " + (ss % 60);
  document.getElementById("timer").innerHTML = sudoku.time;
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("solve")
    .addEventListener("click", sudoku.checkAnswer);
  document.getElementById("startOver").addEventListener("click", startOver);

  const first_button = document.querySelectorAll("input[type='text']");
  first_button.forEach((button) => {
    button.addEventListener("click", () => handleClick(button));
  });

  const second_button = document.querySelectorAll("input[type='button']");
  second_button.forEach((button) => {
    button.addEventListener("click", () => handleClick(button));
  });
  sudoku.dfs(0, 0);
  sudoku.show();
  sudoku.read();
});
