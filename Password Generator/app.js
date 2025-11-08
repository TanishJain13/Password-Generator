const passwordField = document.getElementById("password");
const genBtn = document.querySelector(".btn1");
const copyBtn = document.querySelector(".btn2");
const lengthInput = document.getElementById("length");
const lengthValueSpan = document.getElementById("length-value");
const copyMessage = document.getElementById("copy-message");

// Checkbox Elements
const includeUppercase = document.getElementById("include-uppercase");
const includeLowercase = document.getElementById("include-lowercase");
const includeNumbers = document.getElementById("include-numbers");
const includeSymbols = document.getElementById("include-symbols");

// Character Sets
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

// --- Event Listeners ---
genBtn.addEventListener("click", genPassword);
copyBtn.addEventListener("click", copyPassword);

// Update password length display when the slider moves
lengthInput.addEventListener("input", () => {
    lengthValueSpan.textContent = lengthInput.value;
});

// --- Core Logic ---

function genPassword() {
    let allowedChars = "";
    
    // 1. Build the allowed character set based on checked options
    if (includeUppercase.checked) allowedChars += UPPERCASE_CHARS;
    if (includeLowercase.checked) allowedChars += LOWERCASE_CHARS;
    if (includeNumbers.checked) allowedChars += NUMBER_CHARS;
    if (includeSymbols.checked) allowedChars += SYMBOL_CHARS;

    // 2. Check if at least one character set is selected
    if (allowedChars.length === 0) {
        passwordField.value = "Select options!";
        return;
    }

    const passwordLength = parseInt(lengthInput.value, 10);
    let password = "";

    // 3. Ensure the password contains at least one character from each SELECTED set
    // This dramatically increases the cryptographic strength and satisfies user intent
    const generators = [];
    if (includeUppercase.checked) generators.push(() => getRandomChar(UPPERCASE_CHARS));
    if (includeLowercase.checked) generators.push(() => getRandomChar(LOWERCASE_CHARS));
    if (includeNumbers.checked) generators.push(() => getRandomChar(NUMBER_CHARS));
    if (includeSymbols.checked) generators.push(() => getRandomChar(SYMBOL_CHARS));

    // Fill the password with guaranteed characters first (one of each selected type)
    for (let i = 0; i < generators.length; i++) {
        password += generators[i]();
    }

    // Fill the rest of the password length with random characters from the full allowed set
    for (let i = password.length; i < passwordLength; i++) {
        password += getRandomChar(allowedChars);
    }
    
    // 4. Shuffle the password to ensure the guaranteed characters aren't always at the start
    password = shuffleString(password);

    // 5. Display the final password
    passwordField.value = password;
}

/** Helper function to get a random character from a given string */
function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
}

/** Helper function to shuffle a string (improves randomness) */
function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}


function copyPassword() {
    const copyText = document.getElementById("password");
    
    // Only copy if a password has been generated
    if (copyText.value === "" || copyText.value === "Select options!") {
        return;
    }
    
    // Select the text field content
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text
    document.execCommand("copy");

    // Show the "Copied!" message
    copyMessage.classList.add("show");
    setTimeout(() => {
        copyMessage.classList.remove("show");
    }, 1500);
}

// Initial call to set the default length display
lengthValueSpan.textContent = lengthInput.value;