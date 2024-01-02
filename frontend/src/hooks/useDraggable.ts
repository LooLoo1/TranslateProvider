import React, { useEffect, useMemo, useRef, useState } from "react";

type cssPosition = number | string;

type Position = {
	top: cssPosition;
	left: cssPosition;
	right: cssPosition;
	bottom: cssPosition;
}

type useDraggableReturn = [
	ref: React.RefObject<HTMLDivElement>,
	handleMouseDown: () => void,
	draggableStyles: React.CSSProperties,
];

export const useDraggable = (StartPosition: Partial<Position> = {}): useDraggableReturn => {
	const [isDragging, setIsDragging] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const positionRef: Partial<Position> = useMemo(() => {
		return StartPosition;
	}, []);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			if (ref.current) {
				const element = ref.current.style;
				if (isDragging) {
					const rect = ref.current.getBoundingClientRect();
					const newX = rect.left + event.movementX;

					const newY = rect.top + event.movementY;

					const maxX = window.innerWidth - ref.current!.offsetWidth;
					const maxY = window.innerHeight - ref.current!.offsetHeight;

					const clampedX = Math.max(0, Math.min(newX, maxX));
					const clampedY = Math.max(0, Math.min(newY, maxY));

					const newRight = window.innerWidth - clampedX - ref.current!.clientWidth;
					const newBottom = window.innerHeight - clampedY - ref.current!.clientHeight;

					element.top = `${clampedY}px`;
					element.left = `${clampedX}px`;
					element.right = `${newRight}px`;
					element.bottom = `${newBottom}px`;

					positionRef.top = `${clampedY}px`;
					positionRef.left = `${clampedX}px`;
					positionRef.right = `${newRight}px`;
					positionRef.bottom = `${newBottom}px`;
				}
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	const handleMouseDown = () => {
		setIsDragging(true);
	};

	return [
		ref,
		handleMouseDown,
		{
			position: "fixed",
			background: "red",
			cursor: "move",
			userSelect: "none",
			zIndex: 1000,
			...positionRef,
		},
	];
};



/* Analog return and sync

const { ref, draggableStyles, handleMouseDown } = useDraggable({bottom: 20, right: 20});

interface useDraggableReturn {
	handleMouseDown: () => void;
	draggableStyles: React.CSSProperties;
	ref: React.RefObject<HTMLDivElement>;
}

return {
	ref,
	handleMouseDown,
	draggableStyles: {
		position: "fixed",
		background: "red",
		cursor: "move",
		userSelect: "none",
		zIndex: 1000,
		...positionRef,
	},
};

*/