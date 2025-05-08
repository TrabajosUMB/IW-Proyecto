# Importación de módulos necesarios
from flask import Flask, request, jsonify, session  # Flask para el servidor web, request para manejar peticiones, jsonify para respuestas JSON
from flask_sqlalchemy import SQLAlchemy  # ORM para la base de datos
from werkzeug.security import generate_password_hash, check_password_hash  # Funciones para hash de contraseñas
from datetime import datetime  # Para manejar fechas

# Inicialización de la aplicación Flask
app = Flask(__name__)

# Configuración de la aplicación
app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'  # Clave secreta para sesiones
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # URL de la base de datos SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar tracking de modificaciones de SQLAlchemy

# Inicialización de la base de datos
db = SQLAlchemy(app)

# Definición del modelo de Usuario
class User(db.Model):
    # Campos de la tabla usuarios
    id = db.Column(db.Integer, primary_key=True)  # ID único autoincremental
    nombre = db.Column(db.String(100), nullable=False)  # Nombre del usuario
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email único
    password = db.Column(db.String(200), nullable=False)  # Contraseña hasheada
    edad = db.Column(db.Integer, nullable=False)  # Edad del usuario
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de registro automática

# Crear todas las tablas en la base de datos
with app.app_context():
    db.create_all()

# Ruta para registrar nuevos usuarios
@app.route('/api/register', methods=['POST'])
def register():
    # Obtener datos del formulario en formato JSON
    data = request.get_json()

    # Verificar que todos los campos requeridos estén presentes
    if not all(k in data for k in ('nombre', 'email', 'password', 'edad')):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    # Verificar si el email ya está registrado
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 400

    # Crear hash de la contraseña para almacenarla de forma segura
    hashed_password = generate_password_hash(data['password'], method='sha256')
    
    # Crear nuevo usuario con los datos proporcionados
    new_user = User(
        nombre=data['nombre'],
        email=data['email'],
        password=hashed_password,
        edad=data['edad']
    )

    try:
        # Guardar el usuario en la base de datos
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Usuario registrado exitosamente'}), 201
    except:
        # Manejar cualquier error durante el registro
        return jsonify({'error': 'Error al registrar usuario'}), 500

# Ruta para iniciar sesión
@app.route('/api/login', methods=['POST'])
def login():
    # Obtener datos del formulario en formato JSON
    data = request.get_json()

    # Verificar que email y contraseña estén presentes
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    # Buscar usuario por email
    user = User.query.filter_by(email=data['email']).first()

    # Verificar si el usuario existe y la contraseña es correcta
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Email o contraseña incorrectos'}), 401

    # Crear sesión para el usuario
    session['user_id'] = user.id
    
    # Retornar datos del usuario (excepto la contraseña)
    return jsonify({
        'message': 'Login exitoso',
        'user': {
            'id': user.id,
            'nombre': user.nombre,
            'email': user.email
        }
    }), 200

# Iniciar el servidor solo si este archivo se ejecuta directamente
if __name__ == '__main__':
    app.run(debug=True)  # Modo debug activado para desarrollo
