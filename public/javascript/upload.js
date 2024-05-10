document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    var base64Image;
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from submitting via the default action

        //表单验证（非空判断）
        // 检查是否至少有一个单选按钮被选中
        const flowersYes = document.getElementById('flowersYes');
        const flowersNo = document.getElementById('flowersNo');
        if (!(flowersYes.checked || flowersNo.checked )) {
            alert('Please select whether the plant has flowers.');
            flowersYes.focus()
            return; // 防止表单提交
        }
        if (!selectSunExposure()){
            alert('Please choose the Sun Exposure.');
            const sunExposure=document.getElementById("sunExposure")
            sunExposure.focus()
            return; // 防止表单提交
        }
        const color=document.getElementById("flowerColor")
        if (color.value==null || color.value===""){
            alert('Please choose the color.');
            color.focus()
            return; // 防止表单提交
        }
        const complete = document.getElementById('statusComplete');
        const inProgress = document.getElementById('statusInProgress');
        if (!(complete.checked || inProgress.checked )) {
            alert('Please select the status of the identification.');
            complete.focus()
            return; // 防止表单提交
        }
        // if (getMarker()==null){
        //     alert('Please select the location');
        //     const map=document.getElementById('map')
        //     map.focus()
        //     return; // 防止表单提交
        // }


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