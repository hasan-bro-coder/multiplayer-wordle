
let buttons: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll(".keyboard .key");
let wordle: Array<Array<HTMLDivElement>> = Array.from(
  document.querySelectorAll(".wordle#main .row")
).map((el) => Array.from(el.querySelectorAll(".col")));
let wordle2: Array<Array<HTMLDivElement>> = Array.from(
  document.querySelectorAll(".wordle#multiplayer .row")
).map((el) => Array.from(el.querySelectorAll(".col")));
const wordleMultiplayer: HTMLDivElement | null = document.querySelector(".wordle#multiplayer");
const wordleCon: HTMLDivElement | null = document.querySelector(".wordle-con")
const wordleConCon: HTMLDivElement | null = document.querySelector(".wordle-con-con")

const state: HTMLHeadingElement | null = document.querySelector(".state");

const warningDialog: HTMLDialogElement | null =
  document.querySelector(".warning");
const warningText: HTMLParagraphElement | null =
  document.querySelector("#warning-message");
const warningButton: HTMLButtonElement | null =
  document.querySelector("#close-warning");
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
const previewButton: HTMLButtonElement | null =
  document.querySelector("#preview");
const mainMenuDialog: HTMLDialogElement | null =
  document.querySelector(".main-menu");
const singleplayerButton: HTMLButtonElement | null =
  document.querySelector("#single");

const inputJoin: HTMLInputElement | null = document.querySelector("input#join");
const joinButton: HTMLButtonElement | null = document.querySelector("button#join");

let currentRow: number = 1;
let currentLetter: number = 1;
let word = "";
// let ismultiplayer = true;
let lobbyId = Math.random().toString(36).substring(7);
let preview = false;

const installButton: HTMLButtonElement | null =
  document.querySelector("#install");

(async () => {
  mainMenuDialog?.showModal();

  let anime = (await import("animejs")).default;
  let { words, checkWord } = (await import("./words"));

  // Use the words and checkWord functions here
  let mainword: string = words[Math.floor(Math.random() * words.length)];
  console.log(mainword);

  let { ismultiplayer, socket } = await (new Promise<{ ismultiplayer: boolean, socket: any | null }>((resolve, reject) => {
    if (singleplayerButton) {
      singleplayerButton.addEventListener("click", () => {
        wordleMultiplayer?.remove();
        if (wordleCon) wordleCon.classList.add("single")
        // .gridTemplateColumns = "1fr";
        console.log("singleplayer", mainMenuDialog);
        mainMenuDialog?.remove();
        resolve({ ismultiplayer: false, socket: null });
      });
    } else {
      reject("singleplayer button not found");
    }
    if (navigator.onLine) {
      if (joinButton) {
        joinButton.onclick = async () => {
          mainMenuDialog?.remove();
          let { io } = await import("socket.io-client");
          console.log(import.meta.env.VITE_URL);

          resolve({ ismultiplayer: true, socket: io(import.meta.env.VITE_URL) });
        };
      } else {
        reject("join button not found");
      }
    } else {
      alert("You are offline, you can only play singleplayer");
      resolve({ ismultiplayer: false, socket: null });
    }
    // const socket = io("http://localhost:3000/");
    // socket.on("ismultiplayer", (value: boolean) => {
    // ismultiplayer = value;
    // resolve(ismultiplayer);
    // });
  }));


  async function press(key: string) {
    if (key == "Enter") {
      if (checkWord(word)) {
        if (ismultiplayer && socket) socket.emit("line", lobbyId, socket.id, word, currentRow);
        // socket.emit("line", { id, word });
        // socket.emit("line", { id, word });

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
        if (state) {
          state.innerText = "guess the word";
          state.style.color = "white";
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
      if (word.length == 5) {
        let isWord = checkWord(word);
        state.innerText = isWord
          ? "valid word"
          : word == "mahir"
            ? "INAVALID AS FUCK"
            : "invalid word";
        state.style.color = isWord ? "#79b851" : "#f33737";
      } else {
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

  if (giveupButton) giveupButton.onclick = () => {
    if (ismultiplayer && socket) {
      socket.emit("gaveup", lobbyId, socket.id);
    }
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
  // });

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
      await installPrompt.prompt();
      disableInAppInstallPrompt();
    });
    function disableInAppInstallPrompt() {
      installPrompt = null;
      if (installButton) installButton.setAttribute("hidden", "");
    }
  }
  if (warningDialog && warningButton) {
    warningButton.onclick = () => {
      warningDialog.close();
      warningDialog.hidden = true;
    }
  }

  if (ismultiplayer && socket) {

    if (previewButton) {
      previewButton.hidden = false
      previewButton.onclick = () => {
        preview = !preview
        previewButton.innerText = preview ? "<" : ">"
        wordleConCon?.scrollTo({ left: preview ? window.innerWidth * 2 : 0, behavior: "smooth" });
      }
    }
    socket.on("lobbyCreated", (id: string) => {
      console.log("lobby created " + id);
    })
    socket.on("moveMade", (word: string, row: number) => {
      if (window.innerWidth < 600 && state) {
        state.innerText = "opponent playing ->";
        state.style.color = "#f3c237";
        anime({
          targets: state,
          scale: 1,
          duration: 600,
          easing: "easeInOutQuad",
        });
      }
      anime({
        targets: wordle2[row - 1],
        // translateX: 270,
        rotateX: 360,
        easing: "easeInOutSine",
        duration: 700,
        delay: anime.stagger(700 / 5),
      });
      for (let i = 0; i < 5; i++) {
        let color: string =
          mainword[i] == word[i]
            ? "#79b851"
            : mainword.includes(word[i])
              ? "#f3c237"
              : "rgb(61 66 77)";

        // wordle[currentRow - 1][i].style.color = color;
        wordle2[row - 1][i].style.backgroundColor = color;
        // console.log("lobby created "+id);
      }
      if (mainword == word) {
        if (ismultiplayer && socket) {
          socket.emit("gameend", lobbyId);
        }
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
    })
    socket.on("lobbyJoined", () => {
      if (warningDialog) {
        warningDialog.close();
        warningDialog.hidden = true;
      }
    })

    socket.on("joined", (ids: string, host: string, word: string) => {
      lobbyId = ids
      let myIp: HTMLButtonElement | null = document.querySelector("#copy-id");
      if (myIp) myIp.hidden = false;
      myIp?.addEventListener("click", () => {
        navigator.clipboard.writeText(lobbyId);
      });
      if (host) {
        if (warningDialog && warningText && warningButton) {
          warningDialog.showModal();
          warningDialog.hidden = false;
          warningText.innerText = "waiting for players...";
          warningButton.hidden = true
        }
      } else {
        if (warningDialog && warningText && warningButton) {
          warningDialog.close();
          warningDialog.hidden = true;
        }
        mainword = word
      }
      console.log("joined", ids, host);
      // console.log("join", word, ids, lobbyId);
      // if (lobbyId == ids) {
      //   mainword = word
      //   console.log("join", warningDialog);
      //   if (warningDialog) {
      //     warningDialog.close();
      //     warningDialog.hidden = true;
      //   }
      // }
    })
    socket.on("opponentDisconnected", () => {
      if (warningDialog && warningText && warningButton) {
        warningDialog.showModal();
        warningDialog.hidden = false;
        warningText.innerText = "opponent disconected (you can still keep going)";
        warningButton.hidden = false
      }
    })
    socket.on("opponentGaveup", () => {
      if (warningDialog && warningText && warningButton) {
        warningDialog.showModal();
        warningDialog.hidden = false;
        warningText.innerText = "opponent gaveup (you can still keep going)";
        warningButton.hidden = false
      }
    })
    socket.on("error", (error: string) => {
      if (warningDialog && warningText && warningButton) {
        warningDialog.showModal();
        warningDialog.hidden = false;
        warningText.innerText = "there was an error: "+error;
        warningButton.hidden = false
      }
    })
    lobbyId = inputJoin?.value || lobbyId
    socket.emit("join", mainword, inputJoin?.value);
    if (warningDialog && warningText && warningButton) {
      warningDialog.showModal();
      warningDialog.hidden = false;
      warningText.innerText = "connecting to server...";
      warningButton.hidden = true
    }
    // async function host() {
    //   lobbyId = inputHost?.value || lobbyId
    //   socket.emit("createLobby", inputHost?.value, mainword);
    //   console.log(warningDialog, warningText, warningButton);

    //   if (warningDialog && warningText && warningButton) {
    //     warningDialog.showModal();
    //     warningDialog.hidden = false;
    //     warningText.innerText = "waiting for players...";
    //     warningButton.hidden = true
    //   }
    // }
    // async function join() {
    // lobbyId = inputJoin?.value || lobbyId
    // socket.emit("joinLobby", inputJoin?.value);
    // let myIp: HTMLButtonElement | null = document.querySelector("#copy-id");
    // // // let { Peer } = await import("peerjs");
    // // peer = new Peer("hsn-hsn-hsn2");
    // // peer.on("open", (id: string) => {
    // //   console.log("My peer ID is: " + id);
    // if (myIp) myIp.hidden = false;
    // myIp?.addEventListener("click", () => {
    //   navigator.clipboard.writeText(lobbyId);
    // });
    // });
    // peer.on("connection", function (conn: any) {
    //   console.log("connected to", conn.peer);
    //   conn.on("data", function (data: string) {
    //     console.log(data);
    //   });
    //   conn.send({
    //     wordle: Array.from(
    //       wordle.map((el) => Array.from(el.map((el) => el.innerText)))
    //     ),
    //     currentRow,
    //     mainword,
    //   });
    // });
    // console.log(input?.value);
    // var conn = peer.connect("hsn-hsn-hsn",{ reliable: true });
    // conn.on("error", function (err: any) {
    //   console.log(err);
    // });
    // conn.on("open", function () {
    //   console.log("connected");
    //   // Receive messages
    //   conn.send("Hello!");
    // });
    // conn.on("data", function (data: string) {
    //   console.log("Received", data);
    // });
  }
})();