import { HTMLAttributes } from 'react';
import { Dice } from '../../interfaces/Character.interface';

export interface DiceComponentProps extends HTMLAttributes<HTMLDivElement> {
    dice: Dice;
    diceValue: number;
    classNames?: string;
    animate?: boolean; 
}