const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        start: document.querySelector(".button-start h2"), // Corrigido para selecionar apenas um botão
        startButton: document.querySelector(".button-start"), // Adiciona referência ao botão todo
    },
    value: {
        gameVelocity: 800,
        hitPosition: 0,
        result: 0,
        curretTime: 60,
        gameStarted: false, // Estado para rastrear se o jogo já começou
    },
    actions: {
        timerId: null, // Iniciar nulo para ser definido ao clicar no botão
        countDownTimerId: null, // Iniciar nulo para ser definido ao clicar no botão
    }
};

function countDown() {
    state.value.curretTime--;
    state.view.timeLeft.textContent = state.value.curretTime;

    // Aumentar a velocidade à medida que o tempo diminui
    adjustGameSpeed();

    if (state.value.curretTime <= 0) {
        stopGame(); // Para o jogo quando o tempo acabar
    } 
}

function adjustGameSpeed() {
    if (state.value.curretTime % 10 === 0 && state.value.gameVelocity > 300) {
        // Reduzir o intervalo (aumentar a velocidade) a cada 10 segundos
        state.value.gameVelocity -= 100;

        // Reiniciar o intervalo para ajustar a nova velocidade
        clearInterval(state.actions.timerId);
        state.actions.timerId = setInterval(randomSquare, state.value.gameVelocity);
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.03;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy")
    state.value.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.value.hitPosition) {
                state.value.result++
                state.view.score.textContent = state.value.result;
                state.value.hitPosition = null;
                playSound("hit");
            }
        })
    });
}

function startGame() {
    if (!state.value.gameStarted) {
        // Marca o jogo como iniciado
        state.value.gameStarted = true;

        // Muda o texto do botão para "STOP"
        state.view.start.textContent = "STOP";

        //Reseta o tempo e a pontuação
        state.value.curretTime = 60;
        state.value.result = 0;
        state.view.timeLeft.textContent = state.value.curretTime;
        state.view.score.textContent = state.value.result;

        // Inicia os timers
        state.actions.timerId = setInterval(randomSquare, state.value.gameVelocity);
        state.actions.countDownTimerId = setInterval(countDown, 1000);
    } else {
        stopGame(); // Para o jogo se já estiver em andamento
    }
}

function stopGame() {
     // Para os timers
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    // Exibe o resultado
    alert("Game Over! O seu resultado foi: " + state.value.result);

    // Reseta o botão para "START"
    state.view.start.textContent = "START";
    state.value.gameStarted = false; // Marca que o jogo terminou
}

function initialize() {
    addListenerHitBox();
     // Adiciona o event listener ao botão de start
     state.view.start.addEventListener("click", startGame);
}

initialize();
