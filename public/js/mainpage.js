let googleUser;
let cards = 0;

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
            const userData = firebase.database().ref(`users/${user.uid}`);
            userData.on('value', (snapshot) => {
                const data = snapshot.val();
                for(const id in data) {
                    document.querySelector("#centerImg").src = data[id];
                    break; //logo is first element in user array with name, uni, logo (alpha order)
                }
            updateCards();
            });
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
    closeModal();
});

//closes the modal when the cancel button is clicked
cancelInput.addEventListener("click", () => {
   closeModal();
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
        closeModal();
    } else { //no file uploaded
        document.querySelector('#file-upload .file-name').textContent = "No file uploaded (required)";
    }
});

function closeModal(){
    //disable modal
    uploadForm.classList.remove("is-active");
    //reset input fields
    titleInput.value = "";
    descInput.value = "";
    document.querySelector('#file-upload .file-name').textContent = "No file uploaded"; //only changes display (file remains attached)
    document.querySelector('#file-upload input[type=file]').value = null;
    //update
    updateCards();
}

function updateCards() {
    const storageRef = firebase.storage().ref();
    const imgRef = storageRef.child(`users/${googleUser.uid}`);
    imgRef.listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {
                //all the items under listRef
                console.log(itemRef._delegate._location.path_);
                storageRef.child(itemRef._delegate._location.path_).getDownloadURL().then(function(url) {
                var img = url;
                    document.querySelector('#test').src = test;
                });
            });
        }).catch((error) => {
            console.log(error);
        });
    // console.log(imgRef.listAll());
    // imgRef.on('value', (db) => {
    //     const data = db.val();
    //     console.log(data)
    //     // renderData(data);
    // });
}

function renderData(data){
    let html = "";
    for (const dataKey in data){
        cards++;
        const img = data[dataKey];
        const cardHtml = renderCard(img);
        html += cardHtml;
    }
}

function renderCard(img){
    // for (let i = 1; i <= cards; i++) {
    //     if (i != 1 && i % 3 == 1) {
    //         var row = document.createElement("div");
    //         row.classList.add("columns", "is-centered");
    //         document.querySelector("#content").appendChild(row);
    //     }
    // }
}