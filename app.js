/*
ENCAPSULATION
*/


// BUDGET CONTROLLER
var budgetController = (function() {
    var Expense = function(id, description, value){

        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){

        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){

            sum+= cur.value;
            //console.log(sum + 'sum');
            data.total[type] = sum;
        });

    };

    // var allExpenses = [];
    // var allIncomes = [];
    // var totalExpenses = 0;

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            // Create a new item based on 'inc' or 'exp'
            if(type === 'exp'){
            newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;

        },

        calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal('exp');
            //console.log(totalExp);
            //console.log(data.total.exp);
            calculateTotal('inc');
            //console.log(totalInc);
            //console.log(data.total.inc);



            // calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;

            // calculate the percentage of income that we spent
            if(data.total.inc > 0){
                data.percentage = (data.total.exp/ data.total.inc) * 100

            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        }
    };

})();


// UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };
    // some code
    return {
        getinput: function() {
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function(obj, type) {
            var html, newHtml;
            
            // HTML Placeholders
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
            
           html = ' <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
             else if(type === 'exp'){
                 element = DOMstrings.expensesContainer;
           html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //  replace Placeholders with actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml) // added as a child to the container

        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            //fields.slice()
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";

            });
            fieldsArr[0].focus(); // brings focus back to the first index

        },
        displayBudget: function(obj){

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = parseInt(obj.percentage)  + '%';

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
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

    var updateBudget = function() {


        // 5. Calculate the budget
       var calc = budgetCtrl.calculateBudget();

        // Return the budget
        var budget = budgetCtrl.getBudget();

        // 6. Display the budget on the UI
        //console.log(budget);
        UICtrl.displayBudget(budget);
    }

    var ctrlAddItem = function(){
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getinput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //console.log(input);
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the item to the UI

        UICtrl.addListItem(newItem, input.type);

        // 4. Clear the fields

        UICtrl.clearFields();
        // 5. Calculate and update budget

        updateBudget();

        }
        
    };
    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();