const socket = io();
const form = document.getElementById('product-form');
const productsList = document.getElementById('products-list');

const renderProduct = (product) => {
    const li = document.createElement('li');
    li.setAttribute('data-id', product.id);
    li.innerHTML = `
    <h3>${product.title}</h3>
    <p>${product.description}</p>
    <p>Precio: ${product.price}</p>
    <p>Código: ${product.code}</p>
    <p>Stock: ${product.stock}</p>
    <p>Categoría: ${product.category}</p>`;
    
    if (product.thumbnail) {
        const img = document.createElement('img');
        img.src = product.thumbnail;
        li.appendChild(img);
    }
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deleteProduct(product.id));

    li.appendChild(deleteButton);
    
    productsList.appendChild(li);
}

const deleteProduct = (productId) => {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error al eliminar el producto');
            }
            return res.json();
        })
        .then(data => {
            console.log('Producto eliminado correctamente:', data);
            const productElement = document.querySelector(`li[data-id="${productId}"]`);
            if (productElement) {
                productElement.remove();
            }
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
}

fetch('/api/products')
.then(res => res.json())
.then(products => {
    products.forEach(renderProduct);
});

socket.on('product-deleted', (productId) => {
    const li = document.querySelector(`li[data-id="${productId}"]`);
    if (li) {
        li.remove();
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = new FormData(form);
    const obj = {};
    
    data.forEach((value, key) => obj[key] = value);

    fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error al agregar el producto');
        }
        return res.json();
    })
    .then(data => {
        console.log('Producto agregado correctamente:', data);
        renderProduct(data);
        form.reset();
    })
    .catch(error => {
        console.error('Error al agregar el producto:', error);
    });
});

socket.on('product-added', (product) => {
    renderProduct(product);
});
