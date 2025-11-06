const button1 = document.querySelector(".button1");
const date1 = document.querySelector(".date1");
const cardsContainer = document.querySelector(".cards-container");
const colorOptions = document.querySelectorAll(".color-option");

let selectedColor = "#4CAF50";
let cardsData = JSON.parse(localStorage.getItem("cards")) || [];

// 🎨 Renk seçimi
colorOptions.forEach(option => {
  option.addEventListener("click", () => {
    colorOptions.forEach(o => o.classList.remove("selected"));
    option.classList.add("selected");
    selectedColor = option.dataset.color;
  });
});

function saveToLocalStorage() {
  localStorage.setItem("cards", JSON.stringify(cardsData));
}

// 📅 Tarihe göre sıralama (artan)
function sortCards() {
  cardsData.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderCards() {
  cardsContainer.innerHTML = "";
  cardsData.forEach(cardInfo => {
    const card = createCard(cardInfo);
    if (cardInfo.pinned) cardsContainer.prepend(card);
    else cardsContainer.appendChild(card);
  });
}

function createCard(cardInfo) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.style.borderColor = cardInfo.color;

  // 📌 Pin button
  const pinBtn = document.createElement("button");
  pinBtn.textContent = "📌";
  pinBtn.classList.add("pin-btn");
  let pinned = cardInfo.pinned || false;
  pinBtn.style.backgroundColor = pinned ? "#f44336" : "#ff9800";

  pinBtn.addEventListener("click", () => {
    pinned = !pinned;
    cardInfo.pinned = pinned;
    pinBtn.style.backgroundColor = pinned ? "#f44336" : "#ff9800";
    renderCards();
    saveToLocalStorage();
  });

  // 📅 Title (date)
  const title = document.createElement("h2");
  title.textContent = cardInfo.date;

  // ➕ Add task button
  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.classList.add("add-item");

  const ul = document.createElement("ul");

  // Görevleri yükle
  cardInfo.tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.classList.add("done-btn");

    doneBtn.addEventListener("click", () => {
      li.classList.add("completed");
      task.completed = true;
      saveToLocalStorage();
    });

    li.appendChild(doneBtn);
    ul.appendChild(li);
  });

  addButton.addEventListener("click", () => {
    const taskText = prompt("Enter new task:");
    if (!taskText) return;

    const li = document.createElement("li");
    li.textContent = taskText;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.classList.add("done-btn");

    doneBtn.addEventListener("click", () => {
      li.classList.add("completed");
      const t = cardInfo.tasks.find(t => t.text === taskText);
      if (t) t.completed = true;
      saveToLocalStorage();
    });

    li.appendChild(doneBtn);
    ul.appendChild(li);

    cardInfo.tasks.push({ text: taskText, completed: false });
    saveToLocalStorage();
  });

  // ❌ Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Card";
  deleteBtn.classList.add("delete-card");

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this card?")) {
      cardsData = cardsData.filter(c => c !== cardInfo);
      saveToLocalStorage();
      renderCards();
    }
  });

  card.appendChild(pinBtn);
  card.appendChild(title);
  card.appendChild(addButton);
  card.appendChild(ul);
  card.appendChild(deleteBtn);

  return card;
}

// 💾 LocalStorage'dan yükle
sortCards();
renderCards();

// ➕ Yeni kart oluştur
button1.addEventListener("click", () => {
  const dateValue = date1.value;
  if (!dateValue) return alert("Please select a date");

  const newCard = {
    date: dateValue,
    tasks: [],
    pinned: false,
    color: selectedColor
  };

  cardsData.push(newCard);
  sortCards();
  saveToLocalStorage();
  renderCards();

  date1.value = "";
});
