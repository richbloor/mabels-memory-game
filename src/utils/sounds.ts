import { MUTE_KEY } from '../constants';

let ctx: AudioContext | null = null;
let _muted: boolean = localStorage.getItem(MUTE_KEY) === 'true';

export function isMuted(): boolean { return _muted; }

export function setMuted(val: boolean): void {
  _muted = val;
  localStorage.setItem(MUTE_KEY, String(val));
}

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function note(freq: number, startTime: number, duration: number, gain: number, type: OscillatorType = 'sine') {
  if (_muted) return;
  const ac = getCtx();
  const osc = ac.createOscillator();
  const env = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(gain, startTime + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(env);
  env.connect(ac.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playFlip() {
  const ac = getCtx();
  const t = ac.currentTime;
  note(520, t, 0.12, 0.18, 'sine');
}

export function playMatch() {
  const ac = getCtx();
  const t = ac.currentTime;
  note(660, t,        0.15, 0.25, 'sine');
  note(880, t + 0.12, 0.2,  0.25, 'sine');
}

export function playNoMatch() {
  const ac = getCtx();
  const t = ac.currentTime;
  note(280, t,       0.12, 0.2, 'triangle');
  note(220, t + 0.1, 0.18, 0.2, 'triangle');
}

export function playWin() {
  const ac = getCtx();
  const t = ac.currentTime;
  const melody = [523, 659, 784, 1047];
  melody.forEach((freq, i) => {
    note(freq, t + i * 0.13, 0.25, 0.3, 'sine');
  });
}
