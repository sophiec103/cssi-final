// url = `https://api.documenu.com/v2/restaurant/4072702673999819?key=${apiKey}`


// url = 'https://api.documenu.com/v2/restaurants/search/fields/?key=042da5045aa0dc6132d33cb52abeb89b'

// `https://api.documenu.com/v2/restaurants/search/fields?state=TX?key=042da5045aa0dc6132d33cb52abeb89b`

// https://api.documenu.com/v2/restaurants/search/fields?key=042da5045aa0dc6132d33cb52abeb89b

const searchRestaurants = () => {
    const zipCode = document.querySelector("#zSearch").value

    console.log(zipCode)
    if (zipCode == "") {
        alert("please enter a valid zip code")
        console.log("search cancelled - invalid zip")
        return;
    }

    const url = `https://api.documenu.com/v2/restaurants/search/fields?zip_code=${zipCode}&size=100`
    const apiKey = "042da5045aa0dc6132d33cb52abeb89b"

    fetch(url, {

        // // mode: 'no-cors', 
        headers: {
            // "accept": "application/json",
            // "Access-Control-Allow-Origin":"*",
            // 'Authorization': `Bearer ${apiKey}`

            'X-API-KEY': `${apiKey}`
        }
    })
    .then(response => response.json())
    .then(json => {
        // console.log(json.data)
        filter(json.data)
    })
    .catch(error => console.log(error))
}

const filter = (data) => {
    var list = []

    for (let i = 0; i < 100; i++) {
        // console.log(data[i])

        if (isDesired(data[i]))
            list.push(data[i])
    }

    console.log(list)
    renderHTML(list)
}

const isDesired = (restaurant) => {
    if (fitsPrice(restaurant) && fitsCuisine(restaurant))
        return true;
    return false
}

const fitsPrice = (restaurant) => {
    const price = document.querySelector("#pSearch").value

    if (price == "" || restaurant.price_range == price)
        return true

    return false
}

const fitsCuisine = (restaurant) => {
    var cuisines = restaurant.cuisines
    // console.log(cuisines)
    
    const cuisine = document.querySelector("#cSearch").value.toLowerCase()

    if (cuisine == "")
        return true
    
    for (let i = 0; i < cuisines.length; i++)
        if (cuisines[i] != null && cuisines[i].toLowerCase() == cuisine)
            return true

    return false
}

const renderHTML = (list) => {
    var cards = []

    for (let i = 0; i < list.length; i++) {
        cards += createCard(list[i])
    }

    document.querySelector("#displayRestaurants").innerHTML = cards
}

const createCard = (restaurant) => {
    return `
     <div class="column is-one-quarter">
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">${restaurant.restaurant_name}</p>
         </header>
         <div class="card-content">
           <div class="content">${restaurant.website}</div>
         </div>


       </div>
     </div>
   `;
}

























// var url = `https://api.yelp.com/v3/businesses/search`

// const apiKey = "MW6g0sqDwUL3ct8qYNjh9Mr8MRAdGNl_i6YD7k8yejVMwE2Y7O-KTTQ0w9lZB9UJKrwYwQbxjqwZLMsEXfLDUKWde5AalSrfTRLyt33TEq3IMwHCb1YDzA84z4oJYXYx"

// const yelp = new YelpFusion({
//   consumer_key: 'consumer-key',
//   consumer_secret: 'consumer-secret',
//   token: 'token',
//   token_secret: 'token-secret'
// });

// const searchRestaurants = () => {
//     fetch(url, {

//         mode: 'no-cors', 
//         headers: {
//             "accept": "application/json",
//             "Access-Control-Allow-Origin":"*",
//             'Authorization': `Bearer ${apiKey}`
//         }
//     })
//     // .then(response => response.json())
//     .then(json => {
//         console.log(json.data)
//     })
//     .catch(error => console.log(error))
// }




// submitButton.addEventListener("click", e => {
//   const myKey = "mMDrHEHaycdRvbPJWbtlyfDMEE6dKN9Y";
//   const topic = queryField.value;
//   const url = `https://api.giphy.com/v1/gifs/search?api_key=${myKey}&q=${topic} + pizza`;
//   console.log(url);

//   fetch(url)
//     .then(response => response.json())
//     .then(json => {
//       console.log(json);
//       let random = getRandom(50);
//       const imgUrl = json.data[random].images.downsized.url;
//       console.log(imgUrl);
//       imageHolderDiv.innerHTML = `<img src = "${imgUrl}"/>`;
//     })
  
//   .catch(error => console.log(error))

// });

