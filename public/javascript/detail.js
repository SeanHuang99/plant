window.onload=function (){
    window.localStorage.setItem('lastURL','/detail');
    console.log("wel to detail");
    const plantId=localStorage.getItem('plantId')
    console.log('plantId: '+plantId)
    if (plantId==null){
        console.log('plantId==null')
        //todo: return to main page, and show alert of 'cannot find plant'
    }
    openPlantsIDB().then(IDB=>{
        getDetailById(IDB,plantId).then(plant=>{
            console.log('plant found in IDB ----- '+typeof plant)
            console.log(plant.plantId+'-------> '+plant.description)
            detailRender(plant)
        }).catch(err=> {
            console.log(err)
            //todo: return to main page, and show alert of 'cannot find plant'
        })
    })

    //render the page manully
    function detailRender(plant){
        document.getElementById('plantName').textContent = `Plant Name: ${plant.plantName}`;
        document.getElementById('plantDescription').textContent = `Description: ${plant.description}`;
    }
}