import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trackName, bpm, djId } = body;

    // Simula una latenza di rete/blockchain di 3 secondi
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Genera un finto hash di transazione
    const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const tokenId = Math.floor(Math.random() * 10000).toString();

    // Create a mock DJ if they don't exist (since we are seeding dynamically)
    const dj = await prisma.user.upsert({
      where: { email: 'dj@flowpulse.io' },
      update: {},
      create: {
        email: 'dj@flowpulse.io',
        name: 'FlowPulse DJ',
        role: 'DJ'
      }
    });

    // Save track to DB
    const newTrack = await prisma.track.create({
      data: {
        title: trackName || 'Untitled Track',
        bpm: bpm || 128,
        priceCoin: 50,
        tokenId,
        txHash,
        djId: dj.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Track minted successfully', 
      tokenId: newTrack.tokenId,
      txHash: newTrack.txHash,
      trackName: newTrack.title,
      status: 'Live on Marketplace'
    });
  } catch (error: any) {
    console.error("Minting Error:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
