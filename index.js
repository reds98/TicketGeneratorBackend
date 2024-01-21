const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const cors = require('cors');

const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
  const { nombre, fecha,hora } = req.body;

  try {
    const existingPdfBytes = fs.readFileSync('entradaSENTI34.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPage(0);

    page.drawText(fecha, { x: 43, y: 42, size: 10, color: rgb(0, 0, 0) });
    page.drawText(hora, { x: 140, y: 42, size: 10, color: rgb(0, 0, 0) });
    page.drawText(nombre, { x: 80, y: 23, size: 10, color: rgb(0, 0, 0) });
   

    const pdfBytes = await pdfDoc.save();

    // Guardar el PDF modificado temporalmente
    const tempPdfPath = path.join(__dirname, 'tempPdf.pdf');
    fs.writeFileSync(tempPdfPath, pdfBytes);

    // Enviar el archivo PDF como una descarga
    res.download(tempPdfPath, 'pdfModificado.pdf', (err) => {
      if (err) {
        // Manejar errores de envío
        res.status(500).send('Error al enviar el archivo PDF');
      }
      // Eliminar el archivo temporal después de enviarlo
      fs.unlinkSync(tempPdfPath);
    });
  } catch (error) {
    res.status(500).send('Error al generar el PDF');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
