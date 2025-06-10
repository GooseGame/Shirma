import { HTMLAttributes, ReactNode } from 'react';

export interface EyeProps extends HTMLAttributes<HTMLDivElement> {
    text: string,
    size?: 'normal'|'small',
    floatRight?: boolean,
    white?: boolean,
    ElementIstead?: ReactNode,
    offsetHint?: number,
    classNames?: string,
    hintCN?: string
}