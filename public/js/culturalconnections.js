function authStateListener() {
    // [START auth_state_listener]
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
        } else {
            // User is signed out
            signOut();
            location.href = 'index.html';
        }
    });
    // [END auth_state_listener]
}

window.addEventListener('load', function () {

    //Listen for auth state changes
    authStateListener();

    document.getElementById('sign-out').addEventListener('click', function () {
        signOut();
    });
});

function signOut() {
    // [START auth_sign_out]
    firebase.auth().signOut().then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
    // [END auth_sign_out]
}