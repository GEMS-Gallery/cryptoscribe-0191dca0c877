import { Actor, HttpAgent } from '@dfinity/agent';

// Assuming these will be generated and available at build time
// import { idlFactory } from '../declarations/GEMS/GEMS.did.js';
// import { canisterId } from '../declarations/GEMS/index.js';

// For now, we'll use placeholder values
const idlFactory = {};
const canisterId = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

const agent = new HttpAgent();
let GEMS;

async function initializeActor() {
    GEMS = Actor.createActor(idlFactory, { agent, canisterId });
}

const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const output = document.getElementById('output');

generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value;
    if (!prompt) return;

    output.innerHTML = '<p class="loading">Generating design...</p>';
    output.classList.remove('hidden');

    try {
        if (!GEMS) {
            await initializeActor();
        }
        const response = await GEMS.generateDesign(prompt);
        displayOutput(response);
    } catch (error) {
        output.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
});

function displayOutput(response) {
    try {
        const parsedResponse = JSON.parse(response);
        const content = parsedResponse.content[0].text;
        const sections = content.split('\n\n');
        let html = '';

        sections.forEach(section => {
            const [title, ...contentLines] = section.split('\n');
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '');
            html += `
                <div id="${id}" class="section">
                    <h2>${title}</h2>
                    <div>${contentLines.join('<br>')}</div>
                </div>
            `;
        });

        output.innerHTML = html;
    } catch (error) {
        output.innerHTML = `<p class="error">Error parsing response: ${error.message}</p>`;
    }
}

// Initialize the actor when the page loads
initializeActor().catch(error => {
    console.error('Failed to initialize actor:', error);
    output.innerHTML = `<p class="error">Failed to initialize: ${error.message}</p>`;
});