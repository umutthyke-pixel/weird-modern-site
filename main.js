// Audio Context for Sound Effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

function playSound(type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (type === 'hover') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'click') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(50, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'error') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }
}

// Custom Cursor
const cursor = document.getElementById('cursor-trail');
const isMobile = window.matchMedia("(pointer: coarse)").matches;
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let cursorX = mouseX, cursorY = mouseY;

if (!isMobile) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.4;
    cursorY += dy * 0.4;
    
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

document.body.addEventListener('click', initAudio, { once: true });
document.body.addEventListener('mousemove', initAudio, { once: true });

// Giant Eye Tracking
const eyePupil = document.getElementById('eye-pupil');
const eyeContainer = document.getElementById('eye-container');

function animateEye() {
  const rect = eyeContainer.getBoundingClientRect();
  const eyeCenterX = rect.left + rect.width / 2;
  const eyeCenterY = rect.top + rect.height / 2;

  const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
  const distance = Math.min(rect.width / 2 - 15, Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 10);
  
  const pupilX = Math.cos(angle) * distance;
  const pupilY = Math.sin(angle) * distance;

  eyePupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
  requestAnimationFrame(animateEye);
}
if (!isMobile) {
  animateEye();
}

// Interactive Elements Hover
const interactables = document.querySelectorAll('button, a, .switch');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    playSound('hover');
    if (!isMobile) {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(2)`;
      cursor.style.backgroundColor = 'transparent';
      cursor.style.border = '2px solid var(--accent-red)';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (!isMobile) {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(1)`;
      cursor.style.backgroundColor = 'var(--accent-red)';
      cursor.style.border = 'none';
    }
  });
});

// Runaway Button
const runawayBtn = document.getElementById('runaway-btn');
const card4 = document.querySelector('.card-4');

runawayBtn.addEventListener('mousemove', (e) => {
  if (isMobile) return;
  const cardRect = card4.getBoundingClientRect();
  const btnRect = runawayBtn.getBoundingClientRect();
  let newX = Math.random() * (cardRect.width - btnRect.width);
  let newY = Math.random() * (cardRect.height - btnRect.height);
  runawayBtn.style.left = `${newX}px`;
  runawayBtn.style.top = `${newY}px`;
});

runawayBtn.addEventListener('click', () => {
  playSound('click');
  alert("N E D E N   T I K L A D I N ?");
});

// Random Fact Generator
const facts = [
  "Ruhun şu an bulutlara yedekleniyor.",
  "Duvardaki leke aslında seni izliyor.",
  "Gerçeklik sadece bir donanım hatası.",
  "Eğer hiçlik varsa, sen nesin?",
  "Zaman sadece sen saate baktığında ilerler.",
  "Aynadaki yansıman senden 2 saniye geride.",
  "Oksijen aslında seni 80 yılda öldüren bir zehir."
];

const factContent = document.getElementById('fact-content');
const generateFactBtn = document.getElementById('generate-fact');

function getNewFact() {
  playSound('click');
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  factContent.textContent = "";
  let i = 0;
  const typeInterval = setInterval(() => {
    factContent.textContent += randomFact.charAt(i);
    i++;
    if (i >= randomFact.length) clearInterval(typeInterval);
  }, 30);
}
getNewFact();
generateFactBtn.addEventListener('click', getNewFact);

// Doom Switch Logic
const doomSwitch = document.getElementById('doom-switch');
let doomInterval;
doomSwitch.addEventListener('change', (e) => {
  playSound('click');
  if (e.target.checked) {
    document.body.classList.add('doom-mode');
    doomInterval = setInterval(() => {
      if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      }
    }, 200);
  } else {
    document.body.classList.remove('doom-mode');
    clearInterval(doomInterval);
  }
});

// Bouncing DVD Element
const dvd = document.getElementById('bouncing-dvd');
let dvdX = 100, dvdY = 100;
let dvdSpeedX = 3, dvdSpeedY = 3;

function animateDVD() {
  const rect = dvd.getBoundingClientRect();
  if (dvdX + rect.width >= window.innerWidth || dvdX <= 0) dvdSpeedX *= -1;
  if (dvdY + rect.height >= window.innerHeight || dvdY <= 0) dvdSpeedY *= -1;
  dvdX += dvdSpeedX;
  dvdY += dvdSpeedY;
  dvd.style.transform = `translate3d(${dvdX}px, ${dvdY}px, 0)`;
  requestAnimationFrame(animateDVD);
}
animateDVD();

// Fake Blink Counter
const blinkTimer = document.getElementById('blink-timer');
let blinks = 0;
setInterval(() => {
  blinks++;
  blinkTimer.textContent = blinks;
}, 1000);

// Glitch Text Effect
const glitchTexts = document.querySelectorAll('.dynamic-glitch');
const chars = '!<>-_\\/[]{}—=+*^?#________';
setInterval(() => {
  const el = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
  const originalText = el.getAttribute('data-text') || el.innerText;
  if (!el.getAttribute('data-text')) el.setAttribute('data-text', originalText);
  
  let glitched = '';
  for(let i=0; i<originalText.length; i++) {
    if (Math.random() < 0.1) {
      glitched += chars[Math.floor(Math.random() * chars.length)];
    } else {
      glitched += originalText[i];
    }
  }
  el.innerText = glitched;
  
  setTimeout(() => {
    el.innerText = originalText;
  }, 100);
}, 2000);

// Delete Internet Popups
const deleteBtn = document.getElementById('delete-internet');
const popupContainer = document.getElementById('popup-container');
const errorMsgs = ["SYSTEM FAILURE", "DATA CORRUPT", "UNAUTHORIZED ACCESS", "VOID OPENED", "PLEASE BLINK", "NO ESCAPE"];

deleteBtn.addEventListener('click', () => {
  let count = 0;
  const interval = setInterval(() => {
    if (count > 50) {
      clearInterval(interval);
      return;
    }
    playSound('error');
    const popup = document.createElement('div');
    popup.className = 'fake-popup';
    popup.textContent = errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
    popup.style.left = `${Math.random() * 80}vw`;
    popup.style.top = `${Math.random() * 80}vh`;
    popupContainer.appendChild(popup);
    count++;
  }, 50);
});
