let phoneIn;

function authStateListener() {
    // [START auth_state_listener]
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            location.href = 'culturalconnections.html';
        } else {
            // User is signed out
            // ...
        }
    });
}

function enableReCaptcha(){
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            askForCode()
            // ...
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            alert('ReCaptcha response expired, please retry it')
            // ...
        }
    })
}

window.addEventListener('load', function () {


    //Listen for auth state changes
    authStateListener();
    enableReCaptcha()

    document.getElementById('closeModal').addEventListener('click', () => {
        closeModal()
    })

    document.getElementById('sign-in-google').addEventListener('click', function () {

        let provider = new firebase.auth.GoogleAuthProvider();

        provider.addScope('email');
        firebase.auth().signInWithPopup(provider)
            .then(function (result) {
                alert('Logging sucessfully');
                location.href = 'culturalconnections.html';
            })
            .catch(function (error) {
                console.log('Logging fail', error);
            });
    });

    document.getElementById('sign-in-phone').addEventListener('click',function(){
        showModal()
    });

    document.getElementById('sendPhone').addEventListener('click', function(){
        phoneIn = document.getElementById('phoneNum').value
        if(phoneIn != "+1 1234567891"){
            alert('Just Test Phone Number is available for the moment!')
            return
        }
        document.getElementById('phoneNum').readOnly = true;
        window.recaptchaVerifier.render()
    })

    document.getElementById('sendValCode').addEventListener('click', function(){
        const appVerifier = window.recaptchaVerifier;
        let validationCode = document.getElementById('validation').value
        firebase.auth().signInWithPhoneNumber(phoneIn, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                confirmationResult.confirm(validationCode)
                .then(() => {
                    alert('Logging sucessfully');
                    location.href = 'culturalconnections.html';
                }).catch((error) => {
                    alert("Error: invalid validation code")
                })
            // ...
            }).catch((error) => {
            // Error; SMS not sent
                console.log("Error: SMS not send")
            // ...
            });
    })

    document.getElementById('sign-in-2').addEventListener('click', function () {
        let emailTxt = document.getElementById('email').value;
        let passtxt = document.getElementById('password').value;
        firebase.auth().signInWithEmailAndPassword(emailTxt, passtxt)
            .then((userCredential) => {
                // Signed in
                let user = userCredential.user;
                // ...
                alert('Logging sucessfully');
                location.href = 'culturalconnections.html';
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                alert('Logging fail');
                console.log('Logging fail', errorMessage);
            });
    });
});

function showModal() {
    let modal = document.getElementById('modal3');
    modal.style.display = "block";
}

function closeModal() {
    let modal = document.getElementById('modal3');
    modal.style.display = 'none';
}

function askForCode(){
    let hideElements = [...document.getElementsByClassName('hidden')]
    hideElements.forEach((element) => {
        element.style = 'display: block;'
    })
}