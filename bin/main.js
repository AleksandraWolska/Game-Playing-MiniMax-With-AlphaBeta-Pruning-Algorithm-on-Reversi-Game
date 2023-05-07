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
const ReversiOptimized_1 = __importDefault(require("./ReversiOptimized"));
const readline_1 = __importDefault(require("readline"));
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
//                 const simulation_result = game.playSimulation(3);
//                 const time2 = Date.now()
//                 console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
//             } else if (mode == "1") {
//                 const game = new Reversi();
//                 const time1 = Date.now()
//                 const simulation_result = game.playSimulation(3);
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
                let mode = yield getUserInput("1 - ustawienie początkowe\n2-wprowadź tablicę");
                if (mode == "2") {
                    console.log("Podaj tablicę");
                    let inputString = yield getCLIBoardInput();
                    console.log("input stringL");
                    console.log(inputString);
                    const game = new ReversiOptimized_1.default(inputString);
                    const time1 = Date.now();
                    const simulation_result = game.playSimulation(6);
                    const time2 = Date.now();
                    console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
                }
                else if (mode == "1") {
                    const game = new ReversiOptimized_1.default();
                    const time1 = Date.now();
                    const simulation_result = game.playSimulation(6);
                    const time2 = Date.now();
                    console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
                }
            }
            catch (e) {
                console.error(e.message);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        interactive();
    });
}
main();
