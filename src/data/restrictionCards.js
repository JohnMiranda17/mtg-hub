/**
 * Cards that restrict instant-speed interaction.
 * Oracle text verified against Scryfall (scryfall.com/docs/syntax).
 */
export const RESTRICTION_CARDS = [
  {
    name: 'Teferi, Time Raveler',
    effect: 'opponents_sorcery_speed',
    description: "Your opponents can't cast spells at instant speed. Only sorcery-speed actions are available to the opponent.",
    affects: 'opponent',
    severity: 'hard',
  },
  {
    name: 'Grand Abolisher',
    effect: 'opponent_no_spells_your_turn',
    description: "During your turn, your opponents can't cast spells or activate abilities of artifacts, creatures, or enchantments.",
    affects: 'opponent',
    severity: 'hard',
    condition: 'active_player_controls',
  },
  {
    name: 'Rule of Law',
    effect: 'one_spell_per_turn',
    description: "Each player can cast only one spell each turn.",
    affects: 'both',
    severity: 'hard',
  },
  {
    name: 'Arcane Laboratory',
    effect: 'one_spell_per_turn',
    description: "Each player can cast only one spell each turn.",
    affects: 'both',
    severity: 'hard',
  },
  {
    name: 'Eidolon of Rhetoric',
    effect: 'one_spell_per_turn',
    description: "Each player can cast only one spell each turn.",
    affects: 'both',
    severity: 'hard',
  },
  {
    name: 'Ethersworn Canonist',
    effect: 'one_nonartifact_per_turn',
    description: "Each player who has cast a nonartifact spell this turn can't cast additional nonartifact spells.",
    affects: 'both',
    severity: 'conditional',
  },
  {
    name: 'Thalia, Guardian of Thraben',
    effect: 'noncreature_cost_increase',
    description: "Noncreature spells cost {1} more to cast.",
    affects: 'both',
    severity: 'soft',
  },
  {
    name: 'Drannith Magistrate',
    effect: 'hand_only_casting',
    description: "Opponents can't cast spells from anywhere other than their hands.",
    affects: 'opponent',
    severity: 'hard',
  },
  {
    name: 'Silence',
    effect: 'no_spells_this_turn',
    description: "Target player can't cast spells this turn.",
    affects: 'targeted',
    severity: 'hard',
  },
  {
    name: 'Curse of Exhaustion',
    effect: 'one_spell_per_turn',
    description: "The enchanted player can't cast more than one spell each turn.",
    affects: 'opponent',
    severity: 'hard',
  },
  {
    name: 'Void Winnower',
    effect: 'no_even_cmc_spells',
    description: "Your opponents can't cast spells with even mana values.",
    affects: 'opponent',
    severity: 'hard',
  },
  {
    name: 'Sanctum Prelate',
    effect: 'no_chosen_cmc_spells',
    description: "Spells with mana value equal to the chosen number can't be cast.",
    affects: 'opponent',
    severity: 'hard',
  },
  {
    name: 'Yixlid Jailer',
    effect: 'graveyard_no_abilities',
    description: "Cards in graveyards have no abilities.",
    affects: 'both',
    severity: 'hard',
  },
  {
    name: 'Collector Ouphe',
    effect: 'no_artifact_abilities',
    description: "Activated abilities of artifacts can't be activated.",
    affects: 'both',
    severity: 'hard',
  },
  {
    name: "Damping Sphere",
    effect: 'extra_spell_cost',
    description: "Each spell a player casts that shares a card type with a spell cast this turn costs {2} more.",
    affects: 'both',
    severity: 'soft',
  },
];

// Keywords that grant instant-speed casting
export const FLASH_KEYWORDS = ['flash'];

// Card type that is always instant speed
export const INSTANT_TYPES = ['instant'];

// Split second reminder — while a split-second spell is on the stack, players
// can't cast spells or activate non-mana abilities
export const SPLIT_SECOND_NOTE =
  'A spell with Split Second is on the stack — no spells or non-mana abilities can be activated until it resolves.';
