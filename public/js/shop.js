window.onload = (event) => {
    console.log("window loaded")
    getCategory()
}

const getCategory = () => {
    var category = document.querySelector('#category').value;
    var itemsRef;
    console.log(category);
     
    if (category == "Select a category!")
        return;

    else {

        if (category == "Technology")
            category = "Electronics"

        if (category == "Essentials")
            category = "essentials"

        itemsRef = firebase.database().ref(`shopItems/${category}`);
    }
   
    itemsRef.on('value', (db) => {
        const data = db.val();
        renderData(data);
    });
}

function renderData(data)
{
    let html = '<div class="columns is-centered is-variable is-5">';

    console.log(data)

    for(const dataKey in data)
    {
        const item = data[dataKey];
        // console.log(item)
        const cardHtml = renderCards(item);
        // console.log(cardHtml);
        html += cardHtml;
    }

    document.querySelector('#item-cards').innerHTML = html;
}

// function renderItemCards(item)
// {
//     return `
//     <div id="top-right" class="flip-card">
//       <div class="flip-card-inner">
//         <div class="flip-card-front">
//           <img id = "item-img"
//             src="${ item.image }"
//             alt="Avatar"
//             style="max-width:100%; padding: 5%;"
//           />
//         </div>
//         <div class="flip-card-back">
//           <h1 id = "item-name">${ item.name }</h1>
//           <p id = "item-price">${ item.price }</p>
//           <p id = "item-desc">${ item.desc }</p>
//         </div>
//       </div>
//     `;
// }

const renderCards = (item) => {
    return `

      <div class="column is-one-quarter mt-4">
        <div class="card p-4 format">
            <div class="card-image is-centered">
                <figure class="image is-4by3 center">
                    <img src="${item.image}" class = "center" alt="Placeholder image">
                </figure>
            </div>
    
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <p class="title is-4" style = "color: black">${item.name}</p>
                        <p class="subtitle is-6" style = "color: black">Price: ${item.price}</p>
                    </div>
                </div>

                <div class="content">
                    Our recommendation for the ${item.desc.toLowerCase()}! Click the button below to purchase the item at an official online retailer: 
                    <br>

                        <div class="control">
                            <a href = ${item.link}>
                            <button class="button is-link is-fullwidthhas-text-weight-medium is-medium" style = "margin-top: 20px"> Buy Now </button>
                            </a>
                        </div>
          
                </div>
                
            </div>
        </div>
      </div>`
}

const getLink = (item) => {
    window.location.assign(item.link)
}