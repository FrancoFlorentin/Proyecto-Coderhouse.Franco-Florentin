const socket = io();

//! Obtener todos los productos
const url = 'http://localhost:8080/api/products'
const res = await fetch(url)
let products = await res.json()


//! Cargar productos en Home
const productsBox = document.getElementById("products-box")
if (!products.length && productsBox) {
  productsBox.innerHTML = '<p>Aún no se han cargado productos</p>'
} else if (productsBox) {
  productsBox.innerHTML = products.map(product => {
    return (
      `<div class="w-64 h-96 bg-white rounded overflow-hidden shadow-lg flex flex-col relative hover:cursor-pointer hover:scale-105 transition-all">
        <img src="img/image-placeholder.jpg" class="h-[55%] object-cover" />
        <div class="h-[45%] p-3 flex flex-col justify-between">
          <div>
            <p class="text-2xl truncate uppercase font-bold text-amber-700/70">${product.title}</p>
            <p class="line-clamp-2 text-stone-500 font-semibold">${product.description}</p>
          </div>
          <div class="flex justify-between items-center mb-3">
            <p class="font-bold text-3xl text-red-400">$${product.price}</p>
            <p class="product-stock">${product.stock} disponibles</p>
          </div>
        </div>
      </div>`
    )
  }).join("")
}


//! Cargar productos en la vista de tiempo real
const productsList = document.getElementById("products-list")
const fillProductsList = () => {
  if (!products.length && productsList) {
    productsList.innerHTML = '<p class="text-center">Aún no se han cargado productos</p>'
  } else if (productsList) {
    productsList.innerHTML = products.map(product => {
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
              data-id="${product.id}"
              id="delete-button"
3            >Eliminar</button>
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
  
      if (!res.ok) throw new Error("Error " + res.status);
  
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
      console.error("Error en fetch:", err);
    }
  });
}

//! Comunicacion en tiempo real de un nuevo producto
socket.on('newProduct', (product) => {
  products.unshift(product)
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

productsList.addEventListener("click", e => {
  const btn = e.target.closest("#delete-button")
  if (!btn) return

  const productId = e.target.dataset.id
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
      await deleteProduct(productId)
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
  products = products.filter(product => product.id !== +pid)
  fillProductsList()
})