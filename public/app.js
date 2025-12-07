const API_URL = '/api/plan-trip'; 

const originInput = document.getElementById('originInput'); 
const destinationInput = document.getElementById('destinationInput');
const experienceInput = document.getElementById('experienceInput');
const planTripButton = document.getElementById('planTripButton');
const buttonText = document.getElementById('button-text');
const loadingIndicator = document.getElementById('loading-indicator');
const resultsContainer = document.getElementById('results-container');
const resultsTitle = document.getElementById('results-title');
const sourcesContainer = document.getElementById('sources-container');
const sourceList = document.getElementById('source-list');
const placeholderText = document.getElementById('placeholder-text');

// function markdownToHtml(markdown) {
//     let html = markdown;

//     html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
//     html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');

//     html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
//     html = html.replace(/(\n?<li>.*<\/li>)+/gim, '<ul>$1</ul>');

//     html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

//     html = html.replace(/(\r\n|\r|\n){2,}/g, '</p><p>');
//     html = '<p>' + html + '</p>';
    

//     html = html.replace(/<ul>\s*<p>(.*?)<\/p>\s*<\/ul>/gim, '<ul>$1</ul>');
//     html = html.replace(/<\/p>(\s*<h2>|<h3>|<ul>)/gim, '$1');
//     html = html.replace(/(<\/ul>|<\/h\d>)\s*<p>/gim, '$1');

//     return DOMPurify.sanitize(html);
// }

function markdownToHtml(markdown) {
    const rawHtml = marked.parse(markdown);

    return DOMPurify.sanitize(rawHtml);
}

async function fetchWithRetry(destination, origin, experience, maxRetries = 5) {
    let lastError = null;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, origin, experience })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Proxy error: ${errorData.error || response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            lastError = error;
            console.error(`Attempt ${attempt + 1} failed:`, error);
            const delay = Math.pow(2, attempt) * 1000;
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error(`Failed to fetch API after ${maxRetries} attempts. Last error: ${lastError.message}`);
}


async function fetchTravelData(destination) {

    planTripButton.disabled = true;
    buttonText.textContent = 'Planning...';
    loadingIndicator.classList.remove('hidden');
    resultsContainer.innerHTML = '';
    resultsTitle.style.display = 'none';
    sourcesContainer.style.display = 'none';
    placeholderText.style.display = 'none';

    const origin = originInput.value.trim(); 
    const experience = experienceInput.value.trim();

    try {
        const result = await fetchWithRetry(destination, origin, experience);
        
        const candidate = result.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;

        if (!text) {
             resultsContainer.innerHTML = '<p class="text-red-500 font-semibold">Could not generate a travel report. Please try a different destination or check your input.</p>';
             return;
        }

        const htmlContent = markdownToHtml(text);
        resultsContainer.innerHTML = htmlContent;
        resultsTitle.style.display = 'block';

        let sources = [];
        const groundingMetadata = candidate?.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
            sources = groundingMetadata.groundingAttributions
                .map(attribution => ({
                    uri: attribution.web?.uri,
                    title: attribution.web?.title,
                }))
                .filter(source => source.uri && source.title); 
        }
        
        sourceList.innerHTML = '';
        if (sources.length > 0) {
            sources.forEach(source => {
                const li = document.createElement('li');
                li.className = 'flex items-start';
                li.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3.353 3.354A1.5 1.5 0 019.243 12H7a1 1 0 010-2h2.243l3.353-3.354zm-9.332 9.07a1.5 1.5 0 01.353.486l-2 2a1 1 0 001.414 1.414l2-2a1.5 1.5 0 01.486.353l3.354 3.353A1.5 1.5 0 0113 17.757V15a1 1 0 10-2 0v2.757L7.646 14.404a1.5 1.5 0 01-.486-.353l-3.353-3.354a1.5 1.5 0 01-.354-.486 1.5 1.5 0 01-.486-.353l-2-2a1 1 0 00-1.414 1.414l2 2a1.5 1.5 0 01.353.486z" clip-rule="evenodd" /></svg><a href="${source.uri}" target="_blank" class="hover:underline text-blue-600">${source.title}</a>`;
                sourceList.appendChild(li);
            });
            sourcesContainer.style.display = 'block';
        }

    } catch (error) {
        console.error("Critical API Error:", error);
        resultsContainer.innerHTML = `<p class="text-red-600 font-semibold">An unexpected error occurred while processing your request. Please try again later. (${error.message})</p>`;
    } finally {
        planTripButton.disabled = false;
        buttonText.textContent = 'Plan My Trip';
        loadingIndicator.classList.add('hidden');
    }
}

planTripButton.addEventListener('click', () => {
    const destination = destinationInput.value.trim();
    if (destination) {
        fetchTravelData(destination);
    } else {
        resultsContainer.innerHTML = '<p class="text-red-500 font-semibold">Please enter a valid travel destination to begin.</p>';
    }
});

destinationInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        planTripButton.click();
    }
});

originInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        destinationInput.focus(); 
    }
});