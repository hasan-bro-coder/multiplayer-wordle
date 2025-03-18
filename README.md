# Wordle Multiplayer Game

Welcome to the **Wordle Multiplayer Game**! This is a browser-based multiplayer version of the popular word-guessing game, 
built with **Vite** for the frontend and **TypeScript** with **Socket.IO** for the backend. 
Players can join rooms, compete in real-time, and guess the hidden word together.

![Gameplay Example](https://raw.githubusercontent.com/hasan-bro-coder/multiplayer-wordle/refs/heads/master/public/preveiw.png)

---

## Features

- **Real-time Multiplayer**: Play with friends or random players in real-time using Socket.IO.
- **PWA**: the website is a PWA so it can be installed and played offline (single-player)
- **Room-based Gameplay**: Create or join rooms to start a game session.
- **Word Guessing**: Guess the hidden word within a limited number of attempts.
- **Responsive Design**: Play with a responsive and intuitive UI on any device.
- **TypeScript Support**: Type-safe code for both the client and server.

---

## Technologies Used

- **Frontend**:
  - Vite (for fast development and bundling)
  - TypeScript
  - HTML/CSS
  - Socket.IO Client

- **Backend**:
  - Node.js
  - TypeScript
  - Socket.IO (for real-time communication)
  - Express (for basic server setup)

---

## How to Play
   1. **Create or Join a Room**:
        - Enter your name and either create a new room or join an existing one using a room code.
   2. **Guess the Word**:
        - You have 6 attempts to guess the hidden 5-letter word.
        - After each guess, the tiles will change color to indicate how close your guess was:
          - 🟩 *Green*: Correct letter in the correct position.
          - 🟨 *Yellow*: Correct letter in the wrong position.
          - ⬛ *Gray*: Letter not in the word.

   3. **Win or Lose**:
        - If you guess the word correctly within 6 attempts, you win!
        - If you run out of attempts, the game ends, revealing the correct word.
      
---
## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

  1.  Fork the repository.

  2. Create a new branch for your feature or bug fix.

  3. Commit your changes and push to your branch.

  4. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgments

Inspired by the original Wordle game.

Enjoy playing the Wordle Multiplayer Game! 🎮✨

And please star the repository✨✨✨
