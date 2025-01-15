import { showModal } from "./app.js";
import { BookData } from "../models/book.js";

let queriedBooks: BookData[] = [];


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
        queriedBooks = data.Books;
        fillAddBooksTable("");
    })
    .catch(err => {
        console.log('Problem searching for book', err);
        showModal(err);
    })
}

async function addBook(event: JQuery.ClickEvent): Promise<void> {
    const button = $(event.currentTarget);    

    const rowId = button.data('row-id');
    const row = $(`#${rowId}`);

    let title: String = row.find('.add-book-title').text();
    let authors: String[] = row.find('.add-book-author').text().split(', ');
    let categories: String[] = row.find('.add-book-category').text().split(', ');
    let pagesRead: Number = 0;
    let totalPages: Number = Number(row.find('.add-book-total-pages').text());
    let thumbnail: string = row.find('.add-book-thumbnail-image').attr('src') as string;

    console.log(`Title ${title}`);
    let newBook = {
        title: title,
        authors: authors,
        categories: categories,
        pagesRead: pagesRead,
        totalPages: totalPages,
        smallThumbnail: thumbnail
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

let placeholderBookImageSrc: string = "/src/images/BookImagePlaceholder.png";

function fillAddBooksTable(sortBy: string) {
    let table = $('#addBookTableBody');
    $('#addBookTableContainer').hide();
    $('#addBookTableBody').empty();    

    sortSearchedBooks(sortBy);

    queriedBooks.forEach(book => {        
        let newRow = $('#addBookRowTemplate').clone(false).show();                      
        let title: string = book.title;
        console.log('BOOK', book);
        if (book.imageLinks.smallThumbnail === '') {
            newRow.find('.add-book-thumbnail-image').attr('src', placeholderBookImageSrc);
        }
        else {
            newRow.find('.add-book-thumbnail-image').attr('src', book.imageLinks.smallThumbnail);
        }        
        if (book.authors.length > 0) {
            let authors: string[] = book.authors;
            let authorText = authors.join(', '); // Join authors with comma and space
            newRow.find('.add-book-author').text(authorText);
        }        
        newRow.find('.add-book-title').text(title);
        if (book.categories.length > 0) {
            let categories: string[] = book.categories;
            let categoryText = categories.join(', '); // Join categories with comma and space        
            newRow.find('.add-book-category').text(categoryText);
        }        
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

        newRow.find('.dropdown-item').on('click', function() {
            var value = $(this).data('value');
            $(this).closest('.dropdown').find('.dropdown-toggle').text(value);
        });


        table.append(newRow);        
    });

    $('#addBookTableContainer').show();
    $('.add-book-add-button').on('click', addBook);

    $('#bookQueryDropDownContainer').find('.dropdown-item').on('click', function () {
        var value = $(this).data('value');
        $(this).closest('.dropdown').find('.dropdown-toggle').text(value);
        fillAddBooksTable(value);
    });
}

function sortSearchedBooks(sortBy: string) {

    // makes more sense to sort in descending order for the numeric values.

    switch (sortBy) {
        case "Title":
            queriedBooks = queriedBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "Author":
            queriedBooks = queriedBooks.sort((a, b) => a.authors[0].localeCompare(b.authors[0]));
            break;
        case "Total Pages":
            queriedBooks = queriedBooks.sort((a, b) => (b.totalPages as number) - (a.totalPages as number));
            break;
        case "Rating":
            queriedBooks = queriedBooks.sort((a, b) => (b.averageRating as number) - (a.averageRating as number));
            break;
        case "Total Ratings":
            queriedBooks = queriedBooks.sort((a, b) => (b.numberOfRatings as number) - (a.numberOfRatings as number));
            break;
        default: 
            break;        
    }
}


export {searchBook};