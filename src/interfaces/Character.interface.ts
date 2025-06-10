import { EquipmentItem, Weapon } from './Equipment.interface';
import { Spell } from './spells.interface';
import { Text } from './Text.interface';

export const NO_EXHAUSTION_LVL = 0;
export const MAX_EXHAUSTION_LVL = 6;

export interface Coins {
    copper:     number,
    gold:       number,
    silver:     number,
    total:      number
}

export interface CharacterText {
    background:     Text,
    features:       Text,
    notes: {
        id: string,
        name: string
        text: Text
    }[],
    allies:         Text,
    prof:           Text,
    weaknesses:     Text,
    affections:     Text,
    ideals:         Text,
    quests:         Text,
    traits:         Text,
    possession:     {
        category:   string,
        categoryId: string,
        items:      {
            id: string,
            word: string
        }[]
    }[]
}

export interface Info {
    name:               string,
    level:              number,
    exp:                number,
    class:              CharacterClass,
    alignment:          {
        name: string,
        coordinates: {
            x: number,
            y: number
        }
    },
    alignmentShort:     string,
    backgroundTitle:    string,
    race:               string,
    text:               CharacterText
    measurements: {
        age:    string,
        eyes:   string,
        hair:   string,
        skin:   string,
        height: string,
        weight: string
    }
}

export interface Health {
    current:    number,
    max:        number,
    extra:      number,
    isDying:    boolean,
    hpDice:     Dice,
    stabilization: {
        success: 0|1|2|3,
        fail: 0|1|2|3
    }
}

export interface Condition {
    health:         Health,
    armor:          number,
    speed:          number,
    inspiration:    boolean,
    exhaustionLvl:  number,
    statuses:       number[],
    initiative:     number
}

export interface Status {
    id:             number,
    name:           string,
    description:    string
}

export interface Dice {
    count:  number,
    edge:   number,
    value?: number
} 

export interface Stat {
    name:       string,
    score:      number,
    modifier:   number,
    saveBonus?: number,
    saveProf:   0|0.5|1|2,
    skills:     Skill[]
}

export interface Skill {
    name:       string,
    profLevel:  0|0.5|1|2,
    modifier:   number,
    bonus?:     number
}

export interface associativeCells {
    [key: string]: {
        cells: CellsByLevel[]
    }
}

export interface CharacterSpells {
    cells:      CellsByLevel[],
    extraCells?:associativeCells
    spellsStat: string,
    saveRoll:   number,
    modifier:   number,
    spells:     Spell[]
}

export interface CharacterClass {
    name: string,
    subclass?: string
}

export interface CellsByLevel {
    count:      number,
    availible:  number
}

export interface Character {
    id:             string,
    avatar:         string,
    info:           Info,
    stats:          Stat[],
    proficiency:    number,
    backpack: {
        equipment:  EquipmentItem[],
        treasure:   EquipmentItem[],
        quest:      EquipmentItem[],
        coins:      Coins,
        weapons:    Weapon[],
    },
    condition:      Condition,
    spells:         CharacterSpells 
}

export interface PresetCharacter {
    presetId:   string,
    character:  Character,
    shortDesc:  string,
    bestFor:    string,
    keywordIds:   number[]
}

export interface FBPreset {
    id: string,
    preset: PresetCharacter
}

export interface Keyword {
    id: number,
    name: string,
    hint: string
}