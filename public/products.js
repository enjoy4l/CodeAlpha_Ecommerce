const catalogGrid = document.querySelector('#catalog-grid');
const catalogStatus = document.querySelector('#catalog-status');
const resultsCount = document.querySelector('#results-count');
const searchInput = document.querySelector('#product-search');
const categoryButtons = document.querySelectorAll('.category-option');
const authNav = document.querySelector('#auth-nav');
const requestedCategory = new URLSearchParams(window.location.search).get('category');
let products = [];
let selectedCategory = requestedCategory || 'All';

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

function renderAuthNavigation() {
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
  card.addEventListener('click', () => {
    sessionStorage.setItem('cartReturnUrl', `${window.location.pathname}${window.location.search}${window.location.hash}`);
  });

  const image = document.createElement('img');
  image.src = product.imageUrl || 'https://placehold.co/600x600?text=Abi%27s';
  image.alt = product.name;

  const body = document.createElement('div');
  body.className = 'product-card__body';

  const meta = document.createElement('div');
  meta.className = 'product-card__meta';

  const badge = document.createElement('span');
  badge.className = 'product-card__badge';
  badge.textContent = product.category;

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

function updateActiveCategory() {
  categoryButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.category === selectedCategory);
  });
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  catalogGrid.replaceChildren(...visibleProducts.map(createProductCard));
  resultsCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}`;
  catalogStatus.hidden = true;
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Product request failed.');
    products = await response.json();
    if (!Array.from(categoryButtons).some(button => button.dataset.category === selectedCategory)) {
      selectedCategory = 'All';
    }
    updateActiveCategory();
    renderProducts();
  } catch (error) {
    catalogStatus.textContent = 'Products could not be loaded. Please try again.';
    catalogStatus.classList.add('error');
  }
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    updateActiveCategory();
    renderProducts();
  });
});

searchInput.addEventListener('input', renderProducts);
renderAuthNavigation();
loadProducts();
