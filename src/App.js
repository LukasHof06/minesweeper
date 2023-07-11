let bombCount = 40;
let maxPlayTime = 999;
let width = 19;
let height = 14;

class Game {
    constructor(bombCount, maxPlayTime, width, height) {
        this.bombCount = bombCount;
        this.maxPlayTime = maxPlayTime;
        this.width = width;
        this.height = height;
        this.setup();
    }

    setup() {
        this.playingField = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.playingField[i] = new Array(this.width);
        }

        /* for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                this.playingField[row][column] = row * this.width + column;
            }
        } */

        this.placeBombs();
        this.caculateIndicator();
        this.createView();
    }


    placeBombs() {
        if ((this.width * this.height) < bombCount) {
            console.error('Can\'t place all bombs due to field count.');
            return;
        }

        for (let i = 0; i < this.bombCount; i++) {
            let bombX = Math.floor(Math.random() * (this.width));
            let bombY = Math.floor(Math.random() * (this.height));

            if (typeof this.playingField[bombY][bombX] === 'undefined') {
                this.playingField[bombY][bombX] = new FieldInfo(true);
            } else {
                i = i - 1;
            }
        }

        console.log('All bombs placed!');
    }

    caculateIndicator() {
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                let countIndicator = 0;
                if (typeof this.playingField[row][column] === 'undefined') {
                    let isLeft = column == 0;
                    let isTop = row == 0;
                    let isRight = column == this.width - 1;
                    let isBottom = row == this.height - 1;

                    if (isLeft) {
                        if (isTop) {
                            countIndicator = this.countBombIfPresent(countIndicator, row, column + 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column + 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column);
                        } else if (isBottom) {
                            countIndicator = this.countBombIfPresent(countIndicator, row, column + 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column + 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column);
                        } else {
                            countIndicator = this.countBombIfPresent(countIndicator, row, column + 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column + 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column + 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column);
                        }
                    } else if (isRight) {
                        if (isTop) {
                            countIndicator = this.countBombIfPresent(countIndicator, row, column - 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column - 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column);
                        } else if (isBottom) {
                            countIndicator = this.countBombIfPresent(countIndicator, row, column - 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column - 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column);
                        } else {
                            countIndicator = this.countBombIfPresent(countIndicator, row, column - 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column - 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row + 1, column);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column - 1);
                            countIndicator = this.countBombIfPresent(countIndicator, row - 1, column);
                        }
                    } else if (isTop && !isLeft && !isRight) {
                        countIndicator = this.countBombIfPresent(countIndicator, row, column - 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row, column + 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row + 1, column - 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row + 1, column);
                        countIndicator = this.countBombIfPresent(countIndicator, row + 1, column + 1);
                    } else if (isBottom && !isLeft && !isRight) {
                        countIndicator = this.countBombIfPresent(countIndicator, row, column - 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row, column + 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row - 1, column - 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row - 1, column);
                        countIndicator = this.countBombIfPresent(countIndicator, row - 1, column + 1);
                    } else {
                        countIndicator = this.countBombIfPresent(countIndicator, row - 1, column - 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row - 1, column);
                        countIndicator = this.countBombIfPresent(countIndicator, row - 1, column + 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row, column - 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row, column + 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row + 1, column - 1);
                        countIndicator = this.countBombIfPresent(countIndicator, row + 1, column);
                        countIndicator = this.countBombIfPresent(countIndicator, row + 1, column + 1);
                    }

                    let currentField = new FieldInfo(false);
                    currentField.setIndicator(countIndicator);
                    this.playingField[row][column] = currentField;
                }
            }
        }
    }

    countBombIfPresent(indicator, row, column) {
        if (typeof this.playingField[row][column] != 'undefined' && this.playingField[row][column].getBomb()) {
            indicator++;
        }
        return indicator;
    }

    createView() {
        document.getElementById('playingField').innerHTML = '';
        document.getElementById('bombDisplay').innerHTML = this.bombCount;

        let container = document.getElementById('playingField');
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                let field = document.createElement('div');
                this.drawField(this.playingField[row][column], field);
                field.setAttribute('class', 'field');
                field.setAttribute('id', `field_${row}-${column}`);
                field.setAttribute('onclick', `onClick(${row}, ${column});`);
                container.appendChild(field);
            }
        }

        document.getElementById('playingField').style.gridTemplateColumns = 'auto '.repeat(this.width);
    }

    terminateGame() {
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                if (this.playingField[row][column].getBomb()) {
                    this.playingField[row][column].setHidden(false);
                }
            }
        }
        this.createView();
    }

    fieldClicked(row, column) {
        if (flagEnabled) {
            let clickedField = document.getElementById(`field_${row}-${column}`)
            if (clickedField.innerHTML == '') {
                clickedField.innerHTML = '<p>🚩</p>';
            } else if (clickedField.innerHTML == '<p>🚩</p>') {
                clickedField.innerHTML = '';
            }
        } else {
            this.playingField[row][column].setHidden(false);
            if (this.playingField[row][column].getBomb()) {
                this.terminateGame();
            }
        }

        // this.createView();
        let field = document.getElementById(`field_${row}-${column}`);
        this.drawField(this.playingField[row][column], field);
    }

    drawField(fieldInfo, field) {
        let indicator = fieldInfo.getIndicator();
        let isBomb = fieldInfo.getBomb();
        let isHidden = fieldInfo.getHidden();
        if (!isHidden) {
            if (isBomb) {
                field.innerHTML = `<p class="fieldContent">💣</p>`;
                field.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
            } else {
                field.innerHTML = `<p class="fieldContent">${indicator}</p>`;
                field.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
            }
        }
    }
}



class FieldInfo {
    constructor(bomb) {
        this.bomb = bomb;
        this.hidden = true;
        this.indicator = 0;

    }

    getIndicator() {
        return this.indicator;
    }

    setIndicator(indicator) {
        this.indicator = indicator;
    }

    getBomb() {
        return this.bomb;
    }

    getHidden() {
        return this.hidden;
    }

    setHidden(boolean) {
        this.hidden = boolean;
    }
}

var game;
var flagEnabled = false;

function main() {

    game = new Game(bombCount, maxPlayTime, width, height);
}

function onClick(x, y) {
    game.fieldClicked(x, y);
}

function onClickFlag() {
    if (!flagEnabled) {
        flagEnabled = true;
    } else if (flagEnabled) {
        flagEnabled = false;
    }
}

function startGame() {
    let popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = 'none';
}
