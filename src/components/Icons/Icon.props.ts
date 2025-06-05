import { HTMLAttributes } from 'react';

export interface IconsProps extends HTMLAttributes<HTMLImageElement> {
    src: string,
    alt: string,
    classNames? : string
}