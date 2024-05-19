/**
 * Esta función se ejecuta cuando el DOM ha sido completamente cargado.
 * Se encarga de realizar una solicitud GET para obtener los productos desde la base de datos
 * y genera las tarjetas de productos en el catálogo.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene los elementos del DOM necesarios
  const catalogoContainer = document.getElementById("catalogo");
  const resumenCompra = document.getElementById("resumenCompra");
  const total = document.getElementById("total");

  // Realiza una solicitud GET para obtener los productos desde la base de datos
  fetch('/api/products')
    .then(response => response.json())
    .then(catalogo => {
      // Genera las tarjetas de productos en el catálogo
      catalogo.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");
        card.innerHTML = `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="Producto ${producto.id}">
                <div class="card-body">
                    <h5 class="card-title fs-3">Producto ${producto.id}</h5>
                    <p class="card-text fs-5">Precio: $${producto.precio}</p>
                    <label for="cantidadProducto${producto.id}">Cantidad:</label>
                    <input type="number" id="cantidadProducto${producto.id}" class="form-control">
                    <button class="btn-add btn btn-dark mt-2" data-id="${producto.id}">Agregar al Carrito</button>
                </div>
            </div>
        `;
        catalogoContainer.appendChild(card);

        // Agrega un evento de clic al botón de "Agregar al Carrito"
        const botonAgregar = card.querySelector(".btn-add");
        botonAgregar.addEventListener("click", function () {
          const cantidad = parseInt(document.getElementById(`cantidadProducto${producto.id}`).value);

          if (cantidad > 0) {
            agregarProductoAlCarrito(producto, cantidad);
          }
        });
      });
    })
    .catch(error => console.error('Error al obtener los productos:', error));

  // Arreglo que almacena los productos en el carrito de compras
  const carrito = [];

  /**
   * Agrega un producto al carrito de compras.
   * @param {Object} producto - El producto que se va a agregar.
   * @param {number} cantidad - La cantidad del producto a agregar.
   */
  function agregarProductoAlCarrito(producto, cantidad) {
    // Busca si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.producto.id === producto.id);

    if (productoEnCarrito) {
      // Si ya está en el carrito, actualiza la cantidad
      productoEnCarrito.cantidad += cantidad;
    } else {
      // Si no está en el carrito, agrega un nuevo elemento al carrito
      carrito.push({ producto, cantidad });
    }

    // Actualiza el resumen de la compra
    actualizarResumenCompra();
  }

  /**
   * Actualiza el resumen de la compra con los productos en el carrito.
   */
  function actualizarResumenCompra() {
    // Limpia el resumen de compra
    resumenCompra.innerHTML = "";
    let subtotalTotal = 0;

    carrito.forEach((item) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td>Producto ${item.producto.id}</td>
                <td>${item.cantidad}</td>
                <td>$${item.producto.precio * item.cantidad}</td>
            `;
      resumenCompra.appendChild(fila);

      subtotalTotal += item.producto.precio * item.cantidad;
    });

    // Actualiza el total
    total.textContent = `$${subtotalTotal}`;
  }

  // Agrega un evento al botón "Finalizar Compra"
  document.getElementById("finalizarCompra").addEventListener("click", function () {
    if (carrito.length > 0) {
      localStorage.setItem("carrito", JSON.stringify(carrito));
      window.location.href = "/ticket";
    }
  });

  // Agrega un evento de clic al botón de logout
  document.getElementById('logout').addEventListener('click', function() {
    fetch('/logout', { method: 'GET' })
      .then(response => {
        if (response.redirected) {
          window.location.href = "/login";  // Redirige a la página de inicio de sesión
        }
      })
      .catch(error => console.error('Error:', error));
  });

  // Obtiene el botón y la sección de la calculadora
  const mostrarCalculadoraBtn = document.getElementById("mostrarCalculadora");
  const calculadoraSection = document.getElementById("calculadoraSection");

  // Agrega un evento de clic al botón para mostrar/ocultar la sección de la calculadora
  mostrarCalculadoraBtn.addEventListener("click", function() {
    // Alterna la visibilidad de la sección de la calculadora
    if (calculadoraSection.style.display === "none") {
      calculadoraSection.style.display = "block";
    } else {
      calculadoraSection.style.display = "none";
    }
  });
});
