document.addEventListener("DOMContentLoaded", function() {
    // Select all elements with the class 'card-link'
    const cardLinks = document.querySelectorAll('.card-link');

    // Add click event listener to each link
    cardLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor action
            const href = this.getAttribute('href'); // Get the href attribute of the clicked link
            location.href = href; // Redirect using top.location.href
        });
    });
});



if (navigator.onLine) {
    console.log('onLine mode')
    fetch('/requestHandler/getAllPlants')
        .then(function (res) {
            return res.json();
        })
        .then(function (newPlants) {
            synPlantFromServer();
            renderPlantList(newPlants)
        })
}
else {
    console.log("Offline mode")
    openPlantsIDB().then((db) => {
        //直接从IDB获取所有plants（未同步的plant已在点击添加时加入IDB）
        getAllPlants(db).then(allPlants => {
            // return allPlants
            renderPlantList(allPlants)
        });
    })
}

function renderPlantList(plantList){
    // 获取要渲染植物的容器元素
    const plantContainer = document.getElementsByClassName('container')[0];

    // 循环遍历 plantList，生成植物卡片的 HTML
    plantList.forEach((plant, index) => {

        // 每四个植物卡片开始时创建一个新的行
        if (index % 4 === 0) {
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            plantContainer.appendChild(newRow);
        }
        // 创建植物卡片元素
        const plantCard = document.createElement('div');
        plantCard.classList.add('col-lg-3', 'col-md-6', 'mb-4','plant-card', 'text-center');

        // 创建卡片链接
        const cardLink = document.createElement('a');
        // cardLink.href = `/detail?plantId=${plant.plantId}`;
        cardLink.href = `/detail`;
        cardLink.classList.add('card-link');
        // 添加点击事件监听器
        cardLink.addEventListener('click', function(event) {
            // 阻止默认行为，即防止链接的默认导航行为
            // event.preventDefault();
            setPlantId(plant.plantId)

            // 在这里执行你想要的操作，例如跳转到详情页面或其他处理
            // 这里可以根据 plantId 执行相应的操作，比如跳转到详情页
            // window.location.href = `/detail?plantId=${plantId}`;
        });
        console.log("plant features:     ",plant)
        // 创建图片元素
        const image = document.createElement('img');
        image.src = plant.photo;
        image.alt = plant.plantName;
        image.classList.add('img-fluid', 'mx-auto');

        // 创建描述元素
        const description = document.createElement('div');
        description.classList.add('mt-3');
        description.innerHTML = `<h3>${plant.plantName}</h3><p>${plant.description}</p>`;

        // 将图片和描述添加到链接中
        cardLink.appendChild(image);
        cardLink.appendChild(description);

        // 将链接添加到植物卡片中
        plantCard.appendChild(cardLink);

        // 将植物卡片添加到容器中的当前行
        const currentRow = plantContainer.lastElementChild;
        currentRow.appendChild(plantCard);
    });
}

//排序前先删除之前渲染的plantList
function deleteAllPlantsDOM(){
    const plantContainer = document.getElementsByClassName('container')[0];
    while (plantContainer.firstChild) {//可能有多个同级子节点
        plantContainer.removeChild(plantContainer.firstChild);
    }
    console.log('deleteAllPlantsDOM')
}