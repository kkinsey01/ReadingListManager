import { showModal } from "./app.js";
import { BookData } from "../models/book.js";

async function searchBook() {
    let author: String = $('#addBookAuthor').val() as string;
    let title: String = $('#addBookTitle').val() as string;
    let genre: String = $('#addBookGenre').val() as string;

    if (author === '' && title === '' && genre === '') {
        showModal('At least one field must be filled out!');
        return;
    }

    let data = {
        author: author,
        title: title,
        genre: genre
    };

    console.log(data);

    fetch('/book/searchBook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
        console.log('DATA');
        console.log(data);
        fillAddBooksTable(data.Books as BookData[]);
    })
    .catch(err => {
        console.log('Problem searching for book', err);
        showModal(err);
    })
}

async function addBook(event: JQuery.ClickEvent): Promise<void> {
    const button = $(event.currentTarget);
    console.log('Add clicked!');

    const rowId = button.data('row-id');
    const row = $(`#${rowId}`);

    let title: String = row.find('.add-book-title').text();
    let authors: String[] = row.find('.add-book-author').text().split(', ');
    let categories: String[] = row.find('.add-book-category').text().split(', ');
    let pagesRead: Number = 0;
    let totalPages: Number = Number(row.find('.add-book-total-pages').text());

    console.log(`Title ${title}`);
    let newBook = {
        title: title,
        authors: authors,
        categories: categories,
        pagesRead: pagesRead,
        totalPages: totalPages
    }

    fetch('/book/addBookToUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
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
        console.log('Add book success!');
        row.remove();
    })
    .catch(error => {
        console.log('Problem adding book to user', error);
        showModal(error);
    });
}
$('#bookSearchButton').on('click', searchBook);


function fillAddBooksTable(books: BookData[]) {
    let table = $('#addBookTableBody');
    $('#addBookTableContainer').hide();
    $('#addBookTableBody').empty();    

    books.forEach(book => {        
        let newRow = $('#addBookRowTemplate').clone(false).show();              
        let authors: string[] = book.authors;
        let authorText = authors.join(', '); // Join authors with comma and space
        let title: string = book.title;
        newRow.find('.add-book-author').text(authorText);
        newRow.find('.add-book-title').text(title);
        let categories: string[] = book.categories;
        let categoryText = categories.join(', '); // Join categories with comma and space
        newRow.find('.add-book-category').text(categoryText);
        let totalPages: string = book.totalPages?.toString() as string;
        newRow.find('.add-book-total-pages').text(totalPages);

        let averageRating: string = book.averageRating?.toString() as string;
        newRow.find('.add-book-average-rating').text(averageRating);
        let totalRatings: string = book.numberOfRatings?.toString() as string;
        newRow.find('.add-book-total-ratings').text(totalRatings);
        title = title.replace(/\s/g, "");
        title = title.replace("'", "");
        newRow.attr('id', `${title}_${totalPages}`);
        newRow.find('.add-book-add-button').attr('data-row-id', `${title}_${totalPages}`);
        table.append(newRow);        
    });

    $('#addBookTableContainer').show();
    $('.add-book-add-button').on('click', addBook);
}