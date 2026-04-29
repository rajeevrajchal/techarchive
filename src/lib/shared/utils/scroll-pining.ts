// lib/animations/PanelStack.ts

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface PanelStackOptions {
	scrub?: boolean | number;
	scrollDuration?: number;
	scrollEase?: string;
	onPanelEnter?: (index: number) => void;
}

export class ScrollPinning {
	private triggers: ScrollTrigger[] = [];
	private panels: HTMLElement[];
	private options: Required<PanelStackOptions>;

	constructor(panels: HTMLElement[], options: PanelStackOptions = {}) {
		this.panels = panels;
		this.options = {
			scrub: true,
			scrollDuration: 1.2,
			scrollEase: 'power3.inOut',
			onPanelEnter: () => {},
			...options
		};

		this.init();
	}

	private init(): void {
		this.panels.forEach((panel, i) => {
			if (i === this.panels.length - 1) return;

			const st = ScrollTrigger.create({
				trigger: panel,
				start: 'top top',
				end: '+=100%',
				pin: true,
				pinSpacing: false,
				scrub: this.options.scrub,
				onEnter: () => this.options.onPanelEnter(i)
			});

			this.triggers.push(st);
		});
	}

	public scrollTo(index: number): void {
		const clampedIndex = Math.max(0, Math.min(index, this.panels.length - 1));

		gsap.to(window, {
			scrollTo: clampedIndex * window.innerHeight,
			duration: this.options.scrollDuration,
			ease: this.options.scrollEase
		});
	}

	public destroy(): void {
		this.triggers.forEach((t) => t.kill());
		this.triggers = [];
	}
}
