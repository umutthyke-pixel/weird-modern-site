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
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'click') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }
}

// Custom Cursor (Optimized and disabled on mobile)
const cursor = document.getElementById('cursor-trail');
const isMobile = window.matchMedia("(pointer: coarse)").matches;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

if (!isMobile) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.2;
    cursorY += dy * 0.2;
    
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// Initialize audio on first user interaction
document.body.addEventListener('click', initAudio, { once: true });
document.body.addEventListener('mousemove', initAudio, { once: true });

// Interactive Elements Hover
const interactables = document.querySelectorAll('button, a, .switch');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    playSound('hover');
    if (!isMobile) {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(2)`;
      cursor.style.backgroundColor = 'transparent';
      cursor.style.border = '1px solid var(--text-primary)';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (!isMobile) {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(1)`;
      cursor.style.backgroundColor = 'var(--text-primary)';
      cursor.style.border = 'none';
    }
  });
});

// Runaway Button
const runawayBtn = document.getElementById('runaway-btn');
const card4 = document.querySelector('.card-4');

runawayBtn.addEventListener('mousemove', (e) => {
  const cardRect = card4.getBoundingClientRect();
  const btnRect = runawayBtn.getBoundingClientRect();
  
  // Calculate new position within card bounds
  let newX = Math.random() * (cardRect.width - btnRect.width);
  let newY = Math.random() * (cardRect.height - btnRect.height);
  
  runawayBtn.style.left = `${newX}px`;
  runawayBtn.style.top = `${newY}px`;
});

runawayBtn.addEventListener('click', () => {
  playSound('click');
  alert("You caught it! But reality is still an illusion.");
});

// Random Fact Generator
const facts = [
  "In a parallel universe, this website reads you.",
  "Dolphins secretly control the stock market.",
  "If you stare at a blank wall long enough, it stares back.",
  "The concept of 'Tuesday' was invented to sell more tacos.",
  "Your shadow is just a 2D entity trying to escape the 3D realm.",
  "Bananas are curved because they try to reach the moon.",
  "Gravity is just a suggestion."
];

const factContent = document.getElementById('fact-content');
const generateFactBtn = document.getElementById('generate-fact');

function getNewFact() {
  playSound('click');
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  factContent.style.opacity = 0;
  setTimeout(() => {
    factContent.textContent = randomFact;
    factContent.style.opacity = 1;
  }, 200);
}

factContent.style.transition = 'opacity 0.2s';
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
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    }, 400);
  } else {
    document.body.classList.remove('doom-mode');
    clearInterval(doomInterval);
  }
});

// Bouncing DVD Element
const dvd = document.getElementById('bouncing-dvd');
let dvdX = 100, dvdY = 100;
let dvdSpeedX = 2, dvdSpeedY = 2;

function animateDVD() {
  const rect = dvd.getBoundingClientRect();
  if (dvdX + rect.width >= window.innerWidth || dvdX <= 0) {
    dvdSpeedX *= -1;
  }
  if (dvdY + rect.height >= window.innerHeight || dvdY <= 0) {
    dvdSpeedY *= -1;
  }
  dvdX += dvdSpeedX;
  dvdY += dvdSpeedY;
  dvd.style.transform = `translate3d(${dvdX}px, ${dvdY}px, 0)`;
  requestAnimationFrame(animateDVD);
}
animateDVD();
