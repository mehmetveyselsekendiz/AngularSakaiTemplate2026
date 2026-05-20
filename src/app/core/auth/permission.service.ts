import { computed, inject, Injectable, Signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private authService = inject(AuthService);

    /**
     * Kullanıcının belirli bir role sahip olup olmadığını reaktif olarak döner.
     * Role boşsa her zaman true döner (kısıtsız erişim).
     */
    hasRole(role: string): Signal<boolean> {
        return computed(() => !role || this.authService.roles().includes(role));
    }

    /**
     * Kullanıcının verilen rollerden en az birine sahip olup olmadığını döner.
     * Roller listesi boşsa her zaman true döner.
     */
    anyRole(roles: string[]): Signal<boolean> {
        return computed(() => roles.length === 0 || roles.some((r) => this.authService.roles().includes(r)));
    }
}
