/* Learning Hub – Ollie the owl, drawn once (kit/ollie.js).
   🔒 Kas, 28 Nov 2026: there is one Ollie, the guide in every game. Every game draws him from here:
     - Sentence Studio rigs him for its scenes (writing/sentences/friends.js uses Ollie.C, Ollie.WING,
       Ollie.headMarkup() and Ollie.rigMarkup(); its engine moves the parts marked data-k).
     - Games without that engine use Ollie.still(): the same parts, posed (wings at the shoulders, eyes open),
       with class hooks for simple moves:
         .o-all (everything)  .o-feet  .o-wing .o-wl / .o-wr (wings)  .o-head  .o-pupils  .o-lids  .o-beak
       Ollie.still({ y: 56 })            moves him down so his feet are at y = 56 (Ask and Find Out, Patterns)
       Ollie.still({ lids: true })       includes the eyelids (for blinking; the game hides them at first)
       Ollie.still({ flap: true })       adds .wing-l / .wing-r to the wings (Patterns' flapping "Watch me" owl)
   Feet at (0, 0); about 112 units tall. Never draw another owl: change him here. */
(function () {
  'use strict';

  var C = { body: '#A0704F', d: '#7A5038', belly: '#F6E1BF', b: '#F0A33A', bD: '#D9892A', eye: '#2A2440' };
  var WING = 'M0 0 C-11 4 -17 22 -14 42 C-12 50 -7 54 -3 50 C-1 55 5 55 6 49 C10 36 9 13 0 0Z';
  var FEATHER = '<path d="M-6 14 Q-9 26 -8 36 M-1 18 Q-3 30 -2 42" fill="none" stroke="#A97D5C" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>';

  function ears() {
    return '<path d="M-33 -82L-29 -111L-11 -95Z" fill="' + C.d + '" stroke="' + C.d + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M33 -82L29 -111L11 -95Z" fill="' + C.d + '" stroke="' + C.d + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<ellipse cx="0" cy="-72" rx="38" ry="26" fill="' + C.body + '"/>' +
      '<ellipse cx="-12" cy="-88" rx="14" ry="6" fill="#fff" opacity=".1"/>';
  }
  function eyes(lids, pupilsAttr) {
    return '<circle cx="-15" cy="-69" r="17.5" fill="' + C.belly + '"/><circle cx="15" cy="-69" r="17.5" fill="' + C.belly + '"/>' +
      '<circle cx="-15" cy="-69" r="11.5" fill="#fff"/><circle cx="15" cy="-69" r="11.5" fill="#fff"/>' +
      '<g ' + pupilsAttr + '><circle cx="-12.5" cy="-68" r="6.5" fill="' + C.eye + '"/><circle cx="17.5" cy="-68" r="6.5" fill="' + C.eye + '"/>' +
      '<circle cx="-10" cy="-70.5" r="2.3" fill="#fff"/><circle cx="20" cy="-70.5" r="2.3" fill="#fff"/></g>' + lids;
  }
  function beakAndCheeks(beakAttr) {
    return '<path d="M-6 -58L6 -58L0 -51Z" fill="' + C.b + '" stroke="' + C.b + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<g ' + beakAttr + '><path d="M-4.5 -52.5L4.5 -52.5L0 -47Z" fill="' + C.bD + '" stroke="' + C.bD + '" stroke-width="2" stroke-linejoin="round"/></g>' +
      '<ellipse cx="-27" cy="-55" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/><ellipse cx="27" cy="-55" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/>';
  }
  function feet(attr) {
    return '<g ' + attr + '><ellipse cx="-13" cy="-5" rx="9" ry="5" fill="' + C.b + '"/><ellipse cx="13" cy="-5" rx="9" ry="5" fill="' + C.b + '"/>' +
      '<path d="M-19 -3 v3 M-13 -2 v3.5 M-7 -3 v3 M7 -3 v3 M13 -2 v3.5 M19 -3 v3" stroke="' + C.bD + '" stroke-width="2" stroke-linecap="round"/></g>';
  }
  function tummy() {
    return '<ellipse cx="0" cy="-52" rx="40" ry="47" fill="' + C.body + '"/>' +
      '<ellipse cx="0" cy="-35" rx="26" ry="27" fill="' + C.belly + '"/>' +
      '<ellipse cx="-16" cy="-80" rx="12" ry="9" fill="#fff" opacity=".08"/>' +
      '<path d="M-11 -42l4.5 4.5 4.5-4.5M2 -42l4.5 4.5 4.5-4.5M-4.5 -30l4.5 4.5 4.5-4.5" fill="none" stroke="#D2AE84" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function wingShape(mirror) {
    return '<g transform="' + (mirror ? 'scale(-1,1) ' : '') + 'rotate(14)"><path d="' + WING + '" fill="' + C.d + '"/>' + FEATHER + '</g>';
  }

  /* The head for Sentence Studio's rig (and its face picture): the parts its engine moves are marked data-k. */
  function headMarkup() {
    return ears() +
      '<g data-k="ofaceX">' +
      eyes('<g data-k="lidL"><ellipse cx="-15" cy="-69" rx="12.6" ry="12.6" fill="' + C.belly + '"/></g>' +
        '<g data-k="lidR"><ellipse cx="15" cy="-69" rx="12.6" ry="12.6" fill="' + C.belly + '"/></g>' +
        '<path data-k="shutL" d="M-23 -70 Q-15 -63 -7 -70" fill="none" stroke="' + C.eye + '" stroke-width="2.6" stroke-linecap="round" opacity="0"/>' +
        '<path data-k="shutR" d="M7 -70 Q15 -63 23 -70" fill="none" stroke="' + C.eye + '" stroke-width="2.6" stroke-linecap="round" opacity="0"/>' +
        '<path data-k="hapL" d="M-22 -67 Q-15 -76 -8 -67" fill="none" stroke="' + C.eye + '" stroke-width="3" stroke-linecap="round" opacity="0"/>' +
        '<path data-k="hapR" d="M8 -67 Q15 -76 22 -67" fill="none" stroke="' + C.eye + '" stroke-width="3" stroke-linecap="round" opacity="0"/>',
        'data-k="pupils"') +
      beakAndCheeks('data-k="beakLo"') +
      '</g>';
  }

  /* The whole owl for Sentence Studio's rig. */
  function rigMarkup() {
    return '<g data-k="obody">' +
      feet('data-k="feet"') +
      '<g data-k="wingL">' + wingShape(false) + '</g>' +
      '<g data-k="wingR">' + wingShape(true) + '</g>' +
      tummy() +
      '<g data-k="ohead">' + headMarkup() + '</g>' +
      '<g data-k="ohold"></g>' +
      '<g data-k="owingFront" opacity="0"><path data-k="wfL" d="M-40 -46 Q-30 -40 -26 -26 Q-25 -16 -32 -15 Q-40 -18 -42 -30Z" fill="' + C.d + '"/>' +
      '<path data-k="wfR" d="M40 -46 Q30 -40 26 -26 Q25 -16 32 -15 Q40 -18 42 -30Z" fill="' + C.d + '"/></g>' +
      '</g>';
  }

  /* A posed Ollie for games without the rig (see the top of this file). */
  function still(o) {
    o = o || {};
    var lids = o.lids
      ? '<g class="o-lids"><ellipse class="o-lid" cx="-15" cy="-69" rx="12.6" ry="12.6" fill="' + C.belly + '"/>' +
        '<ellipse class="o-lid" cx="15" cy="-69" rx="12.6" ry="12.6" fill="' + C.belly + '"/></g>'
      : '';
    var wl = 'class="o-wing o-wl' + (o.flap ? ' wing-l' : '') + '"', wr = 'class="o-wing o-wr' + (o.flap ? ' wing-r' : '') + '"';
    return '<g transform="translate(0 ' + (o.y || 0) + ')"><g class="o-all">' +
      feet('class="o-feet"') +
      '<g transform="translate(-31 -66)"><g ' + wl + ' transform="rotate(3)">' + wingShape(false) + '</g></g>' +
      '<g transform="translate(31 -66)"><g ' + wr + ' transform="rotate(-3)">' + wingShape(true) + '</g></g>' +
      tummy() +
      '<g class="o-head">' + ears() + eyes(lids, 'class="o-pupils"') + beakAndCheeks('class="o-beak"') + '</g>' +
      '</g></g>';
  }

  window.Ollie = { C: C, WING: WING, headMarkup: headMarkup, rigMarkup: rigMarkup, still: still };
})();
