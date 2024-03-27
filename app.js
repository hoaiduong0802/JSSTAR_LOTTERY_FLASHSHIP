const boardContainer = document.getElementById("lotto-board");
const newBoardBtn = document.getElementById("newBoardBtn");
const randomNumberBtn = document.getElementById("randomNumberBtn");
const startGameBtn = document.getElementById("startGameBtn");
const restartGameBtn = document.getElementById("restartGameBtn");
const randomNumberOutput = document.getElementById("randomNumberOutput");
const betAmountInput = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBetBtn");
const userBalanceDisplay = document.getElementById("userBalance");
let numbers = [];
let intervalId;
let userBalance = 100; // Số dư ban đầu
let currentBetAmount = 1; // Số tiền cược ban đầu
let isGameOver = false; // Trạng thái kết thúc trò chơi

createNewBoard();

function createNewBoard() {
  if (!isGameOver) {
    // Chỉ đặt lại số dư khi không phải là lần chơi mới
    userBalance = 100;
    updateBalanceUI();
  }

  boardContainer.innerHTML = "";
  randomNumberOutput.textContent = "";
  restartGameBtn.style.display = "block";

  numbers = generateUniqueRandomNumbers(5 * 9, 0, 99);

  for (let i = 0; i < 9; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    for (let j = 0; j < 5; j++) {
      const numberDiv = document.createElement("div");
      numberDiv.classList.add("column");
      numberDiv.textContent = numbers[i * 5 + j];
      rowDiv.appendChild(numberDiv);
    }
    boardContainer.appendChild(rowDiv);
  }
}

function generateUniqueRandomNumbers(count, min, max) {
    const numbers = [];
    const availableNumbers = Array.from({ length: max - min + 1 }, (_, index) => index + min);
    
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const randomNumber = availableNumbers[randomIndex];
        numbers.push(randomNumber);
        availableNumbers.splice(randomIndex, 1);
    }
    
    return numbers;
}


function generateRandomNumber() {
  const randomNum = Math.floor(Math.random() * 100);
  const numberDivs = document.querySelectorAll(".column");
  let isDuplicate = false;
  for (const numberDiv of numberDivs) {
    const currentNum = parseInt(numberDiv.textContent);
    if (currentNum === randomNum) {
      isDuplicate = true;
      break;
    }
  }

  randomNumberOutput.textContent = `Số ngẫu nhiên: ${randomNum}`;

  if (isDuplicate) {
    markNumberOnBoard(randomNum);
  }
}

function markNumberOnBoard(num) {
  const numberDivs = document.querySelectorAll(".column");
  for (const numberDiv of numberDivs) {
    const currentNum = parseInt(numberDiv.textContent);
    if (currentNum === num) {
      numberDiv.style.backgroundColor = "red";
    }
  }

  if (checkForWinner()) {
    userBalance += currentBetAmount * 2;
    updateBalanceUI();
    alert(`Chúc mừng! Bạn đã chiến thắng! Số dư mới: ${userBalance} đồng`);

    // Đặt trạng thái kết thúc trò chơi
    isGameOver = true;

    // Hiển thị nút "Chơi lại"
    restartGameBtn.style.display = "inline-block";

    stopGame();
  } else {
    if (userBalance === 0) {
      alert("Rất tiếc, bạn đã hết tiền cược. Chơi lại để tiếp tục!");

      // Đặt trạng thái kết thúc trò chơi
      isGameOver = true;

      // Hiển thị nút "Chơi lại"
      restartGameBtn.style.display = "inline-block";

      stopGame();
    }
  }
}

function checkForWinner() {
  const rows = document.querySelectorAll(".row");
  for (const row of rows) {
    const redCount = countConsecutiveRedNumbers(row);
    if (redCount >= 5) {
      return true;
    }
  }
  return false;
}

function countConsecutiveRedNumbers(row) {
  let consecutiveCount = 0;
  for (const numberDiv of row.children) {
    if (numberDiv.style.backgroundColor === "red") {
      consecutiveCount++;
      if (consecutiveCount >= 5) {
        break;
      }
    } else {
      consecutiveCount = 0;
    }
  }
  return consecutiveCount;
}

function startGame() {
  // Đặt lại trạng thái của trò chơi
  isGameOver = false;

  // Ẩn nút "Chơi lại"
  restartGameBtn.style.display = "none";

  // Đặt lại bảng và các giá trị liên quan
  createNewBoard();

  // startGeneratingRandomNumbers();
  startGameBtn.style.display = "none";
  restartGameBtn.style.display = "inline-block";
}

function stopGame() {
  stopGeneratingRandomNumbers();
  startGameBtn.style.display = "inline-block";
}

function restartGame() {
  // Đặt lại trạng thái của trò chơi
  isGameOver = false;

  // Ẩn nút "Chơi lại"
  restartGameBtn.style.display = "none";

  // Đặt lại bảng và các giá trị liên quan
  createNewBoard();

  // Bắt đầu trò chơi lại
  // startGame();
}

function startGeneratingRandomNumbers() {
  intervalId = setInterval(generateRandomNumber, 50);
}

function stopGeneratingRandomNumbers() {
  clearInterval(intervalId);
}

function placeBet() {
  currentBetAmount = parseInt(betAmountInput.value);
  if (currentBetAmount <= userBalance) {
    userBalance -= currentBetAmount;
    updateBalanceUI();
    alert(`Bạn đã đặt cược ${currentBetAmount} đồng.`);
  } else {
    alert("Số dư không đủ để đặt cược.");
  }
}

function updateBalanceUI() {
  userBalanceDisplay.textContent = `Số dư: ${userBalance} đồng`;
}

function chooseNumberOfTickets() {
  const numberOfTicketsInput = document.getElementById("numberOfTickets");
  const numberOfTickets = parseInt(numberOfTicketsInput.value);
  if (numberOfTickets >= 1) {
    createNewBoard(numberOfTickets);
  } else {
    alert("Vui lòng nhập một số tờ hợp lệ.");
  }
}

function createNewBoard(numberOfTickets) {
  if (!isGameOver) {
    // Chỉ đặt lại số dư khi không phải là lần chơi mới
    userBalance = 100;
    updateBalanceUI();
  }

  boardContainer.innerHTML = "";
  randomNumberOutput.textContent = "";
  restartGameBtn.style.display = "block";

  for (let ticket = 0; ticket < numberOfTickets; ticket++) {
    const numbers = generateUniqueRandomNumbers(5 * 9, 0, 99);
    const ticketDiv = document.createElement("div");
    ticketDiv.classList.add(`Item-${ticket}`);

    for (let i = 0; i < 9; i++) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (let j = 0; j < 5; j++) {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("column");
        numberDiv.textContent = numbers[i * 5 + j];
        rowDiv.appendChild(numberDiv);
      }
      ticketDiv.appendChild(rowDiv);
    }
    boardContainer.appendChild(ticketDiv);
  }
}
