let googleUser;

window.onload = (event) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUser = user;
        } 
        
        else {
            // If not logged in, navigate back to login page.
            window.location = 'index.html'; 
        }
  });
}

const register = () => {
    firebase.database().ref(`users/${googleUser.uid}`).update({
        name: document.querySelector("#nameInput").value,
        university: document.querySelector("#universityInput").value,
        logo: document.querySelector("#logoInput").value
    });

    document.querySelector("#nameInput").value = ""
    document.querySelector("#universityInput").value = ""
    document.querySelector("#logoInput").value = ""

    toggleRegisterModal()
    toggleConfirmedModal()
    // need to add better transitions here
    // window.location = "mainPage.html"
}

function toggleRegisterModal() {
    document.querySelector("#registerModal").classList.toggle("is-active")
}

function toggleConfirmedModal() {
    document.querySelector("#confirmedModal").classList.toggle("is-active")
}