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

//image modal
const imgDisplay = document.querySelector("#img-display");
const imgViewDiv = document.querySelector("#imgview-div");
const imgViewTitle = document.querySelector("#imgview-title");
const imgViewDesc = document.querySelector("#imgview-desc");

//upload input
const titleInput = document.querySelector("#img-title");
const descInput = document.querySelector("#img-desc");

window.onload = (event) => {
    console.log("page loading")
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUser = user;
            const userData = firebase.database().ref(`users/${user.uid}`);

            userData.on('value', (snapshot) => {
                const data = snapshot.val();
                console.log(data)
                for (const id in data) {
                    if(id == "logo"){
                        document.querySelector("#centerImg").src = data[id];
                    } 
                    
                    if(id == "name"){
                        document.querySelector("#welcome2").innerHTML = "Welcome, "+ data[id];
                    }

                    if (id == "university") {
                        document.querySelector("#welcome").innerHTML = data[id] + " Student Website";
                    }
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

//closes image display modal when the top-right "X" button is clicked
closeImgView.addEventListener("click", () => {
    imgDisplay.classList.remove("is-active");
})

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
        const storageRef = firebase.storage().ref();
        const imgRef = storageRef.child(`users/${googleUser.uid}`);
        imgRef.listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {
                //all the items under listRef
                    itemRef.delete();
            });
        }).catch((error) => {
            console.log(error);
        });
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
        }).then(() => setTimeout(updateCards, 100), console.log('done!'));
        closeModal();
    } else { //no file uploaded
        document.querySelector('#file-upload .file-name').textContent = "No file uploaded (required)";
    }
});

function closeModal() {
    //disable modal
    uploadForm.classList.remove("is-active");
    //reset input fields
    titleInput.value = "";
    descInput.value = "";
    document.querySelector('#file-upload .file-name').textContent = "No file uploaded"; //only changes display (file remains attached)
    document.querySelector('#file-upload input[type=file]').value = null;
}

function updateCards() {
    document.querySelector("#content").innerHTML = `<div class="columns is-centered"></div>`;
    cards = 0;
    const storageRef = firebase.storage().ref();
    const imgRef = storageRef.child(`users/${googleUser.uid}`);
    imgRef.listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {
                //all the items under listRef
                storageRef.child(itemRef._delegate._location.path_).getDownloadURL().then(function (url) {
                    var imgUrl = url;
                    itemRef.getMetadata()
                        .then((metadata) => {
                            renderCard(imgUrl, metadata.customMetadata.Title, metadata.customMetadata.Description);
                        })
                    // document.querySelector('#test').src = imgUrl;
                });
            });
        }).catch((error) => {
            console.log(error);
        });
}

function renderCard(image, title, desc) {
    cards++;
    if (cards != 1 && cards % 4 == 1) { //create new row
        var row = document.createElement("div");
        row.classList.add("columns");
        document.querySelector("#content").appendChild(row);
    }
    var column = document.createElement("div");
    column.classList.add("column", "is-one-quarter", "mt-4");
    var card = document.createElement("div");
    card.classList.add("card", "p-4", "format");
    column.appendChild(card);
    var img = document.createElement("img");
    img.classList.add("center");
    img.src = image;
    var img2 = document.createElement("img");
    img2.classList.add("center");
    img2.src = image;
    card.appendChild(img);
    var nodes = document.querySelectorAll(".columns");
    nodes[nodes.length - 1].appendChild(column);
    column.addEventListener("click", () => {
        imgDisplay.classList.add("is-active");
        imgViewDiv.innerHTML = "";
        imgViewDiv.appendChild(img2);
        imgViewTitle.innerText = title;
        imgViewDesc.innerText = desc;
    });

}