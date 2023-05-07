import Reversi from "./Reversi";


import readline from 'readline';

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


async function interactive(): Promise<void> {
    while (true) {
        try {
            console.log("REVERSI GAME:");

            let mode = await getUserInput("1 - ustawienie początkowe\n2-wprowadź tablicę");

            if (mode == "2") {
                console.log("Podaj tablicę")
                let inputString = await getCLIBoardInput();
                console.log("input stringL")
                console.log(inputString)

                const game = new Reversi(inputString);
                const time1 = Date.now()
                const simulation_result = game.playSimulation(5);
                const time2 = Date.now()
                console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);

            } else if (mode == "1") {

                const game = new Reversi();
                const time1 = Date.now()
                const simulation_result = game.playSimulation(5);
                const time2 = Date.now()
                console.log(`\nFinal board after ${simulation_result[0]} rounds (player ${simulation_result[1]} wins) in ${time2 - time1}:`);

            }

        }catch (e) {
            console.error(e.message)
        }
}
}




async function main() {

    interactive()
}

main()
