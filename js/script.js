document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const resultsDiv = document.getElementById('results');
  const shoppingListUl = document.getElementById('book-list');
  const paginationContainer = document.getElementById('pagination');
  const imgUrl = 'https://covers.openlibrary.org/b/lccn/';

      // variables for pagination setup
    let currentPage = 1;
    const itemsPerPage = 3;
       let books = []; // Initialize books array

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
    fetch(`https://openlibrary.org/search.json?q=${query}&limit=20`)
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
    if (paginatedItems.length > 0) {
        paginatedItems.forEach(book => {
            const col = document.createElement('div');
            col.className = 'book';
            const card = document.createElement('div');
            card.className = 'card';
            const imgSrc = book.lccn ? `${imgUrl}${book.lccn[0]}-M.jpg` : 'default-image.jpg';
            card.innerHTML = `
                <div class="card-title"><h3>${book.title}</h3></div>
                <div class="card-image"><img src="${imgSrc}" alt="Book Image"></div>
                <div class="card-body">
                    <p>Author: ${book.author_name ? book.author_name[0] : 'Unknown'}</p>
                    <p>First Published: ${book.first_publish_year || 'Unknown'}</p>
                </div>
                <div class="card-footer">
                    <button class="add-item" data-title="${book.title}" data-author="${book.author_name ? book.author_name[0] : 'Unknown'}">Add to Shopping List</button>
                </div>
            `;
            col.appendChild(card);
            resultsDiv.appendChild(col);

            // Add event listener to the button after it has been appended to the DOM
            const addButton = card.querySelector('.add-item');
            if (addButton) {
                addButton.addEventListener('click', addToShoppingList);
            } else {
                console.error('Button not found for book:', book);
            }
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found</p>';
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