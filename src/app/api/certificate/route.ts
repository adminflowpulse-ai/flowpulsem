import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyerName, artistName, trackTitle, trackId, date } = body;

    if (!buyerName || !artistName || !trackTitle) {
      return NextResponse.json(
        { error: 'Missing required fields (buyerName, artistName, trackTitle)' },
        { status: 400 }
      );
    }

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Embed standard fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Add a blank page
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Draw borders
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 2,
    });

    // Draw Certificate Title
    page.drawText('CERTIFICATO DI LICENZA SIAE', {
      x: 110,
      y: height - 70,
      size: 24,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });

    // Draw body text
    const textY = height - 130;
    const lineSpacing = 30;

    page.drawText(`Si certifica che il brano musicale:`, {
      x: 50,
      y: textY,
      size: 14,
      font: timesRomanFont,
    });

    page.drawText(`"${trackTitle}" di ${artistName}`, {
      x: 50,
      y: textY - lineSpacing,
      size: 16,
      font: timesRomanBoldFont,
    });

    page.drawText(`(Track ID: ${trackId || 'N/A'})`, {
      x: 50,
      y: textY - lineSpacing * 2,
      size: 12,
      font: timesRomanFont,
    });

    page.drawText(`è stato regolarmente acquistato e concesso in licenza d'uso a:`, {
      x: 50,
      y: textY - lineSpacing * 3.5,
      size: 14,
      font: timesRomanFont,
    });

    page.drawText(`${buyerName.toUpperCase()}`, {
      x: 50,
      y: textY - lineSpacing * 4.5,
      size: 18,
      font: timesRomanBoldFont,
      color: rgb(0, 0.4, 0.8),
    });

    page.drawText(`Data di emissione: ${date || new Date().toLocaleDateString('it-IT')}`, {
      x: 50,
      y: textY - lineSpacing * 6.5,
      size: 12,
      font: timesRomanFont,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a downloadable file response
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SIAE_Certificato_${trackTitle.replace(/ /g, '_')}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
