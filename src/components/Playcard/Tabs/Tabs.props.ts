import { HTMLAttributes } from 'react';
import { Character } from '../../../interfaces/Character.interface';
import { Damage, DiceCheck } from '../../../interfaces/Equipment.interface';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    player: Character;
    setDiceRoll?: React.Dispatch<React.SetStateAction<Damage[]| DiceCheck[]>>;
    onChangeChar?: () => void;
}