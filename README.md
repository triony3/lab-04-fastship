# FastShip Backend API

Backend desarrollado con el stack MEAN (Específicamente Node.js, Express y MongoDB) para la gestión de envíos de la startup **FastShip**.

## Instrucciones de Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd fastship-backend
   ```

2. **Instalar dependencias:**
   Asegúrese de tener Node.js instalado. Luego ejecute:
   ```bash
   npm install
   ```

3. **Configuración de la Base de Datos:**
   El proyecto funciona de fábrica usando una conexión a MongoDB local a través de las variables de entorno. Asegúrese de tener MongoDB corriendo o cambie la cadena de conexión por una de MongoDB Atlas en el archivo `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/fastship
   ```

4. **Iniciar el servidor:**
   ```bash
   node index.js
   ```
   *Nota: El servidor estará corriendo en `http://localhost:3000`.*

## Endpoints de la API (Pruebas con Postman/Insomnia)

### 1. Registrar un nuevo envío (POST)
- **URL**: `http://localhost:3000/api/envios`
- **Body** (JSON):
  ```json
  {
      "id_pedido": "PKG-001",
      "remitente": "Amazon Warehouse",
      "destinatario": "Juan Pérez",
      "direccion_entrega": "Av. Principal 123, Ciudad"
  }
  ```

### 2. Consultar envíos activos (GET)
- **URL**: `http://localhost:3000/api/envios`

### 3. Buscar envío por ID (GET)
- **URL**: `http://localhost:3000/api/envios/PKG-001`

### 4. Actualizar el estado del envío (PATCH)
- **URL**: `http://localhost:3000/api/envios/PKG-001/estado`
- **Body** (JSON):
  ```json
  {
      "estado": "en tránsito"
  }
  ```

---

## Argumentación Técnica (Paso 3)

### 1. Elección de las estructuras de datos en MongoDB
Se eligió MongoDB, una base de datos NoSQL basada en documentos, debido a la naturaleza dinámica de los datos logísticos y de paquetería. El modelo `Envio` definido mediante **Mongoose** proporciona una estructura clara (esquema) validando tipos de datos y campos obligatorios. 
- Se utilizó el campo `id_pedido` como identificador único de negocio y amigable (`unique: true`) en vez de depender exclusivamente del `_id` autogenerado de MongoDB, facilitando enormemente las consultas de búsqueda y actualizaciones de estado.
- El campo `estado` se restringió con un `enum` estricto (`['pendiente', 'en tránsito', 'entregado']`) para garantizar la consistencia e integridad absoluta de los datos, evitando errores tipográficos o estados huérfanos que corrompan el flujo de la startup.

### 2. El uso de rutas y controladores en Express
Se aplicó el patrón arquitectónico MVC (Modelo-Vista-Controlador), separando la lógica de negocio del enrutamiento web. 
- **Rutas (`routes/envios.js`)**: Encargadas exclusivamente de recibir el método HTTP (GET, POST, PATCH), mapear la URL del endpoint y derivarla al controlador adecuado. Esto mantiene la escalabilidad del sistema.
- **Controladores (`controllers/envioController.js`)**: Contienen toda la lógica ("cerebro") de operaciones CRUD. Procesan la solicitud (`req`), se comunican con la base de datos a través de Mongoose de forma asíncrona, y devuelven una respuesta HTTP estructurada (`res`) de forma eficiente.

### 3. La forma en que se manejan errores y validaciones
- **Validaciones**: Se implementaron desde las raíces en el esquema de Mongoose usando `required`, `trim` y `enum`. Adicionalmente, cuando se actualiza un estado (PATCH), el controlador valida con un bloque condicional que el estado proveído exista en la matriz de permitidos *antes* de hacer la transacción hacia la base de datos.
- **Manejo de Errores**: Se emplearon bloques `try/catch` asíncronos en la totalidad de los controladores para interceptar excepciones (tanto de Mongoose como fallas de red), retornando códigos de estado HTTP semánticos correctos: `400 Bad Request` para errores de validación o ID duplicado (interceptando el código `11000` de Mongo), `404 Not Found` cuando una búsqueda de ID fracasa, y `500 Internal Server Error` para problemas del servidor; adjuntando siempre una estructura JSON informativa para facilitar su consumo desde un cliente o aplicación móvil.

---

## Conclusiones (Paso 4)

1. **Desafíos enfrentados al implementar la API en Express con MongoDB:**
   Uno de los desafíos principales en este tipo de implementaciones backend radica en el manejo fluido del asincronismo y el control estructurado de los errores. Al comunicarse MongoDB mediante promesas, el dominio y gestión a través de la sintaxis `async/await` es fundamental para evitar la saturación de devoluciones de llamada ("callback hell"). Adicionalmente, la arquitectura demanda atrapar correctamente errores de duplicidad (como violaciones de índice único) o validaciones previas de Mongoose, para traducirlos en mensajes JSON amigables y entendibles para el cliente que consume el servicio, lo cual requiere una codificación sumamente meticulosa a nivel de controladores.

2. **Buenas prácticas para desarrollar un backend escalable y seguro:**
   Para asegurar que el backend de FastShip pueda crecer sin deudas técnicas, es esencial fragmentar y aislar responsabilidades de acuerdo a su propósito (los archivos de enrutamiento web jamás deben contener lógica de consultas a la BD). Asimismo, centralizar la conexión a la base de datos e inyectar configuraciones sensibles (como URIs, secretos de JWT y puertos) únicamente a través de variables de entorno (`.env`). Finalmente, aplicar middlewares universales como `cors` para salvaguardar peticiones de origen cruzado, y utilizar un analizador de JSON nativo (`express.json()`) para prevenir inyecciones de código malicioso, sentando así las bases de un servicio resiliente ante el aumento de la demanda o ciberataques de inyección de datos.
