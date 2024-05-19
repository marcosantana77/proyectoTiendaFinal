   document.addEventListener("DOMContentLoaded", function() {

  /**
 * Función para obtener la lista de usuarios desde el servidor.
 * Realiza una solicitud GET al endpoint '/obtener_usuarios' de Flask.
 * Llama a la función 'mostrarUsuarios' para mostrar los usuarios obtenidos.
 */
function obtenerUsuarios() {
  fetch('/obtener_usuarios')
    .then(response => response.json())
    .then(data => mostrarUsuarios(data))
    .catch(error => console.error('Error al obtener usuarios:', error));
}

/**
 * Función para mostrar los usuarios en una tabla HTML.
 * @param {Array} usuarios - Lista de usuarios a mostrar.
 */
function mostrarUsuarios(usuarios) {
  const tableBody = document.getElementById("usuarios-table").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  usuarios.forEach((usuario) => {
    const row = tableBody.insertRow();

    row.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.username}</td>
      <td>${usuario.password}</td>
      <td>${usuario.usertype}</td>
      <td>
        <button class="editar" data-id="${usuario.id}">Editar</button>
        <button class="eliminar" data-id="${usuario.id}">Eliminar</button>
      </td>
    `;
  });
}

// Event listener para cargar la lista de usuarios al cargar la página
window.onload = obtenerUsuarios;

// Event listener para el botón "Agregar Usuario"
document.getElementById("agregar-usuario").addEventListener("click", function() {
  agregarUsuario();
});

// Event listener para los botones de editar y eliminar usuario
document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('editar')) {
    const userId = event.target.dataset.id;
    editarUsuario(userId);
  } else if (event.target && event.target.classList.contains('eliminar')) {
    const userId = event.target.dataset.id;
    eliminarUsuario(userId);
  }
});

/**
 * Función para agregar un nuevo usuario.
 * Solicita al usuario los datos del nuevo usuario y realiza una solicitud POST al endpoint '/agregar_usuario' de Flask.
 * Actualiza la tabla de usuarios después de agregar el usuario con éxito.
 */
function agregarUsuario() {
  const nuevoNombre = prompt("Ingrese el nombre del nuevo usuario:");
  const nuevaClave = prompt("Ingrese la clave del nuevo usuario:");
  const nuevoTipoUsuario = prompt("Ingrese el tipo de usuario (admin o regular):");
  const nuevoNombreCompleto = prompt("Ingrese el nombre completo del nuevo usuario:");

  if (nuevoNombre && nuevaClave && nuevoTipoUsuario) {
    const nuevoUsuario = {
      username: nuevoNombre,
      password: nuevaClave,
      usertype: nuevoTipoUsuario,
      fullname: nuevoNombreCompleto
    };

    fetch('/agregar_usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoUsuario)
    })
    .then(response => {
      if (response.ok) {
        alert('Usuario agregado exitosamente');
        obtenerUsuarios();  // Actualizar la tabla
      } else {
        throw new Error('Error al agregar usuario');
      }
    })
    .catch(error => console.error('Error al agregar usuario:', error));
  }
}

/**
 * Función para editar un usuario existente.
 * Solicita al usuario los nuevos datos del usuario y realiza una solicitud POST al endpoint '/editar_usuario' de Flask.
 * Actualiza la tabla de usuarios después de editar el usuario con éxito.
 * @param {string} userId - ID del usuario a editar.
 */
function editarUsuario(userId) {
  const nuevoNombre = prompt("Ingrese el nuevo nombre:");
  const nuevaClave = prompt("Ingrese la nueva clave:");
  const nuevoTipoUsuario = prompt("Ingrese el nuevo tipo de usuario:");

  const usuario = { id: userId };

  if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
      usuario.username = nuevoNombre;
  }
  if (nuevaClave !== null && nuevaClave.trim() !== "") {
      usuario.password = nuevaClave;
  }
  if (nuevoTipoUsuario !== null && nuevoTipoUsuario.trim() !== "") {
      usuario.usertype = nuevoTipoUsuario;
  }

  if (Object.keys(usuario).length > 1) {
      fetch('/editar_usuario', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(usuario)
      })
      .then(response => {
          if (response.ok) {
              alert('Usuario actualizado exitosamente');
              obtenerUsuarios();  // Actualizar la tabla
          } else {
              alert('Error al actualizar usuario en el servidor');
          }
      })
      .catch(error => console.error('Error al actualizar usuario:', error));
  }
}

/**
 * Función para eliminar un usuario existente.
 * Solicita confirmación al usuario y realiza una solicitud DELETE al endpoint '/eliminar_usuario' de Flask.
 * Actualiza la tabla de usuarios después de eliminar el usuario con éxito.
 * @param {string} userId - ID del usuario a eliminar.
 */
function eliminarUsuario(userId) {
  if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
    fetch(`/eliminar_usuario/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        alert('Usuario eliminado exitosamente');
        obtenerUsuarios();  // Actualizar la tabla
      } else {
        alert('Error al eliminar usuario en el servidor');
      }
    })
    .catch(error => console.error('Error al eliminar usuario:', error));
  }
}

// Funciones de productos

/**
 * Función para obtener la lista de productos desde el servidor.
 * Realiza una solicitud GET al endpoint '/api/products' de Flask.
 * Llama a la función 'mostrarProductos' para mostrar los productos obtenidos.
 */
function obtenerProductos() {
  fetch('/api/products')
    .then(response => response.json())
    .then(data => mostrarProductos(data))
    .catch(error => console.error('Error al obtener productos:', error));
}

/**
 * Función para mostrar los productos en una tabla HTML.
 * @param {Array} productos - Lista de productos a mostrar.
 */
function mostrarProductos(productos) {
  const tableBody = document.getElementById("productos-table").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  productos.forEach((producto) => {
    const row = tableBody.insertRow();

    row.innerHTML = `
      <td>${producto.id}</td>
      <td><img src="${producto.imagen}" class="img-fluid" style="max-width: 100px;"></td>
      <td>${producto.precio}</td>
      <td>
        <button class="editar-p" data-id="${producto.id}">Editar</button>
        <button class="eliminar-p" data-id="${producto.id}">Eliminar</button>
      </td>
    `;
  });
}

// Event listener para el botón "Agregar Producto"
document.getElementById("agregar-producto").addEventListener("click", function() {
  agregarProducto();
});

// Event listener para los botones de editar y eliminar producto
document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('editar-p')) {
    const productId = event.target.dataset.id;
    editarProducto(productId);
  } else if (event.target && event.target.classList.contains('eliminar-p')) {
    const productId = event.target.dataset.id;
    eliminarProducto(productId);
  }
});

/**
 * Función para agregar un nuevo producto.
 * Solicita al usuario los datos del nuevo producto y realiza una solicitud POST al endpoint '/agregar_producto' de Flask.
 * Actualiza la tabla de productos después de agregar el producto con éxito.
 */
function agregarProducto() {
  const nuevoLink = prompt("Ingrese el link de la imagen del nuevo producto:");
  const nuevoPrecio = prompt("Ingrese el precio del nuevo producto:");

  if (nuevoLink && nuevoPrecio) {
    const nuevoProducto = {
      link: nuevoLink,
      price: nuevoPrecio
    };

    fetch('/agregar_producto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProducto)
    })
    .then(response => {
      if (response.ok) {
        alert('Producto agregado exitosamente');
        obtenerProductos();  // Actualizar la tabla
      } else {
        throw new Error('Error al agregar producto');
      }
    })
    .catch(error => console.error('Error al agregar producto:', error));
  }
}

/**
 * Función para editar un producto existente.
 * Solicita al usuario los nuevos datos del producto y realiza una solicitud POST al endpoint '/editar_producto' de Flask.
 * Actualiza la tabla de productos después de editar el producto con éxito.
 * @param {string} productId - ID del producto a editar.
 */
function editarProducto(productId) {
  const nuevoLink = prompt("Ingrese el nuevo link de la imagen:");
  const nuevoPrecio = prompt("Ingrese el nuevo precio:");

  const producto = { id: productId };

  if (nuevoLink) {
    producto.link = nuevoLink;
  }

  if (nuevoPrecio) {
    const precioFloat = parseFloat(nuevoPrecio);
    if (!isNaN(precioFloat)) {
      producto.price = precioFloat;
    } else {
      alert("Ingrese un precio válido.");
      return;
    }
  }

  if (producto.link || producto.price) {
    fetch('/editar_producto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    })
    .then(response => {
      if (response.ok) {
        alert('Producto actualizado exitosamente');
        obtenerProductos();  // Actualizar la tabla
      } else {
        alert('Error al actualizar producto en el servidor');
      }
    })
    .catch(error => console.error('Error al actualizar producto:', error));
  } else {
    alert('No se realizaron cambios en el producto.');
  }
}

/**
 * Función para eliminar un producto existente.
 * Solicita confirmación al usuario y realiza una solicitud DELETE al endpoint '/eliminar_producto' de Flask.
 * Actualiza la tabla de productos después de eliminar el producto con éxito.
 * @param {string} productId - ID del producto a eliminar.
 */
function eliminarProducto(productId) {
  if (confirm('¿Está seguro de que desea eliminar este producto?')) {
    fetch(`/eliminar_producto/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        alert('Producto eliminado exitosamente');
        obtenerProductos();  // Actualizar la tabla
      } else {
        alert('Error al eliminar producto en el servidor');
      }
    })
    .catch(error => console.error('Error al eliminar producto:', error));
  }
}

// Obtener y mostrar los productos al cargar la página
obtenerProductos();

});