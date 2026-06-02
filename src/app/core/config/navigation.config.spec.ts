import { buildNavGroups } from './navigation.config';

describe('buildNavGroups', () => {
    it('dev modda template (GELİŞTİRİCİ) grubunu ekler', () => {
        const groups = buildNavGroups(true);
        expect(groups.some((g) => g.labelKey === 'menu.dev')).toBe(true);
        expect(groups.some((g) => g.labelKey === 'menu.module.vize')).toBe(true);
    });

    it('üretim modunda sadece modül nav döner (template gizli)', () => {
        const groups = buildNavGroups(false);
        expect(groups.some((g) => g.labelKey === 'menu.dev')).toBe(false);
        expect(groups.some((g) => g.labelKey === 'menu.module.vize')).toBe(true);
    });
});
