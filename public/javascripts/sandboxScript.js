document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('staffCanvas');
    const ctx = canvas.getContext('2d');
    const listenButton = document.getElementById('sandbox-listen-button');
  
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
  
    const topStaffNote = 'G5';
    const bottomStaffNote = 'E4';
  
    const maxSlots = 19;
    const startX = 100 * scale;
    const noteSlots = [];
    let ghostNote = null;
  
    function setupNoteSlots(count) {
      noteSlots.length = 0;
      for (let i = 0; i < maxSlots; i++) {
        noteSlots.push({
          x: startX + i * noteXIncrement,
          filled: false,
          note: null,
          rhythmName: 'quarter',
          color: null,
          active: i < count
        });
      }
    }
  
    const synth = new Tone.Synth({
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.8,
        release: 0.2
      }
    }).toDestination();
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
      ctx.stroke();
  
      if (rhythmName === 'half') {
        ctx.beginPath();
        ctx.arc(x, y, noteRadius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
  
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
      const noteIndex = noteList.indexOf(note);

        const topIndex = noteList.indexOf(topStaffNote);
        const bottomIndex = noteList.indexOf(bottomStaffNote);

        if (noteIndex < topIndex) {
        for (let i = topIndex - 1; i >= noteIndex; i -= 2) {
            const lineY = getYForNote(noteList[i]);
            ctx.beginPath();
            ctx.moveTo(x - lineLength / 2, lineY);
            ctx.lineTo(x + lineLength / 2, lineY);
            ctx.stroke();
        }
        } else if (noteIndex > bottomIndex) {
        for (let i = bottomIndex + 2; i <= noteIndex; i += 2) {
            const lineY = getYForNote(noteList[i]);
            ctx.beginPath();
            ctx.moveTo(x - lineLength / 2, lineY);
            ctx.lineTo(x + lineLength / 2, lineY);
            ctx.stroke();
        }
        }
        if (rhythmName === 'eighth' || rhythmName === 'sixteenth') {
            const isStemUp = getYForNote(note) > getYForNote('B4');
            const xStart = isStemUp ? x + noteRadius : x - noteRadius;
            const yStart = isStemUp ? getYForNote(note) - stemHeight : getYForNote(note) + stemHeight;
          
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1.5;
          
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
          
            if (isStemUp) {
              ctx.quadraticCurveTo(
                xStart + 10 * scale,
                yStart + 8 * scale,
                xStart + 7 * scale,
                yStart + 26 * scale
              );
            } else {
              ctx.quadraticCurveTo(
                xStart + 10 * scale,
                yStart - 8 * scale,
                xStart + 7 * scale,
                yStart - 26 * scale
              );
            }
          
            ctx.stroke();
          
            if (rhythmName === 'sixteenth') {
              ctx.beginPath();
              const secondYStart = isStemUp ? yStart + 8 * scale : yStart - 8 * scale;
              ctx.moveTo(xStart, secondYStart);
          
              if (isStemUp) {
                ctx.quadraticCurveTo(
                  xStart + 10 * scale,
                  yStart + 18 * scale,
                  xStart + 7 * scale,
                  yStart + 36 * scale
                );
              } else {
                ctx.quadraticCurveTo(
                  xStart + 10 * scale,
                  yStart - 18 * scale,
                  xStart + 7 * scale,
                  yStart - 36 * scale
                );
              }
          
              ctx.stroke();
            }
          }
          
    }

    function drawGhostNote(x, note, rhythmName = 'quarter') {
        ctx.save();
        ctx.globalAlpha = 0.4;
        drawNote(x, note, rhythmName, true);
        ctx.restore();
      }
  
    function drawStaff() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const topLineY = getYForNote('G5') + 5 * scale;
      for (let i = 0; i < 5; i++) {
        const y = topLineY + i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(20 * scale, y);
        ctx.lineTo(canvas.width - 20 * scale, y);
        ctx.stroke();
      }
  
      const clefScale = 1.4;
      const clefHeight = lineSpacing * 4.5 * clefScale;
      const clefWidth = clefHeight * 0.65;
      const clefY = getYForNote('G4') - clefHeight * 0.56;
      ctx.drawImage(clefImg, 20, clefY - 5, clefWidth, clefHeight);
  
      for (let slot of noteSlots) {
        if (slot.filled) {
          drawNote(slot.x, slot.note, slot.rhythmName);
        }
      }
      if (ghostNote) {
        drawGhostNote(ghostNote.x, ghostNote.note, 'quarter');
      }
    }
  
    const clefImg = new Image();
    clefImg.src = '/images/trebel-clef.webp';
    clefImg.onload = () => {
      setupNoteSlots(19);
      drawStaff();
    };
  
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

    canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const hoverNote = getNoteFromY(mouseY);
      
        let closestSlot = null;
        let minDist = noteXIncrement / 2;
      
        for (let slot of noteSlots) {
          if (!slot.active) continue;
          const dist = Math.abs(slot.x - mouseX);
          if (dist < minDist) {
            minDist = dist;
            closestSlot = slot;
          }
        }
      
        if (closestSlot) {
          ghostNote = {
            x: closestSlot.x,
            note: hoverNote,
            rhythmName: closestSlot.rhythmName || 'quarter'
          };
        } else {
          ghostNote = null;
        }
      
        drawStaff();
      });
      
      canvas.addEventListener('mouseleave', function () {
        ghostNote = null;
        drawStaff();
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
        listenButton.disabled = false;
        listenButton.style.cursor = 'pointer';
      
        await Tone.start();
        let currentTime = Tone.now();
        for (let slot of noteSlots) {
          if (slot.filled) {
            const tone = {
              eighth: '8n',
              quarter: '4n',
              half: '2n',
              sixteenth: '16n'
            }[slot.rhythmName] || '4n';
            synth.triggerAttackRelease(slot.note, tone, currentTime);
            currentTime += Tone.Time(tone).toSeconds() + 0.05;
          }
        }
      });
  });
  