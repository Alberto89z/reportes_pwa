console.log("SERVICE WORKER");
const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamic1';
const DYNAMIC_LIMIT = 30;

//Todos aquellos recursos propios de la aplicación
const APP_SHELL = [
    './',
    './index.html',
    './css/styles.css',
    './images/miku.jpg',
    './js/app.js',
    './pages/offline.html',
];
//Todos aquellos recursos que nunca cambian
const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
]

self.addEventListener("install", e => {
    // e.skipWaiting();
    const staticCache = caches.open(STATIC).then((cache) => { //(open)abrir un cache si existe
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE).then((cache) => {//(cache) devuelve si encuentra
        cache.addAll(APP_SHELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
    console.log("Instalado");
})

self.addEventListener("activate", e => {
    console.log("Activado");
})
self.addEventListener("fetch", e => {
    //1. Cache Only
    //e.respondWith(caches.match(e.request));

    //2. Cache with Network fallback --Si no hay cache, se va a la internet
    // const source = caches.match(e.request).then(res => {
    //     if(res) return res;
    //     return fetch(e.request).then(resFetch => {
    //         caches.open(DYNAMIC).then(cache => {
    //             cache.put(e.request, resFetch);
    //         });
    //         return resFetch.clone();
    //     });
    // });
    // e.respondWith(source);

    //3. Network with cache fallback
    // const source = fetch(e.request).then(res => {
    //     if (res) throw Error('Not Found');
    //     //checar si el recuros ya existe en algun cache
    //     caches.open(DYNAMIC).then(cache => {
    //         cache.put(e.request, res);
    //     });
    //     return res.clone();
    // }).catch(err => {
    //     return caches.match(e.request); 
    // });
    // e.respondWith(source);

    //4. Cache with Network update ----si no lo encuentra en el cache, lo agrega, 
    //                             ----si hay algun actualizado devuelve el actual y luyego lo actualiza
    //Opcion cuando el rendimiento es critico,
    //Si es bajo, utilizar esta estrategia.
    //Desvantaja: Toda la aplicacion esta un paso atrás
    // if(e.request.url.includes('bootstrap'))
    //     return e.respondWith(caches.match(e.request));
    // const source = caches.open(STATIC).then(cache => {
    //     fetch(e.request).then((res) => {
    //         cache.put(e.request,res);
    //     });
    //     return cache.match(e.request);
    // }).catch();
    // e.respondWith(source);

    //5. Cache and network race
    // const source = new Promise((resolve, reject) => {
    //     let rejected = false;
    //     const failsOnce = ()=> {
    //         if (rejected) {
    //             if (/\.(png|jpg)/i.test(e.request.url)) {
    //                 resolve(caches.match('/images/not-found.png'));
    //             }else{
    //                 throw Error('SourceNotFound');
    //             }
    //         }else{
    //             rejected = true;
    //         }
    //     }
    //     fetch(e.request).then(res => {
    //         res.ok ? resolve(res) : failsOnce();
    //     }).catch(failsOnce);

    //     caches.match(e.request).then(cacheRes => {
    //         cacheRes.ok ? resolve(cacheRes) : failsOnce();
    //     }).catch(failsOnce);
    // });
    // e.respondWith(source);
     const source = new Promise((resolve, reject) => {
        let rejected = false;
        const failsOnce = ()=> {
            if (rejected) {
                if (/\.(png|jpg)/i.test(e.request.url)) {
                    resolve(caches.match('/images/not-found.png'));
                }else{
                    throw Error('SourceNotFound');
                }
            }else{
                rejected = true;
            }
            if (e.request.url.includes("pages2.html")) {
                resolve(cache.match('pages/offline.html'))
            }
        }
        fetch(e.request).then(res => {
            res.ok ? resolve(res) : failsOnce();
        }).catch(failsOnce);

        caches.match(e.request).then(cacheRes => {
            cacheRes.ok ? resolve(cacheRes) : failsOnce();
        }).catch(failsOnce);
    });
    e.respondWith(source);


    // EJRCICIO DEL OFFLINE ------------------------------------
    // const result = fetch(e.request)
    //     .then(res => {
    //         if (res.status === 404) {
    //             return caches.match(e.request);
    //         }
    //         return res;
    //     })
    //     .catch((e) => {
    //         return caches.match("pages/offline.html");
    //     });
    // e.respondWith(result);
    // })
})

















// self.addEventListener("fetch", e=> {
//     console.log(e.request);
//     if (e.request.url.includes("miku.jpg")) {
//         e.respondWith(fetch('images/homura.jpg'));
//     }else{
//         e.addEventListener("push", e=> {
//             console.log("Notificacion PUSH");
//         })
//         e.addEventListener("sync", e=> {
//             console.log("SYNC EVENT");
//         })
//     }
//     e.respondWith(fetch(e.request));
// })

//Tarea: en index, hacer un login de pura vista
//dirigido a dispositivos moviles