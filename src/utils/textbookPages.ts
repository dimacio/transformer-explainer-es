import { get } from 'svelte/store';
import {
	expandedBlock,
	weightPopover,
	isBoundingBoxActive,
	textbookCurrentPageId,
	isExpandOrCollapseRunning,
	isFetchingModel,
	userId
} from '~/store';
import {
	highlightElements,
	removeHighlightFromElements,
	applyTransformerBoundingHeight,
	resetElementsHeight,
	highlightAttentionPath,
	removeAttentionPathHighlight,
	removeFingerFromElements
} from '~/utils/textbook';
import { drawResidualLine } from './animation';

export interface TextbookPage {
	id: string;
	title: string;
	content?: string;
	component?: any;
	timeoutId?: number;
	on: () => void;
	out: () => void;
	complete?: () => void;
}

const { drawLine, removeLine } = drawResidualLine();

export const textPages: TextbookPage[] = [
	{
		id: 'what-is-transformer',
		title: '¿Qué es un Transformer?',
		content: `<p>El <strong>Transformer</strong> es la arquitectura que está detrás de la IA moderna y la que hace funcionar a modelos como ChatGPT y Gemini. Presentada en 2017, cambió por completo la forma en que la IA procesa información. La misma arquitectura se usa para entrenar sobre conjuntos de datos enormes y para la inferencia que genera las salidas. Aquí se usa GPT-2 (small): más simple que los modelos recientes, pero ideal para aprender los fundamentos.</p>
`,
		on: () => {},
		out: () => {}
	},
	{
		id: 'how-transformers-work',
		title: '¿Cómo funciona un Transformer?',
		content: `<p>Los Transformers no son magia: construyen el texto paso a paso preguntando:</p>
	<blockquote class="question">
		"¿Cuál es la palabra más probable que sigue a esta entrada?"
	</blockquote>
	<p>Aquí se explora cómo genera texto un modelo ya entrenado. Se puede escribir un texto propio o usar un ejemplo y después hacer clic en <strong>Generar</strong> para verlo en acción. Si el modelo todavía no está listo, conviene probar con otro <strong>Ejemplo</strong>.</p>`,
		on: () => {
			highlightElements(['.input-form']);
			if (get(isFetchingModel)) {
				highlightElements(['.input-form .select-button']);
			} else {
				highlightElements(['.input-form .generate-button']);
			}
		},
		out: () => {
			removeHighlightFromElements([
				'.input-form',
				'.input-form .select-button',
				'.input-form .generate-button'
			]);
		},
		complete: () => {
			removeFingerFromElements(['.input-form .select-button', '.input-form .generate-button']);
			if (get(textbookCurrentPageId) === 'how-transformers-work') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'how-transformers-work'
				});
			}
		}
	},
	{
		id: 'transformer-architecture',
		title: 'Arquitectura del Transformer',
		content:
			'<p>El Transformer tiene tres partes principales:</p><div class="numbered-list"><div class="numbered-item"><span class="number-circle">1</span><div class="item-content">Los <strong>embeddings</strong> convierten el texto en números.</div></div><div class="numbered-item"><span class="number-circle">2</span><div class="item-content">Los <strong>bloques Transformer</strong> mezclan información con self-attention y la refinan con un MLP.</div></div><div class="numbered-item"><span class="number-circle">3</span><div class="item-content">Las <strong>probabilidades</strong> determinan qué tan probable es cada token siguiente.</div></div></div>',
		on: () => {
			const selectors = [
				'.step.embedding',
				'.step.softmax',
				'.transformer-bounding',
				'.transformer-bounding-title'
			];
			highlightElements(selectors);
			applyTransformerBoundingHeight(['.softmax-bounding', '.embedding-bounding']);
		},
		out: () => {
			const selectors = [
				'.step.embedding',
				'.step.softmax',
				'.transformer-bounding',
				'.transformer-bounding-title'
			];
			removeHighlightFromElements(selectors);
			resetElementsHeight(['.softmax-bounding', '.embedding-bounding']);
		}
	},
	{
		id: 'embedding',
		title: 'Embedding',
		content: `<p>Antes de poder usar un texto, el Transformer lo divide en unidades pequeñas y representa cada una como una lista de números (un vector). Ese proceso se llama <strong>embedding</strong>, y el término designa tanto al proceso como al vector resultante.</p><p>En esta herramienta cada vector aparece como un rectángulo; al pasar el mouse por encima se muestra su tamaño.</p>`,
		on: () => {
			highlightElements(['.step.embedding .title']);
		},
		out: () => {
			removeHighlightFromElements(['.step.embedding .title']);
		},
		complete: () => {
			removeFingerFromElements(['.step.embedding .title']);
			if (get(textbookCurrentPageId) === 'embedding') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'embedding'
				});
			}
		}
	},
	{
		id: 'token-embedding',
		title: 'Embedding de token',
		content: `<p>La <strong>tokenización</strong> divide el texto en tokens: unidades pequeñas, como palabras o partes de palabras. GPT-2 (small) tiene un vocabulario de 50.257 tokens, cada uno con su ID.</p><p>En el <strong>embedding de token</strong>, cada token se asocia a un vector de 768 números de una tabla de búsqueda. Esos vectores se aprenden durante el entrenamiento para representar el significado de cada token.</p>`,
		on: function () {
			const selectors = [
				'.token-column .column.token-string',
				'.token-column .column.token-embedding'
			];
			if (get(expandedBlock).id !== 'embedding') {
				expandedBlock.set({ id: 'embedding' });
				this.timeoutId = setTimeout(() => {
					highlightElements(selectors);
				}, 500);
			} else {
				highlightElements(selectors);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			const selectors = [
				'.token-column .column.token-string',
				'.token-column .column.token-embedding'
			];
			removeHighlightFromElements(selectors);
			if (get(textbookCurrentPageId) !== 'positional-encoding') expandedBlock.set({ id: null });
		}
	},
	{
		id: 'positional-encoding',
		title: 'Codificación posicional',
		content: `<p>El orden de las palabras importa: la <strong>codificación posicional</strong> le da a cada token información sobre su lugar en la secuencia.</p><p>GPT-2 suma un embedding posicional aprendido al del token. Los modelos nuevos usan otros métodos, como RoPE, que codifica la posición rotando vectores. Todos buscan que el modelo entienda el orden.</p>`,
		on: function () {
			const selectors = [
				'.token-column .column.position-embedding',
				'.token-column .column.symbol'
			];
			if (get(expandedBlock).id !== 'embedding') {
				expandedBlock.set({ id: 'embedding' });
				this.timeoutId = setTimeout(() => {
					highlightElements(selectors);
				}, 500);
			} else {
				highlightElements(selectors);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			const selectors = [
				'.token-column .column.position-embedding',
				'.token-column .column.symbol'
			];
			removeHighlightFromElements(selectors);
			if (get(textbookCurrentPageId) !== 'token-embedding') expandedBlock.set({ id: null });
		}
	},
	{
		id: 'blocks',
		title: 'Bloques Transformer repetidos',
		content: `<p>El <strong>bloque Transformer</strong> es la unidad de procesamiento del modelo. Tiene dos partes:</p><ul><li><strong>Multi-head self-attention</strong>: permite que los tokens compartan información</li><li><strong>MLP</strong>: refina los detalles de cada token</li></ul><p>Los modelos apilan muchos bloques: cada token se enriquece al atravesarlos. GPT-2 (small) tiene 12.</p>`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements([
						'.transformer-bounding',
						'.step.transformer-blocks .guide',
						'.attention > .title',
						'.mlp > .title'
					]);
					highlightElements(['.transformer-bounding-title'], 'textbook-button-highlight');
					isBoundingBoxActive.set(true);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.transformer-bounding',
				'.step.transformer-blocks .guide',
				'.attention > .title',
				'.mlp > .title'
			]);
			removeHighlightFromElements(['.transformer-bounding-title'], 'textbook-button-highlight');
			isBoundingBoxActive.set(false);
		},
		complete: () => {
			removeFingerFromElements(['.transformer-bounding-title']);
			if (get(textbookCurrentPageId) === 'blocks') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'blocks'
				});
			}
		}
	},
	{
		id: 'self-attention',
		title: 'Multi-head self-attention',
		content:
			'<p>La <strong>self-attention</strong> permite que el modelo decida qué partes de la entrada son más relevantes para cada token. Así captura significado y relaciones, incluso entre palabras muy alejadas entre sí.</p><p>En su forma <strong>multi-head</strong>, el modelo ejecuta varios procesos de atención en paralelo y cada uno se concentra en patrones distintos del texto.</p>',
		on: () => {
			highlightElements(['.step.attention']);
		},
		out: () => {
			removeHighlightFromElements(['.step.attention']);
		}
	},
	{
		id: 'qkv',
		title: 'Query, Key, Value',
		content: `
	<p>Para aplicar self-attention, el embedding de cada token se transforma en 
  <span class="highlight">tres embeddings nuevos</span>: 
  <span class="blue">Query</span>,  
  <span class="red">Key</span> y  
  <span class="green">Value</span>.
  Para eso se aplican pesos y sesgos distintos a cada embedding, parámetros que se optimizan durante el entrenamiento.</p>

<p>Una vez creados, las <span class="blue">Queries</span> se comparan con las <span class="red">Keys</span> para medir la relevancia, y esa relevancia se usa para ponderar los <span class="green">Values</span>.</p>
`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['g.path-group.qkv', '.step.qkv .qkv-column']);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['g.path-group.qkv', '.step.qkv .qkv-column']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.step.qkv .qkv-column']);
			if (get(textbookCurrentPageId) === 'qkv') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'qkv'
				});
			}
		}
	},

	{
		id: 'multi-head',
		title: 'Multi-head',
		content:
			'<p>Después de crear los embeddings <span class="blue">Q</span>, <span class="red">K</span> y <span class="green">V</span>, el modelo los divide en varias <strong>heads</strong> (12 en GPT-2 small). Cada head trabaja con su propio conjunto reducido de <span class="blue">Q</span>/<span class="red">K</span>/<span class="green">V</span> y se concentra en patrones distintos del texto: gramática, significado o vínculos de larga distancia.</p><p>Tener varias heads le permite al modelo aprender muchos tipos de relaciones en paralelo, y eso enriquece su comprensión.</p>',
		on: () => {
			highlightAttentionPath();
			highlightElements(['.multi-head .head-title']);
		},
		out: () => {
			removeAttentionPathHighlight();
			removeHighlightFromElements(['.multi-head .head-title']);
		},
		complete: () => {
			removeFingerFromElements(['.multi-head .head-title']);
			if (get(textbookCurrentPageId) === 'multi-head') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'multi-head'
				});
			}
		}
	},
	{
		id: 'masked-self-attention',
		title: 'Self-attention enmascarada',
		content: `<p>Dentro de cada head, el modelo decide cuánto atiende cada token a los demás:</p><ul><li><strong>Producto punto</strong>: multiplica los vectores <span class="blue">Query</span>/<span class="red">Key</span> número a número y los suma, dando los <span class="purple">puntajes de atención</span>.</li><li><strong>Máscara</strong>: oculta los tokens futuros para que no pueda espiar hacia adelante.</li><li><strong>Softmax</strong>: convierte los puntajes en probabilidades; cada fila suma 1.</li></ul>`,
		on: () => {
			highlightAttentionPath();
			highlightElements(['.attention-matrix.attention-result']);
		},
		out: () => {
			removeAttentionPathHighlight();
			removeHighlightFromElements(['.attention-matrix.attention-result']);
			expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.attention-matrix.attention-result']);
			if (get(textbookCurrentPageId) === 'masked-self-attention') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'masked-self-attention'
				});
			}
		}
	},
	{
		id: 'output-concatenation',
		title: 'Salida de atención y concatenación',
		content:
			'<p>Cada head <span class="highlight">multiplica sus <span class="purple">puntajes de atención</span> por los embeddings <span class="green">Value</span> para producir su salida de atención</span>: una representación refinada de cada token, ya considerando el contexto.</p><p>GPT-2 (small) produce 12 salidas de este tipo, que se concatenan para formar un único vector del tamaño original (768 números).</p>',
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['path.to-attention-out.value-to-out', '.attention .column.out']);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['path.to-attention-out.value-to-out', '.attention .column.out']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.attention .column.out']);
			if (get(textbookCurrentPageId) === 'output-concatenation') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-concatenation'
				});
			}
		}
	},
	{
		id: 'mlp',
		title: 'MLP (perceptrón multicapa)',
		content:
			'<p>La salida de atención atraviesa un <strong>MLP</strong> que refina cada token. Una capa lineal cambia los valores y el tamaño del embedding con pesos y sesgos aprendidos, y una activación no lineal decide cuánto pasa de cada valor.</p><p>GPT-2 usa <strong>GELU</strong>, que deja pasar parcialmente los valores pequeños y del todo los grandes: así captura patrones sutiles y marcados.</p>',
		on: () => {
			highlightElements(['.step.mlp', '.operation-col.activation']);
		},
		out: () => {
			removeHighlightFromElements(['.step.mlp', '.operation-col.activation']);
		}
	},

	{
		id: 'output-logit',
		title: 'Logits de salida',
		content: `<p>Después de todos los bloques Transformer, el embedding de salida del último token —enriquecido con el contexto de todos los tokens anteriores— se multiplica por los pesos aprendidos de una capa final.</p><p>Eso produce los <strong>logits</strong>: 50.257 números, uno por cada token del vocabulario de GPT-2, que indican qué tan probable es que cada token venga a continuación.</p>`,
		on: () => {
			highlightElements(['g.path-group.softmax', '.column.final']);
		},
		out: () => {
			removeHighlightFromElements(['g.path-group.softmax', '.column.final']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.column.final']);
			if (get(textbookCurrentPageId) === 'output-logit') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-logit'
				});
			}
		}
	},
	{
		id: 'output-probabilities',
		title: 'Probabilidades',
		content:
			'<p>Los logits son apenas puntajes crudos. Para interpretarlos más fácilmente se convierten en <strong>probabilidades</strong> entre 0 y 1 que suman 1 en total. Eso indica qué tan probable es que cada token sea la próxima palabra.</p><p>En lugar de elegir siempre el token de mayor probabilidad, se pueden usar distintas estrategias de selección para equilibrar previsibilidad y creatividad en el texto generado.</p>',
		on: () => {
			highlightElements(['.step.softmax .title']);
		},
		out: () => {
			removeHighlightFromElements(['.step.softmax .title']);
		},
		complete: () => {
			removeFingerFromElements(['.step.softmax .title']);
			if (get(textbookCurrentPageId) === 'output-probabilities') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-probabilities'
				});
			}
		}
	},
	{
		id: 'temperature',
		title: 'Temperatura',
		content:
			'<p>La <strong>temperatura</strong> escala los logits antes de convertirlos en probabilidades. Una <strong>temperatura baja</strong> (por ejemplo, 0.2) agranda aún más los logits grandes y achica los chicos: favorece a los tokens mejor puntuados y lleva a <strong>elecciones más predecibles</strong>. Una <strong>temperatura alta</strong> (1.0 o más) aplana las diferencias, vuelve más competitivos a los tokens menos probables y lleva a <strong>salidas más creativas</strong>.</p>',
		on: function () {
			if (get(expandedBlock).id !== 'softmax') {
				expandedBlock.set({ id: 'softmax' });
				this.timeoutId = setTimeout(() => {
					highlightElements([
						'.formula-step.scaled',
						'.title-box.scaled',
						'.content-box.scaled',
						'.temperature-input'
					]);
				}, 500);
			} else {
				highlightElements([
					'.formula-step.scaled',
					'.title-box.scaled',
					'.content-box.scaled',
					'.temperature-input'
				]);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.formula-step.scaled',
				'.title-box.scaled',
				'.temperature-input',
				'.content-box.scaled'
			]);
			if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
				expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.temperature-input']);
			if (get(textbookCurrentPageId) === 'temperature') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'temperature'
				});
			}
		}
	},
	{
		id: 'sampling',
		title: 'Estrategia de muestreo',
		content:
			'<p>Falta una estrategia para elegir el token siguiente. Las más comunes: la búsqueda greedy elige el de mayor probabilidad; <strong>top-k</strong> conserva solo los k más probables; <strong>top-p</strong>, el conjunto más chico cuya probabilidad total llega a p.</p><p>Después softmax convierte los logits restantes en probabilidades y se elige un token al azar del conjunto permitido.</p>',
		on: function () {
			if (get(expandedBlock).id !== 'softmax') {
				expandedBlock.set({ id: 'softmax' });
				this.timeoutId = setTimeout(() => {
					highlightElements([
						'.formula-step.sampling',
						'.title-box.sampling',
						'.sampling-input',
						'.content-box.sampling'
					]);
				}, 500);
			} else {
				highlightElements([
					'.formula-step.sampling',
					'.title-box.sampling',
					'.sampling-input',
					'.content-box.sampling'
				]);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.formula-step.sampling',
				'.title-box.sampling',
				'.sampling-input',
				'.content-box.sampling'
			]);
			if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
				expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.sampling-input']);
			if (get(textbookCurrentPageId) === 'sampling') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'sampling'
				});
			}
		}
	},
	{
		id: 'residual',
		title: 'Conexión residual',
		content: `<p>Los Transformers tienen componentes auxiliares que mejoran el rendimiento del modelo. Por ejemplo, una <strong>conexión residual</strong> suma la entrada de una capa a su salida, y así evita que la información se diluya al atravesar muchos bloques. En GPT-2 se usa dos veces por bloque, lo que permite entrenar pilas más profundas de manera efectiva.</p>`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['.operation-col.residual', '.residual-start']);
					drawLine();
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['.operation-col.residual', '.residual-start']);
			removeLine();
		}
	},
	{
		id: 'layer-normalization',
		title: 'Normalización por capa',
		content: `<p>La <strong>normalización por capa</strong> estabiliza tanto el entrenamiento como la inferencia: ajusta los números de entrada para que su media y su varianza se mantengan consistentes. Eso lo vuelve menos sensible a sus pesos iniciales y lo ayuda a aprender mejor. En GPT-2 se aplica antes de la self-attention, antes del MLP y antes de la salida final.</p>`,
		on: () => {
			highlightElements(['.operation-col.ln']);
		},
		out: () => {
			removeHighlightFromElements(['.operation-col.ln']);
		}
	},
	{
		id: 'dropout',
		title: 'Dropout',
		content: `<p>Durante el entrenamiento, el <strong>dropout</strong> apaga al azar algunas conexiones entre números para que el modelo no se sobreajuste a patrones específicos, y así aprende características que generalizan mejor. GPT-2 lo usa, pero los LLM más nuevos suelen omitirlo: entrenan con conjuntos enormes y el sobreajuste es menos problemático. En inferencia está desactivado.</p>`,
		on: () => {
			highlightElements(['.operation-col.dropout']);
		},
		out: () => {
			removeHighlightFromElements(['.operation-col.dropout']);
		}
	}
	// {
	// 	id: 'final',
	// 	title: `Let's explore!`,
	// 	content: '',
	// 	on: () => {},
	// 	out: () => {}
	// }
];
