function start() {
    $('#game-inicio').hide();
    $('#game-fundo').append('<div id="game-jogador" class="animacao"></div>');
    $('#game-fundo').append('<div id="game-pontuacao"></div>');
    $('#game-pontuacao').append('<div id="game-pontuacao"></div>');
    

    let jogo = {}
    let pontos = 0;
    let velocidade = 1.0;
    let velocidadeTiro = 450;
    let widthTela = parseInt($('#game-fundo').css('width'));
    let heightTela = parseInt($('#game-fundo').css('height'));
    let num = 10;
    let i = 1;
    const TECLA = {
        UP: 38,
        DOWN: 40,
        RIGHT: 39,
        LEFT: 37,
        SPACE: 32
    }
    jogo.pressionou = [];

    $(document).keydown(function (tecla) {
        jogo.pressionou[tecla.which] = true;
    });

    $(document).keyup(function (tecla) {
        jogo.pressionou[tecla.which] = false;
    });


    criaInimigo1();
    jogo.timer = setInterval(loop, 30);
    jogo.tiroInimigo = setInterval(tiroInimigo, 60);

    function loop() {
        moveInimigos();
        moveJogador();
        colisao();
        pontuacao();
    }

    function pontuacao() {
        $('#game-pontuacao').html(`Pontos: ${pontos} | Objetivo: 5000 pontos`);
        if(pontos >= 5000) {
            venceu();
        }
    }

    function colisao() {
        let colisaoTiroJogador = $($('.tiro-jogador').collision($('#game-nave-inimigo1')));
        let colisaoTiroJInimigo1 = $($('.tiro-inimigo').collision($('#game-jogador')));
        if(colisaoTiroJogador.length > 0) {
            $('#game-nave-inimigo1').remove();
            criaInimigo1();
            pontos += 100;
            if(velocidade <= 12.0) {
                velocidade += 0.3; 
            }

            if(velocidadeTiro >= 0) {
                velocidadeTiro -= 10;
            }
        }

        if(colisaoTiroJInimigo1.length > 0) {
            pontos -= 20;
            if(pontos <= -500) {
                gameOver();
            }
        }
    }

    function venceu() {
        $('#game-jogador').remove();
        $('#game-nave-inimigo1').remove();
        clearInterval(jogo.timer);
        clearInterval(jogo.tiroInimigo);
        $('#game-fundo').append('<div id="game-over"></div>');
        $('#game-over').append('<h2>Você venceu!!!</h2>');
        $('#game-over').append('<buttom class="btn" onclick="restart()">Reiniciar</buttom>');
    }

    function gameOver() {
        $('#game-jogador').remove();
        $('#game-nave-inimigo1').remove();
        clearInterval(jogo.timer);
        clearInterval(jogo.tiroInimigo);
        $('#game-fundo').append('<div id="game-over"></div>');
        $('#game-over').append('<h2>Game over</h2>');
        $('#game-over').append('<buttom class="btn" onclick="restart()">Reiniciar</buttom>');
    }

    function moveJogador() {
        let id = $('#game-jogador');
        let top = parseInt($(id).css('top'));
        let right = parseInt($(id).css('right'));

        if (jogo.pressionou[TECLA.UP]) {
            if (top >= 0) {
                $(id).css('top', top - 10)
            }
        }

        if (jogo.pressionou[TECLA.DOWN]) {
            if (top <= heightTela - 140) {
                $(id).css('top', top + 10)
            }
        }

        if (jogo.pressionou[TECLA.RIGHT]) {
            if (right >= 0) {
                $(id).css('right', right - 20);
            }
        }

        if (jogo.pressionou[TECLA.LEFT]) {
            if (right <= widthTela - 100) {
                $(id).css('right', right + 20);
            }
        }

        if (jogo.pressionou[TECLA.SPACE]) {
            tiro();
        }
    }

    function moveInimigos() {
        let id = '#' + $('.inimigo').get(0).id;

        if (parseInt($(id).css('left')) >= widthTela - 47) {
            num = 10;
        }

        if (parseInt($(id).css('left')) <= 0) {
            num = -10;

        }

        if (parseInt($(id).css('top')) >= parseInt($('#game-fundo').css('height'))) {
            $(id).remove();
            criaInimigo1();
        }

        let posicaoX = parseInt($(id).css('left'));
        let posicaoY = parseInt($(id).css('top'));

        $(id).css('top', posicaoY + velocidade);
        $(id).css('left', (posicaoX - num));

    }

    function criaInimigo1() {
        $('#game-fundo').append('<div id="game-nave-inimigo1" class="inimigo"></div>');
        $('#game-nave-inimigo1').css('left', Math.random() * (widthTela - ((widthTela * 20) / 100)));
    }

    function tiro() {
        let id = $('#game-jogador');
        let top = parseInt($(id).css('top'));
        let left = parseInt($(id).css('left'));


        i++;
        let idTiro = '.tiro' + i;
        $('#game-fundo').append(`<div class="tiro${i} tiro-jogador"></div>`);
        $(idTiro).css('top', top - 9);
        $(idTiro).css('left', left + 76);

        $(idTiro).css('width', 3);
        $(idTiro).css('height', 30);
        $(idTiro).css('border-radius', '50%');
        $(idTiro).css('background-color', 'rgb(163, 4, 4)');
        $(idTiro).css('position', 'absolute');

        let tempoTiro = setInterval(executaTiro, 30);

        function executaTiro() {
            let posTiro = parseInt($(idTiro).css('top'));
            $(idTiro).css('top', posTiro - 30);

            if(posTiro < 0) {
                clearInterval(tempoTiro);
                tempoTiro = null;
                $(idTiro).remove();    
            }
        }        
    }

    function tiroInimigo() {
        let id = $('#game-nave-inimigo1');
        let top = parseInt($(id).css('top'));
        let left = parseInt($(id).css('left'));


        i++;
        let idTiro = '.tiro' + i;
        $('#game-fundo').append(`<div class="tiro${i} tiro-inimigo"></div>`);
        $(idTiro).css('top', top + 30);
        $(idTiro).css('left', left + 21);

        $(idTiro).css('width', 3);
        $(idTiro).css('height', 30);
        $(idTiro).css('border-radius', '50%');
        $(idTiro).css('background-color', 'rgb(170, 167, 2)');
        $(idTiro).css('position', 'absolute');

        let tempoTiro2 = setInterval(executaTiro, 20);

        function executaTiro() {
            let posTiro = parseInt($(idTiro).css('top'));
            $(idTiro).css('top', posTiro + 30);

            if(posTiro > heightTela) {
                clearInterval(tempoTiro2);
                tempoTiro2 = null;
                $(idTiro).remove();    
            }
        }        
    }
}

function restart() {
    $('#game-over').remove();
    start();
}

