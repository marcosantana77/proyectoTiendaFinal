document.addEventListener("DOMContentLoaded", function () {
    // Recupera el carrito del almacenamiento local
    const carrito = JSON.parse(localStorage.getItem("carrito"));

    // Si hay productos en el carrito, genera el ticket de compra
    if (carrito && carrito.length > 0) {
        const ticketContainer = document.createElement("div");
        ticketContainer.classList.add("container", "mt-5");

        const ticketTitle = document.createElement("h1");
        ticketTitle.classList.add("text-center");
        ticketTitle.textContent = "Ticket de Compra";

        const ticketTable = document.createElement("table");
        ticketTable.classList.add("table");
        const tableHead = `
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
        `;
        let tableBody = "<tbody>";

        let total = 0;
        carrito.forEach(item => {
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;
            tableBody += `
                <tr>
                    <td>${item.producto.id}</td>
                    <td>${item.cantidad}</td>
                    <td>$${subtotal}</td>
                </tr>
            `;
        });

        tableBody += `</tbody>`;
        const tableFoot = `
            <tfoot>
                <tr>
                    <td colspan="2">Total:</td>
                    <td>$${total}</td>
                </tr>
            </tfoot>
        `;

        ticketTable.innerHTML = tableHead + tableBody + tableFoot;

        ticketContainer.appendChild(ticketTitle);
        ticketContainer.appendChild(ticketTable);

        document.body.appendChild(ticketContainer);

        // Limpia el carrito del almacenamiento local después de generar el ticket
        localStorage.removeItem("carrito");
    } else {
        // Si no hay productos en el carrito, muestra un mensaje o redirige a una página de error
        console.log("No hay productos en el carrito.");
    }
});