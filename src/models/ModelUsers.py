from .entities.users import User

class ModelUsers():
    """Clase para interactuar con la tabla de usuarios en la base de datos."""

    @classmethod
    def login(cls, db, user):
        """Realiza el inicio de sesión de un usuario.

        Args:
            db: Conexión a la base de datos.
            user (User): Instancia del usuario que intenta iniciar sesión.

        Returns:
            User or None: Objeto User si el inicio de sesión es exitoso, None si falla.
        """
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT id, username, password, usertype FROM users WHERE username = %s AND password = %s", (user.username, user.password))
            row = cursor.fetchone()
            cursor.close()
            
            if row:
                user = User(row[0], row[1], row[2], row[3])
                return user
            else:
                return None
        except Exception as e:
            raise Exception(f"Error al iniciar sesión: {e}")

    @classmethod
    def agregar_usuario(cls, db, user):
        """Agrega un nuevo usuario a la base de datos.

        Args:
            db: Conexión a la base de datos.
            user (User): Instancia del usuario a agregar.
        """
        try:
            cursor = db.connection.cursor()
            cursor.execute("INSERT INTO users (username, password, usertype, fullname) VALUES (%s, %s, %s, %s)", 
                           (user.username, user.password, user.usertype, user.fullname))
            db.connection.commit()
            cursor.close()
        except Exception as e:
            raise Exception(f"Error al agregar usuario a la base de datos: {e}")

    @classmethod
    def editar_usuario(cls, db, usuario):
        """Edita un usuario existente en la base de datos.

        Args:
            db: Conexión a la base de datos.
            usuario (dict): Diccionario con los datos del usuario a editar.
        """
        try:
            cursor = db.connection.cursor()
            # Construir la consulta SQL dinámicamente
            query = "UPDATE users SET "
            fields = []
            values = []

            if 'username' in usuario:
                fields.append("username = %s")
                values.append(usuario['username'])

            if 'password' in usuario:
                fields.append("password = %s")
                values.append(usuario['password'])

            if 'usertype' in usuario:
                fields.append("usertype = %s")
                values.append(usuario['usertype'])

            query += ", ".join(fields)
            query += " WHERE id = %s"
            values.append(usuario['id'])

            cursor.execute(query, values)
            db.connection.commit()
            cursor.close()
        except Exception as e:
            raise Exception(f"Error al editar usuario en la base de datos: {e}")

    @classmethod
    def eliminar_usuario(cls, db, user_id):
        """Elimina un usuario existente de la base de datos.

        Args:
            db: Conexión a la base de datos.
            user_id (int): ID del usuario a eliminar.
        """
        try:
            cursor = db.connection.cursor()
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            db.connection.commit()
            cursor.close()
        except Exception as e:
            raise Exception(f"Error al eliminar usuario de la base de datos: {e}")
