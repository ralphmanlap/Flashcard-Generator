// require basic flashcard module
var basicFlash = require('./basic.js');
// require cloze flashcard module
var clozeFlash = require('./cloze.js');
// require inquirer for getting user input at command line
var inquirer = require('inquirer');
// require fs
var fs = require('fs');

//initial prompt for flashcard app between adding a flashcard or showing cards
inquirer.prompt([{
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: [{
        name: 'add a card'
    }, {
        name: 'show all cards'
    }]
}]).then(function(ans) {
    if (ans.command === 'add a card') {
        addCard();
    } else if (ans.command === 'show all cards') {
        showCards();
    }
});

var addCard = function() {
    // get user input
    inquirer.prompt([{
        name: 'cardType',
        message: 'What kind of flashcard would you like to create?',
        type: 'list',
        choices: [{
            name: 'basic-card'
        }, {
            name: 'cloze-card'
        }]
    // once user input is received
    }]).then(function(ans) {
        if (ans.cardType === 'basic-card') {
            inquirer.prompt([{
                name: 'front',
                message: 'Your Question:',
                validate: function(input) {
                    //if no question is put in
                    if (input === '') {
                        console.log('Must input a question');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'The Answer:',
                validate: function(input) {
                    //if no answer is put in
                    if (input === '') {
                        console.log('Must input an answer');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(ans) {
                var newBasic = new basicFlash(ans.front, ans.back);
                newBasic.create();
                whatsNext();
            });
        } else if (answer.cardType === 'cloze-card') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full text?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Must put the full text');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze part?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Must put cloze part');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(ans) {
                var text = ans.text;
                var cloze = ans.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new clozeFlash(text, cloze);
                    newCloze.create();
                    whatsNext();
                } else {
                    console.log('The cloze portion you provided is not found in the full text. Please try again.');
                    addCard();
                }
            });
        }
    });
};

var whatsNext = function() {
    // get user input after either creating a card or seeing all cards
    inquirer.prompt([{
        name: 'nextAction',
        message: 'What would you like to do next?',
        type: 'list',
        choices: [{
            name: 'create another card'
        }, {
            name: 'show all cards'
        }, {
            name: 'done'
        }]

    // once user input is received
    }]).then(function(ans) {
        if (ans.nextAction === 'create another card') {
            addCard();
        } else if (ans.nextAction === 'show all cards') {
            showCards();
        } else if (ans.nextAction === 'done') {
            return;
        }
    });
};

var showCards = function() {
    // read the cards already stored in our log.txt file
    fs.readFile('./log.txt', 'utf8', function(error, data) {
        //if there is an error, log it
        if (error) {
            console.log('Error occurred: ' + error);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};
//display questions to be answered
var showQuestion = function(array, index) {
    question = array[index];
    var parsedQ = JSON.parse(question);
    var questionText;
    var correctReponse;

    if (parsedQ.type === 'basic') {
        questionText = parsedQ.front;
        correctReponse = parsedQ.back;
    } else if (parsedQ.type === 'cloze') {
        questionText = parsedQ.clozeDeleted;
        correctReponse = parsedQ.cloze;
    }

    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(ans) {
        if (ans.response === correctReponse) {
            console.log('Correct.');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        } else {
            console.log('Wrong.');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        }
    });
};
