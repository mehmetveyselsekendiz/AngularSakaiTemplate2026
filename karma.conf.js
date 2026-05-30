// Karma yapılandırması — MFA Angular Template (zoneless birim testleri)
//
// Bu proje zone.js KULLANMAZ (provideZonelessChangeDetection). Bu yüzden
// hiçbir yerde `zone.js/testing` import edilmez; her spec kendi TestBed'inde
// `provideZonelessChangeDetection()` sağlar ve effect'leri ApplicationRef.tick()
// ile flush eder (bkz. src/app/core/**/*.spec.ts).
//
// CI / yerel headless çalışma için `ChromeHeadlessNoSandbox` launcher tanımlı
// (konteyner/CI'da Chrome sandbox'ı çalışmadığı için --no-sandbox şart).
// Kullanım: `npm test` → `ng test --no-watch --browsers=ChromeHeadlessNoSandbox`.

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-jasmine-html-reporter'), require('karma-coverage'), require('@angular-devkit/build-angular/plugins/karma')],
        client: {
            jasmine: {},
            clearContext: false // jasmine spec sonuçlarını tarayıcıda görünür tut
        },
        jasmineHtmlReporter: {
            suppressAll: true // tekrarlı trace'leri bastır
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/sakai-ng'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }]
        },
        reporters: ['progress', 'kjhtml'],
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                // --disable-dev-shm-usage: CI/konteynerde küçük /dev/shm yüzünden
                // oluşan headless Chrome çökme/disconnect'lerini önler.
                flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
            }
        },
        // Yavaş/CI makinelerinde geçici socket kopmalarında testi düşürme.
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 30000,
        pingTimeout: 30000,
        captureTimeout: 60000,
        restartOnFileChange: true
    });
};
