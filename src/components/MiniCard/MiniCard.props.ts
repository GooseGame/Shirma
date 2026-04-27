import { HTMLAttributes } from 'react';
import { Character } from '../../interfaces/Character.interface';

/** Локальная версия новее сервера или персонажа ещё нет в ответе /lastUpdated. */
export type MiniCardSyncSave =
	| { kind: 'notOnServer' }
	| { kind: 'newerThanServer'; serverSavedAt: number };

export interface MiniCardProps extends HTMLAttributes<HTMLDivElement> {
    creature: Character;
    deleteAction?: (id: string)=>void;
    cloneAction?: (char: Character) => void;
    onClickAction?: (char: Character) => void;
    /** Если задано вместе с onSyncSave — показываем одну кнопку «Сохранить» вместо клон/удалить. */
    syncSave?: MiniCardSyncSave | null;
    onSyncSave?: (char: Character) => void;
    usaved?: boolean;
}