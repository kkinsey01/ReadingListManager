import { showModal } from "./app.js";

function addBook() {
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

    fetch('/book/addBook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) 
            return response.json();
        else
            throw new Error('response error');
    })
    .then(data => {
        console.log('Success');
    })
    .catch(err => {
        console.log('Problem adding book', err);
        showModal(err);
    })
}

$('#bookSearchButton').on('click', addBook);