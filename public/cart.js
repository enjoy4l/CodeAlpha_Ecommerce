const cartItems = document.querySelector('#cart-items');
const cartStatus = document.querySelector('#cart-status');
const cartSummary = document.querySelector('#cart-summary');
const cartTotalAmount = document.querySelector('#cart-total-amount');
const checkoutButton = document.querySelector('#checkout-button');
const cartMessage = document.querySelector('#cart-message');
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'login.html';
}

function showMessage(message, isError = false) {
  cartMessage.textContent = message;
  cartMessage.hidden = false;
  cartMessage.classList.toggle('error', isError);
}

function showCheckoutConfirmation(order) {
  cartItems.hidden = true;
  cartSummary.hidden = true;
  cartStatus.hidden = true;
  cartMessage.classList.remove('error');
  cartMessage.textContent = `Order confirmed: ${order._id}. Total: $${Number(order.totalAmount).toFixed(2)}`;
  cartMessage.hidden = false;

  const confirmationActions = document.createElement('div');
  confirmationActions.className = 'confirmation-actions';

  const continueShoppingButton = document.createElement('button');
  continueShoppingButton.className = 'primary-button';
  continueShoppingButton.type = 'button';
  continueShoppingButton.textContent = 'Continue Shopping';
  continueShoppingButton.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  const ordersButton = document.createElement('button');
  ordersButton.className = 'primary-button';
  ordersButton.type = 'button';
  ordersButton.textContent = 'View My Orders';
  ordersButton.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  confirmationActions.append(continueShoppingButton, ordersButton);
  cartMessage.insertAdjacentElement('afterend', confirmationActions);
}

function renderCart(cart) {
  cartItems.replaceChildren();

  if (!cart.items || cart.items.length === 0) {
    cartStatus.textContent = 'Your cart is empty.';
    cartSummary.hidden = true;
    return;
  }

  let total = 0;
  cart.items.forEach(item => {
    const product = item.product;
    const subtotal = Number(product.price) * item.quantity;
    total += subtotal;

    const itemElement = document.createElement('article');
    itemElement.className = 'cart-item';

    const image = document.createElement('img');
    image.src = product.imageUrl || 'https://placehold.co/240x240?text=Product';
    image.alt = product.name;

    const details = document.createElement('div');
    details.className = 'cart-item-details';

    const name = document.createElement('h2');
    name.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `$${Number(product.price).toFixed(2)} each`;

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity';
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.value = item.quantity;
    quantityInput.addEventListener('change', () => updateQuantity(product._id, quantityInput));
    quantityLabel.append(quantityInput);

    const subtotalText = document.createElement('p');
    subtotalText.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

    const removeButton = document.createElement('button');
    removeButton.className = 'text-button';
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeItem(product._id));

    details.append(name, price, quantityLabel, subtotalText, removeButton);
    itemElement.append(image, details);
    cartItems.append(itemElement);
  });

  cartStatus.textContent = `${cart.items.length} item${cart.items.length === 1 ? '' : 's'} in your cart`;
  cartTotalAmount.textContent = `$${total.toFixed(2)}`;
  cartSummary.hidden = false;
}

async function loadCart() {
  try {
    const response = await fetch('/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cart = await response.json();

    if (!response.ok) {
      throw new Error(cart.message || 'Could not load your cart.');
    }

    renderCart(cart);
  } catch (error) {
    cartStatus.textContent = error.message;
    cartStatus.classList.add('error');
  }
}

async function updateQuantity(productId, quantityInput) {
  const quantity = Number(quantityInput.value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    showMessage('Quantity must be a positive whole number.', true);
    await loadCart();
    return;
  }

  try {
    const response = await fetch(`/api/cart/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    const cart = await response.json();

    if (!response.ok) {
      throw new Error(cart.message || 'Could not update the quantity.');
    }

    renderCart(cart);
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function removeItem(productId) {
  try {
    const response = await fetch(`/api/cart/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const cart = await response.json();

    if (!response.ok) {
      throw new Error(cart.message || 'Could not remove the item.');
    }

    renderCart(cart);
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function checkout() {
  checkoutButton.disabled = true;

  try {
    const response = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const order = await response.json();

    if (!response.ok) {
      throw new Error(order.message || 'Checkout failed.');
    }

    cartItems.replaceChildren();
    showCheckoutConfirmation(order);
  } catch (error) {
    checkoutButton.disabled = false;
    showMessage(error.message, true);
  }
}

checkoutButton.addEventListener('click', checkout);
loadCart();
