import { HTMLAttributes, ReactNode } from 'react';

export interface StickerListProps extends HTMLAttributes<HTMLDivElement> {
    headCN?: string,
    descriptionCN?: string,
    header: string,
    desc: {
        type: 'word',
        children: {id: string, word: string}[]
    }|{
        type:       'node',
        childrem:   ReactNode
    },
    listStyle?: 'paper'|'metal',
    afterHeaderEl?: ReactNode
}