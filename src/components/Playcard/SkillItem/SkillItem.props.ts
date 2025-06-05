import { HTMLAttributes } from 'react';
import { Skill } from '../../../interfaces/Character.interface';

export interface SkillItemProps extends HTMLAttributes<HTMLDivElement> {
    skill:          Skill,
    useProfRadio?:  boolean,
    width?:          0.5|1,
    showAsModifier?:boolean,
    handleSkillCheckClick?: (modifier: number) => void,
    handleClickRadio?: ()=>void,
    handleClickText?: ()=>void
}