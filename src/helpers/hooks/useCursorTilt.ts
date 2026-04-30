import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useMouse } from '@uidotdev/usehooks';

type UseCursorTiltOptions = {
	rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
};

const getDistance = (clientCoordinate: number, centerCoordinate: number) => {
	return clientCoordinate > centerCoordinate
		? clientCoordinate - centerCoordinate
		: centerCoordinate - clientCoordinate;
};

const getAngle = (clientCoordinate: number, centerCoordinate: number) => {
	const aSq = getDistance(clientCoordinate, centerCoordinate);
	const bSq = 300;
	const angle = (Math.atan(aSq / bSq) * 180) / Math.PI;
	return clientCoordinate > centerCoordinate ? angle : 360 - angle;
};

export const useCursorTilt = ({ rarity }: UseCursorTiltOptions) => {
	const [currentTarget, setCurrentTarget] = useState<HTMLElement | null>(null);
	const [animate, setAnimate] = useState(false);
	const [mouse] = useMouse();
	const specRef = useRef<HTMLDivElement>(null);
	const maskRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!currentTarget || !animate) {
			return;
		}

		const elRect = currentTarget.getBoundingClientRect();
		const centerX = elRect.x + elRect.width / 2;
		const centerY = elRect.y + elRect.height / 2;
		const angleX = getAngle(mouse.x, centerX);
		const angleY = getAngle(mouse.y, centerY);
		const distanceY = getDistance(mouse.y, centerY);
		const percent = distanceY / (elRect.height / 2);

		currentTarget.setAttribute('style', `transform: rotateY(${-angleX}deg) rotateX(${angleY}deg)`);
		specRef.current?.setAttribute('style', `top: ${30 - percent * 100}%`);
	}, [animate, currentTarget, mouse]);

	const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
		e.preventDefault();
		setAnimate(true);
		setCurrentTarget(e.currentTarget);
	};

	const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
		const resetTarget = e.currentTarget.firstElementChild as HTMLElement | null;
		setTimeout(() => {
			resetTarget?.setAttribute('style', '');
		}, 1);

		if (rarity === 'common') {
			specRef.current?.setAttribute('style', 'top: -50%');
			maskRef.current?.setAttribute('style', 'top: 25%');
		} else {
			specRef.current?.setAttribute('style', 'top: 0');
		}

		setAnimate(false);
		setCurrentTarget(null);
	};

	return {
		specRef,
		maskRef,
		handleMouseEnter,
		handleMouseLeave
	};
};
