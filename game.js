import { createEntity, addComponent, runSystem } from "./ecs.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

const modal = document.getElementById("game-over");
const restartBtn = document.getElementById("restart");
const quitBtn = document.getElementById("quit");

let input = { left: false, right: false };
let tick = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let gameRunning = true;

// 🖼️ Učitaj slike
const bootImg = new Image();
bootImg.src = "./assets/boot.png";

const ballImg = new Image();
ballImg.src = "./assets/ball.png";

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") input.left = true;
  if (e.key === "ArrowRight") input.right = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") input.left = false;
  if (e.key === "ArrowRight") input.right = false;
});

restartBtn.onclick = () => {
  score = 0;
  tick = 0;
  store = {};
  const newPlayer = createEntity();
  store = addComponent(store, newPlayer, {
    position: { x: 180, y: 550 },
    size: 40,
    player: true,
  });
  modal.style.display = "none";
  gameRunning = true;
  loop();
};

quitBtn.onclick = () => {
  localStorage.removeItem("highScore");
  highScore = 0;
  score = 0;
  tick = 0;
  store = {};
  gameRunning = false;

  modal.innerHTML = `
    <h2>Thanks for playing!</h2>
    <button id="play-again">PLAY AGAIN</button>
  `;

  setTimeout(() => {
    const playAgainBtn = document.getElementById("play-again");
    playAgainBtn.onclick = () => {
      const newPlayer = createEntity();
      store = addComponent({}, newPlayer, {
        position: { x: 180, y: 550 },
        size: 40,
        player: true,
      });

      modal.style.display = "none";
      modal.innerHTML = `
        <h2>Game Over</h2>
        <button id="restart">RESTART</button>
        <button id="quit">QUIT</button>
      `;
      gameRunning = true;
      loop();

      // Rebind dugmad
      setTimeout(() => {
        document.getElementById("restart").onclick = restartBtn.onclick;
        document.getElementById("quit").onclick = quitBtn.onclick;
      }, 0);
    };
  }, 0);
};

const player = createEntity();
let store = addComponent({}, player, {
  position: { x: 180, y: 550 },
  size: 40,
  player: true,
});

const inputSystem = (store, input) => {
  return Object.entries(store).reduce((acc, [id, comp]) => {
    if (comp.player) {
      let dx = input.left ? -5 : input.right ? 5 : 0;
      acc[id] = {
        ...comp,
        position: {
          ...comp.position,
          x: Math.max(0, Math.min(360, comp.position.x + dx)),
        },
      };
    } else acc[id] = comp;
    return acc;
  }, {});
};

const gravitySystem = (store) => {
  return Object.entries(store).reduce((acc, [id, comp]) => {
    if (comp.velocity && comp.position) {
      acc[id] = {
        ...comp,
        position: {
          ...comp.position,
          y: comp.position.y + comp.velocity.y,
        },
        velocity: {
          ...comp.velocity,
          y: comp.velocity.y + 0.05 + tick * 0.0005,
        },
      };
    } else acc[id] = comp;
    return acc;
  }, {});
};

const collisionSystem = (store) => {
  const caughtIds = [];

  const updatedStore = Object.entries(store).reduce((acc, [id, comp]) => {
    if (comp.player) {
      Object.entries(store).forEach(([oid, ocomp]) => {
        if (ocomp.ball) {
          const dx = comp.position.x - ocomp.position.x;
          const dy = comp.position.y - ocomp.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < comp.size + ocomp.size) {
            caughtIds.push(oid);
            score++;
            if (score > highScore) {
              highScore = score;
              localStorage.setItem("highScore", highScore);
            }
          }
        }
      });
    }
    acc[id] = comp;
    return acc;
  }, {});

  return Object.entries(updatedStore).reduce((acc, [id, comp]) => {
    if (!caughtIds.includes(id)) acc[id] = comp;
    return acc;
  }, {});
};

const spawnSystem = (store) => {
  if (tick % 60 !== 0) return store;
  const ball = createEntity();
  return addComponent(store, ball, {
    position: { x: Math.random() * 360, y: 0 },
    velocity: { y: 1 },
    size: 20,
    ball: true,
  });
};

const missSystem = (store) => {
  for (const [id, comp] of Object.entries(store)) {
    if (comp.ball && comp.position.y > canvas.height) {
      gameRunning = false;
      modal.style.display = "block";
      break;
    }
  }
  return store;
};

const renderSystem = (store) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.values(store).forEach((comp) => {
    if (comp.position && comp.size) {
      const img = comp.player ? bootImg : ballImg;
      ctx.drawImage(
        img,
        comp.position.x - comp.size,
        comp.position.y - comp.size,
        comp.size * 2,
        comp.size * 2
      );
    }
  });
  ctx.fillStyle = "green";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 40);
  return store;
};

const loop = () => {
  if (!gameRunning) return;
  tick++;
  store = [
    inputSystem,
    gravitySystem,
    collisionSystem,
    spawnSystem,
    missSystem,
    renderSystem,
  ].reduce((acc, system) => runSystem(system, acc, input), store);
  requestAnimationFrame(loop);
};

loop();
