import { Book } from "../models/book";
import { Profile } from "../models/profile"; 
import { showModal } from "./app.js";

let profileData: Book[] = [];

const totalBooksString: string = "Total Books: ";
const totalReadString: string = "Total Read: ";
const pagesReadString: string = "Pages Read: ";
const pagesToReadString: string = "Pages Left: ";
const totalLikesString: string = "Total Likes: ";
const totalDislikesString: string = "Total Dislikes: ";

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
        fillProfileTable();
        fillProfileCard(data.profile);
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
        let review: string =  book.review;

        newRow.find('.profile-thumbnail').find('.book-image').attr('src', book.thumbnail as string);
        newRow.find('.profile-title').text(title);
        newRow.find('.profile-author').text(authors);
        newRow.find('.profile-genre').text(genres);
        newRow.find('.profile-page-count').text(`${book.pagesRead} / ${book.totalPages}`);

        if (review) {
            if (review === 'Positive') {
                newRow.find('.profile-positive').css('background-color', '#FFFFE0');
            }
            else if (review === 'Negative') {
                newRow.find('.profile-negative').css('background-color', '#FFFFE0');
            }
        }

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

    if (table.children().length === 0) {
        $('#profileTable').hide();
    }
    else {
        $('#profileTable').show();
    }
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
        retrieveProfileData();
    })   
    .catch(error => {
        showModal(error);
    });
}

function getProfileCard() {
    fetch('/user/profileCard', {
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
        fillProfileCard(data.profile);
    })
}

function fillProfileCard(profile: Profile) {
    let profileCard = $('#ProfileCard');
    profileCard.find('#profileTotalBooks').text(`${totalBooksString}${profile.totalBooks}`);
    profileCard.find('#profileBooksRead').text(`${totalReadString}${profile.totalRead}`);
    profileCard.find('#profilePagesRead').text(`${pagesReadString}${profile.pagesRead}`);
    profileCard.find('#profilePagesToRead').text(`${pagesToReadString}${profile.pagesLeft}`);
    profileCard.find('#profileNumLikes').text(`${totalLikesString}${profile.totalLikes}`);
    profileCard.find('#profileNumDislikes').text(`${totalDislikesString}${profile.totalDislikes}`);    
}

export { retrieveProfileData }