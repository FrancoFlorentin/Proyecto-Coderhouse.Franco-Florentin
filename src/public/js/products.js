

export const getAllProducts = async (params) => {

  // opcionales: si no existen, no se agregan
  const page = params.get("page");
  const limit = params.get("limit");
  const sort = params.get("sort");
  const query = params.get("query");

  const urlParams = new URLSearchParams();
  if (page) urlParams.append("page", page);
  if (limit) urlParams.append("limit", limit);
  if (sort) urlParams.append("sort", sort);
  if (query) urlParams.append("query", query);

  const url = `http://localhost:8080/api/products?${urlParams.toString()}`;
  const res = await fetch(url);
  const products = await res.json();

  return products;
}

export const initPaginationButtons = (params, products) => {
  const paginationContainer = document.getElementById('pagination-container')
  if (paginationContainer) {
    let html = '';

    // Botón anterior
    if (products.hasPrevPage) {
      params.set("page", products.prevPage);
      html += `<a class="bg-white px-3 py-2 shadow-md cursor-pointer hover:text-red-500 hover:bg-gray-100 transition-colors"
                href="/?${params.toString()}"><</a>`;
    }

    // Números de página
    Array.from({ length: products.totalPages }).forEach((_, i) => {
      params.set("page", i + 1);
      html += `<a class="px-3 py-2 shadow-md cursor-pointer hover:text-red-500 hover:bg-gray-100 transition-colors ${products.page === i + 1 ? 'bg-red-400 text-white' : 'bg-white'}"
                href="/?${params.toString()}">${i + 1}</a>`;
    });

    // Botón siguiente
    if (products.hasNextPage) {
      params.set("page", products.nextPage);
      html += `<a class="bg-white px-3 py-2 shadow-md cursor-pointer hover:text-red-500 hover:bg-gray-100 transition-colors"
                href="/?${params.toString()}">></a>`;
    }

    paginationContainer.innerHTML = html;
  }
}

export const loadHomeProducts = (products) => {
  const productsBox = document.getElementById("products-box")
  if (!productsBox) return
  if (!products.payload.length) {
    productsBox.innerHTML = '<p class="text-gray-500 text-center py-10">Aún no se han cargado productos</p>';
  } else {
    productsBox.innerHTML = products.payload.map(product => `
      <div class="w-64 h-[400px] bg-white rounded overflow-hidden shadow-lg flex flex-col relative hover:cursor-pointer hover:scale-105 transition-transform">
        
        <a href="/products/${product._id}" class="w-full h-full">
          <div class="relative h-[55%] w-full overflow-hidden">
            <img src="img/image-placeholder.jpg" alt="${product.title}" class="h-full w-full object-cover" />
            <p class="uppercase font-bold absolute w-96 bg-red-300 ${product.status && "hidden"} text-center py-3 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -rotate-35 opacity-70">No disponible</p>
          </div>
          <div class="h-[45%] p-3 flex flex-col justify-between">
            <div>
              <p class="text-2xl truncate uppercase font-bold text-gray-500">${product.title}</p>
              <p class="line-clamp-2 text-stone-500 font-semibold">${product.description}</p>
            </div>
            <div class="flex justify-between items-center mt-2">
              <p class="font-bold text-3xl text-red-400">$${product.price}</p>
              <p class="product-stock text-gray-600">${product.stock} disponibles</p>
            </div>
          </div>
        </a>

        <button
          class="add-to-cart ${product.status ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-slate-200 text-gray-600' }  transition-all cursor-pointer  rounded-b py-2 mt-auto"
          data-id="${product._id}"
          ${product.status ? '' : 'disabled'}
        >
          Agregar al carrito
        </button>
      </div>
    `).join('');
  }
}
