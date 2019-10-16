class UI {
  constructor() {
    this.colors = ['#fc3939', '#13b955', '#efa31d', '#e83e8c', '#fd7e14', '#868e96', '#13b955', '#009cdc'];
  }

  printMessage(message, className) {

    const divError = document.createElement('div');
    divError.classList.add('alert', 'error', className);
    divError.appendChild(document.createTextNode(message));

    //where it will display
    const content = document.querySelector('.add-content');
    content.insertBefore(divError, document.querySelector('.add-body'));

    setTimeout(() => {
      document.querySelector('.add-content .alert').remove()
    }, 3000)
  }

  displayNotes(note) {
    let colorB = this.colors[this.generateColors()];
    const notsDiv = document.querySelector('#notes');
    const divNot = document.createElement('div');
    // divNot.style.backgroundColor = this.colors[this.generateColors()]
    divNot.classList.add('flexC')
    divNot.innerHTML = `
    <div class="singleNote">
      <div class="card " id="${note.id}" style="background-color: ${colorB}">
        <div class="card-body" >
            <h2 class="text-center card-title">${note.title}</h2>
            <p class="card-text">
              ${note.note_des}
            </p>
            <div class="mianBtn">
              <button class="btn btn-warning editNote" id="editNote">Edit</button>
              <button class="btn btn-danger deleteNote" id="deleteNote">Delete</button>
            </div>
        </div>
      </div>
    </div>
  `;

    notsDiv.appendChild(divNot);
  }

  generateColors() {
    return Math.floor( Math.random() * this.colors.length );
  }


}

class NOTEDB {

  //LOAD NOTES FROM DB
  getFromLocalStorage() {

    let notes;

    if (localStorage.getItem('notes') === null) {
      notes = [];
    } else {
      notes = JSON.parse(localStorage.getItem('notes'))
    }
    return notes;
  }

  //Save notes to Local Storage
  saveToDb(note) {
    let notes = this.getFromLocalStorage();

    notes.push(note);

    localStorage.setItem('notes', JSON.stringify(notes));

  };

  removeFromDb(note) {
  
    let notes = this.getFromLocalStorage();
    
    notes.forEach((noteLS, index) => {
      if (note.id == noteLS.id.trim()) {
        
        notes.splice(index, 1);
      }
    });

    //set the remaining values to lS
    localStorage.setItem('notes', JSON.stringify(notes))

    return window.location.reload()
  }

  editDataDb(note) {
    
    let notes = this.getFromLocalStorage();
    
    notes.forEach((noteLS, index) => {
      if (note.id == noteLS.id.trim()) {
        
        notes.splice(index, 1, note);
      }
    });

    //set the remaining values to lS
    localStorage.setItem('notes', JSON.stringify(notes))

    return window.location.reload()
  } 



}

//generate unique id
class GenerateID {
  constructor() {
    this.length = 8;
    this.timestamp = +new Date;
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * ( max - min + 1)) + min
  }

  generateUniqueID() {
    let ts = this.timestamp.toString();
    
    let parts = ts.split("").reverse();
    let id = 'a';

    for (let i = 0; i < 8; i++) {
      const max = parts.length - 1
      
      const index = this._getRandomInt(0, max);
      id += parts[index];
    }

    return id;
  }
}


//global variables
const title = document.querySelector('#title');
const desc = document.querySelector('#noteBody');
const editBtnCheck = document.querySelector('.add-body');

//instantiate the classes
const ui = new UI();
const notesDB = new NOTEDB();
const generateId = new GenerateID();

//eventListeners
eventListeners();

function eventListeners() {
  const addBtn = document.querySelector('#addBtn');
  const resetBtn = document.querySelector('#resetBtn');
  const noteAdd = document.querySelector('#notes')
  
  //add notes
  addBtn.addEventListener('click', addNOtes)

  //clear the input 
  resetBtn.addEventListener('click', resetFunc);

  //default loading
  document.addEventListener('DOMContentLoaded', loader);
  
  //'delete a note
  noteAdd.addEventListener('click', readBtn )

};

//functions
function addNOtes(e) {
  e.preventDefault();

  const noteTitle = title.value;
  const noteDesc = desc.value;

  if (noteTitle === '' || noteDesc === '') {
    ui.printMessage('Please All Filleds Must Be Completed Before the Note Can Be Submitted', 'alert-danger');
  } else {

    let idEdit = editBtnCheck.getAttribute('id');
    if (idEdit) {
      const updatedNote = {
        id: idEdit,
        title: noteTitle,
        note_des: noteDesc
      }

      //save note to DB
      notesDB.editDataDb(updatedNote);

    } else {
      //collect information
      const notes = {
        id: generateId.generateUniqueID(),
        title: noteTitle,
        note_des: noteDesc
      }

      //display notes to the UI
      ui.displayNotes(notes);

      // save to db
      notesDB.saveToDb(notes);

      //reset form
      resetFunc();
    }
  }
}

function resetFunc() {

  title.value = '';
  desc.value = '';
};

function loader() {
  
  const notesss = notesDB.getFromLocalStorage();
  const notsDiv = document.querySelector('#notes');

  notesss.forEach(note => {
    let colorB = ui.colors[ui.generateColors()];

    const divNot = document.createElement('div');
    divNot.classList.add('flexC');
    divNot.innerHTML = `
    <div class="singleNote"  >
      <div class="card" id="${note.id}" style="background-color: ${colorB}">
        <div class="card-body" >
            <h2 class="text-center card-title" >${note.title}</h2>
            <p class="card-text">
              ${note.note_des}
            </p>
             <div class="mianBtn">
              <button class="btn btn-warning editNote" id="editNote">Edit</button>
              <button class="btn btn-danger deleteNote" id="deleteNote">Delete</button>
            </div>
        </div>
      </div>
    </div>
  `;

    notsDiv.appendChild(divNot);  
  });
}

async function readBtn(e) {

  if (e.target.classList.contains('deleteNote')) {

    //remove the card from display
    e.target.parentElement.parentElement.parentElement.parentElement.remove();

    //get details
    const card = e.target.parentElement.parentElement.parentElement;
    const title = card.querySelector('h2').textContent.trim();
    const desc = card.querySelector('p').textContent.trim();
    const id = card.getAttribute('id')

    const note = {
      id: id,
      title: title,
      desc: desc
    }

    //delete from localStoirage
    notesDB.removeFromDb(note)

  } else if (e.target.classList.contains('editNote')) {

    //remove from display
    e.target.parentElement.parentElement.parentElement.parentElement.remove();
    
    //get details
    const card = e.target.parentElement.parentElement.parentElement;
    const titleDiv = card.querySelector('h2').textContent.trim();
    const descDiv = card.querySelector('p').textContent.trim();
    const id = card.getAttribute('id');

    //creating a condition for editing the information
    editBtnCheck.id = id

    //sending values to the form
    title.value = titleDiv;
    desc.value = descDiv;

  }
}