/**
 * @module main
 */

document.addEventListener("DOMContentLoaded", function () {
    // Select all elements with the class 'card-link'
    const cardLinks = document.querySelectorAll('.card-link');

    // Add click event listener to each link
    cardLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default anchor action
            const href = this.getAttribute('href'); // Get the href attribute of the clicked link
            location.href = href; // Redirect using top.location.href
        });
    });
});

// justify online/offline when entering the main page
if (navigator.onLine) {
    console.log('onLine mode')
    fetch('/requestHandler/getAllPlants')
        .then(function (res) {
            return res.json();
        })
        .then(function (newPlants) {
            if (newPlants.length === 0) {
                const container=document.getElementById("container")
                container.innerText = 'no data'
                container.style.textAlign='center'
                container.style.lineHeight='600px';
                container.style.fontSize='20px';
                //set sort unavailable
                document.getElementById('dropdown').disabled="disabled"
            } else {
                //only need to sync from server when plant was changed
                //刷新页面，当前的DOM会销毁，因此不用deleteAllPlantsDOM
                //sometime still encounter an error
                deleteAllPlantsDOM().then(() => renderPlantList(newPlants))
                // renderPlantList(newPlants)
            }

        })
} else {
    console.log("Offline mode")
    openPlantIDB().then((db) => {
        //直接从IDB获取所有plants（未同步的plant已在点击添加时加入IDB）
        getAllPlants(db, "plants").then(allPlants => {
            // return allPlants
            renderPlantList(allPlants)
        });
    })
}

/**
 *render the DOM of plant list in main page
 * @param  plantList
 */
function renderPlantList(plantList) {
    // Gets the container element to render the plant
    const plantContainer = document.getElementsByClassName('container')[0];

    // Loop through the plantList to generate the HTML of the plant card
    plantList.forEach((plant, index) => {

        // Create a new row at the beginning of every four plant cards
        if (index % 4 === 0) {
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            plantContainer.appendChild(newRow);
        }
        // Create a plant card element
        const plantCard = document.createElement('div');
        plantCard.classList.add('col-lg-3', 'col-md-6', 'mb-4', 'plant-card', 'text-center');

        // Create a card link
        const cardLink = document.createElement('a');
        cardLink.style.textDecoration = "none";
        // cardLink.href = `/detail?plantId=${plant.plantId}`;
        cardLink.href = `/detail`;
        cardLink.classList.add('card-link');
        cardLink.addEventListener('click', function (event) {
            // Block default behavior, that is, prevent the default navigation behavior of links
            // event.preventDefault();
            setPlantId(plant.plantId)
        });
        console.log("plant features:     ", plant)
        // Create a picture element
        const image = document.createElement('img');
        image.src = plant.photo;
        image.alt = plant.plantName;
        image.classList.add('img-fluid', 'mx-auto');

        // Create the description element
        const description = document.createElement('div');
        description.classList.add('mt-3');
        description.innerHTML = `<h3>${plant.plantName}</h3><p>${plant.description}</p>`;
        description.style.color = 'black'

        // Add the picture and description to the link
        cardLink.appendChild(image);
        cardLink.appendChild(description);

        // Add the link to the plant card
        plantCard.appendChild(cardLink);

        // Adds the plant card to the current row in the container
        const currentRow = plantContainer.lastElementChild;
        currentRow.appendChild(plantCard);
    });
}

/**
 * delete all plants DOM before entering the main page(prevent duplication)
 * @returns {Promise<void>}
 */
async function deleteAllPlantsDOM() {
    const plantContainer = document.getElementsByClassName('container')[0];
    console.log(plantContainer)
    while (plantContainer?.firstChild) {//There may be multiple sibling child nodes
        plantContainer.removeChild(plantContainer.firstChild);
    }
    console.log('deleteAllPlantsDOM')
}