const productGrid = document.querySelector('#product-grid');
const statusMessage = document.querySelector('#status');
const authNav = document.querySelector('#auth-nav');
const filterButtons = document.querySelectorAll('.filter-bar .tag');
let catalogProducts = [];

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

  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `GH₵${Number(product.price).toFixed(2)}`;

  meta.append(badge, price);
  body.append(name, meta);
  card.append(image, body);
  return card;
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');

    if (!response.ok) {
      throw new Error('Product request failed.');
    }

    catalogProducts = (await response.json()).slice(0, 6);
    renderProducts('All');
    if (statusMessage) {
      statusMessage.textContent = `${catalogProducts.length} products available`;
    }
  } catch (error) {
    if (statusMessage) {
      statusMessage.textContent = 'Products could not be loaded. Please try again.';
      statusMessage.classList.add('error');
    }
  }
}

renderAuthNavigation();
if (productGrid) {
  loadProducts();
}

function renderProducts(category) {
  const products = category === 'All'
    ? catalogProducts
    : catalogProducts.filter(product => product.category === category);

  productGrid.replaceChildren(...products.map(createProductCard));
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(filterButton => filterButton.classList.remove('active'));
    button.classList.add('active');
    renderProducts(button.textContent.trim());
  });
});