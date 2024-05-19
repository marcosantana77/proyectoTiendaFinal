class User:
    def __init__(self, id, username, password, usertype, fullname="") -> None:
        """Inicializa una instancia de la clase User.

        Args:
            id (int): ID del usuario.
            username (str): Nombre de usuario del usuario.
            password (str): Contraseña del usuario.
            usertype (int): Tipo de usuario. Puede ser un valor numérico que representa el tipo de usuario.
            fullname (str, opcional): Nombre completo del usuario. Por defecto, es una cadena vacía.
        """
        self.id = id
        self.username = username
        self.password = password
        self.fullname = fullname
        self.usertype = usertype