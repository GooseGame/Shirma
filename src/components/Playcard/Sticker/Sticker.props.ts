import { HTMLAttributes, ReactNode } from 'react';
import { Text } from '../../../interfaces/Text.interface';

export interface List {
    type: 'list',
    children: ReactNode
}

export interface StickerProps extends HTMLAttributes<HTMLDivElement> {
    width:              0.5|0.25|0.33,
    fullHeight?:        boolean,
    scrollable?:        boolean,
    header?:            string,
    afterHeaderEl?:     ReactNode,
    hasAddButton?:      boolean,
    onClickAddButton?:  ()=>void,
    bodyContent:        Text|List,
    stickerCN?:         string,
    bodyCN?:            string,
    headerCN?:          string,
    eyesRight?:         boolean,
    stickerStyle?:      'box'|'paper'|'metal'
}