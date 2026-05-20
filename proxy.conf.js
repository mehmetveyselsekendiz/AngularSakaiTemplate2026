// Geliştirme proxy ayarı: /api/** isteklerini staging API'ye iletir.
// Çalışma zamanında window.__ENV__.API_URL değeri kullanılır;
// ng serve sırasında ise process.env.API_URL ortam değişkeni okunur.
const target = process.env['API_URL'] || 'http://localhost:8080';

module.exports = {
    '/api': {
        target,
        changeOrigin: true,
        secure: false,
        logLevel: 'info'
    }
};
