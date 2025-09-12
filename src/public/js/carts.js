export const addToCart = () => {
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      
      // Verificar del localstorage si existe un cartId
      let savedCartId = localStorage.getItem("cartId")

      // Si no existe, crear cart y guardar en el localstorage el id
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

      // preguntar si existe el cart en la db  y guardar producto
      try {
        const res = await fetch(`http://localhost:8080/api/carts/${savedCartId}`)
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message);
        }

        const response = await fetch(`http://localhost:8080/api/carts/${savedCartId}/products/${id}`, {
          method: "POST"
        })

        if (!response.ok) {
          const error = await res.json()
          throw new Error(error.message);
        }

        Toastify({
          text: "Producto agregado al carrito",
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
      } catch (error) {
        Toastify({
          text: "Hubo un error",
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
  });
}