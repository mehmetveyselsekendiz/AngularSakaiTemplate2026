import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    imports: [ProgressSpinnerModule],
    template: `
        <div class="flex items-center justify-center min-h-screen">
            <p-progressspinner />
        </div>
    `
})
export class AuthCallback implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);

    ngOnInit(): void {
        const code = this.route.snapshot.queryParamMap.get('code');
        const state = this.route.snapshot.queryParamMap.get('state');

        if (!code || !state) {
            void this.router.navigate(['/auth/login']);
            return;
        }

        this.authService.handleCallback(code, state).subscribe({
            next: () => {
                const returnTo = this.authService.consumeReturnTo();
                void this.router.navigateByUrl(returnTo);
            },
            error: () => {
                void this.router.navigate(['/auth/login']);
            }
        });
    }
}
