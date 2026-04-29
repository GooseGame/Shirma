import { CellsByLevel, Dice, Stat, Status } from "./Character.interface";
import { Damage, DamageType } from "./Equipment.interface";
import { Spell } from "./spells.interface";
import { Text } from "./Text.interface";

export interface Size {
    id: 'tiny'|'small'|'medium'|'large'|'huge'|'gargantuan',
    name: string,
    size: number
}

export interface Type {
    id: 'beast'|'celestial'|'construct'|'dragon'|'elemental'|'fey'|'fiend'|'giant'|'humanoid'|'monstrosity'|'ooze'|'plant'|'undead',
    name: string,
    extra?: string
}

export interface Monster {
    id: string,
    name: string,
    description: Text,
    avatar: string,
    size: Size[],
    type: Type,
    alignment:          {
        name: string,
        coordinates: {
            x: number,
            y: number
        }
    },
    alignmentShort:     string,
    armor: number,
    hp: {
        recommended: number,
        generated: {
            dice: Dice,
            extra: number
        }
    },
    speed: {
        base: number,
        burrow?: number,
        swim?: number,
        fly?: number,
        climb?: number
    },
    stats: Stat[],
    proficiency: number,
    resistances: DamageType[],
    vulnerabilities: DamageType[],
    immune: Status[],
    senses: {
        passivePerception: number,
        darkvision?: number,
        tremorsense?: number,
        truesight?: number,
        blindsight?: number
    },
    languages: string[],
    danger: {
        challengeRating: number,
        xp: number
    },
    specialAbilities: {
        spells: {
            spell: Spell,
            amount: number
        }[],
        actions: {
            id: string,
            name: string,
            description: Text,
            aimModifier?: number,
            damageRoll?: Damage[]
        }[]
    },
    actions: {
        id: string,
        name: string,
        description: Text,
        aimModifier?: number,
        damageRoll?: Damage[]
    }[],
    reactions: {
        id: string,
        name: string,
        description: Text,
        aimModifier?: number,
        damageRoll?: Damage[]
    }[],
    legendaryActions: {
        id: string,
        name: string,
        description: Text,
        aimModifier?: number,
        damageRoll?: Damage[]
    }[],
    spells: Spell[],
    cells: CellsByLevel[],
    livingAreas: {
        land: 'forest'|'grassland'|'hill'|'mountain'|'swamp'|'underdark'|'underwater'|'urban'|'wasteland'|'wilderness'
    }[]
}