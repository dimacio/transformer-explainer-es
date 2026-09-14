import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';

const SALIDA = process.argv[2];
fs.mkdirSync(SALIDA, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1800, height: 1050 }, deviceScaleFactor: 2 });
await p.goto('https://dimacio.github.io/transformer-explainer-es/app/', {
	waitUntil: 'domcontentloaded',
	timeout: 90000
});
await p.waitForSelector('.text-card', { timeout: 90000 });
process.stdout.write('esperando el modelo');
for (let i = 0; i < 90; i++) {
	if (await p.evaluate(() => { const x = document.querySelector('button.generate-button'); return !!x && !x.disabled; })) break;
	process.stdout.write('.');
	await p.waitForTimeout(2000);
}
console.log(' listo');
await p.click('button.generate-button');
await p.waitForTimeout(9000);
await p.evaluate(() => document.querySelector('.text-card .close-btn')?.click());
await p.waitForTimeout(1200);

/** Caja que envuelve el contenido real de un selector (sus hijos visibles). */
async function caja(sel, pad = 14) {
	return p.evaluate(([s, pad]) => {
		const el = document.querySelector(s);
		if (!el) return null;
		let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
		const mirar = (r) => {
			if (r.width < 3 || r.height < 3) return;
			// Los contenedores de layout ocupan toda la altura y estiran la caja
			// hasta dejar la mitad del recorte en blanco. Se ignoran.
			if (r.height > window.innerHeight * 0.86) return;
			x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
			x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
		};
		mirar(el.getBoundingClientRect());
		el.querySelectorAll('*').forEach((c) => mirar(c.getBoundingClientRect()));
		x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
		x1 = Math.min(window.innerWidth, x1 + pad);
		y1 = Math.min(window.innerHeight, y1 + pad);
		return { x: Math.round(x0), y: Math.round(y0), width: Math.round(x1 - x0), height: Math.round(y1 - y0) };
	}, [sel, pad]);
}

async function guardar(nombre, clip, ancho = 1100) {
	const crudo = `${SALIDA}/_${nombre}.png`;
	await p.screenshot({ path: crudo, clip });
	const info = await sharp(crudo).resize({ width: ancho, withoutEnlargement: true })
		.jpeg({ quality: 74, mozjpeg: true }).toFile(`${SALIDA}/${nombre}.jpg`);
	fs.unlinkSync(crudo);
	console.log(`  ${nombre.padEnd(22)} ${clip.width}x${clip.height} -> ${info.width}x${info.height}  ${(info.size/1024).toFixed(0)} KB`);
}

console.log('capturas:');

// 1. el recorrido completo
await guardar('vista-general', { x: 0, y: 0, width: 1800, height: 780 }, 1500);

// 2. tokenizacion + embedding
await guardar('embedding', await caja('.step.embedding', 18), 620);

// 3. atencion completa (Q/K/V, heads, matriz, salida)
await guardar('atencion', await caja('.step.attention', 16), 1200);

// 4. una head sola, con sus matrices
await guardar('multi-head', await caja('.multi-head', 14), 900);

// 5. el MLP
await guardar('mlp', await caja('.step.mlp', 16), 900);

// 6. probabilidades: solo la parte de arriba de la columna
{
	const c = await caja('.step.softmax', 16);
	await guardar('probabilidades', { ...c, height: Math.min(c.height, 680) }, 560);
}

// 7. el embedding expandido, que muestra el detalle por dentro
await p.click('[data-click="embedding-step-title"]');
await p.waitForTimeout(2200);
await guardar('embedding-detalle', { x: 0, y: 60, width: 1500, height: 640 }, 1300);
await p.keyboard.press('Escape');
await p.waitForTimeout(1500);

console.log('total:', fs.readdirSync(SALIDA).filter(f => f.endsWith('.jpg')).length, 'imagenes');
await b.close();
