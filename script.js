document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('carbon-footprint-form');
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }

   function validateStep(stepIndex) {
    let isValid = true;
    const percentageFields = document.querySelectorAll('.step#step-1 input[type="number"]');
    const foodFields = document.querySelectorAll('.step#step-6 input[type="number"]');
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (stepIndex === 0) {
        if (!emailRegex.test(emailField.value)) {
            document.getElementById('email-warning').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('email-warning').style.display = 'none';
        }
    }

    if (stepIndex === 1) {
        let totalPercentage = 0;
        percentageFields.forEach(field => {
            if (field.id !== 'commuteKm') {
                totalPercentage += parseInt(field.value) || 0;
            }
        });
        if (totalPercentage !== 100) {
            document.getElementById('percentage-warning').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('percentage-warning').style.display = 'none';
        }
    }

    if (stepIndex === 6) {
        let totalDays = 0;
        foodFields.forEach(field => {
            totalDays += parseInt(field.value) || 0;
        });
        if (totalDays !== 7) {
            document.getElementById('food-warning').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('food-warning').style.display = 'none';
        }
    }

    if (stepIndex === 9) {
        const shareOption = document.querySelector('input[name="shareOption"]:checked');
        if (!shareOption) {
            document.getElementById('consent-warning').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('consent-warning').style.display = 'none';
        }
    }

    return isValid;
}
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateStep(9)) {
        } else {
        }
    });
    
    function fillEmptyFields() {
        const numberFields = document.querySelectorAll('input[type="number"]');
        numberFields.forEach(field => {
            if (field.value === '') {
                if (field.id === 'householdSize') {
                    field.value = 1;
                } else {
                    field.value = 0;
                }
            }
        });
    }

    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep === steps.length - 2) {
                fillEmptyFields();
            }
            nextStep();
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', prevStep);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        fillEmptyFields();

        // Get the current date and time
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const formattedTime = currentDate.toTimeString().split(' ')[0]; // Format: HH:MM:SS

        // Gather form data
        const formData = {
            email: document.getElementById('email').value,
            busFlights: document.getElementById('busFlights').value,
            persFlights: document.getElementById('persFlights').value,
            commuteKm: document.getElementById('commuteKm').value,
            commuteHome: document.getElementById('commuteHome').value,
            commuteTrain: document.getElementById('commuteTrain').value,
            commuteOV: document.getElementById('commuteOV').value,
            commuteCar: document.getElementById('commuteCar').value,
            commuteEV: document.getElementById('commuteEV').value,
            commuteMove: document.getElementById('commuteMove').value,
            bustravelTrain: document.getElementById('bustravelTrain').value,
            bustravelOV: document.getElementById('bustravelOV').value,
            bustravelCar: document.getElementById('bustravelCar').value,
            bustravelEV: document.getElementById('bustravelEV').value,
            perstravelTrain: document.getElementById('perstravelTrain').value,
            perstravelOV: document.getElementById('perstravelOV').value,
            perstravelCar: document.getElementById('perstravelCar').value,
            perstravelEV: document.getElementById('perstravelEV').value,
            vegan: document.getElementById('vegan').value,
            veggie: document.getElementById('veggie').value,
            fish: document.getElementById('fish').value,
            meat: document.getElementById('meat').value,
            elecUse: document.getElementById('elecUse').value,
            elecType: document.getElementById('elecType').value,
            heatingUse: document.getElementById('heatingUse').value,
            heatingType: document.getElementById('heatingType').value,
            householdSize: document.getElementById('householdSize').value,
            clothing: document.getElementById('clothing').value,
            smallElec: document.getElementById('smallElec').value,
            largeElec: document.getElementById('largeElec').value,
            furniture: document.getElementById('furniture').value,
            shareOption: document.querySelector('input[name="shareOption"]:checked').value,
            submissionDate: formattedDate,
            submissionTime: formattedTime
        };
        
        // Send form data to parent window
        window.parent.postMessage({ type: 'formData', data: formData }, '*');

    });

    showStep(currentStep);

    const heatingTypeField = document.getElementById('heatingType');
    const heatingUseLabel = document.querySelector('label[for="heatingUse"]');
    const heatingUseInput = document.getElementById('heatingUse');
    const elecUseLabel = document.querySelector('label[for="elecUse"]');

    heatingTypeField.addEventListener('change', function() {
        switch (heatingTypeField.value) {
            case 'Natural gas':
                heatingUseLabel.innerHTML = 'How many m³ of natural gas did you use in the last year? <span class="info-icon" data-title="You should be able to find this information on your yearly utility bills. The yearly average natural gas consumption for heating in the EU is 547 m³ per person.">ℹ️</span>';
                heatingUseInput.style.display = 'block';
                heatingUseLabel.style.display = 'block';
                elecUseLabel.innerHTML = 'How many kWh of electricity did you use in the last year? <span class="info-icon" data-title="You should be able to find this information on your yearly utility bills. The yearly average non-heating electricity usage in the EU is 1012 kWh per person.">ℹ️</span>';
                break;
            case 'Heating oil':
                heatingUseLabel.innerHTML = 'How many litres of heating oil did you use in the last year? <span class="info-icon" data-title="You should be able to find this information on your yearly utility bills. The yearly average heating oil usage in the EU is 589 litres per person.">ℹ️</span>';
                heatingUseInput.style.display = 'block';
                heatingUseLabel.style.display = 'block';
                elecUseLabel.innerHTML = 'How many kWh of electricity did you use in the last year? <span class="info-icon" data-title="You should be able to find this information on your yearly utility bills. The yearly average non-heating electricity usage in the EU is 1012 kWh per person.">ℹ️</span>';
                break;
            case 'Electricity':
                heatingUseInput.style.display = 'none';
                heatingUseLabel.style.display = 'none';
                elecUseLabel.innerHTML = 'How many kWh of electricity did you use in the last year? <span class="info-icon" data-title="You should be able to find this information on your yearly utility bills. The yearly average electricity usage in the EU is 6782 kWh per person (includes electricity for heating).">ℹ️</span>';
                break;
            case 'Biofuels':
            case "Other or don't know":
                heatingUseInput.style.display = 'none';
                heatingUseLabel.style.display = 'none';
                elecUseLabel.innerHTML = 'How many kWh of electricity did you use in the last year? <span class="info-icon" data-title="You should be able to find this information on your yearly utility bills. The yearly average non-heating electricity usage in the EU is 1012 kWh per person.">ℹ️</span>';
                break;
            default:
                heatingUseInput.style.display = 'none';
                heatingUseLabel.style.display = 'none';
                break;
        }
    });
});

$(document).ready(function() {
    // Prevent negative numbers and non-numeric characters
    $('input[type="number"]').on('input', function() {
        let value = $(this).val().replace(/[^\d]/g, ''); // Remove non-numeric characters
        value = value === '' ? '' : parseInt(value, 10); // Convert to integer
        $(this).val(value);
    });
});
