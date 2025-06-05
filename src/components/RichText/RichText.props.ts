import { HTMLAttributes } from 'react';
import { Text } from '../../interfaces/Text.interface';

export interface RichTextProps extends HTMLAttributes<HTMLDivElement> {
    text: Text,
    classNames?: string,
    eyesRight?: boolean
}