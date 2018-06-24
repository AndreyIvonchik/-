'use strict';
class Sapper {

	play (count){
		var width;
		var height;
		var bombs;
		var display = document.getElementById("settings").style.display = 'none';
		switch(count) {
			
			case 1: {
				width = 8;
				height = 8;
				bombs = 10;
				this.init({
						width, 
						height, 
						bombs
					});
				break;
			}
			
			case 2: {
				width = 16;
				height = 16;
				bombs = 40;
				this.init({
						width, 
						height, 
						bombs
					});
				break;
			}
			
			case 3: {
				width = 30;
				height = 16;
				bombs = 99;
				this.init({
						width, 
						height, 
						bombs
					});
				break;
			}
			
			case 4: {
				width = +document.getElementById("width").value ? +document.getElementById("width").value : 8 ;
				height = +document.getElementById("height").value ? +document.getElementById("height").value : 8;
				bombs = +document.getElementById("countMin").value ? +document.getElementById("countMin").value : Math.floor(width * height / 4);
			
				if(height * width  > bombs){
					this.init({
						width, 
						height, 
						bombs
					});
				}else{
					alert("Бомб не может быть больше количества ячеек");
				}
				break;
			}
			
		}
	}

	init (obj) {
		this.width = obj.width ; 
		this.height = obj.height; 
		this.bombs = obj.bombs;
		
		if(this.field){
			document.getElementById('table').innerHTML = null;
		}
		this.field = this.createMatrix();
		this.isEndOfGame = false;
		this.firstClick = true;
		
	}
	
	createCell(table, i, j) {
		var newDIV = document.createElement("div");
		
		newDIV.classList.add("cell");
		newDIV.id = i + "." + j;
		table.appendChild(newDIV);
		
		if (j + 1  === this.width) {
			table.appendChild(document.createElement("br"));
		}
	}
	
	createMatrix () {
		var table = document.getElementById('table');
		var matrix = [];

		table.classList.add("table");

		for (var i = 0; i < this.height; i++) {
			matrix[i] = [];
			
			for (var j = 0; j < this.width; j++) {
				matrix[i].push({
					bomb: false,
					open: false,
					flag: false,
					bombCounter: 0
				});
				this.createCell(table, i, j);
			}	
		}
		return matrix;
	}
	
	bombPositions(matrix, x, y) {
		var self = this;

		for (var b = 0; b < this.bombs; b++) {
			function bombOne() {
				var i = random(0, self.height -1);
				var j = random(0, self.width - 1);
				if (matrix[i][j].bomb || ( x == i && y == j)) {
					bombOne();
				} else {
					matrix[i][j].bomb = true;
				}
			}
			bombOne();
		}
		return matrix;
	}
	
	countBomb(matrix){
		for (var x = 0; x < this.height; x++) {
			for (var y = 0; y < this.width; y++) { 			
				if(matrix[x][y].bomb){
					if (this.checkОut(x - 1, y)) {
						matrix[x - 1][y].bombCounter++;
					}

					if (this.checkОut(x + 1, y)) {
						matrix[x + 1][y].bombCounter++;
					}
					
					if (this.checkОut(x - 1, y - 1)) {
						matrix[x - 1][y - 1].bombCounter++;
					}

					if (this.checkОut(x, y - 1)) {
						matrix[x][y - 1].bombCounter++;
					}

					if (this.checkОut(x + 1, y - 1)) {
						matrix[x + 1][y - 1].bombCounter++;
					}

					if (this.checkОut(x - 1, y + 1)) {
						matrix[x - 1][y + 1].bombCounter++; 
					}

					if (this.checkОut(x, y + 1)) {
						matrix[x][y + 1].bombCounter++;
					}

					if (this.checkОut(x + 1, y + 1)) {
						matrix[x + 1][y + 1].bombCounter++;
					}
				}
			}	
		}
		return matrix;
	}
	
	left_click(){
		if(this.isEndOfGame) return;

		var target = event.target; 
		var x = +target.id.split(".")[0];
		var y = +target.id.split(".")[1];

		if(target.className != "cell") return;
		if(this.firstClick){
			this.field = this.bombPositions(this.field, x, y);
			this.field = this.countBomb(this.field);
			this.firstClick = false;
		}
		this.openCell(x, y);
		this.checkForWin();
	}
	
	right_click(){
		event.preventDefault();
		if(this.isEndOfGame) return;

		var target = event.target;
		var x = +target.id.split(".")[0];
		var y = +target.id.split(".")[1];

		if(target.className != "cell") return;
		if(this.firstClick) return;
		if(this.field[x][y].open) return;
		if(this.field[x][y].flag){
			this.field[x][y].flag = false;
			target.style.backgroundImage = null;
		}else{
			this.field[x][y].flag = true;
			target.style.backgroundImage = "url(files/images/flag.png)";
		}
		this.checkForWin();
	}
	
	openCell(x, y){
		var element = document.getElementById(x + "." + y);

		if (this.field[x][y].open || this.field[x][y].flag){
			return;
		}

		if (this.field[x][y].bomb){
			element.style.backgroundColor="red";
			this.gameOver(false);
			return;
		}
		
		if (this.field[x][y].bombCounter){
			this.field[x][y].open = true;
			element.textContent = this.field[x][y].bombCounter;
			element.style.backgroundColor = 'silver';
			switch (this.field[x][y].bombCounter) {
				case 1:
					element.style.color = 'blue';
					break;
				case 2:
					element.style.color = 'green';
					break;
				case 3:
					element.style.color = 'red';
					break;
				case 4:
					element.style.color = 'dakrblue';
					break;
				case 5:
					element.style.color = 'indianred';
					break;
				case 6:
					element.style.color = 'navy';
					break;
				case 7:
					element.style.color = 'brown';
					break;
				case 8:
					element.style.color = 'grey';
					break;
				default:
					element.style.color = 'black';
			}
		} 
		
		if(!this.field[x][y].bombCounter){
			this.openEmptyCell(x, y);
			
		}
		
	}

	openEmptyCell(x, y){
		var element = document.getElementById(x + "." + y);

		this.field[x][y].open = true;
		element.style.backgroundColor = 'silver';

		if(this.checkОut(x + 1, y)){
			this.openCell(x + 1, y);
			if(this.checkОut(x, y + 1) && this.field[x][y + 1].bombCounter){
				this.openCell(x + 1, y + 1);
			}
		}
		
		if(this.checkОut(x - 1, y)){
			this.openCell(x - 1, y);
			if(this.checkОut(x, y - 1) && this.field[x][y - 1].bombCounter){
				this.openCell(x - 1, y - 1);
			}
		}

		if(this.checkОut(x, y + 1)){
			this.openCell(x, y + 1);
			if(this.checkОut(x - 1, y) && this.field[x - 1][y].bombCounter){
				this.openCell(x - 1, y + 1);
			}
			
		}

		if(this.checkОut(x, y - 1)){
			this.openCell(x, y - 1);
			if(this.checkОut(x + 1, y)  && this.field[x + 1][y].bombCounter){
				this.openCell(x + 1, y - 1);
			}
		}
	}

	openAllBombs(){
		for (var x = 0; x < this.height; x++) {
			for (var y = 0; y < this.width; y++) {
				if(this.field[x][y].bomb){
					document.getElementById(x + "." + y).style.backgroundImage = "url(files/images/min.png)";
				}
				if(this.field[x][y].flag && !this.field[x][y].bomb){
					document.getElementById(x + "." + y).style.backgroundImage = "url(files/images/min2.png)";
				}
			}	
		}
	}

	checkОut(x, y){
		return x >= 0 && x < this.height && y >= 0 && y < this.width;
	}

	checkForWin(){
		var countFlagInBobm = 0;
		var countFlag = 0;
		var countOpenCell = 0;
		for (var x = 0; x < this.height; x++) {
			for (var y = 0; y < this.width; y++) {
				if (this.field[x][y].flag){
					countFlag++;
					if(this.field[x][y].bomb){
						countFlagInBobm++;
					}
				}
				if(!this.field[x][y].bomb && this.field[x][y].open){
					countOpenCell++;
				}
			}
		}
		if(countFlagInBobm === this.bombs && countFlagInBobm === countFlag){
			this.gameOver(true);
			return;
		}
		if(countOpenCell === (this.width * this.height) - this.bombs){
			this.gameOver(true);
			return;
		}
	}
	
	gameOver(wins){
		this.openAllBombs();
		if(wins){
			alert("Вы выйграли");
		}else if(!wins){
			alert("Вы проиграли");
		}
		this.isEndOfGame = true;
		return;
	}
}

function openbox(){
	var display = document.getElementById("settings").style.display;

	if(display == 'table'){
		document.getElementById("settings").style.display='none';
	}else{
		document.getElementById("settings").style.display='table';
	}
}



function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let game = new Sapper();
