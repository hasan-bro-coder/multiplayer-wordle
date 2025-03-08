import { words, checkWord } from "./words";

let buttons: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll(".keyboard .key");
let wordle: Array<Array<HTMLDivElement>> = Array.from(
  document.querySelectorAll(".wordle .row")
).map((el) => Array.from(el.querySelectorAll(".col")));
const state: HTMLHeadingElement | null = document.querySelector(".state");
const gameOverDialog: HTMLDialogElement | null =
  document.querySelector("#game-over");
const gameOverTitle: HTMLHeadingElement | null =
  document.querySelector("#game-over-title");
const gameOverMessage: HTMLParagraphElement | null =
  document.querySelector("#game-over-message");
const playAgainButton: HTMLButtonElement | null =
  document.querySelector("#play-again");

let currentRow: number = 1;
let currentLetter: number = 1;
let word = "";
let mainword = words[Math.floor(Math.random() * words.length)];

function press(key: string): void {
  console.log(currentLetter, key);

  if (key == "Enter") {
    console.log(word, checkWord(word));
    if (checkWord(word)) {
      for (let i = 0; i < 5; i++) {
        let color: string =
          mainword[i] == word[i]
            ? "green"
            : mainword.includes(word[i])
            ? "yellow"
            : "gray";

        wordle[currentRow - 1][i].style.color = color;
        wordle[currentRow - 1][i].style.borderColor = color;
        let key: HTMLDivElement | null = document.querySelector(
          ".key#" + word[i].toLowerCase()
        );
        if (key && key.style.color != "green") {
          key.style.color = color;
          key.style.outlineColor = color;
        }
      }
      currentRow++;
      currentLetter = 1;
      if (mainword == word) {
        console.log("win");

        if (!(gameOverDialog && gameOverTitle && gameOverMessage)) {
          alert(
            "Congratulations! You've guessed the word correctly! (" +
              mainword +
              ")"
          );
        } else {
          setTimeout(() => {
            gameOverTitle.innerText = "Congratulations!";
            gameOverMessage.innerText =
              "You've guessed the word correctly! (" + mainword + ")";
            console.log(gameOverDialog);
            gameOverDialog.showModal();

            if (playAgainButton) {
              playAgainButton.onclick = () => {
                gameOverDialog.close();
                location.reload(); // Restart the game by reloading the page
              };
            }
          }, 200);
        }
      } else if (currentRow > 6) {
        if (!(gameOverDialog && gameOverTitle && gameOverMessage)) {
          alert("YOU lost lil nigge this was the word: (" + mainword + ")");
        } else {
          setTimeout(() => {
            gameOverTitle.innerText = "YOU lost lil nigge";
            gameOverMessage.innerText = "this was the word: (" + mainword + ")";
            gameOverDialog.showModal();
            if (playAgainButton) {
              playAgainButton.onclick = () => {
                gameOverDialog.close();
                location.reload(); // Restart the game by reloading the page
              };
            }
          }, 200);
        }
      }
      word = "";
    }
  } else if (key == "Backspace") {
    if (
      currentLetter == 5 &&
      wordle[currentRow - 1][currentLetter - 1].innerText != ""
    ) {
      wordle[currentRow - 1][currentLetter - 1].innerText = "";
      word = word.slice(0, -1);
      return;
    } else if (currentLetter == 1) {
      wordle[currentRow - 1][currentLetter - 1].innerText = "";
      word = "";
      return;
    }
    wordle[currentRow - 1][currentLetter - 2].innerText = "";
    word = word.slice(0, -1);
    currentLetter--;
  } else {
    if (
      currentLetter > 5 ||
      wordle[currentRow - 1][currentLetter - 1].innerText != ""
    ) {
      return;
    }
    wordle[currentRow - 1][currentLetter - 1].innerText = key.toUpperCase();
    word += key;
    if (currentLetter != 5) {
      currentLetter++;
    } else {
      if (state) {
        let isWord = checkWord(word)
        state.innerText = isWord ? "valid word" : word == "mahir" ? "INAVALID AS FUCK" :"invalid word";
        state.style.color = isWord ? "green" : "red";

      }
    }
  }
}

// function checkWord(word: string): boolean {
//   return words.includes(word);
// }

// ---events----

buttons.forEach((el, _i) => {
  el.onclick = () => {
    el.style.scale = "0.8";
  };

  el.onmouseup = () => {
    el.style.scale = "1";
  };
  el.onmouseleave = () => {
    el.style.scale = "1";
  };
  el.onclick = (el) => {
    press((el?.target as HTMLButtonElement)?.id);
  };
});

document.addEventListener("keydown", (e) => {
  if (/^[a-z]$/.test(e.key) || e.key == "Enter" || e.key == "Backspace") {
    press(e.key);
  }
});
