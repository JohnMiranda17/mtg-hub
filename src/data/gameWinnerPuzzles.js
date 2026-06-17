/* ── Game Winner Puzzles ─────────────────────────────────────────────────────
   Each puzzle presents a board state where you can win THIS TURN.
   The player selects which of THEIR cards deliver the kill, picks the
   win method, and submits.

   win.cards   — exact set of YOUR card names required to win
   win.method  — key from WIN_METHODS
   win.explanation — shown on correct answer
   ────────────────────────────────────────────────────────────────────────── */

export const WIN_METHODS = {
  'combat':    '⚔️ Combat Damage',
  'burn':      '🔥 Direct Burn',
  'mixed':     '💫 Combat + Spell',
  'ability':   '⚡ Activated Ability',
  'infect':    '☠️ Infect / Poison',
  'commander': '👑 Commander Damage',
  'alt-win':   '🏆 Alternate Win Condition',
};

export const GAME_WINNER_PUZZLES = [

  /* ── 1: Aerial Superiority (Easy) ───────────────────────────────────── */
  {
    id: 1,
    title: 'Aerial Superiority',
    difficulty: 'Easy',
    flavor: 'The ground is irrelevant when you own the sky.',
    scenario: 'Your opponent has no flying or reach creatures. The angel flies over everything.',
    board: [
      { name: 'Baneslayer Angel', note: '5/5 flying, untapped' },
      { name: 'Plains' },
      { name: 'Sunpetal Grove' },
    ],
    hand: ['Path to Exile', 'Intangible Virtue'],
    graveyard: [],
    mana: { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 },
    opponent: {
      life: 5,
      board: [
        { name: 'Siege Rhino', note: '4/5, no flying' },
        { name: 'Loxodon Smiter', note: '4/4, no flying' },
      ],
    },
    win: {
      cards: ['Baneslayer Angel'],
      method: 'combat',
      explanation: 'Baneslayer Angel (5/5 flying) flies over both Siege Rhino and Loxodon Smiter — neither has flying or reach, so they cannot block a flying attacker. Attack with Baneslayer for 5 damage. Opponent is at exactly 5 life. Lethal.',
    },
  },

  /* ── 2: Three Spells One Turn (Easy) ────────────────────────────────── */
  {
    id: 2,
    title: 'Three Spells, One Life Total',
    difficulty: 'Easy',
    flavor: '"I cast. I cast. I win." — every burn player, ever.',
    scenario: 'Your opponent is at 8 life with a clear face. You have three damage spells and exactly enough mana.',
    board: [
      { name: 'Mountain' },
      { name: 'Sacred Foundry' },
      { name: 'Inspiring Vantage' },
    ],
    hand: ['Lightning Bolt', 'Chain Lightning', 'Shock', 'Deflecting Palm'],
    graveyard: ['Rift Bolt'],
    mana: { W: 0, U: 0, B: 0, R: 3, G: 0, C: 0 },
    opponent: {
      life: 8,
      board: [],
    },
    win: {
      cards: ['Lightning Bolt', 'Chain Lightning', 'Shock'],
      method: 'burn',
      explanation: 'Cast all three damage spells at your opponent: Lightning Bolt (3) + Chain Lightning (3) + Shock (2) = 8 damage total. Your opponent is at exactly 8 life. Deflecting Palm is a defensive trick and cannot deal damage to the opponent on its own — it redirects damage dealt to you, which isn\'t relevant here.',
    },
  },

  /* ── 3: Haste and Punish (Easy) ─────────────────────────────────────── */
  {
    id: 3,
    title: 'Haste and Punish',
    difficulty: 'Easy',
    flavor: 'The guide runs ahead. The bolt follows.',
    scenario: 'Goblin Guide can attack immediately. Monastery Swiftspear is tapped and can\'t. One attack plus one bolt is the exact winning line.',
    board: [
      { name: 'Goblin Guide', note: 'haste — can attack now' },
      { name: 'Monastery Swiftspear', note: 'tapped — cannot attack' },
      { name: 'Mountain' },
    ],
    hand: ['Lightning Bolt', 'Searing Blood', 'Mutagenic Growth'],
    graveyard: [],
    mana: { W: 0, U: 0, B: 0, R: 1, G: 0, C: 0 },
    opponent: {
      life: 5,
      board: [],
    },
    win: {
      cards: ['Goblin Guide', 'Lightning Bolt'],
      method: 'mixed',
      explanation: 'Attack with Goblin Guide (2/2 haste) — it deals 2 combat damage. Monastery Swiftspear is tapped and cannot attack. After combat, cast Lightning Bolt targeting your opponent for 3 more damage. 2 (combat) + 3 (bolt) = 5 = exact lethal.',
    },
  },

  /* ── 4: The Rancid Trampler (Easy) ──────────────────────────────────── */
  {
    id: 4,
    title: 'The Rancid Trampler',
    difficulty: 'Easy',
    flavor: 'Rancor turns any blocker into a speed bump.',
    scenario: 'Carnage Tyrant already has trample. Rancor gives it enough extra power to trample through the blocker for exact lethal.',
    board: [
      { name: 'Carnage Tyrant', note: '7/6 hexproof, trample' },
      { name: 'Forest' },
      { name: 'Stomping Ground' },
    ],
    hand: ['Rancor', 'Blossoming Defense', 'Llanowar Elves'],
    graveyard: [],
    mana: { W: 0, U: 0, B: 0, R: 0, G: 1, C: 0 },
    opponent: {
      life: 5,
      board: [
        { name: 'Loxodon Smiter', note: '4/4' },
      ],
    },
    win: {
      cards: ['Carnage Tyrant', 'Rancor'],
      method: 'combat',
      explanation: 'Cast Rancor ({G}) on Carnage Tyrant — it becomes 9/6 with trample. Attack: your opponent blocks with Loxodon Smiter (4/4). With trample, you assign exactly 4 damage to the blocker (its toughness — enough to kill it), and the remaining 9 − 4 = 5 damage tramples through to your opponent. 5 trample damage with opponent at 5 life = exact lethal.',
    },
  },

  /* ── 5: One Attacker, Seven Damage (Medium) ─────────────────────────── */
  {
    id: 5,
    title: 'One Attacker, Seven Damage',
    difficulty: 'Medium',
    flavor: 'She attacks alone. She never needs help.',
    scenario: 'Sublime Archangel grants exalted to every other creature you control. When she attacks alone, each of your other creatures pumps her.',
    board: [
      { name: 'Sublime Archangel', note: '4/3 flying; grants exalted to others' },
      { name: 'Llanowar Elves', note: 'has exalted via Archangel' },
      { name: "Avacyn's Pilgrim", note: 'has exalted via Archangel' },
      { name: 'Birds of Paradise', note: 'has exalted via Archangel' },
    ],
    hand: ['Rootborn Defenses', 'Overrun', 'Selesnya Charm'],
    graveyard: [],
    mana: { W: 2, U: 0, B: 0, R: 0, G: 1, C: 0 },
    opponent: {
      life: 7,
      board: [
        { name: 'Ghor-Clan Rampager', note: '4/4, no flying' },
        { name: 'Boros Reckoner', note: '3/3, no flying' },
      ],
    },
    win: {
      cards: ['Sublime Archangel'],
      method: 'combat',
      explanation: 'Declare Sublime Archangel as your only attacker. She triggers three exalted abilities (from Llanowar Elves, Avacyn\'s Pilgrim, and Birds of Paradise — all given exalted by her ability). She becomes 7/6 flying. Neither opponent creature has flying or reach, so neither can block her. 7 unblocked damage with opponent at 7 life = exact lethal.',
    },
  },

  /* ── 6: Token Overrun (Medium) ──────────────────────────────────────── */
  {
    id: 6,
    title: 'Token Overrun',
    difficulty: 'Medium',
    flavor: 'Quality is irrelevant when you have enough quantity — and a spell that makes quantity quality.',
    scenario: 'Five 1/1 tokens look harmless. After Overrun, four of them swing unblocked for exactly lethal.',
    board: [
      { name: 'Soldier Token', note: '1/1 ×5 (untapped)' },
      { name: 'Sunpetal Grove' },
      { name: 'Temple Garden' },
    ],
    hand: ['Overrun', 'Chord of Calling', 'Rootborn Defenses'],
    graveyard: [],
    mana: { W: 0, U: 0, B: 0, R: 0, G: 5, C: 0 },
    opponent: {
      life: 12,
      board: [
        { name: 'Thragtusk', note: '5/3' },
      ],
    },
    win: {
      cards: ['Soldier Token', 'Overrun'],
      method: 'mixed',
      explanation: 'Cast Overrun ({3}{G}{G} = 5 mana): all creatures you control get +3/+3 and trample until end of turn. Your five 1/1 Soldiers become 4/4 trampling creatures. Declare all five as attackers. Your opponent blocks one with Thragtusk (5/3, toughness 3): the 4/4 trample token assigns 3 damage to Thragtusk (lethal to its 3 toughness), and the remaining 1 damage tramples through. The other four tokens are unblocked: 4 × 4 = 16 damage. Total damage to opponent: 1 (trample) + 16 (unblocked) = 17. Opponent is at 12 life. 17 > 12 = lethal.',
    },
  },

  /* ── 7: Protection Beatdown (Medium) ────────────────────────────────── */
  {
    id: 7,
    title: 'Protected Beatdown',
    difficulty: 'Medium',
    flavor: 'The crusader walks through the enemy untouched.',
    scenario: 'Every blocker your opponent has is green or black. Neither color can block a creature with protection from it.',
    board: [
      { name: 'Mirran Crusader', note: '2/2 double strike, pro-black, pro-green' },
      { name: 'Plains' },
      { name: 'Brushland' },
    ],
    hand: ['Become Immense', 'Path to Exile', 'Intangible Virtue'],
    graveyard: [
      'Lightning Bolt', 'Brainstorm', 'Ponder',
      'Opt', 'Preordain', 'Serum Visions',
    ],
    mana: { W: 0, U: 0, B: 0, R: 0, G: 1, C: 0 },
    opponent: {
      life: 15,
      board: [
        { name: 'Llanowar Elves', note: 'green — cannot block pro-green' },
        { name: 'Nantuko Shade', note: 'black — cannot block pro-black' },
        { name: 'Tarmogoyf', note: 'green — cannot block pro-green' },
      ],
    },
    win: {
      cards: ['Mirran Crusader', 'Become Immense'],
      method: 'combat',
      explanation: 'Cast Become Immense ({G}, delving the 6 cards in your graveyard to reduce the cost): Mirran Crusader becomes 8/8 double strike. Attack: Mirran Crusader has protection from black AND green — all three opponent creatures (Llanowar Elves, Nantuko Shade, and Tarmogoyf) are green or black and cannot block it. Crusader swings unblocked with double strike: first-strike damage 8 + regular damage 8 = 16 total combat damage. Opponent is at 15 life. 16 > 15 = lethal.',
    },
  },

  /* ── 8: Commander Lethal (Medium) ───────────────────────────────────── */
  {
    id: 8,
    title: 'The Final Swing',
    difficulty: 'Medium',
    flavor: 'Eighteen. And counting.',
    scenario: 'Your commander has dealt 18 damage to this opponent — just 3 short of the 21 needed. Your opponent\'s only creature is tapped and cannot block.',
    board: [
      { name: 'Rafiq of the Many', note: '3/3 double strike; 18 cmd dmg this game' },
      { name: 'Llanowar Elves', note: 'has exalted via Rafiq' },
      { name: 'Birds of Paradise', note: 'has exalted via Rafiq' },
      { name: 'Breeding Pool' },
    ],
    hand: ['Worldly Tutor', 'Swords to Plowshares'],
    graveyard: [],
    mana: { W: 1, U: 1, B: 0, R: 0, G: 1, C: 0 },
    opponent: {
      life: 20,
      commanderDamage: 18,
      board: [
        { name: 'Thragtusk', note: '5/3 — tapped, cannot block' },
      ],
    },
    win: {
      cards: ['Rafiq of the Many'],
      method: 'commander',
      explanation: 'Attack with Rafiq of the Many alone. He triggers 2 exalted abilities (from Llanowar Elves and Birds of Paradise, both granted exalted by Rafiq\'s ability). Rafiq becomes 5/5 double strike for the turn. Thragtusk is tapped and cannot block. Rafiq hits your opponent\'s face unblocked: double strike deals 5 damage in the first-strike step and 5 more in regular combat. The first strike alone delivers 5 commander damage, bringing the total to 18 + 5 = 23 ≥ 21. Your opponent loses from commander damage.',
    },
  },

  /* ── 9: Wolf Run (Hard) ─────────────────────────────────────────────── */
  {
    id: 9,
    title: 'The Wolf Run',
    difficulty: 'Hard',
    flavor: 'The run is not an attack. It is a sentence.',
    scenario: 'Your opponent survives at 3 life behind multiple ground blockers. Kessig Wolf Run can pump your creature to trample through exactly.',
    board: [
      { name: 'Wild Nacatl', note: '3/3' },
      { name: 'Kessig Wolf Run', note: 'land: {X}{R}{G}: target creature gets +X/+0 and trample' },
      { name: 'Forest' },
      { name: 'Forest' },
      { name: 'Mountain' },
    ],
    hand: ['Path to Exile', 'Lightning Bolt', 'Mutagenic Growth'],
    graveyard: [],
    mana: { W: 0, U: 0, B: 0, R: 1, G: 4, C: 0 },
    opponent: {
      life: 3,
      board: [
        { name: 'Elvish Mystic', note: '1/1' },
        { name: 'Burning-Tree Emissary', note: '2/2' },
        { name: 'Mayor of Avabruck', note: '1/1' },
      ],
    },
    win: {
      cards: ['Wild Nacatl', 'Kessig Wolf Run'],
      method: 'ability',
      explanation: 'Activate Kessig Wolf Run with X = 3: pay {3}{R}{G} = 5 mana (you have {R} + {G}{G}{G}{G} = 5 available). Wild Nacatl gains +3/+0 and trample, becoming 6/3. Declare Wild Nacatl as your attacker. Your opponent blocks with Burning-Tree Emissary (2/2) — best block to absorb the most damage. Nacatl must assign 2 damage to the Emissary (lethal to its 2 toughness), and 6 − 2 = 4 damage tramples through to your opponent. 4 trample damage with opponent at 3 life = 4 > 3 = lethal. Lightning Bolt and Mutagenic Growth are distractors.',
    },
  },

  /* ── 10: Infect Swing (Hard) ─────────────────────────────────────────── */
  {
    id: 10,
    title: 'Ten Drops of Poison',
    difficulty: 'Hard',
    flavor: 'Seven are already in their blood. They need three more.',
    scenario: 'Your opponent has 7 poison counters and needs 10 to lose. Blighted Agent is unblockable — it just needs to deal 3 infect damage.',
    board: [
      { name: 'Blighted Agent', note: '1/1 infect, unblockable' },
      { name: 'Breeding Pool' },
      { name: 'Forest' },
    ],
    hand: ['Mutagenic Growth', 'Distortion Strike', 'Spell Pierce'],
    graveyard: [],
    mana: { W: 0, U: 0, B: 0, R: 0, G: 1, C: 0 },
    opponent: {
      life: 16,
      poisonCounters: 7,
      board: [
        { name: 'Leatherback Baloth', note: '4/5, no flying' },
        { name: 'Thrun, the Last Troll', note: '4/4 hexproof regenerate' },
      ],
    },
    win: {
      cards: ['Blighted Agent', 'Mutagenic Growth'],
      method: 'infect',
      explanation: 'Cast Mutagenic Growth (pay {G}): Blighted Agent becomes 3/3 infect. Since Blighted Agent is unblockable, no creature can stop it — not the Leatherback Baloth, not the hexproof Thrun. Attack: deals 3 infect damage (poison counters) to your opponent. 7 + 3 = 10. A player at 10 or more poison counters loses the game. Distortion Strike would only give +1/+0 (2 infect), which brings the total to 9 — one short. You need Mutagenic Growth specifically to hit 10.',
    },
  },

  /* ── 11: The Saint's Blessing (Hard) ────────────────────────────────── */
  {
    id: 11,
    title: "The Saint's Blessing",
    difficulty: 'Hard',
    flavor: 'Geist is bait. The angel is the knife.',
    scenario: 'Geist of Saint Traft looks like it\'ll get blocked. But when it attacks, it brings a flying angel token with it.',
    board: [
      { name: 'Geist of Saint Traft', note: '2/2 hexproof; when it attacks: create 4/4 flying Angel token also attacking' },
      { name: 'Hallowed Fountain' },
      { name: 'Celestial Colonnade' },
    ],
    hand: ['Spell Snare', 'Mana Leak', 'Celestial Purge'],
    graveyard: [],
    mana: { W: 1, U: 1, B: 0, R: 0, G: 0, C: 0 },
    opponent: {
      life: 4,
      board: [
        { name: 'Ghor-Clan Rampager', note: '4/4, no flying' },
        { name: 'Huntmaster of the Fells', note: '2/2, no flying' },
      ],
    },
    win: {
      cards: ['Geist of Saint Traft'],
      method: 'combat',
      explanation: "Attack with Geist of Saint Traft. Its trigger creates a 4/4 white Angel token with flying that is also attacking. Your opponent has two blockers, both without flying. They can block Geist with Ghor-Clan Rampager (Geist dies — it has hexproof from spells and abilities but can still be blocked and killed in combat). The Angel token (4/4 flying) cannot be blocked by either ground creature. It deals 4 unblocked damage. Opponent is at 4 life. 4 = exact lethal.",
    },
  },

  /* ── 12: Banefire Finish (Easy) ─────────────────────────────────────── */
  {
    id: 12,
    title: 'Uncounterable Finish',
    difficulty: 'Easy',
    flavor: "At X ≥ 5, even counterspells can't save them.",
    scenario: 'Your opponent is tapped out at 6 life. You have Banefire and enough mana to finish it.',
    board: [
      { name: 'Mountain' },
      { name: 'Mountain' },
      { name: 'Stomping Ground' },
      { name: 'Sacred Foundry' },
      { name: 'Blood Crypt' },
      { name: 'Mountain' },
      { name: 'Mountain' },
    ],
    hand: ['Banefire', 'Skullcrack', 'Searing Blaze'],
    graveyard: ['Lightning Bolt', 'Goblin Guide'],
    mana: { W: 0, U: 0, B: 0, R: 7, G: 0, C: 0 },
    opponent: {
      life: 6,
      board: [],
    },
    win: {
      cards: ['Banefire'],
      method: 'burn',
      explanation: 'Cast Banefire with X = 6: total cost is {6}{R} = 7 mana, which you have. Banefire deals 6 damage. Because X ≥ 5, the damage cannot be countered or prevented. Opponent is at 6 life. Exact lethal. Skullcrack (3 damage for {1}{R}) and Searing Blaze (1–3 damage for {1}{R}) cannot reach 6 alone, even combined.',
    },
  },

  /* ── 13: Double Combat (Medium) ─────────────────────────────────────── */
  {
    id: 13,
    title: 'Double Combat',
    difficulty: 'Medium',
    flavor: 'The Warleader never stops at one.',
    scenario: 'Aurelia has haste and flying. Your opponent has only a ground blocker. Two combat phases means double the damage.',
    board: [
      { name: 'Aurelia, the Warleader', note: '3/4 flying, first strike, vigilance, haste; untapped' },
      { name: 'Plains' },
      { name: 'Sacred Foundry' },
    ],
    hand: ['Wear // Tear', 'Boros Charm', 'Lightning Helix'],
    graveyard: [],
    mana: { W: 1, U: 0, B: 0, R: 1, G: 0, C: 0 },
    opponent: {
      life: 6,
      board: [
        { name: 'Kalonian Tusker', note: '3/3, no flying' },
      ],
    },
    win: {
      cards: ['Aurelia, the Warleader'],
      method: 'combat',
      explanation: "Aurelia has flying and haste so she can attack immediately. Your opponent's only creature (Kalonian Tusker) has no flying, so it cannot block Aurelia. Aurelia's triggered ability: the first time she attacks each turn, after combat, untap all creatures you control and get an additional combat phase. First combat: Aurelia swings unblocked for 3 (first-strike damage hits, but since unblocked all damage is first-strike = 3). Second combat: Aurelia untaps and attacks again for 3 more. Total: 3 + 3 = 6 = exact lethal.",
    },
  },

  /* ── 14: Prowess Finish (Medium) ────────────────────────────────────── */
  {
    id: 14,
    title: 'Prowess Finish',
    difficulty: 'Medium',
    flavor: 'Two spells first. Then the kill.',
    scenario: 'Monastery Swiftspear grows with every spell. Cast two spells to pump her, then attack for the exact lethal damage.',
    board: [
      { name: 'Monastery Swiftspear', note: '1/2 prowess, haste, untapped' },
      { name: 'Mountain' },
      { name: 'Inspiring Vantage' },
    ],
    hand: ['Lightning Bolt', 'Shock', 'Mutagenic Growth', 'Skullcrack'],
    graveyard: ['Goblin Guide'],
    mana: { W: 0, U: 0, B: 0, R: 2, G: 0, C: 0 },
    opponent: {
      life: 8,
      board: [],
    },
    win: {
      cards: ['Monastery Swiftspear', 'Lightning Bolt', 'Shock'],
      method: 'mixed',
      explanation: 'Cast Lightning Bolt ({R}) targeting your opponent (3 damage). Monastery Swiftspear\'s prowess triggers: +1/+0 until EOT, she becomes 2/2. Cast Shock ({R}) targeting your opponent (2 more damage). Prowess triggers again: +1/+0, she becomes 3/2. Attack with Swiftspear (3/2 haste) — no blockers, 3 combat damage. Total: 3 (Bolt) + 2 (Shock) + 3 (attack) = 8 = exact lethal. Mutagenic Growth and Skullcrack are distractors.',
    },
  },

  /* ── 15: The Horde Breaks Through (Hard) ────────────────────────────── */
  {
    id: 15,
    title: 'The Horde Breaks Through',
    difficulty: 'Hard',
    flavor: 'No wall is wide enough for five giants.',
    scenario: 'Craterhoof Behemoth just entered — its ETB gave all your creatures +5/+5 and trample. Your opponent has one huge blocker. Four of your creatures swing through unblocked for exactly lethal.',
    board: [
      { name: 'Craterhoof Behemoth', note: '10/10 trample (was 5/5; +5 from ETB with 5 creatures)' },
      { name: 'Llanowar Elves', note: '6/6 trample (was 1/1 + 5)' },
      { name: 'Elvish Mystic', note: '6/6 trample (was 1/1 + 5)' },
      { name: 'Selvala, Heart of the Wilds', note: '6/8 trample (was 1/3 + 5)' },
      { name: 'Avenger of Zendikar', note: '10/10 trample (was 5/5 + 5)' },
      { name: "Gaea's Cradle" },
    ],
    hand: ['Worldly Tutor', 'Heroic Intervention'],
    graveyard: [],
    mana: { W: 0, U: 0, B: 0, R: 0, G: 4, C: 0 },
    opponent: {
      life: 20,
      board: [
        { name: 'Blightsteel Colossus', note: '11/11 trample infect' },
      ],
    },
    win: {
      cards: ['Craterhoof Behemoth', 'Llanowar Elves', 'Elvish Mystic', 'Selvala, Heart of the Wilds', 'Avenger of Zendikar'],
      method: 'combat',
      explanation: 'Declare all five creatures as attackers. Your opponent has one blocker: Blightsteel Colossus (11/11). They block Avenger of Zendikar (10/10 trample): Avenger deals 10 damage to Blightsteel (not enough to kill its 11 toughness so 0 trample through), Blightsteel deals 11 infect to Avenger (dies). The other four attack unblocked: Craterhoof (10) + Llanowar Elves (6) + Elvish Mystic (6) + Selvala (6) = 28 damage. Opponent is at 20 life. 28 > 20 = lethal.',
    },
  },
];

export function dailyGamePuzzle() {
  const day = Math.floor(Date.now() / 86400000);
  return GAME_WINNER_PUZZLES[day % GAME_WINNER_PUZZLES.length];
}
