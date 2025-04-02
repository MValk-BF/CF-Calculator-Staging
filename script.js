let translations = {}; // Holds the loaded translations

async function loadTranslations(lang) {
    try {
        const response = await fetch("translations.json");
        const data = await response.json();
        translations = data[lang] || data["en"]; // Fallback to English if language is missing
        applyTranslations();
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

function applyTranslations() {
    // Translate elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[key]) {
            el.setAttribute("placeholder", translations[key]);
        }
    });

    // Translate data-title attributes for info-icon spans
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.getAttribute("data-i18n-title");
        if (translations[key]) {
            el.setAttribute("data-title", translations[key]);
        }
    });

    // Update warning messages
    document.getElementById('email-warning').textContent = translations.emailWarning;
    document.getElementById('percentage-warning').textContent = translations.percentageWarning;
    document.getElementById('food-warning').textContent = translations.foodWarning;
    document.getElementById('consent-warning').textContent = translations.consentWarning;
}

const urlParams = new URLSearchParams(window.location.search);
const language = urlParams.get("lang") || "en"; // Default to English
loadTranslations(language);

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
            document.getElementById('email-warning').textContent = translations.emailWarning;
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
            document.getElementById('percentage-warning').textContent = translations.percentageWarning;
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
            document.getElementById('food-warning').textContent = translations.foodWarning;
            document.getElementById('food-warning').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('food-warning').style.display = 'none';
        }
    }

    if (stepIndex === 9) {
        const shareOption = document.querySelector('input[name="shareOption"]:checked');
        if (!shareOption) {
            document.getElementById('consent-warning').textContent = translations.consentWarning;
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
            submissionTime: formattedTime,
            language: urlParams.get("lang") || "en"
        };
        
        // Send form data to parent window
        window.parent.postMessage({ type: 'formData', data: formData }, '*');

    });

    showStep(currentStep);

    const heatingTypeField = document.getElementById('heatingType');
    const heatingUseLabel = document.querySelector('label[for="heatingUse"]');
    const heatingUseInput = document.getElementById('heatingUse');
    const elecUseLabel = document.querySelector('label[for="elecUse"]');
    const naturalGasInfo = document.getElementById('naturalGasInfo');
    const electricityInfo = document.getElementById('electricityInfo');

    heatingTypeField.addEventListener('change', function() {
        switch (heatingTypeField.value) {
            case 'Natural gas':
                heatingUseLabel.innerHTML = `${translations.heatingUse} <span class="info-icon" data-title="${translations.naturalGasInfo}">ℹ️</span>`;
                heatingUseInput.style.display = 'block';
                heatingUseLabel.style.display = 'block';
                naturalGasInfo.style.display = 'none';
                electricityInfo.style.display = 'none';
                elecUseLabel.innerHTML = `${translations.elecUse} <span class="info-icon" data-title="${translations.electricityInfo}">ℹ️</span>`;
                break;
            case 'Heating oil':
                heatingUseLabel.innerHTML = `${translations.heatingOilUse} <span class="info-icon" data-title="${translations.heatingOilInfo}">ℹ️</span>`;
                heatingUseInput.style.display = 'block';
                heatingUseLabel.style.display = 'block';
                naturalGasInfo.style.display = 'none';
                electricityInfo.style.display = 'none';
                elecUseLabel.innerHTML = `${translations.elecUse} <span class="info-icon" data-title="${translations.electricityInfo}">ℹ️</span>`;
                break;
            case 'Electricity':
                heatingUseInput.style.display = 'none';
                heatingUseLabel.style.display = 'none';
                naturalGasInfo.style.display = 'none';
                electricityInfo.style.display = 'none';
                elecUseLabel.innerHTML = `${translations.elecUse} <span class="info-icon" data-title="${translations.electricityHeatingInfo}">ℹ️</span>`;
                break;
            case 'Biofuels':
            case "Other or don't know":
                heatingUseInput.style.display = 'none';
                heatingUseLabel.style.display = 'none';
                naturalGasInfo.style.display = 'none';
                electricityInfo.style.display = 'none';
                elecUseLabel.innerHTML = `${translations.elecUse} <span class="info-icon" data-title="${translations.electricityInfo}">ℹ️</span>`;
                break;
            default:
                heatingUseInput.style.display = 'none';
                heatingUseLabel.style.display = 'none';
                naturalGasInfo.style.display = 'none';
                electricityInfo.style.display = 'none';
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
