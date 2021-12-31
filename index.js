const theLibrary = [];

function addBookToLibrary(book){
    theLibrary.push(book);
    return theLibrary;
}

function removeBookFromLibrary(index){
    theLibrary.splice(index, 1);
}

function toggleReadInLibrary(index){
    theLibrary[index].toggleRead();
}

function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function(){
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "already read": "not read yet"}`;
}

Book.prototype.toggleRead = function(){
    this.read = !this.read;
}


const theHobbit = new Book("The Hobbit", "J.R.R. Tolkein", 295, false);
const theHobbit2 = new Book("The Hobbit", "J.R.R. Tolkein", 295, true);
const theHobbit3 = new Book("The Hobbit", "J.R.R. Tolkein", 295, true);
[theHobbit, theHobbit2, theHobbit3].forEach( book => {
    addBookToLibrary(book);
})

/* generate html dynamically */

function createCard(book,index){
    /*
        <div class="book-card" data-library-id={index}>
            <ul>
                <li class="title"> {title} </li>
                <li class="author"> {author} </li>
                <li class="pages"> {pages} </li>

            </ul>
            <div class="read"> {read} </div>
            <button class="delete-book-btn"> Remove Book </button>
            <button class="toggle-read-btn"> Toggle Read </button>
        </div>
    
     */

    const card = document.createElement('div');
    card.classList.toggle("book-card", true);
    card.dataset['id'] = index;
    
    
    // generating inner html here
    const ul = document.createElement('ul');

    const titleLi = document.createElement('li');
    titleLi.textContent = book.title;
    titleLi.classList.toggle("title", true);
    
    const authorLi = document.createElement('li');
    authorLi.textContent = `by ${book.author}`;
    authorLi.classList.toggle("author", true);
    
    const pagesLi = document.createElement('li');
    pagesLi.textContent = `${book.pages} pages`;
    pagesLi.classList.toggle("pages", true);

    const readDiv = document.createElement('div');
    // to the best of my knowledge and understanding, using the Boolean wrapper should prevent malicious input from entering readDiv. Without the Boolean wrapper, one can chain ternary operators and input whatever they want.
    readDiv.innerHTML = Boolean(book.read) ? "read &#x2713;" : "read &#x2717;"
    readDiv.classList.toggle("read", true);


    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remove Book";
    removeBtn.classList.toggle("delete-book-btn",true)
    removeBtn.addEventListener('click', handleBookDeletion);
    
    const toggleReadBtn = document.createElement('button');
    toggleReadBtn.textContent = "Toggle Read";
    toggleReadBtn.classList.toggle("toggle-read-btn",true);
    toggleReadBtn.addEventListener('click', handleToggleRead);

    /* handling library operations */
    function handleBookDeletion(e){
        // does operations on theLibrary and forces dom to rerender
        const index = e.target.parentNode.dataset.id;
        removeBookFromLibrary(index);
        generateAllCards(); //dom rerender
    }

    function handleToggleRead(e){
        // does operations on theLibrary and forces dom to rerender
        const index = e.target.parentNode.dataset.id;
        toggleReadInLibrary(index);
        generateAllCards();
    }


    //attaching
    ul.append(titleLi, authorLi, pagesLi)

    card.append(readDiv, ul, removeBtn, toggleReadBtn);

    return card;
}


function generateAllCards(){
    const libraryContainer = document.querySelector("div#the-library")
    while (libraryContainer.firstChild){
        libraryContainer.removeChild(libraryContainer.lastChild);
    }
    theLibrary.forEach( (book,index) => {
        const bookCard = createCard(book,String(index));
        bookCard.classList.toggle("book-card", true);
        libraryContainer.append(bookCard);  
    })
}

generateAllCards();

/* handling new book submission*/

const newBookBtn = document.querySelector("button#new-book-btn");
const form = document.querySelector('form');

function handleBookSubmission(e){
    e.preventDefault()
    const data = new FormData(form); //a convenient way to grab all of the form data
    const {title, author, pages, read}= Object.fromEntries(data); 
    const book = new Book(title, author, pages, Boolean(read));
    // If the read checkbox is off, then read will be undefined in Object.fromEntries(data)

    addBookToLibrary(book);
    addLatestCard();
}

newBookBtn.addEventListener('click', handleBookSubmission);

function addLatestCard(){
    // this function will look for the last book added to the library, instantiate a new card, and put this card in the dom

    const lastBook = theLibrary.slice(-1).pop();
    const index = theLibrary.length - 1;
    const bookCard = createCard(lastBook,index);

    const libraryContainer = document.querySelector("div#the-library")
    libraryContainer.append(bookCard);

}


