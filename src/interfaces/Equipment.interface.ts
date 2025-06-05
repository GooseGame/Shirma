import { Dice } from './Character.interface';
export interface EquipmentItem {
    name:           string,
    count:          number,
    description?:   string,
    weight?:        number
}

export interface DamageType {
    name:   string,
    id:     number
}

export interface AttributeExtended extends WeaponAttribute, ExtendedInfo {
	type: 'attribute'
}

export interface DistanceExtended extends WeaponDistance, ExtendedInfo {
	type: 'distance'
}

export interface DamageTypeExtended extends DamageType, ExtendedInfo {
	type: 'damage'
}

export interface ExtendedInfo {
	img:  		string,
	desc: 		string,
	bgColor: 	string,
	color:		string,
	type: 		'attribute'|'distance'|'damage'
}

export interface DiceCheck {
    typeId:     0,
    value:      Dice,
    modifiers:  number
}

export interface Damage  {
    dmg_id:     string;
    typeId:     number,
    value:      Dice,
    modifiers:  number
}

export interface DamageExtended extends Damage, DamageTypeExtended {
}

export interface Weapon extends EquipmentItem {
    id:         string,
    isProf:     boolean,
    damage:     Damage[],
    attributes: (WeaponAttribute|WeaponDistance)[],
    isMelee:    boolean,
    aimModifier:number,
    scaleStat:  string,
    image?:     string
}

export interface WeaponAttribute {
    name:   string,
    id:     number
}

export interface WeaponDistance extends WeaponAttribute {
    distance:       number,
    maxDistance:    number
}