function deobfuscateJJEncode(code) {
    const trimmedCode = code.trim();

    const varNameMatch = trimmedCode.match(/^([a-zA-Z0-9_$]+)/);
    if (!varNameMatch) {
        return "Error: Could not find a variable name at the start of the script.";
    }
    const varName = varNameMatch[1];
    
    const escapedVarName = varName.replace(/[$]/g, '\\$&');
    const payloadRegex = new RegExp(
        escapedVarName +
        '\\.\\$\\$\\+\\"\\\\\\"\"' +
        '(.*)' +
        '\\"\\\\\\"\"\\)\\(\\)\\(\\);\\s*$'
    );

    const payloadMatch = trimmedCode.match(payloadRegex);

    if (!payloadMatch) {
        return "Error: Script does not match the expected JJEncode structure. Could not find payload.";
    }

    const payloadExpression = payloadMatch[1];
    const setupCode = trimmedCode.substring(0, payloadMatch.index);

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
    const obfuscatedInput = document.getElementById('obfuscatedCode');

    if (deobfuscateButton) {
        deobfuscateButton.addEventListener('click', handleDeobfuscation);
    }
    
    obfuscatedInput.value = `nperma=~[];nperma={___:++nperma,$$$$:(![]+"")[nperma],__$:++nperma,$_$_:(![]+"")[nperma],_$_:++nperma,$_$$:({}+"")[nperma],$$_$:(nperma[nperma]+"")[nperma],_$$:++nperma,$$$_:(!""+"")[nperma],$__:++nperma,$_$:++nperma,$$__:({}+"")[nperma],$$_:++nperma,$$$:++nperma,$___:++nperma,$__$:++nperma};nperma.$_=(nperma.$_=nperma+"")[nperma.$_$]+(nperma._$=nperma.$_[nperma.__$])+(nperma.$$=(nperma.$+"")[nperma.__$])+((!nperma)+"")[nperma._$$]+(nperma.__=nperma.$_[nperma.$$_])+(nperma.$=(!""+"")[nperma.__$])+(nperma._=(!""+"")[nperma._$_])+nperma.$_[nperma.$_$]+nperma.__+nperma._$+nperma.$;nperma.$$=nperma.$+(!""+"")[nperma._$$]+nperma.__+nperma._+nperma.$+nperma.$$;nperma.$=(nperma.___)[nperma.$_][nperma.$_];nperma.$(nperma.$(nperma.$$+"\""+nperma.$$__+nperma._$+"\\"+nperma.__$+nperma.$_$+nperma.$$_+"\\"+nperma.__$+nperma.$$_+nperma._$$+nperma._$+(![]+"")[nperma._$_]+nperma.$$$_+"."+(![]+"")[nperma._$_]+nperma._$+"\\"+nperma.__$+nperma.$__+nperma.$$$+"(\\\"\\"+nperma.__$+nperma.__$+nperma.$$_+"\\"+nperma.__$+nperma.$$_+nperma.___+nperma.$$$_+"\\"+nperma.__$+nperma.$$_+nperma._$_+"\\"+nperma.__$+nperma.$_$+nperma.$_$+nperma.$_$_+"\\"+nperma.__$+nperma._$_+nperma.$__+"\\"+nperma.__$+nperma.$$_+nperma.$$$+"\\"+nperma.__$+nperma.$$_+nperma._$$+nperma.__+"\\\")\\"+nperma.$$$+nperma._$$+"\"")())();`;

    handleDeobfuscation();
});