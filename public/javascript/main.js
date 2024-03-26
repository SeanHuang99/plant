document.addEventListener("DOMContentLoaded", function() {
    // Select all elements with the class 'card-link'
    const cardLinks = document.querySelectorAll('.card-link');

    // Add click event listener to each link
    cardLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor action
            const href = this.getAttribute('href'); // Get the href attribute of the clicked link
            top.location.href = href; // Redirect using top.location.href
        });
    });
});
