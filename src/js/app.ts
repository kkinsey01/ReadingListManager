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
}


function hidePages() {
    $('#AddBookPage').hide();
    $('#HomePage').hide();
}

$('#navHomeLink').on('click', showHome);
$('#navAddBookLink').on('click', showAdd);
$('#modalCloseButton').on('click', closeModal);


export {showModal};