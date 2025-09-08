import { useEffect, useRef, useState } from 'react';
import { DiceFallProps } from './DiceFall.props';
import Matter from 'matter-js';
import { shallowEqual } from 'react-redux';
import styles from './DiceFall.module.css';

const DICE_CONFIG = {
	d6: { vertices: [{ x: 0, y: 81.37 },{ x: 11.62, y: 93 }, { x: 93, y: 93 }, { x: 93, y: 11.63 }, { x: 81.37, y: 0 }, { x: 0, y: 0 }] },
	d8: { vertices: [{ x: 0, y: 75 }, { x: 43.14, y: 100 }, { x: 86.6, y: 75 }, { x: 86.6, y: 25 }, { x: 43.14, y: 0 }, { x: 0, y: 25 }] },
	d10: { vertices: [{ x: 0, y: 39.39 },{ x: 0, y: 54.39 }, { x: 40, y: 93.78 }, { x: 80, y: 54.39 }, { x: 80, y: 39.39 }, { x: 40, y: 0 }] },
	d12: { vertices: [{ x: 0, y: 34.55 }, { x: 0, y: 65.45 }, { x: 18.16, y: 90.45 }, { x: 47.55, y: 100 }, { x: 76.94, y: 90.45 }, { x: 95.1, y: 65.45 }, { x: 95.1, y: 34.55 }, { x: 76.94, y: 9.55 }, { x: 47.55, y: 0 }, { x: 18.16, y: 9.55 }]},
	d20: { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-artificer': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-barbarian': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-bard': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-cleric': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-druid': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-fighter': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-monk': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-paladin': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-ranger': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-rogue': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-sorcerer': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-warlock': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]},
	'cell-d20-wisard': { vertices: [{ x: 0, y: 24.06 },{ x: 0, y: 72.19 }, { x: 41.68, y: 96.25 }, { x: 83.36, y: 72.19 }, { x: 83.36, y: 24.06 }, { x: 41.68, y: 0 }]}
};

interface dicePosition {
    type: keyof typeof DICE_CONFIG;
    x: number;
    y: number;
    angle: number;
    size: number;
}

interface CustomBody extends Matter.Body {
  diceType: keyof typeof DICE_CONFIG;
  diceSize: number;
}

export function DiceFall({containerRef, countOfDices}: DiceFallProps) {
	const sceneRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<Matter.Engine | null>(null);
	const renderRef = useRef<Matter.Render | null>(null);
	const diceBodiesRef = useRef<Matter.Body[]>([]);
	const [dicePositions, setDicePositions] = useState<Array<dicePosition>>([]);

	useEffect(()=>{
		if (!sceneRef.current) return;

		const engine = Matter.Engine.create({
			gravity: { x: 0, y: 0.5 },
			enableSleeping: true
		});
		engineRef.current = engine;
		const render = Matter.Render.create({
			element: sceneRef.current,
			engine: engine,
			options: {
				width: containerRef.current?.clientWidth,
				height: containerRef.current?.clientHeight,
				wireframes: false,
				background: 'transparent',
				showAngleIndicator: false,
				showSleeping: false
			}
		});
		renderRef.current = render;

		const containerWidth = render.options.width || 500;
		const containerHeight = render.options.height || 600;

		const ground = Matter.Bodies.rectangle(containerWidth / 2, containerHeight + 10, containerWidth, 30, { 
			isStatic: true,
			render: { visible: false }
		});
		const leftWall = Matter.Bodies.rectangle(-10, containerHeight / 2, 30, containerHeight*2, { 
			isStatic: true,
			render: { visible: false }
		});
			
		const rightWall = Matter.Bodies.rectangle(containerWidth + 10, containerHeight / 2, 30, containerHeight*2, { 
			isStatic: true,
			render: { visible: false }
		});

		Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

		const diceTypes = Object.keys(DICE_CONFIG) as Array<keyof typeof DICE_CONFIG>;
		const newPositions: dicePosition[] = [];		
		const diceBodies: CustomBody[] = [];
    
		for (let i = 0; i < countOfDices; i++) {
			const type = diceTypes[Math.floor(Math.random() * diceTypes.length)];
			const size = Math.floor(Math.random() * 100) + 100;
			const { vertices } = DICE_CONFIG[type];

			const body = Matter.Bodies.fromVertices(
				Math.random() * 500,
				Math.random() * -500 - 100,
				[vertices.map(v => 
					(
						{
							x: v.x * (size / 100), 
							y: v.y * (size / 100) 
						}
					)
				)],
				{ 
					isStatic: false,
					render: {
						visible: false
					}
				}
			) as CustomBody;

			Matter.Body.set(body, {
				diceType: type,  // Сохраняем тип кости
				diceSize: size  // Сохраняем размер
			});
      
			diceBodies.push(body);
			newPositions.push(
				{ 
					type, 
					x: body.position.x, 
					y: body.position.y, 
					angle: body.angle, 
					size 
				}
			);
		}
    
		Matter.Composite.add(engine.world, diceBodies);
		setDicePositions(newPositions);
		diceBodiesRef.current = diceBodies;

		const checkBounds = () => {
			const width = sceneRef.current?.clientWidth || 800;
			const height = sceneRef.current?.clientHeight || 600;
			const margin = 300; // Запас для плавного удаления

			for (let i = diceBodies.length - 1; i >= 0; i--) {
				const body = diceBodies[i];
				if (
					body.position.y > height + margin ||
					body.position.x < -margin ||
					body.position.x > width + margin
				) {
					Matter.Composite.remove(engine.world, body);
					diceBodies.splice(i, 1); // Удаляем из массива отслеживания
				}
			}
		};

		let frames = 0;
		Matter.Events.on(engine, 'afterUpdate', () => {
			if (frames++ % 10 === 0) checkBounds();
			setDicePositions(prev => {
				const newPositions = diceBodies.map(body => {
					const customBody = body as CustomBody;
					return {
						type: customBody.diceType,
						x: customBody.position.x,
						y: customBody.position.y,
						angle: customBody.angle,
						size: customBody.diceSize
					};
				});
				// Сравниваем с предыдущим состоянием
				return shallowEqual(prev, newPositions) ? prev : newPositions;
			});
		});

		// Запускаем рендерер и движок
		Matter.Render.run(render);
		const runner = Matter.Runner.create();
		Matter.Runner.run(runner, engine);

		// Очистка при размонтировании
		return () => {
			Matter.Render.stop(render);
			Matter.Runner.stop(runner);
			Matter.Engine.clear(engine);
			if (render.canvas) {
				render.canvas.remove();
			}
			if (render.textures) {
				render.textures = {};
			}
		};
	}, []);
	
	return (
		<div>
			<div 
				ref={sceneRef} 
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					zIndex: 0,
					pointerEvents: 'none'
				}}
			/>
			<div className={styles['svg-layer']}>
				{dicePositions.map((dice, index) => (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: dice.x,
							top: dice.y,
							transform: `translate(-50%, -50%) rotate(${dice.angle}rad)`,
							width: dice.size - 5,
							height: dice.size - 5,
							pointerEvents: 'none',
							opacity: 0.5
						}}
					>
						
						<img src={`${dice.type}.svg`} className={styles['dice']}/>
					</div>
				))}
			</div>
		</div>
	);
}