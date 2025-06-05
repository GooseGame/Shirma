import { HTMLAttributes } from 'react';
import { AttributeExtended, DamageExtended, DistanceExtended } from '../../../interfaces/Equipment.interface';

export interface WeaponAttributesProps extends HTMLAttributes<HTMLDivElement> {
    info: AttributeExtended|DistanceExtended|DamageExtended;
    size?: 'medium'|'small'
}