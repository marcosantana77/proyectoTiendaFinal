from .entities.products import Products

class ModelProducts:
    """Clase para interactuar con la tabla de productos en la base de datos."""

    @classmethod
    def obtener_productos(cls, db):
        """Obtiene todos los productos desde la base de datos.

        Args:
            db: Conexión a la base de datos.

        Returns:
            list: Lista de diccionarios representando los productos.
                Cada diccionario contiene los campos 'id', 'imagen' y 'precio' del producto.
        """
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT id, link, price FROM products")
            rows = cursor.fetchall()
            cursor.close()
            
            products = []
            for row in rows:
                product = {
                    "id": row[0],
                    "imagen": row[1],
                    "precio": row[2]
                }
                products.append(product)
            
            return products
        except Exception as e:
            raise Exception(f"Error al obtener productos de la base de datos: {e}")

    @classmethod
    def agregar_producto(cls, db, producto):
        """Agrega un nuevo producto a la base de datos.

        Args:
            db: Conexión a la base de datos.
            producto (Products): Instancia del producto a agregar.
        """
        try:
            cursor = db.connection.cursor()
            cursor.execute("INSERT INTO products (link, price) VALUES (%s, %s)", (producto.link, producto.price))
            db.connection.commit()
            cursor.close()
        except Exception as e:
            raise Exception(f"Error al agregar producto a la base de datos: {e}")

    @classmethod
    def editar_producto(cls, db, producto):
        """Edita un producto existente en la base de datos.

        Args:
            db: Conexión a la base de datos.
            producto (Products): Instancia del producto a editar.
        """
        try:
            cursor = db.connection.cursor()
            # Actualizar solo los campos que han sido modificados
            if producto.link and producto.price:
                cursor.execute("""
                    UPDATE products 
                    SET link = %s, price = %s 
                    WHERE id = %s
                """, (producto.link, producto.price, producto.id))
            elif producto.link:
                cursor.execute("""
                    UPDATE products 
                    SET link = %s 
                    WHERE id = %s
                """, (producto.link, producto.id))
            elif producto.price:
                cursor.execute("""
                    UPDATE products 
                    SET price = %s 
                    WHERE id = %s
                """, (producto.price, producto.id))
            db.connection.commit()
            cursor.close()
        except Exception as e:
            raise Exception(f"Error al actualizar el producto en la base de datos: {e}")

    @classmethod
    def eliminar_producto(cls, db, producto_id):
        """Elimina un producto existente de la base de datos.

        Args:
            db: Conexión a la base de datos.
            producto_id (int): ID del producto a eliminar.
        """
        try:
            cursor = db.connection.cursor()
            cursor.execute("DELETE FROM products WHERE id = %s", (producto_id,))
            db.connection.commit()
            cursor.close()
        except Exception as e:
            raise Exception(f"Error al eliminar producto de la base de datos: {e}")
