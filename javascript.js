function refresh_screen(){
	data_container = $(".data-container");
	data_container.html("");
	for(var i = 0; i < data.length; i++){
		var value = '';
		if(data[i] == undefined){
			value = '/';
		}else{
			value = data[i];
		}
		data_container.append('<div id="i' + i + '" class="data-bit ' + (i == data_pointer ? 'data-selected' : '') + '">' + value + '</div>');
	}
	
	$(".data-bit").click(function(){
		if(!isRunning){
		var id = this.id.substring(1);
		if(data[id] == undefined)
			data[id] = 1;
		else if(data[id] == 1)
			data[id] = 0;
		else if(data[id] == 0)
			data[id] = undefined;
		refresh_screen();
		}
	});
	
	program_container_row1 = $(".row-1");
	program_container_row1.html("");
	for(var i = 0; i < 20; i++){
		if(program[i] == undefined)
			value = '_';
		else if(program[i].type == SHIFT){
			if(program[i].extra.direction == LEFT)
				value = '‹';
			else if(program[i].extra.direction == RIGHT)
				value = '›';
		}
		else if(program[i].type == SET){
			value = program[i].extra.value;
		}
		else if(program[i].type == JUMP){
			value = 'J';
		}
		else if(program[i].type == IF){
			value = '?' + (program[i].extra.condition == undefined ? '_' : program[i].extra.condition);
		}
		
		program_container_row1.append('<div id="i' + i + '" class="path ' + (i == program_pointer ? 'path-selected' : '') + '">' + value + '</div>');
	}
	
	program_container_row2 = $(".row-2");
	program_container_row2.html("");
	for(var i = 30; i < 50; i++){
		if(program[i] == undefined)
			value = '_';
		else if(program[i].type == SHIFT){
			if(program[i].extra.direction == LEFT)
				value = '‹';
			else if(program[i].extra.direction == RIGHT)
				value = '›';
		}
		else if(program[i].type == SET){
			value = program[i].extra.value;
		}
		else if(program[i].type == JUMP){
			value = 'J';
		}
		else if(program[i].type == IF){
			value = '?' + (program[i].extra.condition == undefined ? '_' : program[i].extra.condition);
		}
		program_container_row2.append('<div id="i' + i + '" class="path ' + (i == program_pointer ? 'path-selected' : '') + '">' + value + '</div>');
	}
	
	$(".path").click(function(){
		if(!isRunning){
		var id = this.id.substring(1);
		var command;
		if(selection == 0)
			command = new Command(SHIFT, {'direction':LEFT});
		if(selection == 1)
			command = new Command(SHIFT, {'direction':RIGHT});
		if(selection == 2)
			command = new Command(SET, {'value':1});
		if(selection == 3)
			command = new Command(SET, {'value':0});
		if(selection == 4)
			command = new Command(IF, {'condition':1});
		if(selection == 5)
			command = new Command(IF, {'condition':0});
		if(selection == 6)
			command = new Command(JUMP, {'dest':0});
		if(selection == 8)
			command = new Command(IF, {});
		program[id] = command;
		refresh_screen();
		}
	});
}	

$(document).ready(function(){
	refresh_screen();
	$(".play-button").click(function(){
		if(!isRunning){
		isRunning = true;
		data_pointer = 0;
		program_pointer = 0;
		$(".console").html("Running");
		run();
		}
	});
	$(".command-button").click(function(){
		var id = this.id.substring(1);
		selection = id;
		$(".command-button").attr("class", 'button command-button');
		$(this).attr('class', 'button command-button command-button-selected');
	});
});

var isRunning = false;
var data = new Array(24);


//Two lines, 20 spaces each
//0-19 and 30-49
var program = new Array();

var LEFT = 0, RIGHT = 1, DOWN = 2, UP = 3;

var selection = 0;
//Each command has a type and an extra json descripter
//---SHIFT---
//extra.direction
var SHIFT = 0;

//---SET---
//extra.value
var SET = 1;

//---IF---
//extra.condition
var IF = 2;

//---JUMP---
//extra.dest
var JUMP = 3;

//---Clear---
var CLEAR = 4;


var data_pointer = 0;
var program_pointer = 0;

function Command(type, extra){
	this.type = type;
	this.extra = extra;
}

function run(){
	refresh_screen();
	parse_program();
}

function parse_program(){
	if(program_pointer == 20 || program_pointer == 50){
		$(".console").html("Program Finished");
		isRunning = false;
	}else{
		var command = program[program_pointer];
		//No command set here
		if(command == undefined){
			program_pointer++;
		}else{
			var extra = command.extra;
			
			//Shift data
			if(command.type == SHIFT){
				program_pointer++;
				if(extra.direction == LEFT){
					data_pointer--;
					if(data_pointer == -1){
						data_pointer = 0;
					}
				}else if(extra.direction == RIGHT){
					data_pointer++;
					if(data_pointer == 24){
						data_pointer = 23;
					}
				}
			}
			
			//Set data
			if(command.type == SET){
				program_pointer++;
				data[data_pointer] = extra.value;
			}
			
			//If
			if(command.type == IF){
				var condition = extra.condition;
				if(data[data_pointer] == condition){
					if(program_pointer >= 0 && program_pointer <= 19)
						program_pointer += 30;
					else if(program_pointer >= 30 && program_pointer <= 49)
						program_pointer -= 30;
				}else{
					program_pointer++;
				}
			}
			
			//Jump
			if(command.type == JUMP){
				var destination = extra.dest;
				program_pointer = destination;
			}
		}
		
		setTimeout('run()', 100);
	}
}

