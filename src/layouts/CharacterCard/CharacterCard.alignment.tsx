import { useMouse } from '@uidotdev/usehooks';
import React, { useState } from 'react';
import { charActions } from '../../store/slices/Characters.slice';
import { calcAlignmentByCoordinates, getAlignmentEditChildren, getRelativeDistance } from './CharacterCard.helpers';
import { Character } from '../../interfaces/Character.interface';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { EditCustomPopup } from '../../components/EditCustomPopup/EditCustomPopup';
import styles from './CharacterCard.module.css';
import cn from 'classnames';

interface EditAlignmentProps {
	character: Character,
	onChangeChar: (() => void) | undefined,
	setAlignmentClicked: React.Dispatch<React.SetStateAction<boolean>>
}
export function EditAlignment({character, onChangeChar, setAlignmentClicked}: EditAlignmentProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [mouse] = useMouse();
	const [{alignment, alShort}, setAlignment] = useState(
		{
			alignment: character.info.alignment.name, 
			alShort: character.info.alignmentShort
		});
	const [savedX, setSavedX] = useState(character.info.alignment.coordinates.x);
	const [savedY, setSavedY] = useState(character.info.alignment.coordinates.y);
	const [isHovering, setIsHovering] = useState(false);
	const coordinateRectRef = React.createRef<HTMLDivElement>();

	const onCancelEditAlignment = () => {
		setAlignmentClicked(false);
		setAlignment({
			alignment: character.info.alignment.name,
			alShort: character.info.alignmentShort
		});
	};

	const onClickCoordinateRect = () => {
		if (coordinateRectRef.current && isHovering) {
			const rect = coordinateRectRef.current.getBoundingClientRect();
			const {x, y} = getRelativeDistance({x: mouse.x, y: mouse.y}, rect);
			const {name, shortName} = calcAlignmentByCoordinates(x, y);
			setSavedX(x);
			setSavedY(y);
			setAlignment({
				alignment: name,
				alShort: shortName
			});
		}
	};

	const onSaveAlignment = () => {
		dispatch(charActions.editAlignment({id: character.id, value: {
			name: alignment,
			shortName: alShort,
			coordinates: {
				x: savedX,
				y: savedY
			}
		}}));
		if (onChangeChar) onChangeChar();
		setAlignmentClicked(false);
	};

	return <EditCustomPopup 
		onCancel={onCancelEditAlignment} 
		wrapperCN={cn(styles['green'], styles['alignment-popup-wrapper'])}
		header={alignment} 
		children={getAlignmentEditChildren({coordinateRectRef, setIsHovering, onClickCoordinateRect, onSaveAlignment, coordinates: {x: savedX, y: savedY}})}/>;
}