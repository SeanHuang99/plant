async function submitRequestFromURPage() {
    const plantId = getPlantId();
    const creator = getNickName();


    // Post the data to the backend via the "/updatePlants" route
    const response = await fetch('/requestHandler/updatePlantsRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId, preferredPlantName, nickName, creator})
    });

    if (response.ok) {
        synPlantFromServer();
        generateDetailPage();
        alert('Request submitted successfully!');
    } else {
        alert('Error submitting request');
    }
    // Close the modal after submitting
    // $('#editModal').modal('hide');
    closeEditPopup()
}