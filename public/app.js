const productGrid = document.querySelector('#product-grid');
const statusMessage = document.querySelector('#status');
const authNav = document.querySelector('#auth-nav');

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

function renderAuthNavigation() {
  if (!authNav) return;

  if (localStorage.getItem('token')) {
    const cartLink = document.createElement('a');
    cartLink.href = 'cart.html';
    cartLink.textContent = 'Cart';

    const logoutButton = document.createElement('button');
    logoutButton.className = 'link-button';
    logoutButton.type = 'button';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', logout);
    authNav.replaceChildren(cartLink, logoutButton);
    return;
  }

  const loginLink = document.createElement('a');
  loginLink.href = 'login.html';
  loginLink.textContent = 'Login';

  const registerLink = document.createElement('a');
  registerLink.href = 'register.html';
  registerLink.textContent = 'Register';

  authNav.replaceChildren(loginLink, registerLink);
}

function createProductCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = `/product.html?id=${encodeURIComponent(product._id)}`;

  const image = document.createElement('img');
  image.src = product.imageUrl || 'https://placehold.co/600x600?text=HomeCore';
  image.alt = product.name;

  const body = document.createElement('div');
  body.className = 'product-card__body';

  const meta = document.createElement('div');
  meta.className = 'product-card__meta';

  const badge = document.createElement('span');
  badge.className = 'product-card__badge';
  badge.textContent = product.category || 'HomeTech';

  const name = document.createElement('h2');
  name.textContent = product.name;

  const description = document.createElement('p');
  description.textContent = product.description ? product.description.split('. ')[0] : 'Designed for efficient everyday performance.';

  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `$${Number(product.price).toFixed(2)}`;

  meta.append(badge, price);
  body.append(name, description, meta);
  card.append(image, body);
  return card;
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');

    if (!response.ok) {
      throw new Error('Product request failed.');
    }

    const products = await response.json();
    productGrid.replaceChildren(...products.map(createProductCard));
    statusMessage.textContent = `${products.length} products available`;
  } catch (error) {
    statusMessage.textContent = 'Products could not be loaded. Please try again.';
    statusMessage.classList.add('error');
  }
}

renderAuthNavigation();
if (productGrid && statusMessage) {
  loadProducts();
}