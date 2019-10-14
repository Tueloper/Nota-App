class UI {


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

    const notsDiv = document.querySelector('#notes');
    const divNot = document.createElement('div');
    divNot.classList.add('flexC')
    divNot.innerHTML = `
    <div class="singleNote">
      <div class="card ">
        <div class="card-body">
            <h2 class="text-center card-title">${note.title}</h2>
            <p class="card-text">
              ${note.note_des}
            </p>

              <span class="badge badge-warning badge-pill">
              ${note.strCategory}
              </span>

        </div>
      </div>
    </div>
  `;

    notsDiv.appendChild(divNot);
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

  }


}
//global variables
const title = document.querySelector('#title');
const desc = document.querySelector('#noteBody');

const ui = new UI();
const notesDB = new NOTEDB();
//eventListeners
eventListeners();

function eventListeners() {
  const addBtn = document.querySelector('#addBtn');
  const resetBtn = document.querySelector('#resetBtn');

  //add notes
  addBtn.addEventListener('click', addNOtes)

  //clear the input 
  resetBtn.addEventListener('click', resetFunc);

  //default loading
  document.addEventListener('DOMContentLoaded', loader )

};

//functions
function addNOtes(e) {
  e.preventDefault();

  const noteTitle = title.value;
  const noteDesc = desc.value;

  if (noteTitle === '' || noteDesc === '') {
    ui.printMessage('Please All Filleds Must Be Completed Before the Note Can Be Submitted', 'alert-danger');
  } else {

    //print message
    // ui.printMessage('Thank You, Your Note Have Been Addes', 'alert-success');

    //collect information
    const notes = {
      title: noteTitle,
      note_des: noteDesc
    }

    //UI display
    const spinner = document.querySelector('.spinner img');
    // return console.log(spinner)
    spinner.style.display = 'block';

    //perform the function after the following seconds
    setTimeout(function () {
      //remove loader
      spinner.style.display = 'none';

      ui.displayNotes(notes);
    }, 3000);

    // save to db
    notesDB.saveToDb(notes);
  
  }
}

function resetFunc() {
  //   const noteTitle = title.value;
  //   const noteDesc = desc.value;

  title.value = '';
  desc.value = '';
};

function loader() {
  
  const notesss = notesDB.getFromLocalStorage();
  const notsDiv = document.querySelector('#notes');

  notesss.forEach(note => {
    const divNot = document.createElement('div');
    divNot.classList.add('flexC')
    divNot.innerHTML = `
    <div class="singleNote">
      <div class="card ">
        <div class="card-body">
            <h2 class="text-center card-title">${note.title}</h2>
            <p class="card-text">
              ${note.note_des}
            </p>

              <span class="badge badge-warning badge-pill">
              ${note.strCategory}
              </span>

        </div>
      </div>
    </div>
  `;

    notsDiv.appendChild(divNot);  
  });
}