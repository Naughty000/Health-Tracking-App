class HealthTracker {
    constructor() {
        this.state = {
            meals: [],
            waterIntake: 0,
            weightLog: [],
            dailyGoal: 2000,
            currentDay: new Date().toISOString().split('T')[0],
            editingMealId: null,
            notification: null,
            selectedDate: new Date().toISOString().split('T')[0],
            foodDatabase: [
                { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
                { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
                { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
                { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 },
                { name: 'Egg (large)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0 },
                { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
                { name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1 },
                { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5 },
                { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0 },
                { name: 'Avocado (medium)', calories: 240, protein: 3, carbs: 12, fat: 22, fiber: 10 },
                { name: 'Whole Wheat Bread (slice)', calories: 69, protein: 3.6, carbs: 12, fat: 1.1, fiber: 1.9 },
                { name: 'Milk (1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0 },
                { name: 'Orange (medium)', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1 },
                { name: 'Potato (medium)', calories: 161, protein: 4.3, carbs: 37, fat: 0.2, fiber: 4.7 },
                { name: 'Spinach (1 cup)', calories: 7, protein: 0.9, carbs: 1, fat: 0.1, fiber: 0.7 },
                { name: 'Oatmeal (1 cup cooked)', calories: 166, protein: 6, carbs: 28, fat: 3.6, fiber: 4 },
                { name: 'Pasta (1 cup cooked)', calories: 221, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 },
                { name: 'Cheese (28g)', calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0 },
                { name: 'Beef (100g)', calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0 },
                { name: 'Carrot (medium)', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7 }
            ]
        };
        
        this.mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
        this.loadFromLocalStorage();
        this.render();
        this.setupEventListeners();
    }
    
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('healthTrackerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.state.meals = data.meals || [];
            this.state.waterIntake = data.waterIntake || 0;
            this.state.weightLog = data.weightLog || [];
            this.state.dailyGoal = data.dailyGoal || 2000;
            this.state.selectedDate = data.selectedDate || new Date().toISOString().split('T')[0];
        }
    }
    
    saveToLocalStorage() {
        localStorage.setItem('healthTrackerData', JSON.stringify({
            meals: this.state.meals,
            waterIntake: this.state.waterIntake,
            weightLog: this.state.weightLog,
            dailyGoal: this.state.dailyGoal,
            selectedDate: this.state.selectedDate
        }));
    }
    
    showNotification(type, message) {
        this.state.notification = { type, message };
        this.render();
        setTimeout(() => {
            this.state.notification = null;
            this.render();
        }, 3000);
    }
    
    addMeal(meal) {
        if (!meal.name || !meal.calories || meal.calories <= 0) {
            this.showNotification('error', 'Please fill all fields with valid data');
            return;
        }
        
        const newMeal = {
            id: Date.now(),
            ...meal,
            date: this.state.selectedDate,
            timestamp: new Date().toISOString()
        };
        
        if (this.state.editingMealId) {
            const index = this.state.meals.findIndex(m => m.id === this.state.editingMealId);
            if (index !== -1) {
                this.state.meals[index] = { ...newMeal, id: this.state.editingMealId };
                this.showNotification('success', 'Meal updated successfully');
            }
            this.state.editingMealId = null;
        } else {
            this.state.meals.unshift(newMeal);
            this.showNotification('success', 'Meal added successfully');
        }
        
        this.saveToLocalStorage();
        this.render();
    }
    
    deleteMeal(id) {
        this.state.meals = this.state.meals.filter(meal => meal.id !== id);
        this.saveToLocalStorage();
        this.showNotification('info', 'Meal deleted');
        this.render();
    }
    
    editMeal(meal) {
        this.state.editingMealId = meal.id;
        document.getElementById('mealName').value = meal.name;
        document.getElementById('mealCalories').value = meal.calories;
        document.getElementById('mealType').value = meal.type;
        document.getElementById('mealProtein').value = meal.protein || '';
        document.getElementById('mealCarbs').value = meal.carbs || '';
        document.getElementById('mealFat').value = meal.fat || '';
        document.getElementById('mealFiber').value = meal.fiber || '';
        document.getElementById('mealQuantity').value = meal.quantity || 1;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.render();
    }
    
    addWater() {
        this.state.waterIntake += 250; // 250ml per glass
        if (this.state.waterIntake > 4000) this.state.waterIntake = 4000;
        this.saveToLocalStorage();
        this.showNotification('success', 'Water intake added');
        this.render();
    }
    
    resetWater() {
        this.state.waterIntake = 0;
        this.saveToLocalStorage();
        this.render();
    }
    
    addWeight(weight) {
        if (!weight || weight <= 0) {
            this.showNotification('error', 'Please enter a valid weight');
            return;
        }
        
        const weightEntry = {
            date: this.state.selectedDate,
            weight: parseFloat(weight),
            timestamp: new Date().toISOString()
        };
        
        // Remove existing weight entry for same date
        this.state.weightLog = this.state.weightLog.filter(w => w.date !== this.state.selectedDate);
        this.state.weightLog.unshift(weightEntry);
        
        // Keep only last 30 entries
        if (this.state.weightLog.length > 30) {
            this.state.weightLog = this.state.weightLog.slice(0, 30);
        }
        
        this.saveToLocalStorage();
        this.showNotification('success', 'Weight logged successfully');
        document.getElementById('weightInput').value = '';
        this.render();
    }
    
    getDailyCalories() {
        return this.state.meals
            .filter(meal => meal.date === this.state.selectedDate)
            .reduce((total, meal) => total + (meal.calories * (meal.quantity || 1)), 0);
    }
    
    getDailyMacros() {
        const dailyMeals = this.state.meals.filter(meal => meal.date === this.state.selectedDate);
        return {
            protein: dailyMeals.reduce((total, meal) => total + ((meal.protein || 0) * (meal.quantity || 1)), 0),
            carbs: dailyMeals.reduce((total, meal) => total + ((meal.carbs || 0) * (meal.quantity || 1)), 0),
            fat: dailyMeals.reduce((total, meal) => total + ((meal.fat || 0) * (meal.quantity || 1)), 0),
            fiber: dailyMeals.reduce((total, meal) => total + ((meal.fiber || 0) * (meal.quantity || 1)), 0)
        };
    }
    
    getCalorieProgress() {
        const dailyCalories = this.getDailyCalories();
        return Math.min((dailyCalories / this.state.dailyGoal) * 100, 100);
    }
    
    getWaterProgress() {
        const goal = 2000; // 2 liters
        return Math.min((this.state.waterIntake / goal) * 100, 100);
    }
    
    generateMealPlan() {
        const mealPlan = {
            breakfast: {
                name: 'Oatmeal with fruits',
                calories: 350,
                protein: 12,
                carbs: 60,
                fat: 6,
                fiber: 8
            },
            lunch: {
                name: 'Grilled Chicken Salad',
                calories: 450,
                protein: 35,
                carbs: 20,
                fat: 15,
                fiber: 6
            },
            dinner: {
                name: 'Salmon with vegetables',
                calories: 500,
                protein: 40,
                carbs: 25,
                fat: 20,
                fiber: 8
            },
            snack: {
                name: 'Greek Yogurt with nuts',
                calories: 200,
                protein: 15,
                carbs: 12,
                fat: 10,
                fiber: 2
            }
        };
        
        // Add generated meals
        Object.entries(mealPlan).forEach(([type, meal]) => {
            this.addMeal({
                name: meal.name,
                calories: meal.calories,
                type: type.charAt(0).toUpperCase() + type.slice(1),
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
                fiber: meal.fiber,
                quantity: 1
            });
        });
        
        this.showNotification('success', 'Daily meal plan generated');
    }
    
    searchFood(query) {
        if (!query.trim()) return [];
        return this.state.foodDatabase.filter(food =>
            food.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addMealBtn') {
                e.preventDefault();
                this.addMeal({
                    name: document.getElementById('mealName').value,
                    calories: parseFloat(document.getElementById('mealCalories').value),
                    type: document.getElementById('mealType').value,
                    protein: parseFloat(document.getElementById('mealProtein').value) || 0,
                    carbs: parseFloat(document.getElementById('mealCarbs').value) || 0,
                    fat: parseFloat(document.getElementById('mealFat').value) || 0,
                    fiber: parseFloat(document.getElementById('mealFiber').value) || 0,
                    quantity: parseFloat(document.getElementById('mealQuantity').value) || 1
                });
                
                // Reset form
                document.getElementById('mealName').value = '';
                document.getElementById('mealCalories').value = '';
                document.getElementById('mealProtein').value = '';
                document.getElementById('mealCarbs').value = '';
                document.getElementById('mealFat').value = '';
                document.getElementById('mealFiber').value = '';
                document.getElementById('mealQuantity').value = 1;
            }
            
            if (e.target.id === 'addWaterBtn') {
                this.addWater();
            }
            
            if (e.target.id === 'resetWaterBtn') {
                this.resetWater();
            }
            
            if (e.target.id === 'addWeightBtn') {
                const weight = document.getElementById('weightInput').value;
                this.addWeight(weight);
            }
            
            if (e.target.id === 'generateMealPlanBtn') {
                this.generateMealPlan();
            }
            
            if (e.target.id === 'exportDataBtn') {
                this.exportData();
            }
            
            if (e.target.id === 'importDataBtn') {
                document.getElementById('importDataInput').click();
            }
            
            if (e.target.id === 'printNutritionLabel') {
                this.printNutritionLabel();
            }
            
            if (e.target.classList.contains('delete-btn-health')) {
                const id = parseInt(e.target.dataset.id);
                this.deleteMeal(id);
            }
            
            if (e.target.classList.contains('edit-btn-health')) {
                const id = parseInt(e.target.dataset.id);
                const meal = this.state.meals.find(m => m.id === id);
                if (meal) this.editMeal(meal);
            }
            
            if (e.target.classList.contains('calendar-day')) {
                const date = e.target.dataset.date;
                this.state.selectedDate = date;
                this.saveToLocalStorage();
                this.render();
            }
            
            if (e.target.classList.contains('food-result')) {
                const foodName = e.target.dataset.name;
                const food = this.state.foodDatabase.find(f => f.name === foodName);
                if (food) {
                    document.getElementById('mealName').value = food.name;
                    document.getElementById('mealCalories').value = food.calories;
                    document.getElementById('mealProtein').value = food.protein;
                    document.getElementById('mealCarbs').value = food.carbs;
                    document.getElementById('mealFat').value = food.fat;
                    document.getElementById('mealFiber').value = food.fiber;
                    document.getElementById('foodSearchResults').innerHTML = '';
                }
            }
        });
        
        document.addEventListener('input', (e) => {
            if (e.target.id === 'foodSearch') {
                const query = e.target.value;
                const results = this.searchFood(query);
                const resultsContainer = document.getElementById('foodSearchResults');
                
                if (query && results.length > 0) {
                    resultsContainer.innerHTML = results.map(food => `
                        <div class="food-result p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-50" data-name="${food.name}">
                            <div class="flex justify-between items-center">
                                <span class="font-medium">${food.name}</span>
                                <span class="text-sm text-gray-600">${food.calories} cal</span>
                            </div>
                            <div class="flex gap-2 mt-1">
                                <span class="nutrient-badge nutrient-protein">P: ${food.protein}g</span>
                                <span class="nutrient-badge nutrient-carbs">C: ${food.carbs}g</span>
                                <span class="nutrient-badge nutrient-fat">F: ${food.fat}g</span>
                            </div>
                        </div>
                    `).join('');
                } else {
                    resultsContainer.innerHTML = '';
                }
            }
            
            if (e.target.id === 'dailyGoalInput') {
                this.state.dailyGoal = Math.max(0, parseInt(e.target.value) || 2000);
                this.saveToLocalStorage();
                this.render();
            }
        });
        
        document.getElementById('importDataInput')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.state.meals = data.meals || [];
                    this.state.waterIntake = data.waterIntake || 0;
                    this.state.weightLog = data.weightLog || [];
                    this.state.dailyGoal = data.dailyGoal || 2000;
                    this.saveToLocalStorage();
                    this.showNotification('success', 'Data imported successfully');
                    this.render();
                } catch (error) {
                    this.showNotification('error', 'Invalid file format');
                }
            };
            reader.readAsText(file);
        });
    }
    
    exportData() {
        const data = {
            meals: this.state.meals,
            waterIntake: this.state.waterIntake,
            weightLog: this.state.weightLog,
            dailyGoal: this.state.dailyGoal,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `health-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showNotification('success', 'Data exported successfully');
    }
    
    printNutritionLabel() {
        const dailyMeals = this.state.meals.filter(meal => meal.date === this.state.selectedDate);
        const totalCalories = this.getDailyCalories();
        const macros = this.getDailyMacros();
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Nutrition Label - ${this.state.selectedDate}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .nutrition-label { 
                        border: 3px solid black; 
                        padding: 20px; 
                        max-width: 300px; 
                        margin: 0 auto;
                    }
                    hr { border: none; border-top: 6px solid black; margin: 10px 0; }
                    .thin-hr { border-top: 1px solid black; }
                    .thick-hr { border-top: 8px solid black; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .bold { font-weight: bold; }
                    .indent { padding-left: 20px; }
                </style>
            </head>
            <body>
                <div class="nutrition-label">
                    <h1 class="text-center" style="margin: 0; font-size: 32px;">Nutrition Facts</h1>
                    <hr>
                    <p>Daily Summary for ${new Date(this.state.selectedDate).toLocaleDateString()}</p>
                    <p class="bold">Total Servings: ${dailyMeals.length} meals</p>
                    <hr class="thick-hr">
                    
                    <p class="bold">Amount per Day</p>
                    <div style="display: flex; justify-content: space-between;">
                        <span class="bold">Calories</span>
                        <span class="bold">${totalCalories}</span>
                    </div>
                    <hr>
                    
                    <p class="bold" style="text-align: right;">% Daily Value *</p>
                    <hr>
                    
                    <div style="display: flex; justify-content: space-between;">
                        <span class="bold">Total Fat</span>
                        <span>${macros.fat.toFixed(1)}g</span>
                        <span class="bold">${Math.round((macros.fat / 78) * 100)}%</span>
                    </div>
                    <hr class="thin-hr">
                    
                    <div class="indent" style="display: flex; justify-content: space-between;">
                        <span>Saturated Fat</span>
                        <span>${(macros.fat * 0.3).toFixed(1)}g</span>
                        <span class="bold">${Math.round((macros.fat * 0.3 / 20) * 100)}%</span>
                    </div>
                    <hr class="thin-hr">
                    
                    <div style="display: flex; justify-content: space-between;">
                        <span class="bold">Cholesterol</span>
                        <span>${(macros.fat * 0.2).toFixed(1)}mg</span>
                        <span class="bold">${Math.round((macros.fat * 0.2 / 300) * 100)}%</span>
                    </div>
                    <hr class="thin-hr">
                    
                    <div style="display: flex; justify-content: space-between;">
                        <span class="bold">Sodium</span>
                        <span>${(totalCalories * 0.001).toFixed(1)}mg</span>
                        <span class="bold">${Math.round((totalCalories * 0.001 / 2300) * 100)}%</span>
                    </div>
                    <hr class="thin-hr">
                    
                    <div style="display: flex; justify-content: space-between;">
                        <span class="bold">Total Carbohydrate</span>
                        <span>${macros.carbs.toFixed(1)}g</span>
                        <span class="bold">${Math.round((macros.carbs / 275) * 100)}%</span>
                    </div>
                    <hr class="thin-hr">
                    
                    <div class="indent" style="display: flex; justify-content: space-between;">
                        <span>Dietary Fiber</span>
                        <span>${macros.fiber.toFixed(1)}g</span>
                        <span class="bold">${Math.round((macros.fiber / 28) * 100)}%</span>
                    </div>
                    <hr class="thin-hr">
                    
                    <div class="indent" style="display: flex; justify-content: space-between;">
                        <span>Total Sugars</span>
                        <span>${(macros.carbs * 0.2).toFixed(1)}g</span>
                        <span> </span>
                    </div>
                    <hr class="thin-hr">
                    
                    <div style="display: flex; justify-content: space-between;">
                        <span class="bold">Protein</span>
                        <span>${macros.protein.toFixed(1)}g</span>
                        <span class="bold">${Math.round((macros.protein / 50) * 100)}%</span>
                    </div>
                    <hr class="thick-hr">
                    
                    <p style="font-size: 12px; margin-top: 20px;">
                        * The % Daily Value (DV) tells you how much a nutrient in a day of food contributes to a daily diet. 
                        2,000 calories a day is used for general nutrition advice.
                    </p>
                    
                    <hr class="thick-hr">
                    <p class="text-center" style="margin-top: 20px;">
                        Generated by Health Tracking App<br>
                        ${new Date().toLocaleDateString()}
                    </p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
    
    generateCalendar() {
        const currentDate = new Date(this.state.selectedDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let calendarHTML = '';
        
        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        calendarHTML += '<div class="grid grid-cols-7 gap-1 mb-2">';
        dayNames.forEach(day => {
            calendarHTML += `<div class="text-center text-sm font-medium text-gray-500">${day}</div>`;
        });
        calendarHTML += '</div>';
        
        // Add empty cells for days before first day
        calendarHTML += '<div class="grid grid-cols-7 gap-1">';
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarHTML += '<div></div>';
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasMeals = this.state.meals.some(meal => meal.date === dateStr);
            const isSelected = dateStr === this.state.selectedDate;
            
            calendarHTML += `
                <div class="calendar-day ${isSelected ? 'active' : ''} ${hasMeals ? 'has-data' : ''}"
                     data-date="${dateStr}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        return calendarHTML;
    }
    
    renderWeightChart() {
        const last7Entries = this.state.weightLog.slice(0, 7).reverse();
        if (last7Entries.length < 2) return '<p class="text-gray-500 text-center">Add more weight entries to see trend</p>';
        
        const weights = last7Entries.map(entry => entry.weight);
        const dates = last7Entries.map(entry => 
            new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })
        );
        
        const maxWeight = Math.max(...weights);
        const minWeight = Math.min(...weights);
        const range = maxWeight - minWeight;
        
        const points = weights.map((weight, index) => {
            const x = (index * 80) + 40;
            const y = range === 0 ? 100 : 200 - ((weight - minWeight) / range * 180);
            return `${x},${y}`;
        }).join(' ');
        
        return `
            <div class="relative h-64">
                <svg class="w-full h-full">
                    <!-- Grid lines -->
                    ${Array.from({ length: 5 }).map((_, i) => `
                        <line x1="40" y1="${40 + i * 40}" x2="${40 + (weights.length - 1) * 80}" y2="${40 + i * 40}" 
                              stroke="#e5e7eb" stroke-width="1" />
                        <text x="20" y="${45 + i * 40}" class="text-xs fill-gray-500">
                            ${(maxWeight - (range / 4 * i)).toFixed(1)}
                        </text>
                    `).join('')}
                    
                    <!-- Trend line -->
                    <polyline points="${points}" fill="none" class="weight-trend-line" />
                    
                    <!-- Data points -->
                    ${weights.map((weight, index) => `
                        <circle cx="${40 + index * 80}" cy="${range === 0 ? 100 : 200 - ((weight - minWeight) / range * 180)}" 
                                r="4" fill="#10b981" />
                        <text x="${40 + index * 80}" y="240" text-anchor="middle" class="text-xs fill-gray-600">
                            ${dates[index]}
                        </text>
                        <text x="${40 + index * 80}" y="${range === 0 ? 90 : 190 - ((weight - minWeight) / range * 180) - 10}" 
                              text-anchor="middle" class="text-xs font-medium fill-gray-800">
                            ${weight.toFixed(1)}
                        </text>
                    `).join('')}
                </svg>
            </div>
        `;
    }
    
    render() {
        const dailyCalories = this.getDailyCalories();
        const calorieProgress = this.getCalorieProgress();
        const waterProgress = this.getWaterProgress();
        const macros = this.getDailyMacros();
        const dailyMeals = this.state.meals.filter(meal => meal.date === this.state.selectedDate);
        
        document.getElementById('app').innerHTML = `
            <div class="health-container max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                ${this.state.notification ? `
                    <div class="health-notification ${this.state.notification.type} animate-slideIn">
                        ${this.state.notification.message}
                    </div>
                ` : ''}
                
                <header class="text-center mb-10">
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        <i class="fas fa-heartbeat text-green-600 mr-3"></i>
                        Health & Nutrition Tracker
                    </h1>
                    <p class="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
                        Track calories, monitor nutrition, plan meals, and visualize your health progress
                    </p>
                    <div class="flex flex-wrap justify-center gap-2 mb-6">
                        <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            <i class="fab fa-js mr-1"></i>JavaScript
                        </span>
                        <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                            <i class="fab fa-html5 mr-1"></i>HTML5
                        </span>
                        <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            <i class="fab fa-css3-alt mr-1"></i>CSS3
                        </span>
                        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            <i class="fas fa-database mr-1"></i>Local Storage
                        </span>
                    </div>
                </header>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <!-- Left Column - Stats -->
                    <div class="space-y-8">
                        <div class="calorie-card health-card p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <p class="text-sm opacity-90">Calories Today</p>
                                    <p class="text-3xl font-bold">${dailyCalories}</p>
                                    <p class="text-sm opacity-90">Goal: ${this.state.dailyGoal} cal</p>
                                </div>
                                <div class="text-3xl">
                                    <i class="fas fa-fire"></i>
                                </div>
                            </div>
                            <div class="progress-bar-container mb-2">
                                <div class="progress-bar-fill bg-white" style="width: ${calorieProgress}%"></div>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>0</span>
                                <span>${Math.round(calorieProgress)}%</span>
                                <span>Goal</span>
                            </div>
                            <div class="mt-4">
                                <label class="block text-sm opacity-90 mb-2">Daily Calorie Goal</label>
                                <input type="number" id="dailyGoalInput" value="${this.state.dailyGoal}" 
                                       class="bg-transparent border border-white/30 rounded-lg p-2 text-white w-full">
                            </div>
                        </div>
                        
                        <div class="water-card health-card p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <p class="text-sm opacity-90">Water Intake</p>
                                    <p class="text-3xl font-bold">${this.state.waterIntake} ml</p>
                                    <p class="text-sm opacity-90">Goal: 2000 ml</p>
                                </div>
                                <div class="text-3xl">
                                    <i class="fas fa-tint"></i>
                                </div>
                            </div>
                            <div class="progress-bar-container mb-2">
                                <div class="progress-bar-fill bg-white" style="width: ${waterProgress}%"></div>
                            </div>
                            <div class="flex justify-center gap-4 mt-6">
                                <button id="addWaterBtn" class="btn-health-secondary">
                                    <i class="fas fa-plus mr-2"></i>Add Glass (250ml)
                                </button>
                                <button id="resetWaterBtn" class="btn-health-secondary">
                                    <i class="fas fa-redo mr-2"></i>Reset
                                </button>
                            </div>
                        </div>
                        
                        <div class="health-card p-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">
                                <i class="fas fa-weight-scale mr-2 text-purple-600"></i>Weight Tracker
                            </h3>
                            <div class="flex gap-4 mb-4">
                                <input type="number" id="weightInput" step="0.1" placeholder="Enter weight (kg)" 
                                       class="input-health flex-1">
                                <button id="addWeightBtn" class="btn-health-primary">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            ${this.renderWeightChart()}
                        </div>
                    </div>
                    
                    <!-- Middle Column - Add Meal & Calendar -->
                    <div class="space-y-8">
                        <div class="health-card p-6">
                            <h3 class="text-xl font-bold text-gray-800 mb-6">
                                <i class="fas fa-utensils mr-3"></i>
                                ${this.state.editingMealId ? 'Edit Meal' : 'Add New Meal'}
                            </h3>
                            
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-2 font-medium">Food Search</label>
                                <input type="text" id="foodSearch" placeholder="Search food database..." 
                                       class="input-health mb-2">
                                <div id="foodSearchResults" class="max-h-40 overflow-y-auto"></div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium">Food Name</label>
                                    <input type="text" id="mealName" placeholder="e.g., Apple, Chicken Breast..." 
                                           class="input-health" required>
                                </div>
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium">Calories</label>
                                    <input type="number" id="mealCalories" step="1" placeholder="Calories" 
                                           class="input-health" required>
                                </div>
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium">Meal Type</label>
                                    <select id="mealType" class="select-health">
                                        ${this.mealTypes.map(type => `
                                            <option value="${type}">${type}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium">Quantity</label>
                                    <input type="number" id="mealQuantity" step="0.5" value="1" min="0.1" 
                                           class="input-health">
                                </div>
                            </div>
                            
                            <h4 class="font-bold text-gray-700 mb-3">Nutrition Information (per serving)</h4>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium text-sm">Protein (g)</label>
                                    <input type="number" id="mealProtein" step="0.1" placeholder="0" 
                                           class="input-health">
                                </div>
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium text-sm">Carbs (g)</label>
                                    <input type="number" id="mealCarbs" step="0.1" placeholder="0" 
                                           class="input-health">
                                </div>
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium text-sm">Fat (g)</label>
                                    <input type="number" id="mealFat" step="0.1" placeholder="0" 
                                           class="input-health">
                                </div>
                                <div>
                                    <label class="block text-gray-700 mb-2 font-medium text-sm">Fiber (g)</label>
                                    <input type="number" id="mealFiber" step="0.1" placeholder="0" 
                                           class="input-health">
                                </div>
                            </div>
                            
                            <button id="addMealBtn" class="btn-health-primary w-full">
                                <i class="fas ${this.state.editingMealId ? 'fa-save' : 'fa-plus-circle'} mr-2"></i>
                                ${this.state.editingMealId ? 'Update Meal' : 'Add Meal'}
                            </button>
                        </div>
                        
                        <div class="health-card p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-lg font-bold text-gray-800">
                                    <i class="fas fa-calendar-alt mr-2 text-blue-600"></i>Calendar
                                </h3>
                                <div class="text-gray-600">
                                    ${new Date(this.state.selectedDate).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </div>
                            </div>
                            ${this.generateCalendar()}
                        </div>
                    </div>
                    
                    <!-- Right Column - Macros & Actions -->
                    <div class="space-y-8">
                        <div class="health-card p-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">
                                <i class="fas fa-chart-pie mr-2 text-green-600"></i>Daily Macros
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <div class="flex justify-between mb-1">
                                        <span class="font-medium">Protein</span>
                                        <span class="font-bold">${macros.protein.toFixed(1)}g</span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill bg-red-500" 
                                             style="width: ${Math.min((macros.protein / 100) * 100, 100)}%"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between mb-1">
                                        <span class="font-medium">Carbohydrates</span>
                                        <span class="font-bold">${macros.carbs.toFixed(1)}g</span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill bg-blue-500" 
                                             style="width: ${Math.min((macros.carbs / 300) * 100, 100)}%"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between mb-1">
                                        <span class="font-medium">Fat</span>
                                        <span class="font-bold">${macros.fat.toFixed(1)}g</span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill bg-yellow-500" 
                                             style="width: ${Math.min((macros.fat / 70) * 100, 100)}%"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between mb-1">
                                        <span class="font-medium">Fiber</span>
                                        <span class="font-bold">${macros.fiber.toFixed(1)}g</span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill bg-green-500" 
                                             style="width: ${Math.min((macros.fiber / 30) * 100, 100)}%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6 grid grid-cols-2 gap-4">
                                <div class="text-center p-3 bg-gray-50 rounded-lg">
                                    <div class="text-2xl font-bold text-green-600">${dailyMeals.length}</div>
                                    <div class="text-sm text-gray-600">Meals Today</div>
                                </div>
                                <div class="text-center p-3 bg-gray-50 rounded-lg">
                                    <div class="text-2xl font-bold text-blue-600">${this.state.weightLog.length}</div>
                                    <div class="text-sm text-gray-600">Weight Entries</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="health-card p-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">
                                <i class="fas fa-cogs mr-2 text-gray-600"></i>Quick Actions
                            </h3>
                            <div class="space-y-3">
                                <button id="generateMealPlanBtn" class="btn-health-secondary w-full text-left">
                                    <i class="fas fa-robot mr-2"></i>Generate Daily Meal Plan
                                </button>
                                <button id="printNutritionLabel" class="btn-health-secondary w-full text-left">
                                    <i class="fas fa-print mr-2"></i>Print Nutrition Label
                                </button>
                                <button id="exportDataBtn" class="btn-health-secondary w-full text-left">
                                    <i class="fas fa-download mr-2"></i>Export All Data
                                </button>
                                <label class="btn-health-secondary w-full text-left cursor-pointer block">
                                    <i class="fas fa-upload mr-2"></i>Import Data
                                    <input type="file" id="importDataInput" accept=".json" class="hidden">
                                </label>
                            </div>
                        </div>
                        
                        <div class="health-card p-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">
                                <i class="fas fa-info-circle mr-2 text-purple-600"></i>Today's Nutrition
                            </h3>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>Total Calories:</span>
                                    <span class="font-bold">${dailyCalories} cal</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Remaining Calories:</span>
                                    <span class="font-bold ${this.state.dailyGoal - dailyCalories < 0 ? 'text-red-600' : 'text-green-600'}">
                                        ${this.state.dailyGoal - dailyCalories} cal
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Water Intake:</span>
                                    <span class="font-bold">${this.state.waterIntake} ml / 2000 ml</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Meals Logged:</span>
                                    <span class="font-bold">${dailyMeals.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Meal History -->
                <div class="health-card p-6 mb-8">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-800">
                            <i class="fas fa-history mr-3"></i>Today's Meal History
                        </h3>
                        <div class="text-gray-600">
                            ${dailyMeals.length} meals logged
                        </div>
                    </div>
                    
                    ${dailyMeals.length === 0 ? `
                        <div class="text-center py-12 text-gray-500">
                            <i class="fas fa-utensils text-4xl mb-4"></i>
                            <p class="text-lg">No meals logged today</p>
                            <p class="text-sm">Add your first meal above</p>
                        </div>
                    ` : `
                        <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
                            ${dailyMeals.map(meal => `
                                <div class="meal-card ${meal.type.toLowerCase()} p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3 mb-2">
                                                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    ${meal.type}
                                                </span>
                                                <span class="text-lg font-bold text-gray-800">${meal.name}</span>
                                            </div>
                                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                                <div class="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div class="text-xl font-bold text-red-600">${meal.calories * (meal.quantity || 1)}</div>
                                                    <div class="text-xs text-gray-600">Calories</div>
                                                </div>
                                                <div class="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div class="text-lg font-bold text-blue-600">${((meal.protein || 0) * (meal.quantity || 1)).toFixed(1)}g</div>
                                                    <div class="text-xs text-gray-600">Protein</div>
                                                </div>
                                                <div class="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div class="text-lg font-bold text-green-600">${((meal.carbs || 0) * (meal.quantity || 1)).toFixed(1)}g</div>
                                                    <div class="text-xs text-gray-600">Carbs</div>
                                                </div>
                                                <div class="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div class="text-lg font-bold text-yellow-600">${((meal.fat || 0) * (meal.quantity || 1)).toFixed(1)}g</div>
                                                    <div class="text-xs text-gray-600">Fat</div>
                                                </div>
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                Added: ${new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                ${meal.quantity > 1 ? ` × ${meal.quantity}` : ''}
                                            </div>
                                        </div>
                                        <div class="flex gap-2 ml-4">
                                            <button class="edit-btn-health" data-id="${meal.id}" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="delete-btn-health" data-id="${meal.id}" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
                
                <footer class="text-center text-gray-600 text-sm mt-8 pt-8 border-t border-gray-200">
                    <p>Health & Nutrition Tracker | Built with JavaScript, HTML5, CSS3 & Local Storage</p>
                    <p class="mt-2">
                        Data stored locally in your browser | Total Meals: ${this.state.meals.length} | 
                        Water Today: ${this.state.waterIntake}ml
                    </p>
                </footer>
            </div>
        `;
        
        this.setupEventListeners();
    }
}

// Initialize the app
new HealthTracker();
