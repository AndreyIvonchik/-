class Sapper {

    play(count) {
        var width,
            height,
            bombs;
        document.getElementById('settings').style.display = 'none';
        switch (count) {
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
                width = +document.getElementById('width').value ? +document.getElementById('width').value : 8;
                height = +document.getElementById('height').value ? +document.getElementById('height').value : 8;
                bombs = +document.getElementById('countMin').value ? +document.getElementById('countMin').value : Math.floor(width * height / 4);

                if (height * width > bombs && width <= 100 && height <= 100) {
                    this.init({
                        width,
                        height,
                        bombs
                    });
                } else {
                    alert('Введите корректное значение. (Ширина и высота меньше 100, количество бомб меньше количества ячеек.)');
                }
                break;
            }
        }
    }

    init(obj) {
        if (obj) {
            this.width = obj.width;
            this.height = obj.height;
            this.bombs = obj.bombs;
        }
        this.countFlags = 0;
        this.isEndOfGame = false;
        this.firstClick = true;

        if (this.field) {
            document.getElementById('timer').textContent = '00:00';
            document.getElementById('table').innerHTML = null;
            document.getElementById('newGame').src = 'files/images/face.png';
            clearInterval(this.timer);
        }

        document.getElementById('countFlags').textContent = this.bombs;
        this.field = this.createMatrix();
    }

    createCell(table, i, j) {
        var newDIV = document.createElement('div');

        newDIV.classList.add('cell');
        newDIV.id = i + '.' + j;
        table.appendChild(newDIV);

        if (j + 1 === this.width) {
            table.appendChild(document.createElement('br'));
        }
    }

    createMatrix() {
        var table = document.getElementById('table'),
            matrix = [];

        table.classList.add('table');

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
            var bombOne = function () {
                var i = random(0, self.height - 1);
                var j = random(0, self.width - 1);

                if (matrix[i][j].bomb || (x === i && y === j)) {
                    bombOne();
                } else {
                    matrix[i][j].bomb = true;
                }
            };
            bombOne();
        }
        return matrix;
    }

    countBomb(matrix) {
        for (var x = 0; x < this.height; x++) {
            for (var y = 0; y < this.width; y++) {
                if (matrix[x][y].bomb) {
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

    leftClick() {
        var target = event.target,
            x = +target.id.split('.')[0],
            y = +target.id.split('.')[1];

        if (this.isEndOfGame || target.className !== 'cell') {
            return false;
        }

        if (this.firstClick) {
            this.field = this.bombPositions(this.field, x, y);
            this.field = this.countBomb(this.field);
            this.firstClick = false;
            this.createTimer();
        }
        this.openCell(x, y);
        this.checkForWin();
    }

    rightClick() {
        var countFlagsElement = document.getElementById('countFlags'),
            target = event.target,
            x = +target.id.split('.')[0],
            y = +target.id.split('.')[1];

        event.preventDefault();
        if (this.isEndOfGame ||  target.className !== 'cell' || this.firstClick || this.field[x][y].open){
            return false;
        }

        if (this.field[x][y].flag) {
            this.field[x][y].flag = false;
            this.countFlags--;

            target.style.backgroundImage = null;
            countFlagsElement.textContent = this.bombs - this.countFlags;

        } else {
            this.field[x][y].flag = true;
            this.countFlags++;

            target.style.backgroundImage = 'url(files/images/flag.png)';
            countFlagsElement.textContent = this.bombs - this.countFlags;
        }
        this.checkForWin();
    }

    openCell(x, y) {
        var element = document.getElementById(x + '.' + y),
            colors = {
                1: 'blue',
                2: 'green',
                3: 'red',
                4: 'dakrblue',
                5: 'indianred',
                6: 'navy',
                7: 'brown',
                8: 'grey'
            };

        if (this.field[x][y].open || this.field[x][y].flag) {
            return;
        }

        if (this.field[x][y].bomb) {
            element.style.backgroundColor = 'red';
            this.gameOver(false);
            return;
        }

        if (this.field[x][y].bombCounter) {
            this.field[x][y].open = true;
            element.textContent = this.field[x][y].bombCounter;
            element.style.backgroundColor = 'silver';
            element.style.color = colors[this.field[x][y].bombCounter];
        }

        if (!this.field[x][y].bombCounter) {
            this.openEmptyCell(x, y);
        }
    }

    openEmptyCell(x, y) {
        var element = document.getElementById(x + '.' + y);

        this.field[x][y].open = true;
        element.style.backgroundColor = 'silver';

        if (this.checkОut(x + 1, y)) {
            this.openCell(x + 1, y);
            if (this.checkОut(x, y + 1) && this.field[x][y + 1].bombCounter) {
                this.openCell(x + 1, y + 1);
            }
        }

        if (this.checkОut(x - 1, y)) {
            this.openCell(x - 1, y);
            if (this.checkОut(x, y - 1) && this.field[x][y - 1].bombCounter) {
                this.openCell(x - 1, y - 1);
            }
        }

        if (this.checkОut(x, y + 1)) {
            this.openCell(x, y + 1);
            if (this.checkОut(x - 1, y) && this.field[x - 1][y].bombCounter) {
                this.openCell(x - 1, y + 1);
            }

        }

        if (this.checkОut(x, y - 1)) {
            this.openCell(x, y - 1);
            if (this.checkОut(x + 1, y) && this.field[x + 1][y].bombCounter) {
                this.openCell(x + 1, y - 1);
            }
        }
    }

    openAllBombs() {
        for (var x = 0; x < this.height; x++) {
            for (var y = 0; y < this.width; y++) {
                if (this.field[x][y].bomb) {
                    document.getElementById(x + '.' + y).style.backgroundImage = 'url(files/images/min.png)';
                }
                if (this.field[x][y].flag && !this.field[x][y].bomb) {
                    document.getElementById(x + '.' + y).style.backgroundImage = 'url(files/images/min2.png)';
                }
            }
        }
    }

    checkОut(x, y) {
        return x >= 0 && x < this.height && y >= 0 && y < this.width;
    }

    checkForWin() {
        var countFlagInBobm = 0,
            countFlag = 0,
            countOpenCell = 0;

        for (var x = 0; x < this.height; x++) {
            for (var y = 0; y < this.width; y++) {
                if (this.field[x][y].flag) {
                    countFlag++;
                    if (this.field[x][y].bomb) {
                        countFlagInBobm++;
                    }
                }
                if (!this.field[x][y].bomb && this.field[x][y].open) {
                    countOpenCell++;
                }
            }
        }
        if (countFlagInBobm === this.bombs && countFlagInBobm === countFlag) {
            this.gameOver(true);
        } else if (countOpenCell === (this.width * this.height) - this.bombs) {
            this.gameOver(true);
        }
    }

    gameOver(wins) {
        var face = document.getElementById('newGame');

        this.openAllBombs();
        if (wins) {
            face.src = 'files/images/face-win.png';
        } else if (!wins) {
            face.src = 'files/images/face-loser.png';
        }
        this.isEndOfGame = true;
        clearInterval(this.timer);
    }

    createTimer() {
        var elem = document.getElementById('timer'),
            time = 0,
            formatter = new Intl.DateTimeFormat('ru', {
                minute: 'numeric',
                second: 'numeric'
            });

        this.timer = setInterval(function () {
            time += 1000;
            elem.innerHTML = formatter.format(time);
        }, 1000);
    }
}

function openbox() {
    var display = document.getElementById('settings').style.display;

    if (display === 'table') {
        document.getElementById('settings').style.display = 'none';
    } else {
        document.getElementById('settings').style.display = 'table';
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let game = new Sapper();
