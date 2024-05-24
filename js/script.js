document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const resultsDiv = document.getElementById('results');
  const shoppingListUl = document.getElementById('book-list');
  const paginationContainer = document.getElementById('pagination');

      // variables for pagination setup
    let currentPage = 1;
    const itemsPerPage = 6;

  // Load book list from local storage
  let shoppingList = Store.getShoppingList();
  renderShoppingList();

  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      searchBooks(query);
    }
  });

  function searchBooks(query) {
    console.log(query);
    fetch(`https://openlibrary.org/search.json?q=${query}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.docs);
        books = data.docs;
        displayResults(books);
        displayPaginationControls(books.length);
      })
      .catch(error => console.error('Error:', error));
  }

  function displayResults(books) {
    resultsDiv.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const paginatedItems = books.slice(start, end);
    if(paginatedItems.length > 0){
        paginatedItems.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
          <h3>${book.title}</h3>
          <p>Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
          <p>First Published: ${book.first_publish_year || 'Unknown'}</p>
          <button data-title="${book.title}" data-author="${book.author_name ? book.author_name.join(', ') : 'Unknown'}">Add to Shopping List</button>
        `;
        bookDiv.querySelector('button').addEventListener('click', addToShoppingList);
        resultsDiv.appendChild(bookDiv);
        });
    }else{
        resultsDiv.innerHTML = '<p>No result found</p>'; 
        //display pagination controls
     

    }

  }

  function displayPaginationControls(totalItems) {
        //container pagination control
        //clear content
        paginationContainer.innerHTML = '';

        //calculate the total num of pages
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        //button for each page
        for (let i = 1; i <= pageCount; i++) { 
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            //click handler for each btn
            pageButton.onclick = function() { 
                //update current page
                currentPage = i; 
                //display recipes for new page
                displayResults(books); 
                displayPaginationControls(totalItems);
            };

            if (currentPage === i) {
                //add class to current page btn 
                pageButton.classList.add('active'); 
            }

            paginationContainer.appendChild(pageButton); 
        }
    }

  function addToShoppingList(event) {
    const button = event.target;
    const title = button.getAttribute('data-title');
    const author = button.getAttribute('data-author');
    const book = { title, author };
    Store.addBook(book);
    shoppingList = Store.getShoppingList();
    renderShoppingList();
  }

  function renderShoppingList() {
    shoppingListUl.innerHTML = '';
    shoppingList.forEach((book, index) => {
      const li = document.createElement('li');
      li.textContent = `${book.title} by ${book.author}`;
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        Store.removeBook(index);
        shoppingList = Store.getShoppingList();
        renderShoppingList();
      });
      li.appendChild(removeButton);
      shoppingListUl.appendChild(li);
    });
  }
});




const Store = {
  getShoppingList: function() {
    return JSON.parse(localStorage.getItem('shoppingList')) || [];
  },
  
  addBook: function(book) {
    const shoppingList = this.getShoppingList();
    shoppingList.push(book);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  },
  
  removeBook: function(index) {
    const shoppingList = this.getShoppingList();
    shoppingList.splice(index, 1);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }
};