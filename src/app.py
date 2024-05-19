from flask import Flask, flash, jsonify, redirect, render_template, request, session, url_for
from flask_mysqldb import MySQL
from models.ModelUsers import ModelUsers
from models.ModelProducts import ModelProducts
from models.entities.products import Products
from models.entities.users import User
from config import config

# Crear una instancia de la aplicación Flask
app = Flask(__name__)

# Configurar la extensión Flask-MySQLDB para la base de datos
db = MySQL(app)

# Ruta principal, redirige a la página de inicio de sesión
@app.route("/")
def index():
    """Redirige a la página de inicio de sesión."""
    return redirect("login")

# Maneja la autenticación de usuarios
@app.route("/login", methods=["GET", "POST"])
def login():
    """Maneja la autenticación de usuarios."""
    if request.method == "POST":
        # Obtener las credenciales de usuario del formulario
        username = request.form['username']
        password = request.form['password']

        # Intenta iniciar sesión con las credenciales proporcionadas
        user = User(0, username, password, 0)
        logged_user = ModelUsers.login(db, user)

        if logged_user is not None:
            # Si el inicio de sesión es exitoso, establece la sesión del usuario y redirige a la página de inicio
            session['user_id'] = logged_user.id
            session['user_type'] = logged_user.usertype
            return redirect(url_for("home"))
        else:
            # Si el inicio de sesión falla, muestra un mensaje de error y renderiza la página de inicio de sesión nuevamente
            flash("Acceso rechazado...")
            return render_template("auth/login.html")
    else:
        # Renderiza el formulario de inicio de sesión
        return render_template("auth/login.html")
    
# Rutas principales de la aplicación
@app.route("/home")
def home():
    """Renderiza la página principal."""
    return render_template("home.html")

@app.route("/admin")
def admin():
    """Renderiza la página de administración."""
    return render_template("admin.html")

@app.route("/calculadora")
def calculadora():
    """Renderiza la calculadora."""
    return render_template("calculadora.html")

@app.route("/ticket")
def ticket():
    """Renderiza la página de ticket."""
    return render_template("ticket.html")

# Desconexión del usuario y redirección al inicio de sesión
@app.route('/logout')
def logout():
    """Desconecta al usuario eliminando la información de la sesión."""
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('login'))  


# Obtener la lista de usuarios desde la base de datos y devolverla en formato JSON
@app.route('/obtener_usuarios')
def obtener_usuarios():
    """Obtiene la lista de usuarios desde la base de datos y la devuelve en formato JSON."""
    cur = db.connection.cursor()  # Conectar a la base de datos
    cur.execute("SELECT id, username, password, usertype, fullname FROM users")  # Ejecutar la consulta SQL
    usuarios = []  # Inicializar una lista para almacenar los usuarios
    for row in cur.fetchall():  # Iterar sobre los resultados de la consulta
        usuario = {  # Crear un diccionario para cada usuario con los datos obtenidos
            'id': row[0],
            'username': row[1],
            'password': row[2],
            'usertype': row[3],
            'fullname': row[4]
        }
        usuarios.append(usuario)  # Agregar el usuario a la lista de usuarios
    cur.close()  # Cerrar el cursor de la base de datos
    return jsonify(usuarios)  # Devolver la lista de usuarios en formato JSON

# Agregar un nuevo usuario a la base de datos
@app.route('/agregar_usuario', methods=['POST'])
def agregar_usuario():
    """Agrega un nuevo usuario a la base de datos."""
    if request.method == 'POST':
        nuevo_usuario_data = request.json  # Obtener los datos del nuevo usuario desde la solicitud
        nuevo_usuario = User(  # Crear una instancia de User con los datos recibidos
            id=None,
            username=nuevo_usuario_data['username'],
            password=nuevo_usuario_data['password'],
            usertype=nuevo_usuario_data['usertype'],
            fullname=nuevo_usuario_data['fullname']
        )
        try:
            ModelUsers.agregar_usuario(db, nuevo_usuario)  # Llamar al método para agregar usuario del modelo
            return jsonify({'message': 'Usuario agregado exitosamente'}), 201  # Devolver un mensaje de éxito
        except Exception as e:
            return jsonify({'error': str(e)}), 500  # Devolver un mensaje de error si ocurre una excepción

# Editar un usuario existente en la base de datos
@app.route('/editar_usuario', methods=['POST'])
def editar_usuario():
    """Edita un usuario existente en la base de datos."""
    datos_usuario = request.json  # Obtener los datos del usuario a editar desde la solicitud
    usuario_id = datos_usuario.get('id')
    nuevo_nombre = datos_usuario.get('username')
    nueva_clave = datos_usuario.get('password')
    nuevo_tipo_usuario = datos_usuario.get('usertype')
    usuario_actualizado = {'id': usuario_id}  # Crear un diccionario con los campos actualizados del usuario
    if nuevo_nombre:
        usuario_actualizado['username'] = nuevo_nombre
    if nueva_clave:
        usuario_actualizado['password'] = nueva_clave
    if nuevo_tipo_usuario:
        usuario_actualizado['usertype'] = nuevo_tipo_usuario
    try:
        ModelUsers.editar_usuario(db, usuario_actualizado)  # Llamar al método para editar usuario del modelo
        return jsonify({'message': 'Usuario actualizado correctamente'}), 200  # Devolver un mensaje de éxito
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Devolver un mensaje de error si ocurre una excepción

# Eliminar un usuario existente de la base de datos
@app.route('/eliminar_usuario/<int:user_id>', methods=['DELETE'])
def eliminar_usuario(user_id):
    """Elimina un usuario existente de la base de datos."""
    try:
        ModelUsers.eliminar_usuario(db, user_id)  # Llamar al método para eliminar usuario del modelo
        return jsonify({'message': 'Usuario eliminado correctamente'}), 200  # Devolver un mensaje de éxito
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Devolver un mensaje de error si ocurre una excepción


# Obtener todos los productos desde la base de datos y devolverlos en formato JSON
@app.route("/api/products", methods=["GET"])
def obtener_productos():
    """Obtiene todos los productos desde la base de datos y los devuelve en formato JSON."""
    try:
        products = ModelProducts.obtener_productos(db)  # Obtener todos los productos desde el modelo
        return jsonify(products)  # Devolver los productos en formato JSON
    except Exception as e:
        return jsonify({"error": str(e)})  # Devolver un mensaje de error si ocurre una excepción

# Agregar un nuevo producto a la base de datos
@app.route('/agregar_producto', methods=['POST'])
def agregar_producto():
    """Agrega un nuevo producto a la base de datos."""
    nuevo_producto_data = request.json  # Obtener los datos del nuevo producto desde la solicitud
    nuevo_producto = Products(  # Crear una instancia de Products con los datos recibidos
        id=None,
        link=nuevo_producto_data['link'],
        price=nuevo_producto_data['price']
    )
    try:
        ModelProducts.agregar_producto(db, nuevo_producto)  # Llamar al método para agregar producto del modelo
        return jsonify({'message': 'Producto agregado exitosamente'}), 201  # Devolver un mensaje de éxito
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Devolver un mensaje de error si ocurre una excepción

# Editar un producto existente en la base de datos
@app.route('/editar_producto', methods=['POST'])
def editar_producto():
    """Edita un producto existente en la base de datos."""
    datos = request.json  # Obtener los datos del producto a editar desde la solicitud
    try:
        product_id = datos['id']
        link = datos.get('link')
        price = datos.get('price')

        # Crear una lista de campos a actualizar y sus valores
        update_fields = []
        if link is not None:
            update_fields.append(("link", link))
        if price is not None:
            update_fields.append(("price", price))
        
        if not update_fields:
            return jsonify({'error': 'No hay campos para actualizar'}), 400  # Devolver un mensaje de error si no hay campos para actualizar

        # Generar la consulta SQL dinámica
        query = "UPDATE products SET " + ", ".join(f"{field} = %s" for field, _ in update_fields) + " WHERE id = %s"
        values = [value for _, value in update_fields] + [product_id]

        cursor = db.connection.cursor()
        cursor.execute(query, values)  # Ejecutar la consulta SQL
        db.connection.commit()  # Confirmar los cambios en la base de datos
        cursor.close()  # Cerrar el cursor
        return jsonify({'message': 'Producto actualizado correctamente'}), 200  # Devolver un mensaje de éxito
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Devolver un mensaje de error si ocurre una excepción

# Eliminar un producto existente de la base de datos
@app.route('/eliminar_producto/<int:producto_id>', methods=['DELETE'])
def eliminar_producto(producto_id):
    """Elimina un producto existente de la base de datos."""
    try:
        ModelProducts.eliminar_producto(db, producto_id)  # Llamar al método para eliminar producto del modelo
        return jsonify({'message': 'Producto eliminado correctamente'}), 200  # Devolver un mensaje de éxito
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Devolver un mensaje de error si ocurre una excepción


if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.run()


