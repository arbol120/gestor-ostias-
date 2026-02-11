const token = localStorage.getItem('token');
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const message = document.getElementById('message');
const logoutBtn = document.getElementById('logoutBtn');

// Verificar token
if (!token) {
    window.location.href = 'index.html';
}

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Función para mostrar productos
async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:5000/api/products', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const products = await res.json();
        productList.innerHTML = '';

        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.name}</strong> - $${product.price} <br>
                ${product.description || ''} <br>
                <button onclick="editProduct('${product._id}', '${product.name}', '${product.description}', ${product.price})">Editar</button>
                <button onclick="deleteProduct('${product._id}')">Eliminar</button>
            `;
            productList.appendChild(li);
        });
    } catch (err) {
        message.innerText = 'Error al cargar productos';
    }
}

// Crear producto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;

    try {
        const res = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, price })
        });

        const data = await res.json();
        if (res.ok) {
            message.style.color = 'green';
            message.innerText = 'Producto agregado';
            productForm.reset();
            fetchProducts();
        } else {
            message.style.color = 'red';
            message.innerText = data.message || 'Error al agregar producto';
        }
    } catch (err) {
        message.style.color = 'red';
        message.innerText = 'Error en el servidor';
    }
});

// Editar producto
window.editProduct = async (id, name, description, price) => {
    const newName = prompt('Nombre:', name);
    if (newName === null) return;
    const newDescription = prompt('Descripción:', description);
    if (newDescription === null) return;
    const newPrice = prompt('Precio:', price);
    if (newPrice === null) return;

    try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newName,
                description: newDescription,
                price: Number(newPrice)
            })
        });

        const data = await res.json();
        if (res.ok) {
            message.style.color = 'green';
            message.innerText = 'Producto actualizado';
            fetchProducts();
        } else {
            message.style.color = 'red';
            message.innerText = data.message || 'Error al actualizar';
        }
    } catch (err) {
        message.style.color = 'red';
        message.innerText = 'Error en el servidor';
    }
};

// Eliminar producto
window.deleteProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            message.style.color = 'green';
            message.innerText = 'Producto eliminado';
            fetchProducts();
        } else {
            message.style.color = 'red';
            message.innerText = data.message || 'Error al eliminar';
        }
    } catch (err) {
        message.style.color = 'red';
        message.innerText = 'Error en el servidor';
    }
};

// Cargar productos al inicio
fetchProducts();
