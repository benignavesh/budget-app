/*
ENCAPSULATION
*/


// BUDGET CONTROLLER
var budgetController = (function() {
    var Expense = function(id, description, value){

        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

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

        deleteItem: function(type, id ) {
            var ids, index;
            // id = 3
            //data.allItems[type][id];
            ids = data.allItems[type].map(function(current){
                return current.id; // creates a new array with same no of element
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1); // delete the index
            }
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

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.total.inc);
            });
        },

        getPercentages: function(){

            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercsLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        /*
        + or -0 before number
        exactly 2 decimal pts
        comma seperating the thousands

        */
       num = Math.abs(num);
       num = num.toFixed(2);
       numSplit = num.split('.');

       int = numSplit[0];
       if(int.length > 3) {
           int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3);
       }

       dec = numSplit[1];

       type ;

       return (type === 'exp' ? '-' :  '+') + ' ' + int + '.' +  dec
    };

    var nodeListForEach = function(list, callback){
        for(var i = 0; i<list.length; i++){
            callback(list[i], i)
        };
    }


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
            
           html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
             else if(type === 'exp'){
                 element = DOMstrings.expensesContainer;
           html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //  replace Placeholders with actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml) // added as a child to the container

        },

        deleteListItem: function(selectorID){
            var el;

            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

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
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = parseInt(obj.percentage)  + '%';

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercsLabel);


            

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0 ){
                current.textContent = percentages[index] + '%';
                }else {
                    current.textContent = '---';
                }

            });
        },

        displayMonth: function(){
            var now, year, month;
            now = new Date();
            months = ['Jan', 'Feb', 'Mar','Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '  + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
            );
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }

    var updateBudget = function() {


        // 5. Calculate the budget
       var calc = budgetCtrl.calculateBudget();

        // Return the budget
        var budget = budgetCtrl.getBudget();

        // 6. Display the budget on the UI
        //console.log(budget);
        UICtrl.displayBudget(budget);
    };
    var updatePercentages = function(){
        // Calculate percentages
        budgetCtrl.calculatePercentages();

        // Read percentages from the budget controlelr
        var percentages = budgetCtrl.getPercentages();
        // Update the UI with the new percentages
        //console.log(percentages);
        UICtrl.displayPercentages(percentages);
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

        //6. Update percentages
        updatePercentages();

        }
        
    };

    var ctrlDeleteItem = function(event){ //  event is passed to know the target element .
        var itemID, splitID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // element where the event is fired, returns current node
        if(itemID){
            splitID = itemID.split('-'); // split returns an array of the split strings, hence we need ID so 2nd element of array
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete an item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // delete the item  from the UI
            UICtrl.deleteListItem(itemID);
            // Update and show the new budget
            updateBudget();
            // Update percentages
            updatePercentages();
        }


    };
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
            
        }
    }
})(budgetController, UIController);

controller.init();