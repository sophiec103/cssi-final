let googleUserId;
let name;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      name = user.displayName;
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}/notes`).orderByChild('title');
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

  let cardTitles = [];
  let fullCards = [];
  let cardTimes = [];
  let sortedCards = [];
  let labels = [];
  let addCard = `<div class="column is-one-quarter">
                <div class="card" id="createCard">
                    <header class="card-header">
                        <p class="card-header-title">New Note</p>
                    </header>
                    <div class="card-content">
                         <div class="content has-text-centered add">
                             <a href="#" class="add" onclick="createModal()">
                             +
                             </a>
                         </div>
                    </div>
                    <footer class="card-footer">
                    </footer>
                </div>
            </div>`
const renderDataAsHtml = (data) => {
  let cards = addCard;
  cardTitles = [];
  fullCards = [];
  cardTimes = [];
  labels = [];
  for(const noteId in data) {
    const note = data[noteId];
    note.noteId = noteId;
    fullCards.push(note);
    cardTitles.push(note.title);
    if(note.labels){
        for(let i=0; i<(note.labels).length; i++){
            if(labels.indexOf(note.labels[i])==-1)labels.push(note.labels[i]);
        }
    }
  };

  sortedCards = sortCards(cardTitles, fullCards, cardTitles.length);

  for (const noteKey in sortedCards) {
      const note = sortedCards[noteKey];

      if (note.title) { //avoid making undefined card for archive
        cards += createCard(note, note.noteId);
        setRandomColor();
        cardTimes.push(note.time); 
    }    
  }

  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

function createNewLine(text){
   let t = "";
   while (text.indexOf("\n")!=-1){ //replace all \n with <br>
       t = text.substring(0,text.indexOf("\n"));
       t += "<br>";
       t += text.substring(text.indexOf("\n")+1);
       text = t;
   }
   return text;
}

let counter = 0;
const createCard = (note, noteId) => {
   counter++;
   const text = createNewLine(note.text);
   let s = ``;
   s += `
     <div class="column is-one-quarter">
       <div class="card" id="id${counter}">
         <header class="card-header">
           <p class="card-header-title">${note.title}</p>
         </header>
         <div class="card-content">
           <div class="content">${text}</div>
            `

    for (let i = 0; i<note.labels.length; i++){
        s += `<span class="tag is-light is-info"> 
                ${note.labels[i]}
              </span> &nbsp`
    }

    s += ` <div class="content"><i>Created by ${name} <br> on ${note.created}</i></div>
           </div>
         <footer class = "card-footer">
            <a 
                href = "#" 
                class = "card-footer-item" 
                onclick = "editNote('${noteId}')">
                Edit
           </a>
           <a 
                href = "#" 
                class = "card-footer-item" 
                onclick = "archiveNote('${noteId}')">
                Archive
           </a>
           <a  
                href = "#" 
                class = "card-footer-item" 
                onclick = "deleteNote('${noteId}')">
                Delete
           </a>
         </footer>
       </div>
     </div>
   `;
   return s;
};

function deleteNote(noteId){
    if (confirm("Are you sure you want to delete this note?")){
      firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
    }
}

function createModal(){
    document.querySelector("#createNoteModal").classList.add("is-active");
}
function closeCreateModal(){
    document.querySelector("#createNoteModal").classList.remove("is-active");
}

const editNote = (noteId) => {
  const editNoteModal = document.querySelector('#editNoteModal');
  const notesRef = firebase.database().ref(`users/${googleUserId}/notes/${noteId}`);
  notesRef.on('value', (snapshot) => {
    // const data = snapshot.val();
    // const noteDetails = data[noteId];
    // document.querySelector('#editTitleInput').value = noteDetails.title;
    // document.querySelector('#editTextInput').value = noteDetails.text;
    const note = snapshot.val();
    document.querySelector('#editTitleInput').value = note.title;
    document.querySelector('#editTextInput').value = note.text;
    let labels = "";
    for (let i = 0; i<(note.labels).length-1; i++){
        labels += note.labels[i] + ", ";
    }
    labels += note.labels[(note.labels).length-1];
    document.querySelector('#editLabelInput').value = labels;
    document.querySelector('#noteId').value = noteId;
  });
  editNoteModal.classList.toggle('is-active');
};

function saveEditedNote(){
    const title = document.querySelector('#editTitleInput').value;
    const text = document.querySelector('#editTextInput').value;
    const label = document.querySelector('#editLabelInput').value;
    const noteId = document.querySelector('#noteId').value;
    labels = label.split(", ");
    const editedNote = {title, text, labels}; //shorted way for above when the var names are repeated
    firebase.database().ref(`users/${googleUserId}/notes/${noteId}`).update(editedNote);
    closeEditModal();
}

function closeEditModal(){
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
}

function archiveNote(noteId){
  const notesRef = firebase.database().ref(`users/${googleUserId}/${noteId}`);
  notesRef.on('value', (snapshot) => {
    const note = snapshot.val();
    firebase.database().ref(`users/${googleUserId}/notes/archive`).push({
      title: note.title,
      text: note.text,
      time: note.time,
      created: note.created,
      labels: note.labels
    }) 
  }); 
  firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
}

function getRandomColor() {
  return "hsl(" + Math.random() * 361 + ", 100%, 90%)"
}

function setRandomColor() {
  var style = document.createElement('style');
  style.innerHTML = `
  #id${counter} {
    background: ${getRandomColor()}
  }
  `;
  document.head.appendChild(style);
}

function sortCards(arr, cards, n) {
    var i, j, min_idx;
 
    // One by one move boundary of unsorted subarray
    for (i = 0; i < n-1; i++)
    {
        // Find the minimum element in unsorted array
        min_idx = i;
        for (j = i + 1; j < n; j++)
        if (arr[j] < arr[min_idx])
            min_idx = j;
 
        // Swap the found minimum element with the first element
        var temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;

        temp = cards[min_idx];
        cards[min_idx] = cards[i];
        cards[i] = temp;
    }
    return cards;
}

function sortCardsI(arr, cards, n) {
    var i, j, max_idx;
 
    // One by one move boundary of unsorted subarray
    for (i = 0; i < n-1; i++)
    {
        // Find the maximum element in unsorted array
        max_idx = i;
        for (j = i + 1; j < n; j++)
        if (arr[j] > arr[max_idx])
            max_idx = j;
 
        // Swap the found maximum element with the first element
        var temp = arr[max_idx];
        arr[max_idx] = arr[i];
        arr[i] = temp;

        temp = cards[max_idx];
        cards[max_idx] = cards[i];
        cards[i] = temp;
    }
    return cards;
}

let titleCounter = 1;
function sortCardsByTitle(){
    let cards = addCard;
    cardTimes = [];
    if (titleCounter%2==0) sortedCards = sortCards(cardTitles, sortedCards, cardTitles.length);
    else sortedCards = sortCardsI(cardTitles, sortedCards, cardTitles.length);
    for (const noteKey in sortedCards) {
      const note = sortedCards[noteKey];
      if (note.title) { //avoid making undefined card for archive
        cards += createCard(note, note.noteId);
        setRandomColor();
        cardTimes.push(note.time); 
      }
    }
    titleCounter++;
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = cards;  
    document.querySelector("#labelSort").innerHTML = "";
    if(labelCounter%2==1)labelCounter++;
}

let timeCounter = 0;
function sortCardsByTime(){
    let cards = addCard;
    cardTitles = [];
    if (timeCounter%2==0) sortedCards = sortCards(cardTimes, sortedCards, cardTimes.length);
    else sortedCards = sortCardsI(cardTimes, sortedCards, cardTimes.length);
    for (const noteKey in sortedCards) {
      const note = sortedCards[noteKey];
      if (note.title) { //avoid making undefined card for archive
        cards += createCard(note, note.noteId);
        setRandomColor();
        cardTitles.push(note.title); 
      }
    }   
    timeCounter++; 
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = cards;
    document.querySelector("#labelSort").innerHTML = "";
    if(labelCounter%2==1)labelCounter++;
}

let labelCounter = 0;
let excluded = [];
function sortCardsByLabel(){
    let html = ``;
    excluded = [];
    labels.sort();
    if(labelCounter%2==0){
        for(let i = 0; i<labels.length; i++){
        html += `<button class="button is-small is-outlined is-light is-info" id="id${labels[i]}" onclick = "excludeLabel('${labels[i]}')">
                    ${labels[i]}                   
                 </button>&nbsp`;
        }
    }
    document.querySelector("#labelSort").innerHTML = html;
    labelCounter++;
}

function excludeLabel(label){
    if (excluded.includes(label)){
        excluded.splice(excluded.indexOf(label),1);
        document.querySelector("#id"+label).classList.remove("is-active");
        document.querySelector("#id"+label).blur();
    }else{
        excluded.push(label);
        document.querySelector("#id"+label).classList.add("is-active");
    }
        let cards = addCard;
    for (const noteKey in sortedCards) {
      const note = sortedCards[noteKey];
      if (note.title) { //avoid making undefined card for archive
        let exclude = false;
        for(let i=0; i<note.labels.length; i++){
            if(excluded.indexOf(note.labels[i])!=-1){
                exclude = true;
                break;
            }
        }
        if(!exclude){
            cards += createCard(note, note.noteId);
            setRandomColor();
        }
      }
    }   
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = cards;
}

const handleNoteSubmit = () => {
  // 1. Capture the form data
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');

    if (noteTitle.value != "") {
        const d = new Date();
        const year = d.getFullYear();	//Get the year as a four digit number (yyyy)
        const month = d.getMonth() + 1;	//Get the month as a number (0-11)
        const day = d.getDate();	//Get the day as a number (1-31)
        const hour = d.getHours();	//Get the hour (0-23)
        const mins = d.getMinutes(); //Get the minute (0-59)
        const time = d.getTime();
        let created = "";
        if (mins>=10) created = day + "/" + month + "/" + year + " at " + hour + ":" + mins;
        else created = day + "/" + month + "/" + year + " at " + hour + ":0" + mins;

        // 2. Format the data and write it to our database
        firebase.database().ref(`users/${googleUserId}/notes`).push({
            title: noteTitle.value,
            text: noteText.value,
            labels: arr,
            created: created,
            time: time
        })
            // 3. Clear the form so that we can write a new note
            .then(() => {
                noteTitle.value = "";
                noteText.value = "";
                arr = [];
                document.querySelector("#tags").innerHTML = " ";
            });
        closeCreateModal();
    }
}

const createTag = (tag) => {
  var newTag = document.createElement("span");
  newTag.classList.add("tag");
  var textNode = document.createTextNode(tag);
  var space = document.createTextNode(" ");
  var delButton = document.createElement("button");
  delButton.classList.add("delete", "is-small");
  newTag.appendChild(textNode);
  newTag.appendChild(delButton);
  var tagHolder = document.querySelector("#tags");
  tagHolder.appendChild(newTag);
  tagHolder.appendChild(space);
  delButton.addEventListener("click", event => {
      tagHolder.removeChild(newTag);
      arr.splice(arr.indexOf(tag), 2); 
  });
};

let arr = [];
const inputField = document.querySelector("#noteLabel");
inputField.addEventListener("change", event => {
    let text = inputField.value.trim();
    if (arr.indexOf(text)==-1){
        createTag(text);
        arr.push(text);
    }
    inputField.value = "";
});