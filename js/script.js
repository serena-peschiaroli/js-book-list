document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const resultsDiv = document.getElementById('results');
    const shoppingListUl = document.getElementById('book-list');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const toggleListButton = document.getElementById('toggle-list-button');
    const closeListBtn = document.getElementById("close-list");
    const listContainer = document.getElementById('list-container');
    const imgUrl = 'https://covers.openlibrary.org/b/lccn/';

    let currentPage = 1;
    const itemsPerPage = 6;
    let books = [];

    let shoppingList = Store.getShoppingList();
    renderShoppingList();

    function getItemCount() {
        let quantity = shoppingList.length;
        return quantity > 99 ? '99+' : quantity;
    }

    function updateItemCount() {
        const itemCount = getItemCount();
        const itemCountSpan = document.getElementById('item-count');
        itemCountSpan.textContent = itemCount;
    }

    updateItemCount();

    toggleListButton.addEventListener('click', () => {
        listContainer.classList.toggle('active');
    });

    closeListBtn.addEventListener("click", () =>{
      listContainer.classList.remove('active');
    } );

    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            searchBooks(query);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayResults(books);
            updateNavigationButtons();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(books.length / itemsPerPage)) {
            currentPage++;
            displayResults(books);
            updateNavigationButtons();
        }
    });

    function searchBooks(query) {
        fetch(`https://openlibrary.org/search.json?q=${query}&limit=100`)
            .then(response => response.json())
            .then(data => {
                books = data.docs;
                currentPage = 1;
                displayResults(books);
                updateNavigationButtons();
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
                const imgSrc = book.lccn ? `${imgUrl}${book.lccn[0]}-M.jpg` : 'img/default-image.png';
                card.innerHTML = `
                    <div class="card-title"><h3>${book.title}</h3></div>
                    <div class="card-image"><img src="${imgSrc}" alt="Book Image"></div>
                    <div class="card-body">
                        <p><strong>Author:</strong> ${book.author_name ? book.author_name[0] : 'Unknown'}</p>
                        <p><strong>First Published:</strong> ${book.first_publish_year || 'Unknown'}</p>
                    </div>
                    <div class="card-footer">
                        <button class="add-item" data-title="${book.title}" data-author="${book.author_name ? book.author_name[0] : 'Unknown'}" data-lccn="${book.lccn ? book.lccn[0] : ''}">Add to List</button>
                    </div>
                `;
                col.appendChild(card);
                resultsDiv.appendChild(col);

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

    function updateNavigationButtons() {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(books.length / itemsPerPage);
    }

    function addToShoppingList(event) {
        const button = event.target;
        const title = button.getAttribute('data-title');
        const author = button.getAttribute('data-author');
        const lccn = button.getAttribute('data-lccn');
        const book = new Book(title, author, lccn);
        Store.addBook(book);
        shoppingList = Store.getShoppingList();
        renderShoppingList();
        updateItemCount();
    }

    function renderShoppingList() {
        shoppingListUl.innerHTML = '';
        shoppingList.forEach((book, index) => {
            const card = document.createElement('div');
            card.className = 'book-list-card';

            const imgSrc = book.lccn ? `${imgUrl}${book.lccn}-M.jpg` : 'img/default-image.png';

            card.innerHTML = `
                <div class="card-title"><h3>${book.title}</h3></div>
                <div class="card-image"><img src="${imgSrc}" alt="Book Image"></div>
                <div class="card-body">
                    <p><strong>Author:</strong> ${book.author}</p>
                </div>
                <div class="card-footer">
                    <button class="remove-item">Remove</button>
                    <button class="read-item">${book.isRead ? 'Unread' : 'Read'}</button>
                </div>
            `;

            const removeButton = card.querySelector('.remove-item');
            removeButton.addEventListener('click', () => {
                Store.removeBook(index);
                shoppingList = Store.getShoppingList();
                renderShoppingList();
                updateItemCount();
            });

            const readButton = card.querySelector('.read-item');
            readButton.addEventListener('click', () => {
                Store.toggleReadStatus(index);
                shoppingList = Store.getShoppingList();
                renderShoppingList();
            });

            shoppingListUl.appendChild(card);
        });
    }
});


const Store = {
    getShoppingList: function () {
        return JSON.parse(localStorage.getItem('shoppingList')) || [];
    },

    addBook: function (book) {
        const shoppingList = this.getShoppingList();
        shoppingList.push(book);
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    },

    removeBook: function (index) {
        const shoppingList = this.getShoppingList();
        shoppingList.splice(index, 1);
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    },

    toggleReadStatus: function (index) {
        const shoppingList = this.getShoppingList();
        shoppingList[index].isRead = !shoppingList[index].isRead;
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }
};


class Book {
    constructor(title, author, lccn = '', isRead = false) {
        this.title = title;
        this.author = author;
        this.lccn = lccn;
        this.isRead = isRead;
    }
}
