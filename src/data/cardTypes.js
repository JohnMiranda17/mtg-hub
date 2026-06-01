export const cardTypes = [
  {
    name: "Land",
    icon: "🏔",
    color: "#4a7c59",
    description:
      "Lands are your mana sources — they produce mana to pay for other spells. You can play one land per turn from your hand (normally). Lands don't have a mana cost themselves. Basic lands (Plains, Island, Swamp, Mountain, Forest) each produce one specific color of mana. Non-basic lands often produce multiple colors or have special abilities.",
    speed: "One per turn, any time during your main phase",
    subtypes: ["Plains", "Island", "Swamp", "Mountain", "Forest"],
    tips: [
      "Don't miss your land drops — playing a land every turn for the first several turns is almost always correct.",
      "You can play a land before or after casting spells, or even after combat.",
      "Lands don't go to the graveyard when they tap — tapping is not the same as sacrificing.",
    ],
  },
  {
    name: "Creature",
    icon: "🐉",
    color: "#7a4f3a",
    description:
      "Creatures are permanent cards that represent beings that fight for you. They have a power/toughness stat in the bottom right (e.g., 3/4 means power 3, toughness 4). Power is attack damage; toughness is how much damage it can take. Creatures can attack, block, and have special abilities.",
    speed: "Sorcery speed (main phase only, your turn only)",
    subtypes: ["Human, Elf, Dragon, Zombie, Angel, Soldier, Wizard, and hundreds more"],
    tips: [
      "Creatures get 'summoning sickness' when they first enter — they can't attack or use tap abilities until your next turn (unless they have haste).",
      "A creature with 0 toughness or lethal damage on it dies and goes to the graveyard.",
      "Creatures can have multiple subtypes (e.g., 'Human Wizard') and multiple types (e.g., 'Artifact Creature').",
    ],
  },
  {
    name: "Instant",
    icon: "⚡",
    color: "#3a6b8a",
    description:
      "Instants are one-time spells you can cast at almost any time — during your turn, your opponent's turn, during combat, even in response to other spells. They resolve immediately and then go to the graveyard. Instants are the most flexible spell type in the game.",
    speed: "Instant speed — any time you have priority",
    subtypes: [],
    tips: [
      "Holding up mana during your opponent's turn suggests you might have an instant — this creates 'threat of interaction' even if you don't.",
      "You can cast instants in response to other spells on the stack.",
      "The golden rule: if it's on the stack, you can respond. If it's already resolved, you can't undo it.",
    ],
  },
  {
    name: "Sorcery",
    icon: "📜",
    color: "#7a3a7a",
    description:
      "Sorceries are one-time spells with powerful effects, but they can only be cast during your main phase when nothing else is on the stack. They go to the graveyard after resolving. Sorceries tend to be more impactful than instants because of this restriction — their power is balanced by inflexibility.",
    speed: "Sorcery speed — your main phase only, when the stack is empty",
    subtypes: [],
    tips: [
      "Cast sorceries during your second main phase when possible — you've already committed to combat and know what threats you're facing.",
      "You can't cast a sorcery in response to your opponent's spell — you need to wait until the stack is clear.",
    ],
  },
  {
    name: "Enchantment",
    icon: "✨",
    color: "#8a6a3a",
    description:
      "Enchantments are permanent spells that stay on the battlefield and provide ongoing effects. Global enchantments affect the game state continuously. Aura enchantments attach to another permanent (like a creature) to modify it. Sagas are a special type of enchantment that tell a story over multiple turns.",
    speed: "Sorcery speed (main phase only)",
    subtypes: ["Aura", "Saga", "Curse", "Background"],
    tips: [
      "Auras are risky — if the enchanted creature is removed, the Aura goes with it (your opponent just got 2-for-1).",
      "Global enchantments (not Auras) stick around as long as your opponent doesn't remove them specifically.",
      "Some enchantments have ongoing costs — you pay them during your upkeep or the enchantment goes away.",
    ],
  },
  {
    name: "Artifact",
    icon: "⚙️",
    color: "#7a7a7a",
    description:
      "Artifacts are permanent cards representing magical objects, constructs, and mechanical devices. They're usually colorless. Some artifacts are creatures (Artifact Creatures), some tap for mana (Mana Rocks), some attach to creatures (Equipment), and some are Vehicles. Artifacts are vulnerable to artifact removal spells.",
    speed: "Sorcery speed (main phase only, unless they have flash)",
    subtypes: ["Equipment", "Vehicle", "Food", "Treasure", "Clue"],
    tips: [
      "Colorless artifacts can go in any deck — they're among the most flexible cards in the game.",
      "Equipment stays on the battlefield if the equipped creature dies — unlike Auras.",
      "'Mana rocks' (artifacts that tap for mana) are essential in Commander for fast mana.",
    ],
  },
  {
    name: "Planeswalker",
    icon: "🌟",
    color: "#3a7a6a",
    description:
      "Planeswalkers represent powerful allies — other planeswalker characters from the Magic lore. They have loyalty counters and loyalty abilities (+/−). You can use one loyalty ability per turn. Opponents can attack planeswalkers directly. If loyalty reaches 0, the planeswalker dies. They're treated as players in some respects.",
    speed: "Sorcery speed (main phase only)",
    subtypes: ["Jace, Chandra, Liliana, Garruk, Ajani, Teferi, Nissa, and more"],
    tips: [
      "You can only use ONE loyalty ability per planeswalker per turn, and only on your turn.",
      "Planeswalkers can be attacked directly — your opponent can choose to send creatures at them instead of you.",
      "Planeswalkers are 'legendary' — if two copies of the same planeswalker are on the battlefield, both go to the graveyard (the 'legend rule').",
    ],
  },
  {
    name: "Battle",
    icon: "⚔️",
    color: "#8a4a3a",
    description:
      "Battles are the newest card type introduced in March of the Machine (2023). You cast a battle, choose an opponent as its protector, and attack it like a planeswalker. When all its defense counters are removed, you get a powerful effect and the card transforms. The opponent whose battle it is may block attackers targeting it.",
    speed: "Sorcery speed (main phase only)",
    subtypes: ["Siege"],
    tips: [
      "Battles are brand new — many players haven't seen them. Think of them as 'objectives' you race to complete.",
      "You attack your own battles (the opponent defends them) to flip them.",
    ],
  },
];

export const supertypes = [
  {
    name: "Legendary",
    description:
      "Only one copy of a legendary permanent with the same name can exist on the battlefield at once. If two legendaries with the same name are ever on the battlefield, their controller must put all but one into the graveyard (the 'legend rule'). In Commander format, legendary creatures serve as your commander.",
    tip: "In Commander, your general must be legendary. In other formats, the legend rule makes running 4 copies of legendary creatures risky.",
  },
  {
    name: "Basic",
    description:
      "Only basic lands (Plains, Island, Swamp, Mountain, Forest) have the basic supertype. Basic lands are the only lands you can run more than 4 copies of in a deck. Some effects that search for 'a basic land' only find these.",
    tip: "You can have as many basic lands as you want in a deck — no 4-copy limit.",
  },
  {
    name: "Snow",
    description:
      "Snow permanents are from sets set in snowy environments (Coldsnap, Kaldheim). They can produce snow mana ({S}) and some cards have effects that require snow mana. Otherwise they function normally.",
    tip: "Snow is a niche type — mostly relevant in specific draft formats or theme decks.",
  },
  {
    name: "Token",
    description:
      "Token permanents are created by spells and abilities, not played from hand. They have the token supertype. Tokens cease to exist when they leave the battlefield — they don't go to graveyards and they don't go to hands.",
    tip: "Death triggers still fire when tokens 'die' — the token just disappears afterward instead of going to the graveyard.",
  },
];
