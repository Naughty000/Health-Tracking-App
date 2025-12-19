const budgetInput = document.querySelector("#budget");
const calculateBtn = document.querySelector("#Calculate");
const clearBtn = document.querySelector("#Clear");
const addEntryBtn = document.querySelector("#Entry");
const resultContainer = document.querySelector("#result");

const mealSections = {
    Breakfast: {
        element: document.querySelector("#Break"),
        calorieInput: document.querySelector("#cal1"),
        getCalories() { return parseInt(this.calorieInput.value) || 0; },
        isFood: true
    },
    Lunch: {
        element: document.querySelector("#lunc"),
        calorieInput: document.querySelector("#cal2"),
        getCalories() { return parseInt(this.calorieInput.value) || 0; },
        isFood: true
    },
    Dinner: {
        element: document.querySelector("#Din"),
        calorieInput: document.querySelector("#cal3"),
        getCalories() { return parseInt(this.calorieInput.value) || 0; },
        isFood: true
    },
    Snacks: {
        element: document.querySelector("#Snak"),
        calorieInput: document.querySelector("#cal4"),
        getCalories() { return parseInt(this.calorieInput.value) || 0; },
        isFood: true
    },
    Exercise: {
        element: document.querySelector("#Ex"),
        calorieInput: document.querySelector("#cal5"),
        getCalories() { return parseInt(this.calorieInput.value) || 0; },
        isFood: false
    }
};

let consumedCalories = 0;
let burnedCalories = 0;

// Function to update total calories
function updateTotals() {
    consumedCalories = 0;
    burnedCalories = 0;
    
    Object.keys(mealSections).forEach(key => {
        const section = mealSections[key];
        const calories = section.getCalories();
        
        if (section.isFood) {
            consumedCalories += calories;
        } else {
            burnedCalories += calories;
        }
    });
}

// Add Entry button click handler
addEntryBtn.addEventListener('click', () => {
    const selectElement = document.querySelector("#options");
    const selectedOption = selectElement.value;
    
    const section = mealSections[selectedOption];
    if (section) {
        section.element.style.display = "block";
        
        // Add event listener to update totals when calorie input changes
        section.calorieInput.addEventListener('input', updateTotals);
    }
});

// Calculate button click handler
calculateBtn.addEventListener('click', () => {
    const budget = parseInt(budgetInput.value) || 0;
    updateTotals();
    
    const netCalories = consumedCalories - burnedCalories;
    const difference = budget - netCalories;
    
    const resultElement = document.querySelector("#res");
    const consumedDisplay = document.querySelector("#consumed_calories");
    const burntDisplay = document.querySelector("#Burned_calories");
    const budgetDisplay = document.querySelector("#total_budget");
    
    resultContainer.style.display = "block";
    
    // Update display values
    budgetDisplay.textContent = `${budget} Calories Budgeted`;
    consumedDisplay.textContent = `${consumedCalories} Calories Consumed`;
    burntDisplay.textContent = `${burnedCalories} Calories Burned`;
    
    // Calculate and display result
    if (netCalories < budget) {
        resultElement.textContent = `${Math.abs(difference)} Calories Remaining (Deficit)`;
        resultElement.style.color = "green";
    } else if (netCalories > budget) {
        resultElement.textContent = `${Math.abs(difference)} Calories Over Budget (Surplus)`;
        resultElement.style.color = "red";
    } else {
        resultElement.textContent = "Perfectly on budget!";
        resultElement.style.color = "blue";
    }
});

// Clear button click handler
clearBtn.addEventListener('click', () => {
    // Reset all values
    budgetInput.value = "";
    consumedCalories = 0;
    burnedCalories = 0;
    
    // Hide all meal sections
    Object.values(mealSections).forEach(section => {
        if (section.element) {
            section.element.style.display = "none";
            section.calorieInput.value = "";
        }
    });
    
    // Hide result container
    resultContainer.style.display = "none";
    
    // Reset dropdown
    document.querySelector("#options").selectedIndex = 0;
});
