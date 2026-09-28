const statusMessage = document.querySelector('#status');
const productDetail = document.querySelector('#product-detail');
const cartMessage = document.querySelector('#cart-message');
const authNav = document.querySelector('#auth-nav');
const productTabs = document.querySelector('#product-tabs');
const tabButtons = document.querySelectorAll('.product-tab-button');
const tabPanels = document.querySelectorAll('.product-tab-panel');
const detailsDescription = document.querySelector('#details-description');
const specProductName = document.querySelector('#spec-product-name');
const specCategory = document.querySelector('#spec-category');
const specStock = document.querySelector('#spec-stock');
const relatedProducts = document.querySelector('#related-products');
const relatedGrid = document.querySelector('#related-grid');
const relatedPrevious = document.querySelector('#related-previous');
const relatedNext = document.querySelector('#related-next');
const productId = new URLSearchParams(window.location.search).get('id');

function activateTab(tabName) {
  tabButtons.forEach(button => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  tabPanels.forEach(panel => {
    panel.hidden = panel.id !== `${tabName}-panel`;
  });
}

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

function showCartMessage(message, isError = false) {
  cartMessage.textContent = message;
  cartMessage.hidden = false;
  cartMessage.classList.toggle('error', isError);
}

function createRelatedCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = `/product.html?id=${encodeURIComponent(product._id)}`;

  const image = document.createElement('img');
  image.src = product.imageUrl || 'https://placehold.co/600x600?text=Abi%27s';
  image.alt = product.name;

  const body = document.createElement('div');
  body.className = 'product-card__body';

  const name = document.createElement('h2');
  name.textContent = product.name;

  const meta = document.createElement('div');
  meta.className = 'product-card__meta';

  const badge = document.createElement('span');
  badge.className = 'product-card__badge';
  badge.textContent = product.category;

  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `GH₵${Number(product.price).toFixed(2)}`;

  meta.append(badge, price);
  body.append(name, meta);
  card.append(image, body);
  return card;
}

function slideRelatedProducts(direction) {
  const viewport = relatedGrid;
  viewport.scrollBy({ left: direction * viewport.clientWidth, behavior: 'smooth' });
}

async function loadRelatedProducts(product) {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Related product request failed.');

    const products = await response.json();
    const alternatives = products.filter(item => item._id !== product._id);
    const sameCategory = alternatives.filter(item => item.category === product.category);
    const otherProducts = alternatives.filter(item => item.category !== product.category);
    const related = [...sameCategory, ...otherProducts].slice(0, 10);

    if (!related.length) return;
    relatedGrid.replaceChildren(...related.map(createRelatedCard));
    relatedProducts.hidden = false;
  } catch (error) {
    relatedProducts.hidden = true;
  }
}

async function addToCart() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Could not add this product.');
    }

    showCartMessage('Added to your cart.');
  } catch (error) {
    showCartMessage(error.message, true);
  }
}

function renderProduct(product) {
  const image = document.createElement('img');
  image.src = product.imageUrl || 'https://placehold.co/600x600?text=Product';
  image.alt = product.name;

  const content = document.createElement('div');
  const heading = document.createElement('h1');
  heading.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'detail-price';
  price.textContent = `GH₵${Number(product.price).toFixed(2)}`;

  const description = document.createElement('p');
  description.textContent = product.description || 'No description available.';

  const stock = document.createElement('p');
  stock.className = 'stock';
  stock.textContent = `${product.stock} in stock`;

  const addButton = document.createElement('button');
  addButton.className = 'primary-button';
  addButton.type = 'button';
  addButton.textContent = 'Add to Cart';
  addButton.addEventListener('click', addToCart);

  content.append(heading, price, description, stock, addButton);
  productDetail.append(image, content);
  detailsDescription.textContent = product.description || 'Designed for efficient everyday performance.';
  specProductName.textContent = product.name;
  specCategory.textContent = product.category || 'Home appliances';
  specStock.textContent = `${product.stock} available`;
  productDetail.hidden = false;
  productTabs.hidden = false;
  statusMessage.hidden = true;
}

async function loadProduct() {
  if (!productId) {
    statusMessage.textContent = 'No product was selected.';
    statusMessage.classList.add('error');
    return;
  }

  try {
    const response = await fetch(`/api/products/${encodeURIComponent(productId)}`);

    if (!response.ok) {
      throw new Error('Product request failed.');
    }

    const product = await response.json();
    renderProduct(product);
    loadRelatedProducts(product);
  } catch (error) {
    statusMessage.textContent = 'This product could not be loaded.';
    statusMessage.classList.add('error');
  }
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
});

relatedPrevious.addEventListener('click', () => slideRelatedProducts(-1));
relatedNext.addEventListener('click', () => slideRelatedProducts(1));

renderAuthNavigation();
loadProduct();