const socket = io();
import { addToCart } from './carts.js';
import { getAllProducts, initPaginationButtons, loadHomeProducts } from './products.js'


const params = new URLSearchParams(window.location.search);

//! Obtener todos los productos
let products = await getAllProducts(params)

if (+params.get("page") > products.totalPages) window.location.replace('/')


//! Botones de paginación
initPaginationButtons(params, products)


//! Cargar productos en Home
loadHomeProducts(products)


//! Agregar al carrito
addToCart()


const cartButton = document.getElementById('cart-icon');
cartButton.addEventListener('click', async () => {
  let savedCartId = localStorage.getItem("cartId")
  if (!savedCartId) {
    const cartsUrl = `http://localhost:8080/api/carts`
    try {
      const res = await fetch(cartsUrl, {
        method: "POST"
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message);
      }
  
      const cart = await res.json();

      localStorage.setItem('cartId', cart._id)
      savedCartId = localStorage.getItem("cartId")
    } catch (error) {
      console.log(error)
    }
  }
  window.location.href = `/carts/${savedCartId}`;
});


//! Cargar productos en la vista de tiempo real
const productsList = document.getElementById("products-list")
const fillProductsList = () => {
  if (!productsList) return
  if (!products.payload.length) {
    productsList.innerHTML = '<p class="text-center">Aún no se han cargado productos</p>'
  } else if (productsList) {
    productsList.innerHTML = products.payload.map(product => {
      return (
        `<div class="w-[95%] h-24 border border-gray-200 rounded-lg shadow-lg mx-auto flex bg-gray-100 hover:scale-105 transition-all">
          <div class="border-r-1 border-gray-300 w-36 h-full ">
            <p class="border-b-1 border-gray-300 px-3 text-stone-400 font-semibold uppercase">Título</p>
            <p class="line-clamp-2 px-3 py-2 font-bold text-gray-500">${product.title}</p>
          </div>

          <div class="border-r-1 border-gray-300 w-48 h-full ">
            <p class="border-b-1 border-gray-300 px-3 text-stone-400 font-semibold uppercase">Descripción</p>
            <p class="line-clamp-2 px-3 py-2 font-bold text-gray-500">${product.description}</p>
          </div>

          <div class="border-r-1 border-gray-300 w-28 h-full ">
            <p class="border-b-1 border-gray-300 px-3 text-stone-400 font-semibold uppercase">Código</p>
            <p class="line-clamp-2 px-3 py-2 font-bold text-gray-500">${product.code}</p>
          </div>

          <div class="border-r-1 border-gray-300 w-24 h-full ">
            <p class="border-b-1 border-gray-300 px-3 text-stone-400 font-semibold uppercase">Precio</p>
            <p class="line-clamp-2 px-3 py-2 font-bold text-gray-500">$${product.price}</p>
          </div>

          <div class="border-r-1 border-gray-300 w-24 h-full ">
            <p class="border-b-1 border-gray-300 px-3 text-stone-400 font-semibold uppercase">Estado</p>
            <p class="line-clamp-2 px-3 py-2 font-bold text-gray-500">${product.status ? "Activo" : "Inactivo"}</p>
          </div>

          <div class="border-r-1 border-gray-300 w-28 h-full ">
            <p class="border-b-1 border-gray-300 px-3 text-stone-400 font-semibold uppercase">Categoría</p>
            <p class="line-clamp-2 px-3 py-2 font-bold text-gray-500">${product.category}</p>
          </div>

          <div class="flex items-center justify-center w-fit mx-auto">
            <button
              class="bg-red-400 px-5 py-2 rounded-md text-white hover:cursor-pointer hover:bg-red-800 transition-all"
              data-id="${product._id}"
              id="delete-button"
            >Eliminar</button>
          </div>
        </div>`
      )
    }).join("")
  }
}
fillProductsList(products)


//! Formulario de productos
const form = document.getElementById("product-form")
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 
  
    const formData = new FormData(form);
    let newProduct = Object.fromEntries(formData.entries()); 
    const status = form.status.checked;
    newProduct = {
      ...newProduct,
      status
    }
  
    const url = "http://localhost:8080/api/products"
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
      });
  
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message);
      }
  
      const data = await res.json();
      form.reset()
      Toastify({
        text: data.message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    } catch (err) {
      Toastify({
        text: err.message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    }
  });
}

//! Comunicacion en tiempo real de un nuevo producto
socket.on('newProduct', (product) => {
  products.payload.unshift(product)
  fillProductsList()
})



//! Eliminar un producto
const deleteProduct = async(productId) => {
const url = `http://localhost:8080/api/products/${productId}`
  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error " + res.status);
  } catch (err) {
    console.error("Error en fetch:", err);
  }
}

if (productsList) productsList.addEventListener("click", e => {
  const btn = e.target.closest("#delete-button")
  if (!btn) return

  const productDelId = e.target.dataset.id
  Swal.fire({
    title: "Estas seguro?",
    text: "No vas a poder revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteProduct(productDelId)
      Swal.fire({
        title: "Eliminado!",
        text: "El producto ha sido eliminado",
        icon: "success"
      });
    }
  });
})

//! Comunicacion en tiempo real de la eliminación de un producto
socket.on('deleteProduct', (pid) => {
  products.payload = products.payload.filter(product => product._id !== pid)
  fillProductsList()
})

//! Limpiar el carrito
const clearButton = document.getElementById("clear-cart-button")
if (clearButton) clearButton.addEventListener("click", async(e) => {
  
  try {
    const id = e.target.dataset.id;
    const res = await fetch(`http://localhost:8080/api/carts/clear/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      throw new Error("Ocurrió un error")
    }
    location.reload()
  } catch (error) {
    console.log(error)
  }
})

//! Eliminar producto del carrito
document.querySelectorAll("#product-cart-button").forEach(btn => {
  btn.addEventListener("click", async () => {
    const productId = btn.dataset.productId;
    const cartId = btn.dataset.cartId;

    try {
    const res = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      throw new Error("Ocurrió un error")
    }
    location.reload()
  } catch (error) {
    console.log(error)
  }
  });
});

//! Filtros
const filterForm = document.getElementById("filterForm");

if (filterForm) {
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = document.getElementById("query").value;
    const sort = document.getElementById("sort").value;
    const limit = document.getElementById("limit").value;

    const params = new URLSearchParams(window.location.search);

    // cuando cambio filtro, arranco desde página 1
    params.set("page", 1);

    if (query) params.set("query", query);
    else params.delete("query");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    if (limit) params.set("limit", limit);
    else params.delete("limit");

    window.location.href = `/?${params.toString()}`;
  })

  // --- Persistir selección al recargar ---
  const paramsFiltro = new URLSearchParams(window.location.search);
  document.getElementById("query").value = paramsFiltro.get("query") || "";
  document.getElementById("sort").value = paramsFiltro.get("sort") || "";
  document.getElementById("limit").value = paramsFiltro.get("limit") || "";
};

