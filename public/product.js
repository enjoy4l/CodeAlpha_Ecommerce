const statusMessage = document.querySelector('#status');
const productDetail = document.querySelector('#product-detail');
const cartMessage = document.querySelector('#cart-message');
const authNav = document.querySelector('#auth-nav');
const productId = new URLSearchParams(window.location.search).get('id');

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
  price.textContent = `$${Number(product.price).toFixed(2)}`;

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
  productDetail.hidden = false;
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

    renderProduct(await response.json());
  } catch (error) {
    statusMessage.textContent = 'This product could not be loaded.';
    statusMessage.classList.add('error');
  }
}

renderAuthNavigation();
loadProduct();