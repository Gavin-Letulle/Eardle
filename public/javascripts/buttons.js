document.addEventListener('DOMContentLoaded', function () {

    const listenButton = document.getElementById("listen-button");
    if (listenButton) {
      listenButton.addEventListener('click', function () {
        listenButton.style.backgroundColor = '#f57979';
        listenButton.style.cursor = 'default';
      });
    }

    const guessButton = document.getElementById("guess-button");
    if (guessButton) {
      guessButton.addEventListener('click', function () {
        listenButton.style.backgroundColor = '#ffc74f';
        listenButton.style.cursor = 'pointer';
      });
    }
  });