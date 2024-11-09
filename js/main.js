var H = 1;
var V = 2;

var gbl_player = [[], []];
var timepassed = 0;
gbl_player[H] = [];
gbl_player[V] = [];

class GameControl {
    constructor() {
        this.poss_descr = "Home";
        this.poss_nbr = 1;
        this.poss_nbr_def = 2;
        this.homescore = 0;
        this.visitorscore = 0;
        this.current_ballhandler = 0;
        this.previous_ballhandler = 1;
    }
}

var game = new GameControl();

class Person {
    constructor(pname, jersey_nbr, position, shot_rate, def_rate) {
        this.pname = pname;
        this.jersey_nbr = jersey_nbr;
        this.position = position;
        this.haveball = "no";
        this.shot_rate = shot_rate;
        this.def_rate = def_rate;
        this.points = 0;
        this.fga = 0;
        this.fgm = 0;
        this.tpa = 0;
        this.tpm = 0;
        this.assists = 0;
        this.rebounds = 0;
        this.steals = 0;
        this.blocks = 0;
    }

    shoot(shot_value) {
        let shot_nbr = Math.floor((Math.random() * 100) + 1);
        let loc_def = gbl_player[game.poss_nbr_def][game.current_ballhandler].def_rate;
        let loc_shot_rate = this.shot_rate - loc_def;

        if (shot_nbr <= this.shot_rate) {
            let loc_announce = `<p>${this.pname} makes a ${shot_value}.[${shot_nbr}] (${loc_shot_rate} = ${this.shot_rate}-${loc_def}) </p>`;
            $("#Announcer").append(loc_announce);
            MakeBasket(shot_value);
        } else {
            let loc_announce = `<p>${this.pname} misses a ${shot_value}.[${shot_nbr}] (${loc_shot_rate} = ${this.shot_rate}-${loc_def}) </p>`;
            $("#Announcer").append(loc_announce);
            gbl_player[game.poss_nbr][game.current_ballhandler].fga += 1;
            ChangePossession();
        }
    }
}

gbl_player[H][1] = new Person("Bill", 1, "G", 80, 1);
gbl_player[H][2] = new Person("Bob", 2, "G/F", 70, 2);
gbl_player[H][3] = new Person("Ben", 3, "F", 65, 3);
gbl_player[H][4] = new Person("Brad", 4, "F/C", 60, 4);
gbl_player[H][5] = new Person("Bjorn", 5, "C", 75, 5);

gbl_player[V][1] = new Person("Timmy", 6, "G", 75, 2);
gbl_player[V][2] = new Person("Tommy", 7, "G", 75, 2);
gbl_player[V][3] = new Person("Jimmy", 8, "F", 60, -4);
gbl_player[V][4] = new Person("Johnny", 9, "F/C", 65, -4);
gbl_player[V][5] = new Person("Hobie", 10, "F/C", 50, -8);

$("#btn1").click(function() {
    InboundPass(1);
    $("#btn1").prop("disabled", true);
    $("#btn2").prop("disabled", false);
    $("#btn3").prop("disabled", false);
});

$("#btn2").click(function() {
    let pass_to;
    do {
        pass_to = Math.floor((Math.random() * 5) + 1);
    } while (pass_to == game.current_ballhandler);

    MakePass(pass_to);
    UpdateClock();
});

$("#btn3").click(function() {
    gbl_player[game.poss_nbr][game.current_ballhandler].shoot(2);
});

function MakePass(to_player) {
    let loc_announce = `<p>${game.current_ballhandler} passes to # ${to_player}</p>`;
    $("#Announcer").append(loc_announce);

    if (game.previous_ballhandler != 0) {
        gbl_player[game.poss_nbr][game.previous_ballhandler].haveball = "no";
    }

    game.previous_ballhandler = game.current_ballhandler;
    game.current_ballhandler = to_player;

    gbl_player[game.poss_nbr][game.previous_ballhandler].haveball = "prev";
    gbl_player[game.poss_nbr][to_player].haveball = "yes";

    UpdateScoreboard();
}

function InboundPass(to_player) {
    let loc_announce = `<p>Inbound pass to # ${to_player}</p>`;
    $("#Announcer").append(loc_announce);

    game.previous_ballhandler = game.current_ballhandler;
    game.current_ballhandler = to_player;

    gbl_player[game.poss_nbr][to_player].haveball = "yes";

    UpdateScoreboard();
}

function MakeBasket(loc_value) {
    gbl_player[game.poss_nbr][game.current_ballhandler].points += loc_value;
    gbl_player[game.poss_nbr][game.current_ballhandler].fgm += 1;
    gbl_player[game.poss_nbr][game.current_ballhandler].fga += 1;

    if (game.poss_descr == "Home") {
        game.homescore += loc_value;
    } else {
        game.visitorscore += loc_value;
    }

    UpdateScoreboard();
    ChangePossession();
}

function ChangePossession() {
    gbl_player[game.poss_nbr][game.current_ballhandler].haveball = "no";
    if (game.previous_ballhandler != 0) {
        gbl_player[game.poss_nbr][game.previous_ballhandler].haveball = "no";
    }
    game.current_ballhandler = 0;
    game.previous_ballhandler = 0;

    if (game.poss_descr == "Home") {
        game.poss_descr = "Visitor";
        game.poss_nbr = 2;
        game.poss_nbr_def = 1;
    } else {
        game.poss_descr = "Home";
        game.poss_nbr = 1;
        game.poss_nbr_def = 2;
    }

    UpdateScoreboard();
    let loc_announce = `<p>${game.poss_descr} team now has the ball.</p>`;
    $("#Announcer").append(loc_announce);

    $("#btn1").prop("disabled", false);
    $("#btn2").prop("disabled", true);
    $("#btn3").prop("disabled", true);
}

function UpdateScoreboard() {
    $("#Poss").text(`Poss: ${game.poss_descr}`);
    $("#HomeScore").text(`Home: ${game.homescore}`);
    $("#VisitorScore").text(`Visitor: ${game.visitorscore}`);
    UpdatePlayerBoard();
}

function UpdatePlayerBoard() {
    for (let i = 1; i <= 2; i++) {
        let loc_flag = (i == 1) ? "H" : "V";
        for (let j = 1; j <= 5; j++) {
            let str_ball = (gbl_player[i][j].haveball == "yes") ? "*" : (gbl_player[i][j].haveball == "prev") ? "-" : "";
            $(`#${loc_flag}${j}Ball`).text(str_ball);
            $(`#${loc_flag}${j}Name`).text(gbl_player[i][j].pname);
            $(`#${loc_flag}${j}Nbr`).text(gbl_player[i][j].jersey_nbr);
            $(`#${loc_flag}${j}Pos`).text(gbl_player[i][j].position);
            $(`#${loc_flag}${j}Shot`).text(gbl_player[i][j].shot_rate);
            $(`#${loc_flag}${j}Def`).text(gbl_player[i][j].def_rate);
            $(`#${loc_flag}${j}Fg`).text(`${gbl_player[i][j].fgm}/${gbl_player[i][j].fga}`);
            $(`#${loc_flag}${j}Tp`).text(`${gbl_player[i][j].tpm}/${gbl_player[i][j].tpa}`);
            $(`#${loc_flag}${j}Ast`).text(gbl_player[i][j].assists);
            $(`#${loc_flag}${j}Reb`).text(gbl_player[i][j].rebounds);
            $(`#${loc_flag}${j}Blk`).text(gbl_player[i][j].blocks);
            $(`#${loc_flag}${j}Steals`).text(gbl_player[i][j].steals);
            $(`#${loc_flag}${j}Pts`).text(gbl_player[i][j].points);
        }
    }
}

function UpdateClock() {
    timepassed += 4;
    let loc_minutes = String(Math.floor(timepassed / 60)).padStart(2, '0');
    let loc_seconds = String(timepassed % 60).padStart(2, '0');

    $('#TheClock').text(`${loc_minutes}:${loc_seconds}`);
}

function Main() {
    UpdateScoreboard();
    $("#btn1").prop("disabled", false);
    $("#btn2").prop("disabled", true);
    $("#btn3").prop("disabled", true);
}

Main();
