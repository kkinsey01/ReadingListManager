import { BookData } from "../models/book";
import { showModal } from "./app.js";

async function retrieveBooks() {
    console.log('CALLED');
    fetch('/book/retrieve', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async response => {
        if (response.ok) 
            return response.json();
        else if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        else {
            throw new Error('Bad API response');
        }
    })
    .then(data => {
        console.log('USER BOOKS');
        console.log(data);
        fillCurrentUserBooks(data.books);
    })
    .catch(error => {
        showModal(error);
    })
}

function fillCurrentUserBooks(books: BookData[]) {
    let overviewTableBody = $('#bookOverviewTableBody');
    overviewTableBody.empty();

    let newRowTemplate = $('#overviewRowTemplate');
    let booksInProgress: BookData[] = [];
    books.forEach((book: BookData) => {
        console.log(book);
        let newRow = newRowTemplate.clone(false).show();
        console.log(newRow);
        newRow.attr('id', `row_${book.title}`);
        newRow.attr('data-row-id', `${book.title}`);

        newRow.find('.overview-title').text(book.title);
        newRow.find('.overview-author').text(book.authors.join(', '));
        newRow.find('.overview-category').text(book.categories.join(', '));
        newRow.find('.overview-total-pages').text(book.totalPages?.toString() as string);
        newRow.find('#statusDropDown').text(book.status as string);

        newRow.find('.update-button').attr('id', `update_${book.title}`);
        newRow.find('.update-button').attr('data-row-id', `${book.title}`);
        newRow.find('.delete-button').attr('id', `delete_${book.title}`);
        newRow.find('.update-button').on('click', updateBook);
        newRow.find('.delete-button').on('click', deleteBook);


        newRow.find('.dropdown-item').on('click', function () {
            var value = $(this).data('value');            
            $(this).closest('.dropdown').find('.dropdown-toggle').text(value);
        });

        if (book.status === 'In progress') {
            booksInProgress.push(book);
        }

        overviewTableBody.append(newRow);
        console.log(overviewTableBody);
    })
    fillCurrentlyReading(booksInProgress);
}

function updateBook(event: JQuery.ClickEvent) {    
    const button = $(event.currentTarget);
    const rowID = button.data('row-id');    
    console.log(rowID);
    const row = button.parent().parent();       

    let title: String = row.find('.overview-title').text();
    let status: String = row.find('#statusDropDown').text();

    let data = {
        title: title,
        status: status
    }
    console.log('DATA SENT FOR UPDATE');
    console.log(data);

    fetch('/book/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (response.ok) {
            return response.json();
        }
        else if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        else {
            throw new Error('Bad API response');
        }
    })
    .then(data => {
        retrieveBooks();

    })
    .catch(error => {
        console.log('Problem updating book', error);
        showModal(error);
    })
}

function deleteBook(event: JQuery.ClickEvent) {
    const button = $(event.currentTarget);
    const rowID = button.data('row-id');
    console.log(rowID);
    const row = button.parent().parent();       

    let title: String = row.find('.overview-title').text();
    
    let data = {
        title: title
    }

    fetch('/book/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (response.ok) {
            return response.json();
        }
        else if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        else {
            throw new Error('Bad API Response');
        }
    })
    .then(data => {
        retrieveBooks();
    })
    .catch(error => {
        showModal(error);
    })
}

function fillCurrentlyReading(books: BookData[]) {
    console.log('Currently Reading', books);
    let bookReadingStatusBody = $('#bookReadingStatusTableBody');
    bookReadingStatusBody.empty();
    let newRowTemplate = $('#currReadingRowTemplate');    

    books.forEach((book: BookData) => {
        let newRow = newRowTemplate.clone(false).show();
        newRow.attr('id', `readingStatus_${book.title}`);
        newRow.attr('data-row-id', `reading_${book.title}`);
        newRow.find('.current-reading-title').text(book.title);
        newRow.find('.current-reading-author').text(book.authors.join(', '));
        newRow.find('.current-reading-input').val(book.pagesRead?.toString() as string);
        newRow.find('.current-reading-total-page').text(book.totalPages?.toString() as string);

        newRow.find('.current-reading-complete').attr('id', `markAsComplete_${book.title}`);
        newRow.find('.current-reading-complete').attr('data-row-id', `${book.title}`);
        newRow.find('.update-pagecount-button').attr('id', `updatePage_${book.title}`);
        newRow.find('.update-pagecount-button').attr('data-row-id', `${book.title}`);       

        newRow.find('.current-reading-complete').on('click', markAsComplete);
        newRow.find('.update-pagecount-button').on('click', updatePageCount);        

        bookReadingStatusBody.append(newRow);
    })
}

function markAsComplete(event: JQuery.ClickEvent) {
    const button = $(event.currentTarget);
    const rowID = button.data('row-id');    
    const row = button.parent().parent();

    let totalPageCount: number = parseInt(row.find('.current-reading-total-page').text()) as number;
    row.find('.current-reading-input').val(totalPageCount);
}

function updatePageCount(event: JQuery.ClickEvent) {
    const button = $(event.currentTarget);
    const rowID = button.data('row-id');    
    const row = button.parent().parent();

    let title: String = row.find('.current-reading-title').text();
    let pageCount: Number = row.find('.current-reading-input').val() as Number;

    let data = {
        title: title,
        pageCount: pageCount
    };

    fetch('/book/updatePageCount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',            
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (response.ok) {
            return response.json();
        }
        else if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.message);            
        }
        else {
            throw new Error('Bad API response');
        }
    })
    .then(data => {
        retrieveBooks();
    })
    .catch(error => {
        showModal(error);
    })
}

export { retrieveBooks }