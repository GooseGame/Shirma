import { HTMLAttributes } from 'react';
import { Damage } from '../../interfaces/Equipment.interface';

export interface DamageRegexProps extends HTMLAttributes<HTMLDivElement> {
	inputDamageRoll: Damage;
	onSave:	(dmg: Damage|null, inputDmgId?: string)=>void;
	inputDmgId?: string;
}