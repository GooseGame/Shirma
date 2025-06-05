import { HTMLAttributes } from 'react';
import { Damage, Weapon } from '../../../interfaces/Equipment.interface';

export interface WeaponItemProps extends HTMLAttributes<HTMLDivElement> {
	weapon: Weapon;
	aimMod: number;
	setAimRoll: (modifier: number) => void;
	setDmgRoll: (dmg: Damage[]) => void;
	onClickName?: ()=>void;
	onClickDelete?: ()=>void;
}