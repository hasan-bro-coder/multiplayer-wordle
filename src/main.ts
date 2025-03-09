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
const closeButton: HTMLButtonElement | null =
  document.querySelector("#close-it");
const giveupButton: HTMLButtonElement | null =
  document.querySelector("#give-up");

let currentRow: number = 1;
let currentLetter: number = 1;
let word = "";

const installButton: HTMLButtonElement | null =
  document.querySelector("#install");

import("./words").then(async ({ words, checkWord }) => {
  // Use the words and checkWord functions here
  let mainword = words[Math.floor(Math.random() * words.length)];
  console.log(mainword);

  let anime = (await import("animejs")).default;
  async function press(key: string): Promise<void> {
    if (key == "Enter") {
      if (checkWord(word)) {
        anime({
          targets: wordle[currentRow - 1],
          // translateX: 270,
          rotateX: 360,
          easing: "easeInOutSine",
          duration: 700,
          delay: anime.stagger(700 / 5),
        });
        let keys: Array<HTMLButtonElement> = [];
        for (let i = 0; i < 5; i++) {
          let color: string =
            mainword[i] == word[i]
              ? "#79b851"
              : mainword.includes(word[i])
              ? "#f3c237"
              : "rgb(61 66 77)";

          // wordle[currentRow - 1][i].style.color = color;
          wordle[currentRow - 1][i].style.backgroundColor = color;

          // wordle[currentRow - 1][i].style.borderColor = color;
          let key: HTMLButtonElement | null = document.querySelector(
            ".key#" + word[i].toLowerCase()
          );
          if (key && key.style.color != "green") {
            // key.style.color = color;
            key.style.backgroundColor = color;

            keys.push(key);
            // key.style.outlineColor = color;
          }
        }
        anime({
          targets: keys,
          translateY: -10,
          rotate: 10,
          direction: "alternate",
          // easing: "easeInOutSine",
          duration: 400,
          delay: anime.stagger(100),
          // complete: () => resolve()
        });
        currentRow++;
        currentLetter = 1;
        if (mainword == word) {
          anime({
            targets: wordle.flat(),
            scale: [
              { value: 0.1, easing: "easeOutSine", duration: 500 },
              { value: 1, easing: "easeInOutQuad", duration: 1200 },
            ],
            delay: anime.stagger(200, { grid: [5, 6], from: "center" }),
          });
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
              gameOverDialog.showModal();

              if (playAgainButton && closeButton) {
                playAgainButton.onclick = () => {
                  gameOverDialog.close();
                  location.reload(); // Restart the game by reloading the page
                };
                closeButton.onclick = () => {
                  gameOverDialog.close();
                };
              }
            }, 2000);
          }
        } else if (currentRow > 6) {
          if (!(gameOverDialog && gameOverTitle && gameOverMessage)) {
            alert("YOU lost lil nigge this was the word: (" + mainword + ")");
          } else {
            setTimeout(() => {
              gameOverTitle.innerText = "YOU lost lil nigge";
              gameOverMessage.innerText =
                "this was the word: (" + mainword + ")";
              gameOverDialog.showModal();
              if (playAgainButton && closeButton) {
                playAgainButton.onclick = () => {
                  gameOverDialog.close();
                  location.reload(); // Restart the game by reloading the page
                };
                closeButton.onclick = () => {
                  gameOverDialog.close();
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
        wordle[currentRow - 1][currentLetter - 1].style.transform =
          "scale(0.8)";
        anime({
          targets: wordle[currentRow - 1][currentLetter - 1],
          scale: 1,
          duration: 600,
        });
        word = word.slice(0, -1);
        if(state){
          state.innerText = "guess the word";
          state.style.color = "white"
        }
        return;
      } else if (currentLetter == 1) {
        wordle[currentRow - 1][currentLetter - 1].innerText = "";
        wordle[currentRow - 1][currentLetter - 1].style.transform =
          "scale(0.8)";
        anime({
          targets: wordle[currentRow - 1][currentLetter - 1],
          scale: 1,
          duration: 600,
        });
        word = "";
        return;
      }
      wordle[currentRow - 1][currentLetter - 2].innerText = "";
      wordle[currentRow - 1][currentLetter - 1].style.transform = "scale(0.8)";
      anime({
        targets: wordle[currentRow - 1][currentLetter - 1],
        scale: 1,
        duration: 600,
      });
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
      wordle[currentRow - 1][currentLetter - 1].style.transform = "scale(1.2)";
      anime({
        targets: wordle[currentRow - 1][currentLetter - 1],
        scale: 1,
        duration: 600,
      });
      // wordle[currentRow - 1][currentLetter - 1]
      word += key;
      if (currentLetter != 5) { 
        currentLetter++;
      }
    }
    if (state) {
      console.log(word,word.length);
      if (word.length == 5){
        let isWord = checkWord(word);
        state.innerText = isWord
        ? "valid word"
        : word == "mahir"
        ? "INAVALID AS FUCK"
        : "invalid word";
        state.style.color = isWord ? "#79b851" : "#f33737";
      }else{
        state.innerText = "guess the word";
        state.style.color = "white";
      }
    }
  }

  buttons.forEach((el, _i) => {
    el.onclick = (el) => {
      anime({
        targets: el?.target,
        scale: [{ value: 0.5 }, { value: 1 }],
        duration: 200,
        easing: "easeInOutQuad",
      });
      press((el?.target as HTMLButtonElement)?.id);
    };
  });

  document.addEventListener("keydown", (e) => {
    if (/^[a-z]$/.test(e.key) || e.key == "Enter" || e.key == "Backspace") {
      press(e.key);
    }
  });

  if (giveupButton)
    giveupButton.onclick = () => {
      if (!(gameOverDialog && gameOverTitle && gameOverMessage)) {
        alert(
          "YOU dumb lil piece of dissapointment this was the word: (" +
            mainword +
            ")"
        );
      } else {
        gameOverTitle.innerText = "YOU dumb lil piece of dissapointment";
        gameOverMessage.innerText = "this was the word: (" + mainword + ")";
        gameOverDialog.showModal();
        if (playAgainButton && closeButton) {
          closeButton.style.display = "none";
          playAgainButton.onclick = () => {
            gameOverDialog.close();
            location.reload(); // Restart the game by reloading the page
          };
        }
      }
    };
});

let installPrompt: any = null;

if (installButton) {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.removeAttribute("hidden");
  });

  installButton.addEventListener("click", async () => {
    if (!installPrompt) {
      return;
    }
    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    disableInAppInstallPrompt();
  });
  function disableInAppInstallPrompt() {
    installPrompt = null;
    if (installButton) installButton.setAttribute("hidden", "");
  }
}
