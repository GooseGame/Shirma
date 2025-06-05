import { HTMLAttributes, ReactNode } from 'react';

export interface HeadSegmentProps extends HTMLAttributes<HTMLDivElement> {
    header: string,
    segmentId: string,
    segmentName: string,
    leftChildren?: ReactNode,
    bottomChildren?: ReactNode,
    classNames?: string,
    active?:    boolean,
    onChangeHeader?: (text: string)=>void
}