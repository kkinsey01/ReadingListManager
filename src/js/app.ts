import { response } from 'express';
import { searchBook } from './addBook.js';
import { retrieveBooks } from './retrieveBook.js'

$(function() {
    retrieveBooks();   
})

function showModal(bodyText: string, modalTitle: string = "Error") {
    $('#errorModalBody').text(bodyText);
    $('#errorModalTitle').text(modalTitle);
    ($('#errorModalContainer') as any).modal('show');
}

function closeModal() {
    ($('#errorModalContainer') as any).modal('hide');
}

function showHome() {
    hidePages();
    $('#addBookTableBody').empty();
    retrieveBooks();
    $('#HomePage').show();
}

// should the tables be emptied when switching views? maybe add a table view of 
// current books on the add book page so the user can know

function showAdd() {
    hidePages();
    $('#bookReadingStatusTableBody').empty();
    $('#bookOverviewTableBody').empty();
    $('#addBookTableBody').empty();
    $('#addBookTableContainer').hide();
    $('#addBookAuthor').text('');
    $('#addBookTitle').text('');
    $('#addBookGenre').text('');
    $('#AddBookPage').show();

    // add enter key event listener for book search
    $('#addBookAuthor').on('keydown', enterPressed);
    $('#addBookTitle').on('keydown', enterPressed);
    $('#addBookGenre').on('keydown', enterPressed);
}

function enterPressed(event: JQuery.KeyDownEvent) {
    if (event.key === 'Enter') {
        searchBook();
    }
}


function hidePages() {
    $('#AddBookPage').hide();
    $('#HomePage').hide();
}

function logout() {
    fetch('/user/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async response => {
        if (response.ok) {
            return response.text();
        }
        else if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        else {
            throw new Error('Bad API response');
        }  
    })
    .then(htmlContent => {
        window.location.href = '/home/login';
    })
    .catch(err => {
        showModal(err);
    })
}


$('#navHomeLink').on('click', showHome);
$('#navAddBookLink').on('click', showAdd);
$('#modalCloseButton').on('click', closeModal);
$('#logoutButton').on('click', logout);

export {showModal};