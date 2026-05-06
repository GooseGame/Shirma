import { FC, ReactNode } from 'react';
import { TextInput } from '../../components/TextInput/TextInput';
import { SquareButton } from '../../components/Button/Button';
import styles from './CharacterCard.module.css';
import type { DesktopSideData } from './CharacterCard.segments';

interface CharacterCardDesktopSideProps {
	desktopData: DesktopSideData;
	accessToken: string | null | undefined;
	onClickSave: () => Promise<void>;
	onClickDelete?: () => Promise<void>;
	saveButtonLabel?: string;
	renderDesktopPanel?: (data: DesktopSideData) => ReactNode;
	actionsBottomContent?: ReactNode;
}

/** Дефолтная расстановка; можно обернуть или частично повторить в `renderDesktopPanel`. */
export const DefaultDesktopPanel: FC<{ data: DesktopSideData }> = ({ data }) => {
	const { info, characteristics, arsenal, attacks } = data;

	return (
		<div className={styles['desktop-panel']}>
			<div className={styles['desktop-panel-avatar-wrapper']}>
				<div className={styles['desktop-panel-stats']}>
					{characteristics.armor}
					{info.onChangeHeader
						? <TextInput
							textCN={styles['desktop-panel-header-text']}
							inputCN={styles['desktop-panel-input']}
							wrapperCN={styles['desktop-panel-input-wrapper']}
							buttonCN={styles['desktop-panel-input-confirm']}
							initialText={info.header}
							onSave={info.onChangeHeader}
						/>
						: <span className={styles['desktop-panel-header-text']}>{info.header}</span>}
					{characteristics.speed}
				</div>
				{info.avatar && (
					<div className={styles['desktop-panel-avatar']}>
						{info.avatar}
					</div>
				)}
				<div className={styles['desktop-panel-row']}>
					{characteristics.raceClass}
				</div>
				<div className={styles['desktop-panel-row']}>
					{info.alignment}
				</div>
			</div>
			<div className={styles['desktop-panel-bottom-row']}>
				<div className={styles['desktop-row-item']}>
					<div className={styles['desktop-row-item-icon-wrapper']}>
						<img src={'/xp.svg'} alt='experience' className={styles['desktop-row-item-icon']} />
					</div>
					<div className={styles['desktop-row-right-wrapper']}>
						{info.levelExp}
					</div>
				</div>
				<div className={styles['desktop-row-item']}>
					<div className={styles['desktop-row-item-icon-wrapper']}>
						<img src={'/hp-brown.svg'} alt='health' className={styles['desktop-row-item-icon']} />
					</div>
					<div className={styles['desktop-row-right-wrapper']}>
						{characteristics.healthAndProf}
					</div>
				</div>
				<div className={styles['desktop-row-item']}>
					<div className={styles['desktop-row-item-icon-wrapper']}>
						<img src={'/coins-new.svg'} alt='coins' className={styles['desktop-row-item-icon']} />
					</div>
					<div className={styles['desktop-row-right-wrapper']}>
						{arsenal.coins}
					</div>
				</div>
				<div className={styles['desktop-row-item']}>
					<div className={styles['desktop-row-item-icon-wrapper']}>
						<img src={'/fight.svg'} alt='initiative' className={styles['desktop-row-item-icon']} />
					</div>
					<div className={styles['desktop-row-right-wrapper']}>
						{attacks.initiativeAndInspiration}
					</div>
				</div>
			</div>
		</div>
	);
};

export const CharacterCardDesktopSide: FC<CharacterCardDesktopSideProps> = ({
	desktopData,
	accessToken,
	onClickSave,
	onClickDelete,
	saveButtonLabel,
	renderDesktopPanel,
	actionsBottomContent
}) => {
	return (
		<div className={styles['desktop-side']}>
			{renderDesktopPanel
				? renderDesktopPanel(desktopData)
				: <DefaultDesktopPanel data={desktopData} />}
			<div className={styles['desktop-actions']}>
				<div className={styles['desktop-actions-main']}>
					{onClickDelete && (
						<SquareButton
							isBigShadow={true}
							classNames={styles['deleteBtn']}
							onClick={onClickDelete}
						>
							Удалить
						</SquareButton>
					)}
					<SquareButton
						isBigShadow={true}
						classNames={styles['saveBtn']}
						disabled={!accessToken}
						onClick={onClickSave}
					>
						{saveButtonLabel ?? 'Сохранить'}
					</SquareButton>
				</div>
				{actionsBottomContent && (
					<div className={styles['desktop-actions-bottom']}>
						{actionsBottomContent}
					</div>
				)}
			</div>
		</div>
	);
};
