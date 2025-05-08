# Sip&Go 🍺

Una aplicación web moderna para la venta de bebidas alcohólicas, desarrollada como proyecto de curso. Incluye sistema de autenticación, catálogo de productos y carrito de compras.

## 📋 Descripción

Sip&Go es una plataforma de e-commerce especializada en la venta de bebidas alcohólicas. La aplicación ofrece una interfaz moderna y amigable que permite a los usuarios:
- Registrarse y gestionar su cuenta
- Explorar diferentes categorías de bebidas
- Ver ofertas especiales
- Realizar compras de manera sencilla
- Gestionar su carrito de compras

## 🚀 Características Principales

### Sistema de Autenticación
- Registro de usuarios con validación de edad (+18)
- Inicio de sesión seguro
- Almacenamiento seguro de contraseñas (hash)
- Gestión de sesiones de usuario

### Catálogo de Productos
- Navegación por categorías (Cervezas, Vinos, Whisky, etc.)
- Visualización de ofertas y descuentos
- Detalles de productos (precio, descripción, imagen)
- Sistema de filtrado por categorías

### Carrito de Compras
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia del carrito en sesión

## 🛠️ Stack Tecnológico

### Backend
- **Python 3.x**
- **Flask 2.3.3**: Framework web
- **SQLAlchemy 2.0.20**: ORM para base de datos
- **Flask-SQLAlchemy 3.1.1**: Integración de SQLAlchemy con Flask
- **Flask-Login 0.6.3**: Manejo de autenticación
- **Werkzeug 2.3.7**: Utilidades web y seguridad
- **SQLite**: Base de datos

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Bootstrap 5.1.3**: Framework CSS
- **Font Awesome 6.0.0**: Iconografía

## 📁 Estructura del Proyecto

```
Sip-Go/
├── app.py              # Servidor Flask y lógica del backend
├── requirements.txt    # Dependencias de Python
├── users.db           # Base de datos SQLite
├── static/
│   ├── css/
│   │   └── styles.css  # Estilos personalizados
│   ├── js/
│   │   ├── app.js      # Lógica general de la aplicación
│   │   └── auth.js     # Lógica de autenticación
│   └── img/
│       ├── productos/  # Imágenes de productos
│       ├── inicio/     # Imágenes de la página principal
│       └── favicon/    # Iconos de la aplicación
├── templates/
│   ├── index.html     # Página principal
│   ├── login.html     # Página de login/registro
│   ├── page.html      # Página de productos
│   └── carrito.html   # Página del carrito
└── README.md
```

## 💾 Base de Datos

### Tabla Users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    edad INTEGER NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Instalación y Ejecución

1. **Clonar el Repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Sip-Go
   ```

2. **Crear y Activar Entorno Virtual**
   ```bash
   python -m venv venv
   # En Windows
   .\venv\Scripts\activate
   # En Unix o MacOS
   source venv/bin/activate
   ```

3. **Instalar Dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Iniciar el Servidor**
   ```bash
   python app.py
   ```

5. **Acceder a la Aplicación**
   - Abrir navegador en `http://localhost:5000`

## 🔒 Endpoints de la API

### Autenticación
- `POST /api/register`: Registro de nuevos usuarios
  ```json
  {
    "nombre": "string",
    "email": "string",
    "password": "string",
    "edad": "integer"
  }
  ```

- `POST /api/login`: Inicio de sesión
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## 🔐 Seguridad

- Contraseñas hasheadas con Werkzeug
- Validación de edad mínima (18 años)
- Protección contra inyección SQL
- Validación de correos únicos
- Manejo seguro de sesiones

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Dispositivos**: Responsive para móviles, tablets y escritorio
- **Resoluciones**: Desde 320px hasta 4K

## 👥 Contribución

1. Fork del repositorio
2. Crear rama para nueva característica
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```
3. Commit y push de cambios
4. Crear Pull Request

## 🔜 Roadmap

- [ ] Integración de pasarela de pagos
- [ ] Sistema de reseñas de productos
- [ ] Panel de administración
- [ ] Historial de pedidos
- [ ] Sistema de búsqueda avanzada
- [ ] Recomendaciones personalizadas

## 📄 Licencia

Este proyecto está bajo la Licencia incluida en el archivo LICENSE.

## 📧 Contacto

Para soporte o consultas, contactar a través de:
- Email: [correo@ejemplo.com]
- GitHub: [usuario-github]
