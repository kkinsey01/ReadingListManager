$(function() {
    $('#errorContainer').hide();
})

async function goToSignupPage() : Promise<void> {    
    await fetch('/home/signup', {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        else {
            throw new Error('response error');
        }
    })
    .then(htmlContent => {
        window.location.href = '/home/signup';
    })
    .catch(err => {
        console.log('There was a problem sending to the signup page', err);
    })
}

async function login() {
    console.log('attempting to login!');
    $('#errorContainer').hide();
    let usname= $('#usernameInput').val();
    let pwd = $('#passwordInput').val();

    const data = {
        userName: usname,
        password: pwd
    };

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(async response => {
        console.log(response);
        if (!response.ok) {
            return response.json().then(errorData => {
                $('#errorMessage').text(errorData.message);
                $('#errorContainer').show();
                throw new Error('Bad API response');
            });
        }
        return response.text()
    })
    .then(data => {
        window.location.href = '/home/homepage';
    })
    .catch(error => {
        console.log('Error: ', error);
        throw new Error(error);
    })
}
