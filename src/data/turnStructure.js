export const turnStructure = [
  {
    phase: "Beginning Phase",
    order: 1,
    steps: [
      {
        name: "Untap Step",
        icon: "↺",
        description:
          "You untap all permanents you control (lands, creatures, artifacts, etc.). Phasing and similar effects happen here. You generally can't cast spells or activate abilities during this step.",
        tip: "This is why tapping things on your opponent's turn is powerful — it might still be tapped when their untap step comes, and they can't use it.",
      },
      {
        name: "Upkeep Step",
        icon: "⟳",
        description:
          "Many triggered abilities say 'at the beginning of your upkeep.' This is when those trigger. You can cast instants and activate abilities here. Sagas add their lore counter during upkeep.",
        tip: "This is when you check if you need to pay for enchantments that have an upkeep cost. Forget to pay and they go away.",
      },
      {
        name: "Draw Step",
        icon: "🂠",
        description:
          "You draw one card from your library. This is a normal draw — you must do it (unless an effect says otherwise). If you can't draw because your library is empty, you lose the game.",
        tip: "The first player on Turn 1 does NOT draw a card on their very first turn (in two-player games) to compensate for going first.",
      },
    ],
  },
  {
    phase: "Pre-Combat Main Phase",
    order: 2,
    steps: [
      {
        name: "Main Phase",
        icon: "🟩",
        description:
          "You can cast any spell type: creatures, sorceries, instants, enchantments, artifacts, and planeswalkers. You may also play one land (your one land per turn allowance). This is your main opportunity to develop your board before combat.",
        tip: "Most players cast their important non-creature spells here to avoid having them countered while their mana is untapped. Play around your opponent's potential instants.",
      },
    ],
  },
  {
    phase: "Combat Phase",
    order: 3,
    steps: [
      {
        name: "Beginning of Combat Step",
        icon: "⚔️",
        description:
          "Combat is beginning. Both players can cast instants and activate abilities. This is the last chance to do something before attackers are declared — for example, flash in a blocker, or kill a potential attacker.",
        tip: "If you want to tap one of your opponent's creatures before they attack, now is the time — once they declare attacks you've missed your window on most tap effects.",
      },
      {
        name: "Declare Attackers Step",
        icon: "→",
        description:
          "The active player (whose turn it is) chooses which of their untapped creatures will attack and what they're attacking — an opponent or a planeswalker. Declaring attackers taps all attacking creatures (unless they have vigilance). Both players can then cast instants.",
        tip: "You can only attack with untapped creatures. You choose all your attackers at once — you can't attack in sequence.",
      },
      {
        name: "Declare Blockers Step",
        icon: "🛡",
        description:
          "The defending player assigns their untapped creatures to block the attacking creatures. Each blocker can only block one attacker (normally), but multiple blockers can gang up on one attacker. Both players can cast instants after blockers are declared.",
        tip: "The blocking player chooses which attacking creatures to block, but the attacking player assigns combat damage order when multiple creatures block one attacker.",
      },
      {
        name: "Combat Damage Step",
        icon: "💥",
        description:
          "Creatures deal their combat damage simultaneously. Attacking creatures deal damage to their blockers (or the player/planeswalker if unblocked). Blocking creatures deal damage to their attackers. Creatures that take lethal damage die. If first strike or double strike creatures are present, there's a first-strike combat damage step before the normal one.",
        tip: "An unblocked creature deals its power in damage to the defending player. A blocked creature only deals damage to its blockers (unless it has trample).",
      },
      {
        name: "End of Combat Step",
        icon: "✓",
        description:
          "Combat is wrapping up. Some 'until end of combat' effects end here. Both players can still cast instants.",
        tip: "This is mostly a formality step, but triggered abilities that say 'at end of combat' trigger here.",
      },
    ],
  },
  {
    phase: "Post-Combat Main Phase",
    order: 4,
    steps: [
      {
        name: "Second Main Phase",
        icon: "🟩",
        description:
          "Another full main phase. You can still cast any spells (if you haven't played your land this turn, you can do it now). Playing creatures here is safer since they've already survived combat. Good for playing things your opponent can't respond to profitably.",
        tip: "Many experienced players save their land drop for this phase if possible — your opponent has less information about what you might cast.",
      },
    ],
  },
  {
    phase: "Ending Phase",
    order: 5,
    steps: [
      {
        name: "End Step",
        icon: "🔔",
        description:
          "All 'at the beginning of the end step' and 'until end of turn' effects trigger here. Both players can still cast instants. This is a common time for experienced players to cast flash creatures or instant-speed card draw — your opponent's mana untaps after this, so you force them to react now.",
        tip: "Casting flash threats at end of your opponent's turn is great — they get only one full turn to deal with it before you untap and can use it offensively.",
      },
      {
        name: "Cleanup Step",
        icon: "🧹",
        description:
          "Two things happen: first, 'until end of turn' and 'this turn' effects end. Second, if you have more than 7 cards in hand, you must discard down to 7 (this is the 'hand size' rule — default maximum hand size is 7). You generally can't cast spells here unless something triggers.",
        tip: "If you discard during cleanup, the game checks for triggers again. You generally don't need to worry about this as a beginner.",
      },
    ],
  },
];
