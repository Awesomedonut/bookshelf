import { getCurrentTheme } from './theme.js';

const COZY_PARTICLES = {
  count: 18,
  minSize: 3,
  maxSize: 8,
  minDuration: 8,
  maxDuration: 22,
  maxDelay: 12,
  colors: ['var(--gold)', 'var(--dusty-rose)']
};

const RETRO_PARTICLES = {
  count: 25,
  minSize: 2,
  maxSize: 6,
  minDuration: 5,
  maxDuration: 15,
  maxDelay: 8,
  colors: ['#FF69B4', '#CC00FF', '#00FFFF', '#FFE100']
};

function getParticleConfig() {
  return getCurrentTheme() === 'retro' ? RETRO_PARTICLES : COZY_PARTICLES;
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createParticle(config) {
  const particle = document.createElement('div');
  particle.className = 'particle';

  const size = randomInRange(config.minSize, config.maxSize) + 'px';

  Object.assign(particle.style, {
    left: Math.random() * 100 + '%',
    top: randomInRange(60, 100) + '%',
    width: size,
    height: size,
    animationDuration: randomInRange(config.minDuration, config.maxDuration) + 's',
    animationDelay: Math.random() * config.maxDelay + 's',
    background: randomFrom(config.colors)
  });

  return particle;
}

export function populateParticles(container) {
  const config = getParticleConfig();

  for (let i = 0; i < config.count; i++) {
    container.appendChild(createParticle(config));
  }
}

export function refreshParticles(container) {
  container.innerHTML = '';
  populateParticles(container);
}
