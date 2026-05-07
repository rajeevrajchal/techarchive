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
	onPanelProgress?: (index: number, ratio: number) => void;
	fadeIn?: boolean; // ← new
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
			onPanelProgress: () => {},
			fadeIn: false,
			...options
		};

		this.init();
	}

	private init(): void {
		this.panels.forEach((panel, i) => {
			if (i === this.panels.length - 1) return;

			const st = ScrollTrigger.create({
				trigger: panel,
				start: 'center center',
				end: '+=100%',
				pin: true,
				pinSpacing: false,
				scrub: this.options.scrub,
				onEnter: () => {
					this.options.onPanelEnter(i);

					// fade in the NEXT panel as it slides over
					if (this.options.fadeIn && this.panels[i + 1]) {
						gsap.fromTo(
							this.panels[i + 1],
							{ opacity: 0 },
							{ opacity: 1, duration: 0.5, ease: 'power2.out' }
						);
					}
				},
				onUpdate: (self) => this.options.onPanelProgress(i, self.progress)
			});

			this.triggers.push(st);
		});

		ScrollTrigger.refresh();

		this.triggers.forEach((trigger, i) => {
			this.options.onPanelProgress(i, trigger.progress);
		});

		// first panel always visible
		if (this.options.fadeIn) {
			this.panels.forEach((panel, i) => {
				if (i !== 0) gsap.set(panel, { opacity: 0 });
			});
		}
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
