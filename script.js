// Aguarde o DOM ser completamente carregado antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Inicialize o tabuleiro de xadrez
    const game = new Chess(); // Crie uma nova instância de jogo Chess.js
    const moveHistory = document.getElementById('move-history'); // Obtenha o contêiner de histórico de movimentos
    let moveCount = 1; // Inicialize a contagem de movimentos
    let userColor = 'w'; // Inicialize a cor do usuário como branca

    // Função para fazer um movimento aleatório para o computador
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if (game.game_over()) {
            alert("Xeque-mate!");
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount); // Registre e exiba o movimento com a contagem de movimentos
            moveCount++; // Incremente a contagem de movimentos
        }
    };

    // Função para registrar e exibir um movimento no histórico de movimentos
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight; // Rolagem automática para o movimento mais recente
    };

    // Função para lidar com o início de uma posição de arrasto
    const onDragStart = (source, piece) => {
        // Permitir que o usuário arraste apenas suas próprias peças com base na cor
        return !game.game_over() && piece.search(userColor) === 0;
    };

    // Função para lidar com a soltura de uma peça no tabuleiro
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // Registre e exiba o movimento com a contagem de movimentos
        moveCount++;
    };

    // Função para lidar com o final de uma animação de encaixe de peça
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    // Opções de configuração para o tabuleiro de xadrez
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    // Inicialize o tabuleiro de xadrez
    board = Chessboard('board', boardConfig);

    // Evento de ouvinte para o botão "Jogar Novamente"
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    // Evento de ouvinte para o botão "Definir Posição"
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Digite a notação FEN para a posição desejada!");
        if (fen !== null) {
            if (game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            } else {
                alert("Notação FEN inválida. Tente novamente.");
            }
        }
    });

    // Evento de ouvinte para o botão "Inverter Tabuleiro"
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        // Alterne a cor do usuário após inverter o tabuleiro
        userColor = userColor === 'w' ? 'b' : 'w';
    });

});
