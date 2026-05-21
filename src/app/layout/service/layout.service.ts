import { Injectable, computed, signal } from '@angular/core';

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    mobileMenuActive: boolean;
    menuHoverActive: boolean;
    activePath: string | null;
}

const DEFAULT_STATE: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    mobileMenuActive: false,
    menuHoverActive: false,
    activePath: null
};

@Injectable({ providedIn: 'root' })
export class LayoutService {
    // Geriye uyumluluk: app.layout.ts ve diğer Sakai mirası bileşenler `layoutState()` çağrısı kullanıyor
    layoutState = signal<LayoutState>(DEFAULT_STATE);

    readonly isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().mobileMenuActive);

    transitionComplete = signal<boolean>(false);

    onMenuToggle(): void {
        if (this.isDesktop()) {
            this.layoutState.update((s) => ({
                ...s,
                staticMenuDesktopInactive: !s.staticMenuDesktopInactive
            }));
        } else {
            this.layoutState.update((s) => ({
                ...s,
                mobileMenuActive: !s.mobileMenuActive
            }));
        }
    }

    isDesktop(): boolean {
        return typeof window !== 'undefined' && window.innerWidth > 991;
    }

    isMobile(): boolean {
        return !this.isDesktop();
    }
}
