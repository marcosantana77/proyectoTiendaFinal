class Products:
    def __init__(self, id, link, price) -> None:
        """Inicializa una instancia de la clase Products.

        Args:
            id (int): ID del producto.
            link (str): Enlace o URL del producto.
            price (float): Precio del producto.
        """
        self.id = id
        self.link = link
        self.price = price