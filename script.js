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
    setTimeout(() => document.getElementById('modalOverlay').style.display = 'none', 300);
}

function render() {
    const history = JSON.parse(localStorage.getItem('calHistory')) || {};
    const meals = JSON.parse(localStorage.getItem('customMeals')) || defaultMeals;
    
    document.getElementById('total').innerText = history[todayKey] || 0;

    // Render Modal Pop-up List
    const modalList = document.getElementById('modalMealList');
    modalList.innerHTML = "";
    meals.forEach(m => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.onclick = () => { addMeal(m.cals); closeQuickAdd(); };
        div.innerHTML = `<span>${m.name}</span> <b>+${m.cals}</b>`;
        modalList.appendChild(div);
    });

    // Render Delete List in Sidebar
    const manageList = document.getElementById('manageMealList');
    manageList.innerHTML = "<h4>My Meals</h4>";
    meals.forEach((m, i) => {
        manageList.innerHTML += `<div class="list-item" style="font-size:0.8rem;">
            ${m.name} (${m.cals}) <span class="del-text" onclick="deleteMeal(${i})">Delete</span>
        </div>`;
    });

    // Render History
    const histList = document.getElementById('historyList');
    histList.innerHTML = "";
    Object.keys(history).sort().reverse().forEach(d => {
        if(d !== todayKey) {
            histList.innerHTML += `<div class="list-item"><span>${d}</span> <b>${history[d]}</b></div>`;
        }
    });
}

function saveNewMeal() {
    const n = document.getElementById('newMealName').value;
    const c = parseInt(document.getElementById('newMealCals').value);
    if(n && c) {
        const meals = JSON.parse(localStorage.getItem('customMeals')) || defaultMeals;
        meals.push({name: n, cals: c});
        localStorage.setItem('customMeals', JSON.stringify(meals));
        document.getElementById('newMealName').value = '';
        document.getElementById('newMealCals').value = '';
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
    let h = JSON.parse(localStorage.getItem('calHistory')) || {};
    h[todayKey] = (h[todayKey] || 0) + amt;
    localStorage.setItem('calHistory', JSON.stringify(h));
    render();
}

function addFromInput() {
    const i = document.getElementById('input');
    if(i.value) { addMeal(parseInt(i.value)); i.value = ''; }
}

function manualReset() {
    if(confirm("Reset today?")) {
        let h = JSON.parse(localStorage.getItem('calHistory')) || {};
        h[todayKey] = 0;
        localStorage.setItem('calHistory', JSON.stringify(h));
        render();
        toggleMenu();
    }
}

// Start the app
render();
