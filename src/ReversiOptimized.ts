type Board = number[][];

// Ustawienie kierunków do sprawdzania ruchów w grze
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
];

const heuristic = {
    PIECES_AMOUNT: "pieces_amount",
    CORNER_AMOUNT: "corners_amount",
    AVAILABLE_MOVES_AMOUNT: "available_moves_amount",
}

const HEURISTIC = heuristic.PIECES_AMOUNT




class MinimaxNode {
    children: Map<string, MinimaxNode>;
    value: number | null;

    constructor() {
        this.children = new Map<string, MinimaxNode>();
        this.value = null;
    }
}



export default class ReversiOptimized {

    static minimaxTreeRoot = new MinimaxNode();
    board: Board;
    currentPlayer: number;
    directions: number[][];


    // Inicjalizacja pustej planszy lub planszy z istniejącego ciągu znaków / tablicy
    constructor(inputBoard?: string | Board) {

        if (!inputBoard) {
            this.board = this.createEmptyBoard()
            this.initializeBoard();
        } else if (typeof inputBoard === "string") {
            this.board = this.parseInput(inputBoard)
        } else {
            this.board = inputBoard
        }


        this.currentPlayer = 1;
        // Ustawienie kierunków do sprawdzania ruchów w grze
        //this.directions = 
    }

    createEmptyBoard(): Board {
        return new Array(8).fill(null).map(() => new Array(8).fill(0));
    }


    private hashBoardState(): string {
        return this.board.flatMap(row => row).join('');
        // let hash = 0, i, chr;
        // for (i = 0; i < boardStr.length; i++) {
        //     chr = boardStr.charCodeAt(i);
        //     hash = ((hash << 5) - hash) + chr;
        //     hash |= 0; // Convert to 32bit integer
        // }
        // return hash.toString();
    }

    initializeBoard(): void {
        this.board[3][3] = 1;
        this.board[3][4] = 2;
        this.board[4][3] = 2;
        this.board[4][4] = 1;
    }

    //Konwersja ciągu wejściowego na tablicę planszy
    parseInput(input: string): Board {
        const rows = input.trim().split('\n');
        const board: Board = [];
        for (let i = 0; i < 8; i++) {
            const row: number[] = rows[i].trim().split(' ').map(Number);
            board.push(row);
        }
        return board;
    }

    //Sprawdzenie czy pozycja (wiersz, kolumna) znajduje się na planszy
    private isOnBoard(row: number, col: number): boolean {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }


    //Sprawdzenie czy ruch jest dozwolony
    isValidMove(row: number, col: number): boolean {
        if (this.board[row][col] !== 0) {
            return false;
        }

        for (const direction of DIRECTIONS) {
            const newRow = row + direction[0];
            const newCol = col + direction[1];

            if (
                this.isOnBoard(newRow, newCol) &&
                this.board[newRow][newCol] === 3 - this.currentPlayer
            ) {
                let currentRow = newRow + direction[0];
                let currentCol = newCol + direction[1];

                while (this.isOnBoard(currentRow, currentCol)) {
                    if (this.board[currentRow][currentCol] === 0) {
                        break;
                    }
                    if (this.board[currentRow][currentCol] === this.currentPlayer) {
                        return true;
                    }
                    currentRow += direction[0];
                    currentCol += direction[1];
                }
            }
        }

        return false;
    }

    //Wykonanie ruchu na planszy:
    makeMove(row: number, col: number): void {
        this.board[row][col] = this.currentPlayer;

        for (const direction of DIRECTIONS) {
            const newRow = row + direction[0];
            const newCol = col + direction[1];

            if (
                this.isOnBoard(newRow, newCol) &&
                this.board[newRow][newCol] === 3 - this.currentPlayer
            ) {
                let currentRow = newRow + direction[0];
                let currentCol = newCol + direction[1];
                let toFlip: number[][] = [[newRow, newCol]];

                while (this.isOnBoard(currentRow, currentCol)) {
                    if (this.board[currentRow][currentCol] === 0) {
                        break;
                    }
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
    hasValidMoves(): boolean {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col)) {
                    return true;
                }
            }
        }
        return false;
    }

    isGameOver(): boolean {
        for (let player = 1; player <= 2; player++) {
            if (this.hasValidMoves()) {
                return false;
            }
            this.currentPlayer = 3 - this.currentPlayer;
        }
        return true;
    }


    //Zliczanie pionków na planszy dla danego gracza
    countPieces(player: number): number {
        let count = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === player) {
                    count++;
                }
            }
        }
        return count;
    }

    getWinner(): number | null {
        if (!this.isGameOver()) return null;

        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);

        return count1 > count2 ? 1 : count1 < count2 ? 2 : 0

    }


    // Implementacja algorytmu minimax z alfa-beta przycinaniem:
    minimax(depth: number, alpha: number, beta: number, maximizingPlayer: boolean, node: MinimaxNode): number {
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
                        const childKey = `${row},${col}:${this.hashBoardState()}`;

                        const childNode = new MinimaxNode();
                        node.children.set(childKey, childNode);


                        const evalValue = clonedReversi.minimax(depth - 1, alpha, beta, false, childNode);
                        maxEval = Math.max(maxEval, evalValue);
                        alpha = Math.max(alpha, evalValue);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
            }
            node.value = maxEval;
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isValidMove(row, col)) {
                        const newReversi = this.clone();
                        newReversi.makeMove(row, col);

                        const childKey = `${row},${col}:${this.hashBoardState()}`;

                        const childNode = new MinimaxNode();
                        node.children.set(childKey, childNode);

                        const evalValue = newReversi.minimax(depth - 1, alpha, beta, true, childNode);
                        minEval = Math.min(minEval, evalValue);
                        beta = Math.min(beta, evalValue);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
            }
            node.value = minEval;
            return minEval;
        }
    }


    findBestMove(node: MinimaxNode): [number, number] | null {
        let bestEval = -Infinity;
        let bestMove: [number, number] | null = null;
        node.children.forEach((childNode, key) => {
            if (childNode.value !== null && childNode.value > bestEval) {
                bestEval = childNode.value;
                bestMove = key.split(':')[0].split(",").map(Number) as [number, number];
            }
        });
        return bestMove;
    }

    //Ocena heurystyczna dla bieżącego stanu gry:
    evaluate(): number {

        if (HEURISTIC == "pieces_amount") return this.evaluatePiecesAmount()
        if (HEURISTIC == "corners_amount") return this.evaluateCornersAmount()
        if (HEURISTIC == "available_moves_amount") return this.evaluateAvailableMovesAmount()

    }


    evaluatePiecesAmount(): number {
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);
        return count1 - count2;
    }

    evaluateCornersAmount(): number {

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
            } else if (this.board[position[0]][position[1]] === 3 - this.currentPlayer) {
                cornerScore--;
            }
        }

        return cornerScore;
    }


    evaluateAvailableMovesAmount(): number {

        let availableMoves = 0;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col)) {
                    availableMoves++;
                }
            }
        }

        return availableMoves;
    }


    clone(): ReversiOptimized {
        const clonedReversi = new ReversiOptimized(JSON.parse(JSON.stringify(this.board)));
        clonedReversi.currentPlayer = this.currentPlayer;
        return clonedReversi;
    }

    switchPlayer() {
        this.currentPlayer = 3 - this.currentPlayer;
    }

    //Symulacja gry z wykorzystaniem algorytmu minimax
    playSimulation(depth: number): [number, number] {
        let round = 0;
        while (!this.isGameOver()) {
            const root = new MinimaxNode();
            this.minimax(depth, -Infinity, Infinity, true, root);
            const move = this.findBestMove(root);
            if (move) {
                this.makeMove(move[0], move[1]);
                round++;
                console.log(`ROUND: ${round}, TURN: player ${this.currentPlayer}`);
                this.printBoard();
            } else {
                this.switchPlayer();
            }
        }
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);
        return [round, count1 > count2 ? 1 : 2];
    }

    printBoard() {
        for (const row of this.board) console.log(row.join(' '));
    }

}

