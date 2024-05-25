document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const resultsDiv = document.getElementById('results');
    const shoppingListUl = document.getElementById('book-list');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const noResultsPlaceholder = document.getElementById('no-results-placeholder');
    const loadingSpinner = document.getElementById('loading-spinner');
    const toggleListButton = document.getElementById('toggle-list-button');
    const listContainer = document.getElementById('list-container');
    const feedbackDiv = document.createElement('div');
    const bookContainer = document.getElementById('book-container');
    const filterReadSelect = document.getElementById('filter-read');
    const applyFilterButton = document.getElementById('apply-filter-button');

    // API URL and Image URL
    const imgUrl = 'https://covers.openlibrary.org/b/lccn/';
    const baseUrl = 'https://openlibrary.org/search.json?q=';

    // Initial Setup
    document.body.appendChild(feedbackDiv);
    let currentPage = 1;
    const itemsPerPage = 6;
    let books = [];
    let shoppingList = Store.getShoppingList();
    renderShoppingList();

    // Get the count of items in the shopping list
    function getItemCount() {
        let quantity = shoppingList.length;
        return quantity > 99 ? '99+' : quantity;
    }

    // Update the displayed item count
    function updateItemCount() {
        const itemCount = getItemCount();
        const itemCountSpan = document.getElementById('item-count');
        itemCountSpan.textContent = itemCount;
    }

    updateItemCount();

    // Toggle visibility of the list container
    toggleListButton.addEventListener('click', () => {
        listContainer.classList.toggle('active');
        resultsDiv.classList.toggle('active');
        bookContainer.classList.toggle('active');
    });

    // Search button event listener
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            startNewSearch();
            searchBooks(query);
        }
    });

    // Pagination buttons event listeners
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

    // Apply filter button event listener
    applyFilterButton.addEventListener('click', () => {
        renderShoppingList();
    });

    // Start a new search by showing the spinner and clearing results
    function startNewSearch() {
        showLoadingSpinner();
        resultsDiv.innerHTML = '';
    }

    // Show loading spinner
    function showLoadingSpinner() {
        loadingSpinner.classList.remove('hidden');
        noResultsPlaceholder.classList.add('hidden');
    }

    // Hide loading spinner
    function hideLoadingSpinner() {
        loadingSpinner.classList.add('hidden');
    }

    // Fetch books from the API
    function searchBooks(query) {
        fetch(`${baseUrl}${query}`)
            .then(response => response.json())
            .then(data => {
                books = data.docs;
                currentPage = 1;
                displayResults(books);
                updateNavigationButtons();
            })
            .catch(error => console.error('Error:', error))
            .finally(() => hideLoadingSpinner());
    }

    // Display search results
    function displayResults(books) {
        noResultsPlaceholder.classList.add('hidden');
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
                    <div class="card-title"><h3 class="card-title">${book.title}</h3></div>
                    <div class="card-image"><img src="${imgSrc}" alt="Book Image"></div>
                    <div class="card-body">
                        <p><strong>Author:</strong> ${book.author_name ? book.author_name[0] : 'Unknown'}</p>
                    </div>
                    <div class="card-footer">
                        <button class="add-item" data-title="${book.title}" data-author="${book.author_name ? book.author_name[0] : 'Unknown'}" data-lccn="${book.lccn ? book.lccn[0] : ''}">Add to List</button>
                    </div>
                `;
                col.appendChild(card);
                resultsDiv.appendChild(col);

                const addButton = card.querySelector('.add-item');
                addButton.addEventListener('click', addToShoppingList);
            });
        } else {
            resultsDiv.innerHTML = '<p>No results found</p>';
        }
    }

    // Update navigation buttons state
    function updateNavigationButtons() {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(books.length / itemsPerPage);
    }

    // Add a book to the shopping list
    function addToShoppingList(event) {
        const button = event.target;
        const title = button.getAttribute('data-title');
        const author = button.getAttribute('data-author');
        const lccn = button.getAttribute('data-lccn');
        const book = new Book(title, author, lccn);

        if (!isBookInList(book)) {
            Store.addBook(book);
            shoppingList = Store.getShoppingList();
            renderShoppingList();
            updateItemCount();
            showFeedback('Book added to your list!', 'success');
        } else {
            showFeedback('Book is already in your list!', 'error');
        }
    }

    // Check if a book is already in the shopping list
    function isBookInList(book) {
        return shoppingList.some(item => item.lccn === book.lccn);
    }

    // Render the shopping list
    function renderShoppingList() {
        const filter = filterReadSelect.value;
        shoppingListUl.innerHTML = '';

        shoppingList.forEach((book, index) => {
            if (filter === 'all' || (filter === 'read' && book.isRead) || (filter === 'unread' && !book.isRead)) {
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
            }
        });
    }

    // Show feedback message
    function showFeedback(message, type) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = `feedback ${type}`;
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 3000);
    }
});

// Store object for managing shopping list in localStorage
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

// Book class to represent a book object
class Book {
    constructor(title, author, lccn = '', isRead = false) {
        this.title = title;
        this.author = author;
        this.lccn = lccn;
        this.isRead = isRead;
    }
}
