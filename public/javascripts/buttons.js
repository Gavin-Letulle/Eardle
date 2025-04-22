document.addEventListener('DOMContentLoaded', function () {
    const listenButton = document.getElementById("listen-button");
    const guessButton = document.getElementById("guess-button");
    const triesDisplay = document.querySelector('.tries-guess p');

    let listenLocked = false;
    let triesLeft = 5;
    let gameOver = false;

    function checkForWin() {
        for (let i = 1; i <= 5; i++) {
          const slot = noteSlots[guessStartIndex - 1 + i];
          if (!slot || slot.color !== 'green') return false;
        }
        return true;
      }

    function disableButtons(win = false) {
      gameOver = true;
      listenButton.disabled = true;
      guessButton.disabled = true;
      listenButton.style.cursor = 'not-allowed';
      guessButton.style.cursor = 'not-allowed';

      const color = win ? '#79e67d' : '#999';
      listenButton.style.backgroundColor = color;
      guessButton.style.backgroundColor = color;
    }

    if (listenButton) {
      listenButton.addEventListener('click', async function () {
        if (listenLocked || gameOver) return;

        listenLocked = true;
        listenButton.style.backgroundColor = '#f57979';
        listenButton.style.cursor = 'not-allowed';
        listenButton.disabled = true;

        await Tone.start();

        for (let i = 0; i < answerMelody.length; i++) {
          synth.triggerAttackRelease(answerMelody[i], '8n', Tone.now() + i * 0.5);
        }

        drawStaff();
      });
    }

    if (guessButton) {
      guessButton.addEventListener('click', function () {
        if (gameOver) return;

        listenLocked = false;
        listenButton.disabled = false;
        listenButton.style.backgroundColor = '';
        listenButton.style.cursor = 'pointer';

        for (let i = 1; i <= 5; i++) {
          const slot = noteSlots[guessStartIndex - 1 + i];
          const expected = answerMelody[i];
          if (!slot.filled) continue;

          const guessIndex = noteList.indexOf(slot.note);
          const answerIndex = noteList.indexOf(expected);

          if (guessIndex === answerIndex) {
            colorNote(slot.x, slot.note, 'green');
          } 
          else if (Math.abs(guessIndex - answerIndex) === 1) {
            colorNote(slot.x, slot.note, 'gold');
          } 
          else {
            colorNote(slot.x, slot.note, 'red');
          }
        }
        setTimeout(() => {
          if (checkForWin()) {
            triesDisplay.textContent = "You Win!";
            disableButtons(true);
            return;
          }
          triesLeft--;
          if (triesLeft <= 0) {
            triesDisplay.textContent = "Game Over!";
            disableButtons();
          } 
          else {
            triesDisplay.textContent = `Tries Left: ${triesLeft}`;
          }
        }, 50);
      });
    }
  });