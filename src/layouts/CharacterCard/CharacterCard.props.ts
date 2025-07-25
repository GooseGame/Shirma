import { HTMLAttributes } from 'react';
import { Damage, DiceCheck } from '../../interfaces/Equipment.interface';
import { Character } from '../../interfaces/Character.interface';
import { PopupProps } from '../../components/Popup/Popup.props';

export interface CharacterCardProps extends HTMLAttributes<HTMLDivElement> {
    character: Character;
    setDiceRoll?: React.Dispatch<React.SetStateAction<Damage[]| DiceCheck[]>>;
    setEditText?: React.Dispatch<React.SetStateAction<Text|undefined>>;
    onChangeChar?: (popupText?: string, popupHeader?: string)=>void;
    setPopup?: ((popup: PopupProps) => void) | undefined;
}