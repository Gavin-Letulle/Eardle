
  document.addEventListener('DOMContentLoaded', function () {
    const listenButton = document.getElementById("listen-button");
    const guessButton = document.getElementById("guess-button");

    if (listenButton) {
      listenButton.addEventListener('click', async function () {
        listenButton.style.backgroundColor = '#f57979';
        listenButton.style.cursor = 'default';
        await Tone.start();

        // Play melody
        for (let i = 0; i < answerMelody.length; i++) {
          synth.triggerAttackRelease(answerMelody[i], '8n', Tone.now() + i * 0.5);
        }

        //Reset board and set first note
        for (let slot of noteSlots) {
          slot.filled = false;
          slot.note = null;
        }
        noteSlots[guessStartIndex - 1].filled = true;
        noteSlots[guessStartIndex - 1].note = answerMelody[0];
        drawStaff();
      });
    }

    if (guessButton) {
      guessButton.addEventListener('click', function () {
        listenButton.style.backgroundColor = '#ffc74f';
        listenButton.style.cursor = 'pointer';

        for (let i = 1; i <= 3; i++) {
          const slot = noteSlots[guessStartIndex - 1 + i];
          const expected = answerMelody[i];
          if (!slot.filled) continue;

          const guessIndex = noteList.indexOf(slot.note);
          const answerIndex = noteList.indexOf(expected);

          if (guessIndex === answerIndex) {
            colorNote(slot.x, slot.note, 'green');
          } else if (Math.abs(guessIndex - answerIndex) === 1) {
            colorNote(slot.x, slot.note, 'gold');
          } else {
            colorNote(slot.x, slot.note, 'red');
          }
        }
      });
    }
  });
