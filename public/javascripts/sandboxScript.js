document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('staffCanvas');
    const ctx = canvas.getContext('2d');
    const listenButton = document.getElementById('listen-button');
  
    const scale = 1.5;
    const staffTop = 40 * scale;
    const lineSpacing = 12 * scale;
    const noteRadius = 6 * scale;
    const noteXIncrement = 30 * scale;
    const stemHeight = 35 * scale;
    const lineLength = 20 * scale;
  
    const noteList = [
      'E6','D6','C6','B5','A5','G5','F5','E5','D5','C5',
      'B4','A4','G4','F4','E4','D4','C4','B3','A3','G3',
      'F3','E3'
    ];
  
    const maxSlots = 19;
    const startX = 100 * scale;
    const noteSlots = [];
  
    for (let i = 0; i < maxSlots; i++) {
      noteSlots.push({
        x: startX + i * noteXIncrement,
        filled: false,
        note: null,
        rhythmName: 'quarter',
        color: null
      });
    }
  
    const synth = new Tone.Synth().toDestination();
    Tone.Transport.bpm.value = 75;
  
    function getYForNote(note) {
      const index = noteList.indexOf(note);
      return staffTop + index * (lineSpacing / 2);
    }
  
    function getNoteFromY(y) {
      const index = Math.round((y - staffTop) / (lineSpacing / 2));
      return noteList[Math.max(0, Math.min(noteList.length - 1, index))];
    }
  
    function drawNote(x, note, rhythmName = 'quarter') {
      const y = getYForNote(note);
  
      ctx.beginPath();
      ctx.arc(x, y, noteRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();
  
      // Half note white center
      if (rhythmName === 'half') {
        ctx.beginPath();
        ctx.arc(x, y, noteRadius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
  
      // Stem
      const middleLineY = getYForNote('B4');
      ctx.beginPath();
      if (y > middleLineY) {
        ctx.moveTo(x + noteRadius, y);
        ctx.lineTo(x + noteRadius, y - stemHeight);
      } else {
        ctx.moveTo(x - noteRadius, y);
        ctx.lineTo(x - noteRadius, y + stemHeight);
      }
      ctx.stroke();
  
      // Flags (simplified)
      if (rhythmName === 'eighth' || rhythmName === 'sixteenth') {
        const isStemUp = y > middleLineY;
        const xStart = isStemUp ? x + noteRadius : x - noteRadius;
        const yStart = isStemUp ? y - stemHeight : y + stemHeight;
  
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.quadraticCurveTo(xStart + 10, isStemUp ? yStart + 10 : yStart - 10, xStart + 7, isStemUp ? yStart + 28 : yStart - 28);
        ctx.stroke();
      }
    }
  
    function drawStaff() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 5; i++) {
        const y = staffTop + i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(canvas.width - 20, y);
        ctx.stroke();
      }
  
      for (let slot of noteSlots) {
        if (slot.filled) {
          drawNote(slot.x, slot.note, slot.rhythmName);
        }
      }
    }
  
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const note = getNoteFromY(y);
  
      for (let slot of noteSlots) {
        if (Math.abs(slot.x - x) < noteXIncrement / 2) {
          if (slot.filled && slot.note === note) {
            slot.filled = false;
            slot.note = null;
          } else {
            slot.filled = true;
            slot.note = note;
          }
          drawStaff();
          return;
        }
      }
    });
  
    canvas.addEventListener('contextmenu', e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      for (let i = 0; i < noteSlots.length; i++) {
        const slot = noteSlots[i];
        if (!slot.filled) continue;
        const yActual = getYForNote(slot.note);
        if (Math.abs(slot.x - x) < noteXIncrement / 2 && Math.abs(yActual - y) < noteRadius * 2) {
          showRhythmMenu(e.clientX, e.clientY, i);
          return;
        }
      }
    });
  
    let rhythmTargetIndex = null;
  
    function showRhythmMenu(x, y, slotIndex) {
      const menu = document.getElementById('rhythm-menu');
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
      menu.style.display = 'block';
      rhythmTargetIndex = slotIndex;
    }
  
    document.addEventListener('click', e => {
      const menu = document.getElementById('rhythm-menu');
      if (e.target.classList.contains('rhythm-option')) {
        const rhythm = e.target.getAttribute('data-rhythm');
        if (rhythmTargetIndex !== null) {
          noteSlots[rhythmTargetIndex].rhythmName = rhythm;
          drawStaff();
          rhythmTargetIndex = null;
        }
      }
      menu.style.display = 'none';
    });
  
    listenButton.addEventListener('click', async () => {
      await Tone.start();
  
      let currentTime = Tone.now();
  
      for (let slot of noteSlots) {
        if (slot.filled) {
          const duration = slot.rhythmName === 'eighth' ? '8n'
                         : slot.rhythmName === 'quarter' ? '4n'
                         : slot.rhythmName === 'half' ? '2n'
                         : '4n';
          synth.triggerAttackRelease(slot.note, duration, currentTime);
          currentTime += Tone.Time(duration).toSeconds() + 0.05;
        }
      }
    });
  
    drawStaff();
  });
  