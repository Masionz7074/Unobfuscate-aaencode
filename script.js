function deobfuscateJJEncode(code) {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
        return ""; 
    }

    const varNameMatch = trimmedCode.match(/^([a-zA-Z0-9_$]+)/);
    if (!varNameMatch) {
        return "Error: Could not find a variable name at the start of the script.";
    }
    const varName = varNameMatch[1];
    
    const startMarker = `${varName}.\$(${varName}.\$(`;
    const endMarker = `)())();`;

    const startIndex = trimmedCode.indexOf(startMarker);
    const endIndex = trimmedCode.lastIndexOf(endMarker);

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        return "Error: Script does not match the expected JJEncode structure. Could not find execution wrapper.";
    }

    const setupCode = trimmedCode.substring(0, startIndex);
    const payloadExpression = trimmedCode.substring(startIndex + startMarker.length, endIndex);
    
    try {
        const contextObject = new Function(`${setupCode}; return ${varName};`)();
        const deobfuscatedResult = new Function(varName, `return ${payloadExpression};`)(contextObject);
        return deobfuscatedResult;
    } catch (e) {
        console.error("Deobfuscation error:", e);
        return `An error occurred during deobfuscation: ${e.message}. Check the console (F12) for more details.`;
    }
}

function handleDeobfuscation() {
    const obfuscatedCode = document.getElementById('obfuscatedCode').value;
    const deobfuscated = deobfuscateJJEncode(obfuscatedCode);
    document.getElementById('deobfuscatedCode').value = deobfuscated;
}

document.addEventListener('DOMContentLoaded', () => {
    const deobfuscateButton = document.getElementById('deobfuscateButton');

    if (deobfuscateButton) {
        deobfuscateButton.addEventListener('click', handleDeobfuscation);
    }
});
