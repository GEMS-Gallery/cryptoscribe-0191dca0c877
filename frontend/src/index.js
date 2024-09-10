// TODO: Replace this mock implementation with actual canister integration when available
const mockGenerateDesign = async (prompt) => {
    return JSON.stringify({
        model: "claude-3-sonnet-20240229",
        content: [{
            type: "text",
            text: `3D Model Description\nA detailed 3D model based on your prompt: ${prompt}\n\n` +
                  "Material Properties\nSuggested materials and their properties for the 3D object.\n\n" +
                  "Printing Instructions\nStep-by-step guide for 3D printing this object.\n\n" +
                  "Post-Processing\nRecommended post-processing techniques for the printed object."
        }]
    });
};

const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const output = document.getElementById('output');

generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value;
    if (!prompt) return;

    output.innerHTML = '<p class="loading">Generating design...</p>';
    output.classList.remove('hidden');

    try {
        const response = await mockGenerateDesign(prompt);
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