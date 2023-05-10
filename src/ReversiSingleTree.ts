type Board = number[][];

// Ustawienie kierunków do sprawdzania ruchów w grze
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
];

// Klasa reprezentująca węzeł w drzewie minimax
export class MinimaxNode {
    children: Map<string, MinimaxNode>
    value: number | null;

    constructor() {
        this.children = new Map<string, MinimaxNode>()
        this.value = null
    }
}
export default class ReversiSingleTree {

    static minimaxTreeRoot: MinimaxNode | null = null
    board: Board
    currentPlayer: number
    directions: number[][]
    heuristic: string


    // Inicjalizacja pustej planszy lub planszy z istniejącego ciągu znaków / tablicy
    constructor(heuristic: string, inputBoard?: string | Board) {

        if (!inputBoard) {
            this.board = this.createEmptyBoard()
            this.initializeBoard()
        } else if (typeof inputBoard === "string") {
            this.board = this.parseInput(inputBoard)
        } else {
            this.board = inputBoard
        }

        this.heuristic = heuristic
        this.currentPlayer = 1;
    }

    createEmptyBoard(): Board {
        return new Array(8).fill(null).map(() => new Array(8).fill(0))
    }

    initializeBoard(): void {
        this.board[3][3] = 1
        this.board[3][4] = 2
        this.board[4][3] = 2
        this.board[4][4] = 1
    }

    //Konwersja ciągu wejściowego na tablicę planszy
    parseInput(input: string): Board {
        const rows = input.trim().split('\n')
        const board: Board = []
        for (let i = 0; i < 8; i++) {
            const row: number[] = rows[i].trim().split(' ').map(Number)
            board.push(row)
        }
        return board
    }

    // Generowanie hasha stanu planszy
    private hashBoardState(): string {
        return this.board.flatMap(row => row).join('');
    }

    // Budowanie drzewa minimax
    buildMinimaxTree(depth: number): MinimaxNode {
        if (ReversiSingleTree.minimaxTreeRoot === null) {
            ReversiSingleTree.minimaxTreeRoot = new MinimaxNode()
        }
        this.minimax(depth, -Infinity, Infinity, true, ReversiSingleTree.minimaxTreeRoot)
        return ReversiSingleTree.minimaxTreeRoot
    }

    //Sprawdzenie czy pozycja (wiersz, kolumna) znajduje się na planszy
    private isOnBoard(row: number, col: number): boolean {
        return row >= 0 && row < 8 && col >= 0 && col < 8
    }


    //Sprawdzenie czy ruch jest dozwolony
    isValidMove(row: number, col: number): boolean {
        //sprawdzanie czy pole jest puste, jelsi nie to false
        if (this.board[row][col] !== 0) {
            return false
        }
        // Przeszukanie wszystkich mozliwych kierunków
        for (const direction of DIRECTIONS) {
            const newRow = row + direction[0]
            const newCol = col + direction[1];

            // Jeśli pozycja jest na planszy i zawiera pionek przeciwnika
            if (
                this.isOnBoard(newRow, newCol) &&
                this.board[newRow][newCol] === 3 - this.currentPlayer
            ) {
                let currentRow = newRow + direction[0]
                let currentCol = newCol + direction[1];

                // Przeszukaj w danym kierunku
                while (this.isOnBoard(currentRow, currentCol)) {
                    if (this.board[currentRow][currentCol] === 0) break
                    //jelsi znajdzie pionek obecnego gracza zwraca true
                    if (this.board[currentRow][currentCol] === this.currentPlayer) return true
                    currentRow += direction[0]
                    currentCol += direction[1]
                }
            }
        }
        return false
    }

    //Wykonanie ruchu na planszy:
    makeMove(row: number, col: number): void {
        this.board[row][col] = this.currentPlayer;

        // Sprawdzanie każdego kierunku w celu odwrócenia pionków przeciwnika
        for (const direction of DIRECTIONS) {
            const newRow = row + direction[0]
            const newCol = col + direction[1];
            // Jeśli pozycja jest na planszy i zawiera pionek przeciwnika
            if (
                this.isOnBoard(newRow, newCol) &&
                this.board[newRow][newCol] === 3 - this.currentPlayer
            ) {
                let currentRow = newRow + direction[0]
                let currentCol = newCol + direction[1]
                let toFlip: number[][] = [[newRow, newCol]];


                while (this.isOnBoard(currentRow, currentCol)) {
                    if (this.board[currentRow][currentCol] === 0) break
                    if (this.board[currentRow][currentCol] === this.currentPlayer) {
                        for (const pos of toFlip) {
                            this.board[pos[0]][pos[1]] = this.currentPlayer
                        }
                        break
                    }
                    toFlip.push([currentRow, currentCol])
                    currentRow += direction[0]
                    currentCol += direction[1]
                }
            }
        }
        this.currentPlayer = 3 - this.currentPlayer
    }


    //Sprawdzanie czy gracz ma dozwolone ruchy
    hasValidMoves(): boolean {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col)) return true
            }
        }
        return false
    }

    isGameOver(): boolean {
        for (let player = 1; player <= 2; player++) {
            if (this.hasValidMoves()) return false
            this.currentPlayer = 3 - this.currentPlayer
        }
        return true
    }


    //Zliczanie pionków na planszy dla danego gracza
    countPieces(player: number): number {
        let count = 0
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === player) count++
            }
        }
        return count
    }

    getWinner(): number | null {
        if (!this.isGameOver()) return null;

        const count1 = this.countPieces(1)
        const count2 = this.countPieces(2);

        return count1 > count2 ? 1 : count1 < count2 ? 2 : 0

    }


    // Implementacja algorytmu minimax z alfa-beta przycinaniem:
    minimax(depth: number, alpha: number, beta: number, maximizingPlayer: boolean, node: MinimaxNode): number {
        //zwrotka jesli przeszukiwanie (głębokość) zakończone
        if (depth === 0 || this.isGameOver()) {
            node.value = this.evaluate();
            return node.value
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isValidMove(row, col)) {
                        const clonedReversi = this.clone()  //klonowanie stanu gry
                        clonedReversi.makeMove(row, col)
                        const childNode = new MinimaxNode()
                        const childKey = `${row},${col},${this.hashBoardState()}`
                        node.children.set(childKey, childNode) //dodanie do drzewa gry jako dziecko
                        //wywołanie rekurencyjne na tym drzewie z odwróconym maximizing player (false)
                        const evalValue = clonedReversi.minimax(depth - 1, alpha, beta, false, childNode)  
                        maxEval = Math.max(maxEval, evalValue) //aktualizacja najlepszej dotychczasowej oceny
                        alpha = Math.max(alpha, evalValue)
                        if (beta <= alpha) break //przerwanie pętli, jeśi dana gałąź nie będzie miała lepszych wartości
                    }
                }
            }
            node.value = maxEval
            return maxEval
        } else {
            let minEval = Infinity
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isValidMove(row, col)) {
                        const newReversi = this.clone()
                        newReversi.makeMove(row, col)
                        const childNode = new MinimaxNode()
                        const childKey = `${row},${col},${this.hashBoardState()}`
                        node.children.set(childKey, childNode)
                        const evalValue = newReversi.minimax(depth - 1, alpha, beta, true, childNode)
                        minEval = Math.min(minEval, evalValue)
                        beta = Math.min(beta, evalValue)
                        if (beta <= alpha) break
                    }
                }
            }
            node.value = minEval
            return minEval
        }
    }


    findBestMove(node: MinimaxNode): [number, number] | null {
        let bestEval = this.currentPlayer === 1 ? -Infinity : Infinity
        let bestMove: [number, number] | null = null
        const currentBoardHash = this.hashBoardState()
        node.children.forEach((childNode, key) => {
            const [row, col, boardHash] = key.split(',')
            if (boardHash === currentBoardHash && childNode.value !== null) {
                if ((this.currentPlayer === 1 && childNode.value > bestEval) ||
                    (this.currentPlayer === 2 && childNode.value < bestEval)) {
                    bestEval = childNode.value
                    bestMove = [parseInt(row), parseInt(col)]
                }
            }
        })
        return bestMove
    }



    //Ocena heurystyczna dla bieżącego stanu gry:
    evaluate(): number {
        if (this.heuristic == "pieces_amount") return this.evaluatePiecesAmount()
        if (this.heuristic == "corners_amount") return this.evaluateCornersAmount()
        if (this.heuristic == "available_moves_amount") return this.evaluateAvailableMovesAmount()
        if (this.heuristic == "position_amount") return this.evaluatePiecePosition()
        throw new Error("Invalid heuristic")
    }


    evaluatePiecesAmount(): number {
        const count1 = this.countPieces(1)
        const count2 = this.countPieces(2)
        return count1 - count2
    }

    evaluateCornersAmount(): number {
        let cornerScore = 0
        const cornerPositions = [
            [0, 0],
            [0, 7],
            [7, 0],
            [7, 7]
        ];

        for (const position of cornerPositions) {
            if (this.board[position[0]][position[1]] === this.currentPlayer) {
                cornerScore++
            } else if (this.board[position[0]][position[1]] === 3 - this.currentPlayer) {
                cornerScore--
            }
        }
        return cornerScore
    }


    evaluateAvailableMovesAmount(): number {
        let availableMoves = 0
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove(row, col)) availableMoves++
            }
        }
        return availableMoves
    }

    evaluatePiecePosition(): number {
        let positionScore = 0;
    
        // preferowanie rogów i unikanie pól przy rogach.
        const weightMatrix = [
            [ 4, -3, 2, 2, 2, 2, -3,  4],
            [-3, -4, -1, -1, -1, -1, -4, -3],
            [ 2, -1, 1, 0, 0, 1, -1,  2],
            [ 2, -1, 0, 1, 1, 0, -1,  2],
            [ 2, -1, 0, 1, 1, 0, -1,  2],
            [ 2, -1, 1, 0, 0, 1, -1,  2],
            [-3, -4, -1, -1, -1, -1, -4, -3],
            [ 4, -3, 2, 2, 2, 2, -3,  4]
        ];
    
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === this.currentPlayer) {
                    positionScore += weightMatrix[row][col];
                } else if (this.board[row][col] === 3 - this.currentPlayer) {
                    positionScore -= weightMatrix[row][col];
                }
            }
        }
        return positionScore;
    }
    


    clone(): ReversiSingleTree {
        const clonedReversi = new ReversiSingleTree(this.heuristic, JSON.parse(JSON.stringify(this.board)))
        clonedReversi.currentPlayer = this.currentPlayer
        return clonedReversi
    }

    switchPlayer() {
        this.currentPlayer = 3 - this.currentPlayer
    }

    //Symulacja gry z wykorzystaniem algorytmu minimax
    playSimulation(depth: number): [number, number, number, number] {
        let round = 0
        ReversiSingleTree.minimaxTreeRoot = new MinimaxNode()
        while (!this.isGameOver()) {
            this.buildMinimaxTree(depth);

            const move = this.findBestMove(ReversiSingleTree.minimaxTreeRoot);

            if (move) {
                round++
                console.log(`ROUND: ${round}, TURN: player ${this.currentPlayer}`)
                this.makeMove(move[0], move[1])
                this.printBoard()
            } else {
                this.switchPlayer()
            }
        }

        const count1 = this.countPieces(1)
        const count2 = this.countPieces(2)
        return [round, count1 > count2 ? 1 : 2, count1, count2]
    }

    printBoard() {
        for (const row of this.board) console.log(row.join(' '))
    }
}

