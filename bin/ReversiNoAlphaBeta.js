"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimaxNode = void 0;
// Ustawienie kierunków do sprawdzania ruchów w grze
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
];
class MinimaxNode {
    constructor() {
        this.children = new Map();
        this.value = null;
    }
}
exports.MinimaxNode = MinimaxNode;
class ReversiNoAlphaBeta {
    // Inicjalizacja pustej planszy lub planszy z istniejącego ciągu znaków / tablicy
    constructor(heuristic, inputBoard) {
        if (!inputBoard) {
            this.board = this.createEmptyBoard();
            this.initializeBoard();
        }
        else if (typeof inputBoard === "string") {
            this.board = this.parseInput(inputBoard);
        }
        else {
            this.board = inputBoard;
        }
        this.heuristic = heuristic;
        this.currentPlayer = 1;
    }
    createEmptyBoard() {
        return new Array(8).fill(null).map(() => new Array(8).fill(0));
    }
    initializeBoard() {
        this.board[3][3] = 1;
        this.board[3][4] = 2;
        this.board[4][3] = 2;
        this.board[4][4] = 1;
    }
    //Konwersja ciągu wejściowego na tablicę planszy
    parseInput(input) {
        const rows = input.trim().split('\n');
        const board = [];
        for (let i = 0; i < 8; i++) {
            const row = rows[i].trim().split(' ').map(Number);
            board.push(row);
        }
        return board;
    }
    hashBoardState() {
        return this.board.flatMap(row => row).join('');
    }
    buildMinimaxTree(depth) {
        if (ReversiNoAlphaBeta.minimaxTreeRoot === null) {
            ReversiNoAlphaBeta.minimaxTreeRoot = new MinimaxNode();
            console.log("nowe drzewo");
        }
        this.minimax(depth, true, ReversiNoAlphaBeta.minimaxTreeRoot);
        return ReversiNoAlphaBeta.minimaxTreeRoot;
    }
    //Sprawdzenie czy pozycja (wiersz, kolumna) znajduje się na planszy
    isOnBoard(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    //Sprawdzenie czy ruch jest dozwolony
    isValidMove(row, col) {
        if (this.board[row][col] !== 0) {
            return false;
        }
        for (const direction of DIRECTIONS) {
            const newRow = row + direction[0];
            const newCol = col + direction[1];
            if (this.isOnBoard(newRow, newCol) &&
                this.board[newRow][newCol] === 3 - this.currentPlayer) {
                let currentRow = newRow + direction[0];
                let currentCol = newCol + direction[1];
                while (this.isOnBoard(currentRow, currentCol)) {
                    if (this.board[currentRow][currentCol] === 0)
                        break;
                    if (this.board[currentRow][currentCol] === this.currentPlayer)
                        return true;
                    currentRow += direction[0];
                    currentCol += direction[1];
                }
            }
        }
        return false;
    }
    //Wykonanie ruchu na planszy:
    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;
        for (const direction of DIRECTIONS) {
            const newRow = row + direction[0];
            const newCol = col + direction[1];
            if (this.isOnBoard(newRow, newCol) &&
                this.board[newRow][newCol] === 3 - this.currentPlayer) {
                let currentRow = newRow + direction[0];
                let currentCol = newCol + direction[1];
                let toFlip = [[newRow, newCol]];
                while (this.isOnBoard(currentRow, currentCol)) {
                    if (this.board[currentRow][currentCol] === 0)
                        break;
                    if (this.board[currentRow][currentCol] === this.currentPlayer) {
                        for (const pos of toFlip) {
                            this.board[pos[0]][pos[1]] = this.currentPlayer;
                        }
                        break;
                    }
                    toFlip.push([currentRow, currentCol]);
                    currentRow += direction[0];
                    currentCol += direction[1];
                }
            }
        }
        this.currentPlayer = 3 - this.currentPlayer;
    }
    //Sprawdzanie czy gracz ma dozwolone ruchy
    hasValidMoves() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col))
                    return true;
            }
        }
        return false;
    }
    isGameOver() {
        for (let player = 1; player <= 2; player++) {
            if (this.hasValidMoves())
                return false;
            this.currentPlayer = 3 - this.currentPlayer;
        }
        return true;
    }
    //Zliczanie pionków na planszy dla danego gracza
    countPieces(player) {
        let count = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === player)
                    count++;
            }
        }
        return count;
    }
    getWinner() {
        if (!this.isGameOver())
            return null;
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);
        return count1 > count2 ? 1 : count1 < count2 ? 2 : 0;
    }
    minimax(depth, maximizingPlayer, node) {
        if (depth === 0 || this.isGameOver()) {
            node.value = this.evaluate(); // return heuristic evaluation for the current game state
            return node.value;
        }
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isValidMove(row, col)) {
                        const clonedReversi = this.clone();
                        clonedReversi.makeMove(row, col);
                        const childNode = new MinimaxNode();
                        const childKey = `${row},${col},${this.hashBoardState()}`;
                        node.children.set(childKey, childNode);
                        const evalValue = clonedReversi.minimax(depth - 1, false, childNode);
                        maxEval = Math.max(maxEval, evalValue);
                    }
                }
            }
            node.value = maxEval;
            return maxEval;
        }
        else {
            let minEval = Infinity;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isValidMove(row, col)) {
                        const newReversi = this.clone();
                        newReversi.makeMove(row, col);
                        const childNode = new MinimaxNode();
                        const childKey = `${row},${col},${this.hashBoardState()}`;
                        node.children.set(childKey, childNode);
                        const evalValue = newReversi.minimax(depth - 1, true, childNode);
                        minEval = Math.min(minEval, evalValue);
                    }
                }
            }
            node.value = minEval;
            return minEval;
        }
    }
    findBestMove(node) {
        let bestEval = this.currentPlayer === 1 ? -Infinity : Infinity;
        let bestMove = null;
        const currentBoardHash = this.hashBoardState();
        node.children.forEach((childNode, key) => {
            const [row, col, boardHash] = key.split(',');
            if (boardHash === currentBoardHash && childNode.value !== null) {
                if ((this.currentPlayer === 1 && childNode.value > bestEval) ||
                    (this.currentPlayer === 2 && childNode.value < bestEval)) {
                    bestEval = childNode.value;
                    bestMove = [parseInt(row), parseInt(col)];
                }
            }
        });
        return bestMove;
    }
    //Ocena heurystyczna dla bieżącego stanu gry:
    evaluate() {
        if (this.heuristic == "pieces_amount")
            return this.evaluatePiecesAmount();
        if (this.heuristic == "corners_amount")
            return this.evaluateCornersAmount();
        if (this.heuristic == "available_moves_amount")
            return this.evaluateAvailableMovesAmount();
        throw new Error("Invalid heuristic");
    }
    evaluatePiecesAmount() {
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);
        return count1 - count2;
    }
    evaluateCornersAmount() {
        let cornerScore = 0;
        const cornerPositions = [
            [0, 0],
            [0, 7],
            [7, 0],
            [7, 7]
        ];
        for (const position of cornerPositions) {
            if (this.board[position[0]][position[1]] === this.currentPlayer) {
                cornerScore++;
            }
            else if (this.board[position[0]][position[1]] === 3 - this.currentPlayer) {
                cornerScore--;
            }
        }
        return cornerScore;
    }
    evaluateAvailableMovesAmount() {
        let availableMoves = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col))
                    availableMoves++;
            }
        }
        return availableMoves;
    }
    clone() {
        const clonedReversi = new ReversiNoAlphaBeta(this.heuristic, JSON.parse(JSON.stringify(this.board)));
        clonedReversi.currentPlayer = this.currentPlayer;
        return clonedReversi;
    }
    switchPlayer() {
        this.currentPlayer = 3 - this.currentPlayer;
    }
    //Symulacja gry z wykorzystaniem algorytmu minimax
    playSimulation(depth) {
        let round = 0;
        ReversiNoAlphaBeta.minimaxTreeRoot = new MinimaxNode();
        while (!this.isGameOver()) {
            this.buildMinimaxTree(depth);
            const move = this.findBestMove(ReversiNoAlphaBeta.minimaxTreeRoot);
            if (move) {
                round++;
                console.log(`ROUND: ${round}, TURN: player ${this.currentPlayer}`);
                this.makeMove(move[0], move[1]);
                this.printBoard();
            }
            else {
                this.switchPlayer();
            }
        }
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);
        return [round, count1 > count2 ? 1 : 2, count1, count2];
    }
    printBoard() {
        for (const row of this.board)
            console.log(row.join(' '));
    }
}
ReversiNoAlphaBeta.minimaxTreeRoot = null;
exports.default = ReversiNoAlphaBeta;
