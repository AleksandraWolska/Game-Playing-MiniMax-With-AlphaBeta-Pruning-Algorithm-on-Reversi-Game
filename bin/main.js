"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reversi_1 = __importDefault(require("./Reversi"));
const readline_1 = __importDefault(require("readline"));
const heuristicMode = {
    PIECES_AMOUNT: "pieces_amount",
    CORNER_AMOUNT: "corners_amount",
    AVAILABLE_MOVES_AMOUNT: "available_moves_amount",
};
//const HEURISTIC = heuristicMode.PIECES_AMOUNT
function getUserInput(promptText) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
function getCLIBoardInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        let inputString = "";
        return new Promise((resolve) => {
            let counter = 0;
            rl.on('line', (line) => {
                inputString += line.trim() + '\n';
                counter++;
                if (counter == 8) {
                    rl.close();
                    resolve(inputString.trim());
                }
            });
        });
    });
}
// async function interactive(): Promise<void> {
//     while (true) {
//         try {
//             console.log("REVERSI GAME:");
//             let mode = await getUserInput("1 - ustawienie początkowe\n2-wprowadź tablicę");
//             if (mode == "2") {
//                 console.log("Podaj tablicę")
//                 let inputString = await getCLIBoardInput();
//                 console.log("input stringL")
//                 console.log(inputString)
//                 const game = new Reversi(inputString);
//                 const time1 = Date.now()
//                 const simulation_result = game.playSimulation(6);
//                 const time2 = Date.now()
//                 console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
//             } else if (mode == "1") {
//                 const game = new Reversi();
//                 const time1 = Date.now()
//                 const simulation_result = game.playSimulation(6);
//                 const time2 = Date.now()
//                 console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
//             }
//         }catch (e) {
//             console.error(e.message)
//         }
// }
// }
function interactive() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                console.log("REVERSI GAME:");
                let depth = yield getUserInput("Podaj głębokość przeszukiwania:");
                let heuristic = yield getUserInput("1 - Różnica ilości pionków\n2 - Ilośc pionków na rogach\n3 - Ilośc dostepnych ruchów\n");
                heuristic = heuristic == "1" ? heuristicMode.PIECES_AMOUNT : heuristic == "2" ? heuristicMode.CORNER_AMOUNT : heuristicMode.AVAILABLE_MOVES_AMOUNT;
                let mode = yield getUserInput("Podaj tryb gry:\n1 - Reversi na drzewie - ustawienie początkowe\n2Reversi na drzewie - wprowadź tablicę\n3 - Reversi - ustawienie początkowe\n4Reversi - wprowadź tablicę\n");
                if (mode == "1") {
                    const timeBuild1 = Date.now();
                    //const minimaxTreeRoot = new MinimaxNode();
                    const game = new ReversiSingleTree_1.default(heuristic);
                    //const root = game.buildMinimaxTree(13);
                    const timeBuild2 = Date.now();
                    console.log(`Minimax tree created in ${timeBuild2 - timeBuild1}`);
                    const time1 = Date.now();
                    const simulation_result = game.playSimulation(Number.parseInt(depth));
                    const time2 = Date.now();
                    console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins (${simulation_result[2]} : ${simulation_result[3]})) in ${time2 - time1}:`);
                }
                else if (mode == "2") {
                    console.log("Reversi da drzewie - Podaj tablicę");
                    let inputString = yield getCLIBoardInput();
                    console.log("WPROWADZONA TABLICA:");
                    console.log(inputString + "\n");
                    const timeBuild1 = Date.now();
                    //const minimaxTreeRoot = new MinimaxNode();
                    const game = new ReversiSingleTree_1.default(inputString);
                    //const root = game.buildMinimaxTree(13);
                    const timeBuild2 = Date.now();
                    console.log(`Minimax tree created in ${timeBuild2 - timeBuild1}`);
                    const time1 = Date.now();
                    const simulation_result = game.playSimulation(Number.parseInt(depth));
                    const time2 = Date.now();
                    console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins (${simulation_result[2]} : ${simulation_result[3]})) in ${time2 - time1}:`);
                }
                else if (mode == "3") {
                    const game = new Reversi_1.default(heuristic);
                    console.log("stworzone");
                    const time1 = Date.now();
                    const simulation_result = game.playSimulation(Number.parseInt(depth));
                    const time2 = Date.now();
                    //console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
                    console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins (${simulation_result[2]} : ${simulation_result[3]})) in ${time2 - time1}:`);
                }
                else if (mode == "4") {
                    console.log("Reversi bez optymalizacji - Podaj tablicę");
                    let inputString = yield getCLIBoardInput();
                    console.log("WPROWADZONA TABLICA:");
                    console.log(inputString + "\n");
                    const game = new Reversi_1.default(heuristic, inputString);
                    const time1 = Date.now();
                    const simulation_result = game.playSimulation(Number.parseInt(depth));
                    const time2 = Date.now();
                    console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
                }
                else if (mode == "5") {
                }
            }
            catch (e) {
                console.error(e.message);
            }
        }
    });
}
// async function main() {
//     interactive()
// }
// main()
//import ReversiOptimized from "./ReversiOptimized";
const ReversiSingleTree_1 = __importDefault(require("./ReversiSingleTree"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        interactive();
    });
}
main();
