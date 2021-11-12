'use strict';
class UI {
    constructor() {
        this.playerChoice = [];//player selection
        this.luckyNumbers = null;//computer selection
        //mark game stages
        this.drawIsReady = false;
        this.gameOver = false;
        this.drawHasStarted = false;
        //set by user
        this.range = parseInt(document.querySelector('.range').value);
        //ui info
        this.gameInstruction = `Enter any 6 numbers from 1 to ${this.range} to play`;
        this.appTitle = 'lucky numbers';
        this.feedbackStr = "";
        //DOM Elements
        this.instructionDisplay = this.el('.instruction');
        this.userSettingInput = this.el('.settings');
        this.ballView = this.el('#view');
        this.form = this.el('#form');
        this.input = this.el('.input input');
        this.h1_heading = this.el('.heading')
        this.feedback = this.el('.feedback');
        this.scoreDisplay = this.el('.points');
        this.playbtn = this.form.querySelector('.play');
        this.resetbtn = this.form.querySelector('.reset');
        this.balls = this.ballView.querySelectorAll('.lucky-number');

        // Generate number array
        this.gameNumbers = (size = 45) => {
            let array = [];
            for (let i = 1; i <= size; i++) {
                array.push(i);
            }
            return array;
        };
        // Array on which the App operates
        this.numbersToChooseFrom = this.gameNumbers(this.range);
    }

    //query single DOM Element
    el = cssClassOrIdStr => document.querySelector(cssClassOrIdStr)

    //Shuffle Array
    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i            
            [arr[i], arr[j]] = [arr[j], arr[i]];// swap elements 
        }
        return arr;
    }

    // pick lucky numbers
    pickRandom(arr, how_big = 6) {
        let lucky_numbers = [];
        for (let i = 0; i < how_big; i++) {
            let random = Math.floor(Math.random() * (arr.length - 1));//random index
            this.shuffleArray(arr);//shuffleArray 
            lucky_numbers.push(arr[random]);//pick lucky number
            arr.splice(random, 1);//prevent reselection 
        }
        return lucky_numbers;
    }

    // Injects lucky numbers into the view
    printNumbers(array) {
        for (let i = 0; i < this.balls.length; i++) {
            (idx => this.balls[i].innerHTML = array[idx])(i);//IIFE 
        }
    }
    // Calcute player score
    calcScore(selection, result) {
        let count = 0;
        for (let num of selection) {
            if (result.includes(num)) {
                count += 1;
            }
        }
        return count;
    }

    // Animate Draw
    startTheDraw() {

        if (this.drawIsReady) {
            this.drawHasStarted = true;
            let i = 0;
            const animationId = setInterval(() => {
                if (i < this.balls.length) {
                    let currentBall = this.balls[i];
                    currentBall.classList.remove('hide');
                    this.colorBallByNumber(currentBall);
                    i++;
                } else {
                    this.updateText(this.h1_heading, 'Check Score');
                    const points = this.calcScore(this.playerChoice, this.luckyNumbers);
                    points < 3 ? this.scoreDisplay.classList.add('score-bad') : this.scoreDisplay.classList.add('score-good');
                    this.updateText(this.scoreDisplay, points);
                    clearInterval(animationId);
                    this.gameOver = true;
                    this.drawHasStarted = false;
                }
            }, 2000);
        }
    }


    getUserInput() {
        let entry = this.form.elements['number'];
        if (!this.drawIsReady) {
            let n = parseInt(entry.value);
            if (this.h1_heading.innerHTML !== 'Your Selection') {
                this.updateText(this.h1_heading, 'Your Selection');
            }
            if ((n > 0 && n <= this.numbersToChooseFrom.length) && (!this.playerChoice.includes(n))) {
                this.playerChoice.push(n);
                this.displayPlayerSelection(n);
                entry.value = "";
                if (this.playerChoice.length === 6) {
                    this.drawIsReady = true;
                }
            }
            entry.value = "";
            if (this.drawIsReady) {
                this.updateText(this.h1_heading, 'Good Luck : )');
                this.luckyNumbers = this.pickRandom(this.numbersToChooseFrom);// computer selection
                this.printNumbers(this.luckyNumbers);//inject numbers to the view area                
            }

        }
        entry.value = "";
    }
    //display player selection
    displayPlayerSelection(selection) {
        if (this.feedback.innerHTML === this.gameInstruction) {
            this.feedback.innerHTML = "";
        }
        let span = document.createElement('span');
        span.setAttribute('class', 'candidate');
        let num = document.createTextNode(selection);
        span.appendChild(num);
        this.feedback.appendChild(span);
    }
    //Reset variables and make ui changes
    reset() {
        if (!this.drawHasStarted) {
            this.drawIsReady = false;
            this.gameOver = false;
            this.playerChoice = [];
            this.luckyNumbers = null;
            this.numbersToChooseFrom = this.gameNumbers(this.range);
            this.input.focus();
            this.feedbackStr = "";
            this.updateText(this.h1_heading, this.appTitle);
            this.updateText(this.scoreDisplay, '--');
            this.updateText(this.feedback, this.gameInstruction);
            //Hide balls from view
            for (let ball of this.balls) {
                ball.setAttribute('class', 'lucky-number hide');
            }
            this.scoreDisplay.className = 'points';//remove score
        }
    }
    //update ui message
    updateText = (element, text) => element.innerHTML = text

    colorBallByNumber = (ball) => {
        let luckyNumber = parseInt(ball.innerHTML);
        if (luckyNumber > 75) {
            ball.classList.add('gold');
        } else if (luckyNumber > 60) {
            ball.classList.add('light-blue');
        } else if (luckyNumber > 45) {
            ball.classList.add('purple');
        } else if (luckyNumber > 38) {
            ball.classList.add('greenish');
        } else if (luckyNumber > 31) {
            ball.classList.add('brown');
        } else if (luckyNumber > 24) {
            ball.classList.add('blue');
        } else if (luckyNumber > 17) {
            ball.classList.add('grey');
        } else if (luckyNumber > 10) {
            ball.classList.add('green');
        } else {
            ball.classList.add('red');
        }

    }

    changeRangeSetting = () => {
        this.range = parseInt(document.querySelector('.range').value);
        this.numbersToChooseFrom = this.gameNumbers(this.range);
        this.updateText(this.feedback, `Enter any 6 numbers from 1 to ${this.range} to play`);
        this.updateText(this.instructionDisplay, `Enter any 6 numbers from 1 to ${this.range} to play`);
        this.gameInstruction = `Enter any 6 numbers from 1 to ${this.range} to play`;
    }
}

//Adds eventListeners to elements
function startApp() {
    const form = document.querySelector('.form');
    const playbtn = document.querySelector('.play');
    const resetbtn = document.querySelector('.reset');
    const settings = document.querySelector('.settings');

    //create Instance of UI
    const ui = new UI();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        ui.getUserInput();
    }, false);

    playbtn.addEventListener('click', (e) => {
        e.preventDefault();
        ui.startTheDraw();
    }, false);

    resetbtn.addEventListener('click', (e) => {
        e.preventDefault();
        ui.reset();
    }, false);

    settings.addEventListener('change', (e) => {
        e.preventDefault();
        ui.changeRangeSetting();
    }, false);
}

document.addEventListener('DOMContentLoaded', () => startApp());