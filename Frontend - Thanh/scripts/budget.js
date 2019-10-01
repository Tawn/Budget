const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var max_budget;
var budget_leftover;
var categories;

window.onload = function () {

    // Initialize Variables
    max_budget = 0; // TODO: get budget (API)
    budget_leftover = 0; // subtract budget from expenses
    categories = []; // TODO: get categories (API)

    header_setup();
    // remaining_budget_setup();

    display_categories();
}

function display_categories() {
    var categories = document.getElementById("category-display");
    var h3 = document.createElement("h3");

    h3.innerHTML = "Example Category";
    categories.appendChild(h3);


}

function header_setup() {
    var today = new Date();
    var month = monthNames[today.getMonth()];
    var year = today.getFullYear();
    var h1 = document.createElement("h1");
    h1.innerHTML = month + " Budget " + year;

    var header = document.getElementById("header-display");
    header.appendChild(h1);

}

function set_budget() {
    var newBudget = parseInt(document.getElementById("new-budget").value);
    var display = "Max Budget: $" + newBudget;
    document.getElementById("max-budget-display").innerHTML = display;

    max_budget = newBudget;
    var display = "Remaining Budget: $" + max_budget;
    document.getElementById("remaining-budget-display").innerHTML = display;

}

