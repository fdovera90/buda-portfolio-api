# Buda Portfolio API

API REST diseñada para calcular el valor total de un portafolio de criptomonedas en una moneda fiat específica (CLP, PEN, COP), utilizando precios en tiempo real proporcionados por la API de Buda.com.

Este proyecto ha sido desarrollado utilizando TypeScript para un tipado robusto.

## Tecnologías

*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework Web:** [Express](https://expressjs.com/)
*   **Contenedor:** [Docker](https://www.docker.com/)
*   **Despliegue:** [Google Cloud Platform (GCP)](https://cloud.google.com/)

## Prerrequisitos

*   Node.js (v18 o superior recomendado)
*   npm o yarn

## Instalación

1.  Clona este repositorio:
    ```bash
    git clone https://github.com/fdovera90/buda-portfolio-api.git
    cd buda-portfolio-api
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

## Configuración

Este proyecto utiliza variables de entorno para su configuración. Crea un archivo `.env` en la raíz del proyecto basado en el archivo `.env.example`:

```bash
cp .env.example .env
```

Variables disponibles:

*   `PORT`: Puerto en el que correrá el servidor (ej. `3000`).
*   `NODE_ENV`: Entorno de ejecución (`development`, `production`).
*   `BUDA_API_BASE_URL`: URL base de la API de Buda (ej. `https://www.buda.com`).

## Ejecución

### Desarrollo

Para levantar el servidor en modo desarrollo con recarga automática (hot-reload):

```bash
npm run dev
```

### Producción

Para compilar y ejecutar la versión optimizada para producción:

```bash
npm run build
npm start
```

## Docker y Despliegue

El proyecto cuenta con un `Dockerfile` optimizado para la creación de imágenes de contenedor.

La aplicación se encuentra actualmente desplegada en **Google Cloud Platform (GCP)**.

**URL Base del Despliegue:** `https://buda-portfolio-api-17667987332.southamerica-east1.run.app`

## Documentación de la API

La API cuenta con documentación interactiva generada con **Swagger/OpenAPI**.

*   **Swagger UI:** Disponible en `/api-docs` (ej. `http://localhost:3000/api-docs` en desarrollo).

La API expone un único endpoint para el cálculo del valor del portafolio.

### Calcular Valor de Portafolio

Calcula el valor acumulado de una lista de criptomonedas convertidas a una moneda fiat soportada.

*   **URL:** `/buda/portfolio/value`
*   **Método:** `POST`
*   **Content-Type:** `application/json`

#### Cuerpo de la Solicitud (Request Body)

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `portfolio` | `object` | Objeto donde las claves son los símbolos de las criptomonedas (BTC, ETH, USDT, etc.) y los valores son las cantidades poseídas. |
| `fiat_currency` | `string` | Moneda fiat de destino. Valores permitidos: `CLP`, `PEN`, `COP`. |

**Ejemplo de Request:**

```json
{
  "portfolio": {
    "BTC": 0.5,
    "ETH": 2.0,
    "USDT": 1000
  },
  "fiat_currency": "CLP"
}
```

#### Respuestas

**✅ 200 OK - Éxito**

Devuelve el valor total calculado.

```json
{
  "fiat": "CLP",
  "total": 15430250.50
}
```

**❌ 400 Bad Request**

Ocurre si faltan campos requeridos o la moneda fiat no es válida.

```json
{
  "error": "fiat_currency must be one of: CLP, PEN, COP"
}
```

**❌ 502 Bad Gateway**

Ocurre si hay problemas de comunicación o respuestas inválidas desde la API externa de Buda.

```json
{
  "error": "Invalid response from Buda API"
}
```

**❌ 500 Internal Server Error**

Error inesperado en el servidor.

```json
{
  "error": "Internal server error"
}
```

## Arquitectura del Proyecto

El código fuente se encuentra en el directorio `src/` y sigue una estructura modular:

*   `modules/`: Contiene la lógica de negocio dividida por dominios (ej. `buda`).
*   `shared/`: Utilidades y código compartido entre módulos.
*   `server.ts`: Punto de entrada de la aplicación y configuración de Express.

## Supuestos y Consideraciones de Diseño

Durante el desarrollo de esta solución se tomaron los siguientes supuestos:

1.  **Cálculo de Precio**: Se utiliza el precio de la última transacción (`last_price`) entregado por la API de Buda para el cálculo de valorización. No se consideran puntas de compra/venta ni profundidad de mercado.
2.  **Disponibilidad de Mercados**: Se asume que para cada criptomoneda en el portafolio existe un mercado directo contra la moneda fiat solicitada (ej. si pido valor en `CLP` para `BTC`, debe existir el mercado `BTC-CLP`).
    *   Si un mercado no existe en Buda.com, la solicitud fallará retornando un error `400 Bad Request` indicando que el mercado no fue encontrado.
3.  **Monedas Soportadas**: Aunque la arquitectura permite extenderlo, inicialmente se restringe el cálculo a las monedas fiat `CLP`, `PEN` y `COP` según lo indicado en el desafío.
4.  **Estabilidad de API Externa**: La aplicación depende directamente de la disponibilidad de la API pública de Buda.com. Errores de conexión o respuestas inesperadas de dicha API se manejan retornando un error `502 Bad Gateway` al cliente.

## Testing

Para ejecutar los tests unitarios y de integración:

```bash
npm test
```

Para ver la cobertura de código:

```bash
npm run test:coverage
```
