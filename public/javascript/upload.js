document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from submitting via the default action

        const formData = new FormData(form);

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
                top.location.href="/detail/"+data;
                // Implement your success callback logic here
                // For example, you might want to redirect the user or display a success message
            })
            .catch(error => {
                console.error("Error:"+ error.message);
                // Implement your error handling logic here
                // For example, displaying an error message to the user
            });
    });
});