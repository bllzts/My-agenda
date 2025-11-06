const button1 = document.querySelector(".button1");
const date1 = document.querySelector(".date1");
const categoryInput = document.querySelector(".category-input");
const cardsContainer = document.querySelector(".cards-container");

let cardsData = JSON.parse(localStorage.getItem("cards")) || [];

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("cards", JSON.stringify(cardsData));
}

// Create card element
function createCard(cardInfo) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", "true");
  card.style.borderTop = `6px solid ${cardInfo.categoryColor || "#4caf50"}`;

  const pinBtn = document.createElement("button");
  pinBtn.textContent = "📌";
  pinBtn.classList.add("pin-btn");
  let pinned = cardInfo.pinned || false;
  pinBtn.style.backgroundColor = pinned ? "#f44336" : "#ff9800";

  pinBtn.addEventListener("click", () => {
    pinned = !pinned;
    cardInfo.pinned = pinned;
    if (pinned) cardsContainer.prepend(card);
    else cardsContainer.appendChild(card);
    pinBtn.style.backgroundColor = pinned ? "#f44336" : "#ff9800";
    saveToLocalStorage();
  });

  const title = document.createElement("h2");
  title.textContent = cardInfo.date;

  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.classList.add("add-item");

  const ul = document.createElement("ul");

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
      const task = cardInfo.tasks.find(t => t.text === taskText);
      if (task) task.completed = true;
      saveToLocalStorage();
    });

    li.appendChild(doneBtn);
    ul.appendChild(li);

    cardInfo.tasks.push({ text: taskText, completed: false });
    saveToLocalStorage();
  });

  card.appendChild(pinBtn);
  card.appendChild(title);
  card.appendChild(addButton);
  card.appendChild(ul);

  // Drag and drop
  card.addEventListener("dragstart", () => card.classList.add("dragging"));
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    // Update order in localStorage
    const newOrder = Array.from(cardsContainer.children).map(c => {
      return cardsData.find(cd => cd.date === c.querySelector("h2").textContent);
    });
    cardsData = newOrder;
    saveToLocalStorage();
  });

  return card;
}

// Load saved cards
cardsData.forEach(cardInfo => {
  const card = createCard(cardInfo);
  if (cardInfo.pinned) cardsContainer.prepend(card);
  else cardsContainer.appendChild(card);
});

// Create new card
button1.addEventListener("click", () => {
  const dateValue = date1.value;
  const categoryValue = categoryInput.value || "#4caf50";

  if (!dateValue) return alert("Please select a date");

  const newCard = {
    date: dateValue,
    tasks: [],
    pinned: false,
    categoryColor: categoryValue
  };

  cardsData.push(newCard);
  saveToLocalStorage();

  const cardElement = createCard(newCard);
  cardsContainer.appendChild(cardElement);

  date1.value = "";
  categoryInput.value = "";
});

// Drag and drop container
cardsContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(cardsContainer, e.clientX);
  const dragging = document.querySelector(".dragging");
  if (!dragging) return;

  if (afterElement == null) cardsContainer.appendChild(dragging);
  else cardsContainer.insertBefore(dragging, afterElement);
});

function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll(".card:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
