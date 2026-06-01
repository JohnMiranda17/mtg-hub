export const manaConcepts = [
  {
    symbol: "W",
    name: "White",
    land: "Plains",
    icon: "☀️",
    color: "#f5f0d0",
    theme: "Order, light, law, protection, life",
    description:
      "White represents order, community, and the greater good. White spells tend to be about law, protection, healing, and working together. White is great at destroying threats, gaining life, making lots of small creatures (especially with flying), and imposing rules on the game.",
    strengths: ["Removal (exile effects)", "Lifegain", "Flying creatures", "Wraths (board clears)", "Token production"],
    weaknesses: ["Card draw", "Direct damage"],
    flavor: "Think knights, angels, clerics, and holy warriors.",
  },
  {
    symbol: "U",
    name: "Blue",
    land: "Island",
    icon: "💧",
    color: "#b0d4f0",
    theme: "Knowledge, intellect, control, manipulation",
    description:
      "Blue is the color of intellect, knowledge, and trickery. Blue wants to control the game — counter spells, draw extra cards, bounce permanents back to hand, and manipulate what's on the stack. Blue creatures tend to be smaller but often have evasion like flying.",
    strengths: ["Counterspells", "Card draw", "Flying creatures", "Bounce effects", "Copying spells"],
    weaknesses: ["Removal (can't easily destroy things)", "Direct damage"],
    flavor: "Think wizards, sphinxes, merfolk, and sea creatures.",
  },
  {
    symbol: "B",
    name: "Black",
    land: "Swamp",
    icon: "💀",
    color: "#b080c0",
    theme: "Power, ambition, death, corruption",
    description:
      "Black pursues power at any cost. Black can destroy creatures, drain life, resurrect dead things from the graveyard, discard opponent's cards from their hand, and make big game-winning plays — but often at a personal cost (losing life, sacrificing creatures). Black is self-serving and ruthless.",
    strengths: ["Targeted removal", "Reanimation (graveyard recursion)", "Hand disruption (discard)", "Tutoring (searching your library)", "Drain life effects"],
    weaknesses: ["Dealing with artifacts and enchantments", "Direct damage (costs life)"],
    flavor: "Think vampires, zombies, demons, and necromancers.",
  },
  {
    symbol: "R",
    name: "Red",
    land: "Mountain",
    icon: "🔥",
    color: "#f0a060",
    theme: "Chaos, speed, impulse, destruction",
    description:
      "Red is the color of emotion, freedom, and pure aggression. Red deals direct damage (called 'burn') to creatures and players, plays fast cheap creatures with haste, destroys artifacts, and disrupts land-based strategies. Red wins by being faster and more aggressive than the opponent.",
    strengths: ["Direct damage ('burn')", "Haste creatures", "Artifact destruction", "Speed", "Copying spells"],
    weaknesses: ["Card advantage (runs out of cards quickly)", "Enchantment removal", "Life gain is rare"],
    flavor: "Think goblins, dragons, elementals, and barbarians.",
  },
  {
    symbol: "G",
    name: "Green",
    land: "Forest",
    icon: "🌿",
    color: "#80c880",
    theme: "Nature, growth, strength, instinct",
    description:
      "Green is the color of nature, growth, and raw power. Green gets more lands faster (mana ramp), plays enormous creatures, pumps creatures with +1/+1 counters, destroys artifacts and enchantments, and fights (creatures dealing damage to each other). Green wins by overwhelming the opponent with sheer size.",
    strengths: ["Mana ramp (getting extra mana)", "Large creatures", "Trample", "Artifact/enchantment removal", "Fight effects"],
    weaknesses: ["Flying", "Direct damage", "Removal (relies on fight rather than destroy)"],
    flavor: "Think elves, hydras, wurms, and beasts.",
  },
  {
    symbol: "C",
    name: "Colorless",
    land: "— (Wastes for pure colorless)",
    icon: "💎",
    color: "#c8c8c8",
    theme: "The Blind Eternities, Eldrazi, artifacts",
    description:
      "Colorless mana isn't a color — it's the absence of color. Some very powerful spells (mostly Eldrazi and artifact-themed) require colorless mana specifically. Any land can produce generic mana to pay for most costs, but colorless mana requirements ({C}) must be paid with specifically colorless sources.",
    strengths: ["Flexibility (artifacts fit in any deck)", "Eldrazi are extremely powerful"],
    weaknesses: ["Fewer dedicated support cards than colors"],
    flavor: "Think artifacts, constructs, Eldrazi, and ancient ruins.",
  },
];

export const gameZones = [
  {
    name: "Library",
    icon: "📚",
    description:
      "Your library is your deck — the shuffled stack of cards you draw from. Cards in the library are face-down and unknown (except to effects that let you look). If you need to draw but your library is empty, you lose the game. The order of your library matters — scry, surveil, and tutors let you manipulate it.",
    tip: "Keep your library secret — don't let opponents count your remaining cards (though in some situations this info is public).",
  },
  {
    name: "Hand",
    icon: "✋",
    description:
      "Your hand is the cards you're holding. Hand size is normally capped at 7 — you must discard down to 7 at the end of your turn (cleanup step). Cards in hand are private (only you see them). You play spells from your hand by casting them.",
    tip: "Card advantage — having more cards in hand than your opponent — is one of the most important strategic concepts in Magic.",
  },
  {
    name: "Battlefield",
    icon: "🗺",
    description:
      "The battlefield is where permanent cards (creatures, artifacts, enchantments, lands, planeswalkers, battles) reside when in play. Tapped permanents are turned sideways. All players share one battlefield. The battlefield is the main arena where the game is decided.",
    tip: "Your lands, creatures, and enchantments all live on the battlefield. Any opponent can interact with them through spells and abilities.",
  },
  {
    name: "Graveyard",
    icon: "⚰️",
    description:
      "The graveyard is where cards go when they're destroyed, discarded, or used (instants and sorceries go here after resolving). Graveyards are public — both players can look at any graveyard at any time. Many cards interact with graveyards (flashback, unearth, escape, etc.).",
    tip: "Order matters in graveyards. Cards must remain in the order they were placed there unless an effect says otherwise.",
  },
  {
    name: "Exile",
    icon: "🔮",
    description:
      "The exile zone is where cards go when they're 'removed from the game.' Exiled cards are generally harder to interact with than graveyard cards — most effects can't reach them. Some abilities (like flashback, foretell, and suspend) use exile as a staging area.",
    tip: "Exile is the most permanent form of removal. To deal with an indestructible or recurring threat, exile is usually your answer.",
  },
  {
    name: "Stack",
    icon: "📦",
    description:
      "The stack is where spells and abilities go when they're cast or activated, before they resolve. The stack works like a stack of plates — the last thing put on top resolves first (LIFO: last in, first out). You can cast instants and activate abilities in response to other things on the stack, creating a chain of effects.",
    tip: "When your opponent casts a spell, you can respond before it resolves. If you cast something in response, they can respond again. This can chain multiple layers deep.",
  },
  {
    name: "Command Zone",
    icon: "👑",
    description:
      "The command zone is a special zone primarily used in Commander format. Your commander lives here at the start of the game and can be cast from here. If your commander would go to the graveyard or exile, you can choose to put it in the command zone instead. Casting from the command zone costs 2 extra mana for each previous time you've done so (the commander tax).",
    tip: "The command tax stacks up — if your commander has died three times, it costs 6 more mana to cast than its printed cost.",
  },
];

export const stackAndPriority = {
  title: "The Stack & Priority",
  intro:
    "The stack is how Magic handles multiple spells and abilities happening at once. Understanding it lets you time your spells and responses correctly.",
  rules: [
    {
      rule: "LIFO (Last In, First Out)",
      description:
        "The stack resolves from top to bottom. The most recently cast spell or ability resolves first. Think of stacking plates — the last plate placed on top is the first one you take off.",
    },
    {
      rule: "Priority",
      description:
        "Players take turns having 'priority' — the right to cast spells or activate abilities. The active player (whose turn it is) gets priority first after each action. If both players pass priority in a row, the top of the stack resolves (or the phase advances if the stack is empty).",
    },
    {
      rule: "Responding to Spells",
      description:
        "After a spell is cast, each player gets priority and can respond before it resolves. You can cast an instant in response, creating a chain. Example: opponent casts Remove Target Creature on your best creature → you cast an instant to give it hexproof in response → your instant resolves (your creature now has hexproof) → opponent's spell tries to resolve but can no longer target → it fizzles.",
    },
    {
      rule: "Spells vs. Abilities",
      description:
        "Both spells (cards cast from hand) and activated/triggered abilities go on the stack and can be responded to. Exception: mana abilities resolve immediately without going on the stack.",
    },
    {
      rule: "\"Fizzle\" (Illegal Targets)",
      description:
        "If a spell is on the stack targeting something, and that target becomes illegal before the spell resolves (e.g., you exile the targeted creature), the spell 'fizzles' — it does nothing and goes to the graveyard.",
    },
  ],
};

export const combatRules = {
  title: "Combat In Depth",
  rules: [
    {
      rule: "Attacking",
      description:
        "On your turn, you may attack with any untapped creatures that don't have summoning sickness. You declare all your attackers at once. Tapped creatures can't attack. Creatures attack players or planeswalkers (or battles).",
    },
    {
      rule: "Blocking",
      description:
        "The defending player chooses which creatures block which attackers. Any untapped creature can block (even creatures with summoning sickness can block). A creature can only block one attacker normally. Multiple creatures can block one attacker.",
    },
    {
      rule: "Damage Assignment",
      description:
        "When multiple creatures block one attacker, the attacking player assigns damage in a specific order among the blockers. You must assign lethal damage to each blocker in order before moving to the next. Trample allows excess damage to go to the defending player.",
    },
    {
      rule: "Lethal Damage",
      description:
        "A creature takes lethal damage when it has damage marked on it equal to or greater than its toughness. Lethal damage creatures die at the end of the damage step, but effects can be cast before they die (in response to abilities triggered by damage).",
    },
    {
      rule: "First Strike & Double Strike",
      description:
        "First strike creatures deal their damage in a special 'first strike combat damage step' before normal damage. If a blocker dies to first strike damage, it never deals damage back. Double strike creatures deal damage in both the first-strike step and the normal step.",
    },
    {
      rule: "Trample + Deathtouch",
      description:
        "This combo is famous: deathtouch means 1 damage is lethal to any creature. Trample means excess damage goes to the player. So a 5/5 deathtouch trampler attacking into a 4/4 blocker can assign 1 damage to the blocker (lethal due to deathtouch) and 4 damage to the player.",
    },
    {
      rule: "Unblocked Creatures",
      description:
        "If an attacker is not blocked (or all its blockers are removed), it deals its power in damage directly to the defending player or planeswalker. Blocked creatures only deal damage to blockers (unless they have trample).",
    },
    {
      rule: "Combat Abilities That Trigger",
      description:
        "Abilities that say 'whenever this creature deals combat damage to a player' trigger only when the creature hits the player directly, not when it damages blockers.",
    },
  ],
};

export const deckBuilding = {
  title: "Deck Building Basics",
  rules: [
    {
      rule: "Minimum Deck Size",
      description:
        "Standard, Modern, and most formats require at least 60 cards. Commander requires exactly 100 cards (including your commander). There's no maximum size, but smaller decks are more consistent — you're more likely to draw the cards you need.",
    },
    {
      rule: "4-Copy Rule",
      description:
        "In most formats, you can run up to 4 copies of any card with the same name (except basic lands, which are unlimited). Running 4 copies maximizes the chance of drawing that card. Legendary permanents are the exception — you might run fewer because of the legend rule.",
    },
    {
      rule: "Mana Curve",
      description:
        "Your 'mana curve' describes how much mana your spells cost. An aggro (fast) deck curves low (lots of 1-2 mana spells). A control deck curves higher. A balanced curve ensures you have something to do every turn. Most good decks have 22–26 lands.",
    },
    {
      rule: "Win Conditions",
      description:
        "Every deck needs a way to win. Common win conditions: dealing 20 damage to opponent, controlling the game until they run out of cards, a combo that immediately wins, an infinitely growing creature, or accumulating enough value that they can't catch up.",
    },
    {
      rule: "Card Advantage",
      description:
        "Card advantage means having access to more cards (and thus more options) than your opponent. Spells that draw extra cards, two-for-one removals, or token generators all give card advantage. Most games are won by the player who achieves card advantage.",
    },
    {
      rule: "Synergy",
      description:
        "Good decks are built around synergies — cards that work better together than apart. Example: a deck with lots of landfall triggers wants extra ways to put lands into play. A graveyard deck wants both ways to fill the graveyard AND ways to exploit it.",
    },
  ],
};
