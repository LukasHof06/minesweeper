let bombCount = 10;
let maxPlayTime = 999;
let width = 10;
let height = 8;

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
                console.log("B placed");
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
        return indicator
    }

    createView() {
        document.getElementById('playingField').innerHTML = '';
        document.getElementById('bombDisplay').innerHTML = this.bombCount;

        let container = document.getElementById('playingField');
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                let field = document.createElement('div');
                let indicator = this.playingField[row][column].getIndicator();
                let isBomb = this.playingField[row][column].getBomb();
                let isHidden = this.playingField[row][column].getHidden();

                if (!isHidden) {
                    if (isBomb) {
                        field.innerHTML = `<p class="fieldContent">💣</p>`;
                    } else {
                        field.innerHTML = `<p class="fieldContent">${indicator}</p>`;
                    }
                }
                field.setAttribute('class', 'field');
                field.setAttribute('onclick', `onClick(${row}, ${column});`);
                container.appendChild(field);
            }
        }

        document.getElementById('playingField').style.gridTemplateColumns = "auto ".repeat(this.width);
    }

    fieldClicked(row, column){
        this.playingField[row][column].setHidden(false);
        this.createView();
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

    setHidden(bool){
        this.hidden = bool;
    }
}


var game;

function main() {
    game = new Game(bombCount, maxPlayTime, width, height);
}

function onClick(x, y) {
    console.log(x, y)
    game.fieldClicked(x, y)
}