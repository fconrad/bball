// Use constants for Home and Visitor teams for better readability
const HOME = 1;
const VISITOR = 2;

// Global variables
let players = { [HOME]: [], [VISITOR]: [] };
let timePassed = 0;

// Game control class to manage game state
class GameControl {
    constructor() {
        this.possessionTeam = HOME;
        this.defendingTeam = VISITOR;
        this.homeScore = 0;
        this.visitorScore = 0;
        this.currentBallHandler = null;
        this.previousBallHandler = null;
    }

    changePossession() {
        // Clear current ball handler's possession
        if (this.currentBallHandler !== null) {
            players[this.possessionTeam][this.currentBallHandler].haveBall = false;
        }

        // Swap possession
        [this.possessionTeam, this.defendingTeam] = [this.defendingTeam, this.possessionTeam];
        this.currentBallHandler = null;
        this.previousBallHandler = null;
        
        this.updateScoreboard();
        this.announce(`${this.getPossessionDescription()} team now has the ball.`);
    }

    getPossessionDescription() {
        return this.possessionTeam === HOME ? "Home" : "Visitor";
    }

    updateScoreboard() {
        $('#Poss').text(`Poss: ${this.getPossessionDescription()}`);
        $('#HomeScore').text(`Home: ${this.homeScore}`);
        $('#VisitorScore').text(`Visitor: ${this.visitorScore}`);
        updatePlayerBoard();
    }

    announce(message) {
        $("#Announcer").prepend(`<p>${message}</p>`);
    }

    turnover() {
        this.announce(`${this.getPossessionDescription()} team commits a turnover.`);
        this.changePossession();
    }
}

let game = new GameControl();

// Player class to manage individual player attributes
class Player {
    /**
     * @param {string} name - The name of the player.
     * @param {number} jerseyNumber - The jersey number of the player.
     * @param {string} position - The position of the player (e.g., G, F, C).
     * @param {number} shotRate - The shooting ability of the player (higher is better).
     * @param {number} defenseRate - The defensive ability of the player (higher is better).
     * @param {number} dribbleRate - The dribbling ability of the player (higher is better).
     * @param {number} passRate - The passing ability of the player (higher is better).
     */
    constructor(name, jerseyNumber, position, shotRate, defenseRate, dribbleRate, passRate) {
        this.name = name;
        this.jerseyNumber = jerseyNumber;
        this.position = position;
        this.shotRate = shotRate;
        this.defenseRate = defenseRate;
        this.dribbleRate = dribbleRate;
        this.passRate = passRate;
        this.points = 0;
        this.fieldGoalsAttempted = 0;
        this.fieldGoalsMade = 0;
        this.assists = 0;
        this.rebounds = 0;
        this.steals = 0;
        this.blocks = 0;
        this.haveBall = false;
    }

    shoot(shotValue) {
        const shotChance = Math.floor(Math.random() * 100) + 1;
        const defense = players[game.defendingTeam][game.currentBallHandler]?.defenseRate || 0;
        const adjustedShotRate = this.shotRate - defense;

        if (shotChance <= adjustedShotRate) {
            // Make the shot
            game.announce(`${this.name} makes a ${shotValue}-point shot. [${shotChance}] (Shot Rate: ${adjustedShotRate})`);
            this.makeBasket(shotValue);
        } else {
            // Miss the shot
            game.announce(`${this.name} misses a ${shotValue}-point shot. [${shotChance}] (Shot Rate: ${adjustedShotRate})`);
            this.fieldGoalsAttempted++;
            game.changePossession();
        }
    }

    makeBasket(points) {
        this.points += points;
        this.fieldGoalsMade++;
        this.fieldGoalsAttempted++;

        if (game.possessionTeam === HOME) {
            game.homeScore += points;
        } else {
            game.visitorScore += points;
        }

        game.updateScoreboard();
        game.changePossession();
    }
}


function initializePlayers() {
// Initialize players for both teams
// Parameters: name, jerseyNumber,position,shotRate,defenseRate,dribbleRate,passRate  
    players[HOME] = [
        new Player("Bill", 1, "G", 80, 1),
        new Player("Bob", 2, "G/F", 70, 2),
        new Player("Ben", 3, "F", 65, 3),
        new Player("Brad", 4, "F/C", 60, 4),
        new Player("Bjorn", 5, "C", 75, 5)
    ];

    players[VISITOR] = [
        new Player("Timmy", 6, "G", 75, 2, 70, 75),
        new Player("Tommy", 7, "G", 75, 2, 65, 70),
        new Player("Jimmy", 8, "F", 60, -4, 60, 65),
        new Player("Johnny", 9, "F/C", 65, -4, 55, 60),
        new Player("Hobie", 10, "F/C", 50, -8, 50, 55)
    ];
}

// Event handlers for buttons
$("#btn1").click(function() {
    inboundPass(0);
    $("#btn1").prop("disabled", true);
    $("#btn2, #btn3").prop("disabled", false);
});

$('#btn2').click(function() {
    let passTo;
    do {
        passTo = Math.floor(Math.random() * 5);
    } while (passTo === game.currentBallHandler);
    
    const ballHandler = players[game.possessionTeam][game.currentBallHandler];
    const defender = players[game.defendingTeam][game.currentBallHandler];
    const passChance = Math.floor(Math.random() * 100) + 1;
    const adjustedPassRate = ballHandler.passRate - defender.defenseRate;

    if (passChance > adjustedPassRate) {
        game.announce(`${ballHandler.name}'s pass is intercepted by ${defender.name}!`);
game.turnover();
    } else {
        makePass(passTo);
        updateClock();
    }
});

$('#btn3').click(function() {
    const ballHandler = players[game.possessionTeam][game.currentBallHandler];
    const defender = players[game.defendingTeam][game.currentBallHandler];
    const dribbleChance = Math.floor(Math.random() * 100) + 1;

    if (dribbleChance < (defender.defenseRate - ballHandler.dribbleRate + 50)) {
        game.announce(`${defender.name} steals the ball from ${ballHandler.name} during dribbling!`);
game.turnover();
    } else {
        ballHandler.shoot(2);
    }
});

// Function to handle an inbound pass
function inboundPass(toPlayer) {
    game.announce(`Inbound pass to #${players[game.possessionTeam][toPlayer].jerseyNumber}`);
    game.previousBallHandler = null;
    game.currentBallHandler = toPlayer;
    players[game.possessionTeam][toPlayer].haveBall = true;
    game.updateScoreboard();
}

// Function to handle making a pass
function makePass(toPlayer) {
    game.announce(`${players[game.possessionTeam][game.currentBallHandler].name} passes to #${players[game.possessionTeam][toPlayer].jerseyNumber}`);

    // Clear possession from previous ball handler
    if (game.currentBallHandler !== null) {
        players[game.possessionTeam][game.currentBallHandler].haveBall = false;
    }

    // Update possession
    game.previousBallHandler = game.currentBallHandler;
    game.currentBallHandler = toPlayer;
    players[game.possessionTeam][toPlayer].haveBall = true;

    game.updateScoreboard();
}

// Function to update the player board UI
function updatePlayerBoard() {
    for (const team in players) {
        const teamFlag = team === "1" ? "H" : "V";
        players[team].forEach((player, index) => {
            const idPrefix = `#${teamFlag}${index + 1}`;
            $(idPrefix + "Name").text(player.name);
            $(idPrefix + "Nbr").text(player.jerseyNumber);
            $(idPrefix + "Pos").text(player.position);
            $(idPrefix + "Shot").text(player.shotRate);
            $(idPrefix + "Def").text(player.defenseRate);
            $(idPrefix + "Fg").text(`${player.fieldGoalsMade}/${player.fieldGoalsAttempted}`);
            $(idPrefix + "Ast").text(player.assists);
            $(idPrefix + "Reb").text(player.rebounds);
            $(idPrefix + "Blk").text(player.blocks);
            $(idPrefix + "Steals").text(player.steals);
            $(idPrefix + "Pts").text(player.points);
            $(idPrefix + "Ball").text(player.haveBall ? "*" : "");
        });
    }
}

// Function to update the clock
function updateClock() {
    timePassed += 4;
    const minutes = String(Math.floor(timePassed / 60)).padStart(2, '0');
    const seconds = String(timePassed % 60).padStart(2, '0');
    $('#TheClock').text(`${minutes}:${seconds}`);
}

// Main function to initialize the game
function main() {
    initializePlayers();
    game.updateScoreboard();
    $("#btn1").prop("disabled", false);
    $("#btn2, #btn3").prop("disabled", true);
}

$(document).ready(main);
