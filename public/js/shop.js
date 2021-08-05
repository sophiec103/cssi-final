function getCategory()
{
    const category = document.querySelector('#category').value;
    console.log(category);

    const itemsRef = firebase.database().ref(`shopItems/${category}`);
    itemsRef.on('value', (db) => {
        const data = db.val();
        renderData(data);
    });
}

function renderData(data)
{
    let html = '';

    for(const dataKey in data)
    {
        const item = data[dataKey];
        const cardHtml = renderItemCards(item);
        console.log(cardHtml);
        html += cardHtml;
    }

    document.querySelector('#item-cards').innerHTML = html;
}

function renderItemCards(item)
{
    return `
    <div id="top-right" class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img id = "item-img"
            src="${ item.image }"
            alt="Avatar"
            style="max-width:100%; padding: 5%;"
          />
        </div>
        <div class="flip-card-back">
          <h1 id = "item-name">${ item.name }</h1>
          <p id = "item-price">$${ item.price }</p>
          <p id = "item-desc">${ item.desc }</p>
        </div>
      </div>
    `;
}