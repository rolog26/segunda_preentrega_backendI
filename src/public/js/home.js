document.addEventListener('DOMContentLoaded', () => {
    
    const productsList = document.getElementById('products-list');

    renderProduct = (product) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>`;
    
            if (product.thumbnail) {
                const img = document.createElement('img');
                img.src = product.thumbnail;
                img.alt = product.title;
                li.appendChild(img);
            }
    
        productsList.appendChild(li);
    }
    
    fetch('/api/products')
        .then(res => res.json())
        .then(products => {
            products.forEach(renderProduct);
    })
    .catch(error => {
        console.error('Error al obtener los productos:', error);
    });
});