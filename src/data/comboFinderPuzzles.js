/* ── Combo Finder Puzzles ────────────────────────────────────────────────────
   Each puzzle presents a board state with exactly one infinite combo present.
   Distractor cards are chosen to look plausible but don't form the combo.

   combo.pieces  — card names the player must select (order-insensitive)
   combo.result  — one of the RESULT_TYPES keys
   combo.explanation — shown on correct submission
   ────────────────────────────────────────────────────────────────────────── */

export const RESULT_TYPES = {
  'infinite-mana':    '💎 Infinite Mana',
  'infinite-tokens':  '👥 Infinite Tokens',
  'infinite-damage':  '💥 Infinite Damage',
  'infinite-life':    '💚 Infinite Life/Drain',
  'infinite-draw':    '📚 Infinite Draw',
  'infinite-turns':   '🔄 Infinite Turns',
  'instant-win':      '🏆 Instant Win',
  'mill-win':         '📖 Mill Win',
  'stax-lock':        '🔒 Stax Lock',
};

export const COMBO_FINDER_PUZZLES = [
  /* ── Puzzle 1: Dramatic Scepter ─────────────────────────────────────── */
  {
    id: 1,
    title: 'The Mana Engine',
    difficulty: 'Easy',
    flavor: 'Something about this scepter feels... productive.',
    board: [
      { name: 'Isochron Scepter', note: 'Dramatic Reversal imprinted' },
      { name: 'Sol Ring' },
      { name: 'Arcane Signet' },
      { name: 'Rhystic Study' },
      { name: 'Command Tower' },
    ],
    hand: ['Counterspell', 'Brainstorm', 'Force of Will'],
    graveyard: ['Mana Leak', 'Opt'],
    exile: [],
    deck: [
      "Blue Sun's Zenith", 'Thassa\'s Oracle', 'Swan Song', 'Cyclonic Rift',
      'Mystic Remora', 'Pull from Tomorrow', 'Ponder', 'Preordain',
      'Mental Misstep', 'Mana Drain',
    ],
    mana: { W: 0, U: 2, B: 0, R: 0, G: 0, C: 1 },
    combo: {
      pieces: ['Isochron Scepter', 'Sol Ring', 'Arcane Signet'],
      result: 'infinite-mana',
      explanation: 'Isochron Scepter has Dramatic Reversal imprinted. Pay {2} to copy and cast Dramatic Reversal for free — it untaps all non-land permanents including Sol Ring and Arcane Signet. Those two produce 3 mana total; you only spent 2 to activate the Scepter. Repeat for infinite mana of any color your rocks produce.',
    },
  },

  /* ── Puzzle 2: Kiki Combo ────────────────────────────────────────────── */
  {
    id: 2,
    title: 'Mirror, Mirror',
    difficulty: 'Easy',
    flavor: 'The goblin smiled — he had just the right copy in mind.',
    board: [
      { name: 'Kiki-Jiki, Mirror Breaker' },
      { name: 'Birds of Paradise' },
      { name: 'Pestermite' },
      { name: 'Lightning Greaves' },
      { name: 'Rootbound Crag' },
    ],
    hand: ['Lightning Bolt', 'Chord of Calling', 'Stomping Ground'],
    graveyard: ['Bonecrusher Giant'],
    exile: [],
    deck: [
      'Xenagos, God of Revels', 'Huntmaster of the Fells', 'Purphoros, God of the Forge',
      'Thundermaw Hellkite', 'Ulvenwald Tracker', 'Beast Within',
    ],
    mana: { W: 0, U: 0, B: 0, R: 3, G: 2, C: 0 },
    combo: {
      pieces: ['Kiki-Jiki, Mirror Breaker', 'Pestermite'],
      result: 'infinite-tokens',
      explanation: "Activate Kiki-Jiki to copy Pestermite — the token has haste. Pestermite's ETB can tap or untap a permanent; choose to untap Kiki-Jiki. Repeat: create another hasty Pestermite copy, untap Kiki-Jiki again. You get infinite 1/2 flying haste tokens. Attack for lethal.",
    },
  },

  /* ── Puzzle 3: Oracle Consultation ─────────────────────────────────── */
  {
    id: 3,
    title: 'The Empty Library',
    difficulty: 'Easy',
    flavor: 'All knowledge becomes useless when there is nothing left to know.',
    board: [
      { name: 'Watery Grave' },
      { name: 'Mana Vault' },
      { name: 'Dimir Signet' },
      { name: 'Darkwater Catacombs' },
    ],
    hand: ["Thassa's Oracle", 'Demonic Consultation', 'Dark Ritual', 'Force of Will'],
    graveyard: ['Preordain', 'Thought Erasure'],
    exile: [],
    deck: [
      'Snapcaster Mage', 'Jin-Gitaxias, Core Augur', 'Counterspell', 'Mystical Tutor',
      'Vampiric Tutor', 'Imperial Seal', 'Swan Song', 'Cyclonic Rift',
    ],
    mana: { W: 0, U: 2, B: 2, R: 0, G: 0, C: 1 },
    combo: {
      pieces: ["Thassa's Oracle", 'Demonic Consultation'],
      result: 'instant-win',
      explanation: "Cast Demonic Consultation naming a card not in your deck (e.g. 'Emrakul'). It exiles cards one by one looking for that name — it never finds it, so your entire library gets exiled. Then cast Thassa's Oracle. Her ETB triggers: you look at the top X cards of your library where X is your devotion to blue (at least 2). Since your library is empty, you immediately win the game.",
    },
  },

  /* ── Puzzle 4: Ballista + Heliod ────────────────────────────────────── */
  {
    id: 4,
    title: 'Sun-Touched Bullets',
    difficulty: 'Easy',
    flavor: 'The god of the sun grants life — the machine of war takes it.',
    board: [
      { name: 'Heliod, Sun-Crowned' },
      { name: 'Walking Ballista', note: '3 +1/+1 counters' },
      { name: 'Llanowar Elves' },
      { name: 'Temple Garden' },
      { name: 'Savannah' },
    ],
    hand: ['Path to Exile', 'Swords to Plowshares', 'Eladamri\'s Call'],
    graveyard: ['Noble Hierarch'],
    exile: [],
    deck: [
      'Devoted Druid', 'Vizier of Remedies', 'Knight of the Reliquary',
      'Ranger of Eos', 'Gaddock Teeg',
    ],
    mana: { W: 3, U: 0, B: 0, R: 0, G: 2, C: 0 },
    combo: {
      pieces: ['Walking Ballista', 'Heliod, Sun-Crowned'],
      result: 'infinite-damage',
      explanation: "Remove a +1/+1 counter from Walking Ballista to deal 1 damage to a player. Since a player lost life, Heliod triggers: you gain 1 life. Heliod's lifegain trigger then puts a +1/+1 counter on a creature you control — put it back on Ballista. Repeat indefinitely for infinite damage to any opponent. Heliod must be a creature (5+ white devotion) or you need another way to trigger the counter-placement.",
    },
  },

  /* ── Puzzle 5: Mikaeus + Triskelion ─────────────────────────────────── */
  {
    id: 5,
    title: 'Undying Precision',
    difficulty: 'Medium',
    flavor: 'Even death cannot stop a well-designed machine.',
    board: [
      { name: 'Mikaeus, the Unhallowed' },
      { name: 'Triskelion', note: '3 +1/+1 counters' },
      { name: 'Grave Pact' },
      { name: 'Cabal Coffers' },
      { name: 'Swamp' },
    ],
    hand: ['Entomb', 'Demonic Tutor', 'Reanimate'],
    graveyard: ['Gray Merchant of Asphodel', 'Erebos, God of the Dead'],
    exile: [],
    deck: [
      'Victimize', 'Living Death', 'Sidisi, Undead Vizier', 'Ghoulcaller Gisa',
      'Noxious Gearhulk', 'Dark Ritual',
    ],
    mana: { W: 0, U: 0, B: 4, R: 0, G: 0, C: 0 },
    combo: {
      pieces: ['Mikaeus, the Unhallowed', 'Triskelion'],
      result: 'infinite-damage',
      explanation: "Triskelion enters with 3 +1/+1 counters (Mikaeus also gives it +1/+1 as a non-Human). Remove 2 counters: deal 2 damage to any target (opponents, creatures, planeswalkers). Remove the last counter: deal 1 damage to Triskelion itself. Triskelion now has 0 power and dies. Mikaeus's undying returns Triskelion with a +1/+1 counter (it now has 1 counter). Repeat from the top — each loop deals 2 damage plus resets Triskelion via undying.",
    },
  },

  /* ── Puzzle 6: Niv-Mizzet + Curiosity ───────────────────────────────── */
  {
    id: 6,
    title: 'Endless Curiosity',
    difficulty: 'Easy',
    flavor: 'The Firemind draws and burns — simultaneously.',
    board: [
      { name: 'Niv-Mizzet, Parun' },
      { name: 'Rhystic Study' },
      { name: 'Propaganda' },
      { name: 'Steam Vents' },
    ],
    hand: ['Curiosity', 'Lightning Bolt', 'Mana Drain', 'Fact or Fiction'],
    graveyard: ['Preordain', 'Izzet Signet'],
    exile: [],
    deck: [
      'Jace, the Mind Sculptor', 'Counterspell', 'Fire // Ice',
      'Electrolyze', 'Expressive Iteration', 'Blood Moon',
    ],
    mana: { W: 0, U: 3, B: 0, R: 2, G: 0, C: 0 },
    combo: {
      pieces: ['Niv-Mizzet, Parun', 'Curiosity'],
      result: 'infinite-draw',
      explanation: "Enchant Niv-Mizzet, Parun with Curiosity. Whenever you draw a card, Niv-Mizzet deals 1 damage to any target. Whenever Niv-Mizzet deals damage, Curiosity triggers: draw a card. This creates an infinite loop — draw, ping, draw, ping — until you choose to stop or your library is empty. Deal lethal damage to all opponents simultaneously.",
    },
  },

  /* ── Puzzle 7: Food Chain + Eternal Scourge ─────────────────────────── */
  {
    id: 7,
    title: 'Exile Buffet',
    difficulty: 'Medium',
    flavor: 'It feeds the chain. The chain feeds it. They are the same.',
    board: [
      { name: 'Food Chain' },
      { name: 'Sylvan Library' },
      { name: 'Birds of Paradise' },
      { name: 'Tropical Island' },
      { name: 'Bayou' },
    ],
    hand: ['Eternal Scourge', 'Craterhoof Behemoth', "Green Sun's Zenith"],
    graveyard: ['Brainstorm'],
    exile: [],
    deck: [
      'Tazri, Beacon of Unity', 'General Tazri', 'Misthollow Griffin',
      'Squee, the Immortal', 'Horizon Canopy', 'Survival of the Fittest',
    ],
    mana: { W: 0, U: 1, B: 0, R: 0, G: 3, C: 0 },
    combo: {
      pieces: ['Food Chain', 'Eternal Scourge'],
      result: 'infinite-mana',
      explanation: "Eternal Scourge has a unique ability: it can be cast from exile. Cast Eternal Scourge for {3}. Then sacrifice Eternal Scourge to Food Chain: exile it and add {4} creature mana (one more than its CMC). Recast Eternal Scourge from exile for {3} creature mana, netting {1} creature mana each loop. Repeat for infinite creature mana — which you can spend on any creature spell.",
    },
  },

  /* ── Puzzle 8: Saheeli Rai + Felidar Guardian ───────────────────────── */
  {
    id: 8,
    title: 'Copycat',
    difficulty: 'Easy',
    flavor: 'The guardian blinks, and suddenly there are infinitely many.',
    board: [
      { name: 'Saheeli Rai', note: 'loyalty: 3' },
      { name: 'Lightning Greaves' },
      { name: 'Sol Ring' },
      { name: 'Arid Mesa' },
    ],
    hand: ['Felidar Guardian', 'Path to Exile', 'Swords to Plowshares'],
    graveyard: ['Reflector Mage'],
    exile: [],
    deck: [
      'Restoration Angel', 'Eldrazi Displacer', 'Panharmonicon',
      "Chandra, Torch of Defiance", 'Wear // Tear', 'Aether Hub',
    ],
    mana: { W: 1, U: 1, B: 0, R: 2, G: 0, C: 1 },
    combo: {
      pieces: ['Saheeli Rai', 'Felidar Guardian'],
      result: 'infinite-tokens',
      explanation: "Activate Saheeli Rai's [-2]: create a token copy of Felidar Guardian that has haste. That token's ETB blinks Saheeli Rai (exile and return to battlefield — she enters with 3 loyalty). Activate Saheeli's [-2] again on the newly returned Saheeli. Repeat for infinite hasty Felidar Guardian tokens. Attack for lethal on the same turn.",
    },
  },

  /* ── Puzzle 9: Squirrel Nest + Earthcraft ───────────────────────────── */
  {
    id: 9,
    title: 'Infinite Squirrels',
    difficulty: 'Medium',
    flavor: 'The forest floor moves. It is not the leaves.',
    board: [
      { name: 'Earthcraft' },
      { name: 'Squirrel Nest', note: 'enchanting a Forest' },
      { name: 'Forest', note: 'enchanted' },
      { name: 'Llanowar Elves' },
      { name: 'Gaea\'s Cradle' },
      { name: 'Doubling Season' },
    ],
    hand: ['Overrun', 'Natural Order', 'Chord of Calling'],
    graveyard: ['Beast Within'],
    exile: [],
    deck: [
      "Avacyn's Pilgrim", 'Parallel Lives', 'Craterhoof Behemoth',
      'Sylvan Library', 'Growing Rites of Itlimoc',
    ],
    mana: { W: 0, U: 0, B: 0, R: 0, G: 4, C: 0 },
    combo: {
      pieces: ['Earthcraft', 'Squirrel Nest'],
      result: 'infinite-tokens',
      explanation: "Squirrel Nest enchants the Forest. Tap that Forest: create a 1/1 Squirrel token (this is Squirrel Nest's ability). Earthcraft lets you tap a creature to untap a basic land. Tap the Squirrel token you just created to untap the Forest (via Earthcraft). Repeat — create another Squirrel, tap it to untap the Forest. Infinite 1/1 Squirrel tokens.",
    },
  },

  /* ── Puzzle 10: Dockside + Temur Sabertooth ─────────────────────────── */
  {
    id: 10,
    title: 'Treasure Hunt',
    difficulty: 'Medium',
    flavor: 'The pirate counted the loot. It kept growing.',
    board: [
      { name: 'Temur Sabertooth' },
      { name: 'Selvala, Heart of the Wilds' },
      { name: 'Tropical Island' },
      { name: 'Taiga' },
      { name: 'Volcanic Island' },
    ],
    oppBoard: [
      { name: 'Sol Ring' },
      { name: 'Arcane Signet' },
      { name: 'Mana Vault' },
      { name: 'Chrome Mox' },
      { name: 'Smothering Tithe' },
      { name: 'Rhystic Study' },
    ],
    hand: ['Dockside Extortionist', 'Counterspell', 'Sylvan Library'],
    graveyard: ['Birds of Paradise'],
    exile: [],
    deck: [
      'Craterhoof Behemoth', 'Blightsteel Colossus', 'Vorinclex, Monstrous Raider',
      'Green Sun\'s Zenith', 'Worldly Tutor',
    ],
    mana: { W: 0, U: 2, B: 0, R: 1, G: 2, C: 0 },
    combo: {
      pieces: ['Dockside Extortionist', 'Temur Sabertooth'],
      result: 'infinite-mana',
      explanation: "Cast Dockside Extortionist ({1}{R}): its ETB creates Treasure tokens equal to the number of artifacts and enchantments opponents control. With 6 opponent permanents (Sol Ring, Signet, Vault, Mox, Smothering Tithe, Rhystic Study), you get 6 Treasures. Pay {1}{G} to use Temur Sabertooth's ability: return Dockside to your hand. Crack 3 Treasures to recast Dockside for 3 mana. Net +3 Treasures each loop. Infinite Treasure tokens → infinite mana.",
    },
  },

  /* ── Puzzle 11: Deadeye Navigator + Peregrine Drake ─────────────────── */
  {
    id: 11,
    title: 'Navigating the Skies',
    difficulty: 'Medium',
    flavor: 'Every time he landed, the lands rose to greet him.',
    board: [
      { name: 'Deadeye Navigator' },
      { name: 'Simic Signet' },
      { name: 'Breeding Pool' },
      { name: 'Tropical Island' },
      { name: 'Island' },
      { name: 'Forest' },
      { name: 'Island', note: 'untapped' },
      { name: 'Forest', note: 'untapped' },
    ],
    hand: ['Peregrine Drake', 'Counterspell', 'Cyclonic Rift'],
    graveyard: ['Ponder'],
    exile: [],
    deck: [
      'Palinchron', 'Phantasmal Image', "Blue Sun's Zenith",
      'Thassa\'s Oracle', 'Prime Speaker Zegana',
    ],
    mana: { W: 0, U: 2, B: 0, R: 0, G: 1, C: 0 },
    combo: {
      pieces: ['Deadeye Navigator', 'Peregrine Drake'],
      result: 'infinite-mana',
      explanation: "Cast Peregrine Drake — its ETB untaps up to 5 lands. Soulbond it with Deadeye Navigator. Pay {1}{U} to activate Deadeye: flicker Peregrine Drake (exile and return it to the battlefield). Drake's ETB triggers again, untapping 5 lands. You spent 2 mana for the flicker; you get back 5+ mana from the untapped lands. Net positive mana each loop. Repeat for infinite mana of any color your lands produce.",
    },
  },

  /* ── Puzzle 12: Painter's Servant + Grindstone ───────────────────────── */
  {
    id: 12,
    title: 'Colorful Oblivion',
    difficulty: 'Medium',
    flavor: 'The servant painted everything blue. The stone ground it all away.',
    board: [
      { name: "Painter's Servant", note: 'naming Blue' },
      { name: 'Grindstone' },
      { name: "Sensei's Divining Top" },
      { name: 'Goblin Engineer' },
      { name: 'Great Furnace' },
    ],
    hand: ['Gamble', 'Red Elemental Blast', 'Pyroblast'],
    graveyard: ["Goblin Welder", "Welder's Gauntlet"],
    exile: [],
    deck: [
      'Goblin Charbelcher', 'Imperial Recruiter', 'Daretti, Scrap Savant',
      'Arcum Dagsson', 'Shatterskull Smashing',
    ],
    mana: { W: 0, U: 0, B: 0, R: 3, G: 0, C: 1 },
    combo: {
      pieces: ["Painter's Servant", 'Grindstone'],
      result: 'mill-win',
      explanation: "Painter's Servant names Blue, making every card in every zone (including your opponent's library) Blue. Activate Grindstone ({3}): mill 2 cards from target player. Those 2 cards share a color (they're both Blue now), so mill 2 more. Those also share a color — mill 2 more. Repeat until the opponent's entire library is milled into their graveyard. They lose on their next draw step.",
    },
  },

  /* ── Puzzle 13: Devoted Druid + Vizier of Remedies ─────────────────── */
  {
    id: 13,
    title: 'Counter-Intuitive',
    difficulty: 'Easy',
    flavor: 'The vizier removed obstacles before they could form.',
    board: [
      { name: 'Vizier of Remedies' },
      { name: 'Llanowar Elves' },
      { name: 'Plains' },
      { name: 'Forest' },
      { name: 'Temple Garden' },
    ],
    hand: ['Devoted Druid', "Green Sun's Zenith", 'Swords to Plowshares'],
    graveyard: ['Avacyn\'s Pilgrim'],
    exile: [],
    deck: [
      'Walking Ballista', 'Chord of Calling', 'Collected Company', 'Ezuri, Renegade Leader',
      'Eternal Witness', 'Voice of Resurgence',
    ],
    mana: { W: 2, U: 0, B: 0, R: 0, G: 3, C: 0 },
    combo: {
      pieces: ['Devoted Druid', 'Vizier of Remedies'],
      result: 'infinite-mana',
      explanation: "Cast Devoted Druid. Tap it for {G}. Activate Devoted Druid's untap ability: normally, this puts a -1/-1 counter on it. However, Vizier of Remedies replaces the -1/-1 counter placement with 'nothing' — so Devoted Druid untaps for free. Tap for {G}, untap for free. Repeat for infinite {G}. Spend the mana on Walking Ballista (from the deck) for lethal.",
    },
  },

  /* ── Puzzle 14: Necrotic Ooze Pile ─────────────────────────────────── */
  {
    id: 14,
    title: 'Ooze Absorbs Everything',
    difficulty: 'Hard',
    flavor: 'The ooze reached into the grave and found its weapon.',
    board: [
      { name: 'Necrotic Ooze' },
      { name: 'Cabal Coffers' },
      { name: 'Urborg, Tomb of Yawgmoth' },
    ],
    hand: ['Entomb', 'Dark Ritual', 'Reanimate'],
    graveyard: ['Phyrexian Devourer', 'Triskelion', 'Viscera Seer'],
    exile: [],
    deck: [
      'Buried Alive', 'Sidisi, Undead Vizier', 'Mikaeus, the Unhallowed',
      'Grave Titan', 'Sheoldred, Whispering One',
    ],
    mana: { W: 0, U: 0, B: 5, R: 0, G: 0, C: 0 },
    combo: {
      pieces: ['Necrotic Ooze', 'Phyrexian Devourer', 'Triskelion'],
      result: 'infinite-damage',
      explanation: "Necrotic Ooze gains all activated abilities of creatures in all graveyards. With Phyrexian Devourer and Triskelion both in the graveyard, Ooze gains: (1) Devourer's ability — exile the top card of your library, put +1/+1 counters on Ooze equal to that card's CMC; (2) Triskelion's ability — remove a +1/+1 counter to deal 1 damage to any target. Activate Devourer ability repeatedly to load up counters, then spend counters via Triskelion ability to deal damage. The entire library's CMC worth of damage can be distributed to opponents.",
    },
  },

  /* ── Puzzle 15: Sanguine Bond + Exquisite Blood ─────────────────────── */
  {
    id: 15,
    title: 'The Eternal Exchange',
    difficulty: 'Easy',
    flavor: 'Life and death — endlessly traded between vampire and victim.',
    board: [
      { name: 'Sanguine Bond' },
      { name: 'Exquisite Blood' },
      { name: 'Vito, Thorn of the Dusk Rose' },
      { name: 'Swamp' },
      { name: 'Blood Crypt' },
    ],
    hand: ['Sorin Markov', 'Gifted Aetherborn', "Night's Whisper"],
    graveyard: ['Drana, Liberator of Malakir'],
    exile: [],
    deck: [
      'Kalitas, Traitor of Ghet', "Bloodghast", 'Olivia Voldaren',
      'Debt to the Deathless', 'Vampire Nocturnus',
    ],
    mana: { W: 0, U: 0, B: 4, R: 1, G: 0, C: 0 },
    combo: {
      pieces: ['Sanguine Bond', 'Exquisite Blood'],
      result: 'infinite-damage',
      explanation: "With both enchantments on the battlefield, gaining any life triggers the loop. Gain 1 life → Sanguine Bond triggers: an opponent loses 1 life → Exquisite Blood triggers: you gain 1 life → Sanguine Bond triggers again. The loop continues automatically until an opponent is dead. Just gain 1 life to start (e.g. cast Night's Whisper for 2 life lost, or any life gain source). Vito alone combos with Exquisite Blood in the same way.",
    },
  },
];

export function dailyPuzzle() {
  const day = Math.floor(Date.now() / 86400000);
  return COMBO_FINDER_PUZZLES[day % COMBO_FINDER_PUZZLES.length];
}
