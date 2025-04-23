document.addEventListener('DOMContentLoaded', function () {
    const listenButton = document.getElementById("listen-button");
    const guessButton = document.getElementById("guess-button");
    const triesDisplay = document.querySelector('.tries-guess p');
    

    let listenLocked = false;
    let triesLeft = 5;
    let gameOver = false;

    const rhythmToTone = {
        'eighth': '8n',
        'quarter': '4n',
        'half': '2n'
      };

    function checkForWin() {
        for (let i = 1; i < answerMelody.length; i++) {
            const slot = noteSlots[i];
            if (!slot || slot.color !== 'green') return false;
          }
        return true;
      }

      function disableButtons(win = false) {
        gameOver = true;
        canvasLocked = true;
        
        guessButton.disabled = true;
        guessButton.style.cursor = 'not-allowed';
      
        const color = win ? '#79e67d' : '#999';
        guessButton.style.backgroundColor = color;
      
      }

    if (listenButton) {
        listenButton.addEventListener('click', async function () {
            if (listenLocked) return;
          
            listenLocked = true;
            listenButton.style.backgroundColor = '#f57979';
            listenButton.style.cursor = 'not-allowed';
            listenButton.disabled = true;
          
            await Tone.start();
          
            let currentTime = Tone.now();
            let totalDuration = 0;
          
            for (let i = 0; i < answerMelody.length; i++) {
              const note = answerMelody[i];
              const toneDuration = rhythmToTone[note.rhythmName];
              const durationInSeconds = Tone.Time(toneDuration).toSeconds();
          
              synth.triggerAttackRelease(note.pitch, toneDuration, currentTime);
              currentTime += durationInSeconds + 0.05;
              totalDuration += durationInSeconds + 0.05;
            }
          
            drawStaff();
          
            setTimeout(() => {
              if (gameOver) {
                listenLocked = false;
                listenButton.disabled = false;
                listenButton.style.backgroundColor = '';
                listenButton.style.cursor = 'pointer';
                canvasLocked = true;
              }
            }, totalDuration * 1000);
          });
          
    }

    if (guessButton) {
      guessButton.addEventListener('click', function () {
        if (gameOver) return;

        listenLocked = false;
        listenButton.disabled = false;
        listenButton.style.backgroundColor = '';
        listenButton.style.cursor = 'pointer';

        for (let i = 1; i < answerMelody.length; i++) {
            const slot = noteSlots[i];
            const expected = answerMelody[i];
            if (!slot || !slot.filled) continue;
          
            const guessPitchIndex = noteList.indexOf(slot.note);
            const expectedPitchIndex = noteList.indexOf(expected.pitch);
            const pitchCorrect = guessPitchIndex === expectedPitchIndex;
            const pitchClose = Math.abs(guessPitchIndex - expectedPitchIndex) === 1;
            const rhythmCorrect = slot.rhythmName === expected.rhythmName;
          
            if (pitchCorrect && rhythmCorrect) {
              colorNote(slot.x, slot.note, 'green');
            } else if (pitchCorrect) {
              colorNote(slot.x, slot.note, 'blue');
            } else if (pitchClose) {
              colorNote(slot.x, slot.note, 'gold');
            } else {
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
          listenLocked = false;
          listenButton.disabled = false;
          listenButton.style.backgroundColor = '';
          listenButton.style.cursor = 'pointer';
        }
        , 50);
      });
    }
  });