<script>
	import tailwindConfig from '../../../tailwind.config';
	import resolveConfig from 'tailwindcss/resolveConfig';
	import Katex from '~/utils/Katex.svelte';
</script>

<div id="description">
	<div class="article-section" data-click="article-intro">
		<h1>¿Qué es un Transformer?</h1>

		<p>
			El Transformer es una arquitectura de red neuronal que cambió de raíz la forma de encarar la
			inteligencia artificial. Se presentó en el paper fundacional
			<a
				href="https://dl.acm.org/doi/10.5555/3295222.3295349"
				title="ACM Digital Library"
				target="_blank">"Attention is All You Need"</a
			>
			en 2017 y desde entonces se volvió la arquitectura de referencia para los modelos de deep learning:
			es la que hace funcionar a modelos generativos de texto como <strong>GPT</strong> de OpenAI,
			<strong>Llama</strong> de Meta y <strong>Gemini</strong> de Google. Más allá del texto, el Transformer
			también se aplica a la
			<a
				href="https://huggingface.co/learn/audio-course/en/chapter3/introduction"
				title="Hugging Face"
				target="_blank">generación de audio</a
			>, al
			<a
				href="https://huggingface.co/learn/computer-vision-course/unit3/vision-transformers/vision-transformers-for-image-classification"
				title="Hugging Face"
				target="_blank">reconocimiento de imágenes</a
			>, a la
			<a href="https://elifesciences.org/articles/82819" title="eLife"
				>predicción de estructura de proteínas</a
			>
			e incluso a
			<a
				href="https://www.deeplearning.ai/the-batch/reinforcement-learning-plus-transformers-equals-efficiency/"
				title="Deep Learning AI"
				target="_blank">jugar juegos</a
			>, lo que muestra su versatilidad en dominios muy distintos.
		</p>
		<p>
			En el fondo, los Transformers generativos de texto funcionan sobre el principio de la <strong
				>predicción del token siguiente</strong
			>: dado un texto que escribe el usuario, ¿cuál es el
			<em>token más probable (una palabra o parte de una palabra)</em> que sigue a esa entrada? La innovación
			central y la potencia del Transformer están en su mecanismo de self-attention, que le permite procesar
			secuencias enteras y capturar dependencias de larga distancia mejor que las arquitecturas anteriores.
		</p>
		<p>
			La familia de modelos GPT-2 es un ejemplo destacado de Transformer generativo de texto.
			Transformer Explainer funciona con el modelo
			<a href="https://huggingface.co/openai-community/gpt2" title="Hugging Face" target="_blank"
				>GPT-2</a
			>
			(small), que tiene 124 millones de parámetros. No es el Transformer más reciente ni el más potente,
			pero comparte muchos de los componentes y principios de los modelos del estado del arte actual, y
			eso lo vuelve un punto de partida ideal para entender los fundamentos.
		</p>
	</div>

	<div class="article-section" data-click="article-overview">
		<h1>Arquitectura del Transformer</h1>

		<p>
			Todo Transformer generativo de texto tiene estos <strong>tres componentes clave</strong>:
		</p>
		<ol>
			<li>
				<strong class="bold-purple">Embedding</strong>: el texto de entrada se divide en unidades
				más chicas llamadas tokens, que pueden ser palabras o partes de palabras. Esos tokens se
				convierten en vectores numéricos llamados embeddings, que capturan el significado semántico
				de las palabras.
			</li>
			<li>
				El <strong class="bold-purple">bloque Transformer</strong> es la unidad fundamental del
				modelo: procesa y transforma los datos de entrada. Cada bloque incluye:
				<ul class="">
					<li>
						El <strong>mecanismo de atención</strong>, el componente central del bloque. Permite que
						los tokens se comuniquen entre sí, capturando información contextual y las relaciones
						entre palabras.
					</li>
					<li>
						La <strong>capa MLP (perceptrón multicapa)</strong>, una red feed-forward que opera sobre
						cada token de manera independiente. Mientras la capa de atención busca hacer circular
						información entre tokens, el objetivo del MLP es refinar la representación de cada uno.
					</li>
				</ul>
			</li>
			<li>
				<strong class="bold-purple">Probabilidades de salida</strong>: las capas finales, lineal y
				softmax, transforman los embeddings procesados en probabilidades, lo que le permite al modelo
				predecir el token siguiente de la secuencia.
			</li>
		</ol>
	</div>

	<div class="article-section" id="embedding" data-click="article-embedding">
		<h2>Embedding</h2>
		<p>
			Supongamos que se quiere generar texto con un Transformer. Se escribe un prompt como este:
			<code>“Data visualization empowers users to”</code>. Esa entrada hay que convertirla a un formato
			que el modelo pueda entender y procesar. Ahí entra el embedding: transforma el texto en una
			representación numérica con la que el modelo puede trabajar. Para convertir un prompt en
			embedding hace falta 1) tokenizar la entrada, 2) obtener los embeddings de token, 3) agregar
			información de posición y, finalmente, 4) sumar las codificaciones de token y de posición para
			obtener el embedding final. Veamos cada paso.
		</p>
		<div class="figure">
			<img src="./article_assets/embedding.png" width="65%" />
		</div>
		<div class="figure-caption">
			Figura <span class="attention">1</span>. La capa de embedding expandida, mostrando cómo el
			prompt de entrada se convierte en una representación vectorial. El proceso involucra
			<span class="fig-numbering">(1)</span> tokenización, (2) embedding de token, (3) codificación posicional
			y (4) embedding final.
		</div>
		<div class="article-subsection">
			<h3>Paso 1: tokenización</h3>
			<p>
				La tokenización es el proceso de partir el texto de entrada en pedazos más chicos y
				manejables, llamados tokens. Un token puede ser una palabra o una parte de una palabra. Las
				palabras <code>"Data"</code>
				y <code>"visualization"</code> corresponden cada una a un token único, mientras que la palabra
				<code>"empowers"</code>
				se parte en dos tokens. El vocabulario completo de tokens se decide antes de entrenar el modelo:
				el de GPT-2 tiene <code>50,257</code> tokens únicos. Ahora que el texto quedó partido en tokens
				con IDs distintos, se puede obtener su representación vectorial a partir de los embeddings.
			</p>
		</div>
		<div class="article-subsection" id="article-token-embedding">
			<h3>Paso 2: embedding de token</h3>
			<p>
				GPT-2 (small) representa cada token del vocabulario como un vector de 768 dimensiones; la
				dimensión del vector depende del modelo. Esos vectores de embedding se guardan en una matriz
				de forma <code>(50,257, 768)</code>, ¡que contiene alrededor de 39 millones de parámetros!
				Esa matriz enorme le permite al modelo asignarle un significado semántico a cada token, en el
				sentido de que los tokens con uso o significado parecido quedan cerca unos de otros en ese
				espacio de alta dimensión, y los distintos quedan lejos.
			</p>
		</div>
		<div class="article-subsection" id="article-positional-embedding">
			<h3>Paso 3: codificación posicional</h3>
			<p>
				La capa de embedding también codifica información sobre la posición de cada token dentro del
				prompt. Cada modelo usa métodos distintos de codificación posicional. GPT-2 entrena su propia
				matriz de codificación posicional desde cero, integrándola directamente al entrenamiento.
			</p>

			<!-- <div class="article-subsection-l2">
	<h4>Alternative Positional Encoding Approach <strong class='attention'>[POTENTIALLY COLLAPSIBLE]</strong></h4>
	<p>
	  Other models, like the original Transformer and BERT,
	  use sinusoidal functions for positional encoding.

	  This sinusoidal encoding is deterministic and designed to reflect
	  the absolute as well as the relative position of each token.
	</p>
	<p>
	  Each position in a sequence is assigned a unique mathematical
	  representation using a combination of sine and cosine functions.

	  For a given position, the sine function represents even dimensions,
	  and the cosine function represents odd dimensions within the positional encoding vector.

	  This periodic nature ensures that each position has a consistent encoding,
	  independent of the surrounding context.
	</p>

	<p>
	  Here’s how it works:
	</p>

	<span class='attention'>
	  SINUSOIDAL POSITIONAL ENCODING EQUATION
	</span>

	<ul>
	  <li>
		<strong>Sine Function</strong>: Used for even indices of the embedding vector.
	  </li>
	  <li>
		<strong>Cosine Function</strong>: Used for odd indices of the embedding vector.
	</ul>

	<p>
	  Hover over individual encoding values in the matrix above to
	  see how it's calculated using the sins and cosine functions.
	</p>
  </div> -->
		</div>
		<div class="article-subsection">
			<h3>Paso 4: embedding final</h3>
			<p>
				Por último, se suman las codificaciones de token y de posición para obtener la representación
				final del embedding. Esa representación combinada captura tanto el significado semántico de
				los tokens como su posición dentro de la secuencia de entrada.
			</p>
		</div>
	</div>

	<div class="article-section" data-click="article-transformer-block">
		<h2>El bloque Transformer</h2>

		<p>
			El núcleo del procesamiento está en el bloque Transformer, que se compone de multi-head
			self-attention y una capa de perceptrón multicapa. La mayoría de los modelos apila varios de
			estos bloques, uno detrás de otro. Las representaciones de los tokens van evolucionando capa a
			capa, del primer bloque al último, y así el modelo construye una comprensión cada vez más
			detallada de cada token. Ese enfoque en capas lleva a representaciones de orden superior de la
			entrada. El modelo GPT-2 (small) que estamos mirando tiene <code>12</code> bloques de este tipo.
		</p>
	</div>

	<div class="article-section" id="self-attention" data-click="article-attention">
		<h3>Multi-head self-attention</h3>
		<p>
			El mecanismo de self-attention le permite al modelo capturar relaciones entre los tokens de una
			secuencia, de modo que la representación de cada token quede influida por las de los demás.
			Tener varias heads de atención le permite considerar esas relaciones desde perspectivas
			distintas: una head puede capturar vínculos sintácticos de corto alcance mientras otra sigue el
			contexto semántico más amplio. En la sección que sigue recorremos paso a paso cómo se calcula la
			multi-head self-attention.
		</p>
		<div class="article-subsection-l2">
			<h4>Paso 1: matrices Query, Key y Value</h4>

			<div class="figure pt-10">
				<img src="./article_assets/QKV.png" width="80%" />
				<div class="text-xs">
					<Katex
						displayMode
						math={`
		QKV_{ij} = ( \\sum_{d=1}^{768} \\text{Embedding}_{i,d} \\cdot \\text{Weights}_{d,j}) + \\text{Bias}_j
		`}
					/>
				</div>
			</div>
			<div class="figure-caption">
				Figura <span class="attention">2</span>. Cálculo de las matrices Query, Key y Value a partir
				del embedding original.
			</div>

			<p>
				El vector de embedding de cada token se transforma en tres vectores:
				<span class="q-color">Query (Q)</span>,
				<span class="k-color">Key (K)</span> y
				<span class="v-color">Value (V)</span>. Esos vectores se obtienen multiplicando la matriz de
				embeddings de entrada por matrices de pesos aprendidas para
				<span class="q-color">Q</span>,
				<span class="k-color">K</span> y
				<span class="v-color">V</span>. Una analogía con una búsqueda web ayuda a construir la intuición
				detrás de estas matrices:
			</p>
			<ul>
				<li>
					<strong class="q-color font-medium">Query (Q)</strong> es el texto que se escribe en la barra
					del buscador. Es el token sobre el que se
					<em>"quiere encontrar más información"</em>.
				</li>
				<li>
					<strong class="k-color font-medium">Key (K)</strong> es el título de cada página en la ventana
					de resultados. Representa los tokens posibles a los que la query puede atender.
				</li>
				<li>
					<strong class="v-color font-medium">Value (V)</strong> es el contenido real de las páginas que
					se muestran. Una vez que el término de búsqueda (Query) se emparejó con los resultados relevantes
					(Key), lo que se quiere es el contenido (Value) de las páginas más pertinentes.
				</li>
			</ul>
			<p>
				Con esos valores Q, K y V, el modelo puede calcular los puntajes de atención, que determinan
				cuánta atención debe recibir cada token al generar las predicciones.
			</p>
		</div>
		<div class="article-subsection-l2">
			<h4>Paso 2: división en varias heads</h4>
			<p>
				Los vectores <span class="q-color">Query</span>, <span class="k-color">Key</span> y
				<span class="v-color">Value</span>
				se dividen en varias heads: en el caso de GPT-2 (small), en
				<code>12</code>. Cada head procesa un segmento de los embeddings de manera independiente y captura
				relaciones sintácticas y semánticas distintas. Ese diseño facilita el aprendizaje en paralelo de
				rasgos lingüísticos diversos y enriquece la capacidad representacional del modelo.
			</p>
		</div>
		<div class="article-subsection-l2">
			<h4>Paso 3: self-attention enmascarada</h4>
			<p>
				Dentro de cada head se hacen los cálculos de self-attention enmascarada. Ese mecanismo le
				permite al modelo generar secuencias concentrándose en las partes relevantes de la entrada,
				mientras le impide acceder a los tokens futuros.
			</p>

			<div class="figure">
				<img src="./article_assets/attention.png" width="80%" align="middle" />
			</div>
			<div class="figure-caption">
				Figura <span class="attention">3</span>. Uso de las matrices Query, Key y Value para
				calcular la self-attention enmascarada.
			</div>

			<ul>
				<li>
					<strong>Producto punto</strong>: el producto punto entre las matrices
					<span class="q-color">Query</span>
					y <span class="k-color">Key</span> determina el
					<strong>puntaje de atención</strong>, y produce una matriz cuadrada que refleja la relación
					entre todos los tokens de entrada.
				</li>
				<li>
					<strong>Escalado · máscara</strong>: los puntajes de atención se escalan y se aplica una
					máscara al triángulo superior de la matriz de atención, poniendo esos valores en menos
					infinito, para impedir que el modelo acceda a los tokens futuros. El modelo tiene que
					aprender a predecir el token siguiente sin "espiar" hacia adelante.
				</li>
				<li>
					<strong>Softmax · dropout</strong>: después del enmascarado y el escalado, los puntajes de
					atención se convierten en probabilidades con la operación softmax y, opcionalmente, se
					regularizan con dropout. Cada fila de la matriz suma uno e indica la relevancia de cada uno
					de los tokens que están a su izquierda.
				</li>
			</ul>
		</div>
		<div class="article-subsection-l2">
			<h4>Paso 4: salida y concatenación</h4>
			<p>
				El modelo toma los puntajes de self-attention enmascarada y los multiplica por la matriz
				<span class="v-color">Value</span> para obtener la
				<span class="purple-color">salida final</span>
				del mecanismo de self-attention. GPT-2 tiene <code>12</code> heads de self-attention, y cada una
				captura relaciones distintas entre los tokens. Las salidas de esas heads se concatenan y pasan
				por una proyección lineal.
			</p>
		</div>
	</div>

	<div class="article-section" id="article-activation" data-click="article-mlp">
		<h3>MLP: perceptrón multicapa</h3>

		<div class="figure">
			<img src="./article_assets/mlp.png" width="70%" align="middle" />
		</div>
		<div class="figure-caption">
			Figura <span class="attention">4</span>. La capa MLP proyecta las representaciones de la
			self-attention a dimensiones más altas para aumentar la capacidad representacional del modelo.
		</div>

		<p>
			Después de que las distintas heads de self-attention capturan las diversas relaciones entre los
			tokens de entrada, las salidas concatenadas pasan por la capa de perceptrón multicapa (MLP)
			para aumentar la capacidad representacional del modelo. El bloque MLP consiste en dos
			transformaciones lineales con una función de activación
			<a
				href="https://en.wikipedia.org/wiki/Rectified_linear_unit#Gaussian-error_linear_unit_(GELU)"
				>GELU</a
			> en el medio.
		</p>
		<p>
			La primera transformación lineal cuadruplica la dimensionalidad de la entrada, de <code
				>768</code
			>
			a
			<code>3072</code>. Esa expansión le permite al modelo proyectar las representaciones de los
			tokens a un espacio de mayor dimensión, donde puede capturar patrones más ricos y complejos que
			quizá no sean visibles en la dimensión original.
		</p>
		<p>
			La segunda transformación lineal reduce la dimensionalidad de vuelta al tamaño original de <code
				>768</code
			>. Esa compresión devuelve las representaciones a un tamaño manejable, conservando las
			transformaciones no lineales útiles que introdujo la expansión.
		</p>
		<p>
			A diferencia del mecanismo de self-attention, que integra información entre tokens, el MLP
			procesa cada token de manera independiente: simplemente mapea la representación de cada uno de
			un espacio a otro, enriqueciendo la capacidad general del modelo.
		</p>
	</div>

	<div class="article-section" id="article-prob" data-click="article-prob">
		<h2>Probabilidades de salida</h2>
		<p>
			Después de que la entrada atravesó todos los bloques Transformer, la salida pasa por la capa
			lineal final que la prepara para la predicción del token. Esa capa proyecta las
			representaciones finales a un espacio de <code>50,257</code>
			dimensiones, donde cada token del vocabulario tiene un valor asociado llamado
			<code>logit</code>. Cualquier token puede ser la palabra siguiente, así que este proceso
			permite ordenarlos según su verosimilitud de serlo. Después se aplica la función softmax para
			convertir los logits en una distribución de probabilidad que suma uno, y eso permite muestrear
			el token siguiente según su probabilidad.
		</p>

		<div class="figure py-5">
			<img src="./article_assets/softmax.png" width="70%" />
		</div>
		<div class="figure-caption">
			Figura <span class="attention">5</span>. A cada token del vocabulario se le asigna una
			probabilidad a partir de los logits que produce el modelo. Esas probabilidades determinan qué
			tan probable es que cada token sea la palabra siguiente de la secuencia.
		</div>

		<p id="article-temperature" data-click="article-temperature">
			El último paso es generar el token siguiente muestreando de esa distribución. El
			hiperparámetro <code>temperature</code>
			cumple un papel crítico. Matemáticamente es una operación muy simple: los logits que produce el
			modelo se dividen por la
			<code>temperature</code>:
		</p>

		<ul>
			<li>
				<code>temperature = 1</code>: dividir los logits por uno no tiene ningún efecto sobre la
				salida del softmax.
			</li>
			<li>
				<code>temperature &lt; 1</code>: una temperatura baja vuelve al modelo más confiado y
				determinista, porque afila la distribución de probabilidad y lleva a salidas más predecibles.
			</li>
			<li>
				<code>temperature &gt; 1</code>: una temperatura alta genera una distribución de
				probabilidad más plana, lo que permite más azar en el texto generado: lo que algunos llaman
				la <em>"creatividad"</em> del modelo.
			</li>
		</ul>

		<p id="article-sampling" data-click="article-sampling">
			Además, el muestreo se puede refinar con los parámetros <code>top-k</code>
			y
			<code>top-p</code>:
		</p>
		<ul>
			<li>
				<code>muestreo top-k</code>: limita los tokens candidatos a los k de mayor probabilidad y
				descarta las opciones menos probables.
			</li>
			<li>
				<code>muestreo top-p</code>: considera el conjunto más chico de tokens cuya probabilidad
				acumulada supera un umbral p, de modo que solo contribuyan los más probables sin perder
				diversidad.
			</li>
		</ul>
		<p>
			Ajustando <code>temperature</code>, <code>top-k</code> y <code>top-p</code> se puede equilibrar
			entre salidas deterministas y diversas, adaptando el comportamiento del modelo a cada
			necesidad.
		</p>
	</div>

	<div class="article-section" data-click="article-advanced-features">
		<h2>Componentes arquitectónicos auxiliares</h2>

		<p>
			Hay varios componentes auxiliares que mejoran el rendimiento de los Transformers. Son
			importantes para el desempeño general del modelo, pero no tanto para entender los conceptos
			centrales de la arquitectura. La normalización por capa, el dropout y las conexiones residuales
			son piezas cruciales, sobre todo durante el entrenamiento. La normalización por capa estabiliza
			el entrenamiento y ayuda a que el modelo converja más rápido. El dropout previene el
			sobreajuste desactivando neuronas al azar. Las conexiones residuales permiten que los
			gradientes fluyan directamente por la red y ayudan a evitar el problema del gradiente que se
			desvanece.
		</p>
		<div class="article-subsection" id="article-ln">
			<h3>Normalización por capa</h3>

			<p>
				La normalización por capa ayuda a estabilizar el entrenamiento y mejora la convergencia.
				Funciona normalizando las entradas a lo largo de las características, de modo que la media y
				la varianza de las activaciones se mantengan consistentes. Esa normalización mitiga problemas
				asociados al desplazamiento de covariables interno, le permite al modelo aprender con más
				eficacia y reduce su sensibilidad a los pesos iniciales. Se aplica dos veces en cada bloque
				Transformer: una antes del mecanismo de self-attention y otra antes de la capa MLP.
			</p>
		</div>
		<div class="article-subsection" id="article-dropout">
			<h3>Dropout</h3>

			<p>
				El dropout es una técnica de regularización que previene el sobreajuste en redes neuronales
				poniendo en cero, al azar, una fracción de los pesos del modelo durante el entrenamiento.
				Eso lo empuja a aprender características más robustas y reduce la dependencia de neuronas
				específicas, lo que ayuda a que la red generalice mejor a datos nuevos. Durante la
				inferencia, el dropout está desactivado: en la práctica eso equivale a usar un ensamble de
				las subredes entrenadas, lo que mejora el rendimiento del modelo.
			</p>
		</div>
		<div class="article-subsection" id="article-residual">
			<h3>Conexiones residuales</h3>

			<p>
				Las conexiones residuales se introdujeron por primera vez en el modelo ResNet, en 2015. Esa
				innovación arquitectónica revolucionó el deep learning al hacer posible el entrenamiento de
				redes neuronales muy profundas. En esencia, son atajos que saltean una o más capas y suman
				la entrada de una capa a su salida. Eso mitiga el problema del gradiente que se desvanece y
				facilita entrenar redes profundas con muchos bloques Transformer apilados. En GPT-2 se usan
				dos veces dentro de cada bloque: una antes del MLP y otra después, para que los gradientes
				fluyan con más facilidad y las capas tempranas reciban actualizaciones suficientes durante
				la retropropagación.
			</p>
		</div>
	</div>

	<div class="article-section" data-click="article-interactive-features">
		<h1>Funciones interactivas</h1>
		<p>
			Transformer Explainer está hecho para ser interactivo y permite explorar el funcionamiento
			interno del Transformer. Estas son algunas de las cosas con las que se puede jugar:
		</p>

		<ul>
			<li>
				<strong>Escribir una secuencia de texto propia</strong> para ver cómo el modelo la procesa y
				predice la palabra siguiente. Se pueden explorar los pesos de atención, los cálculos intermedios
				y ver cómo se calculan las probabilidades finales de salida.
			</li>
			<li>
				<strong>Usar el control de temperatura</strong> para regular el azar en las predicciones del
				modelo. Permite explorar cómo volver la salida más determinista o más creativa cambiando el valor
				de la temperatura.
			</li>
			<li>
				<strong>Elegir entre muestreo top-k y top-p</strong> para ajustar el comportamiento del muestreo
				durante la inferencia. Se pueden probar distintos valores y ver cómo cambia la distribución de
				probabilidad y cómo eso influye en las predicciones.
			</li>
			<li>
				<strong>Interactuar con los mapas de atención</strong> para ver en qué tokens de la secuencia
				de entrada se concentra el modelo. Al pasar el mouse por encima de un token se resaltan sus pesos
				de atención y se puede explorar cómo el modelo captura el contexto y las relaciones entre palabras.
			</li>
		</ul>
	</div>

	<div class="article-section" data-click="article-video">
		<h2>Video tutorial</h2>
		<div class="video-container">
			<iframe
				src="https://www.youtube.com/embed/ECR4oAwocjs"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			>
			</iframe>
		</div>
		<div class="figure-caption">El video tutorial original está en inglés.</div>
	</div>

	<div class="article-section" data-click="article-implementation">
		<h2>¿Cómo está implementado Transformer Explainer?</h2>
		<p>
			Transformer Explainer corre un modelo GPT-2 (small) en vivo directamente en el navegador. Ese
			modelo deriva de la implementación en PyTorch del GPT de Andrej Karpathy, el
			<a href="https://github.com/karpathy/nanoGPT" title="Github" target="_blank"
				>proyecto nanoGPT</a
			>, y fue convertido a
			<a href="https://onnxruntime.ai/" title="ONNX" target="_blank">ONNX Runtime</a>
			para poder ejecutarse sin fricción dentro del navegador. La interfaz está hecha en JavaScript, con
			<a href="https://kit.svelte.dev/" title="Svelte" target="_blank">Svelte</a>
			como framework de front-end y
			<a href="https://d3js.org/" title="D3" target="_blank">D3.js</a>
			para las visualizaciones dinámicas. Los valores numéricos se actualizan en vivo a medida que cambia
			la entrada del usuario.
		</p>
	</div>

	<div class="article-section" data-click="article-credit">
		<h2>¿Quién desarrolló Transformer Explainer?</h2>
		<p>
			Transformer Explainer fue creado por

			<a href="https://aereeeee.github.io/" target="_blank">Aeree Cho</a>,
			<a href="https://www.linkedin.com/in/chaeyeonggracekim/" target="_blank">Grace C. Kim</a>,
			<a href="https://alexkarpekov.com/" target="_blank">Alexander Karpekov</a>,
			<a href="https://alechelbling.com/" target="_blank">Alec Helbling</a>,
			<a href="https://zijie.wang/" target="_blank">Jay Wang</a>,
			<a href="https://seongmin.xyz/" target="_blank">Seongmin Lee</a>,
			<a href="https://bhoov.com/" target="_blank">Benjamin Hoover</a> y
			<a href="https://poloclub.github.io/polochau/" target="_blank">Polo Chau</a>

			en el Georgia Institute of Technology. Esta traducción al castellano no es obra de ellos.
		</p>
	</div>
</div>

<style lang="scss">
	a {
		color: theme('colors.blue.500');

		&:hover {
			color: theme('colors.blue.700');
		}
	}

	.bold-purple {
		color: theme('colors.purple.700');
		font-weight: bold;
	}

	code {
		color: theme('colors.gray.500');
		background-color: theme('colors.gray.50');
		font-family: theme('fontFamily.mono');
	}

	.q-color {
		color: theme('colors.blue.400');
	}

	.k-color {
		color: theme('colors.red.400');
	}

	.v-color {
		color: theme('colors.green.400');
	}

	.purple-color {
		color: theme('colors.purple.500');
	}

	.article-section {
		padding-bottom: 2rem;
	}
	.architecture-section {
		padding-top: 1rem;
	}
	.video-container {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 aspect ratio */
		height: 0;
		overflow: hidden;
		max-width: 100%;
		background: #000;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	#description {
		padding-bottom: 3rem;
		margin-left: auto;
		margin-right: auto;
		max-width: 78ch;
	}

	#description h1 {
		color: theme('colors.purple.700');
		font-size: 2.2rem;
		font-weight: 300;
		padding-top: 1rem;
	}

	#description h2 {
		// color: #444;
		color: theme('colors.purple.700');
		font-size: 2rem;
		font-weight: 300;
		padding-top: 1rem;
	}

	#description h3 {
		color: theme('colors.gray.700');
		font-size: 1.6rem;
		font-weight: 200;
		padding-top: 1rem;
	}

	#description h4 {
		color: theme('colors.gray.700');
		font-size: 1.6rem;
		font-weight: 200;
		padding-top: 1rem;
	}

	#description p {
		margin: 1rem 0;
	}

	#description p img {
		vertical-align: middle;
	}

	#description .figure-caption {
		font-size: 0.8rem;
		margin-top: 0.5rem;
		text-align: center;
		margin-bottom: 2rem;
	}

	#description ol {
		margin-left: 3rem;
		list-style-type: decimal;
	}

	#description li {
		margin: 0.6rem 0;
	}

	#description p,
	#description div,
	#description li {
		color: theme('colors.gray.600');
		line-height: 1.6;
	}

	#description small {
		font-size: 0.8rem;
	}

	#description ol li img {
		vertical-align: middle;
	}

	#description .video-link {
		color: theme('colors.blue.600');
		cursor: pointer;
		font-weight: normal;
		text-decoration: none;
	}

	#description ul {
		list-style-type: disc;
		margin-left: 2.5rem;
		margin-bottom: 1rem;
	}

	#description a:hover,
	#description .video-link:hover {
		text-decoration: underline;
	}

	.figure,
	.video {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
