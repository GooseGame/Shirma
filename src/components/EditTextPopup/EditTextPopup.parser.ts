import { Link, Paragraph, Word, Image, Text } from '../../interfaces/Text.interface';

const linkStyles = ['bold','italic','underline','overline','normal'];
const textStyles = ['bold','italic','underline','overline','normal', 'hidden'];

export const parseText = (input: string): Text => {
	const paragraphs = input.split(/\n\n/).map((para) => {
		const paragraphItems = para.split(/\|+/).map((item) => {
			try {
				if (item.startsWith('url(') && item.endsWith(')')) {
					// Парсим ссылку
					const [to, word, style = 'normal'] = item
						.slice(4, -1) // Убираем "url(" и ")"
						.split('&')
						.map((part) => part.split('=')[1].replace(/'/g, ''));
					const validStyle = linkStyles.includes(style) ? style : 'normal';
					return { type: 'link', to, word, style: validStyle } as Link;
				} else if (item.startsWith('img(') && item.endsWith(')')) {
					// Парсим изображение
					const [src, alt = '', height, width] = item
						.slice(4, -1)
						.split('&')
						.map((part) => part.split('=')[1].replace(/'/g, ''));
					return {
						type: 'image',
						src,
						alt,
						height: height ? parseInt(height) : undefined,
						width: width ? parseInt(width) : undefined
					} as Image;
				} else if (item.startsWith('word(') && item.endsWith(')')){
					const [word, style] = item
						.slice(5, -1)
						.split('&')
						.map((part) => part.split('=')[1].replace(/'/g, ''));
					const validStyle = textStyles.includes(style) ? style : 'normal';
					return {
						type: 'word',
						word,
						style: validStyle
					} as Word;
				}
				else return { type: 'word', word: item, style: 'normal' } as Word;
			} catch (e) {
				return {type: 'word', word: item, style: 'normal'};
			}
		});
		return { paragraph: paragraphItems } as Paragraph;
	});
	return { type: 'text', text: paragraphs } as Text;
};

export function parseReverse(text: Text) {
	const result = text.text.map(parag => {
		return '\n\n'+parag.paragraph.map(word => {
			if (word.type === 'word') {
				if (word.style === 'normal') return word.word;
				else return `|word(word=${word.word}&style=${word.style})|`;
			}
			else if (word.type === 'link') {
				return `|url(to=${word.to}&word=${word.word}&style=${word.style})|`;
			}
			else {
				return `|img(src=${word.src}&alt=${word.alt})|`;
			}
		}).join('');
	});
	return result.join('').substring(2);
}