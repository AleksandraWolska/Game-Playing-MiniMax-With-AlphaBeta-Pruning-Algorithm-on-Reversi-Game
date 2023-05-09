import Reversi from "./Reversi";
import ReversiOptimized from "./ReversiOptimized";


import readline from 'readline';



const heuristicMode = {
    PIECES_AMOUNT: "pieces_amount",
    CORNER_AMOUNT: "corners_amount",
    AVAILABLE_MOVES_AMOUNT: "available_moves_amount",
}

//const HEURISTIC = heuristicMode.PIECES_AMOUNT
function getUserInput(promptText: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer as string);
        });
    });
}

async function getCLIBoardInput(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let inputString = ""
    return new Promise((resolve) => {

        let counter = 0
        rl.on('line', (line) => {
            inputString += line.trim() + '\n';
            counter++
            if (counter == 8) {
                rl.close();
                resolve(inputString.trim() as string);
            }
        })
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


async function interactive(): Promise<void> {
     while (true) {
    try {
        console.log("REVERSI GAME:");
        let depth = await getUserInput("Podaj głębokość przeszukiwania:");
        let heuristic =  await getUserInput("1 - Różnica ilości pionków\n2 - Ilośc pionków na rogach\n3 - Ilośc dostepnych ruchów\n");
        heuristic = heuristic == "1" ? heuristicMode.PIECES_AMOUNT : heuristic == "2" ? heuristicMode.CORNER_AMOUNT : heuristicMode.AVAILABLE_MOVES_AMOUNT
          

        let mode = await getUserInput("Podaj tryb gry:\n1 - Reversi na drzewie - ustawienie początkowe\n2Reversi na drzewie - wprowadź tablicę\n3 - Reversi - ustawienie początkowe\n4Reversi - wprowadź tablicę\n");


        if (mode == "1") {
            const timeBuild1 = Date.now();
            const minimaxTreeRoot = new MinimaxNode();
            const game = new ReversiSingleTree(minimaxTreeRoot, heuristic);
            //const root = game.buildMinimaxTree(13);
            const timeBuild2 = Date.now();

            console.log(`Minimax tree created in ${timeBuild2 - timeBuild1}`);
            const time1 = Date.now();
            const simulation_result = game.playSimulation(Number.parseInt(depth));
            const time2 = Date.now();
            console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins (${simulation_result[2]} : ${simulation_result[3]})) in ${time2 - time1}:`);

            

        } else if (mode == "2") {

            
            console.log("Reversi da drzewie - Podaj tablicę")
            let inputString = await getCLIBoardInput();
            console.log("WPROWADZONA TABLICA:")
            console.log(inputString + "\n")

    
            const timeBuild1 = Date.now();
            const minimaxTreeRoot = new MinimaxNode();
            const game = new ReversiSingleTree(minimaxTreeRoot, inputString);
            //const root = game.buildMinimaxTree(13);
            const timeBuild2 = Date.now();

            console.log(`Minimax tree created in ${timeBuild2 - timeBuild1}`);
            const time1 = Date.now();
            const simulation_result = game.playSimulation(Number.parseInt(depth));
            const time2 = Date.now();
            console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins (${simulation_result[2]} : ${simulation_result[3]})) in ${time2 - time1}:`);
           
        
           
        }

        else if (mode == "3") {

            const game = new Reversi(heuristic);
            console.log("stworzone")
            const time1 = Date.now()
            const simulation_result = game.playSimulation(Number.parseInt(depth));
            const time2 = Date.now()
            //console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
            console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins (${simulation_result[2]} : ${simulation_result[3]})) in ${time2 - time1}:`);
            

        }



        else if (mode == "4") {

            console.log("Reversi bez optymalizacji - Podaj tablicę")
            let inputString = await getCLIBoardInput();
            console.log("WPROWADZONA TABLICA:")
            console.log(inputString + "\n")

            const game = new Reversi(heuristic, inputString);
            const time1 = Date.now()
            const simulation_result = game.playSimulation(Number.parseInt(depth));
            const time2 = Date.now()
            console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);
        
        }



        else if (mode == "5") {


        }
    } catch (e) {
        console.error(e.message)
    }
}
}





// async function main() {

//     interactive()
// }

// main()




//import ReversiOptimized from "./ReversiOptimized";

import ReversiSingleTree, { MinimaxNode } from "./ReversiSingleTree";


async function main() {
    interactive()
}

main()

