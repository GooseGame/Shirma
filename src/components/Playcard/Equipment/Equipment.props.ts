import { HTMLAttributes } from 'react';
import { EquipmentItem } from '../../../interfaces/Equipment.interface';

export interface EquipmentProps extends HTMLAttributes<HTMLDivElement> {
    item: EquipmentItem,
    size?: 'small'|'medium',
    classNames?: string,
    onClickMore?: ()=>void,
    onClickLess?: ()=>void,
    onClickDelete?: ()=>void,
    onClickText?: ()=>void
}