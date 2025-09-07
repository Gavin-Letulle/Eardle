# Eardle

## Welcome to Eardle!
Inspired by Wordle, **Eardle** is an ear-training game where you attempt to correctly plot the pitches and rhythms of a melody. It’s designed to sharpen your musical listening skills in a fun and interactive way.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- npm (comes bundled with Node)

### Installation
1. Clone the repository
2. Run "npm install" in the terminal to install the required dependencies
3. Next, run "npm start" to run the app
4. Finally, open in your browser at: "http://localhost:4000"

### How to Play
Select a mode:

#### Classic and Familiar Modes
- A melody in the key of C will play automatically.
- Use the interactive staff to place notes.
- Right-click a note to change its rhythmic value.
- Click Guess when ready.
- Your notes will change color to show accuracy:
    - Green → correct pitch & rhythm
    - Yellow → pitch is a half step away
    - Blue → correct pitch, wrong rhythm
    - Red → wrong pitch & rhythm
- After each guess, you may replay the melody once by clicking Listen.
- You have 5 guesses to get it right!

#### Sandbox Mode
- Click anywhere on the staff to add notes.
- Right-click a note to change its rhythmic value.
- When ready, click Listen to hear your creation!

##### Tech Stack
- Node.js – server runtime
- Express.js – backend framework
- EJS – templating engine
- Tone.js – audio synthesis & playback
- JavaScript, HTML, CSS – frontend

##### Author
Built by Gavin Letulle