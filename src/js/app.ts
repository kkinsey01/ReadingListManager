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
    $('#HomePage').show();
}

function showAdd() {
    hidePages();
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