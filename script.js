const todayKey = new Date().toLocaleDateString();
const defaultMeals = [{name: "Protein Shake", cals: 200}, {name: "Snack", cals: 150}];

function toggleMenu() { 
    document.getElementById('sideMenu').classList.toggle('open'); 
}

function openQuickAdd() {
    document.getElementById('modalOverlay').style.display = 'block';
    setTimeout(() => document.getElementById('quickAddModal').classList.add('open'), 10);
}

function closeQuickAdd() {
    document.getElementById('quickAddModal').classList.remove('open');
    setTimeout(() => {
        document.getElementById('modalOverlay').style.display = 'none';
    }, 300);
}

function render() {
    const history = JSON.parse(localStorage.getItem('calHistory')) || {};
    const meals = JSON.parse(localStorage.getItem('customMeals')) || defaultMeals;
    
    document.getElementById('total').innerText = history[todayKey] || 0;

    // Render Pop-up List
    const modalList = document.getElementById('modalMealList');
    modalList.innerHTML = "";
    meals.forEach(m => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.onclick = () => { addMeal(m.cals); closeQuickAdd(); };
        div.innerHTML = `<span>${m.name}</span> <b>+${m.cals}</b>`;
        modalList.appendChild(div);
    });

    // Render Sidebar Management List
    const manageList = document.getElementById('manageMealList');
    manageList.innerHTML = "<h4>My Custom List</h4>";
    meals.forEach((m, i) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.style.fontSize = "0.85rem";
        div.innerHTML = `${m.name} (${m.cals}) <span class="del-text" onclick="deleteMeal(${i})">Delete</span>`;
        manageList.appendChild(div);
    });

    // Render History
    const histList = document.getElementById('historyList');
    histList.innerHTML = "";
    Object.keys(history).sort().reverse().forEach(date => {
        if (date !== todayKey) {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `<span>${date}</span> <b>${history[date]}</b>`;
            histList.appendChild(div);
        }
    });
}

function saveNewMeal() {
    const nameInput = document.getElementById('newMealName');
    const calsInput = document.getElementById('newMealCals');
    const name = nameInput.value;
    const cals = parseInt(calsInput.value);

    if (name && cals) {
        const meals = JSON.parse(localStorage.getItem('customMeals')) || defaultMeals;
        meals.push({ name, cals });
        localStorage.setItem('customMeals', JSON.stringify(meals));
        nameInput.value = '';
        calsInput.value = '';
        render();
    }
}

function deleteMeal(index) {
    const meals = JSON.parse(localStorage.getItem('customMeals')) || defaultMeals;
    meals.splice(index, 1);
    localStorage.setItem('customMeals', JSON.stringify(meals));
    render();
}

function addMeal(amt) {
    let history = JSON.parse(localStorage.getItem('calHistory')) || {};
    history[todayKey] = (history[todayKey] || 0) + amt;
    localStorage.setItem('calHistory', JSON.stringify(history));
    render();
}

function addFromInput() {
    const input = document.getElementById('input');
    if (input.value) {
        addMeal(parseInt(input.value));
        input.value = '';
    }
}

function manualReset() {
    if (confirm("Clear today's calories?")) {
        let history = JSON.parse(localStorage.getItem('calHistory')) || {};
        history[todayKey] = 0;
        localStorage.setItem('calHistory', JSON.stringify(history));
        render();
        toggleMenu();
    }
}

function showPage(pageId) {
    // Hide both pages
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('caloriePage').style.display = 'none';
    
    // Show the selected page
    document.getElementById(pageId).style.display = (pageId === 'homeScreen') ? 'flex' : 'block';
    
    // If opening calorie page, make sure it renders the latest data
    if(pageId === 'caloriePage') render();
}
// Initial Launch
render();
