var H =1; 
var V =2;

var gbl_player = [];
var timepassed = 0;
gbl_player[H] = [];
gbl_player[V] = [];



function gamecontrol() {
    this.poss_descr = "Home";
    this.poss_nbr = 1
    this.poss_nbr_def = 2;
    this.homescore = 0;
    this.visitorscore = 0;
    this.current_ballhandler = 0;
    this.previous_ballhandler = 1;
};

var game = new gamecontrol();


function person(pname, jersey_nbr, position, shot_rate, def_rate, points) {
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
    this.blocks=0;
};

person.prototype.shoot = function(shot_value) {
	var shot_nbr = Math.floor((Math.random() * 100) + 1);
	
	var loc_def = gbl_player[game.poss_nbr_def][game.current_ballhandler].def_rate;
	var loc_shot_rate = this.shot_rate - loc_def;



	if (shot_nbr <= this.shot_rate) {
		//make
		var loc_announce = "<p>" + this.pname + " makes a " + shot_value + ".["+ shot_nbr +"] (" + loc_shot_rate + " = " + this.shot_rate + "-" + loc_def + ") </p>";
		$( "#Announcer" ).append(loc_announce);
		MakeBasket(shot_value);

	} else { 
		//miss
		var loc_announce = "<p>" + this.pname + " misses a " + shot_value + ".["+ shot_nbr +"] (" + loc_shot_rate + " = " + this.shot_rate + "-" + loc_def + ") </p>";
		$( "#Announcer" ).append(loc_announce);
		
		gbl_player[game.poss_nbr][game.current_ballhandler].fga += 1;
		ChangePossession();
	}
};



gbl_player[H][1] = new person("Bill",1 ,"G", 80, 1)
gbl_player[H][2] = new person("Bob",2,"G/F", 70, 2)
gbl_player[H][3] = new person("Ben",3,"F", 65, 3)
gbl_player[H][4] = new person("Brad",4,"F/C", 60, 4)
gbl_player[H][5] = new person("Bjorn",5,"C", 75, 5)

gbl_player[V][1] = new person("Timmy",6,"G", 75, 2)
gbl_player[V][2] = new person("Tommy",7,"G", 75, 2)
gbl_player[V][3] = new person("Jimmy",8,"F", 60, -4)
gbl_player[V][4] = new person("Johnny",9,"F/C", 65, -4)
gbl_player[V][5] = new person("Hobie",10,"F/C", 50, -8)


$("#btn1").click(function(){


	InboundPass(1);
	$("#btn1").prop("disabled",true);
	$("#btn2").prop("disabled",false);
	$("#btn3").prop("disabled",false);

});

$('#btn2').click(function(){
	//$( "#Announcer" ).append("<p>wrong button stupid</p>");

	var pass_to;

	//loop to ensure current ballhandler cant pass to himself.
	do {
		pass_to = Math.floor((Math.random() * 5) + 1);
	} while (pass_to == game.current_ballhandler);

	MakePass(pass_to);


	UpdateClock();


});

$('#btn3').click(function(){
	gbl_player[game.poss_nbr][game.current_ballhandler].shoot(2);
});

function MakePass(to_player) {
	
	var loc_announce = "<p>" + game.current_ballhandler + " passes to # " + to_player + "</p>";
	$( "#Announcer" ).append(loc_announce);	


	//clear previous last ball handler 
	if (game.previous_ballhandler != 0) {
		gbl_player[game.poss_nbr][game.previous_ballhandler].haveball = "no";
	}

	//update new ball handler variables
	game.previous_ballhandler = game.current_ballhandler;
	game.current_ballhandler = to_player;

	//set the passer to be the previous ballhandler
	gbl_player[game.poss_nbr][game.previous_ballhandler].haveball = "prev";
	//update person object properties
	gbl_player[game.poss_nbr][to_player].haveball = "yes";

	UpdateScoreboard();


};


function InboundPass(to_player) {
	var loc_announce = "<p>Inbound pass to # " + to_player + "</p>";
	$( "#Announcer" ).append(loc_announce);	

	//update game object properties
	game.previous_ballhandler = game.current_ballhandler;
	game.current_ballhandler = to_player;
	
	//update person object properties
	gbl_player[game.poss_nbr][to_player].haveball = "yes";

	UpdateScoreboard();


};

function MakeBasket(loc_value) {
	
	//give credit to scoring player
	gbl_player[game.poss_nbr][game.current_ballhandler].points += loc_value;
	gbl_player[game.poss_nbr][game.current_ballhandler].fgm += 1;
	gbl_player[game.poss_nbr][game.current_ballhandler].fga += 1;

	//give credit to assisting passer
	//add code here

	//give credit to scoring team 
	if (game.poss_descr == "Home") { //if home team scores
		game.homescore += loc_value;
	} else {   // if visitor scores
		game.visitorscore += loc_value;
		}

	UpdateScoreboard();
	ChangePossession();

};

function ChangePossession() {
	//clear ballhandler variables
	gbl_player[game.poss_nbr][game.current_ballhandler].haveball = "no";
	if (game.previous_ballhandler != 0) {
		gbl_player[game.poss_nbr][game.previous_ballhandler].haveball = "no";
	}
	game.current_ballhandler = 0;
	game.previous_ballhandler = 0;


	if (game.poss_descr == "Home") {
		//set offensive possession to be vistor team and home team is on defense
		game.poss_descr = "Visitor";
		game.poss_nbr = 2;
		game.poss_nbr_def = 1;
	} else {   //if visitor
		//set offensive possession to be home team and visitors are on defense
		game.poss_descr = "Home"
		game.poss_nbr = 1;
		game.poss_nbr_def = 2;
	}

	UpdateScoreboard();
	//announce possesion
	var loc_announce = "<p>" + game.poss_descr + " team now has the ball.</p>"
	$( "#Announcer" ).append(loc_announce);

	//set buttons for initial pass only
	$("#btn1").prop("disabled",false);
	$("#btn2").prop("disabled",true);
	$("#btn3").prop("disabled",true);	

};


function UpdateScoreboard() {
	$('#Poss').text("Poss: " + game.poss_descr);
	$('#HomeScore').text("Home: " + game.homescore);
	$('#VisitorScore').text("Visitor: " + game.visitorscore);
	UpdatePlayerBoard();
};


function UpdatePlayerBoard() {
	for (i = 1; i<=2; i++){
		var loc_flag;
		if (i == 1) {
			loc_flag = "H";
		} else {
			loc_flag = "V";
		}
		for (j=1; j<=5; j++){
					var idname = "#" + loc_flag + j + "Name"
					var str_ball = "";
					//alert(gbl_player[i][j].def_rate)
					if (gbl_player[i][j].haveball == "yes") {
						//have ball
						str_ball = "*";
					} else if (gbl_player[i][j].haveball == "no") { 
						// doesnt have ball
						str_ball = "";
					} else if (gbl_player[i][j].haveball == "prev") { 
						// last to touch
						str_ball = "-";
					}
					$("#" + loc_flag + j + "Ball").text(str_ball);
					$("#" + loc_flag + j + "Name").text(gbl_player[i][j].pname);
					$("#" + loc_flag + j + "Nbr").text(gbl_player[i][j].jersey_nbr);
					$("#" + loc_flag + j + "Pos").text(gbl_player[i][j].position);
					$("#" + loc_flag + j + "Shot").text(gbl_player[i][j].shot_rate);
					$("#" + loc_flag + j + "Def").text(gbl_player[i][j].def_rate);
					$("#" + loc_flag + j + "Fg").text(gbl_player[i][j].fgm + "/" + gbl_player[i][j].fga);
					$("#" + loc_flag + j + "Tp").text(gbl_player[i][j].tpm + "/" + gbl_player[i][j].tpa);
					$("#" + loc_flag + j + "Ast").text(gbl_player[i][j].assists);
					$("#" + loc_flag + j + "Reb").text(gbl_player[i][j].rebounds);
					$("#" + loc_flag + j + "Blk").text(gbl_player[i][j].blocks);
					$("#" + loc_flag + j + "Steals").text(gbl_player[i][j].steals);
					$("#" + loc_flag + j + "Pts").text(gbl_player[i][j].points);
		}
		
	}
};	

function UpdateClock() {
	timepassed += 4;
	var loc_minutes = Math.floor(timepassed /60);
	var loc_seconds = timepassed - (loc_minutes * 60)

	if (loc_minutes == 0 ) {
		loc_minutes = "00";
	}
	if (loc_seconds == 0 ) {
		loc_seconds = "00";
	}
	if (loc_seconds == 4 ) {
		loc_seconds = "04";
	}
	if (loc_seconds == 8 ) {
		loc_seconds = "08";
	}

	$('#TheClock').text(loc_minutes + ":" + loc_seconds);



};
	


function Main() {
	UpdateScoreboard();
	$("#btn1").prop("disabled",false);
	$("#btn2").prop("disabled",true);
	$("#btn3").prop("disabled",true);

};

Main();