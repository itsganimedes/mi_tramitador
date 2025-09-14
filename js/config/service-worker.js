self.addEventListener('install', e => {
    console.log('Service Worker instalado');
});

self.addEventListener('fetch', e => {
    // Se puede agregar cache básico si quieres
});
