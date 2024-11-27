// Clase Barra (Paleta)
class Barra {
    constructor(width, height, posicionX, posicionY) {
        this.width = width;
        this.height = height;
        this.posicionX = posicionX;
        this.posicionY = posicionY;
        this.velocidad = 10; // Velocidad de movimiento
        this.limiteSuperior = 0;
        this.limiteInferior = 500 - this.height;
    }

    creaBarra(svgPadreId) {
        this.paleta = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.paleta.setAttribute("width", this.width);
        this.paleta.setAttribute("height", this.height);
        this.paleta.setAttribute("x", this.posicionX);
        this.paleta.setAttribute("y", this.posicionY);

        const svgPadre = document.getElementById(svgPadreId);
        svgPadre.appendChild(this.paleta);
    }

    moverBarra(direccion) {
        if (direccion === 'arriba' && this.posicionY > this.limiteSuperior) {
            this.posicionY -= this.velocidad;
        } else if (direccion === 'abajo' && this.posicionY < this.limiteInferior) {
            this.posicionY += this.velocidad;
        }
        // Actualizar la posición en el SVG
        this.paleta.setAttribute('y', this.posicionY);
    }
}

// Clase Bola
class Bola {
    constructor(posicionX, posicionY, limiteX, limiteY, radio, velocidadX, velocidadY) {
        this.posicionX = posicionX;
        this.posicionY = posicionY;
        this.limiteX = limiteX;
        this.limiteY = limiteY;
        this.radio = radio;
        this.velocidadX = velocidadX;
        this.velocidadY = velocidadY;
    }

    creaTag() {
        this.pelota = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.pelota.setAttribute("cx", this.posicionX);
        this.pelota.setAttribute("cy", this.posicionY);
        this.pelota.setAttribute("r", this.radio);
        this.pelota.setAttribute("fill", "orange"); // Color fijo: naranja

        const svgPadre = document.getElementById("pelota");
        svgPadre.appendChild(this.pelota);
    }

    mover(paleta1, paleta2) {
        this.posicionX += this.velocidadX;
        this.posicionY += this.velocidadY;

        // Colisión con las paredes
        if (this.posicionX + this.radio > this.limiteX || this.posicionX - this.radio < 0) {
            this.velocidadX *= -1;  // Rebote en las paredes
        }

        if (this.posicionY + this.radio > this.limiteY || this.posicionY - this.radio < 0) {
            this.velocidadY *= -1;  // Rebote en las paredes
        }

        // Colisión con las paletas
        if (this.posicionX - this.radio < paleta1.posicionX + paleta1.width &&
            this.posicionY > paleta1.posicionY && this.posicionY < paleta1.posicionY + paleta1.height) {

            // Evitar que la bola se quede "pegada" a la paleta
            if (this.velocidadX < 0) {
                this.posicionX = paleta1.posicionX + paleta1.width + this.radio;
            }
            // Ajustar la dirección de la bola según el ángulo de colisión
            this.velocidadX *= -1;
            this.velocidadY += (Math.random() - 0.5) * 2;  // Añadimos un poco de aleatoriedad al rebote vertical
        }

        if (this.posicionX + this.radio > paleta2.posicionX &&
            this.posicionY > paleta2.posicionY && this.posicionY < paleta2.posicionY + paleta2.height) {

            // Evitamos que la bola se pegue a la paleta
            if (this.velocidadX > 0) {
                this.posicionX = paleta2.posicionX - this.radio;
            }

            this.velocidadX *= -1;
            this.velocidadY += (Math.random() - 0.5) * 2;  // rebote vertical aleatorio
        }

        // Actualizar la posición de la bola en el SVG
        this.pelota.setAttribute("cx", this.posicionX);
        this.pelota.setAttribute("cy", this.posicionY);
    }

    resetBola() {
        this.posicionX = 250;
        this.posicionY = 250;
        this.velocidadX *= -1; // La dirección cambia al reiniciar
        this.velocidadY = Math.random() > 0.5 ? 5 : -5; // evitamos siempre el mismo angulo
    }
}



// Función para iniciar el cronómetro
function iniciarCronometro() {
    cronometro = document.getElementById("cronometro");
    tiempoId = setInterval(() => {
        tiempoRestante--;
        cronometro.textContent = `${Math.floor(tiempoRestante / 60)}:${(tiempoRestante % 60).toString().padStart(2, '0')}`;

        if (tiempoRestante <= 0) {
            clearInterval(tiempoId);
            mostrarResultadoFinal();
        }
    }, 1000);
}

// Función para mostrar el resultado final
function mostrarResultadoFinal() {
    alert(`¡El tiempo ha terminado!`);
    document.getElementById("reiniciarBtn").style.display = "block"; // Mostrar el botón de reiniciar
}


// Función para reiniciar la partida
function reiniciarPartida() {
    puntuacionJugador1 = 0;
    puntuacionJugador2 = 0;
    tiempoRestante = 120; // 2 minutos en segundos
    cronometro.textContent = "Tiempo: 02:00";
    document.getElementById("reiniciarBtn").style.display = "none"; // Ocultar el botón de reiniciar
    bola.resetBola();
    // Iniciar nuevamente el cronómetro
    iniciarCronometro();
}

// Variables globales del juego
let puntuacionJugador1 = 0;
let puntuacionJugador2 = 0;
let bola;
let paleta1;
let paleta2;
let cronometro;
let tiempoRestante = 120; // 2 minutos en segundos
let tiempoId;

// Inicio del juego
window.onload = function () {
    const svgPadre = document.getElementById("pelota");
    bola = new Bola(250, 250, 500, 500, 15, 5, 5);
    paleta1 = new Barra(10, 90, 0, 200);
    paleta2 = new Barra(10, 90, 490, 200);

    bola.creaTag();
    paleta1.creaBarra("pelota");
    paleta2.creaBarra("pelota");

    // Iniciamos el cronómetro de la partida
    iniciarCronometro();

    // Función para mover la bola y las paletas
    setInterval(() => {
        bola.mover(paleta1, paleta2);

        // Detectar cuando la bola se cuela por el fondo (sin colisionar con las paletas)
        if (bola.posicionX - bola.radio < 0) {// Gol para el jugador 2
            puntuacionJugador2++;
            bola.resetBola();
        } else if (bola.posicionX + bola.radio > 500) { // Gol para el jugador 1
            puntuacionJugador1++;
            bola.resetBola();
        }

        // Actualizar la puntuación en la interfaz
        document.getElementById("puntuacion1").textContent = "Player_1: " + puntuacionJugador1;
        document.getElementById("puntuacion2").textContent = "Player_2: " + puntuacionJugador2;
    }, 45);

    // Control de las paletas con las teclas
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'w': // Mover la paleta izquierda hacia arriba
                paleta1.moverBarra('arriba');
                break;
            case 's': // Mover la paleta izquierda hacia abajo
                paleta1.moverBarra('abajo');
                break;
            case 'ArrowUp': // Mover la paleta derecha hacia arriba
                paleta2.moverBarra('arriba');
                break;
            case 'ArrowDown': // Mover la paleta derecha hacia abajo
                paleta2.moverBarra('abajo');
                break;
        }
    });

    // Botones para reiniciar el juego
    document.getElementById('reiniciarBtn').addEventListener('click', reiniciarPartida);
};


