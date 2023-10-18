console.log("SERVICE WORKER");
self.addEventListener("install",e=> {
    console.log("Instalado");
})

self.addEventListener("activate", e=> {
    console.log("Activado");
})

self.addEventListener("fetch", e=> {
    console.log(e.request);
    if (e.request.url.includes("miku.jpg")) {
        e.respondWith(fetch('images/homura.jpg'));
    }else{
        e.addEventListener("push", e=> {
            console.log("Notificacion PUSH");
        })
        e.addEventListener("sync", e=> {
            console.log("SYNC EVENT");
        })
    }
    e.respondWith(fetch(e.request));
})

//Tarea: en index, hacer un login de pura vista
//dirigido a dispositivos moviles