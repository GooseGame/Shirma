import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface RoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    classNames?: string;
    size?: '30'|'20';
    isRed?: boolean;
}

export interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    classNames?: string;
}

export interface SquareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    classNames?: string;
    isBigShadow: boolean;
}