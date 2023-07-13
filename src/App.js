let bombCount = 40;
let maxPlayTime = 999;
let width = 18;
let height = 14;

function selectedDifficultyLevel() {
    let selected = document.getElementById('difficultyLevel');
    if (selected.value == 'dev-mode') {
        width = 3;
        height = 3;
        bombCount = 1;
    } else if (selected.value == 'easy') {
        width = 10;
        height = 8;
        bombCount = 10;
    } else if (selected.value == 'normal') {
        width = 18;
        height = 14;
        bombCount = 40;
    } else {
        width = 24;
        height = 20;
        bombCount = 99;
    }
    game = new Game(bombCount, maxPlayTime, width, height);
}

class Game {
    constructor(bombCount, maxPlayTime, width, height) {
        this.bombCount = bombCount;
        this.maxPlayTime = maxPlayTime;
        this.width = width;
        this.height = height;

        this.setup();
    }

    setup() {
        this.gameOver = false;
        this.resetUi();

        this.initPlayingField();
        this.placeBombs();
        this.caculateIndicator();
        this.showWholePlayingField();
    }

    initPlayingField() {
        this.playingField = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.playingField[i] = new Array(this.width);
        }
    }

    placeBombs() {
        // Überprüfe eingabe parameter
        if ((this.width * this.height) < this.bombCount) {
            console.error('Can\'t place all bombs due to field count.');
            return;
        }

        for (let i = 0; i < this.bombCount; i++) {
            let bombX = Math.floor(Math.random() * (this.width));
            let bombY = Math.floor(Math.random() * (this.height));

            // Es können nicht zwei Bomben in einem feld liegen
            if (typeof this.playingField[bombY][bombX] === 'undefined') {
                this.playingField[bombY][bombX] = new FieldInfo(true);
            } else {
                i = i - 1;
            }
        }
    }

    /**
     * Diese Methode berechnet den Indikator der die Anzahl der Bomben in der direkten Umgebung zählt.
     * 
     * [-] Beschreibt nicht vorhandene Felder (außerhalb des Spielfelds)
     * [X] Die aktuelle Position
     * [?] Die zu überprüfenden Felder.
     */
    caculateIndicator() {
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                let calculatedIndicator = 0;
                if (typeof this.playingField[row][column] === 'undefined') {
                    let isLeft = column == 0;
                    let isTop = row == 0;
                    let isRight = column == this.width - 1;
                    let isBottom = row == this.height - 1;

                    if (isLeft) {
                        if (isTop) {
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column + 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column + 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column);
                        } else if (isBottom) {
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column + 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column + 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column);
                        } else {
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column + 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column + 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column + 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column);
                        }
                    } else if (isRight) {
                        if (isTop) {
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column - 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column - 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column);
                        } else if (isBottom) {
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column - 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column - 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column);
                        } else {
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column - 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column - 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column - 1);
                            calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column);
                        }
                    } else if (isTop && !isLeft && !isRight) {
                        // [-] [-] [-]
                        // [?] [X] [?]
                        // [?] [?] [?]
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column - 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column + 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column - 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column + 1);
                    } else if (isBottom && !isLeft && !isRight) {
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column - 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column + 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column - 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column + 1);
                    } else {
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column - 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row - 1, column + 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column - 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row, column + 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column - 1);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column);
                        calculatedIndicator = this.countBombIfPresent(calculatedIndicator, row + 1, column + 1);
                    }

                    let currentField = new FieldInfo(false);
                    currentField.setIndicator(calculatedIndicator);
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

    showWholePlayingField() {
        document.getElementById('playingField').innerHTML = '';
        document.getElementById('bombDisplay').innerHTML = this.bombCount;

        let playingFieldView = document.getElementById('playingField');
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                let fieldView = document.createElement('div');
                fieldView.setAttribute('class', 'field');
                fieldView.setAttribute('id', `field_${row}-${column}`);
                fieldView.setAttribute('onmousedown', `onClick(event, ${row}, ${column});`);
                this.fillField(this.playingField[row][column], fieldView);
                playingFieldView.appendChild(fieldView);
            }
        }

        document.getElementById('playingField').style.gridTemplateColumns = 'auto '.repeat(this.width);
    }

    fillField(fieldInfo, fieldView) {
        if (fieldInfo.isFlagEnabled()) {
            fieldView.innerHTML = '<p>🚩</p>';
        } else {
            let indicator = fieldInfo.getIndicator();

            if (!fieldInfo.isHidden()) {
                fieldView.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
                if (fieldInfo.getBomb()) {
                    fieldView.innerHTML = `<p class="fieldContent">💣</p>`;
                } else {
                    fieldView.innerHTML = `<p class="fieldContent" id="p_0${indicator}">${indicator}</p>`;
                }
            } else {
                fieldView.innerHTML = '';
            }
        }
    }

    resetUi() {
        document.getElementById('winner').style.display = 'none';
        document.getElementById('lose').style.display = 'none';
    }

    showAllBombs() {
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                if (this.playingField[row][column].getBomb()) {
                    this.playingField[row][column].setHidden(false);
                }
            }
        }
        this.showWholePlayingField();
    }

    fieldClicked(row, column) {
        if (this.gameOver) {
            return;
        }

        let clickedField = document.getElementById(`field_${row}-${column}`);
        let clickedFieldInfo = this.playingField[row][column];

        if (!clickedFieldInfo.isFlagEnabled()) {
            clickedFieldInfo.setHidden(false);
            if (clickedFieldInfo.getBomb()) {
                this.showAllBombs(row, column);
                clickedField = document.getElementById(`field_${row}-${column}`);
                clickedField.style.backgroundColor = 'red';
                setTimeout(this.loseGame, 1500);
                this.gameOver = true;
                return;
            }

        }

        this.fillField(this.playingField[row][column], clickedField);

        if (this.checkWinCondition()) {
            this.winGame();
        }
    }

    loseGame() {
        document.getElementById('popupContainer').style.display = 'block';
        document.getElementById('lose').style.display = 'block';
    }

    winGame() {
        document.getElementById('popupContainer').style.display = 'block';
        document.getElementById('winner').style.display = 'block';
        clearInterval(this.intervalId);
    }

    /**
     * @returns gibt zurück ob wir gewonnen haben
     */
    checkWinCondition() {
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                let field = this.playingField[row][column];
                // Prüft ob es noch ein verstecktes Zahlenfeld gibt
                if (!field.getBomb() && field.isHidden()) {
                    return false;
                }
            }
        }
        return true; // Gewonnen
    }
}

class FieldInfo {
    constructor(bomb) {
        this.bomb = bomb;
        this.indicator = 0;
        this.flagEnabled = false;
        this.hidden = true;
    }

    getBomb() {
        return this.bomb;
    }

    getIndicator() {
        return this.indicator;
    }

    setIndicator(indicator) {
        this.indicator = indicator;
    }

    isFlagEnabled() {
        return this.flagEnabled;
    }

    setFlag(boolean) {
        this.flagEnabled = boolean;
    }

    isHidden() {
        return this.hidden;
    }

    setHidden(boolean) {
        this.hidden = boolean;
    }
}



var game;

function main() {
    document.getElementById('difficultyLevel').value = 'normal';
    game = new Game(bombCount, maxPlayTime, width, height);
}

function onClick(event, row, column) {
    if (event.which == 1) {
        game.fieldClicked(row, column);
    } else if (event.which == 3) {
        let clickedField = document.getElementById(`field_${row}-${column}`);
        let clickedFieldInfo = game.playingField[row][column];

        if (clickedFieldInfo.isFlagEnabled()) {
            clickedFieldInfo.setFlag(false);
        } else {
            clickedFieldInfo.setFlag(true);
        }
        game.fillField(game.playingField[row][column], clickedField);
    }
}

function startGame() {
    document.getElementById('popupContainer').style.display = 'none';
    game.setup();
}
