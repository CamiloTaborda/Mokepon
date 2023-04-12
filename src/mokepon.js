// constantes creadas con el argumento "getElementById" para conectar con los IDs de HTML

const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque")
const sectionReiniciar = document.getElementById("reiniciar")
const botonMascotaJugador = document.getElementById("boton-mascota");

const botonReiniciar = document.getElementById("boton-reiniciar")
sectionReiniciar.style.display = "none"
const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")

const spanMascotaJugador = document.getElementById("mascota-jugador")

const spanMascotaEnemigo = document.getElementById("mascota-enemigo")

const spanVidasJugador = document.getElementById("vidas-jugador")
const spanVidasEnemigo = document.getElementById("vidas-enemigo")

const sectionMensajes = document.getElementById("resultado")
const ataquesDelJugador = document.getElementById("ataque-del-jugador")
const ataquesDelEnemigo = document.getElementById("ataque-del-enemigo")
const contenedorTarjetas = document.getElementById("contenedor-tarjetas")
const contenedorAtaques = document.getElementById("contenedor-ataques")

const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

// variables globales que pueden ser utilizadas desde cualquier funcion
let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionesDeMokepones
let inputHipodogue 
let inputCapipepo
let inputRatigueya 
let mascotaJugador
let mascotaJugadorObj
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego
let botonAgua
let botonTierra
let btns = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let intervalo
let lienzo = mapa.getContext("2d")
let mapaBackground = new Image()
mapaBackground.src = "/src/iconos/mokemap-ca51ea18-7ac8-492f-be96-6181d766a99d.webp"
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaxMapa = 350

if(anchoDelMapa > anchoMaxMapa) {
    anchoDelMapa = anchoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

// creamos la clase con su constructor para agregar personajes actuales y futuros personajes ,con sus respectivos ataques creando objetos
class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.ancho = 40
        this.alto = 40
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    } 

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.alto,
            this.ancho
        ) 
    }
}

let hipodogue = new Mokepon("hipodogue", "/src/iconos/squirtle.png", 5, "/src/iconos/squirtle.png")
let capipepo = new Mokepon("capipepo", "/src/iconos/charmander.png", 5, "/src/iconos/charmander.png")
let ratigueya = new Mokepon("ratigueya", "/src/iconos/rattata.png", 5, "/src/iconos/rattata.png")

const HipodogeAtaques = [
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🌱", id: "boton-tierra"},
]
hipodogue.ataques.push(...HipodogeAtaques)

const CapipepoAtaques = [
    {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🌱", id: "boton-tierra"},
]
capipepo.ataques.push(...CapipepoAtaques)
    
const RatigueyaAtaques = [
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🔥", id: "boton-fuego"},
]
ratigueya.ataques.push(...RatigueyaAtaques)
   
mokepones.push(hipodogue, capipepo, ratigueya);

// funcion en la que le damos inicio al juego creando una arrowFunction con el contenedor de los inputs ya creados en html para seleccionar personajes actuales o agregados a futuro , asi mismo creando el evento de escucha para los botones 
function iniciarJuego () {
    sectionSeleccionarAtaque.style.display = "none" /*ocultar el section del ataque*/
    sectionVerMapa.style.display = "none"  /*ocultar el section reiniciar*/

    mokepones.forEach((mokepon) => {
        opcionesDeMokepones = `<input type="radio" name="mascota" id=${mokepon.nombre}>
        <label class="tarjeta-mokepon" for=${mokepon.nombre}>
            <p${mokepon.nombre}/p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>`

        contenedorTarjetas.innerHTML += opcionesDeMokepones

         inputHipodogue = document.getElementById("hipodogue")
         inputCapipepo = document.getElementById("capipepo")
         inputRatigueya = document.getElementById("ratigueya")
    })

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);
    botonReiniciar.addEventListener("click", reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
    .then(function(res){
        if(res.ok) {
            res.text()
            .then(function(respuesta) {
                console.log(respuesta)
                jugadorId = respuesta
            })
        }
    })
}

// funcion en la que por medio de condicionales sellecionamos nuentro mokepon
function seleccionarMascotaJugador() {
    
    
    if(inputHipodogue.checked) {
        spanMascotaJugador.innerHTML = inputHipodogue.id
        mascotaJugador = inputHipodogue.id
    }
    else if(inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } 
    else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert("Selecciona una mascota")
        return
    }

    sectionSeleccionarMascota.style.display = "none"  /*ocultar el section de seleccionar mascota*/

    seleccionarMokepon(mascotaJugador)
    
    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = "flex"
    iniciarMapa()
    
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "constent-type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}


function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if(mascotaJugador === mokepones[i].nombre) {
           ataques = mokepones[i].ataques
        }
    }

    mostrarAtaques(ataques)
}

// funcion en la que generemos los ataques, creando una arrowFunction con el contenedor de los botones de ataque ya creada en html y generando el atributo getElementById para cada variable de boton
function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepon = `<button id=${ataque.id} class="boton-ataque btnAtaque">${ataque.nombre}</button>`
        contenedorAtaques.innerHTML += ataquesMokepon
    })

     botonFuego = document.getElementById("boton-fuego")
     botonAgua = document.getElementById("boton-agua")
     botonTierra = document.getElementById("boton-tierra")
     btns = document.querySelectorAll(".btnAtaque")

}

// funcion creada por medio de una arrowFunction y creando logica con condicionales para cada boton de ataque
function secuenciaAtaques() {
    btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
         if(e.target.textContent === "🔥") {
            ataqueJugador.push("FUEGO")
            console.log(ataqueJugador)
            btn.style.background = "#2e2b2b"
            btn.disabled = true 
        }
         else if (e.target.textContent === "💧") {
            ataqueJugador.push("AGUA")
            console.log(ataqueJugador)
            btn.style.background = "#2e2b2b"
            btn.disabled = true 
         } else {
            ataqueJugador.push("TIERRA")
            console.log(ataqueJugador)
            btn.style.background = "#2e2b2b"
            btn.disabled = true 
         }
         
         if (ataqueJugador.length === 5) {
            enviarAtaques()
         }
         

        })
    })
}

function enviarAtaques() {
    fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`)
    .then(function(res) {
        if(res.ok) {
            res.json()
            .then(function({ataques}) {
                if(ataques.length === 5) {
                    ataqueEnemigo = ataques
                    combate()
                }
            })
        }
    })
}

// funcion en la que declaramos la seleccion aleatoria de mascota  del enemigo
function seleccionarMascotaEnemigo(enemigo) {
    // let mascotaAleatorio = aleatorio(0, mokepones.length -1)
    // spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatorio].nombre
    // ataquesMokeponEnemigo = mokepones[mascotaAleatorio].ataques

    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
     
    secuenciaAtaques()
}


// declaramos  la funcion ataqueAleatoriosEnemigo mandando a llamar la variable global ataqueEnemigo y creando logica con condicionales
function ataqueAleatorioEnemigo() {
    console.log("ataques enemigo", ataquesMokeponEnemigo)
    let ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length -1)

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1) {
       ataqueEnemigo.push("FUEGO")    }
    else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push("AGUA")
    } else {
        ataqueEnemigo.push("TIERRA")
    }
    console.log(ataqueEnemigo)

    iniciarCombate()
}

function iniciarCombate() {
    if(ataqueJugador.length === 5) {
        combate()
    }
}

function indexMokepones(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

// declaramos la funcion combate creando dos variables pára sumar victorias a la mascota que vaya ganando y creando logica de batalla con condicionales
function combate() {
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]) {
            indexMokepones(index, index)
            crearMensaje("EMPATE")
        } else if (ataqueJugador[index] === "FUEGO" && ataqueEnemigo[index] === "TIERRA") {
            indexMokepones(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if (ataqueJugador[index] === "AGUA" && ataqueEnemigo[index] === "FUEGO") {
            indexMokepones(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if (ataqueJugador[index] === "TIERRA" && ataqueEnemigo[index] === "AGUA") {
            indexMokepones(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexMokepones(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }

    revisarVidas() /*mandamos a llamar la funcion revisarVidas*/

}

// declaramos la funcion revisarVidas creando logica con condicionales y generamos mensaje final mandando a llamar la funcion crearmensaje al acabar batalla
function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
    crearMensajeFinal("🤜EMPATE🤛")
    }
    else if (victoriasJugador > victoriasEnemigo) {
    crearMensajeFinal("GANASTE LA BATALLA 🦾")
    } else {
        crearMensajeFinal("GAME OVER ☠")
    }
}

// declaramos la funcion crearMensaje y le pasamos un parametro "resultado" y creamos variables para lograr la impresion del mensaje al seleccionar el ataque 
function crearMensaje(resultado) {
   
    let nuevoAtaqueDeljugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDeljugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDeljugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

// creamos la funcion crearMensajeFinal y le pasamos un parametro resultadoFinal creando variables para el evento de escucha e impresion del mensaje
function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal
    
    sectionReiniciar.style.display = "block" /*mostrar el section reiniciar despues de terminar combate*/
}

// declaramos la funcion reiniciarJuego con el atributo location.reload
function reiniciarJuego(){
   location.reload() 
}

// funcion que se declara para la seleccion de mascota aleatoriamente
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas() {

    mascotaJugadorObj.x = mascotaJugadorObj.x + mascotaJugadorObj.velocidadX
    mascotaJugadorObj.y = mascotaJugadorObj.y + mascotaJugadorObj.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObj.pintarMokepon()

    enviarPosicion(mascotaJugadorObj.x, mascotaJugadorObj.y)

    mokeponesEnemigos.forEach(function(mokepon) {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })

    .then(function(res) {
        if(res.ok) {
            res.json()
            .then(function({enemigos}) {
                console.log(enemigos)
                mokeponesEnemigos.map(function(enemigo) {
                    let mokeponEnemigo = null
                    const mokeponNombre = enemigo.mokepon.nombre || ""
                    if(mokeponNombre === "Hipodogue") {
                        mokeponEnemigo = new Mokepon("hipodogue", "/src/iconos/squirtle.png", 5, "/src/iconos/squirtle.png", enemigo.id)
                    }
                    else if(mokeponNombre === "Capipepo") {
                         mokeponEnemigo = new Mokepon("capipepo", "/src/iconos/charmander.png", 5, "/src/iconos/charmander.png", enemigo.id)
                    }
                    else if(mokeponNombre === "Ratigueya") {
                         mokeponEnemigo = new Mokepon("ratigueya", "/src/iconos/rattata.png", 5, "/src/iconos/rattata.png", enemigo.id)
                    }

                    mokeponEnemigo.x = enemigo.x
                    mokeponEnemigo.y = enemigo.y
                    
                    return mokeponEnemigo
                })
            })
        }
    })
}

function moverDerecha() {
    mascotaJugadorObj.velocidadX = 5
}

function moverIzquierda() {
    mascotaJugadorObj.velocidadX = - 5
}

function moverArriba() {
    mascotaJugadorObj.velocidadY = - 5
}

function moverAbajo() {
    mascotaJugadorObj.velocidadY = 5
    
}

function detenerMovimiento() {
    mascotaJugadorObj.velocidadX = 0
    mascotaJugadorObj.velocidadY = 0
}

function pressTecla(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba()
            break;
            case "ArrowDown":
            moverAbajo()
            break;
            case "ArrowLeft":
            moverIzquierda()
            break;
            case "ArrowRight":
            moverDerecha()
            break;
        default:
            break;
    }
}

function iniciarMapa() {
   
    mascotaJugadorObj = obtenerMascota(mascotaJugador)
    console.log(mascotaJugadorObj, mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)
    window.addEventListener("keydown", pressTecla)
    window.addEventListener("keyup", detenerMovimiento)
}

function obtenerMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if(mascotaJugador === mokepones[i].nombre) {
           return mokepones[i]
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObj.y
    const abajoMascota = mascotaJugadorObj.y + mascotaJugadorObj.alto
    const derechaMascota = mascotaJugadorObj.x + mascotaJugadorObj.ancho
    const izquierdaMascota = mascotaJugadorObj.x

    if (abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    console.log("se detecto colision")

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = "flex"
    sectionVerMapa.style.display = "none"
    seleccionarMascotaEnemigo(enemigo)
    // alert(`Hay colision con ${enemigo.nombre}`)
}

// atributo que utilizamos para cargar nuestro JS con el argumento iniciarJuego
window.addEventListener("load", iniciarJuego);

// addEventListener() Registra un evento a un objeto en específico.
// getElementById() Devuelve una referencia al elemento por su ID.
// createElement()  crea un elemento HTML especificado por su tagName.
// appendChild() Agrega un nuevo nodo al final de la lista de un elemento hijo de un elemento padre especificado.
// innerHTML() devuelve o establece la sintaxis HTML describiendo los descendientes del elemento.   
