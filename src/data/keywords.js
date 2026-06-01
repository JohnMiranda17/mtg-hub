export const keywords = [
  // ── EVASION ──────────────────────────────────────────────────────────────
  {
    name: "Flying",
    category: "Evasion",
    type: "Keyword Ability",
    reminder: "This creature can't be blocked except by creatures with flying or reach.",
    description:
      "Flying creatures soar above the battlefield. Your opponent can only block them with other creatures that have flying (they also fly) or reach (they can stretch up to grab flyers). Most angels, birds, dragons, and faeries have flying.",
    tip: "Flying is one of the strongest keyword abilities in the game — a creature with flying is very hard to block.",
  },
  {
    name: "Reach",
    category: "Evasion",
    type: "Keyword Ability",
    reminder: "This creature can block creatures with flying.",
    description:
      "A creature with reach can block flying creatures even though it doesn't fly itself. Think of it as a creature tall enough — or with long enough arms, tentacles, or webs — to swat flyers out of the sky. Reach creatures can't fly over blockers themselves.",
    tip: "Reach is most common on large spiders and similar creatures. It's purely defensive — it only helps when blocking.",
  },
  {
    name: "Menace",
    category: "Evasion",
    type: "Keyword Ability",
    reminder: "This creature can't be blocked except by two or more creatures.",
    description:
      "A menacing creature is so threatening that it takes at least two defenders to stop it. Your opponent must assign two or more of their creatures to block it, or it gets through unblocked. This lets it punch through even if your opponent has lots of small creatures.",
    tip: "Great for forcing through damage — your opponent has to choose between letting the creature through or wasting two blockers.",
  },
  {
    name: "Intimidate",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can't be blocked except by artifact creatures and/or creatures that share a color with it.",
    description:
      "Only artifact creatures (colorless mechanical creatures) or creatures of the same color as the intimidating creature can block it. This ability is no longer used in new sets — it was replaced by Menace — but you'll still see it on older cards.",
    tip: "Older ability — mostly found on cards from 2010–2014.",
  },
  {
    name: "Fear",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can't be blocked except by artifact creatures and/or black creatures.",
    description:
      "Only artifact creatures or black creatures can block a creature with fear. Similar to intimidate but color-locked to black. A very old ability, retired in favor of intimidate and then menace.",
    tip: "Older ability — mostly found on cards from early Magic sets.",
  },
  {
    name: "Shadow",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can block or be blocked only by creatures with shadow.",
    description:
      "Shadow creatures exist in a separate plane of existence. They can only interact with other shadow creatures in combat — they can't block non-shadow creatures and can't be blocked by them. Almost exclusively a Tempest block mechanic.",
    tip: "If your opponent has no shadow creatures, yours walks through unblocked every time.",
  },

  // ── COMBAT BONUSES ────────────────────────────────────────────────────────
  {
    name: "First Strike",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder: "This creature deals combat damage before creatures without first strike.",
    description:
      "In a normal fight, both creatures deal damage at the same time. First strike breaks that rule — the first-strike creature deals its damage first. If that damage is enough to destroy the blocker, the blocker never gets to deal its damage back. Very powerful when blocking a weaker creature.",
    tip: "A 2/2 first striker can defeat a 4/4 creature if the 4/4 only has 2 or fewer toughness.",
  },
  {
    name: "Double Strike",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "This creature deals both first strike and regular combat damage.",
    description:
      "Double strike combines first strike and normal combat damage. The creature deals its power in damage in the first-strike step, then again in the normal combat damage step. This means a 2/2 with double strike effectively deals 4 damage in combat.",
    tip: "Double strike is extremely powerful — it can kill two blockers in a single attack or deal double damage to your opponent.",
  },
  {
    name: "Trample",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "This creature can deal excess combat damage to the player or planeswalker it's attacking.",
    description:
      "When a trampling creature attacks and is blocked, it only needs to assign lethal damage to the blocker(s). Any leftover damage crashes through to the defending player or planeswalker. Without trample, blocking even a tiny 1/1 absorbs all the damage from a 10/10.",
    tip: "Trample turns your giant creatures into threats that can't simply be chump-blocked with a 1/1.",
  },
  {
    name: "Deathtouch",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder: "Any amount of damage this creature deals is enough to destroy the creature it damages.",
    description:
      "Normally, a creature must deal damage equal to or greater than another creature's toughness to destroy it. With deathtouch, even 1 damage from this creature is lethal. A 1/1 with deathtouch can trade with a 10/10 in combat — the 10/10 takes 1 damage and dies instantly.",
    tip: "Deathtouch + trample is a deadly combo: assign just 1 damage to each blocker (lethal with deathtouch), and all remaining damage tramples through.",
  },
  {
    name: "Lifelink",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Damage dealt by this creature also causes you to gain that much life.",
    description:
      "Whenever a creature with lifelink deals damage — to a player, a creature, or a planeswalker — you gain that much life. It works in combat, from effects, and from abilities. A 3/3 with lifelink that hits the opponent gains you 3 life.",
    tip: "Lifelink can swing a close race in your favor. A 5/5 lifelinker swinging every turn quickly puts you out of range of aggressive decks.",
  },
  {
    name: "Vigilance",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder: "Attacking doesn't cause this creature to tap.",
    description:
      "Normally when a creature attacks, it taps (turns sideways). Tapped creatures can't block. Vigilance means the creature stays untapped even while attacking, so it can attack AND be available to block on your opponent's next turn.",
    tip: "Vigilance is excellent on large defensive creatures — they pressure your opponent on offense and still protect you on defense.",
  },
  {
    name: "Haste",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "This creature can attack and use activated abilities with [T] as soon as it comes under your control.",
    description:
      "Normally, a creature you play must wait a full turn before attacking or using tap abilities — this is called 'summoning sickness.' Haste removes that restriction. A creature with haste can attack the very turn it enters the battlefield.",
    tip: "Haste is great for surprise plays. Your opponent may leave themselves open to attack thinking your new creature needs a turn to 'wake up.'",
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
    tip: "Hexproof doesn't protect against non-targeted effects. 'All creatures get -1/-1' hits hexproof creatures just fine.",
  },
  {
    name: "Shroud",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "This permanent can't be the target of spells or abilities.",
    description:
      "Like hexproof, but stricter — shroud prevents everyone (including you!) from targeting the permanent. You can't buff your own shroud creature with Auras or targeted pump spells. Shroud has mostly been replaced by hexproof in modern sets.",
    tip: "Be careful — shroud stops your own targeting too, unlike hexproof which only stops opponents.",
  },
  {
    name: "Indestructible",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "This permanent can't be destroyed by damage or by effects that say 'destroy.'",
    description:
      "Indestructible permanents can't be destroyed. Effects that say 'destroy target creature' fail, and even lethal damage doesn't kill them (damage is marked but the creature doesn't die from it). However, indestructible creatures CAN be exiled, returned to hand, or have their toughness reduced to 0 — those bypass indestructible.",
    tip: "To deal with an indestructible creature, use exile effects, -X/-X effects to reduce toughness to 0, or bounce effects.",
  },
  {
    name: "Protection",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "Protection from [quality]: Can't be Damaged, Enchanted/Equipped, Blocked, or Targeted by anything of that quality (DEBT).",
    description:
      "Protection is remembered with the acronym DEBT — the protected creature can't be Damaged by, Enchanted/Equipped by, Blocked by, or Targeted by anything matching the protected quality. 'Protection from red' means red spells and red creatures can't damage it, target it, block it, or attach to it.",
    tip: "An easy way to remember: DEBT. A white knight with protection from black is nearly untouchable by black decks.",
  },
  {
    name: "Ward",
    category: "Protection",
    type: "Keyword Ability",
    reminder:
      "Whenever this permanent becomes the target of a spell or ability an opponent controls, counter it unless that player pays [cost].",
    description:
      "Ward punishes opponents for targeting your permanent. When they aim a spell or ability at your creature, they must pay an extra cost — often mana — or the spell is countered. Ward {2} means they must pay 2 more mana or lose their spell.",
    tip: "Ward is weaker than hexproof — opponents can still target if they pay the cost. But it slows them down and often wastes a card.",
  },

  // ── SPEED & TIMING ────────────────────────────────────────────────────────
  {
    name: "Flash",
    category: "Speed & Timing",
    type: "Keyword Ability",
    reminder: "You may cast this spell any time you could cast an instant.",
    description:
      "Flash lets you play a permanent at instant speed — including during your opponent's turn, in response to their spells, or at the end of their turn. Creatures with flash are called 'flash creatures' and are great for surprising opponents and holding up mana for interaction.",
    tip: "Casting a flash creature at the end of your opponent's turn is often better than playing it on your own turn — they don't get a full turn to react to it.",
  },

  // ── ACTIVATED/TRIGGERED ABILITIES ─────────────────────────────────────────
  {
    name: "Tap (Symbol)",
    category: "Activated Abilities",
    type: "Keyword Symbol",
    reminder: "[T]: Tap this permanent as part of its activation cost.",
    description:
      "The tap symbol (a sideways arrow) appears in activated ability costs. To use the ability, you tap the permanent (turn it sideways). Tapped permanents can't attack or block, and can't be tapped again until untapped. Most lands tap for mana using this symbol.",
    tip: "You can't activate a tap ability the same turn a creature enters the battlefield — it has summoning sickness (unless it has haste).",
  },
  {
    name: "Cycling",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder: "Cycling [cost]: Discard this card; draw a card.",
    description:
      "If you have a cycling card in hand that you don't want right now, you can pay its cycling cost, discard it, and draw a new card. It replaces itself and keeps your hand fresh. Some cycling cards also trigger bonus effects when cycled.",
    tip: "Cycling cards are never dead draws — at worst, they replace themselves. They're very useful in decks that need specific cards.",
  },
  {
    name: "Kicker",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Kicker [cost]: You may pay an optional extra cost when casting this spell for a bonus effect.",
    description:
      "When you cast a spell with kicker, you can choose to pay an additional cost on top of the regular cost. Doing so gives you an enhanced version of the effect. Kicker gives spells flexibility — you play them normally early game and kick them for full value later when you have more mana.",
    tip: "Kicked spells are not new spells — your opponent can still respond to the original cast.",
  },
  {
    name: "Flashback",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Flashback [cost]: You may cast this card from your graveyard for its flashback cost. Exile it afterward.",
    description:
      "A spell with flashback can be cast a second time from your graveyard by paying the flashback cost instead of its normal cost. After you flashback a card, it's exiled (removed from the game permanently). This is essentially a 'do it twice' card.",
    tip: "Flashback makes cards more resilient to disruption — even if your spell is countered the first time, you can try again from the graveyard.",
  },
  {
    name: "Madness",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Madness [cost]: If you discard this card, you may cast it for its madness cost instead of putting it into your graveyard.",
    description:
      "If you're forced to discard a card with madness, you can instead pay its madness cost to cast it right away. The card goes to exile temporarily while you cast it, then to the graveyard normally afterward.",
    tip: "Madness pairs well with cards that make you discard — what would be a downside becomes an advantage.",
  },
  {
    name: "Escape",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Escape [cost], Exile [N] other cards from your graveyard: You may cast this card from your graveyard.",
    description:
      "Escape lets you replay a card from your graveyard by paying an alternate cost and exiling several other cards from your graveyard as additional payment. Great in graveyard-focused strategies.",
    tip: "Escape costs exile other graveyard cards, so be careful not to exile cards you need for other abilities.",
  },
  {
    name: "Foretell",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Foretell {2}: During your turn, you may pay {2} and exile this card from your hand face down.",
    description:
      "Foretell is a two-step process: first, pay 2 mana to hide the card in exile face-down. On a future turn, you can cast it from exile for its reduced foretell cost. It lets you 'bank' cards and cast them cheaper later.",
    tip: "Foretelling early lets you split the cost across two turns. Your opponent also doesn't know what you foretold until you cast it.",
  },
  {
    name: "Suspend",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Suspend [N] — [cost]: Exile this card with N time counters. At the start of each of your upkeeps, remove one time counter. When the last counter is removed, cast it for free.",
    description:
      "Suspend lets you cast a powerful spell cheaply now by 'suspending' it in time — it enters exile with several time counters on it. Each of your upkeeps, one counter is removed. When the last counter is removed, you cast the spell for free. A slow burn that's worth it.",
    tip: "The card is exiled face up, so your opponent knows exactly what's coming and when. Plan around that.",
  },
  {
    name: "Morph",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "You may cast this card face down as a 2/2 creature for {3}. Turn it face up at any time for its morph cost.",
    description:
      "Morph lets you play a creature as a mysterious face-down 2/2 for just 3 mana, hiding its true identity. At any time, you can pay the morph cost to flip it face up and reveal its actual power, toughness, and abilities. Great for bluffing and surprises.",
    tip: "Face-down morph creatures all look identical to your opponent — this creates powerful mind games and bluffing opportunities.",
  },
  {
    name: "Convoke",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Convoke: Your creatures can help cast this spell. Each creature you tap while casting this spell pays for {1} or one mana of that creature's color.",
    description:
      "Convoke lets you tap your own creatures as if they were mana to help pay for a spell. Each tapped creature reduces the cost by 1 generic mana (or one mana of its color). Lets you play big spells much earlier if you have creatures on board.",
    tip: "Convoke synergizes well with token strategies — lots of cheap tokens help you cast expensive spells early.",
  },
  {
    name: "Delve",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Delve: Each card you exile from your graveyard while casting this spell pays for {1}.",
    description:
      "Delve lets you exile cards from your graveyard to reduce the casting cost of a spell. Each card exiled pays for 1 generic mana. Can let you cast very powerful spells for almost nothing if your graveyard is full.",
    tip: "Delve has fueled very powerful cards — beware of accidentally exiling cards you need for other abilities.",
  },

  // ── TRIGGERED ABILITIES ───────────────────────────────────────────────────
  {
    name: "Landfall",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Whenever a land enters the battlefield under your control, [effect].",
    description:
      "Landfall is triggered each time you play or put a land onto the battlefield. Cards with landfall usually get a bonus — like +2/+2 until end of turn, gaining life, or creating a token — each time you do. Playing extra lands in a turn triggers it multiple times.",
    tip: "Fetch lands and extra land effects can trigger landfall multiple times in one turn.",
  },
  {
    name: "Prowess",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn.",
    description:
      "Prowess rewards you for casting spells. Each time you cast an instant, sorcery, enchantment, or artifact spell (anything that isn't a creature), all your prowess creatures get +1/+1 until end of turn. This stacks — casting three spells gives +3/+3.",
    tip: "Prowess creatures are powerful in 'spell-heavy' decks that cast many cheap instants and sorceries.",
  },
  {
    name: "Persist",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "When this creature dies, if it had no -1/-1 counters on it, return it to the battlefield with a -1/-1 counter on it.",
    description:
      "When a persist creature dies (goes to the graveyard), it comes back to the battlefield with a -1/-1 counter on it — but only if it didn't already have a -1/-1 counter. This means most persist creatures effectively die twice before staying dead.",
    tip: "Remove the -1/-1 counter to let the creature persist indefinitely. Combos with effects that remove counters.",
  },
  {
    name: "Undying",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "When this creature dies, if it had no +1/+1 counters on it, return it to the battlefield with a +1/+1 counter on it.",
    description:
      "Similar to persist but opposite — undying creatures come back with a +1/+1 counter instead of -1/-1. The returned creature is bigger than before. Again, it only triggers if the creature didn't already have a +1/+1 counter.",
    tip: "Undying returns the creature stronger. Pairing it with effects that remove counters creates infinite death triggers.",
  },
  {
    name: "Scry",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Scry N: Look at the top N cards of your library, then put any number of them on the bottom and the rest back on top in any order.",
    description:
      "Scry lets you look at the top cards of your deck and decide which ones stay on top (you'll draw them soon) and which go to the bottom (you don't want them now). It's a form of card selection — you don't draw extra cards, but you pick the best ones coming up.",
    tip: "Scry is one of the most reliable forms of card quality in the game. Even scry 1 meaningfully improves your draws.",
  },
  {
    name: "Surveil",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Surveil N: Look at the top N cards of your library, then put any number of them into your graveyard and the rest back on top in any order.",
    description:
      "Like scry, but instead of only choosing what goes to the bottom, you can send cards to the graveyard. This fills your graveyard intentionally — useful for flashback, escape, delve, and other graveyard strategies.",
    tip: "Surveil is strictly better than scry in graveyard decks. In regular decks, scry is usually better since you keep more options.",
  },
  {
    name: "Proliferate",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Proliferate: Choose any number of permanents and/or players, then give each another counter of a kind it already has.",
    description:
      "Proliferate lets you add one more of any existing counter type to any permanent or player that already has at least one counter of that type. This doubles down on poison counters, +1/+1 counters, loyalty counters on planeswalkers, and more.",
    tip: "Proliferate works with ANY counter type — poison counters, energy counters, loyalty counters, you name it.",
  },
  {
    name: "Explore",
    category: "Triggered Abilities",
    type: "Keyword Action",
    reminder:
      "Explore: Reveal the top card of your library. If it's a land, put it into your hand. If not, put a +1/+1 counter on the exploring creature, then put the card back or into your graveyard.",
    description:
      "When a creature explores, it looks at the top of your deck. If it's a land you get a free land in hand. If not, the creature gets a +1/+1 counter. Either way you get value.",
    tip: "Explore is almost always good — you either get a land or your creature gets bigger.",
  },
  {
    name: "Enlist",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Enlist: As this creature attacks, you may tap a nonattacking creature you control that has no summoning sickness. If you do, add its power to this creature's until end of turn.",
    description:
      "When your enlisting creature attacks, you can tap another creature (that isn't attacking and doesn't have summoning sickness) to boost the attacker's power by that creature's power until end of turn.",
    tip: "Enlist lets you convert a defender's power into offensive damage without risking the defender in combat.",
  },
  {
    name: "Training",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Whenever this creature attacks with another creature that has greater power, put a +1/+1 counter on this creature.",
    description:
      "Training triggers whenever you attack with this creature alongside a stronger ally. The creature with training grows — it 'learns' from the bigger creature beside it. A great way to gradually strengthen weaker creatures.",
    tip: "Training only triggers once per attack phase, not once per stronger creature you attack with.",
  },
  {
    name: "Raid",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Raid — [effect if you attacked with a creature this turn].",
    description:
      "Raid is an ability word that marks a bonus that applies if you attacked with at least one creature during your turn. Raid cards usually get a bonus when you play them after attacking.",
    tip: "Raid rewards aggression. Always try to attack before playing your raid cards.",
  },
  {
    name: "Spectacle",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Spectacle [cost]: You may cast this spell for its spectacle cost instead if an opponent lost life this turn.",
    description:
      "If an opponent lost life this turn (from your creatures, spells, or anything else), you can cast a spectacle spell at its reduced spectacle cost. Great in aggressive decks that are always dealing damage.",
    tip: "Even 1 damage from a poke ability can enable spectacle for that entire turn.",
  },
  {
    name: "Dredge",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Dredge N: If you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.",
    description:
      "Instead of drawing your normal card for the turn, you can 'dredge' — put N cards from your library into your graveyard and return the dredge card from your graveyard to your hand. You effectively redraw the same card while filling your graveyard.",
    tip: "Dredge is extremely powerful in graveyard strategies but also milling yourself is a real cost — don't run out of cards.",
  },

  // ── CREATURE TYPES & ROLES ────────────────────────────────────────────────
  {
    name: "Defender",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder: "This creature can't attack.",
    description:
      "Creatures with defender are purely defensive — they can never be declared as attackers. They can still block normally and use other abilities. Walls almost always have defender. Some have high toughness to form an almost impenetrable barrier.",
    tip: "Defenders can still deal damage if they have abilities that deal damage, just not through attacking.",
  },
  {
    name: "Partner",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Partner: You can have two commanders in Commander format if both have partner.",
    description:
      "In the Commander format, you normally choose one legendary creature as your commander. Partner lets you pair two partner-capable legendary creatures together, giving you a two-commander team. This is a Commander-specific ability.",
    tip: "Having two commanders gives you two color identities combined — more colors means more card options.",
  },
  {
    name: "Infect",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "This creature deals damage to creatures in the form of -1/-1 counters and to players in the form of poison counters.",
    description:
      "Infect changes how damage works. Against creatures, infect damage becomes -1/-1 counters instead of damage. Against players, infect deals poison counters instead of life loss. A player with 10 or more poison counters loses the game, regardless of their life total.",
    tip: "A player's starting life is 20, but they only need 10 poison counters to lose. Infect decks can win very quickly.",
  },
  {
    name: "Wither",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "This creature deals damage to creatures in the form of -1/-1 counters.",
    description:
      "Like infect, but only applies to creatures — wither turns combat damage into -1/-1 counters. Unlike infect, wither still deals normal damage to players. A creature weakened by wither can die if its toughness reaches 0.",
    tip: "Wither permanently weakens creatures — the -1/-1 counters don't go away when combat ends.",
  },
  {
    name: "Flanking",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Whenever a creature without flanking blocks this creature, the blocker gets -1/-1 until end of turn.",
    description:
      "Flanking is an older ability. When a creature without flanking blocks a flanking creature, the blocker gets -1/-1 until end of turn. This weakens or kills many smaller blockers. Mostly seen in Mirage-era sets.",
    tip: "Older ability — mostly on sets from 1996–1997. Multiple flanking creatures can stack the penalty.",
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
    tip: "Overloading at the right moment can be game-changing, but it costs significantly more mana.",
  },
  {
    name: "Bestow",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Bestow [cost]: You may cast this card as an Aura for its bestow cost. It enchants a creature. If the enchanted creature leaves, this becomes a creature.",
    description:
      "Bestow lets you cast a creature as an Aura enchantment on one of your creatures instead. It pumps the creature's stats and gives it the bestowed creature's abilities. If the enchanted creature leaves, the bestow card 'falls off' and becomes a creature on its own — you don't lose both cards.",
    tip: "Bestow protects you from 2-for-1 trades — even if your creature gets removed, the bestow card sticks around as its own creature.",
  },
  {
    name: "Emerge",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Emerge [cost]: You may cast this spell by sacrificing a creature and paying the emerge cost minus that creature's mana value.",
    description:
      "Emerge is an alternative casting cost that lets you sacrifice a creature to reduce the cost of a large spell. The creature's mana value is subtracted from the emerge cost. Great for getting big creatures into play early.",
    tip: "If you sacrifice a creature that has already gotten value (from an enters-the-battlefield trigger), you're essentially trading an existing creature for a bigger one at a discount.",
  },
  {
    name: "Storm",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Storm: When you cast this spell, copy it for each spell cast before it this turn.",
    description:
      "Storm is one of Magic's most explosive mechanics. When a storm spell is cast, it creates a copy of itself for every single spell cast earlier that turn. Cast 5 spells before a storm spell and you get 5 more copies — all for free.",
    tip: "Storm is so powerful that most storm cards are banned or restricted in competitive formats.",
  },
  {
    name: "Replicate",
    category: "Alternative Costs",
    type: "Keyword Ability",
    reminder:
      "Replicate [cost]: When you cast this spell, you may pay its replicate cost any number of times. Each payment creates a copy.",
    description:
      "Replicate lets you pay an extra cost multiple times when casting a spell. Each time you pay the replicate cost, you get an additional copy of the spell. Unlike storm, you control how many copies you make.",
    tip: "Replicate lets you scale your spell with available mana — flexible and powerful.",
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
    tip: "+1/+1 and -1/-1 counters cancel each other out — one of each on the same creature means both are immediately removed.",
  },
  {
    name: "Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Tokens are creature (or other permanent) representations created by spells and abilities. They're not cards.",
    description:
      "Tokens are permanents (usually creatures) that are created by spells or abilities. They exist on the battlefield but aren't cards — if they leave the battlefield for any reason (die, get exiled, return to hand), they simply disappear. Common tokens: 1/1 Soldiers, 2/2 Zombies, 1/1 Birds with flying.",
    tip: "Tokens don't go to the graveyard the normal way — they cease to exist when they leave the battlefield (though 'dies' triggers still work).",
  },
  {
    name: "Treasure Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Treasure: An artifact token with '{T}, Sacrifice this: Add one mana of any color.'",
    description:
      "Treasure tokens are special artifact tokens that can be tapped and sacrificed to add one mana of any color. They're essentially temporary mana rocks. Very useful for ramping into big spells or fixing your mana in multicolor decks.",
    tip: "Save treasures for when you need mana of a specific color, or use them when you're about to be unable to use them anyway.",
  },
  {
    name: "Food Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Food: An artifact token with '{2}, {T}, Sacrifice this: You gain 3 life.'",
    description:
      "Food tokens are artifact tokens that cost 2 mana to activate, sacrificing them to gain 3 life. They're usually generated by creature abilities and represent snacks in the Eldraine setting. Some cards care specifically about food tokens.",
    tip: "Food is primarily a lifegain tool, but it's also an artifact you can sacrifice for other effects.",
  },
  {
    name: "Clue Token",
    category: "Tokens & Counters",
    type: "Game Concept",
    reminder:
      "Clue: An artifact token with '{2}, Sacrifice this: Draw a card.'",
    description:
      "Clue tokens are artifact tokens that can be sacrificed for 2 mana to draw a card. They represent investigation in Innistrad's mystery-themed sets. Very powerful as a source of additional card draw.",
    tip: "Clues are flexible — hold them and cash them in when you need cards most.",
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
    tip: "Regeneration doesn't work against exile effects — if something says 'exile target creature,' regenerate can't save it.",
  },
  {
    name: "Equip",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Equip [cost]: Attach this equipment to target creature you control. Activate only as a sorcery.",
    description:
      "Equipment is a subtype of artifact that attaches to creatures to make them stronger. You pay the equip cost to move the equipment to a creature you control. You can reattach equipment to different creatures throughout the game. If the equipped creature dies, the equipment stays on the battlefield.",
    tip: "Unlike Auras (enchantments), equipment stays when the equipped creature dies — it just falls off and sits unattached.",
  },
  {
    name: "Enchant",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Enchant [permanent type]: This Aura can only be attached to that type of permanent.",
    description:
      "Aura enchantments have 'Enchant' to specify what they can be attached to. 'Enchant creature' means it goes on a creature, 'Enchant land' on a land, etc. When you cast an Aura, you target the permanent it'll enchant. If the enchanted permanent leaves the battlefield, the Aura goes to the graveyard.",
    tip: "Auras are risky — if your opponent removes the creature, you lose the Aura too (a 2-for-1 in their favor). Bestow avoids this problem.",
  },
  {
    name: "Crew",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Crew N: Tap any number of creatures you control with total power N or greater: This Vehicle becomes an artifact creature until end of turn.",
    description:
      "Vehicles are artifact cards that sit inert until crewed. By tapping creatures with total power equal to or greater than the crew number, the Vehicle becomes a creature for the turn. Vehicles are usually very powerful for their cost, balanced by needing creatures to operate them.",
    tip: "Even a tapped-out creature can crew a Vehicle on your turn — the crew ability doesn't need creatures to be untapped before being used… wait, actually the crew ability does tap the creatures. Crew uses tap as part of the cost.",
  },
  {
    name: "Saga",
    category: "Mechanics",
    type: "Card Type",
    reminder:
      "Sagas enter with a lore counter; add another at the start of your draw step. Each chapter triggers when the matching lore counter number is reached. Sacrifice after the final chapter.",
    description:
      "Sagas are enchantments that tell a story over multiple turns. When a Saga enters, it gets a lore counter (I). Each of your draw steps (before drawing), you add another lore counter, triggering that chapter's effect. When you hit the final chapter, the Saga is sacrificed after the effect.",
    tip: "Sagas give you multiple effects over time but are vulnerable to being destroyed before completing their story.",
  },
  {
    name: "Transform",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Transform: Turn this double-faced card over to its other face.",
    description:
      "Transform flips a double-faced card to its other side. The front face usually has a condition that causes it to transform — like 'When you cast your third spell, transform this.' The back face is often a completely different card type or a much stronger version.",
    tip: "The most famous transform card is Delver of Secrets — a 1/1 insect that transforms into a 3/2 Insectile Aberration with flying.",
  },
  {
    name: "Mill",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Mill N: Put the top N cards of a library into that player's graveyard.",
    description:
      "Milling means sending cards from the top of a player's library directly to their graveyard. A player who needs to draw but has no cards in their library loses the game — so milling enough can win the game. Mill is also used to fuel graveyard strategies.",
    tip: "Milling yourself can be good for graveyard decks. Milling opponents can win games if their deck runs out of cards.",
  },
  {
    name: "Goad",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Goad: Until your next turn, the goaded creature attacks each combat if able and attacks a player other than you if able.",
    description:
      "Goading a creature forces it to attack on its controller's next turn (if able) and to attack someone other than you. It's a political tool perfect for Commander — you turn your opponent's strongest creature against their other opponents.",
    tip: "Goad is especially powerful in multiplayer formats like Commander where you can redirect threats.",
  },
  {
    name: "Cascade",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Cascade: When you cast this spell, exile cards from the top of your library until you exile a nonland card with lesser mana value. You may cast it without paying its cost. Put the exiled cards on the bottom in a random order.",
    description:
      "Cascade gives you a free bonus spell every time you cast the cascade card. You flip through your deck until you find a spell with lower mana value than the cascade card, then cast it for free. Very powerful value engine that can chain into multiple spells.",
    tip: "In a deck built around it, cascade is extremely powerful — pair high-cost cascade cards with specific lower-cost spells you want to hit.",
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
    tip: "Because so few creatures have horsemanship, a creature with it is often completely unblockable in practice. If you see it in older casual play, treat it like flying.",
  },
  {
    name: "Landwalk",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "Islandwalk / Swampwalk / etc.: This creature can't be blocked as long as the defending player controls a [land type].",
    description:
      "Landwalk abilities — Islandwalk, Swampwalk, Forestwalk, Mountainwalk, Plainswalk — make a creature unblockable if the defending player controls that type of land. Islandwalk means the creature is unblockable if your opponent controls any Island. These abilities are most common on older cards and are no longer printed in Standard sets.",
    tip: "Landwalk is situational — it's useless against the wrong deck but completely unblockable against the right one. In multi-format games, assume your opponent might have the relevant land.",
  },
  {
    name: "Skulk",
    category: "Evasion",
    type: "Keyword Ability",
    reminder:
      "This creature can't be blocked by creatures with greater power.",
    description:
      "A creature with skulk sneaks through — it can only be blocked by creatures with equal or lesser power. If you have a 1/1 with skulk, your opponent can't block it with their 3/3. Great on small, cheap creatures that carry strong abilities.",
    tip: "Skulk pairs perfectly with pump spells or equipment on the attacker — if you boost it mid-combat after blockers are declared, the power increase doesn't un-block it.",
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
    tip: "Exalted rewards a 'one big attacker' strategy. Use vigilance or a second exalted creature without attacking it to keep triggering the bonus.",
  },
  {
    name: "Myriad",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Whenever this creature attacks, for each other opponent, create a token that's a copy of this creature attacking that player or a planeswalker they control. Exile the tokens at end of combat.",
    description:
      "Myriad is a Commander-focused ability. When a creature with myriad attacks one player, token copies of it appear attacking each other opponent simultaneously. All those tokens deal damage at once, then vanish at end of combat. It's a way to apply pressure to everyone at the table with one swing.",
    tip: "Myriad is especially devastating in Commander with triggered abilities — if the creature has 'deals combat damage: draw a card,' each token triggers that separately.",
  },
  {
    name: "Bushido",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Bushido N: Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.",
    description:
      "Bushido (the way of the warrior) gives a creature a temporary power and toughness boost whenever it's involved in combat — either blocking or being blocked. Bushido 2 means the creature gets +2/+2. Mostly found on Samurai creatures from the original Kamigawa block (2004–2005).",
    tip: "Bushido stacks with multiple sources — a creature with Bushido 1 blocking a creature with Bushido 2 both get their respective bonuses.",
  },
  {
    name: "Rampage",
    category: "Combat Bonuses",
    type: "Keyword Ability",
    reminder:
      "Rampage N: Whenever this creature becomes blocked, it gets +N/+N until end of turn for each creature blocking it beyond the first.",
    description:
      "Rampage rewards being gang-blocked. For each blocker beyond the first assigned to this creature, it gets +N/+N until end of turn. A creature with Rampage 2 blocked by three creatures gets +4/+4 (two extra blockers × 2). Older ability from early Magic sets.",
    tip: "Rampage discourages opponents from double-blocking, which can actually make your creature more evasive in practice.",
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
    tip: "Totem armor only protects against 'destroy' effects, not exile. Stack multiple totem armor Auras for multiple layers of protection.",
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
    tip: "The creature returned to hand can be recast next turn, so you don't actually lose it. Ninjutsu creatures frequently have 'when this deals combat damage to a player' payoffs.",
  },
  {
    name: "Dash",
    category: "Speed & Timing",
    type: "Keyword Ability",
    reminder:
      "Dash [cost]: You may cast this spell for its dash cost. If you do, it gains haste, and you return it to its owner's hand at the beginning of the next end step.",
    description:
      "Dash lets you cast a creature cheaply for a hit-and-run attack. It enters with haste so it can attack immediately, then bounces back to your hand at the start of the end step. You get the attack, then get the creature back to use again next turn.",
    tip: "Dashing a creature with a powerful 'enters the battlefield' or 'attacks' trigger means you get that trigger every turn you dash it.",
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
    tip: "Evoke is most powerful on creatures with strong ETB effects. You're essentially paying for the trigger as a sorcery at a discount.",
  },
  {
    name: "Unearth",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Unearth [cost]: Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step or if it would leave the battlefield. Activate only as a sorcery.",
    description:
      "Unearth brings a creature back from the graveyard temporarily. The creature enters with haste (can attack immediately), but at the end of the turn it's exiled permanently — you can't unearth the same creature again. A one-last-shot ability.",
    tip: "Because the creature is exiled at end of turn anyway, sacrifice it before then to get extra value (death triggers, etc.).",
  },
  {
    name: "Retrace",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Retrace: You may cast this card from your graveyard by discarding a land card in addition to paying its other costs.",
    description:
      "Retrace lets you cast a spell from your graveyard repeatedly by paying its normal cost plus discarding a land. As long as you have lands to discard, you can keep recasting the same spell. Great in decks that generate lots of lands.",
    tip: "Retrace rewards having excess lands in hand — it turns land flooding into a bonus rather than a problem.",
  },
  {
    name: "Rebound",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Rebound: If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it. At the beginning of your next upkeep, you may cast this card for free.",
    description:
      "Rebound gives a spell an automatic free second cast. When you cast a rebound card from hand, it goes to exile instead of the graveyard. At the start of your next upkeep, you can cast it again for free. Effectively doubles the impact of one-time effects.",
    tip: "Rebound only works the first time (cast from hand). The free cast on upkeep doesn't trigger rebound again.",
  },
  {
    name: "Jumpstart",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Jumpstart: You may cast this card from your graveyard by discarding a card in addition to paying its other costs. Then exile this card.",
    description:
      "Jumpstart lets you recast a spell from the graveyard one more time by discarding any card as an additional cost. After it resolves via jumpstart, it's exiled — so you get exactly two casts total (once from hand, once from graveyard). A simple graveyard-value mechanic.",
    tip: "Jumpstart is great for effects you want twice — removal, draw, or pump spells all benefit from a free second cast.",
  },
  {
    name: "Blitz",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Blitz [cost]: If you cast this spell for its blitz cost, it gains haste and 'when this creature dies, draw a card,' and you sacrifice it at the beginning of the next end step.",
    description:
      "Blitz is a cheaper, temporary way to play a creature. Cast it for the blitz cost, get an immediate haste attacker, and draw a card when it dies (or is sacrificed at end of turn). Great for aggressive decks that want tempo.",
    tip: "Unlike dash (which returns to hand), blitz creatures are sacrificed and draw a card. Better if you want the death trigger or don't need the creature later.",
  },
  {
    name: "Level Up",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Level up [cost]: Put a level counter on this creature. Activate only as a sorcery.",
    description:
      "Level Up creatures start small but grow more powerful as you spend mana to add level counters over time. The card shows different power/toughness and abilities depending on how many level counters it has. A long-term investment that pays off after several turns.",
    tip: "Level up creatures can be removal magnets — once your opponent sees how strong it becomes, they'll try to kill it before it levels up too high.",
  },
  {
    name: "Echo",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Echo [cost]: At the beginning of your upkeep, if this came under your control since the beginning of your last upkeep, sacrifice it unless you pay its echo cost.",
    description:
      "Echo is an upkeep tax. You cast a creature, and on your next upkeep you must pay the echo cost again or sacrifice it. The creature usually has a below-rate cost compared to its power — the echo cost is the 'installment payment.' If you can't or don't want to pay, you lose the creature.",
    tip: "Think of echo like buying on credit — powerful now but you'll pay again later. Great if you needed the creature right away.",
  },
  {
    name: "Cumulative Upkeep",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Cumulative upkeep [cost]: At the beginning of your upkeep, put an age counter on this permanent, then sacrifice it unless you pay its upkeep cost for each age counter on it.",
    description:
      "Cumulative upkeep grows more expensive every turn. You put an age counter on the permanent each upkeep and pay the cost multiplied by the total counter count. Turn 1: pay 1. Turn 2: pay 2. Turn 3: pay 3. Eventually the cost becomes unaffordable and you sacrifice it. Mostly found in older sets.",
    tip: "Cards with cumulative upkeep are usually very powerful for their initial cost — the idea is they're 'renting' a huge effect that becomes too expensive to maintain.",
  },
  {
    name: "Improvise",
    category: "Activated Abilities",
    type: "Keyword Ability",
    reminder:
      "Improvise: Your artifacts can help cast this spell. Each artifact you tap while casting this spell pays for {1}.",
    description:
      "Improvise is like convoke for artifacts. When casting a spell with improvise, you can tap your artifacts to help pay for it — each tapped artifact reduces the generic mana cost by 1. Great in artifact-heavy decks that want to deploy big spells early.",
    tip: "Improvise pairs well with cheap artifacts and artifact tokens (Treasure, Clue, Food) — they all contribute toward big spells.",
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
    tip: "Heroic only triggers on spells you cast — activated abilities that target the creature don't count.",
  },
  {
    name: "Evolve",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Whenever a creature enters the battlefield under your control, if that creature has greater power or toughness than this creature, put a +1/+1 counter on this creature.",
    description:
      "Evolve triggers when a stronger creature joins your team. If the new creature has higher power OR higher toughness than the evolving creature, it grows with a +1/+1 counter. As you keep adding bigger creatures, your evolving creatures keep getting stronger.",
    tip: "Even creatures with just marginally higher stats trigger evolve. Build a curve of increasingly larger creatures to keep your evolve creatures growing every turn.",
  },
  {
    name: "Renown",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Renown N: When this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counters on it and it becomes renowned.",
    description:
      "Renown triggers the first time a creature successfully deals combat damage to a player. It gets N +1/+1 counters and becomes 'renowned' — a permanent status tracked on the card. It only triggers once per creature, but the bonus is permanent.",
    tip: "You must make sure the creature isn't blocked to get renown. Evasion abilities like flying, menace, or skulk pair well with renown.",
  },
  {
    name: "Afflict",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Afflict N: Whenever this creature becomes blocked, defending player loses N life.",
    description:
      "Afflict triggers whenever the creature is blocked — regardless of what happens in combat afterward. The defending player loses N life just for blocking. This makes blocking an afflict creature costly: your opponent takes free damage even if they successfully kill it.",
    tip: "Afflict punishes blocking. Against an afflict deck, you often have to choose between taking combat damage or taking afflict damage. It's lose-lose.",
  },
  {
    name: "Exert",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Exert: You may exert this creature as it attacks. When you do, it doesn't untap during your next untap step, but it gains a bonus.",
    description:
      "Exerting a creature gives it a powerful bonus for an attack — extra damage, removal, card draw — but at the cost of skipping its untap next turn. It's an all-in burst of power that leaves the creature exhausted for a turn.",
    tip: "Use exert when you need that extra damage right now. Don't exert if you'll need the creature to block next turn.",
  },
  {
    name: "Fabricate",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Fabricate N: When this creature enters the battlefield, put N +1/+1 counters on it, or create N 1/1 colorless Servo artifact creature tokens.",
    description:
      "Fabricate gives you a choice when a creature enters the battlefield: either make it bigger (put +1/+1 counters on it) or create 1/1 Servo tokens instead. You decide how to use each fabricate point. The right choice depends on whether you want one strong threat or multiple bodies.",
    tip: "Tokens are often better — they protect your main creature (blockers), trigger other effects, and can be sacrificed for value.",
  },
  {
    name: "Afterlife",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Afterlife N: When this creature dies, create N 1/1 white and black Spirit creature tokens with flying.",
    description:
      "Afterlife triggers when the creature dies, creating flying Spirit tokens as compensation. Afterlife 1 leaves behind one 1/1 Spirit. Afterlife 2 leaves two. These tokens have flying, making them useful for blocking aerial threats or continuing to apply pressure.",
    tip: "Afterlife makes your creatures hard to profitably trade with — killing a 3/3 with Afterlife 2 turns into two flying tokens still threatening the opponent.",
  },
  {
    name: "Amass",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Amass N: Put N +1/+1 counters on an Army you control. If you don't control one, create a 0/0 black Zombie Army creature token first.",
    description:
      "Amass builds up a single Zombie Army token over time. The first time you amass, a 0/0 token is created and immediately gets +1/+1 counters. Each subsequent amass adds more counters to the same Army, making it larger and larger. All your amass effects feed into one growing creature.",
    tip: "The Army token keeps all its counters between turns — it's a long-term investment that can become enormous. Protect it well.",
  },
  {
    name: "Exploit",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Exploit: When this creature enters the battlefield, you may sacrifice a creature.",
    description:
      "When an exploit creature enters, you may sacrifice another creature you control. If you do, the exploit creature gains an additional bonus. You're trading one creature for a stronger version of the exploit creature's effect.",
    tip: "Sacrifice a creature that's already gotten its value — like an enters-the-battlefield creature — to power up the exploit ability without real loss.",
  },
  {
    name: "Connive",
    category: "Triggered Abilities",
    type: "Keyword Ability",
    reminder:
      "Connive N: Draw N cards, then discard N cards. Put a +1/+1 counter on this creature for each nonland card discarded this way.",
    description:
      "Connive lets a creature filter your hand and grow at the same time. Draw N cards and discard N cards — for each nonland card you discard, the conniving creature gets a +1/+1 counter. You're improving your hand quality and potentially making the creature much larger.",
    tip: "Discard cards you don't need or cards with flashback/madness/unearth that you can still use from the graveyard.",
  },
  {
    name: "Revolt",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Revolt — [bonus effect if a permanent you controlled left the battlefield this turn].",
    description:
      "Revolt is an ability word that marks a bonus effect that applies if any permanent you controlled left the battlefield this turn — by dying, being sacrificed, being bounced back to hand, or any other way. Great with sacrifice synergies, fetch lands, and bounce spells.",
    tip: "Even bouncing one of your own lands back to hand activates revolt. Sacrifice outlets make it easy to trigger.",
  },
  {
    name: "Morbid",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Morbid — [bonus effect if a creature died this turn].",
    description:
      "Morbid is an ability word indicating a bonus if any creature died this turn — yours, your opponent's, or anyone's. Morbid cards usually get extra damage, stronger effects, or token creation when morbid is active.",
    tip: "Your opponent's creatures dying counts for morbid too. Trading in combat or killing their creature sets up morbid for your next spell.",
  },
  {
    name: "Delirium",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Delirium — [bonus effect if there are four or more card types among cards in your graveyard].",
    description:
      "Delirium activates when you have at least four different card types in your graveyard (creature, instant, sorcery, enchantment, artifact, land, planeswalker, etc.). Reaching delirium gives cards enhanced effects — better stats, stronger abilities, or both.",
    tip: "Lands count toward delirium! Cycling, self-mill, and discard effects help fill your graveyard with multiple types quickly.",
  },
  {
    name: "Threshold",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Threshold — [bonus effect if you have seven or more cards in your graveyard].",
    description:
      "Threshold is one of Magic's oldest ability words. Once you have seven or more cards in your graveyard, threshold cards gain a significant power boost — a creature might double in size, or a spell might have an enhanced effect. From the Odyssey block, which was the original graveyard-matters set.",
    tip: "Threshold flips a switch permanently (as long as you keep 7+ cards in the graveyard). Mill yourself and use cantrips to hit threshold quickly.",
  },
  {
    name: "Metalcraft",
    category: "Triggered Abilities",
    type: "Ability Word",
    reminder: "Metalcraft — [bonus effect if you control three or more artifacts].",
    description:
      "Metalcraft activates when you control three or more artifacts. From the Scars of Mirrodin block (an artifact-themed world), metalcraft cards get enhanced effects once you've assembled enough artifact pieces.",
    tip: "Artifact tokens (Treasure, Clue, Food, Servos) count toward metalcraft. You don't need powerful artifacts — just three of anything.",
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
    tip: "Poisonous is from the Lorwyn/Shadowmoor era and differs from infect — poisonous deals normal damage too. Infect creatures only deal damage as poison counters.",
  },
  {
    name: "Annihilator",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Annihilator N: Whenever this creature attacks, defending player sacrifices N permanents.",
    description:
      "Annihilator is one of the most devastating abilities in Magic. Every time an annihilator creature attacks, the defending player must sacrifice permanents — lands, creatures, anything. Annihilator 4 means sacrifice 4 permanents per attack. Used on the Eldrazi, ancient cosmic horror creatures from the Zendikar sets.",
    tip: "There's almost no recovering from being hit by annihilator multiple turns in a row. Block it (or exile it) before it attacks a second time.",
  },
  {
    name: "Banding",
    category: "Creature Roles",
    type: "Keyword Ability",
    reminder:
      "Banding: This creature can attack in a band with creatures that also have banding. As a defending player, you choose how combat damage is assigned to a banding attacker.",
    description:
      "Banding is one of Magic's oldest and most complex abilities. It lets creatures band together: the banding player controls how damage dealt to the band is distributed among the banded creatures. This is notoriously confusing and rarely seen today — it has not been printed on new cards since the mid-1990s. If you see it, just know it's a very old, defensive/combat-coordination ability.",
    tip: "Banding is considered so confusing that even many experienced players don't fully understand it. Don't worry about learning it unless you specifically play with old cards.",
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
    tip: "If the merged creature dies, all the fused cards go to the graveyard separately. Exile effects remove everything.",
  },
  {
    name: "Riot",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Riot: This creature enters the battlefield with your choice of a +1/+1 counter or haste.",
    description:
      "Riot gives you a simple choice when a creature enters: either it comes in with a +1/+1 counter (permanent boost) or it has haste (can attack this turn). The right pick depends on the situation — need to attack now? Take haste. Playing the long game? Take the counter.",
    tip: "If you're losing the race, take haste. If you're ahead or the creature survives long-term, take the +1/+1 counter.",
  },
  {
    name: "Populate",
    category: "Mechanics",
    type: "Keyword Action",
    reminder:
      "Populate: Create a token that's a copy of a creature token you control.",
    description:
      "Populate copies one of your existing creature tokens — the copied token is identical in every way (same type, power, toughness, abilities). If you have a powerful token like a 4/4 Angel, populate creates another one. If you have multiple token types, you choose which one to copy.",
    tip: "Populate does nothing if you control no creature tokens. Build your board first, then populate to multiply.",
  },
  {
    name: "Embalm",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Embalm [cost]: Exile this card from your graveyard: Create a token that's a copy of it, except it's white, has no mana cost, and is a Zombie in addition to its other types. Activate only as a sorcery.",
    description:
      "Embalm lets a creature return after death — but as a mummified Zombie token. You exile the card from your graveyard and pay the embalm cost to create an token copy that's now white and a Zombie. The token version is usually slightly weaker than the original but gives the card two uses.",
    tip: "Embalm creatures essentially have two lives. Embalm is from the Amonkhet Egyptian-themed sets.",
  },
  {
    name: "Eternalize",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Eternalize [cost]: Exile this card from your graveyard: Create a token that's a copy of it, except it's black, it's 4/4, has no mana cost, and is a Zombie in addition to its other types. Activate only as a sorcery.",
    description:
      "Like embalm, but the eternalized version is always a 4/4 black Zombie — it ignores the original creature's power and toughness. The abilities are retained but the stats are standardized at 4/4. Often a significant upgrade from the original creature.",
    tip: "Eternalize from Hour of Devastation is usually better than embalm since it standardizes to 4/4, often buffing weaker original creatures.",
  },
  {
    name: "Phasing",
    category: "Mechanics",
    type: "Keyword Ability",
    reminder:
      "Phasing: At the beginning of your untap step, if this permanent is phased in, it phases out; if it's phased out, it phases in. A phased-out permanent is treated as if it doesn't exist.",
    description:
      "Phasing makes a permanent alternate between phased in (on the battlefield) and phased out (temporarily nonexistent). A phased-out permanent can't be targeted, attacked, or affected by anything — it simply doesn't exist until it phases back in on your next untap step. Originally from Mirage block, it's returned in some modern sets.",
    tip: "Phasing is also used on opponent's permanents as removal — 'phase out target creature' temporarily removes it harmlessly until their next turn.",
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
    tip: "If you need to permanently deal with a dangerous creature, exile effects are your best bet.",
  },
  {
    name: "Sacrifice",
    category: "Keyword Actions",
    type: "Keyword Action",
    reminder:
      "Sacrifice: Put a permanent you control into your graveyard as a cost or effect.",
    description:
      "Sacrificing a permanent moves it from the battlefield to its owner's graveyard. This can be a cost ('Sacrifice a creature: Draw a card') or an effect ('Sacrifice all creatures'). Sacrificed permanents can't be 'saved' by regeneration, indestructible, etc. — sacrifice bypasses those protections.",
    tip: "If something is about to be exiled or stolen, sacrificing it first at least puts it in your graveyard where you might be able to use it later.",
  },
  {
    name: "Counter (a spell)",
    category: "Keyword Actions",
    type: "Keyword Action",
    reminder:
      "Counter: Put a spell from the stack into its owner's graveyard without it resolving.",
    description:
      "To counter a spell means to stop it from resolving. The spell goes from the stack to the graveyard without its effect happening. Counterspells are instants that counter other spells. Countering is blue's primary form of interaction.",
    tip: "A countered spell is not 'destroyed' — it goes to the graveyard, so cards that care about dying don't trigger.",
  },
  {
    name: "Fight",
    category: "Keyword Actions",
    type: "Keyword Action",
    reminder:
      "Fight: Two target creatures each deal damage equal to their power to each other.",
    description:
      "When two creatures fight, they each deal damage equal to their power to each other simultaneously. It's like mini-combat without attacking or blocking. Green uses fight effects as its main form of creature removal.",
    tip: "Fight is great at removing small creatures or weakened big ones — use it strategically to 'eat' problem creatures.",
  },
];
