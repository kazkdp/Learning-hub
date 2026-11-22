/* Sentence Studio – every scene and its sentences (17 Nov 2026).
   A scene = a place + who is there + what they are doing (+ a thing). The same few characters
   (Leo, Maya, Milo the cat, Rex the dog and Ollie the owl) come back again and again, doing different things.

   Sentences are written as parts: "o Leo|y is kicking|g a ball|b in the park"
     o = Who? (orange)   y = What doing? (yellow)   g = What? (green)   b = Where? (blue)
     k = joining word (pink: and, because)   r = the reason, after "because" (purple: Why?)
   The full stop is added by the game (it is a card of its own).
     a  = Who + doing                      (stage 1)
     b  = Who + doing + what               (stage 2)
     c  = with Where (3 or 4 parts)        (stage 3)
     p  = Who + doing + In/on/under place; px = the same place with the wrong position word   (stage 4)
     j  = a joining sentence (and / because); jx = a wrong reason that doesn't fit the picture (stages 7 and 9)
     n  = an extra "and" sentence for a scene with two of the cast                          (stage 7)
     w  = [question, answer]: in the questions stage he builds the question himself (the answer isn't shown).
   Words, questions and the detective stage are made from these. Keep facts true and simple. */
(function () {
  'use strict';

  const Y = 338;                                  // where feet stand on most grounds
  const RM = !!(window.SBArt && window.SBArt.REDUCED);   // "reduce motion": nobody travels about
  const K = (S, name, x, act, o) => S.kid(name, Object.assign({ x, y: Y, s: 1.1, act, roles: ['who', 'doing'] }, o || {}));
  const pt = (S, node) => S.pointOf(node);

  /* The kite's string and the stretchy slime follow the hands, so they are redrawn every frame. */
  function stringTo(S, kid, kite) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('fill', 'none'); line.setAttribute('stroke', '#5b6b7d'); line.setAttribute('stroke-width', '2');
    S.L.back.appendChild(line);
    S.onTick(() => {
      const h = pt(S, kid.handEl.R);
      const kx = kite.x + (kite.dx || 0), ky = kite.y + (kite.dy || 0) + 40;
      line.setAttribute('d', `M${h.x.toFixed(1)} ${h.y.toFixed(1)} Q${((h.x + kx) / 2 + 30).toFixed(1)} ${((h.y + ky) / 2 + 40).toFixed(1)} ${kx.toFixed(1)} ${ky.toFixed(1)}`);
    });
  }
  function slimeBetween(S, kid, slime) {
    S.onTick((t) => {
      const a = pt(S, kid.handEl.L), b = pt(S, kid.handEl.R);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + 6, d = Math.abs(b.x - a.x), th = Math.max(7, 26 - d * 0.16);
      const sag = 10 + d * 0.08;
      slime.p.s.setAttribute('d', `M${a.x - 12} ${a.y - 6} Q${mx} ${my - th + sag} ${b.x + 12} ${b.y - 6} Q${b.x + 18} ${b.y + 12} ${b.x + 4} ${b.y + 14} Q${mx} ${my + th + sag} ${a.x - 4} ${a.y + 14} Q${a.x - 18} ${a.y + 12} ${a.x - 12} ${a.y - 6}Z`);
      slime.p.hl.setAttribute('d', `M${a.x + 4} ${a.y - 2} Q${mx} ${my - th + sag + 6} ${b.x - 4} ${b.y - 2}`);
      slime.g.setAttribute('transform', '');
      if (Math.random() < 0.01) S.spawn('drop', mx + (Math.random() - 0.5) * 20, my + th + sag, { vy: 30, ay: 260, life: 0.8, sc: 0.6 });
    });
    slime.update = () => {};
  }

  /* Turn a character round smoothly (flip slides from 1 to -1, like turning on the spot). */
  const turnTo = (a, dir, dt) => {
    if (a.flip === dir) return;
    let f = a.flip + Math.sign(dir - a.flip) * dt * 7;
    if (Math.abs(f) < 0.3) f = 0.3 * Math.sign(dir);          // skip the paper-thin moment
    if ((dir - f) * (dir - a.flip) <= 0) f = dir;
    a.flip = f;
  };
  /* Maya walks Rex up and down the park on his lead; at each end they stop, Rex trots round behind her and they set off again. */
  function walkies(S, kid, dog) {
    const t0 = S.t, L = 190, R = 500, gap = 112, line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('fill', 'none'); line.setAttribute('stroke', '#e5484d'); line.setAttribute('stroke-width', '3'); line.setAttribute('stroke-linecap', 'round');
    S.L.act.appendChild(line);
    const sm = (x) => x * x * (3 - 2 * x), seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    S.onTick((t, dt) => {
      const p = RM ? 3.5 : ((t - t0) % 17 + 17) % 17;
      let mx, off, kd, dd, kAct, dAct;
      if (p < 7) { mx = L + (R - L) * p / 7; off = gap; kd = 1; dd = 1; kAct = 'walk'; dAct = 'walk'; }
      else if (p < 8.5) { const c = sm(seg(p, 7.4, 8.3)); mx = R; off = gap * (1 - 2 * c); kd = p > 8.05 ? -1 : 1; dd = p > 7.35 ? -1 : 1; kAct = 'idle'; dAct = c > 0 && c < 1 ? 'walk' : 'wag'; }
      else if (p < 15.5) { mx = R - (R - L) * (p - 8.5) / 7; off = -gap; kd = -1; dd = -1; kAct = 'walk'; dAct = 'walk'; }
      else { const c = sm(seg(p, 15.9, 16.8)); mx = L; off = -gap * (1 - 2 * c); kd = p > 16.55 ? 1 : -1; dd = p > 15.85 ? 1 : -1; kAct = 'idle'; dAct = c > 0 && c < 1 ? 'walk' : 'wag'; }
      kid.x = mx; dog.x = mx + off; turnTo(kid, kd, dt); turnTo(dog, dd, dt); kid.act(kAct); if (dog.action !== dAct) dog.act(dAct);
      const h = pt(S, kid.handEl.R), c = pt(S, dog.E.tag), sag = 10 + Math.max(0, 70 - Math.abs(c.x - h.x)) * 0.3;
      line.setAttribute('d', `M${h.x.toFixed(1)} ${(h.y + 4).toFixed(1)} Q${((h.x + c.x) / 2).toFixed(1)} ${((h.y + c.y) / 2 + sag).toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`);
    });
  }
  /* Leo throws the ball; it flies to Rex, who leaps and catches it. The ball always goes to Rex's mouth, wherever he is. */
  function fetchGame(S, kid, dog) {
    const t0 = S.t, ball = S.thing('ball', { x: 0, y: 0, s: 0.62, static: true, roles: ['what'] });
    let from = null, state = '';
    const mouthBall = '<g transform="translate(37,3)"><circle r="9.5" fill="#e5484d" stroke="#b81d2a" stroke-width="2"/><path d="M-7 -3 Q0 5 7 -3" fill="none" stroke="#fff" stroke-width="2.2" opacity=".8"/></g>';
    S.onTick((t) => {
      const p = RM ? 0.2 : ((t - t0) % 2.4 + 2.4) % 2.4 / 2.4;
      const now = p < 0.47 ? 'hand' : p < 0.8 ? 'fly' : 'mouth';
      if (now !== state) {
        state = now;
        kid.hold('R', now === 'hand' ? 'ballHeld' : null); dog.holdMouth(now === 'mouth' ? mouthBall : '');
        if (now === 'fly') { const h = pt(S, kid.handEl.R); from = { x: h.x, y: h.y + 20 }; }
        if (now === 'mouth') window.SBArt.sound('pop');
      }
      if (now === 'fly' && from) {
        const k = (p - 0.47) / 0.33, m = pt(S, dog.E.mouthHold), to = { x: m.x + 30 * dog.s * dog.flip, y: m.y + 14 };
        ball.x = from.x + (to.x - from.x) * k; ball.y = from.y + (to.y - from.y) * k - 150 * Math.sin(Math.PI * k); ball.rot = k * 540; ball.opacity = 1;
      } else ball.opacity = 0;
    });
  }

  const SCENES = [
    /* ---------------- Leo, Maya and Milo ---------------- */
    { id: 'leo-jump', bg: 'garden', setup: (S) => { K(S, 'leo', 400, 'jump'); },
      a: 'o Leo|y is jumping', c: 'o Leo|y is jumping|b in the garden',
      j: 'o Leo|y is jumping|k because|r he is happy', jx: 'r he is sleepy',
      w: ['Why do we come back down when we jump?', 'Gravity pulls everything down towards the Earth.'] },

    { id: 'maya-wave', bg: 'park', setup: (S) => { K(S, 'maya', 420, 'wave'); },
      a: 'o Maya|y is waving', c: 'o Maya|y is waving|b in the park',
      j: 'o Maya|y is waving|k and|y smiling',
      w: ['Why do people wave?', 'Waving is a way to say hello or goodbye without any words.'] },

    { id: 'leo-run', bg: 'park', setup: (S) => { K(S, 'leo', 430, 'run'); },
      a: 'o Leo|y is running', c: 'o Leo|y is running|b in the park',
      w: ['Why does your heart beat faster when you run?', 'Your muscles need more oxygen, so your heart pumps blood faster.'] },

    { id: 'maya-dance', bg: 'livingroom', place: 'rug', setup: (S) => { K(S, 'maya', 560, 'dance', { y: 350 }); },
      a: 'o Maya|y is dancing', c: 'o Maya|y is dancing|b on the rug',
      w: ['Why does music make us want to dance?', 'Music makes our brains feel happy, and the beat makes us want to move!'] },

    { id: 'maya-singdance', bg: 'livingroom', place: 'rug', setup: (S) => { const m = K(S, 'maya', 560, 'dance', { y: 350 }); S.emit('note', { x: () => m.x + 40, y: () => 150, rate: 0.9, p: { vy: -30, life: 2.4, sway: 12 } }); },
      a: 'o Maya|y is singing', j: 'o Maya|y is singing|k and|y dancing',
      w: ['How do we make sounds when we sing?', 'Air from your lungs makes parts in your throat shake. The shaking makes sound.'] },

    { id: 'kids-dance', bg: 'livingroom', place: 'rug', setup: (S) => { K(S, 'leo', 470, 'dance', { y: 350 }); K(S, 'maya', 650, 'dance', { y: 350, flip: true }); },
      j: 'o Leo|k and|o Maya|y are dancing',
      w: ['Why do we dance at parties?', 'Dancing together is a fun way to share happy feelings.'] },

    { id: 'kids-wave', bg: 'park', setup: (S) => { K(S, 'leo', 330, 'wave'); K(S, 'maya', 510, 'wave'); },
      j: 'o Leo|k and|o Maya|y are waving',
      w: ['How do people say hello in other countries?', 'Some people bow, some shake hands and some put their hands together.'] },

    { id: 'read-sleep', bg: 'livingroom', place: 'rug', setup: (S) => { K(S, 'leo', 210, 'read', { y: 312, s: 1 }); S.thing('book', { x: 210, y: 252, s: 0.85, act: 'read', roles: ['what'] }); S.cat({ x: 560, y: 352, s: 0.9, act: 'sleep', roles: ['who', 'doing'] }); },
      j: 'o Leo|y is reading|k and|o Milo|y is sleeping',
      w: ['Why are there spaces between words?', 'Spaces show where one word ends and the next word starts.'] },

    { id: 'leo-sleep', bg: 'bedroom', bgo: { night: true, covered: true }, place: 'bed', setup: (S) => { K(S, 'leo', 676, 'sleep', { y: 226, s: 0.92, rot: -90, noShadow: true, layer: 'back' }); S.emit('zzz', { x: 540, y: 170, rate: 0.5, p: { vx: -10, vy: -22, life: 2.6, sway: 8 } }); },
      a: 'o Leo|y is sleeping', c: 'o Leo|y is sleeping|b in his bed',
      p: 'o Leo|y is sleeping|b in his bed', px: ['under his bed'],
      j: 'o Leo|y is sleeping|k because|r it is night', jx: 'r it is lunchtime',
      w: ['Why do we need sleep?', 'Sleep helps your body grow and helps your brain remember what you learned.'] },

    { id: 'milo-sleep', bg: 'livingroom', place: 'rug', setup: (S) => { S.cat({ x: 560, y: 352, s: 1.15, act: 'sleep', roles: ['who', 'doing'] }); },
      a: 'o Milo|y is sleeping', c: 'o Milo|y is sleeping|b on the rug',
      j: 'o Milo|y is sleeping|k because|r he is tired', jx: 'r he is hungry',
      w: ['How long do cats sleep?', 'Cats can sleep for 12 to 16 hours every day!'] },

    { id: 'maya-sing', bg: 'bedroom', place: 'bedroom', setup: (S) => { K(S, 'maya', 340, 'sing', { y: 350 }); },
      a: 'o Maya|y is singing', c: 'o Maya|y is singing|b in her bedroom',
      w: ['Why can we hear sounds?', 'Sounds make the air shake. Your ears feel the shaking and your brain hears it.'] },

    { id: 'leo-clap', bg: 'classroom', setup: (S) => { K(S, 'leo', 400, 'clap', { y: 350 }); },
      a: 'o Leo|y is clapping', c: 'o Leo|y is clapping|b in the classroom',
      j: 'o Leo|y is clapping|k because|r he is happy', jx: 'r he is sad',
      w: ['Why does clapping make a sound?', 'Your hands squash the air very fast. The air shakes and you hear a clap.'] },

    { id: 'maya-laugh', bg: 'park', setup: (S) => { K(S, 'maya', 300, 'laugh'); S.cat({ x: 540, y: 336, s: 0.9, act: 'jump' }); },
      a: 'o Maya|y is laughing', c: 'o Maya|y is laughing|b in the park',
      j: 'o Maya|y is laughing|k because|r Milo is funny', jx: 'r Milo is asleep',
      w: ['Why is laughing good for you?', 'Laughing helps you relax and can make you feel happier.'] },

    { id: 'leo-swim', bg: 'sea', place: 'sea', setup: (S) => { K(S, 'leo', 400, 'swim', { y: 418, hat: 'goggles', noShadow: true }); },
      a: 'o Leo|y is swimming', c: 'o Leo|y is swimming|b in the sea',
      w: ['Why is the sea salty?', 'Rivers carry tiny bits of salt from rocks into the sea.'] },

    { id: 'milo-jump', bg: 'garden', setup: (S) => { S.cat({ x: 400, y: 336, s: 1.2, act: 'jump', roles: ['who', 'doing'] }); },
      a: 'o Milo|y is jumping', c: 'o Milo|y is jumping|b in the garden',
      w: ['How high can a cat jump?', 'A cat can jump about five times as high as its own body!'] },

    { id: 'leo-sneeze', bg: 'garden', setup: (S) => { K(S, 'leo', 380, 'sneeze'); S.thing('flower', { x: 470, y: 338, s: 1.3, colour: '#f28482' }); S.thing('flower', { x: 505, y: 338, s: 1.1, colour: '#f5c542' }); },
      a: 'o Leo|y is sneezing', c: 'o Leo|y is sneezing|b in the garden',
      w: ['Why do we sneeze?', 'A sneeze blows dust and germs out of your nose.'] },

    { id: 'maya-yawn', bg: 'bedroom', bgo: { night: true }, place: 'bedroom', setup: (S) => { K(S, 'maya', 330, 'yawn', { y: 350 }); },
      a: 'o Maya|y is yawning', c: 'o Maya|y is yawning|b in her bedroom',
      j: 'o Maya|y is yawning|k because|r she is sleepy', jx: 'r she is hungry',
      w: ['Why do we yawn?', 'Nobody knows for sure! Scientists are still trying to find out.'] },

    { id: 'maya-apple', bg: 'kitchen', setup: (S) => { K(S, 'maya', 340, 'eat', { hold: { R: { prop: 'apple', roles: ['what'] } } }); },
      a: 'o Maya|y is eating', b: 'o Maya|y is eating|g an apple', c: 'o Maya|y is eating|g an apple|b in the kitchen',
      j: 'o Maya|y is eating|g an apple|k because|r she is hungry', jx: 'r she is cold',
      w: ['Why do apples float?', 'An apple is about one quarter air, so it floats in water.'] },

    { id: 'leo-drink', bg: 'kitchen', setup: (S) => { K(S, 'leo', 340, 'drink', { hold: { R: { prop: 'cup', roles: ['what'], rot: 180 } } }); },
      a: 'o Leo|y is drinking', b: 'o Leo|y is drinking|g water', c: 'o Leo|y is drinking|g water|b in the kitchen',
      j: 'o Leo|y is drinking|g water|k because|r he is thirsty', jx: 'r he is sleepy',
      w: ['How much of your body is water?', 'More than half of your body is water!'] },

    { id: 'leo-kick', bg: 'park', setup: (S) => { S.thing('goal', { x: 640, y: 300 }); const k = K(S, 'leo', 250, 'kick'); S.thing('ball', { x: 300, y: Y, act: 'kicked', roles: ['what'] }); k.onKick = () => window.SBArt.sound('pop'); },
      b: 'o Leo|y is kicking|g a ball', c: 'o Leo|y is kicking|g a ball|b in the park',
      w: ['Why does a ball bounce?', 'The ball squashes when it hits the ground, then springs back into shape.'] },

    { id: 'maya-read', bg: 'bedroom', place: 'bedroom', setup: (S) => { S.thing('stool', { x: 330, y: 352, s: 1.7 }); K(S, 'maya', 330, 'read', { y: 352 }); S.thing('book', { x: 330, y: 290, s: 0.9, act: 'read', roles: ['what'] }); },
      a: 'o Maya|y is reading', b: 'o Maya|y is reading|g a book', c: 'o Maya|y is reading|g a book|b in her bedroom',
      j: 'o Maya|y is reading|g a book|k because|r she loves stories', jx: 'r she is asleep',
      w: ['Why do sentences end with a full stop?', 'A full stop tells the reader that one idea has finished.'] },

    { id: 'leo-dig', bg: 'garden', setup: (S) => { S.thing('hole', { x: 470, y: 344, roles: ['what'] }); K(S, 'leo', 380, 'dig', { hold: { R: { prop: 'spade', rot: -20 } } }); },
      a: 'o Leo|y is digging', b: 'o Leo|y is digging|g a hole', c: 'o Leo|y is digging|g a hole|b in the garden',
      w: ['What lives in the soil?', 'Worms! They mix up the soil, and that helps plants grow.'] },

    { id: 'maya-water', bg: 'garden', setup: (S) => { const m = K(S, 'maya', 330, 'water', { hold: { R: { prop: 'can', rot: 64 } } }); ['#f28482', '#8e6cc9', '#f5c542'].forEach((c, i) => S.thing('flower', { x: 470 + i * 34, y: 344, s: 1.15 - i * 0.1, colour: c, roles: ['what'] })); S.emit('drop', { x: () => pt(S, m.handEl.R).x + 66, y: () => pt(S, m.handEl.R).y + 2, rate: 7, jx: 10, p: { vx: 30, vy: 20, ay: 300, life: 0.8 } }); },
      b: 'o Maya|y is watering|g the flowers', c: 'o Maya|y is watering|g the flowers|b in the garden',
      j: 'o Maya|y is watering|g the flowers|k because|r they need water to grow', jx: 'r they are too hot',
      w: ['How do plants drink?', 'Plants take in water through their roots.'] },

    { id: 'leo-paint', bg: 'classroom', setup: (S) => { S.thing('easel', { x: 500, y: 350, s: 1.05, roles: ['what'] }); K(S, 'leo', 360, 'paint', { y: 350, hold: { R: { prop: 'brush' } } }); },
      a: 'o Leo|y is painting', b: 'o Leo|y is painting|g a rainbow', c: 'o Leo|y is painting|g a rainbow|b in the classroom',
      w: ['How many colours are in a rainbow?', 'Seven: red, orange, yellow, green, blue, indigo and violet.'] },

    { id: 'maya-kite', bg: 'park', setup: (S) => { const m = K(S, 'maya', 300, 'kite'); const k = S.thing('kite', { x: 560, y: 90, s: 0.9, roles: ['what'] }); stringTo(S, m, k); },
      b: 'o Maya|y is flying|g a kite', c: 'o Maya|y is flying|g a kite|b in the park',
      j: 'o Maya|y is flying|g a kite|k because|r it is windy', jx: 'r it is raining',
      w: ['What makes a kite fly?', 'The wind pushes on the kite and lifts it up into the sky.'] },

    { id: 'leo-bubbles', bg: 'garden', setup: (S) => { K(S, 'leo', 360, 'blowBubbles', { hold: { R: { prop: 'wand', rot: 15, roles: ['what'] } } }); },
      b: 'o Leo|y is blowing|g bubbles', c: 'o Leo|y is blowing|g bubbles|b in the garden',
      w: ['Why are bubbles round?', 'A round shape is the easiest way for a thin bubble skin to hold the air.'] },

    { id: 'maya-moon', bg: 'night', place: 'garden', setup: (S) => { S.thing('moon', { x: 620, y: 90, roles: ['what'] }); S.thing('telescope', { x: 400, y: 340, s: 1.05 }); K(S, 'maya', 320, 'telescope'); },
      b: 'o Maya|y is looking at|g the moon', c: 'o Maya|y is looking at|g the moon|b in the garden',
      w: ['Why does the moon shine?', 'The moon has no light of its own. Light from the sun bounces off it.'] },

    { id: 'leo-teeth', bg: 'bathroom', place: 'bathroom', setup: (S) => { K(S, 'leo', 300, 'brushTeeth', { y: 350, hold: { R: { prop: 'toothbrush', rot: 0, roles: ['what'] } } }); },
      a: 'o Leo|y is brushing', b: 'o Leo|y is brushing|g his teeth', c: 'o Leo|y is brushing|g his teeth|b in the bathroom',
      w: ['How long should you brush your teeth?', 'For two minutes, two times a day, to keep them strong.'] },

    { id: 'maya-hands', bg: 'bathroom', place: 'sink', setup: (S) => { K(S, 'maya', 600, 'wash', { y: 352, layer: 'back' }); },
      b: 'o Maya|y is washing|g her hands', c: 'o Maya|y is washing|g her hands|b in the sink',
      j: 'o Maya|y is washing|g her hands|k because|r they are dirty', jx: 'r they are cold',
      w: ['Why do we use soap?', 'Soap lifts germs off your skin, so water can wash them away.'] },

    { id: 'milo-butterfly', bg: 'garden', setup: (S) => { const c = S.cat({ x: 330, y: 336, s: 1.1, act: 'chase', roles: ['who', 'doing'] }); S.thing('butterfly', { x: 470, y: 200, act: 'flee', roles: ['what'] }); c.path = (t) => { c.x = 330 + Math.sin(t * 0.7) * 24; }; },
      b: 'o Milo|y is chasing|g a butterfly', c: 'o Milo|y is chasing|g a butterfly|b in the garden',
      w: ['How do butterflies taste their food?', 'With their feet! They taste a flower by standing on it.'] },

    { id: 'milo-drink', bg: 'kitchen', setup: (S) => { S.thing('bowl', { x: 470, y: 344, roles: ['what'] }); S.cat({ x: 380, y: 344, s: 1.15, act: 'drink', roles: ['who', 'doing'] }); },
      a: 'o Milo|y is drinking', b: 'o Milo|y is drinking|g water', c: 'o Milo|y is drinking|g water|b in the kitchen',
      w: ['How does a cat drink?', 'A cat flicks its tongue very fast to pull the water up into its mouth.'] },

    { id: 'milo-wool', bg: 'livingroom', place: 'rug', setup: (S) => { const w = S.thing('wool', { x: 600, y: 352, act: 'roll', roles: ['what'] }); S.cat({ x: 520, y: 352, s: 1.1, act: 'play', roles: ['who', 'doing'] }); w.update(0, 0); },
      b: 'o Milo|y is playing with|g a ball of wool', c: 'o Milo|y is playing with|g a ball of wool|b on the rug',
      w: ['Why do cats like to chase things?', 'Cats are hunters. Chasing is practice for catching their food!'] },

    { id: 'milo-wash', bg: 'livingroom', place: 'rug', setup: (S) => { S.cat({ x: 540, y: 352, s: 1.25, act: 'wash', roles: ['who', 'doing'] }); },
      a: 'o Milo|y is washing', b: 'o Milo|y is licking|g his paw', c: 'o Milo|y is licking|g his paw|b on the rug',
      w: ['Why do cats lick their fur?', 'To keep clean! A cat’s tongue is rough, like a brush.'] },

    { id: 'milo-box', bg: 'livingroom', place: 'box', setup: (S) => { S.cat({ x: 560, y: 330, s: 1, act: 'hide', roles: ['who', 'doing'] }); const b = S.thing('box', { x: 560, y: 356, s: 1.25, layer: 'front' }); b.g.setAttribute('data-place', 'box'); },
      a: 'o Milo|y is hiding', c: 'o Milo|y is hiding|b in a box',
      w: ['Why do cats love boxes?', 'Small spaces help cats feel safe and warm.'] },

    { id: 'leo-castle', bg: 'beach', place: 'beach', setup: (S) => { S.thing('bucket', { x: 560, y: 344 }); S.thing('sandcastle', { x: 470, y: 346, roles: ['what'] }); K(S, 'leo', 350, 'build', { y: 344 }); },
      b: 'o Leo|y is building|g a sandcastle', c: 'o Leo|y is building|g a sandcastle|b on the beach',
      w: ['What is sand made of?', 'Tiny bits of rock and shell, broken up by the sea.'] },

    { id: 'maya-snowman', bg: 'snow', place: 'snow', setup: (S) => { S.thing('snowman', { x: 480, y: 340, s: 1.15, roles: ['what'] }); K(S, 'maya', 340, 'pat', { hat: 'woolly' }); },
      b: 'o Maya|y is making|g a snowman', c: 'o Maya|y is making|g a snowman|b in the snow',
      j: 'o Maya|y is wearing|g a hat|k because|r it is cold', jx: 'r it is hot',
      w: ['How many points does a snowflake have?', 'Six! Every snowflake has six sides.'] },

    { id: 'leo-umbrella', bg: 'rain', place: 'rain', setup: (S) => { K(S, 'leo', 380, 'umbrella', { hold: { R: { prop: 'umbrella', rot: 132, roles: ['what'] } } }); S.thing('puddle', { x: 470, y: 352 }); },
      b: 'o Leo|y is holding|g an umbrella', c: 'o Leo|y is holding|g an umbrella|b in the rain',
      j: 'o Leo|y is holding|g an umbrella|k because|r it is raining', jx: 'r it is sunny',
      w: ['Where does rain come from?', 'Clouds! Tiny drops join together until they are heavy enough to fall.'] },

    { id: 'maya-ducks', bg: 'pond', place: 'pond', setup: (S) => { const m = K(S, 'maya', 90, 'feed', { y: 312, s: 0.95, hold: { R: 'peas' } }); S.thing('duck', { x: 360, y: 326, roles: ['what'] }); S.thing('duck', { x: 500, y: 342, s: 0.9, act: 'eat', roles: ['what'] }); m.onThrow = () => { const h = pt(S, m.handEl.R); for (let i = 0; i < 4; i++) S.spawn('seed', h.x, h.y, { vx: 120 + Math.random() * 120, vy: -110 - Math.random() * 50, ay: 320, life: 1.4, floor: 330 }); }; },
      b: 'o Maya|y is feeding|g the ducks', c: 'o Maya|y is feeding|g the ducks|b at the pond',
      w: ['Why don’t ducks get wet?', 'Ducks have oily feathers that keep the water out.'] },

    { id: 'leo-ladybird', bg: 'garden', setup: (S) => { S.thing('leaf', { x: 500, y: 300, s: 1.1, rot: -8 }); S.thing('ladybird', { x: 500, y: 290, s: 1.4, roles: ['what'] }); K(S, 'leo', 380, 'magnify', { hold: { R: { prop: 'magnifier' } } }); },
      b: 'o Leo|y is looking at|g a ladybird', c: 'o Leo|y is looking at|g a ladybird|b in the garden',
      w: ['Why do ladybirds have bright spots?', 'Bright colours tell birds: don’t eat me, I taste horrible!'] },

    { id: 'maya-seed', bg: 'garden', setup: (S) => { S.thing('pot', { x: 470, y: 344, s: 1.1, roles: ['what'] }); K(S, 'maya', 360, 'plant', { y: 344, hold: { R: 'seed' } }); },
      b: 'o Maya|y is planting|g a seed', c: 'o Maya|y is planting|g a seed|b in the garden',
      w: ['What does a seed need to grow?', 'Water and warmth. Then the little plant needs sunlight to make its food.'] },

    { id: 'leo-cake', bg: 'kitchen', setup: (S) => { K(S, 'leo', 420, 'stir', { y: 352, hold: { R: 'spoon' } }); S.thing('table', { x: 420, y: 356, layer: 'front' }); S.thing('mixbowl', { x: 430, y: 284, roles: ['what'], layer: 'front' }); },
      b: 'o Leo|y is making|g a cake', c: 'o Leo|y is making|g a cake|b in the kitchen',
      w: ['Why does a cake rise in the oven?', 'Heat makes tiny bubbles in the mixture grow bigger, so the cake puffs up.'] },

    { id: 'maya-drum', bg: 'classroom', setup: (S) => { S.thing('stool', { x: 400, y: 352, s: 1.7 }); K(S, 'maya', 400, 'drum', { y: 352, hold: { L: 'stick', R: 'stick' } }); S.thing('drum', { x: 400, y: 356, s: 1.05, roles: ['what'], layer: 'front' }); },
      a: 'o Maya|y is drumming', b: 'o Maya|y is playing|g the drum', c: 'o Maya|y is playing|g the drum|b in the classroom',
      w: ['How does a drum make a sound?', 'The drum skin shakes when you hit it, and the shaking makes the sound.'] },

    { id: 'leo-hug', bg: 'livingroom', place: 'rug', setup: (S) => { K(S, 'leo', 540, 'hug', { y: 352 }); S.cat({ x: 548, y: 312, s: 0.75, act: 'hugged', roles: ['what'], layer: 'front' }); S.emit('heart', { x: 600, y: 170, w: 60, rate: 0.6, p: { vy: -24, life: 2, sway: 8 } }); },
      b: 'o Leo|y is hugging|g Milo', c: 'o Leo|y is hugging|g Milo|b on the rug',
      w: ['Why do cats purr?', 'Cats often purr when they feel happy and safe.'] },

    { id: 'maya-brush-milo', bg: 'livingroom', place: 'rug', setup: (S) => { const c = S.cat({ x: 600, y: 356, s: 1, act: 'purr', roles: ['what'] }); const m = K(S, 'maya', 515, 'stroke', { y: 352, hold: { R: { prop: 'catbrush', rot: -20 } } });
        m.touch = { from: { x: c.x - 40 * c.s, y: c.y - 66 * c.s }, to: { x: c.x - 42 * c.s, y: c.y - 40 * c.s }, ha: -25 }; },   // the brush runs down Milo's side
      b: 'o Maya|y is brushing|g Milo', c: 'o Maya|y is brushing|g Milo|b on the rug',
      w: ['Why do cats need brushing?', 'Brushing takes out loose fur and keeps a cat’s coat soft.'] },

    { id: 'leo-slime', bg: 'kitchen', setup: (S) => { const k = K(S, 'leo', 380, 'slime'); const sl = S.thing('slime', { x: 0, y: 0, roles: ['what'], layer: 'front' }); slimeBetween(S, k, sl); },
      b: 'o Leo|y is stretching|g the slime', c: 'o Leo|y is stretching|g the slime|b in the kitchen',
      w: ['Why does slime stretch?', 'Slime is made of long, tangled strings that slide past each other when you pull.'] },

    { id: 'maya-rocket', bg: 'park', setup: (S) => { K(S, 'maya', 300, 'launch'); S.thing('toyrocket', { x: 470, y: 330, roles: ['what'] }); },
      b: 'o Maya|y is launching|g a rocket', c: 'o Maya|y is launching|g a rocket|b in the park',
      w: ['How does a rocket go up?', 'It pushes hot gas down very hard, and that pushes the rocket up.'] },

    { id: 'leo-sunhat', bg: 'beach', place: 'beach', setup: (S) => { K(S, 'leo', 400, 'happy', { hat: 'sunhat' }); },
      b: 'o Leo|y is wearing|g a sun hat', c: 'o Leo|y is wearing|g a sun hat|b on the beach',
      j: 'o Leo|y is wearing|g a sun hat|k because|r it is sunny', jx: 'r it is snowing',
      w: ['Why do we wear sun hats?', 'Strong sunlight can burn your skin. A hat shades your face and eyes.'] },

    /* ---------------- animals ---------------- */
    { id: 'bee', bg: 'garden', setup: (S) => { [['#f28482', 400], ['#8e6cc9', 450], ['#f5c542', 350]].forEach(([c, x]) => S.thing('flower', { x, y: 344, s: 1.4, colour: c, roles: ['what'] })); S.thing('bee', { x: 410, y: 206, s: 1.3, act: 'visit', roles: ['who', 'doing'] }); },
      a: 'o The bee|y is buzzing', b: 'o The bee|y is visiting|g a flower', c: 'o The bee|y is visiting|g a flower|b in the garden',
      j: 'o The bee|y is visiting|g the flowers|k because|r it needs nectar', jx: 'r it is cold',
      w: ['What do bees make?', 'Bees turn nectar from flowers into honey.'] },

    { id: 'caterpillar', bg: 'garden', setup: (S) => { S.thing('leaf', { x: 420, y: 320, s: 2.2, roles: ['what'] }); S.thing('caterpillar', { x: 380, y: 300, s: 1.4, act: 'eat', roles: ['who', 'doing'] }); },
      a: 'o The caterpillar|y is eating', b: 'o The caterpillar|y is eating|g a leaf', c: 'o The caterpillar|y is eating|g a leaf|b in the garden',
      w: ['What will the caterpillar turn into?', 'A butterfly! First it makes a hard case called a chrysalis.'] },

    { id: 'frog', bg: 'pond', place: 'pond', setup: (S) => { S.thing('frog', { x: 160, y: 262, s: 1.3, act: 'jump', roles: ['who', 'doing'] }); },
      a: 'o The frog|y is jumping', c: 'o The frog|y is jumping|b into the pond',
      w: ['How do frogs breathe?', 'With their lungs, and through their skin too!'] },

    { id: 'duck', bg: 'pond', place: 'pond', setup: (S) => { S.thing('duck', { x: 420, y: 330, s: 1.4, roles: ['who', 'doing'] }); },
      a: 'o The duck|y is swimming', c: 'o The duck|y is swimming|b on the pond',
      w: ['How do ducks swim?', 'Their webbed feet push the water like paddles.'] },

    { id: 'fish', bg: 'pond', place: 'pond', setup: (S) => { S.thing('fish', { x: 420, y: 330, s: 1.2, roles: ['who', 'doing'] }); },
      a: 'o The fish|y is swimming', c: 'o The fish|y is swimming|b in the pond',
      w: ['How do fish breathe under water?', 'Fish have gills. The gills take oxygen out of the water.'] },

    { id: 'bird-sing', bg: 'park', place: 'tree', setup: (S) => { S.thing('bird', { x: 130, y: 120, s: 1.3, act: 'sing', roles: ['who', 'doing'] }); },
      a: 'o The bird|y is singing', c: 'o The bird|y is singing|b in the tree',
      w: ['Why do birds sing?', 'Birds sing to talk to each other and to say: this is my home!'] },

    { id: 'bird-nest', bg: 'park', place: 'tree', setup: (S) => { S.thing('nest', { x: 120, y: 138, s: 1.1, roles: ['what'] }); const b = S.thing('bird', { x: 150, y: 124, s: 1.2, act: 'build', roles: ['who', 'doing'] }); b.g.insertAdjacentHTML('beforeend', '<path data-p="twig" d="M26 -30 L48 -40 M36 -35 L40 -44" stroke="#7a5038" stroke-width="3" stroke-linecap="round"/>'); b.p.twig = b.g.querySelector('[data-p="twig"]'); },
      b: 'o The bird|y is building|g a nest', c: 'o The bird|y is building|g a nest|b in the tree',
      w: ['What are nests made of?', 'Twigs, grass, moss and sometimes feathers.'] },

    { id: 'snail', bg: 'garden', setup: (S) => { S.thing('snail', { x: 400, y: 336, s: 1.6, roles: ['who', 'doing'] }); },
      a: 'o The snail|y is sliding', c: 'o The snail|y is sliding|b in the garden',
      w: ['Where does a snail live?', 'In its shell! It carries its home on its back.'] },

    { id: 'ollie-hoot', also: ['the bird'], bg: 'night', place: 'tree', setup: (S) => { S.thing('moon', { x: 640, y: 80, s: 0.8 }); S.thing('tree', { x: 330, y: 300, s: 1.05 }); S.owl({ x: 301, y: 196, s: 0.72, act: 'hoot', noShadow: true, roles: ['who', 'doing'] }); },
      a: 'o Ollie|y is hooting', c: 'o Ollie|y is hooting|b in the tree',
      j: 'o Ollie|y is hooting|k because|r it is night', jx: 'r it is lunchtime',
      w: ['Why do owls hoot?', 'Hooting is how owls talk to each other. A hoot can mean “this is my home” or “where are you?”'] },

    /* ---------------- Rex the dog and Ollie the owl ---------------- */
    { id: 'rex-bark', bg: 'garden', setup: (S) => { S.dog({ x: 380, y: 342, s: 1.15, act: 'bark', roles: ['who', 'doing'] }); },
      a: 'o Rex|y is barking', c: 'o Rex|y is barking|b in the garden',
      w: ['Why do dogs bark?', 'Barking is one way dogs talk. They bark to say hello, to ask to play, or to tell us that someone is there.'] },

    { id: 'rex-wag', bg: 'park', also: ['Leo'], setup: (S) => { const d = S.dog({ x: 470, y: 346, s: 0.9, act: 'wag', flip: true, roles: ['who', 'doing'] }); const k = S.kid('leo', { x: 350, y: Y, s: 1.1, act: 'pat' });
        k.touch = { from: { x: d.x - 62 * d.s, y: d.y - 104 * d.s } }; },
      b: 'o Rex|y is wagging|g his tail', c: 'o Rex|y is wagging|g his tail|b in the park',
      j: 'o Rex|y is wagging|g his tail|k because|r he is happy', jx: 'r he is cold',
      w: ['Why do dogs wag their tails?', 'A wag shows how a dog is feeling. A loose, wiggly wag usually means a happy dog.'] },

    { id: 'rex-catch', bg: 'park', setup: (S) => { const d = S.dog({ x: 590, y: 344, s: 0.9, act: 'catch2', flip: true, roles: ['who', 'doing'] }); const k = K(S, 'leo', 210, 'throw'); fetchGame(S, k, d); },
      b: 'o Rex|y is catching|g a ball', c: 'o Rex|y is catching|g a ball|b in the park',
      j: 'o Leo|y is throwing|k and|o Rex|y is catching',
      w: ['Why do dogs love to fetch?', 'Long ago, many dogs helped people by fetching things and bringing them back. Chasing and carrying still feels fun to them!'] },

    { id: 'rex-dig', bg: 'garden', setup: (S) => { S.thing('hole', { x: 446, y: 350, s: 0.75, roles: ['what'] }); S.thing('bone', { x: 560, y: 352, s: 0.9, rot: -10 }); S.dog({ x: 380, y: 346, s: 1, act: 'dig', roles: ['who', 'doing'] }); },
      b: 'o Rex|y is digging|g a hole', c: 'o Rex|y is digging|g a hole|b in the garden',
      j: 'o Rex|y is digging|k because|r he wants to hide his bone', jx: 'r he is sleepy',
      w: ['Why do dogs dig?', 'To hide a bone for later, to make a cool spot to lie in, or just because digging is fun!'] },

    { id: 'rex-sleep', bg: 'livingroom', place: 'basket', setup: (S) => { S.thing('basket', { x: 560, y: 362, s: 1.25 }); S.dog({ x: 556, y: 352, s: 1.05, act: 'sleep', noShadow: true, roles: ['who', 'doing'] }); S.thing('basketFront', { x: 560, y: 362, s: 1.25 }); },
      a: 'o Rex|y is sleeping', c: 'o Rex|y is sleeping|b in his basket',
      j: 'o Rex|y is sleeping|k because|r he is tired', jx: 'r he is hungry',
      w: ['How long do dogs sleep?', 'A long time! Grown-up dogs often sleep for about half the day, and puppies sleep even more.'] },

    { id: 'rex-swim', bg: 'pond', place: 'pond', setup: (S) => { const d = S.dog({ x: 400, y: 352, s: 1, act: 'swim', noShadow: true, roles: ['who', 'doing'] }); S.waterline(d, -50, { w: 72, dx: 8 }); S.thing('duck', { x: 640, y: 318, s: 0.8 }); },
      also: ['the duck'],
      a: 'o Rex|y is swimming', c: 'o Rex|y is swimming|b in the pond',
      w: ['How do dogs swim?', 'They paddle their legs as if they were running. That is why it is called the doggy paddle!'] },

    { id: 'rex-shake', bg: 'pond', setup: (S) => { S.dog({ x: 640, y: 384, s: 0.85, act: 'shake', roles: ['who', 'doing'] }); },
      a: 'o Rex|y is shaking', j: 'o Rex|y is shaking|k because|r he is wet', jx: 'r he is hungry',
      w: ['Why do wet dogs shake?', 'A big shake flings the water out of their fur, so they get dry much faster.'] },

    { id: 'rex-drink', bg: 'kitchen', setup: (S) => { S.dog({ x: 330, y: 352, s: 0.95, act: 'drink', roles: ['who', 'doing'] }); S.thing('dogbowl', { x: 436, y: 354, roles: ['what'] }); },
      b: 'o Rex|y is drinking|g water', c: 'o Rex|y is drinking|g water|b in the kitchen',
      w: ['How does a dog drink?', 'It curls the tip of its tongue back like a little spoon and flicks the water up into its mouth.'] },

    { id: 'leo-feed-rex', bg: 'kitchen', setup: (S) => { S.dog({ x: 420, y: 354, s: 0.9, act: 'beg', flip: true, roles: ['what'] }); K(S, 'leo', 270, 'hold', { y: 352, hold: { R: { prop: 'bone', rot: 0 } } }); },
      b: 'o Leo|y is feeding|g Rex', c: 'o Leo|y is feeding|g Rex|b in the kitchen',
      w: ['What do dogs eat?', 'Food made just for dogs. Some of our food, like chocolate and grapes, can make dogs very poorly.'] },

    { id: 'maya-walk-rex', bg: 'park', setup: (S) => { const d = S.dog({ x: 300, y: 346, s: 0.82, act: 'walk', roles: ['what'] }); const m = K(S, 'maya', 190, 'walk', { s: 1.05 }); walkies(S, m, d); },
      b: 'o Maya|y is walking|g Rex', c: 'o Maya|y is walking|g Rex|b in the park', j: 'o Maya|k and|o Rex|y are walking',
      w: ['Why do dogs need walks?', 'Walks keep dogs fit and give them lots of new smells. A dog’s nose is how it finds out about the world.'] },

    { id: 'rex-sniff', bg: 'garden', setup: (S) => { S.thing('flower', { x: 492, y: 350, s: 1.05, colour: '#9b7fd1', roles: ['what'] }); S.dog({ x: 360, y: 350, s: 1, act: 'sniff', roles: ['who', 'doing'] }); },
      b: 'o Rex|y is sniffing|g a flower', c: 'o Rex|y is sniffing|g a flower|b in the garden',
      w: ['How good is a dog’s nose?', 'Amazing! A dog can smell things thousands of times better than we can.'] },

    { id: 'rex-milo-sleep', bg: 'livingroom', place: 'rug', setup: (S) => { S.cat({ x: 452, y: 358, s: 0.78, act: 'sleep', roles: ['who', 'doing'] }); S.dog({ x: 590, y: 358, s: 1.05, act: 'sleep', roles: ['who', 'doing'] }); },
      j: 'o Rex|k and|o Milo|y are sleeping',
      w: ['Can cats and dogs be friends?', 'Yes! When they get to know each other gently, cats and dogs can become best friends.'] },

    { id: 'ollie-fly', also: ['the bird'], bg: 'night', place: 'sky', setup: (S) => { S.thing('moon', { x: 640, y: 80, s: 0.8 }); const t0 = S.t, o = S.owl({ x: 400, y: 170, s: 0.62, act: 'fly', noShadow: true, roles: ['who', 'doing'] }); o.path = (t, a) => { const w = RM ? 0.6 : (t - t0) * Math.PI * 2 / 12; a.x = 400 + 230 * Math.sin(w); a.y = 180 + 50 * Math.sin(2 * w); a.rot = 12 * Math.cos(w); }; o.path(S.t, o); },
      a: 'o Ollie|y is flying', c: 'o Ollie|y is flying|b in the sky',
      w: ['Why can’t you hear an owl fly?', 'Owls have soft, fringed feathers that hush the air, so they can fly almost without a sound.'] },

    { id: 'ollie-read', also: ['the bird'], bg: 'classroom', setup: (S) => { S.thing('table', { x: 400, y: 356, s: 0.8 }); S.owl({ x: 400, y: 297, s: 0.95, act: 'read', hold: { prop: 'bookOpen', roles: ['what'] }, roles: ['who', 'doing'] }); },
      b: 'o Ollie|y is reading|g a book', c: 'o Ollie|y is reading|g a book|b in the classroom',
      w: ['Why do owls have such big eyes?', 'Big eyes let in lots of light, so owls can see in the dark. Their eyes can’t roll about like ours, so owls turn their heads instead.'] },

    { id: 'ollie-sleep', also: ['the bird'], bg: 'park', place: 'tree', setup: (S) => { S.thing('sun', { x: 680, y: 70, s: 0.8 }); S.thing('tree', { x: 420, y: 300, s: 1.05 }); S.owl({ x: 391, y: 196, s: 0.72, act: 'sleep', noShadow: true, roles: ['who', 'doing'] }); },
      a: 'o Ollie|y is sleeping', c: 'o Ollie|y is sleeping|b in the tree',
      p: 'o Ollie|y is sleeping|b in the tree', px: ['under the tree'],
      j: 'o Ollie|y is sleeping|k because|r it is daytime', jx: 'r it is night',
      w: ['Why do owls sleep in the day?', 'Most owls hunt at night, so they rest when it is light.'] },

    { id: 'ollie-head', also: ['the bird'], bg: 'forest', place: 'forest', setup: (S) => { S.owl({ x: 400, y: 340, s: 1.05, act: 'turnHead', roles: ['who', 'doing'] }); },
      b: 'o Ollie|y is turning|g his head', c: 'o Ollie|y is turning|g his head|b in the forest',
      w: ['How far can an owl turn its head?', 'A very long way – about three quarters of the way round! It helps owls look about without moving their bodies.'] },

    { id: 'maya-ollie-dance', also: ['the bird'], bg: 'livingroom', place: 'rug', setup: (S) => { K(S, 'maya', 470, 'dance', { y: 350 }); S.owl({ x: 640, y: 352, s: 0.9, act: 'dance', roles: ['who', 'doing'] }); S.emit('note', { x: 560, y: 180, rate: 0.7, p: { vx: 0, vy: -26, life: 2.4, sway: 14 } }); },
      j: 'o Maya|k and|o Ollie|y are dancing',
      w: ['Do birds dance?', 'Some do! Some birds hop, bob and flap their wings to show off to other birds.'] },

    { id: 'squirrel', bg: 'forest', place: 'forest', setup: (S) => { S.thing('acorn', { x: 470, y: 336, s: 1.6, roles: ['what'] }); S.thing('squirrel', { x: 420, y: 336, s: 1.6, roles: ['who', 'doing'] }); },
      b: 'o The squirrel|y is burying|g a nut', c: 'o The squirrel|y is burying|g a nut|b in the forest',
      j: 'o The squirrel|y is burying|g nuts|k because|r winter is coming', jx: 'r it is hot',
      w: ['Why do squirrels bury nuts?', 'They save food in autumn to eat in the winter.'] },

    { id: 'spider', bg: 'garden', setup: (S) => { S.thing('web', { x: 420, y: 170, s: 1.5, roles: ['what'] }); S.thing('spider', { x: 420, y: 176, s: 1.7, roles: ['who', 'doing'] }); },
      b: 'o The spider|y is spinning|g a web', c: 'o The spider|y is spinning|g a web|b in the garden',
      j: 'o The spider|y is spinning|g a web|k because|r it wants to catch flies', jx: 'r it is hungry for leaves',
      w: ['What is a spider’s web made of?', 'Silk! The spider makes it inside its own body.'] },

    { id: 'ant', bg: 'garden', setup: (S) => { S.thing('ant', { x: 400, y: 334, s: 2.6, roles: ['who', 'doing'] }); },
      b: 'o The ant|y is carrying|g a leaf', c: 'o The ant|y is carrying|g a leaf|b in the garden',
      w: ['How strong is an ant?', 'An ant can carry things much heavier than its own body!'] },

    /* ---------------- the world around us ---------------- */
    { id: 'sun', bg: 'sky', place: 'sky', setup: (S) => { S.thing('sun', { x: 400, y: 160, s: 1.1, roles: ['who', 'doing'] }); },
      a: 'o The sun|y is shining', c: 'o The sun|y is shining|b in the sky',
      w: ['Is the sun a star?', 'Yes! The sun is the closest star to the Earth.'] },

    { id: 'rain', bg: 'rain', place: 'rain', setup: (S) => { S.thing('puddle', { x: 300, y: 344 }); S.thing('puddle', { x: 520, y: 362, s: 0.8 }); S.actors.filter((a) => a.name === 'raincloud').forEach((a) => a.g.setAttribute('data-role', 'who doing')); },
      a: 'o The rain|y is falling', c: 'o The rain|y is falling|b on the grass',
      w: ['Where does rain go?', 'Into rivers and the sea. The sun warms it, and it rises up to make clouds again.'] },

    { id: 'snowman', bg: 'snow', place: 'snow', setup: (S) => { S.thing('sun', { x: 660, y: 80, s: 0.7 }); S.thing('snowman', { x: 400, y: 340, s: 1.3, act: 'melt', roles: ['who', 'doing'] }); S.emitters = []; },
      a: 'o The snowman|y is melting', c: 'o The snowman|y is melting|b in the sun',
      j: 'o The snowman|y is melting|k because|r the sun is warm', jx: 'r it is snowing',
      w: ['Why does snow melt?', 'When it gets warm, snow and ice turn back into water.'] },

    { id: 'leaves', bg: 'forest', place: 'forest', setup: (S) => { S.svg.querySelectorAll('[data-place="tree"]').forEach((t) => t.setAttribute('data-role', 'who')); S.emit('leaf', { x: 400, y: -10, w: 700, rate: 3, p: { vy: 40, vr: 70, life: 10, sway: 28, fade: 0.2 } }); },
      a: 'o The leaves|y are falling', c: 'o The leaves|y are falling|b in the forest',
      j: 'o The leaves|y are falling|k because|r it is autumn', jx: 'r it is summer',
      w: ['Why do leaves fall in autumn?', 'Trees drop their leaves to save water through the cold winter.'] },

    { id: 'earth', bg: 'space', place: 'space', setup: (S) => { S.thing('sun', { x: 150, y: 200, s: 1.2, roles: ['what'] }); S.thing('earth', { x: 520, y: 200, s: 1, roles: ['who', 'doing'] }); },
      a: 'o The Earth|y is spinning', b: 'o The Earth|y is going round|g the sun', c: 'o The Earth|y is spinning|b in space',
      w: ['Why do we have day and night?', 'The Earth spins round once every day. The side facing the sun has day.'] },

    { id: 'rocket', bg: 'space', place: 'space', setup: (S) => { S.thing('moon', { x: 640, y: 100, s: 1.2 }); S.thing('rocket', { x: 330, y: 270, s: 1.1, rot: 30, roles: ['who', 'doing'] }); },
      a: 'o The rocket|y is flying', c: 'o The rocket|y is flying|b to the moon',
      w: ['How long does it take to fly to the moon?', 'About three days in a rocket!'] },

    { id: 'plant', bg: 'garden', place: 'pot', setup: (S) => { const p = S.thing('plant', { x: 400, y: 344, s: 1.2, roles: ['who', 'doing'] }); p.g.querySelector('path').setAttribute('data-place', 'pot'); },
      a: 'o The plant|y is growing', c: 'o The plant|y is growing|b in a pot',
      j: 'o The plant|y is growing|k because|r it has water and sun', jx: 'r it is dark',
      w: ['How do plants get their food?', 'Plants make their own food using sunlight, water and air.'] },

    /* ---------- In, on, under (stage 4). p = the sentence; px = the same place with the wrong position word.
       The picture must make the position plain; never use pairs a picture can't settle (in/on a tree, in/on a bed). ---------- */
    { id: 'pos-milo-on-box', bg: 'livingroom', place: 'box', setup: (S) => { S.thing('bigbox', { x: 470, y: 356, s: 1.45 }); S.cat({ x: 482, y: 244, s: 1, act: 'sit', noShadow: true, roles: ['who', 'doing'] }); },
      p: 'o Milo|y is sitting|b on the box', px: ['in the box'] },
    { id: 'pos-milo-in-box', bg: 'livingroom', place: 'box', setup: (S) => { S.thing('boxBack', { x: 470, y: 356, s: 1.45 }); S.cat({ x: 484, y: 306, s: 1.05, act: 'sit', noShadow: true, roles: ['who', 'doing'] }); S.thing('boxFront', { x: 470, y: 356, s: 1.45 }); },
      p: 'o Milo|y is sitting|b in the box', px: ['on the box'] },
    { id: 'pos-rex-in-box', bg: 'garden', place: 'box', setup: (S) => { S.thing('boxBack', { x: 420, y: 352, s: 1.55 }); S.dog({ x: 402, y: 300, s: 0.95, act: 'sit', noShadow: true, roles: ['who', 'doing'] }); S.thing('boxFront', { x: 420, y: 352, s: 1.55 }); },
      p: 'o Rex|y is sitting|b in the box', px: ['on the box'] },
    { id: 'pos-leo-on-box', bg: 'garden', place: 'box', setup: (S) => { S.thing('bigbox', { x: 400, y: 352, s: 1.3 }); K(S, 'leo', 408, 'wave', { y: 248, s: 0.95, noShadow: true }); },
      p: 'o Leo|y is standing|b on the box', px: ['in the box'] },
    { id: 'pos-leo-in-box', bg: 'livingroom', place: 'box', setup: (S) => { S.thing('boxBack', { x: 430, y: 356, s: 1.75 }); K(S, 'leo', 444, 'wave', { y: 330, s: 0.95, noShadow: true }); S.thing('boxFront', { x: 430, y: 356, s: 1.75 }); },
      p: 'o Leo|y is sitting|b in the box', px: ['on the box'] },
    { id: 'pos-ollie-on-box', also: ['the bird'], bg: 'garden', place: 'box', setup: (S) => { S.thing('bigbox', { x: 420, y: 352, s: 1.3 }); S.owl({ x: 430, y: 250, s: 0.85, act: 'idle', noShadow: true, roles: ['who', 'doing'] }); },
      p: 'o Ollie|y is standing|b on the box', px: ['in the box'] },
    { id: 'pos-milo-on-table', bg: 'classroom', place: 'table', setup: (S) => { S.thing('table', { x: 420, y: 356, s: 1.4 }); S.cat({ x: 430, y: 254, s: 0.85, act: 'sit', noShadow: true, roles: ['who', 'doing'] }); },
      p: 'o Milo|y is sitting|b on the table', px: ['under the table'] },
    { id: 'pos-milo-under-table', bg: 'classroom', place: 'table', setup: (S) => { S.thing('table', { x: 420, y: 356, s: 1.4 }); S.cat({ x: 426, y: 352, s: 0.75, act: 'sit', roles: ['who', 'doing'] }); },
      p: 'o Milo|y is sitting|b under the table', px: ['on the table'] },
    { id: 'pos-rex-under-table', bg: 'kitchen', place: 'table', setup: (S) => { S.thing('table', { x: 420, y: 356, s: 1.4 }); S.dog({ x: 420, y: 354, s: 0.9, act: 'sleep', roles: ['who', 'doing'] }); },
      p: 'o Rex|y is sleeping|b under the table', px: ['on the table'] },
    { id: 'pos-leo-on-chair', bg: 'livingroom', place: 'chair', setup: (S) => { S.thing('chair', { x: 470, y: 356, s: 1.6 }); K(S, 'leo', 470, 'sit', { y: 356, s: 1.05 }); },
      p: 'o Leo|y is sitting|b on the chair', px: ['under the chair'] },
    { id: 'pos-milo-under-chair', bg: 'livingroom', place: 'chair', setup: (S) => { S.thing('chair', { x: 470, y: 356, s: 2 }); S.cat({ x: 474, y: 354, s: 0.62, act: 'sleep', roles: ['who', 'doing'] }); },
      p: 'o Milo|y is sleeping|b under the chair', px: ['on the chair'] },
    { id: 'pos-maya-on-bed', bg: 'bedroom', place: 'bed', setup: (S) => { K(S, 'maya', 626, 'jump', { y: 240, s: 0.92, noShadow: true }); },
      p: 'o Maya|y is jumping|b on the bed', px: ['under the bed'] },
    { id: 'pos-milo-on-bed', bg: 'bedroom', place: 'bed', setup: (S) => { S.cat({ x: 640, y: 240, s: 0.9, act: 'sleep', noShadow: true, roles: ['who', 'doing'] }); },
      p: 'o Milo|y is sleeping|b on the bed', px: ['under the bed'] },
    { id: 'pos-leo-under-tree', bg: 'park', place: 'tree', setup: (S) => { S.thing('tree', { x: 470, y: 330, s: 1.15 }); K(S, 'leo', 470, 'read', { y: 340, s: 0.95 }); S.thing('book', { x: 470, y: 282, s: 0.8, act: 'read' }); },
      p: 'o Leo|y is reading|b under the tree', px: ['in the tree'] },
    { id: 'pos-rex-under-tree', bg: 'park', place: 'tree', setup: (S) => { S.thing('tree', { x: 470, y: 330, s: 1.15 }); S.dog({ x: 500, y: 346, s: 0.95, act: 'sleep', roles: ['who', 'doing'] }); },
      p: 'o Rex|y is sleeping|b under the tree', px: ['in the tree'] },

    /* ---------- Joining with "and" (stage 7). n = an "and" sentence for a scene with two of the cast. ---------- */
    { id: 'and-leo-rex-run', bg: 'park', setup: (S) => { K(S, 'leo', 300, 'run'); S.dog({ x: 520, y: 344, s: 1, act: 'run', roles: ['who', 'doing'] }); },
      n: 'o Leo|k and|o Rex|y are running' },
    { id: 'and-kids-read', bg: 'livingroom', place: 'rug', setup: (S) => { K(S, 'maya', 330, 'read', { y: 350 }); S.thing('book', { x: 330, y: 288, s: 0.9, act: 'read', roles: ['what'] }); K(S, 'leo', 560, 'read', { y: 350 }); S.thing('book', { x: 560, y: 288, s: 0.9, act: 'read', roles: ['what'] }); },
      n: 'o Maya|k and|o Leo|y are reading' },
    { id: 'and-kids-eat', bg: 'kitchen', setup: (S) => { K(S, 'leo', 300, 'eat', { hold: { R: { prop: 'apple', roles: ['what'] } } }); K(S, 'maya', 520, 'eat', { flip: true, hold: { R: { prop: 'apple', roles: ['what'] } } }); },
      n: 'o Leo|k and|o Maya|y are eating' },
    { id: 'and-pets-drink', bg: 'kitchen', setup: (S) => { S.cat({ x: 250, y: 344, s: 1, act: 'drink', roles: ['who', 'doing'] }); S.thing('bowl', { x: 330, y: 344, roles: ['what'] }); S.dog({ x: 500, y: 352, s: 0.9, act: 'drink', roles: ['who', 'doing'] }); S.thing('dogbowl', { x: 600, y: 354, roles: ['what'] }); },
      n: 'o Milo|k and|o Rex|y are drinking' },
    { id: 'and-kids-jump', bg: 'garden', setup: (S) => { K(S, 'leo', 320, 'jump'); K(S, 'maya', 500, 'jump'); },
      n: 'o Leo|k and|o Maya|y are jumping' },
    { id: 'and-kids-clap', bg: 'classroom', setup: (S) => { K(S, 'maya', 320, 'clap', { y: 350 }); K(S, 'leo', 500, 'clap', { y: 350 }); },
      n: 'o Maya|k and|o Leo|y are clapping' },
    { id: 'and-paint-read', bg: 'classroom', setup: (S) => { S.thing('easel', { x: 310, y: 350, s: 1, roles: ['what'] }); K(S, 'leo', 180, 'paint', { y: 350, hold: { R: { prop: 'brush' } } }); K(S, 'maya', 570, 'read', { y: 350 }); S.thing('book', { x: 570, y: 288, s: 0.9, act: 'read' }); },
      n: 'o Leo|y is painting|k and|o Maya|y is reading' },
    { id: 'and-bone-beg', bg: 'kitchen', setup: (S) => { S.dog({ x: 430, y: 354, s: 0.9, act: 'beg', flip: true, roles: ['who', 'doing'] }); K(S, 'leo', 270, 'hold', { y: 352, hold: { R: { prop: 'bone', rot: 0, roles: ['what'] } } }); },
      n: 'o Leo|y is holding|g a bone|k and|o Rex|y is begging' },
    { id: 'and-jump-bark', bg: 'garden', setup: (S) => { K(S, 'leo', 300, 'jump'); S.dog({ x: 530, y: 342, s: 1, act: 'bark', flip: true, roles: ['who', 'doing'] }); },
      n: 'o Leo|y is jumping|k and|o Rex|y is barking' }
  ];

  /* Little pictures for word cards (at the easy help levels). Who cards for the cast show their face. */
  const ICONS = {
    'the bee': '🐝', 'the caterpillar': '🐛', 'the frog': '🐸', 'the duck': '🦆', 'the fish': '🐟', 'the bird': '🐦', 'the snail': '🐌', 'the owl': '🦉',
    'the squirrel': '🐿️', 'the spider': '🕷️', 'the ant': '🐜', 'the sun': '☀️', 'the rain': '🌧️', 'the snowman': '⛄', 'the leaves': '🍂', 'the earth': '🌍',
    'the rocket': '🚀', 'the plant': '🌱', 'his tail': '🐕', 'his head': '🦉', 'a bone': '🦴',
    'an apple': '🍎', 'water': '💧', 'a ball': '⚽', 'a book': '📖', 'a hole': '🕳️', 'the flowers': '🌷', 'a flower': '🌸', 'a rainbow': '🌈', 'a kite': '🪁',
    'bubbles': '🫧', 'the moon': '🌙', 'his teeth': '🦷', 'her hands': '👐', 'a butterfly': '🦋', 'a ball of wool': '🧶', 'his paw': '🐾', 'a sandcastle': '🏰',
    'a snowman': '⛄', 'an umbrella': '☂️', 'the ducks': '🦆', 'a ladybird': '🐞', 'a seed': '🌱', 'a cake': '🎂', 'the drum': '🥁', 'milo': '🐱', 'the slime': '🟢',
    'a rocket': '🚀', 'a sun hat': '👒', 'a leaf': '🍃', 'a nest': '🪺', 'a nut': '🌰', 'nuts': '🌰', 'a web': '🕸️', 'the sun ': '☀️', 'a hat': '🧢',
    'in the garden': '🌳', 'in the park': '🌳', 'on the rug': '🟫', 'in his bed': '🛏️', 'in her bedroom': '🛏️', 'in the classroom': '🏫', 'in the sea': '🌊',
    'in the kitchen': '🍳', 'in the bathroom': '🛁', 'in the sink': '🚰', 'on the beach': '🏖️', 'in the snow': '❄️', 'in the rain': '🌧️', 'at the pond': '🦆',
    'in a box': '📦', 'into the pond': '💦', 'on the pond': '🌊', 'in the pond': '🌊', 'in the tree': '🌳', 'in the forest': '🍂', 'in the sky': '☁️',
    'on the grass': '🌱', 'in the sun': '☀️', 'in space': '✨', 'to the moon': '🌙', 'in a pot': '🪴', 'in his basket': '🧺',
    'on the box': '📦', 'in the box': '📦', 'on the chair': '🪑', 'under the chair': '🪑', 'on the bed': '🛏️', 'under the bed': '🛏️', 'under his bed': '🛏️', 'under the tree': '🌳'
  };
  /* Card texts that are too general to be a wrong card ("is playing with" could be true of almost anyone). */
  const NO_DISTRACT = ['is playing with', 'is looking at', 'is making', 'is holding', 'is wearing', 'is going round', 'is washing', 'is brushing'];
  /* Places that look alike (a wrong card is never taken from the same group). */
  const PLACE_GROUP = {
    'in the garden': 'green', 'in the park': 'green', 'on the grass': 'green', 'in the forest': 'green', 'in the tree': 'green',
    'on the rug': 'home', 'in his bed': 'home', 'in her bedroom': 'home', 'in the kitchen': 'home', 'in the bathroom': 'home', 'in the sink': 'home', 'in a box': 'home', 'in the classroom': 'home', 'in his basket': 'home',
    'in the sea': 'water', 'on the beach': 'water', 'at the pond': 'water', 'into the pond': 'water', 'on the pond': 'water', 'in the pond': 'water',
    'in the snow': 'weather', 'in the rain': 'weather', 'in the sun': 'weather', 'in the sky': 'sky', 'in space': 'sky', 'to the moon': 'sky', 'in a pot': 'green'
  };
  /* Doing words that look alike in a picture. */
  const DOING_GROUP = { 'are walking': 'move', 'are running': 'move', 'are jumping': 'move', 'are dancing': 'move', 'are eating': 'mouth', 'are drinking': 'mouth', 'are singing': 'mouth', 'is barking': 'mouth', 'is sniffing': 'mouth', 'is catching': 'ball', 'is throwing': 'ball', 'is carrying': 'ball', 'is kicking': 'ball', 'is shaking': 'move', 'is walking': 'move', 'is wagging': 'move', 'is turning': 'turn', 'is jumping': 'move', 'is running': 'move', 'is dancing': 'move', 'is chasing': 'move', 'is singing': 'mouth', 'is laughing': 'mouth', 'is yawning': 'mouth', 'is sneezing': 'mouth', 'is eating': 'mouth', 'is drinking': 'mouth', 'is buzzing': 'mouth', 'is hooting': 'mouth', 'is washing': 'clean', 'is licking': 'clean', 'is brushing': 'clean', 'is swimming': 'water', 'is sliding': 'move', 'is flying': 'sky', 'is spinning': 'turn', 'is going round': 'turn' };

  window.SB_CONTENT = { SCENES, ICONS, NO_DISTRACT, PLACE_GROUP, DOING_GROUP };
})();
