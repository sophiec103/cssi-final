// const apiKey = "042da5045aa0dc6132d33cb52abeb89b"
// var url = `https://api.documenu.com/v2/restaurant/4072702673999819?key=${apiKey}`


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

