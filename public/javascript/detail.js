window.onload=function (){
    window.localStorage.setItem('lastURL','/detail');
    console.log("wel to detail");
    const plantId=localStorage.getItem('plantId')
    console.log('plantId: '+plantId)
    if (plantId==null){
        console.log('plantId==null')
        //return to main page, and show alert of 'cannot find plant'
    }
    // console.log('lalala')
    openPlantsIDB().then(IDB=>{
        getDetailById(IDB,plantId).then(plant=>{
            console.log('plant found in IDB ----- '+typeof plant)
            console.log(plant.plantId+'-------> '+plant.description)
        }).catch(err=> {
            console.log(err)
        })
        // if (plant!=null){
        //   //todo:insert html code
        // }
        // else {//return to main page, and show alert of 'cannot find plant'
        //   console.log('plant==null')
        // }
    })

    //syncn
}