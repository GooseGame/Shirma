import styles from './CharacterCard.module.css';
import cn from 'classnames';

const alignments = [
	{
		name: 'Законно-Добрый',
		shortName: 'З-Д',
		xRange: {
			from: 	0,
			to:		33
		},
		yRange: {
			from: 	0,
			to:		33
		}
	},
	{
		name: 'Нейтрально-Добрый',
		shortName: 'Н-Д',
		xRange: {
			from: 	34,
			to:		66
		},
		yRange: {
			from: 	0,
			to:		33
		}
	},
	{
		name: 'Хаотично-Добрый',
		shortName: 'Х-Д',
		xRange: {
			from: 	67,
			to:		100
		},
		yRange: {
			from: 	0,
			to:		33
		}
	},
	{
		name: 'Законно-Нейтральный',
		shortName: 'З-Н',
		xRange: {
			from: 	0,
			to:		33
		},
		yRange: {
			from: 	34,
			to:		66
		}
	},
	{
		name: 'Нейтральный',
		shortName: 'Н-Н',
		xRange: {
			from: 	34,
			to:		66
		},
		yRange: {
			from: 	34,
			to:		66
		}
	},
	{
		name: 'Хаотично-Нейтральный',
		shortName: 'Х-Н',
		xRange: {
			from: 	67,
			to:		100
		},
		yRange: {
			from: 	34,
			to:		66
		}
	},
	{
		name: 'Законно-Злой',
		shortName: 'З-З',
		xRange: {
			from: 	0,
			to:		33
		},
		yRange: {
			from: 	67,
			to:		100
		}
	},
	{
		name: 'Нейтрально-Злой',
		shortName: 'Н-З',
		xRange: {
			from: 	34,
			to:		66
		},
		yRange: {
			from: 	67,
			to:		100
		}
	},
	{
		name: 'Хаотично-Злой',
		shortName: 'Х-З',
		xRange: {
			from: 	67,
			to:		100
		},
		yRange: {
			from: 	67,
			to:		100
		}
	}
];

interface AlignmentReturn {
	name: string,
	shortName: string
}
export function calcAlignmentByCoordinates(x: number, y: number): AlignmentReturn {
	const alignmentObj = alignments.find(al=>((al.xRange.from <= x && al.xRange.to >= x) && (al.yRange.from <= y && al.yRange.to >= y)));
	if (!alignmentObj) return {name: 'Нейтральный', shortName: 'Н-Н'};
	return {name: alignmentObj.name, shortName: alignmentObj.shortName};
}

export function getRelativeDistance(mouseCoordinate: {x: number, y: number}, rectCoordinate: DOMRect) {
	if (rectCoordinate.width === 0 || rectCoordinate.height === 0) return {x: 0, y: 0};
	const xDist = mouseCoordinate.x - rectCoordinate.x;
	const yDist = mouseCoordinate.y - rectCoordinate.y;
	console.log({
		x: Math.round(xDist / rectCoordinate.width * 100),
		y: Math.round(yDist / rectCoordinate.width * 100)
	});
	return {
		x: Math.round(xDist / rectCoordinate.width * 100),
		y: Math.round(yDist / rectCoordinate.width * 100)
	};
}

interface AlignmentEditProps {
	coordinateRectRef: 		React.RefObject<HTMLDivElement>, 
	setIsHovering: 			React.Dispatch<React.SetStateAction<boolean>>,
	onClickCoordinateRect: 	()=>void,
	onSaveAlignment: 		()=>void,
	coordinates:			{x: number, y: number}
}
export function getAlignmentEditChildren({coordinateRectRef, setIsHovering, onClickCoordinateRect, onSaveAlignment, coordinates}: AlignmentEditProps) {
	return <div className={styles['content-alignment']}>
		<div className={styles['coordinates']} ref={coordinateRectRef} onClick={onClickCoordinateRect} onMouseEnter={()=>setIsHovering(true)} onMouseLeave={()=>setIsHovering(false)}>
			{alignments.map(al => (
				<div className={styles['alignment']} key={al.shortName}><div className={styles['al-text']}>{al.name}</div></div>
			))}
			<div className={styles['dot']} style={{left: `calc(${coordinates.x}% - 7px)`, top: `calc(${coordinates.y}% - 7px)`}}></div>
		</div>
		<div className={styles['save-btn']} onClick={onSaveAlignment}>
			<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
		</div>
	</div>;
}

interface RaceClassEditProps {
	savedRace: string, 
	setSavedRace: React.Dispatch<React.SetStateAction<string>>, 
	savedClassName: string, 
	setSavedClassName: React.Dispatch<React.SetStateAction<string>>, 
	savedSubClassName: string | undefined, 
	setSavedSubClassName: React.Dispatch<React.SetStateAction<string|undefined>>, 
	handleSaveRaceClassForm: () => void
}

export const getEditRaceClassInputs = ({savedRace, setSavedRace, savedClassName, setSavedClassName, savedSubClassName, setSavedSubClassName, handleSaveRaceClassForm}: RaceClassEditProps) => {
	const isValid = (savedRace !== '') && (savedClassName !== '');
	return <div className={styles['class-race-content']}>
		<input 
			type='text' 
			className={cn(styles['text-input'], savedRace === '' ? styles['wrong'] : '')} 
			value={savedRace} 
			onChange={(e)=>setSavedRace(e.target.value)} 
			placeholder='Введите расу' required />
		<input 
			type='text' 
			className={cn(styles['text-input'], savedClassName === '' ? styles['wrong'] : '')} 
			value={savedClassName} 
			onChange={(e)=>setSavedClassName(e.target.value)} 
			placeholder='Введите класс' required />
		<input 
			type='text' 
			className={styles['text-input']} 
			value={savedSubClassName} 
			onChange={(e)=>e.target.value !== '' ? setSavedSubClassName(e.target.value) : setSavedSubClassName(undefined)} 
			placeholder='Введите подкласс (или не вводите)'/>
		<div className={cn(styles['save-btn'], isValid ? '' : styles['invisible'])} onClick={handleSaveRaceClassForm}>
			<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
		</div>
	</div>;
};

interface IniciativeProps {
	savedIni: number,
	setSavedIni: React.Dispatch<React.SetStateAction<number>>
	handleSave: ()=>void
}

export const getIniciativeBody = ({savedIni, setSavedIni, handleSave}: IniciativeProps) => {
	return <div className={styles['ini-content']}>
		<label htmlFor='iniciative' className={styles['input-label']}>Значение</label>
		<input 
			type='number' 
			value={savedIni} 
			onChange={(e)=> e.target.value !== '' ? setSavedIni(parseInt(e.target.value)) : setSavedIni(0)}
			id='iniciative'
			className={styles['text-input']} 
		/>
		<div className={cn(styles['save-btn'])} onClick={handleSave}>
			<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
		</div>
	</div>;
};
