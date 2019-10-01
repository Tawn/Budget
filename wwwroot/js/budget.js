const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const _colors  = ['#ee1111','#2d89ef','#ffc40d','#ff0097','#b91d47',
'#da532c','#9f00a7','#99b433','#00aba9','#2b5797'];

var max_budget;
var total_expense;
var user; 
var cat_budget_remain;

window.onload = function () {

    total_expense = 0;
    max_budget = 0;

    // Get User information
    var Guid = localStorage.getItem("Guid");
    var url = 'https://localhost:5001/api/users/' + Guid + '/init'

    fetch(url, {
        method: 'get',
    })
    .then(response => response.json())
    .then(jsonData => user = jsonData)
    .then(get_User)
    .catch(err => {
            //error block
    });

}

// Logout
function logout_pressed() {
    window.location = "/login"
}

// INITIAL SETUP
function get_User() {
    max_budget = 0;
    total_expense = 0;

    // Iterate through each category
    user.categories.forEach(category => {
        // add up max budget
        max_budget += category.maxAmount;

        // display category
        displayCategory(category);

    });

    // Display Expense
    cat_budget_remain = 0;
    user.expenses.forEach(expense => {
        displayExpense(expense);
    });

    add_pie_chart(user.categories, user.expenses);
    add_bar_chart(user.categories, user.expenses);

    // Display Budget
    updateBudget();

}

// DISPLAY EXPENSE
function displayExpense(expense) {
    
    // var category = document.getElementById("category-" + expense.category.id);
    var category = expense.category;

    if(category != null && expense.name != null) {

        // <div class="card mb-3">
        //         <div class="card-header">
        //             <i class="fas fa-chart-area"></i>
        //             Expenses
        //         </div>
        //         <div class="card-body">
        //             <!-- Display Categories -->
        //             <div id="category-display"></div>
        //             <canvas id="myAreaChart" width="100%" height="30"></canvas>
        //         </div>
        //     </div>

        // Get category id
        var id = category.id;

        // Get category div
        var div = document.getElementById("category-" + id);

        // Create expense element
        var new_expense = document.createElement("h6");
        new_expense.innerHTML = "Expense Name: " + expense.name + "<br />" +  " Amount: $" + expense.amount;

        // Append
        div.appendChild(new_expense);

        total_expense += expense.amount;

    }
        
}

// DISPLAY CATEGORIES
function displayCategory(category) {

    // Category Container
    var div = document.getElementById("category-display");  

    // Text Div
    var cat_div = document.createElement("div");
    cat_div.setAttribute("id", "category-" + category.id.toString());
    div.appendChild(cat_div);

    // Text h3
    var h3 = document.createElement("h5");
    h3.setAttribute("id", category.name);
    h3.innerHTML = category.name + "\tMax Budget: $" + category.maxAmount;
    cat_div.appendChild(h3);

    var total_expense = 0;
    // get remaining budget
    user.expenses.forEach(expense => {

        if(expense.name != null && expense.category != null) {
            // add up max budget
            if(expense.category.id == category.id) 
                total_expense += expense.amount;
        }

    });

    // Text remaining budget
    var h4 = document.createElement("h5");
    h4.innerHTML = "Remaining Budget: $" + (category.maxAmount - total_expense).toString();
    cat_div.appendChild(h4);

    // Add Expense Text
    h4 = document.createElement("h6");
    h4.innerHTML = "Add new expense";
    cat_div.appendChild(h4);

    // Expense text
    var expense = document.createElement('input');
    expense.setAttribute("type", "text");
    expense.setAttribute("id", "name-"+category.id.toString());
    expense.setAttribute("placeholder", "expense name");

    // Amount text
    var amount = document.createElement('input');
    amount.setAttribute("type", "text");
    amount.setAttribute("id", "amount-"+category.id.toString());
    amount.setAttribute("placeholder", "amount");

    // Submit Button
    var button = document.createElement('input');
    button.setAttribute("type", "button");
    button.setAttribute("id", category.id.toString());
    button.setAttribute("onclick", "add_expense_button_press(this.id)")
    button.setAttribute("value", "Submit");

    var div1 = document.getElementById("expense-area");
    var e1 = document.createElement("div");
    e1.setAttribute("class", "card mb-3");

    // Category Name
    var e2 = document.createElement("div");
    e2.setAttribute("class", "card-header");
    var elem = document.createElement("h3");
    elem.innerHTML = category.name;
    e2.append(elem);
    e2.appendChild(h4);
    e2.appendChild(expense);
    e2.appendChild(amount);
    e2.appendChild(button);
    e1.appendChild(e2);

    // Body
    var e3 = document.createElement("div");
    e3.setAttribute("class", "card-body");
    e3.append(cat_div);
    e1.appendChild(e3);

    var e4 = document.createElement("canvas");
    e4.setAttribute("id", "myAreaChart");
    e4.setAttribute("width", "100%");
    e4.setAttribute("height", "30");
    e4.innerHTML = "(reaplce with category and expense";
    e1.appendChild(e4);

    // Append into Expense area
    div1.appendChild(e1);

}

function updateBudget () {
    var display = "Max Budget: $" + max_budget;
    document.getElementById("max-budget-display").innerHTML = display;

    display = "Remaining Budget: $" + (max_budget - total_expense);
    document.getElementById("remaining-budget-display").innerHTML = display;
}

// POST NEW CATEGORY
function add_category_button_press() {
    // Category name
    var set_name = document.getElementById("add-category-name").value;

    // Category amount
    var set_amount = document.getElementById("add-category-amount").value;

    // POST new category to user (using Guid)
    var Guid = user.userDetails.guid;
    var target_url = '/api/categories/add';
    var data = { UserGuid : Guid, name : set_name, MaxAmount : set_amount};

    // POST REQUEST
    fetch(target_url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json; odata=verbose",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: JSON.stringify(data), 
    })
    .then(response => response.json())
    .then(jsonData => user = jsonData)
    .catch(err => {
            //error block
    });
    
    refresh();
}


// POST NEW EXPENSE 
function add_expense_button_press(id) {
    var expense_name = document.getElementById("name-" + id).value;
    var expense_amount = document.getElementById("amount-" + id).value;

    // POST new expense to user (using Guid)
    var Guid = user.userDetails.guid;
    var target_url = '/api/expenses/add';
    id = parseInt(id);
    var data = { Name: expense_name,
                 Amount : expense_amount, 
                 Category : {id}, 
                 userGuid : Guid, 
                 Timestamp : "2019-01-01 01:01:01"}; // Include actual time (extra)

    fetch(target_url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json; odata=verbose",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: JSON.stringify(data), 
    })
    .then(response => response.json())
    .then(jsonData => user = jsonData)
    .catch(err => {
            //error block
    });

    refresh();
}

function refresh() {
    window.location.reload()

}

/* 
 * Charts:
 */
function add_pie_chart(categories ,expenses)
{
    var cat_names = new Array(categories.length);
    var cat_id = new Array(categories.length);
    var cat_amount = new Array(categories.length);

    for (var i = 0; i < categories.length; i++){
        cat_names[i] = categories[i].name;
        cat_id[i] = categories[i].id;
        cat_amount[i] = 0;
    }
    
    for (var j = 0; j < expenses.length; j++){
        
        var index = cat_id.indexOf(expenses[j].category.id);
        cat_amount[index] += expenses[j].amount;
    }


    var ctx =  document.getElementById("pieChart").getContext('2d');
    var chart = new Chart(ctx, {
        // type we want to create
        type: 'doughnut', 
        // The data for our dataset
        data: {
            datasets: [{
                backgroundColor: _colors,
                data: cat_amount
            }],
        
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: cat_names
        },
        // Configuration options go here
        options: {}
    });
}

function add_bar_chart(categories, expenses)
{
    var contianer = document.getElementById("bar-chart");
    
    // create divs for the bar chart
    for (var i = 0; i < categories.length; i++)
    {
        var category = categories[i];
        var cat_div = document.createElement("div");
        cat_div.setAttribute("Class", "cat-bar-div");
        var name = document.createElement("h5");
        name.innerHTML = category.name;

        var chart = document.createElement("div");

        chart.setAttribute("id", "progressbar"+i);
        chart.setAttribute("class","progressbar");
        cat_div.appendChild(name);
        cat_div.appendChild(chart);
        contianer.appendChild(cat_div);
    }

    for (var i = 0; i < categories.length; i++)
    {
        var category = categories[i];
        var total_expense = 0;
        // get remaining budget
        expenses.forEach(expense => {
            if(expense.name != null && expense.category != null) {
                // add up max budget
                if(expense.category.id == category.id) 
                    total_expense += expense.amount;
            }
        });

        var percentage = Math.round(total_expense / category.maxAmount * 100);

        $('#progressbar'+i).LineProgressbar({
            percentage: percentage,
            fillBackgroundColor: _colors[i],
            height: '10px'
        }); 
    }
}