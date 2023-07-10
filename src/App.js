

function main() {
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
                    if (typeof this.playingField[row][column] === 'undefined') {
                        let isLeft = column == 0;
                        let isTop = row == 0;
                        let isRight = column == this.width - 1;
                        let isBottom = row == this.height - 1;

                        let countIndicator = 0;

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
            if (typeof this.playingField[row][column] != 'undefined') {
                indicator++;
            }
            return indicator
        }

        createView() {
            let container = document.getElementById('container');
            for (var row = 0; row < this.height; row++) {
                for (var column = 0; column < this.width; column++) {

                    let field = document.createElement('div');
                    field.style.cssText = 'border:1px solid blue; width:20px; height:20px;';
                    field.innerHTML = `<p>${this.playingField[row][column].getIndicator()}</p>`
                    container.appendChild(field);
                }
            }
        }
    }

    class FieldInfo {
        constructor(bomb) {
            this.bomb = bomb;
            this.hidden = true;
            this.indicator = 0;

            this.test();
        }

        getIndicator() {
            return this.indicator;
        }

        setIndicator(indicator) {
            this.indicator = indicator;
        }

        test() {
            console.log(this.bomb);
        }
    }

    let bombCount = 50;
    let maxPlayTime = 999;
    let width = 10;
    let height = 10;

    const game = new Game(bombCount, maxPlayTime, width, height);
}