import { response } from 'express';
import { searchBook } from './addBook.js';
import { retrieveBooks } from './retrieveBook.js'
import { retrieveProfileData } from './profile.js';

$(function() {
    retrieveBooks();   

    $('#ProfilePage').find('.dropdown-item').on('click', function () {
        var value = $(this).data('value');
        $(this).closest('.dropdown').find('.dropdown-toggle').text(value);
    })
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
    clearTables();    
    $('#addBookTableContainer').hide();    
    $('#AddBookPage').show();
   
    checkTableLengths();
    clearAddInputs();

    // add enter key event listener for book search
    $('#addBookAuthor').on('keydown', enterPressed);
    $('#addBookTitle').on('keydown', enterPressed);
    $('#addBookGenre').on('keydown', enterPressed);
}

function showUserProfile() {
    hidePages();
    clearTables();
    $('#ProfilePage').show();
    retrieveProfileData();
}

function enterPressed(event: JQuery.KeyDownEvent) {
    if (event.key === 'Enter') {
        searchBook();
    }
}

function clearAddInputs() {
    $('#addBookAuthor').text('');
    $('#addBookAuthor').val('');
    $('#addBookTitle').text('');
    $('#addBookTitle').val('');
    $('#addBookGenre').text('');
    $('#addBookGenre').val('');
}

function hidePages() {
    $('#AddBookPage').hide();
    $('#HomePage').hide();
    $('#ProfilePage').hide();
}

function checkTableLengths() {
    if ($('#bookOverviewTableBody').children().length == 0) {
        $('#book-overview-container').hide();
        console.log('overview table length');
    }
    else {
        $('#book-overview-container').show();
    }

    if ($('#bookReadingStatusTableBody').children().length == 0) {
        $('#reading-status-container').hide();
        console.log('status table length');
    }
    else {
        $('#reading-status-container').show();
    }
}

function clearTables() {
    $('#bookReadingStatusTableBody').empty();
    $('#bookOverviewTableBody').empty();
    $('#addBookTableBody').empty();
    $('#profileTableBody').empty();
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
$('#profileLink').on('click', showUserProfile);

export {showModal, checkTableLengths};