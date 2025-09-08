import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { associativeCells, Character, CharactersResponse, CountResponse, Dice, Skill, Stat, TimestampResponse } from '../../interfaces/Character.interface';
import {Text} from '../../interfaces/Text.interface';
import { loadState } from '../storage';
import { randomHash } from '../../helpers/random';
import { EquipmentItem, Weapon } from '../../interfaces/Equipment.interface';
import { getGoldEquivalent, removeCoins } from '../../helpers/coins';
import { nextLevelExpCap, thatLevelLowBorder } from '../../helpers/experience';
import { Spell } from '../../interfaces/spells.interface';
import axios, { AxiosError } from 'axios';
import { server } from './User.slice';
import { RootState } from '../store';

export const CHAR_KEY = 'characters';

export interface CharState {
	characters: Character[],
	errMessage?: string,
	charactersLoaded: boolean,
	needToUpdate: boolean,
	lastUpdateTimestamp?: number
}

export interface CharPersistentState {
    characters: Character[]|null,
	charactersLoaded: boolean,
	needToUpdate: boolean
}

const initialState: CharState = {
	characters: loadState<CharPersistentState>(CHAR_KEY)?.characters ?? [],
	charactersLoaded: loadState<CharPersistentState>(CHAR_KEY)?.characters ? true : false,
	needToUpdate: true
};

export const load = createAsyncThunk<CharactersResponse, void, {state: RootState}>('characters/load', 
	async (_, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<CharactersResponse>(`${server}/characters/get`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return data;
	}
);

export const count = createAsyncThunk<CountResponse, void, {state: RootState}>('characters/count', 
	async (_, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<CountResponse>(`${server}/characters/count`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return data;
	}
);

export const timestamp = createAsyncThunk<TimestampResponse, void, {state: RootState}>('characters/timestamp', 
	async (_, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<TimestampResponse>(`${server}/characters/lastUpdated`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return data;
	}
);

export const deleteChar = createAsyncThunk('characters/deleteChar', 
	async (params: {charId: string, accessToken: string}) => {
		try {
			const { data } = await axios.post<{success: boolean}>(`${server}/characters/delete`, {
				id: params.charId
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${params.accessToken}`
				}
			});
			return data;
		} catch(e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
		}
	}
);

export const save = createAsyncThunk('characters/save', 
	async (params: {character: Character, accessToken: string, timestamp: number}) => {
		try {
			const { data } = await axios.post<{success: boolean}>(`${server}/characters/save`, {
				character: params.character,
				timestamp: params.timestamp
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${params.accessToken}`
				}
			});
			return data;
		} catch(e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
		}
	}
);

export const charsSlice = createSlice({
	name: 'characters',
	initialState,
	reducers: {
		clearErr: (state) => {
			state.errMessage = undefined;
		},
		add: (state, action: PayloadAction<Character>) => {
			const idInCharList = state.characters.find(i => i.id === action.payload.id);
			if (!idInCharList) {
				state.characters.push(action.payload);
			}
		},
		remove: (state, action: PayloadAction<string>) => {
			state.characters = state.characters.filter((i => i.id !== action.payload));
		},
		clear: (state) => {
			state.characters = [];
		},
		edit: (state, action: PayloadAction<Character>) => {
			state.characters = state.characters.filter(i => i.id !== action.payload.id);
			state.characters.push(action.payload);
		},
		editName: (state, action: PayloadAction<{id: string, name: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: { 
						...ch.info,
						name: action.payload.name
					}
				};
			});
		},
		editAvatar: (state, action: PayloadAction<{id: string, name: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					avatar: action.payload.name
				};
			});
		},
		editText: (state, action: PayloadAction<{id: string, text: Text, property: 'background'|'features'|'allies'|'prof'|'weaknesses'|'affections'|'ideals'|'quests'|'traits'}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						text: {
							...ch.info.text,
							[action.payload.property]: action.payload.text
						}
					}
				};
			});
		},
		addNote: (state, action: PayloadAction<{id: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						text: {
							...ch.info.text,
							notes: [...ch.info.text.notes,{
								id: randomHash(),
								name: 'Новая заметка',
								text: {
									type: 'text',
									text: []
								} 
							}]
						}
					}
				};
			});
		},
		removeNote: (state, action: PayloadAction<{id: string, noteId: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						text: {
							...ch.info.text,
							notes: ch.info.text.notes.filter(note => note.id !== action.payload.noteId)
						}
					}
				};
			});
		},
		editNote: (state, action: PayloadAction<{id: string, note: {id: string, name: string, text: Text}}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						text: {
							...ch.info.text,
							notes: [...ch.info.text.notes.filter(note => note.id !== action.payload.note.id), action.payload.note]
						}
					}
				};
			});
		},
		editBGTitle: (state, action: PayloadAction<{id: string, bgTitle: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						backgroundTitle: action.payload.bgTitle
					}
				};
			});
		},
		editMeasure: (state, action: PayloadAction<{id: string, value: string, property: 'hair'|'skin'|'age'|'height'|'weight'|'eyes'}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						measurements: {
							...ch.info.measurements,
							[action.payload.property]: action.payload.value
						}
					}
				};
			});
		},
		editAlignment: (state, action: PayloadAction<{id: string, value: {name: string, shortName: string, coordinates: {x: number, y: number}}}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						alignmentShort: action.payload.value.shortName,
						alignment: {
							name: action.payload.value.name,
							coordinates: {
								x: action.payload.value.coordinates.x,
								y: action.payload.value.coordinates.y
							}
						}
					}
				};
			});
		},
		editStat: (state, action: PayloadAction<{id: string, value: Stat}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					stats: ch.stats.map(stat => (
						(action.payload.value.name === stat.name) ? action.payload.value : stat
					))
				};
			});
		},
		editSkill: (state, action: PayloadAction<{id: string, value: {statName: string, skill: Skill}}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					stats: ch.stats.map(stat => (
						(action.payload.value.statName !== stat.name) 
							? stat 
							: {
								...stat,
								skills: stat.skills.map(skillItem => skillItem.name === action.payload.value.skill.name 
									? action.payload.value.skill 
									: skillItem
								)
							}
					))
				};
			});
		},
		editClassSubclassRace: (state, action: PayloadAction<{id: string, value: {race: string, className: string, subclass: string|undefined}}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						race: action.payload.value.race,
						class: {
							name: action.payload.value.className,
							subclass: action.payload.value.subclass
						}
					}
				};
			});
		},
		editArmor: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						armor: action.payload.value
					}
				};
			});
		},
		editSpeed: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						speed: action.payload.value
					}
				};
			});
		},
		editExhaustion: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						exhaustionLvl: action.payload.value
					}
				};
			});
		},
		incEquipmentItem: (state, action: PayloadAction<{id: string, name: string, type: 'equipment'|'treasure'|'quest'}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						[action.payload.type]: ch.backpack[action.payload.type].map(item => {
							if (item.name !== action.payload.name) return item;
							return {...item, count: item.count+1};
						})
					}
				};
			});
		},
		decEquipmentItem: (state, action: PayloadAction<{id: string, name: string, type: 'equipment'|'treasure'|'quest'}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						[action.payload.type]: ch.backpack[action.payload.type].map(item => {
							if (item.name !== action.payload.name) return item;
							if (item.count - 1 !== 0) {
								return {...item, count: item.count-1};
							}
						}).filter(item => item !== undefined)
					}
				};
			});
		},
		addEquipmentItem: (state, action: PayloadAction<{id: string, value: EquipmentItem, type: 'equipment'|'treasure'|'quest'}>) => {
			let isExistInBackpack = false;
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				const result = ch.backpack[action.payload.type].map(item => {
					if (item.name !== action.payload.value.name) return item;
					isExistInBackpack = true;
					return {...item, count: item.count+1};
				});
				return {
					...ch,
					backpack: {
						...ch.backpack,
						[action.payload.type]: isExistInBackpack ? result : [...result, action.payload.value]
					}
				};
			});
		},
		editEquipmentItem: (state, action: PayloadAction<{id: string, value: EquipmentItem, oldName: string, type: 'equipment'|'treasure'|'quest'}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						[action.payload.type]: ch.backpack[action.payload.type].map(item => {
							if (item.name !== action.payload.oldName) return item;
							return action.payload.value;
						})
					}
				};
			});
		},
		deleteEquipmentItem: (state, action: PayloadAction<{id: string, name: string, type: 'equipment'|'treasure'|'quest'}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						[action.payload.type]: ch.backpack[action.payload.type].filter(item => item.name !== action.payload.name)
					}
				};
			});
		},
		setPossession: (state, action: PayloadAction<{id: string, poss: {category: string, categoryId: string, items: {id: string, word: string}[]}[]}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						text: {
							...ch.info.text,
							possession: action.payload.poss
						}
					}
				};
			});
		},
		deleteWeapon: (state, action: PayloadAction<{id: string, value: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						weapons: ch.backpack.weapons.filter(weapon => weapon.id !== action.payload.value)
					}
				};
			});
		},
		editWeapon: (state, action: PayloadAction<{id: string, value: Weapon}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						weapons: [...ch.backpack.weapons.filter(weapon => weapon.id !== action.payload.value.id), action.payload.value]
					}
				};
			});
		},
		addWeapon: (state, action: PayloadAction<{id: string, value: Weapon}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						weapons: [...ch.backpack.weapons, action.payload.value]
					}
				};
			});
		},
		addRemoveInspiration: (state, action: PayloadAction<{id: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						inspiration: !ch.condition.inspiration
					}
				};
			});
		},
		changeIniciative: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						initiative: action.payload.value
					}
				};
			});
		},
		changeProf: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					proficiency: action.payload.value
				};
			});
		},
		addHealth: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						health: {
							...ch.condition.health,
							current: (ch.condition.health.current+action.payload.value > ch.condition.health.max) ? 
								ch.condition.health.max : ch.condition.health.current+action.payload.value,
							isDying: false
						}
					}
				};
			});
		},
		changeMaxHP: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						health: {
							...ch.condition.health,
							max: action.payload.value
						}
					}
				};
			});
		},
		addExtraHealth: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						health: {
							...ch.condition.health,
							extra: ch.condition.health.extra+action.payload.value
						}
					}
				};
			});
		},
		editHPDice: (state, action: PayloadAction<{id: string, value: Dice}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					condition: {
						...ch.condition,
						health: {
							...ch.condition.health,
							hpDice: action.payload.value
						}
					}
				};
			});
		},
		stabilize: (state, action: PayloadAction<{id: string, mode: 'success'|'fail', value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				const saveResult = action.payload.value;
				return {
					...ch,
					condition: {
						...ch.condition,
						health: {
							...ch.condition.health,
							isDying: (action.payload.mode === 'success' && saveResult >= 3) ? false : ch.condition.health.isDying,
							stabilization: {
								...ch.condition.health.stabilization,
								[action.payload.mode]: saveResult < 0 ? 0 : saveResult > 3 ? 3 : saveResult
							},
							current: (saveResult >= 3 && action.payload.mode === 'success') ? 1 : 0
						}
					}
				};
			});
		},
		removeHealth: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				const extraHealthAfterDmg = ch.condition.health.extra - action.payload.value;
				const currentHealthAfterDmg = extraHealthAfterDmg < 0 ? ch.condition.health.current + extraHealthAfterDmg : ch.condition.health.current;
				console.log(currentHealthAfterDmg);
				return {
					...ch,
					condition: {
						...ch.condition,
						health: {
							...ch.condition.health,
							extra: extraHealthAfterDmg < 0 ? 0 : extraHealthAfterDmg,
							current: currentHealthAfterDmg < 0 ? 0 : currentHealthAfterDmg,
							isDying: currentHealthAfterDmg <= 0 ? true : false,
							stabilization: {
								success: 0,
								fail: 0
							}
						}
					}
				};
			});
		},
		addCoins: (state, action: PayloadAction<{id: string, coinType: 'gold'|'silver'|'copper', value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						coins: {
							...ch.backpack.coins,
							[action.payload.coinType]: ch.backpack.coins[action.payload.coinType] + action.payload.value,
							total: ch.backpack.coins.total + getGoldEquivalent(action.payload.coinType, action.payload.value)
						}
					}
				};
			});
		},
		removeCoins: (state, action: PayloadAction<{id: string, coinType: 'gold'|'silver'|'copper', value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					backpack: {
						...ch.backpack,
						coins: removeCoins(action.payload.coinType, action.payload.value, ch.backpack.coins)
					}
				};
			});
		},
		addExp: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						exp: ch.info.exp+action.payload.value
					}
				};
			});
		},
		removeExp: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				const thatLevelLowBorderCh = thatLevelLowBorder(ch.info.level-1);
				const removeVal = Math.abs(action.payload.value);
				return {
					...ch,
					info: {
						...ch.info,
						exp: (ch.info.exp-removeVal < thatLevelLowBorderCh) ? thatLevelLowBorderCh : ch.info.exp-removeVal
					}
				};
			});
		},
		lvlUp: (state, action: PayloadAction<{id: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				let nextLVLBorder = nextLevelExpCap(ch.info.level);
				if (!nextLVLBorder) nextLVLBorder = 0;
				return {
					...ch,
					info: {
						...ch.info,
						level: ch.info.level+1 <= 20 ? ch.info.level+1 : 20
					}
				};
			});
		},
		lvlDown: (state, action: PayloadAction<{id: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				let nextLVLBorder = nextLevelExpCap(ch.info.level-1);
				if (!nextLVLBorder) nextLVLBorder = 0;
				return {
					...ch,
					info: {
						...ch.info,
						level: ch.info.level-1 != 0 ? ch.info.level-1 : 1
					}
				};
			});
		},
		setLVL: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					info: {
						...ch.info,
						level: action.payload.value
					}
				};
			});
		},
		setCellsAvailible: (state, action: PayloadAction<{id: string, lvl: number, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						cells: ch.spells.cells.map((cellsOfLevel, lvl)=>{
							if (lvl !== action.payload.lvl) return cellsOfLevel;
							return {...cellsOfLevel, availible: action.payload.value};
						})
					}
				};
			});
		},
		setCellsCount: (state, action: PayloadAction<{id: string, lvl: number, value: number, setAsAvailible: boolean}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						cells: ch.spells.cells.map((cellsOfLevel, lvl)=>{
							if (lvl !== action.payload.lvl) return cellsOfLevel;
							return {...cellsOfLevel, count: action.payload.value, availible: action.payload.setAsAvailible ? action.payload.value : cellsOfLevel.availible};
						})
					}
				};
			});
		},
		setExtraCells: (state, action: PayloadAction<{id: string, value?: associativeCells}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						extraCells: action.payload.value
					}
				};
			});
		},
		addSpell: (state, action: PayloadAction<{id: string, value: Spell}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						spells: [...ch.spells.spells, action.payload.value]
					}
				};
			});
		},
		editSpell: (state, action: PayloadAction<{id: string, value: Spell}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						spells: ch.spells.spells.map(el=>{
							if (el.id !== action.payload.value.id) return el;
							return action.payload.value;
						})
					}
				};
			});
		},
		deleteSpell: (state, action: PayloadAction<{id: string, value: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						spells: ch.spells.spells.filter(el=>el.id !== action.payload.value)
					}
				};
			});
		},
		setSpellStat: (state, action: PayloadAction<{id: string, value: string}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						spellsStat: action.payload.value
					}
				};
			});
		},
		setSpellModifier: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						modifier: action.payload.value
					}
				};
			});
		},
		setSpellSaveRoll: (state, action: PayloadAction<{id: string, value: number}>) => {
			state.characters = state.characters.map(ch => 
			{
				if (ch.id !== action.payload.id) return ch;
				return {
					...ch,
					spells: {
						...ch.spells,
						saveRoll: action.payload.value
					}
				};
			});
		}
	},
	extraReducers: (builder) => {
		builder.addCase(load.fulfilled, (state, action) => {
			state.characters = action.payload.characters;
			state.charactersLoaded = true;
			state.needToUpdate = false;
			state.lastUpdateTimestamp = action.payload.lastUpdateTimestamp;
		});
		builder.addCase(load.rejected, (state, action) => {
			state.characters = [];
			state.errMessage = action.error.message;
		});
		builder.addCase(save.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
		builder.addCase(save.fulfilled, (state, action) => {
			state.lastUpdateTimestamp = action.meta.arg.timestamp;
		});
		builder.addCase(count.fulfilled, (state, action) => {
			if (state.characters.length === action.payload.count) {
				state.needToUpdate = false;
			} else {
				state.needToUpdate = true;
			}
		});
		builder.addCase(count.rejected, (state)=> {
			state.needToUpdate = true;
		});
		builder.addCase(timestamp.fulfilled, (state, action) => {
			if (state.lastUpdateTimestamp !== action.payload.lastUpdated || 
				!(!state.lastUpdateTimestamp && action.payload.lastUpdated == 0)) {
				state.needToUpdate = true;
			} else {
				state.needToUpdate = false;
			}
			state.lastUpdateTimestamp = action.payload.lastUpdated;
		});
		builder.addCase(deleteChar.fulfilled, (state, action) => {
			state.characters = state.characters.filter(char => char.id !== action.meta.arg.charId);
		});
	}
});

export default charsSlice.reducer;
export const charActions = charsSlice.actions;