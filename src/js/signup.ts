async function goToLoginPage(): Promise<void> {
    await fetch('/home/login', {
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
    .then(data => {
        window.location.href = '/home/login';
    })
    .catch(err => {
        console.log('There was a problem sending to the login page', err);
    });
}

async function signup(): Promise<void> {
    const userFullName: string = $('#newUserFullName').val() as string;
    const email: string = $('#newEmail').val() as string;
    const userName: string = $('#newUserUserName').val() as string;
    const newPassword: string = $('#newPassword').val() as string;
    const confirmPassword: string = $('#confirmPassword').val() as string;

    if (userFullName.length <= 0) {
        showModal("Missing name field");
        return;
    }

    if (email.length <= 0) {
        showModal("Missing email field");
        return;
    }

    if (userName.length <= 0) {
        showModal("Missing username field");   
        return;     
    }

    if (newPassword.length <= 0 || confirmPassword.length <= 0) {
        showModal("Missing password field");
        return;
    }

    if (newPassword !== confirmPassword)
    {        
        showModal("Passwords don't match!");
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        showModal("Invalid email entered");
        return;
    }

    // valid signup entry
    // call to api to signup   
    
    const data = {
        fullName: userFullName,
        email: email,
        userName: userName,
        password: newPassword,
        confirmPassword: confirmPassword
    };

    fetch('/user/newUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (response.ok) {
            return response.json();
        }
        else if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        else {
            throw new Error('Bad API response');
        }      
    })
    .then(data => {
        showModal('User successfully created', 'Successful');        
    })
    .catch(error => {
        showModal('Error registering user');
    })


    console.log('New full name ' + userFullName);
}

function showModal(bodyText: string, modalTitle: string = "Error") {
    $('#errorModalBody').text(bodyText);
    $('#errorModalTitle').text(modalTitle);
    ($('#errorModalContainer') as any).modal('show');
}

function closeModal() {
    ($('#errorModalContainer') as any).modal('hide');
}