export const keywords = [
  // ── EVASION ──────────────────────────────────────────────────────────────
  {
    name: "Flying",
    category: "Evasion",
    type: "Keyword Ability",
    reminder: "This creature can't be blocked except by creatures with flying or reach.",
    description:
      "Flying creatures soar above the battlefield. Your opponent can only block them with other creatures that have flying (they also fly) or reach (they can stretch up to grab flyers). Most angels, birds, dragons, and faeries have flying.",
  },
  {
    name: "Reach",
    category: "Evasion",
    type: "Keyword Ability",
    reminder: "This creature can block creatures with flying.",
    description:
      "A creature with reach can block flying creatures even though it doesn't fly itself. Think of it as a creature tall enough — or with long enough arms, tentacles, or webs — to swat flyers out of the sky. Reach creatures can't fly over blockers themselves.",
  },
  {
    name: "Menace",
    category: "Evasion",
    type: "Keyword Ability",
    reminder: "This creature can't be blocked except by two or more creatures.",
    description:
      "A menacing creature is so threatening that it takes at least two defenders to stop it. Your opponent must assign two or more of their creatures to block it, or it gets through unblocked. This lets it punch through even if your opponent has lots of small creatures.",
  },
  {
    name: "Intimidate",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can't be blocked except by artifact creatures and/or creatures that share a color with it.",
    description:
      "Only artifact creatures (colorless mechanical creatures) or creatures of the same color as the intimidating creature can block it. This ability is no longer used in new sets — it was replaced by Menace — but you'll still see it on older cards.",
  },
  {
    name: "Fear",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can't be blocked except by artifact creatures and/or black creatures.",
    description:
      "Only artifact creatures or black creatures can block a creature with fear. Similar to intimidate but color-locked to black. A very old ability, retired in favor of intimidate and then menace.",
  },
  {
    name: "Shadow",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can block or be blocked only by creatures with shadow.",
    description:
      "Shadow creatures exist in a separate plane of existence. They can only interact with other shadow creatures in combat — they can't block non-shadow creatures and can't be blocked by them. Almost exclusively a Tempest block mechanic.",
  },

  // ── COMBAT BONUSES ────────────────────────────────────────────────────────
  {
    name: "First Strike",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder: "This creature deals combat damage before creatures without first strike.",
    description:
      "In a normal fight, both creatures deal damage at the same time. First strike breaks that rule — the first-strike creature deals its damage first. If that damage is enough to destroy the blocker, the blocker never gets to deal its damage back.",
  },
  {
    name: "Double Strike",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "This creature deals both first strike and regular combat damage.",
    description:
      "Double strike combines first strike and normal combat damage. The creature deals its power in damage in the first-strike step, then again in the normal combat damage step. This means a 2/2 with double strike effectively deals 4 damage in combat.",
  },
  {
    name: "Trample",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "This creature can deal excess combat damage to the player or planeswalker it's attacking.",
    description:
      "When a trampling creature attacks and is blocked, it only needs to assign lethal damage to the blocker(s). Any leftover damage crashes through to the defending player or planeswalker. Without trample, blocking even a tiny 1/1 absorbs all the damage from a 10/10.",
  },
  {
    name: "Deathtouch",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder: "Any amount of damage this creature deals is enough to destroy the creature it damages.",
    description:
      "Normally, a creature must deal damage equal to or greater than another creature's toughness to destroy it. With deathtouch, even 1 damage from this creature is lethal. A 1/1 with deathtouch can trade with a 10/10 in combat — the 10/10 takes 1 damage and dies instantly.",
  },
  {
    name: "Lifelink",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Damage dealt by this creature also causes you to gain that much life.",
    description:
      "Whenever a creature with lifelink deals damage — to a player, a creature, or a planeswalker — you gain that much life. It works in combat, from effects, and from abilities. A 3/3 with lifelink that hits the opponent gains you 3 life.",
  },
  {
    name: "Vigilance",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder: "Attacking doesn't cause this creature to tap.",
    description:
      "Normally when a creature attacks, it taps (turns sideways). Tapped creatures can't block. Vigilance means the creature stays untapped even while attacking, so it can attack AND be available to block on your opponent's next turn.",
  },
  {
    name: "Haste",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "This creature can attack and use activated abilities with [T] as soon as it comes under your control.",
    description:
      "Normally, a creature you play must wait a full turn before attacking or using tap abilities — this is called 'summoning sickness.' Haste removes that restriction. A creature with haste can attack the very turn it enters the battlefield.",
  },

  // ── PROTECTION ────────────────────────────────────────────────────────────
  {
    name: "Hexproof",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "This permanent can't be the target of spells or abilities your opponents control.",
    description:
      "Your opponents can't aim spells or abilities at a hexproof creature (or player). They can't target it with removal like 'Destroy target creature' or enchant it with an Aura they control. However, board-wide effects that don't target (like 'Destroy all creatures') still affect it.",
  },
  {
    name: "Shroud",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "This permanent can't be the target of spells or abilities.",
    description:
      "Like hexproof, but stricter — shroud prevents everyone (including you!) from targeting the permanent. You can't buff your own shroud creature with Auras or targeted pump spells. Shroud has mostly been replaced by hexproof in modern sets.",
  },
  {
    name: "Indestructible",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "This permanent can't be destroyed by damage or by effects that say 'destroy.'",
    description:
      "Indestructible permanents can't be destroyed. Effects that say 'destroy target creature' fail, and even lethal damage doesn't kill them (damage is marked but the creature doesn't die from it). However, indestructible creatures CAN be beaten through other means: exile effects (Path to Exile, Swords to Plowshares) remove them permanently; -X/-X effects (Toxic Deluge, Mutilate) that reduce toughness to 0 kill them; bounce effects (Unsummon) return them to hand; and critically, sacrifice effects bypass indestructible entirely — a player or effect that forces a creature to be sacrificed completely ignores indestructible.",
  },
  {
    name: "Protection",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "Protection from [quality]: Can't be Damaged, Enchanted/Equipped, Blocked, or Targeted by anything of that quality (DEBT).",
    description:
      "Protection is remembered with the acronym DEBT — the protected creature can't be Damaged by, Enchanted/Equipped by, Blocked by, or Targeted by anything matching the protected quality. 'Protection from red' means red spells and red creatures can't damage it, target it, block it, or attach to it.",
  },
  {
    name: "Ward",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "Whenever this permanent becomes the target of a spell or ability an opponent controls, counter it unless that player pays [cost].",
    description:
      "Ward punishes opponents for targeting your permanent. When they aim a spell or ability at your creature, they must pay an extra cost — often mana — or the spell is countered. Ward {2} means they must pay 2 more mana or lose their spell.",
  },

  // ── SPEED & TIMING ────────────────────────────────────────────────────────
  {
    name: "Flash",
    category: "Speed & Timing",
    type: "Keyword Ability",
    reminder: "You may cast this spell any time you could cast an instant.",
    description:
      "Flash lets you play a permanent at instant speed — including during your opponent's turn, in response to their spells, or at the end of their turn. Creatures with flash are called 'flash creatures' and are great for surprising opponents and holding up mana for interaction.",
  },

  // ── ACTIVATED/TRIGGERED ABILITIES ─────────────────────────────────────────
  {
    name: "Tap (Symbol)",
    category: "Activated Abilities",
    type: "Keyword Symbol",
    reminder: "[T]: Tap this permanent as part of its activation cost.",
    description:
      "The tap symbol (a sideways arrow) appears in activated ability costs. To use the ability, you tap the permanent (turn it sideways). Tapped permanents can't attack or block, and can't be tapped again until untapped. Most lands tap for mana using this symbol.",
  },
  {
    name: "Cycling",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder: "Cycling [cost]: Discard this card; draw a card.",
    description:
      "If you have a cycling card in hand that you don't want right now, you can pay its cycling cost, discard it, and draw a new card. It replaces itself and keeps your hand fresh. Some cycling cards also trigger bonus effects when cycled.",
  },
  {
    name: "Kicker",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Kicker [cost]: You may pay an optional extra cost when casting this spell for a bonus effect.",
    description:
      "When you cast a spell with kicker, you can choose to pay an additional cost on top of the regular cost. Doing so gives you an enhanced version of the effect. Kicker gives spells flexibility — you play them normally early game and kick them for full value later when you have more mana.",
  },
  {
    name: "Flashback",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Flashback [cost]: You may cast this card from your graveyard for its flashback cost. Exile it afterward.",
    description:
      "A spell with flashback can be cast a second time from your graveyard by paying the flashback cost instead of its normal cost. After you flashback a card, it's exiled (removed from the game permanently). This is essentially a 'do it twice' card.",
  },
  {
    name: "Madness",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Madness [cost]: If you discard this card, you may cast it for its madness cost instead of putting it into your graveyard.",
    description:
      "If you're forced to discard a card with madness, you can instead pay its madness cost to cast it right away. The card goes to exile temporarily while you cast it, then to the graveyard normally afterward.",
  },
  {
    name: "Escape",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Escape [cost], Exile [N] other cards from your graveyard: You may cast this card from your graveyard.",
    description:
      "Escape lets you replay a card from your graveyard by paying an alternate cost and exiling several other cards from your graveyard as additional payment. Great in graveyard-focused strategies.",
  },
  {
    name: "Foretell",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Foretell {2}: During your turn, you may pay {2} and exile this card from your hand face down.",
    description:
      "Foretell is a two-step process: first, pay 2 mana to hide the card in exile face-down. On a future turn, you can cast it from exile for its reduced foretell cost. It lets you 'bank' cards and cast them cheaper later.",
  },
  {
    name: "Suspend",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Suspend [N] — [cost]: Exile this card with N time counters. At the start of each of your upkeeps, remove one time counter. When the last counter is removed, cast it for free.",
    description:
      "Suspend lets you cast a powerful spell cheaply now by 'suspending' it in time — it enters exile with several time counters on it. Each of your upkeeps, one counter is removed. When the last counter is removed, you cast the spell for free.",
  },
  {
    name: "Morph",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "You may cast this card face down as a 2/2 creature for {3}. Turn it face up at any time for its morph cost.",
    description:
      "Morph lets you play a creature as a mysterious face-down 2/2 for just 3 mana, hiding its true identity. At any time, you can pay the morph cost to flip it face up and reveal its actual power, toughness, and abilities. Great for bluffing and surprises.",
  },
  {
    name: "Convoke",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Convoke: Your creatures can help cast this spell. Each creature you tap while casting this spell pays for {1} or one mana of that creature's color.",
    description:
      "Convoke lets you tap your own creatures as if they were mana to help pay for a spell. Each tapped creature reduces the cost by 1 generic mana (or one mana of its color). Lets you play big spells much earlier if you have creatures on board.",
  },
  {
    name: "Delve",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Delve: Each card you exile from your graveyard while casting this spell pays for {1}.",
    description:
      "Delve lets you exile cards from your graveyard to reduce the casting cost of a spell. Each card exiled pays for 1 generic mana. With a full graveyard, the cost reduction can be substantial.",
  },

  // ── TRIGGERED ABILITIES ───────────────────────────────────────────────────
  {
    name: "Landfall",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Whenever a land enters the battlefield under your control, [effect].",
    description:
      "Landfall is triggered each time you play or put a land onto the battlefield. Cards with landfall usually get a bonus — like +2/+2 until end of turn, gaining life, or creating a token — each time you do. Playing extra lands in a turn triggers it multiple times.",
  },
  {
    name: "Prowess",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn.",
    description:
      "Prowess rewards you for casting spells. Each time you cast an instant, sorcery, enchantment, or artifact spell (anything that isn't a creature), all your prowess creatures get +1/+1 until end of turn. This stacks — casting three spells gives +3/+3.",
  },
  {
    name: "Persist",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "When this creature dies, if it had no -1/-1 counters on it, return it to the battlefield with a -1/-1 counter on it.",
    description:
      "When a persist creature dies (goes to the graveyard), it comes back to the battlefield with a -1/-1 counter on it — but only if it didn't already have a -1/-1 counter. This means most persist creatures effectively die twice before staying dead.",
  },
  {
    name: "Undying",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "When this creature dies, if it had no +1/+1 counters on it, return it to the battlefield with a +1/+1 counter on it.",
    description:
      "Similar to persist but opposite — undying creatures come back with a +1/+1 counter instead of -1/-1. The returned creature is bigger than before. Again, it only triggers if the creature didn't already have a +1/+1 counter.",
  },
  {
    name: "Scry",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Scry N: Look at the top N cards of your library, then put any number of them on the bottom and the rest back on top in any order.",
    description:
      "Scry lets you look at the top cards of your deck and decide which ones stay on top (you'll draw them soon) and which go to the bottom (you don't want them now). It's a form of card selection — you don't draw extra cards, but you pick the best ones coming up.",
  },
  {
    name: "Surveil",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Surveil N: Look at the top N cards of your library, then put any number of them into your graveyard and the rest back on top in any order.",
    description:
      "Like scry, but instead of only choosing what goes to the bottom, you can send cards to the graveyard. This fills your graveyard intentionally — useful for flashback, escape, delve, and other graveyard strategies.",
  },
  {
    name: "Proliferate",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Proliferate: Choose any number of permanents and/or players, then give each another counter of a kind it already has.",
    description:
      "Proliferate lets you add one more of any existing counter type to any permanent or player that already has at least one counter of that type. This doubles down on poison counters, +1/+1 counters, loyalty counters on planeswalkers, and more.",
  },
  {
    name: "Explore",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Explore: Reveal the top card of your library. If it's a land, put it into your hand. If not, put a +1/+1 counter on the exploring creature, then put the card back or into your graveyard.",
    description:
      "When a creature explores, it looks at the top of your deck. If it's a land you get a free land in hand. If not, the creature gets a +1/+1 counter. Either way you get value.",
  },
  {
    name: "Enlist",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Enlist: As this creature attacks, you may tap a nonattacking creature you control that has no summoning sickness. If you do, add its power to this creature's until end of turn.",
    description:
      "When your enlisting creature attacks, you can tap another creature (that isn't attacking and doesn't have summoning sickness) to boost the attacker's power by that creature's power until end of turn.",
  },
  {
    name: "Training",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Whenever this creature attacks with another creature that has greater power, put a +1/+1 counter on this creature.",
    description:
      "Training triggers whenever you attack with this creature alongside a stronger ally. The creature with training grows — it 'learns' from the bigger creature beside it.",
  },
  {
    name: "Raid",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Raid — [effect if you attacked with a creature this turn].",
    description:
      "Raid is an ability word that marks a bonus that applies if you attacked with at least one creature during your turn. Raid cards usually get a bonus when you play them after attacking.",
  },
  {
    name: "Spectacle",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Spectacle [cost]: You may cast this spell for its spectacle cost instead if an opponent lost life this turn.",
    description:
      "If an opponent lost life this turn (from your creatures, spells, or anything else), you can cast a spectacle spell at its reduced spectacle cost.",
  },
  {
    name: "Dredge",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Dredge N: If you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.",
    description:
      "Instead of drawing your normal card for the turn, you can 'dredge' — put N cards from your library into your graveyard and return the dredge card from your graveyard to your hand. You effectively redraw the same card while filling your graveyard.",
  },

  // ── CREATURE TYPES & ROLES ────────────────────────────────────────────────
  {
    name: "Defender",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder: "This creature can't attack.",
    description:
      "Creatures with defender are purely defensive — they can never be declared as attackers. They can still block normally and use other abilities. Walls almost always have defender. Some have high toughness to form an almost impenetrable barrier.",
  },
  {
    name: "Partner",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Partner: You can have two commanders in Commander format if both have partner.",
    description:
      "In the Commander format, you normally choose one legendary creature as your commander. Partner lets you pair two partner-capable legendary creatures together, giving you a two-commander team. This is a Commander-specific ability.",
  },
  {
    name: "Infect",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "This creature deals damage to creatures in the form of -1/-1 counters and to players in the form of poison counters.",
    description:
      "Infect changes how damage works. Against creatures, infect damage becomes -1/-1 counters instead of damage. Against players, infect deals poison counters instead of life loss. A player with 10 or more poison counters loses the game, regardless of their life total.",
  },
  {
    name: "Wither",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "This creature deals damage to creatures in the form of -1/-1 counters.",
    description:
      "Like infect, but only applies to creatures — wither turns combat damage into -1/-1 counters. Unlike infect, wither still deals normal damage to players. A creature weakened by wither can die if its toughness reaches 0.",
  },
  {
    name: "Flanking",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Whenever a creature without flanking blocks this creature, the blocker gets -1/-1 until end of turn.",
    description:
      "Flanking is an older ability. When a creature without flanking blocks a flanking creature, the blocker gets -1/-1 until end of turn. This weakens or kills many smaller blockers. Mostly seen in Mirage-era sets.",
  },

  // ── ALTERNATIVE COSTS & SPECIAL CASTING ──────────────────────────────────
  {
    name: "Overload",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Overload [cost]: If you pay the overload cost, change 'target' to 'each' in the spell's text.",
    description:
      "Overload turns a targeted spell into a spell that hits everything. Instead of hitting one target, you pay the larger overload cost and the spell affects all valid targets. A 'bounce target creature' spell becomes 'bounce all creatures' when overloaded.",
  },
  {
    name: "Bestow",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Bestow [cost]: You may cast this card as an Aura for its bestow cost. It enchants a creature. If the enchanted creature leaves, this becomes a creature.",
    description:
      "Bestow lets you cast a creature as an Aura enchantment on one of your creatures instead. It pumps the creature's stats and gives it the bestowed creature's abilities. If the enchanted creature leaves, the bestow card 'falls off' and becomes a creature on its own — you don't lose both cards.",
  },
  {
    name: "Emerge",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Emerge [cost]: You may cast this spell by sacrificing a creature and paying the emerge cost minus that creature's mana value.",
    description:
      "Emerge is an alternative casting cost that lets you sacrifice a creature to reduce the cost of a large spell. The creature's mana value is subtracted from the emerge cost. Great for getting big creatures into play early.",
  },
  {
    name: "Storm",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Storm: When you cast this spell, copy it for each spell cast before it this turn.",
    description:
      "Storm is one of Magic's most explosive mechanics. When a storm spell is cast, it creates a copy of itself for every single spell cast earlier that turn. Cast 5 spells before a storm spell and you get 5 more copies — all for free.",
  },
  {
    name: "Replicate",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Replicate [cost]: When you cast this spell, you may pay its replicate cost any number of times. Each payment creates a copy.",
    description:
      "Replicate lets you pay an extra cost multiple times when casting a spell. Each time you pay the replicate cost, you get an additional copy of the spell. Unlike storm, you control how many copies you make.",
  },

  // ── TOKENS & COUNTERS ──────────────────────────────────────────────────────
  {
    name: "Counters (General)",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "+1/+1 counters add 1 to power and toughness. -1/-1 counters reduce both. Loyalty counters track planeswalker loyalty.",
    description:
      "Counters are markers placed on permanents or players that track various game states. +1/+1 counters make creatures stronger permanently. -1/-1 counters weaken them. Loyalty counters on planeswalkers track their current loyalty level. Many abilities use specific named counters (time, charge, quest, etc.).",
  },
  {
    name: "Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Tokens are creature (or other permanent) representations created by spells and abilities. They're not cards.",
    description:
      "Tokens are permanents (usually creatures) that are created by spells or abilities. They exist on the battlefield but aren't cards — if they leave the battlefield for any reason (die, get exiled, return to hand), they simply disappear. Common tokens: 1/1 Soldiers, 2/2 Zombies, 1/1 Birds with flying.",
  },
  {
    name: "Treasure Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Treasure: An artifact token with '{T}, Sacrifice this: Add one mana of any color.'",
    description:
      "Treasure tokens are special artifact tokens that can be tapped and sacrificed to add one mana of any color. They're essentially temporary mana rocks. Very useful for ramping into big spells or fixing your mana in multicolor decks.",
  },
  {
    name: "Food Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Food: An artifact token with '{2}, {T}, Sacrifice this: You gain 3 life.'",
    description:
      "Food tokens are artifact tokens that cost 2 mana to activate, sacrificing them to gain 3 life. They're usually generated by creature abilities and represent snacks in the Eldraine setting. Some cards care specifically about food tokens.",
  },
  {
    name: "Clue Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Clue: An artifact token with '{2}, Sacrifice this: Draw a card.'",
    description:
      "Clue tokens are artifact tokens that can be sacrificed for 2 mana to draw a card. They represent investigation in Innistrad's mystery-themed sets. Very powerful as a source of additional card draw.",
  },

  // ── MECHANICS ─────────────────────────────────────────────────────────────
  {
    name: "Regenerate",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Regenerate [cost]: The next time this creature would be destroyed this turn, instead tap it, remove all damage from it, and remove it from combat.",
    description:
      "Regenerate is an older ability that lets a creature survive destruction once. When you pay the regeneration cost, you create a 'shield' — the next time the creature would die from damage or a destroy effect, instead it taps, damage is removed, and it's taken out of combat. Note: indestructible has largely replaced regenerate in modern sets.",
  },
  {
    name: "Equip",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Equip [cost]: Attach this equipment to target creature you control. Activate only as a sorcery.",
    description:
      "Equipment is a subtype of artifact that attaches to creatures to make them stronger. You pay the equip cost to move the equipment to a creature you control. You can reattach equipment to different creatures throughout the game. If the equipped creature dies, the equipment stays on the battlefield.",
  },
  {
    name: "Enchant",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Enchant [permanent type]: This Aura can only be attached to that type of permanent.",
    description:
      "Aura enchantments have 'Enchant' to specify what they can be attached to. 'Enchant creature' means it goes on a creature, 'Enchant land' on a land, etc. When you cast an Aura, you target the permanent it'll enchant. If the enchanted permanent leaves the battlefield, the Aura goes to the graveyard.",
  },
  {
    name: "Crew",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Crew N: Tap any number of creatures you control with total power N or greater: This Vehicle becomes an artifact creature until end of turn.",
    description:
      "Vehicles are artifact cards that sit inert until crewed. By tapping creatures with total power equal to or greater than the crew number, the Vehicle becomes a creature for the turn. Vehicles are balanced by requiring creatures to be tapped each turn to activate them.",
  },
  {
    name: "Saga",
    category: "Mechanics",
    type: "Card Type",
    reminder:
      "Sagas enter with a lore counter; add another at the start of your draw step. Each chapter triggers when the matching lore counter number is reached. Sacrifice after the final chapter.",
    description:
      "Sagas are enchantments that tell a story over multiple turns. When a Saga enters, it gets a lore counter (I). Each of your draw steps (before drawing), you add another lore counter, triggering that chapter's effect. When you hit the final chapter, the Saga is sacrificed after the effect.",
  },
  {
    name: "Transform",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Transform: Turn this double-faced card over to its other face.",
    description:
      "Transform flips a double-faced card to its other side. The front face usually has a condition that causes it to transform — like 'When you cast your third spell, transform this.' The back face is often a completely different card type or a much stronger version.",
  },
  {
    name: "Mill",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Mill N: Put the top N cards of a library into that player's graveyard.",
    description:
      "Milling means sending cards from the top of a player's library directly to their graveyard. A player who needs to draw but has no cards in their library loses the game — so milling enough can win the game. Mill is also used to fuel graveyard strategies.",
  },
  {
    name: "Goad",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Goad: Until your next turn, the goaded creature attacks each combat if able and attacks a player other than you if able.",
    description:
      "Goading a creature forces it to attack on its controller's next turn (if able) and to attack someone other than you. In multiplayer formats like Commander, this redirects a threat toward another opponent.",
  },
  {
    name: "Cascade",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Cascade: When you cast this spell, exile cards from the top of your library until you exile a nonland card with lesser mana value. You may cast it without paying its cost. Put the exiled cards on the bottom in a random order.",
    description:
      "Cascade gives you a free bonus spell every time you cast the cascade card. You flip through your deck until you find a spell with lower mana value than the cascade card, then cast it for free. Very powerful value engine that can chain into multiple spells.",
  },

  // ── EVASION (continued) ───────────────────────────────────────────────────
  {
    name: "Horsemanship",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can't be blocked except by creatures with horsemanship.",
    description:
      "Horsemanship works exactly like flying, except for horses instead of the sky. A creature with horsemanship can only be blocked by another creature with horsemanship. It appears almost exclusively on cards from Portal: Three Kingdoms (1999), a set based on the historical Chinese novel Romance of the Three Kingdoms.",
  },
  {
    name: "Landwalk",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "Islandwalk / Swampwalk / etc.: This creature can't be blocked as long as the defending player controls a [land type].",
    description:
      "Landwalk abilities — Islandwalk, Swampwalk, Forestwalk, Mountainwalk, Plainswalk — make a creature unblockable if the defending player controls that type of land. Islandwalk means the creature is unblockable if your opponent controls any Island. These abilities are most common on older cards and are no longer printed in Standard sets.",
  },
  {
    name: "Skulk",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can't be blocked by creatures with greater power.",
    description:
      "A creature with skulk sneaks through — it can only be blocked by creatures with equal or lesser power. If you have a 1/1 with skulk, your opponent can't block it with their 3/3.",
  },

  // ── COMBAT BONUSES (continued) ────────────────────────────────────────────
  {
    name: "Exalted",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Whenever a creature you control attacks alone, it gets +1/+1 until end of turn.",
    description:
      "Exalted triggers each time you attack with exactly one creature. If multiple creatures have exalted, all of them trigger — so a lone attacker with three exalted permanents on your side gets +3/+3. The key is the creature must attack alone; attacking with multiple creatures turns off the bonus for that combat.",
  },
  {
    name: "Myriad",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Whenever this creature attacks, for each other opponent, create a token that's a copy of this creature attacking that player or a planeswalker they control. Exile the tokens at end of combat.",
    description:
      "Myriad is a Commander-focused ability. When a creature with myriad attacks one player, token copies of it appear attacking each other opponent simultaneously. All those tokens deal damage at once, then vanish at end of combat. It's a way to apply pressure to everyone at the table with one swing.",
  },
  {
    name: "Bushido",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Bushido N: Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.",
    description:
      "Bushido (the way of the warrior) gives a creature a temporary power and toughness boost whenever it's involved in combat — either blocking or being blocked. Bushido 2 means the creature gets +2/+2. Mostly found on Samurai creatures from the original Kamigawa block (2004–2005).",
  },
  {
    name: "Rampage",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Rampage N: Whenever this creature becomes blocked, it gets +N/+N until end of turn for each creature blocking it beyond the first.",
    description:
      "Rampage rewards being gang-blocked. For each blocker beyond the first assigned to this creature, it gets +N/+N until end of turn. A creature with Rampage 2 blocked by three creatures gets +4/+4 (two extra blockers × 2). Older ability from early Magic sets.",
  },

  // ── PROTECTION (continued) ────────────────────────────────────────────────
  {
    name: "Totem Armor",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "If enchanted creature would be destroyed, instead remove all damage from it and destroy this Aura.",
    description:
      "Totem armor is found on Aura enchantments. If the creature it's enchanting would be destroyed, the Aura is destroyed instead and all damage is removed from the creature. This makes the enchanted creature very hard to remove — opponents need multiple removal spells or exile effects to deal with it.",
  },

  // ── SPEED & TIMING (continued) ────────────────────────────────────────────
  {
    name: "Ninjutsu",
    category: "Speed & Timing",
    type: "Keyword Ability",
    reminder:
      "Ninjutsu [cost]: Return an unblocked attacker you control to hand: Put this card onto the battlefield from your hand tapped and attacking.",
    description:
      "Ninjutsu lets you swap a Ninja card from your hand with one of your unblocked attackers at instant speed — after blockers are declared. You return the unblocked creature to your hand and the Ninja enters the battlefield already tapped and attacking, sneaking through unblocked. The ninja then deals combat damage to the player.",
  },
  {
    name: "Dash",
    category: "Speed & Timing",
    type: "Keyword Ability",
    reminder:
      "Dash [cost]: You may cast this spell for its dash cost. If you do, it gains haste, and you return it to its owner's hand at the beginning of the next end step.",
    description:
      "Dash lets you cast a creature cheaply for a hit-and-run attack. It enters with haste so it can attack immediately, then bounces back to your hand at the start of the end step. You get the attack, then get the creature back to use again next turn.",
  },

  // ── ACTIVATED ABILITIES (continued) ──────────────────────────────────────
  {
    name: "Evoke",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Evoke [cost]: You may cast this spell for its evoke cost. If you do, it's sacrificed when it enters the battlefield.",
    description:
      "Evoke lets you cast a creature cheaply just for its enters-the-battlefield effect. You pay the evoke cost (less than normal), the creature enters, triggers its ability, then is immediately sacrificed. You don't keep the creature — you're just paying for the ability.",
  },
  {
    name: "Unearth",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Unearth [cost]: Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step or if it would leave the battlefield. Activate only as a sorcery.",
    description:
      "Unearth brings a creature back from the graveyard temporarily. The creature enters with haste (can attack immediately), but at the end of the turn it's exiled permanently — you can't unearth the same creature again.",
  },
  {
    name: "Retrace",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Retrace: You may cast this card from your graveyard by discarding a land card in addition to paying its other costs.",
    description:
      "Retrace lets you cast a spell from your graveyard repeatedly by paying its normal cost plus discarding a land. As long as you have lands to discard, you can keep recasting the same spell. Great in decks that generate lots of lands.",
  },
  {
    name: "Rebound",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Rebound: If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it. At the beginning of your next upkeep, you may cast this card for free.",
    description:
      "Rebound gives a spell an automatic free second cast. When you cast a rebound card from hand, it goes to exile instead of the graveyard. At the start of your next upkeep, you can cast it again for free. Effectively doubles the impact of one-time effects.",
  },
  {
    name: "Jumpstart",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Jumpstart: You may cast this card from your graveyard by discarding a card in addition to paying its other costs. Then exile this card.",
    description:
      "Jumpstart lets you recast a spell from the graveyard one more time by discarding any card as an additional cost. After it resolves via jumpstart, it's exiled — so you get exactly two casts total (once from hand, once from graveyard).",
  },
  {
    name: "Blitz",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Blitz [cost]: If you cast this spell for its blitz cost, it gains haste and 'when this creature dies, draw a card,' and you sacrifice it at the beginning of the next end step.",
    description:
      "Blitz is a cheaper, temporary way to play a creature. Cast it for the blitz cost, get an immediate haste attacker, and draw a card when it dies (or is sacrificed at end of turn). Great for aggressive decks that want tempo.",
  },
  {
    name: "Level Up",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Level up [cost]: Put a level counter on this creature. Activate only as a sorcery.",
    description:
      "Level Up creatures start small but grow more powerful as you spend mana to add level counters over time. The card shows different power/toughness and abilities depending on how many level counters it has. A long-term investment that pays off after several turns.",
  },
  {
    name: "Echo",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Echo [cost]: At the beginning of your upkeep, if this came under your control since the beginning of your last upkeep, sacrifice it unless you pay its echo cost.",
    description:
      "Echo is an upkeep tax. You cast a creature, and on your next upkeep you must pay the echo cost again or sacrifice it. The creature usually has a below-rate cost compared to its power — the echo cost is the 'installment payment.' If you can't or don't want to pay, you lose the creature.",
  },
  {
    name: "Cumulative Upkeep",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Cumulative upkeep [cost]: At the beginning of your upkeep, put an age counter on this permanent, then sacrifice it unless you pay its upkeep cost for each age counter on it.",
    description:
      "Cumulative upkeep grows more expensive every turn. You put an age counter on the permanent each upkeep and pay the cost multiplied by the total counter count. Turn 1: pay 1. Turn 2: pay 2. Turn 3: pay 3. Eventually the cost becomes unaffordable and you sacrifice it. Mostly found in older sets.",
  },
  {
    name: "Improvise",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Improvise: Your artifacts can help cast this spell. Each artifact you tap while casting this spell pays for {1}.",
    description:
      "Improvise is like convoke for artifacts. When casting a spell with improvise, you can tap your artifacts to help pay for it — each tapped artifact reduces the generic mana cost by 1. Great in artifact-heavy decks that want to deploy big spells early.",
  },

  // ── TRIGGERED ABILITIES (continued) ──────────────────────────────────────
  {
    name: "Heroic",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Heroic — Whenever you cast a spell that targets this creature, [effect].",
    description:
      "Heroic triggers every time you cast a spell that targets the heroic creature — pump spells, Auras, protection effects, anything that aims at it. Each heroic creature has a unique effect when triggered. The Theros sets were built around targeting your own creatures to build powerful individual champions.",
  },
  {
    name: "Evolve",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Whenever a creature enters the battlefield under your control, if that creature has greater power or toughness than this creature, put a +1/+1 counter on this creature.",
    description:
      "Evolve triggers when a stronger creature joins your team. If the new creature has higher power OR higher toughness than the evolving creature, it grows with a +1/+1 counter. As you keep adding bigger creatures, your evolving creatures keep getting stronger.",
  },
  {
    name: "Renown",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Renown N: When this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counters on it and it becomes renowned.",
    description:
      "Renown triggers the first time a creature successfully deals combat damage to a player. It gets N +1/+1 counters and becomes 'renowned' — a permanent status tracked on the card. It only triggers once per creature, but the bonus is permanent.",
  },
  {
    name: "Afflict",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Afflict N: Whenever this creature becomes blocked, defending player loses N life.",
    description:
      "Afflict triggers whenever the creature is blocked — regardless of what happens in combat afterward. The defending player loses N life just for blocking. This makes blocking an afflict creature costly: your opponent takes free damage even if they successfully kill it.",
  },
  {
    name: "Exert",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Exert: You may exert this creature as it attacks. When you do, it doesn't untap during your next untap step, but it gains a bonus.",
    description:
      "Exerting a creature gives it a powerful bonus for an attack — extra damage, removal, card draw — but at the cost of skipping its untap next turn. It's an all-in burst of power that leaves the creature exhausted for a turn.",
  },
  {
    name: "Fabricate",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Fabricate N: When this creature enters the battlefield, put N +1/+1 counters on it, or create N 1/1 colorless Servo artifact creature tokens.",
    description:
      "Fabricate gives you a choice when a creature enters the battlefield: either make it bigger (put +1/+1 counters on it) or create 1/1 Servo tokens instead. You decide how to use each fabricate point. The right choice depends on whether you want one strong threat or multiple bodies.",
  },
  {
    name: "Afterlife",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Afterlife N: When this creature dies, create N 1/1 white and black Spirit creature tokens with flying.",
    description:
      "Afterlife triggers when the creature dies, creating flying Spirit tokens as compensation. Afterlife 1 leaves behind one 1/1 Spirit. Afterlife 2 leaves two. These tokens have flying, making them useful for blocking aerial threats or continuing to apply pressure.",
  },
  {
    name: "Amass",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Amass N: Put N +1/+1 counters on an Army you control. If you don't control one, create a 0/0 black Zombie Army creature token first.",
    description:
      "Amass builds up a single Zombie Army token over time. The first time you amass, a 0/0 token is created and immediately gets +1/+1 counters. Each subsequent amass adds more counters to the same Army, making it larger and larger. All your amass effects feed into one growing creature.",
  },
  {
    name: "Exploit",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Exploit: When this creature enters the battlefield, you may sacrifice a creature.",
    description:
      "When an exploit creature enters, you may sacrifice another creature you control. If you do, the exploit creature gains an additional bonus. You're trading one creature for a stronger version of the exploit creature's effect.",
  },
  {
    name: "Connive",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Connive N: Draw N cards, then discard N cards. Put a +1/+1 counter on this creature for each nonland card discarded this way.",
    description:
      "Connive lets a creature filter your hand and grow at the same time. Draw N cards and discard N cards — for each nonland card you discard, the conniving creature gets a +1/+1 counter. You're improving your hand quality and potentially making the creature much larger.",
  },
  {
    name: "Revolt",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Revolt — [bonus effect if a permanent you controlled left the battlefield this turn].",
    description:
      "Revolt is an ability word that marks a bonus effect that applies if any permanent you controlled left the battlefield this turn — by dying, being sacrificed, being bounced back to hand, or any other way. Great with sacrifice synergies, fetch lands, and bounce spells.",
  },
  {
    name: "Morbid",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Morbid — [bonus effect if a creature died this turn].",
    description:
      "Morbid is an ability word indicating a bonus if any creature died this turn — yours, your opponent's, or anyone's. Morbid cards usually get extra damage, stronger effects, or token creation when morbid is active.",
  },
  {
    name: "Delirium",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Delirium — [bonus effect if there are four or more card types among cards in your graveyard].",
    description:
      "Delirium activates when you have at least four different card types in your graveyard (creature, instant, sorcery, enchantment, artifact, land, planeswalker, etc.). Reaching delirium gives cards enhanced effects — better stats, stronger abilities, or both.",
  },
  {
    name: "Threshold",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Threshold — [bonus effect if you have seven or more cards in your graveyard].",
    description:
      "Threshold is one of Magic's oldest ability words. Once you have seven or more cards in your graveyard, threshold cards gain a significant power boost — a creature might double in size, or a spell might have an enhanced effect. From the Odyssey block, which was the original graveyard-matters set.",
  },
  {
    name: "Metalcraft",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Metalcraft — [bonus effect if you control three or more artifacts].",
    description:
      "Metalcraft activates when you control three or more artifacts. From the Scars of Mirrodin block (an artifact-themed world), metalcraft cards get enhanced effects once you've assembled enough artifact pieces.",
  },

  // ── CREATURE ROLES (continued) ────────────────────────────────────────────
  {
    name: "Poisonous",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Poisonous N: Whenever this creature deals combat damage to a player, that player gets N poison counters.",
    description:
      "Poisonous gives poison counters to a player whenever the creature deals combat damage to them. A player with 10 or more poison counters loses the game regardless of life total. Unlike infect, poisonous creatures deal normal damage AND give poison counters — a double threat.",
  },
  {
    name: "Annihilator",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Annihilator N: Whenever this creature attacks, defending player sacrifices N permanents.",
    description:
      "Annihilator is one of the most devastating abilities in Magic. Every time an annihilator creature attacks, the defending player must sacrifice permanents — lands, creatures, anything. Annihilator 4 means sacrifice 4 permanents per attack. Used on the Eldrazi, ancient cosmic horror creatures from the Zendikar sets.",
  },
  {
    name: "Banding",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Banding: This creature can attack in a band with creatures that also have banding. As a defending player, you choose how combat damage is assigned to a banding attacker.",
    description:
      "Banding is one of Magic's oldest and most complex abilities. It lets creatures band together: the banding player controls how damage dealt to the band is distributed among the banded creatures. This is notoriously confusing and rarely seen today — it has not been printed on new cards since the mid-1990s. If you see it, just know it's a very old, defensive/combat-coordination ability.",
  },

  // ── MECHANICS (continued) ─────────────────────────────────────────────────
  {
    name: "Mutate",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Mutate [cost]: If you cast this spell for its mutate cost, put it over or under target non-Human creature you own. They mutate into the creature on top plus all abilities of those under it.",
    description:
      "Mutate merges two creatures into one. Cast a mutate card on top of another creature you own (non-Human), and they fuse — the combined creature has the power/toughness and name of the top card, but all the abilities of every card in the stack. Stack several mutate cards together for a terrifying pile of abilities.",
  },
  {
    name: "Riot",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Riot: This creature enters the battlefield with your choice of a +1/+1 counter or haste.",
    description:
      "Riot gives you a simple choice when a creature enters: either it comes in with a +1/+1 counter (permanent boost) or it has haste (can attack this turn). The right pick depends on the situation — need to attack now? Take haste. Playing the long game? Take the counter.",
  },
  {
    name: "Populate",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Populate: Create a token that's a copy of a creature token you control.",
    description:
      "Populate copies one of your existing creature tokens — the copied token is identical in every way (same type, power, toughness, abilities). If you have a powerful token like a 4/4 Angel, populate creates another one. If you have multiple token types, you choose which one to copy.",
  },
  {
    name: "Embalm",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Embalm [cost]: Exile this card from your graveyard: Create a token that's a copy of it, except it's white, has no mana cost, and is a Zombie in addition to its other types. Activate only as a sorcery.",
    description:
      "Embalm lets a creature return after death — but as a mummified Zombie token. You exile the card from your graveyard and pay the embalm cost to create an token copy that's now white and a Zombie. The token version is usually slightly weaker than the original but gives the card two uses.",
  },
  {
    name: "Eternalize",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Eternalize [cost]: Exile this card from your graveyard: Create a token that's a copy of it, except it's black, it's 4/4, has no mana cost, and is a Zombie in addition to its other types. Activate only as a sorcery.",
    description:
      "Like embalm, but the eternalized version is always a 4/4 black Zombie — it ignores the original creature's power and toughness. The abilities are retained but the stats are standardized at 4/4.",
  },
  {
    name: "Phasing",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Phasing: At the beginning of your untap step, if this permanent is phased in, it phases out; if it's phased out, it phases in. A phased-out permanent is treated as if it doesn't exist.",
    description:
      "Phasing makes a permanent alternate between phased in (on the battlefield) and phased out (temporarily nonexistent). A phased-out permanent can't be targeted, attacked, or affected by anything — it simply doesn't exist until it phases back in on your next untap step. Originally from Mirage block, it's returned in some modern sets.",
  },

  // ── KEYWORD ACTIONS ───────────────────────────────────────────────────────
  {
    name: "Exile",
    category: "Keyword Actions",
    type: "Keyword Action",
    reminder:
      "Exile: Move a card to the exile zone. Exiled cards are 'removed from the game' and are much harder to interact with than cards in the graveyard.",
    description:
      "Exile sends a card out of the game to the exile zone. Unlike the graveyard, most cards can't interact with exiled cards. Exile is the most permanent form of removal — indestructible creatures, regenerating creatures, and undying/persist effects are all defeated by exile.",
  },
  {
    name: "Sacrifice",
    category: "Keyword Actions",
    type: "Keyword Action",
    reminder:
      "Sacrifice: Put a permanent you control into your graveyard as a cost or effect.",
    description:
      "Sacrificing a permanent moves it from the battlefield to its owner's graveyard. This can be a cost ('Sacrifice a creature: Draw a card') or an effect ('Sacrifice all creatures'). Sacrificed permanents can't be 'saved' by regeneration, indestructible, etc. — sacrifice bypasses those protections.",
  },
  {
    name: "Counter (a spell)",
    category: "Keyword Actions",
    type: "Keyword Action",
    reminder:
      "Counter: Put a spell from the stack into its owner's graveyard without it resolving.",
    description:
      "To counter a spell means to stop it from resolving. The spell goes from the stack to the graveyard without its effect happening. Counterspells are instants that counter other spells. Countering is blue's primary form of interaction.",
  },
  {
    name: "Fight",
    category: "Keyword Actions",
    type: "Keyword Action",
    reminder:
      "Fight: Two target creatures each deal damage equal to their power to each other.",
    description:
      "When two creatures fight, they each deal damage equal to their power to each other simultaneously. It's like mini-combat without attacking or blocking. Green uses fight effects as its main form of creature removal.",
  },
];
