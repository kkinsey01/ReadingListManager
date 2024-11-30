import { Book } from "../models/book";
import { showModal } from "./app.js";

let profileData: Book[] = [];

function retrieveProfileData() {
    let sortBy: String = $('#profileSortBy').text();

    let data = {
        sortBy: sortBy
    };

    fetch('/user/profile', {
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
        profileData = data.books;
        console.log('FETCH PROFILE');
        console.log(data);
        fillProfileTable();
    })
    .catch(error => {
        showModal(error);
    });
}

function fillProfileTable() {
    let table = $('#profileTableBody');
    table.empty();

    profileData.forEach(book => {
        let newRow = $('#profileRowTemplate').clone(false).show();        
        let authors: string = book.authors.join(', ');
        let title: string = book.title;
        let genres: string = book.categories.join(', ');
        

        newRow.find('.profile-thumbnail').find('.book-image').attr('src', book.thumbnail as string);
        newRow.find('.profile-title').text(title);
        newRow.find('.profile-author').text(authors);
        newRow.find('.profile-genre').text(genres);
        newRow.find('.profile-page-count').text(`${book.pagesRead} / ${book.totalPages}`);

        newRow.attr('id', `profile_${title}`);
        newRow.attr('data-row-id', `profile_${title}`);

        newRow.find('.profile-positive').on('click', function() {
            updateReview(true, title);
        });
        newRow.find('.profile-negative').on('click', function() {
            updateReview(false, title);
        });

        table.append(newRow);
    })
}

function updateReview(isPositive: boolean, title: string) {
    let data = {
        review: isPositive,
        title: title
    }

    fetch('/user/updateReview', {
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
        showModal(data.message, "Message");
    })   
    .catch(error => {
        showModal(error);
    });
}

export { retrieveProfileData }