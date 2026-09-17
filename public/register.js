const registerForm = document.querySelector('#register-form');
const registerMessage = document.querySelector('#form-message');

function showRegisterError(message) {
  registerMessage.textContent = message;
  registerMessage.hidden = false;
  registerMessage.classList.add('error');
}

registerForm.addEventListener('submit', async event => {
  event.preventDefault();
  registerMessage.hidden = true;

  const formData = new FormData(registerForm);
  const formValues = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formValues)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed.');
    }

    window.location.href = 'login.html';
  } catch (error) {
    showRegisterError(error.message);
  }
});