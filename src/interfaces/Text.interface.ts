export interface Text {
    type: 'text',
    text: Paragraph[];
}

export interface Paragraph {
    paragraph: (Word|Link|Image)[]
}

export interface Word {
    type: 'word',
    word: string,
    style: 'bold'|'italic'|'underline'|'overline'|'normal'|'hidden'
}

export interface Image {
    type: 'image',
    src:    string,
    alt?:   string,
    height?: number,
    width?:  number
}

export interface Link {
    type: 'link',
    to: string,
    word: string,
    style: 'bold'|'italic'|'underline'|'overline'|'normal'
}