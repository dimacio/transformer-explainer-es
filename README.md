# Transformer Explainer — versión en castellano

Traducción al castellano de [**Transformer Explainer**](https://github.com/poloclub/transformer-explainer), la visualización interactiva del Polo Club of Data Science (Georgia Tech) que corre un modelo **GPT-2 (small) en vivo dentro del navegador** y muestra, paso a paso, cómo se predice el token siguiente.

> **Esto no es el proyecto original.** Es un fork con el texto traducido, mantenido de forma independiente. Para la versión oficial, en inglés y con las últimas novedades, ir a [poloclub.github.io/transformer-explainer](http://poloclub.github.io/transformer-explainer).

## Demo

- Esta traducción: [dimacio.github.io/transformer-explainer-es](https://dimacio.github.io/transformer-explainer-es/)
- Original en inglés: [poloclub.github.io/transformer-explainer](http://poloclub.github.io/transformer-explainer)

## Qué se tradujo y qué no

| | Estado |
|---|---|
| Tarjetas del manual (las 20 explicaciones guiadas) | Traducidas |
| Etiquetas del diagrama, popovers y tooltips | Traducidas |
| Artículo largo del pie de página (`Article.svelte`) | Traducido. Se conservan en inglés las fórmulas y el video tutorial embebido |
| Fórmulas KaTeX (`Weights`, `Bias`, `Embedding`…) | **Sin traducir**, notación original |
| El modelo | GPT-2 en inglés: las predicciones y los ejemplos precargados siguen siendo en inglés |

### Criterios de traducción

Se dejaron **sin traducir** los términos que el alumno va a reencontrar en la bibliografía:
*transformer, token, embedding, self-attention, head, Query/Key/Value, softmax, logit, dropout, top-k, top-p, MLP, GELU*.

Se tradujeron: *codificación posicional, bloque Transformer, producto punto, máscara, puntajes de atención, pesos, sesgos, capa lineal, activación, normalización por capa, conexión residual, probabilidades, temperatura, estrategia de muestreo*.

El registro es impersonal ("se puede ver", "conviene probar"), sin marca regional.

### Otros cambios respecto del original

- Se quitó el aviso de recolección de datos con fines de investigación y su enlace al formulario de consentimiento: corresponden al estudio de los autores originales, no a este fork.
- Se eliminó el workflow `sync.yml`, que sincronizaba a diario con upstream y habría sobrescrito la traducción.
- `paths.base` apunta a `/transformer-explainer-es`.
- Se corrigió un desfase del generador: a partir del segundo "Generar", el diagrama procesaba la entrada anterior y quedaba un token atrás del texto. El callback que reacciona al cambio de entrada leía `$inputText` en vez del valor que recibe, y con las versiones actuales de Svelte ese valor llega atrasado (`src/routes/+page.svelte`).
- Se reactivaron los popovers de ayuda que el original tiene comentados, cada uno con su botón "Leer más" al párrafo del artículo: **temperatura**, **estrategia de muestreo**, **embedding de token**, **codificación posicional**, **normalización por capa**, **dropout**, **activación GELU** y **conexión residual**. Se quitó el enlace al manual externo en inglés (`transformer-explainer.github.io/textbook`), que no se renderizaba.

## Cómo correrlo localmente

Requiere Node.js v20+ y NPM v10+ para `npm install`.

> **`npm ci` es más exigente:** el `package-lock.json` de este repo lo generó npm 11, y npm 10 arma
> el árbol de dependencias distinto, así que lo rechaza (`Missing: @typescript-eslint/types...`).
> Para `npm ci` hace falta Node 24+ (que trae npm 11); con `npm install` anda cualquier Node 20+.

```bash
git clone https://github.com/dimacio/transformer-explainer-es.git
cd transformer-explainer-es
npm install
npm run dev
```

Después, abrir http://localhost:5173.

La primera carga descarga el modelo GPT-2 (~600 MB, partido en 63 fragmentos dentro de `static/model-v2/`). Mientras tanto se pueden usar los ejemplos precalculados.

> Si `npm install` falla con `ERESOLVE`: borrar `package-lock.json` y volver a correrlo. El lockfile de upstream quedó atado a `vite@5` y este fork usa `vite@7`.

## Cómo publicarlo en GitHub Pages

```bash
npm run build
npm run deploy
```

`deploy` publica la carpeta `build` en la rama `gh-pages`. En **Settings → Pages** del repositorio hay que elegir esa rama como origen.

## Créditos

Transformer Explainer fue creado por <a href="https://aereeeee.github.io/" target="_blank">Aeree Cho</a>, <a href="https://www.linkedin.com/in/chaeyeonggracekim/" target="_blank">Grace C. Kim</a>, <a href="https://alexkarpekov.com/" target="_blank">Alexander Karpekov</a>, <a href="https://alechelbling.com/" target="_blank">Alec Helbling</a>, <a href="https://zijie.wang/" target="_blank">Jay Wang</a>, <a href="https://seongmin.xyz/" target="_blank">Seongmin Lee</a>, <a href="https://bhoov.com/" target="_blank">Benjamin Hoover</a> y <a href="https://poloclub.github.io/polochau/" target="_blank">Polo Chau</a> en el Georgia Institute of Technology.

Este fork solo aporta la traducción del texto al castellano.

## Paper original

[**Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation and Experimentation**](https://dl.acm.org/doi/pdf/10.1145/3772318.3791725).
Aeree Cho, Grace C. Kim, Alexander Karpekov, Seongmin Lee, Alec Helbling, Benjamin Hoover, Zijie J. Wang, Minsuk Kahng, Duen Horng Chau.
_Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems._

```bibTeX
@inproceedings{cho2026transformer,
  title={Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation and Experimentation},
  author={Cho, Aeree and Kim, Grace C and Karpekov, Alexander and Lee, Seongmin and Helbling, Alec and Hoover, Benjamin and Wang, Zijie J and Kahng, Minsuk and Chau, Duen Horng},
  booktitle={Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems},
  pages={1--21},
  year={2026}
}
```

## Licencia

[MIT](./LICENSE), igual que el original. El aviso de copyright de los autores originales se conserva sin cambios en el archivo `LICENSE`.

## Otros explicadores del mismo grupo

- [**Diffusion Explainer**](https://poloclub.github.io/diffusion-explainer)
- [**CNN Explainer**](https://poloclub.github.io/cnn-explainer)
- [**GAN Lab**](https://poloclub.github.io/ganlab)
