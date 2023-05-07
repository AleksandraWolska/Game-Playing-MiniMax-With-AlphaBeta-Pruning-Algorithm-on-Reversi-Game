type Board = number[][];

export default class ReversiOptimized {
    board: Board;
    currentPlayer: number;
    directions: number[][];



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
        this.directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
    }

    createEmptyBoard(): Board {
        return new Array(8).fill(null).map(() => new Array(8).fill(0));
    }

    initializeBoard(): void {
        this.board[3][3] = 1;
        this.board[3][4] = 2;
        this.board[4][3] = 2;
        this.board[4][4] = 1;
    }

    parseInput(input: string): Board {
        const rows = input.trim().split('\n');
        const board: Board = [];
        for (let i = 0; i < 8; i++) {
            const row: number[] = rows[i].trim().split(' ').map(Number);
            board.push(row);
        }
        return board;
    }

    private isOnBoard(row: number, col: number): boolean {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    isValidMove(row: number, col: number): boolean {
        if (this.board[row][col] !== 0) {
            return false;
        }

        for (const direction of this.directions) {
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

    makeMove(row: number, col: number): void {
        this.board[row][col] = this.currentPlayer;

        for (const direction of this.directions) {
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


    has_valid_moves(): boolean {
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
            if (this.has_valid_moves()) {
                return false;
            }
            this.currentPlayer = 3 - this.currentPlayer;
        }
        return true;
    }

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
        if (!this.isGameOver()) {
            return null;
        }
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);

        if (count1 > count2) {
            return 1;
        } else if (count1 < count2) {
            return 2;
        } else {
            return 0; // draw
        }
    }

    minimax(depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {
        if (depth === 0 || this.isGameOver()) {
            return this.evaluate(); // return heuristic evaluation for the current game state
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isValidMove(row, col)) {
                        const clonedReversi = this.clone();
                        clonedReversi.makeMove(row, col);
                        const evalValue = clonedReversi.minimax(depth - 1, alpha, beta, false);
                        maxEval = Math.max(maxEval, evalValue);
                        alpha = Math.max(alpha, evalValue);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isValidMove(row, col)) {
                        const newReversi = this.clone();
                        newReversi.makeMove(row, col);
                        const evalValue = newReversi.minimax(depth - 1, alpha, beta, true);
                        minEval = Math.min(minEval, evalValue);
                        beta = Math.min(beta, evalValue);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
            }
            return minEval;
        }
    }

    best_move(depth: number): [number, number] | null {
        let bestEval = -Infinity;
        let bestMove: [number, number] | null = null;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col)) {
                    const clonedReversi = this.clone();
                    clonedReversi.makeMove(row, col);
                    const evalValue = clonedReversi.minimax(depth - 1, -Infinity, Infinity, false);
                    if (evalValue > bestEval) {
                        bestEval = evalValue;
                        bestMove = [row, col];
                    }
                }
            }
        }
        return bestMove;
    }

    // Method returning heuristic evaluation for the current game state (simple implementation)
    evaluate(): number {
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);
        return count1 - count2;
    }

    clone(): Reversi  {
        const clonedReversi = new Reversi(JSON.parse(JSON.stringify(this.board)));
        clonedReversi.currentPlayer = this.currentPlayer;
        return clonedReversi;
    }

    switchPlayer() {
        this.currentPlayer = 3 - this.currentPlayer;
    }

    playSimulation(depth: number): [number, number] {
        let round = 0;
        while (!this.isGameOver()) {
            const move = this.best_move(depth);
            if (move) {
                this.makeMove(move[0], move[1]);
                round++;
                console.log(`ROUND: ${round}, TURN: player ${this.currentPlayer}`)
                this.printBoard()
            } else {
                this.switchPlayer();
            }
        }
        const count1 = this.countPieces(1);
        const count2 = this.countPieces(2);
        return [round, count1 > count2 ? 1 : 2];
    }

    printBoard() {
        for (const row of this.board) {
            console.log(row.join(' '));
        }
    }

}