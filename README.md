# Hito 6 - Patrones de Integración Empresarial

## Setting up

1. Instalar Node

Para poder correr el projecto es necesario tener nodeJS [v20.18.0](https://nodejs.org/en) o superior instalado.

2. Instalar Docker

Este proyecto esta hecho para funcionar con [docker](https://www.docker.com/). Si no desea utilizar esta herramienta debe configurar el package.json para no usarlo asi tambien todo el proceso manual que conlleva crear la base de datos.

## Usage

1. Luego de descargar el proyecto, ejecutamos el siguiente comando para descargar las dependencias

```javascript
npm install
```

2. Una vez tenemos las dependecias descargas podemos iniciar el proyecto. IMPORTANTE, antes de executar el siguiente comando no olvidar abrir docker.

```javascript
npm run dev
```

3. Es importante que se ejecute esta instruccion directo en base de datos, ya que no se puede crear un `Super Usuario` a travez de la API

```
insert into users(resource_id, username, password, first_name, last_name, email, phone_number, status, role_id)
values(
	'fa574598-7dce-4e94-829e-08940daa4afd',
	'super.admin',
	'$2b$10$OdDDN/TxnXN8x2IUlldQFOh0.Obv2DcbcCjw7as2euKQWCUA2K0Hm', --asd123asd
	'Super',
	'Admin',
	'email@gmail.com',
	'+56912345678',
	1,
	1
);
```

## Concerns

1. El chat esta sujeto a condiciones muy especificas para que funcione correctamente.
2. No se puede crear `Super Usuario` a travez de la API
3. Todos los endpoint disponibles funcionan correctamente pero solo se crearon screenshots de los usuarios