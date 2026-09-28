import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { audioUrl } = await request.json();

    if (!audioUrl) {
      return NextResponse.json({ error: 'Nessun URL audio fornito.' }, { status: 400 });
    }

    console.log('Avvio Oracolo AI su:', audioUrl);

    // Usa il modello htdemucs per separare le tracce
    const output = await replicate.run(
      "cjwbw/demucs:25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953",
      {
        input: {
          audio: audioUrl
        }
      }
    ) as any;

    console.log('Risultato Replicate:', output);

    // L'output tipico di questo modello è un oggetto con i link ai file separati
    // es: { bass: "url", drums: "url", other: "url", vocals: "url" }
    
    // Per sicurezza, normalizziamo la risposta
    let stems = output;
    if (typeof output === 'string') {
        // Se restituisce un solo URL (es. solo vocals)
        stems = { vocals: output };
    }

    return NextResponse.json({ success: true, stems });
  } catch (error: any) {
    console.error('Errore Oracolo AI:', error);
    return NextResponse.json({ error: error.message || 'Errore di elaborazione AI.' }, { status: 500 });
  }
}
