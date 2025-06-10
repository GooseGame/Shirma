import { HTMLAttributes } from 'react';
import { Character } from '../../interfaces/Character.interface';

export interface MiniCardProps extends HTMLAttributes<HTMLDivElement> {
    creature: Character;
    deleteAction?: (id: string)=>void;
    cloneAction?: (char: Character) => void;
    onClickAction?: (char: Character) => void;
}