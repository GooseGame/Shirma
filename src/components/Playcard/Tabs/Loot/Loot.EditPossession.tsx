import { useRef, useState } from 'react';
import { Character } from '../../../../interfaces/Character.interface';
import styles from './Loot.module.css';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { charActions } from '../../../../store/slices/Characters.slice';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';
import { RoundButton } from '../../../Button/Button';
import { v4 as uuidv4 } from 'uuid';

interface EditPossessionProps {
  player: Character;
  onChangeChar: ((popupText?: string, popupHeader?: string) => void) | undefined;
  reset: () => void;
}

export function EditPossession({ player, onChangeChar, reset }: EditPossessionProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [savedPoss, setSavedPoss] = 
		useState<{ 
			categoryId: string; 
			category: string; 
			items: { 
				id: string; 
				word: string 
			}[] }[]
		>(player.info.text.possession);
	const [changedCategory, setChangedCategory] = useState<string | undefined>();
	const [clickedCategory, setClickedCategory] = useState<string | undefined>();
	const [changedPossItem, setChangedPossItem] = useState<string | undefined>();
	const [clickedPossItem, setClickedPossItem] = useState<string | undefined>();
	const [clickedCatId, setClickedCatid] = useState<string>();
	const [clickedPossId, setClickedPossId] = useState<string>();

	// Dynamic refs for inputs
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

	const confirm = () => {
		dispatch(charActions.setPossession({ id: player.id, poss: savedPoss }));
		if (onChangeChar) onChangeChar();
	};

	const onSave = () => {
		confirm();
		reset();
	};

	const onCancel = () => {
		setSavedPoss(player.info.text.possession);
		setChangedCategory(undefined);
		setClickedCategory(undefined);
		setClickedPossId(undefined);
		setChangedPossItem(undefined);
		setClickedPossItem(undefined);
		setClickedCatid(undefined);
		reset();
	};

	const handleClickAddCategory = () => {
		setSavedPoss([...savedPoss, { categoryId: uuidv4(), category: 'Новая категория', items: [] }]);
		confirm();
	};

	const handleClickAddToCategory = (categoryId: string) => {
		setSavedPoss(
			savedPoss.map((poss) =>
				poss.categoryId !== categoryId
					? poss
					: {
						...poss,
						items: [
							...poss.items,
							{
								id: uuidv4(),
								word: 'Новое владение'
							}
						]
					}
			)
		);
		confirm();
	};

	const handleConfirmChangeCategory = (text: string) => {
		if (clickedCategory) {
			setSavedPoss(
				savedPoss.map((poss) =>
					poss.categoryId !== clickedCategory
						? poss
						: {
							...poss,
							category: text
						}
				)
			);
			confirm();
		}
	};

	const handleConfirmChangePossItem = (categoryId: string, itemId: string) => {
		if (clickedPossItem && changedPossItem) {
			setSavedPoss(
				savedPoss.map((poss) =>
					poss.categoryId !== categoryId
						? poss
						: {
							...poss,
							items: poss.items.map((pItem) =>
								pItem.id !== itemId
									? pItem
									: {
										...pItem,
										word: changedPossItem
									}
							)
						}
				)
			);
			confirm();
		}
	};

	const handleClickRemoveCategory = (categoryId: string) => {
		setSavedPoss(savedPoss.filter((poss) => poss.categoryId !== categoryId));
		setClickedCatid(undefined);
		setChangedCategory(undefined);
		setClickedCategory(undefined);
		delete inputRefs.current[categoryId];
		confirm();
	};

	const handleClickRemovePossItem = (categoryId: string, itemId: string) => {
		setSavedPoss(
			savedPoss.map((poss) =>
				poss.categoryId !== categoryId
					? poss
					: {
						...poss,
						items: poss.items.filter((pitem) => pitem.id !== itemId)
					}
			)
		);
		setClickedPossId(undefined);
		setChangedPossItem(undefined);
		setClickedPossItem(undefined);
		delete inputRefs.current[itemId];
		confirm();
	};

	return (
		<EditCustomPopup
			header="Изменить владение"
			scrollable
			wrapperCN={styles['edit-poss-wrapper']}
			color="yellow"
			onCancel={onCancel}
		>
			<div className={styles['eq-inputs']}>
				<RoundButton
					classNames={cn(styles['full-size-icon'], styles['add-cat'], 'small-shadow')}
					onClick={handleClickAddCategory}
				>
					<span className={styles['add-cat-text']}>Добавить категорию владения</span>
					<img src="/plus.svg" className={styles['big-plus']} />
				</RoundButton>
				{savedPoss.map((poss) => (
					<div key={poss.categoryId} className={styles['poss-category']}>
						<div className={styles['cat-wrapper']}>
							<input
								ref={(el) => (inputRefs.current[poss.categoryId] = el)}
								type="text"
								value={(clickedCategory === poss.categoryId ? changedCategory : poss.category) || ''}
								className={styles['cat-input']}
								onClick={() => {setClickedCategory(poss.categoryId); setClickedCatid(poss.categoryId);}}
								onChange={(e) => setChangedCategory(e.target.value)}
							/>
							{(changedCategory && changedCategory !== '' && clickedCatId === poss.categoryId) && (
								<div
									className={styles['cat-input-btn']}
									onClick={() => {handleConfirmChangeCategory(changedCategory); setClickedCatid(undefined);}}
								>
									<img src="/more-white.svg" className={styles['save-img']} alt="confirm cat" />
								</div>
							)}
							<div className={styles['delete-wrapper']} onClick={() => handleClickRemoveCategory(poss.categoryId)}>
								<img src="/x-red.svg" alt="delete category" className={styles['delete-img']} />
							</div>
						</div>
						<div className={styles['pitems-container']}>
							{poss.items.map((pitem) => (
								<div className={styles['pitem-wrapper']} key={pitem.id}>
									<input
										ref={(el) => (inputRefs.current[pitem.id] = el)}
										type="text"
										value={(clickedPossItem === pitem.id ? changedPossItem : pitem.word) || ''}
										className={styles['pitem-input']}
										onClick={() => {setClickedPossItem(pitem.id); setClickedPossId(pitem.id);}}
										onChange={(e) => setChangedPossItem(e.target.value)}
									/>
									{(changedPossItem && changedPossItem !== '' && clickedPossId === pitem.id) && (
										<div
											className={styles['pitem-input-btn']}
											onClick={() => {handleConfirmChangePossItem(poss.categoryId, pitem.id); setClickedPossId(undefined);}}
										>
											<img src="/more-white.svg" className={styles['save-img']} alt="confirm poss" />
										</div>
									)}
									<div
										className={cn(styles['delete-wrapper'], styles['delete-poss'])}
										onClick={() => handleClickRemovePossItem(poss.categoryId, pitem.id)}
									>
										<img src="/x-red.svg" alt="delete possession" className={styles['delete-img']} />
									</div>
								</div>
							))}
							<div className={styles['pitem-wrapper']}>
								<RoundButton
									classNames={cn(styles['full-size-icon'], styles['add-poss-wrapper'], 'small-shadow')}
									onClick={() => handleClickAddToCategory(poss.categoryId)}
								>
									<img src="/plus.svg" className={styles['small-plus']} />
								</RoundButton>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className={styles['save-btn']} onClick={onSave}>
				<img src="/more-white.svg" alt="confirm" className={styles['save-img']} />
			</div>
		</EditCustomPopup>
	);
}
