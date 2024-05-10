document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    var base64Image;
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from submitting via the default action

        const photo = form.elements['photo'].files[0];
        var fileSize=photo.size;
        console.log("file size: "+fileSize/(1024*1024)+"MB");

        // console.log("location: "+infoWindowlocation);
        //transfer image/file to base64
        if (photo) {
            // photo.value = 'newemail@example.com';
            // console.log(`Updated Email: ${photo.value}`);
            const reader = new FileReader();
            reader.onload = function(e) {
                base64Image = e.target.result;
                const formData = new FormData(form);
                formData.append("base64Image",base64Image);
                formData.delete("photo");

                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

                fetch(form.action, {
                    method: "POST",
                    body: formData,
                    })
                    .then(async response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // Assuming the server responds with JSON
                    })
                    .then(data => {
                        // console.log("success data: "+data);
                        // console.log(data);
                        setPlantId(data)
                        location.href=`/detail?plantId=${data}`;
                        // Implement your success callback logic here
                        // For example, you might want to redirect the user or display a success message
                    })
                    .catch(error => {
                        console.error("Error:"+ error.message);
                        // Implement your error handling logic here
                        // For example, displaying an error message to the user
                    });
            };
            reader.readAsDataURL(photo);
        }
    });
});