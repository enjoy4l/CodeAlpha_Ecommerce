const statusMessage = document.querySelector('#status');
const productDetail = document.querySelector('#product-detail');
const productId = new URLSearchParams(window.location.search).get('id');

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

  content.append(heading, price, description, stock);
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

loadProduct();