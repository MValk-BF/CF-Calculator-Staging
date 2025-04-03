// This script is placed before the </body> tag in the Webflow project settings of the calculator pages.

window.addEventListener('message', function(event) {
    if (event.data.type === 'formData') {
        const formData = event.data.data;

        // Create a form element dynamically
        const form = document.createElement('form');
        form.action = 'https://hooks.zapier.com/hooks/catch/19923585/2cd8eis/';
        form.method = 'POST';
        form.style.display = 'none'; // Hide the form

        // Populate form with hidden inputs
        Object.keys(formData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
        });

        // Append form to body and submit
        document.body.appendChild(form);
        
        // Retrieve the locale from the form data
        const locale = formData.language || 'en'; // Default to 'en' if not provided

        // Use fetch to submit the form and handle the response
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            mode: 'no-cors' // Necessary for cross-origin requests
        }).then(response => {
            // Redirect to the results page after submission
            window.location.href = `https://bigfoot-staging.webflow.io/results-${locale}`;
        }).catch(error => {
            console.error('Error submitting form:', error);
        });
    }
});