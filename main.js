// Custom Cursor
const cursor = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  cursorX += dx * 0.2;
  cursorY += dy * 0.2;
  
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Interactive Elements Hover
const interactables = document.querySelectorAll('button, a');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(2)`;
    cursor.style.backgroundColor = 'transparent';
    cursor.style.border = '1px solid var(--text-primary)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
    cursor.style.backgroundColor = 'var(--text-primary)';
    cursor.style.border = 'none';
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
