# 🧮 Álgebra Lineal Interactiva

## Descripción del Proyecto

Este proyecto es una aplicación web interactiva diseñada para ayudar a estudiantes y entusiastas a aprender y practicar conceptos fundamentales de álgebra lineal de una manera dinámica y visual. La aplicación gamifica el proceso de aprendizaje, permitiendo a los usuarios resolver problemas de matrices, transformaciones lineales, determinantes, subespacios, diagonalización y quizzes generales, mientras rastrean su progreso y puntuación.

## Características Principales

-   **Niveles Interactivos:** Cinco niveles dedicados a diferentes temas del álgebra lineal:
    -   **Transformaciones Básicas:** Rotación, escalado y traslación de figuras geométricas.
    -   **Determinantes y Subespacios:** Cálculo de determinantes y exploración de espacios nulos y columnas.
    -   **Sistemas de Ecuaciones:** Resolución de sistemas lineales mediante métodos matriciales.
    -   **Diagonalización:** Conceptos de valores y vectores propios, y el proceso de diagonalización.
    -   **Quiz General:** Un cuestionario de selección múltiple para evaluar el conocimiento global.
-   **Visualización en Tiempo Real:** En el nivel de Transformaciones Básicas, los usuarios pueden arrastrar y transformar figuras y ver el resultado instantáneamente.
-   **Entrada de Texto Universal:** Todas las preguntas, incluidas las conceptuales, aceptan entrada de texto para una mayor flexibilidad.
-   **Feedback Inmediato:** Retroalimentación visual y textual sobre la corrección de las respuestas.
-   **Sistema de Pistas:** Proporciona explicaciones generales y pistas específicas para cada ejercicio.
-   **Auto-resolución:** Opción para ver la respuesta correcta automáticamente y comprender la solución.
-   **Seguimiento de Puntuación:** Puntuación por nivel y una puntuación global acumulada.
-   **Diseño Responsivo:** Interfaz de usuario adaptativa para una experiencia óptima en dispositivos móviles y de escritorio.

## Cómo Iniciar el Proyecto

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

### Prerrequisitos

Asegúrate de tener Node.js (versión 18.x o superior) y npm (o yarn) instalados en tu máquina.

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/MateoGuilleng/Capstone-algebra-lineal.git
    cd Capstone-algebra-lineal
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas yarn
    # yarn install
    ```

### Ejecutar la Aplicación

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm run dev
# o si usas yarn
# yarn dev
```

La aplicación se ejecutará en `http://localhost:3000` (o el puerto que te indique la terminal).

### Construir para Producción

Para construir la aplicación para despliegue en producción:

```bash
npm run build
# o si usas yarn
# yarn build
```

Luego, puedes iniciar el servidor de producción con:

```bash
npm run start
# o si usas yarn
# yarn start
```

## Tecnologías Utilizadas

-   **Next.js:** Framework de React para el desarrollo de aplicaciones web full-stack.
-   **React:** Biblioteca de JavaScript para construir interfaces de usuario.
-   **Tailwind CSS:** Framework de CSS utilitario para un diseño rápido y responsivo.
-   **Framer Motion:** Biblioteca de animación para React.
-   **React Konva:** Biblioteca de React para dibujar en el lienzo HTML5 con Konva.js (utilizado en Transformaciones Básicas).

## Estructura del Proyecto

```
algebra/
  - app/
    - components/
      - GameContainer.js
      - levels/ # Contiene la lógica y UI para cada nivel
        - BasicTransformations.js
        - DeterminantesYSubespacios.js
        - Diagonalizacion.js
        - MatrixEquations.js
        - QuizGeneral.js
      - LevelSelector.js
    - globals.css
    - layout.js
    - page.js
  - public/ # Activos estáticos
  - README.md
  - package.json
  - next.config.mjs
  # ... otros archivos de configuración
```


