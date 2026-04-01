import {
	DEFAULT_TWEAK_STATE,
	applyTweakStateToDocument,
	loadTweakState,
	saveTweakState,
	type TweakState
} from './tweak-state';

class TweakPaneStore {
	showDebugGrid = $state<boolean>(DEFAULT_TWEAK_STATE.showDebugGrid);
	showDebugLayout = $state<boolean>(DEFAULT_TWEAK_STATE.showDebugLayout);
	contentMaxWidth = $state<number>(DEFAULT_TWEAK_STATE.contentMaxWidth);

	private isHydrated = false;
	private isEffectRegistered = false;

	get snapshot(): TweakState {
		return {
			showDebugGrid: this.showDebugGrid,
			showDebugLayout: this.showDebugLayout,
			contentMaxWidth: this.contentMaxWidth
		};
	}

	applyState(state: TweakState): void {
		this.showDebugGrid = state.showDebugGrid;
		this.showDebugLayout = state.showDebugLayout;
		this.contentMaxWidth = state.contentMaxWidth;
	}

	initialize(): void {
		if (typeof window === 'undefined') return;

		if (!this.isHydrated) {
			const loaded = loadTweakState();
			this.applyState(loaded);
			applyTweakStateToDocument(loaded);
			this.isHydrated = true;
		}

		if (!this.isEffectRegistered) {
			$effect(() => {
				const state = this.snapshot;
				if (!this.isHydrated) return;
				saveTweakState(state);
				applyTweakStateToDocument(state);
			});
			this.isEffectRegistered = true;
		}
	}
}

export const tweakPaneStore = new TweakPaneStore();
