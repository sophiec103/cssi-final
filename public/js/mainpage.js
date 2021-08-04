let googleUser;
var cards = 0;

const centerImageButton = document.querySelector("#centerImage");
const uploadButton = document.querySelector("#upload");
const deleteButton = document.querySelector("#clear");

// modal buttons
const deleteModal = document.querySelector("#closeButton");
const cancelInput = document.querySelector("#cancelButton");
const submitInput = document.querySelector("#confirmButton");
const closeImgView = document.querySelector("#imgview-close");

//upload input
const titleInput = document.querySelector("#img-title");
const descInput = document.querySelector("#img-desc");

window.onload = (event) => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUser = user;
            const logo = firebase.database().ref(`users/${user.uid}`);
            document.querySelector("#centerImg").src = logo;
            console.log(logo)
        } else {
            window.location = 'index.html'; // If not logged in, navigate back to login page.
        }
    });
};

//central image event listener
centerImageButton.addEventListener("click", () => {
    console.log("hi")
});

//makes upload image modal visible
uploadButton.addEventListener("click", () => {
    document.querySelector("#uploadForm").classList.add("is-active");
});

//closes the modal when the top-right "X" button is clicked
deleteModal.addEventListener("click", () => {
    uploadForm.classList.remove("is-active");
});

//closes the modal when the cancel button is clicked
cancelInput.addEventListener("click", () => {
    uploadForm.classList.remove("is-active");
});

//update file name in upload image modal when file is selected
const fileInput = document.querySelector('#file-upload input[type=file]');
fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
        const fileName = document.querySelector('#file-upload .file-name');
        fileName.textContent = fileInput.files[0].name;
    }
}

//clears all cards
deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all images from your gallery?")) {
        document.querySelector("#content").innerHTML = "";
        cards = 0;
    }
});

submitInput.addEventListener("click", () => {
    //pulls input form data and stores it to local vars
    const title = titleInput.value,
        desc = descInput.value;
    const fileInput = document.querySelector('#file-upload input[type=file]');
    const file = fileInput.files[0];

    if (file != null) {
        //create a root reference
        const destination = firebase.storage().ref().child(`users/${googleUser.uid}/${file.name}`);
        //create a reference to the image
        destination.put(file, {
            customMetadata: {
                'Title': title,
                'Description': desc
            }
        }).then(() => console.log('done!'));

        // Resets the values of the input fields in the form
        titleInput.value = "";
        descInput.value = "";
        document.querySelector('#file-upload .file-name').textContent = "No file uploaded"; //only changes display (file remains attached)
        document.querySelector('#file-upload input[type=file]').value = null;
        uploadForm.classList.remove("is-active");
    } else { //no file uploaded
        document.querySelector('#file-upload .file-name').textContent = "No file uploaded (required)";
    }
});

