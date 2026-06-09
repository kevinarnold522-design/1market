// Global wave transition state — no React import needed here, hook is in WaveTransitionContext
let _listeners = [];
let _active = false;

export function triggerWave(callback, delay = 480) {
  _active = true;
  _listeners.forEach(fn => fn(true));
  setTimeout(() => {
    if (callback) callback();
    setTimeout(() => {
      _active = false;
      _listeners.forEach(fn => fn(false));
    }, 400);
  }, delay);
}

export function subscribeWave(fn) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(l => l !== fn); };
}

export function isWaveActive() { return _active; }