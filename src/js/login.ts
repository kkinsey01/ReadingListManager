async function goToSignupPage() : Promise<void> {
    console.log('signup button clicked');
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
        document.open();
        document.write(htmlContent);
        document.close();
    })
    .catch(err => {
        console.log('There was a problem sending to the signup page', err);
    })
}