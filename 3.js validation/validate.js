/**
 * Validates the registration form fields.
 * @returns {boolean} True if valid, false otherwise (with alert messages).
 */
function validationRegistrationForm() {
    // Retrieve input values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    /**
     * Validate username: at least 5 characters
     */
    if (username.length < 5) {
        alert("Username must be at least 5 characters.");
        return false;
    }

    /**
     * Validate email: basic regex for format
     */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please provide a valid email address.");
        return false;
    }

    /**
     * Validate password: at least 3 characters
     */
    if (password.length < 3) {
        alert("Password must be at least 3 characters.");
        return false;
    }

    // If all validations pass
    return true;
}
