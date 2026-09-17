const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#form-message');

function showLoginError(message) {
  loginMessage.textContent = message;
  loginMessage.hidden = false;
  loginMessage.classList.add('error');
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginMessage.hidden = true;

  const formData = new FormData(loginForm);
  const formValues = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formValues)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed.');
    }

    localStorage.setItem('token', result.token);
    window.location.href = 'index.html';
  } catch (error) {
    showLoginError(error.message);
  }
});