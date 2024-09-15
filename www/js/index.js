const button = document.querySelector("#send");
const messages = document.querySelector("#messages");
const input = document.querySelector("#input");
const settings = document.querySelector("#settings");
const startDate = JSON.parse(localStorage.getItem(`startDate`));
const newDate = (startDate && startDate.date) ? new Date(startDate.date) : new Date();
const previousId = JSON.parse(localStorage.getItem(`previousId`));
const CARDS_BOUGHT_PER_DAY = 30000;
let previous_id = previousId ? previousId.id + Math.floor(((new Date() - newDate)/86400000)*CARDS_BOUGHT_PER_DAY) : 0;

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  scrollToBottom();
  button.addEventListener("click", renderMessage);
  settings.addEventListener("click", settingsPrompt);
})

function formatSentDate(date) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${dayOfWeek}, ${month} ${day} / ${hours}:${minutes}`;
}

function formatDate(date) {
  date = new Date(date.getTime() + 90 * 60000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function formatDateForNotification(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function scrollToBottom() {
  const height = messages.scrollHeight;
  messages.scrollTo(0, height);
}

function formatId(id) {
  return String(id).padStart(9, '0')
}

function calculateNewId() {
  previous_id = previous_id + Math.floor(Math.random() * 20) + 1;
  localStorage.setItem(`previousId`, JSON.stringify({id: previous_id}))
  return previous_id;
}

function renderMessage() {
  if(input.value == "A90") {
    const message = document.createElement("div");
    message.id = "message";
    const new_id = formatId(calculateNewId());
    const currentDate = new Date();

    messages.appendChild(message);
    message.innerHTML += `
      <div id="date">${formatSentDate(currentDate)}</div>
      <div id="sent-message">A90</div>
    `;

    scrollToBottom();

    setTimeout(() => {
      message.innerHTML += `
      <div id="received-message">
        U Beogradu, za broj telefona<br> <u>381616123xxx</u>, ste kupili VREMENSKU <br>KARTU OD 90 MINUTA U ZONI A
        po ceni<br> od 50 din + osnovna cena poruke, koja <br>vazi do <u>${formatDate(currentDate)}</u>.<br>
        Karta broj: <u>${new_id}</u>.<br> Placanjem operateru izmirujete dugovanja<br> za ovu
        kartu prema JKP Naplata prevozne usluge Beograd.<br>Sacuvajte ovu poruku.
      </div>
      <div id="received-time">${formatDateForNotification(currentDate)}</div>
    `;

    scrollToBottom();
    saveData(new_id, currentDate);
    }, 3700);
  }

  input.value = "";
}

function saveData(new_id, currentDate) {
  const existingData = localStorage.getItem('myData');
  let jsonData = existingData ? JSON.parse(existingData) : [];

  const newData = {
    id: new_id,
    date: currentDate,
  };

  jsonData.push(newData);

  localStorage.setItem('myData', JSON.stringify(jsonData));
}

function fetchData() {
  const storedData = localStorage.getItem('myData');

  if (storedData) {
    const jsonData = JSON.parse(storedData);
    let html = '';

    jsonData.forEach((object) => {
      html += `
        <div id="message">
          <div id="date">${formatSentDate(new Date(object.date))}</div>
          <div id="sent-message">A90</div>
          <div id="received-message">
            U Beogradu, za broj telefona<br> <u>381616123xxx</u>, ste kupili VREMENSKU <br>KARTU OD 90 MINUTA U ZONI A
            po ceni<br> od 50 din + osnovna cena poruke, koja <br>vazi do <u>${formatDate(new Date(object.date))}</u>.<br>
            Karta broj: <u>${object.id}</u>.<br> Placanjem operateru izmirujete dugovanja<br> za ovu
            kartu prema JKP Naplata prevozne usluge Beograd.<br>Sacuvajte ovu poruku.
          </div>
          <div id="received-time">${formatDateForNotification(new Date(object.date))}</div>
        </div>
      `;
    });

    messages.innerHTML = html;
  } else {
    console.log('No data found in localStorage.');
  }
}

function settingsPrompt() {
  const userInput = prompt("Please enter a start ID (e.g. '3654003') or type 'reset' to clear localStorage.");
  const userInputAsNumber = parseFloat(userInput);

  if(userInput == "reset") {
    localStorage.clear();
  } else if (!isNaN(userInputAsNumber)) {
    previous_id = userInputAsNumber;
    localStorage.setItem(`startDate`, JSON.stringify({date: new Date()}))
    localStorage.setItem(`previousId`, JSON.stringify({id: previous_id}))
  } else {
    console.log("Invalid input.");
  }
}
