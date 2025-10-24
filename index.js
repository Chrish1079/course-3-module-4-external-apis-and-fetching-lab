// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
}
function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-alerts');
    const stateInput = document.getElementById('state-input');
    
    fetchButton.addEventListener('click', () => {
        const state = stateInput.value.trim().toUpperCase();
        if (!state) {
            showError("Please enter a state abbreviation");
            return;
        }
        
        stateInput.value = '';
        fetchWeatherAlerts(state);
    });
});
function fetchWeatherAlerts(state) {
        hideError(); 
    return fetch(`https://api.weather.gov/alerts/active?area=${state}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather Alerts Data:', data);
            displayAlerts(data);
            return data;
        })
        .catch(error => {
            console.log('Error fetching weather alerts:', error);
            showError(error.message || 'Failed to fetch weather alerts. Please try again.');
            
            const alertContainer = document.getElementById('alerts-display');
            if (alertContainer) {
                alertContainer.innerHTML = '';
            }
        });
}

function displayAlerts(data) {
    hideError();
    const alertContainer = document.getElementById('alerts-display');
    if (!alertContainer) {
        console.error('Alert container not found in the DOM');
        return;
    }

    alertContainer.innerHTML = '';

    const numAlerts = data.features.length;
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'alert-summary';
    summaryDiv.textContent = `Weather Alerts: ${numAlerts}`;
    alertContainer.appendChild(summaryDiv);

    const alertList = document.createElement('ul');
    alertList.className = 'alert-list';
    
    data.features.forEach(feature => {
        const headline = feature.properties.headline;
        if (headline) {
            const listItem = document.createElement('li');
            listItem.textContent = headline;
            alertList.appendChild(listItem);
        }
    });

    alertContainer.appendChild(alertList);
}