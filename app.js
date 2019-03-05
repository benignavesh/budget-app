/*
ENCAPSULATION
*/


// BUDGET CONTROLLER
var budgetController = (function() {

    var x = 23;
    var add = function(a){
        return x + a;
    }

    return {
        publicTest: function(b){
            return add(b);
        }
    }
})();


// UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '..add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    // some code
    return {
        getinput: function() {
            return {
                type : document.querySelector('.add__type').value,
                description : document.querySelector('.add__description').value,
                value : document.querySelector('.add__value').value
            };
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    };


})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13){ // enter key Code
            ctrlAddItem();
        }
    });
    }

    var ctrlAddItem = function(){

        // 1. Get the field input data
        var input = UICtrl.getinput();
        console.log(input);

        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        
    };
    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();