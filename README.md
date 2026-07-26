# Docker Playwright Lab

Laboratorio práctico para aprender Docker construyendo un entorno de desarrollo
reproducible. Playwright es el caso de uso; Docker es el protagonista.

Este repositorio muestra cómo empaquetar un entorno con Node.js, Playwright y sus
navegadores, publicarlo como imagen, reutilizarlo desde otra computadora y
ejecutarlo tanto localmente con Docker Compose como en GitHub Actions.

> ¿Ya trabajás con Docker y querés ir directo a la arquitectura y las decisiones?
> Consultá la [guía técnica](docs/technical-guide.md).

## ¿Qué aprendemos en este lab?

El laboratorio creció respondiendo preguntas pequeñas y concretas:

1. **¿Cómo evito preparar Playwright manualmente en cada computadora?**  
   Creamos una imagen reproducible mediante un `Dockerfile`.
2. **¿Cómo comparte una persona ese entorno con el resto del equipo?**  
   Etiquetamos la imagen y la publicamos en Docker Hub.
3. **¿Puede otro developer usarla sin instalar Node ni Playwright?**  
   Montamos su copia del repositorio dentro de un contenedor.
4. **¿Cómo evitamos un comando `docker run` largo y difícil de recordar?**  
   Describimos el entorno de desarrollo en `compose.yml`.
5. **¿Puede una aplicación del contenedor verse desde la computadora?**  
   Publicamos el puerto de Playwright UI y accedemos desde `localhost`.
6. **¿Se puede usar la misma imagen en integración continua?**  
   GitHub Actions ejecuta las pruebas dentro del entorno publicado.
7. **¿Qué ocurre con los resultados?**  
   Los artefactos permanecen en el workspace y Allure se publica con GitHub Pages.

El resultado es un flujo parecido al que podría encontrar un developer al
incorporarse a un equipo:

```text
Clonar el repositorio
        ↓
Descargar la imagen del equipo
        ↓
Instalar dependencias en un volumen de Docker
        ↓
Editar el código desde la computadora
        ↓
Ejecutar Playwright dentro del contenedor
```

## Requisitos

Para utilizar solamente el entorno Docker necesitás:

- Git.
- Docker Desktop con contenedores Linux.
- Docker Compose, incluido en las versiones actuales de Docker Desktop.

No necesitás instalar Node.js, Playwright ni navegadores en la computadora.

## Empezar desde cero

Cloná el repositorio:

```powershell
git clone https://github.com/aldimhernandez/docker-playwright-lab.git
cd docker-playwright-lab
```

Descargá la imagen definida en `compose.yml`:

```powershell
docker compose pull
```

Instalá las dependencias del proyecto en el volumen administrado por Docker:

```powershell
docker compose run --rm dev npm ci
```

Ejecutá las pruebas:

```powershell
docker compose run --rm dev npm test
```

## Usar Playwright UI

Iniciá la interfaz interactiva:

```powershell
docker compose run --rm --service-ports dev npm run test:ui:docker
```

Después abrí:

<http://localhost:9323>

La terminal muestra también `Listening on http://0.0.0.0:9323`. No es la URL
que debe abrirse en Windows: `0.0.0.0` significa que Playwright escucha en todas
las interfaces de red **dentro del contenedor**. Docker publica ese servicio
como `localhost:9323` en la computadora.

```text
Navegador del developer
http://localhost:9323
          ↓
Puerto publicado por Docker
127.0.0.1:9323 → contenedor:9323
          ↓
Playwright UI
0.0.0.0:9323
```

Presioná `Ctrl+C` para detener Playwright UI. Como el comando utiliza `--rm`, el
contenedor temporal se elimina al finalizar.

## Trabajar en el proyecto

El repositorio local se monta como `/workspace` dentro del contenedor. Por eso:

- Los cambios realizados en VS Code aparecen dentro del contenedor.
- Los tests siempre utilizan el código actual del developer.
- Los resultados generados bajo `/workspace` permanecen en la computadora.
- `node_modules` se guarda en un volumen de Docker para no mezclar dependencias
  Linux con el filesystem de Windows.

Para abrir una terminal interactiva dentro del entorno:

```powershell
docker compose run --rm dev
```

Una vez dentro:

```bash
npm test
npm run lint
npm run test:tag
```

Para salir:

```bash
exit
```

## Dockerfile, Compose y CI

Cada archivo responde una pregunta diferente:

| Archivo                     | Responsabilidad                            |
|-----------------------------|--------------------------------------------|
| `Dockerfile`                | Cómo construir la imagen del entorno.      |
| `.dockerignore`             | Qué archivos no deben entrar en el build.  |
| `compose.yml`               | Cómo utiliza el entorno un developer.      |
| `.github/workflows/ci.yml`  | Cómo utiliza el entorno GitHub Actions.    |
| `package.json`              | Qué comandos ofrece el proyecto.           |

La imagen publicada actualmente es:

```text
aldimh/docker-playwright-demo:1.0.0
```

El nombre conserva temporalmente la etapa inicial del proyecto como demo. Una
versión futura podrá publicarse como `aldimh/docker-playwright-lab`.

## Comandos útiles

Validar el archivo Compose:

```powershell
docker compose config
```

Ver los contenedores del proyecto:

```powershell
docker compose ps
```

Ver también contenedores temporales activos:

```powershell
docker ps
```

Eliminar contenedores y la red creados por Compose:

```powershell
docker compose down
```

Eliminar además el volumen de dependencias:

```powershell
docker compose down --volumes
```

Después de borrar el volumen será necesario ejecutar nuevamente `npm ci`.

## Estado del laboratorio

- [x] Crear una imagen propia basada en Playwright.
- [x] Publicar manualmente una versión en Docker Hub.
- [x] Consumir la imagen desde un clon limpio.
- [x] Estandarizar el entorno local con Docker Compose.
- [x] Ejecutar Playwright UI mediante un puerto publicado.
- [x] Usar la imagen desde GitHub Actions.
- [x] Generar y publicar reportes Allure.
- [ ] Automatizar el build y la publicación de imágenes.
- [ ] Incorporar escaneo de vulnerabilidades.
- [ ] Evaluar ejecución con un usuario sin privilegios.

## Más información

La [guía técnica](docs/technical-guide.md) explica la arquitectura, los montajes,
la red, el comportamiento en CI, las decisiones de seguridad y los próximos
pasos del laboratorio.

