# Koibanx Backend Challenge
API-REST desarrollado en Nodejs con el framework Express. Los datos son persistidos en una base de datos MongoDB por medio de mongoose. La api permite obtener, filtrar y crear datos de comercio.

## Installation
Run `npm install` in the root folder.
Create **.env** file with database configuration.

## Running server
Start MongoDB server and run `npm start`.

_API runs on **http://localhost:3000/** by default._

## Running Testing
Run `npm test`.

## Consideraciones
Se utlizaron diferentes librerias para cubrir las necesidades de la aplicación:
- **express-validators** para validar y sanitizar facilmente los datos de entrada de la api.
- **basic-auth** para simplificar la autenticación.
- **jest** como framework de testing y **supertest** para realizar pruebas de integración.
- **eslint** para estandarizar estilos y prevenir errores.
- **cross-env** para permitir npm scripts multiplataforma.

Otras consideraciones son:
- Cualquier query filter válido en mongoose puede utilizarse para filtrar los datos.
- Page y limit son datos enviados como parámetros query para realizar la paginación. Aunque considero que es mucho más eficiente enviar el id del último dato listado.
- Se utiliza una base de datos distinta para realizar las pruebas de integración.
- En modo desarrollo si no existe datos en la base de datos se ejecutan automáticamente los seeders
