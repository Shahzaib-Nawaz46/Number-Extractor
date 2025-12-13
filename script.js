document.addEventListener('DOMContentLoaded', () => {
    const inputData = document.getElementById('inputData');
    const outputData = document.getElementById('outputData');
    const extractBtn = document.getElementById('extractBtn');
    const copyBtn = document.getElementById('copyBtn');

    extractBtn.addEventListener('click', () => {
        const text = inputData.value;
        const lines = text.split('\n');
        const extractedNumbers = [];

        // Regex strategy:
        // 1. Look for lines starting with "Phone Number:" (flexible whitespace)
        // 2. Extract everything after the colon
        // 3. Clean up specific noise like "(Unavailable)" or other parens if they look like status
        
        // Flexible regex for the label
        const phoneLabelRegex = /Phone Number\s*:\s*(.*)/i;
        
        // General fallback: if line looks like a phone number? 
        // User asked to specifically extract from data like the sample. 
        // The sample has explicit "Phone Number:" keys.

        lines.forEach(line => {
            const match = line.match(phoneLabelRegex);
            if (match) {
                let rawNumber = match[1];
                
                // Clean up: remove (Unavailable) and similar status text in parens if necessary
                // The user said "number jo hoga wo wesa dikhna hai" (it should look like it is)
                // BUT "just focused on phone". 
                // So keeping the digits and + symbols, removing text is the best middle ground.
                
                // Remove "(Unavailable)" or any text inside parens at the end
                rawNumber = rawNumber.replace(/\s*\(.*?\)$/, '');
                
                // Trim whitespace
                rawNumber = rawNumber.trim();

                if (rawNumber) {
                    extractedNumbers.push(rawNumber);
                }
            }
        });

        if (extractedNumbers.length === 0) {
            // Fallback attempt: Look for standalone numbers if no labels found?
            // For now, adhere to the strict pattern implied by the data input.
            // If user pastes ONLY numbers, we might want to just passthrough or format?
            // "data like this... 1. Location... Phone Number: ..."
            // So the label method is robust for the request.
            outputData.value = "No phone numbers found. Make sure your input follows the 'Phone Number: ...' format.";
        } else {
            outputData.value = extractedNumbers.join('\n');
        }
    });

    copyBtn.addEventListener('click', () => {
        if (!outputData.value) return;
        
        outputData.select();
        navigator.clipboard.writeText(outputData.value).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Copied!";
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            copyBtn.innerText = "Error";
        });
    });
});
