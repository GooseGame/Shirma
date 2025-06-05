import { HTMLAttributes } from 'react';
import { PopupProps } from '../Popup/Popup.props';
import { Damage, DiceCheck } from '../../interfaces/Equipment.interface';

export interface RollBoxProps extends HTMLAttributes<HTMLDivElement> {
    dicesSent?: Damage[]|DiceCheck[];
    setPopup?:  (popup: PopupProps) => void;
}