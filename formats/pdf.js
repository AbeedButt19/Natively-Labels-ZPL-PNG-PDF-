const { PDFDocument, PDFPage } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");
const { readFileSync } = require("fs");
const path = require("path");
const { DOMImplementation } = require("xmldom");
const JsBarcode = require("jsbarcode");
const { createPNG } = require("./png");

module.exports = {
  createPDF: async (label) => {
    const abc = label?.text;
    const doc = await PDFDocument.create();
    let width = 288;
    let height = 432;
    let page = doc.addPage([width, height]);
    const jpgUrl = await readFileSync(path.join(__dirname, "../maersk.png"));
    const jpgImage = await doc.embedPng(jpgUrl);
    const pngDims = jpgImage.scale(0.05);

    page.drawImage(jpgImage, {
      x: 10,
      y: 346,
      width: pngDims.width,
      height: pngDims.height
    });

    page.drawText(abc, {
      size: 12,
      x: 15,
      y: 340
    });

    page.drawText("asdfghjk", {
      size: 10,
      x: 15,
      y: 327
    });

    page.drawText("sasdf", {
      size: 10,
      x: 200,
      y: 340
    });
    doc.registerFontkit(fontkit);
    page.drawText("barcodeNumber", {
      size: 12,
      x: (width - 84.4) / 2,
      y: 30
    });
    page.drawRectangle({
      x: 5,
      y: 5,
      width: 278,
      height: 422,
      opacity: 0,
      borderWidth: 0.05,
      borderOpacity: 0.75
    });

    page.drawLine({
      start: { x: 5, y: 175 },
      end: { x: 282, y: 175 },
      thickness: 0.05,
      opacity: 0.75
    });
    page.drawLine({
      start: { x: 96.66, y: 175 },
      end: { x: 96.66, y: 125 },
      thickness: 0.05,
      opacity: 0.75
    });
    page.drawLine({
      start: { x: 193.33, y: 175 },
      end: { x: 193.33, y: 125 },
      thickness: 0.05,
      opacity: 0.75
    });
    page.drawLine({
      start: { x: 5, y: 125 },
      end: { x: 282, y: 125 },
      thickness: 0.05,
      opacity: 0.75
    });
    drawBarcode(page, 51, height - 390, 200, 70, "consignmentNumber", {
      format: "CODE128",
      displayValue: false
    });
    if (label?.label_format === "PDF") {
      return await doc.saveAsBase64();
    } else {
      return await createPNG(Buffer.from(await doc.save()));
    }
  }
};

const drawBarcode = (doc, x, y, width, height, dataString, options) => {
  options.displayValue = false;
  const document = new DOMImplementation().createDocument("http://www.w3.org/1999/xhtml", "html", null);
  const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  options.xmlDocument = document;
  JsBarcode(svgNode, dataString, options);
  const rects = Object.values(svgNode.childNodes[1].childNodes);
  const svgWidth = parseInt(svgNode.getAttribute("width").replace("px", ""), 10);
  const svgHeight = parseInt(svgNode.getAttribute("height").replace("px", ""), 10);
  const rectsToDraw = [];

  for (const rect of rects) {
    if (rect.nodeName === "rect") {
      const rec = {};
      for (const a of Object.values(rect.attributes)) {
        rec[a.nodeName] = a.value;
      }
      rectsToDraw.push(rec);
    }
  }
  const heightFactor = height / svgHeight;
  const widthFactor = width / svgWidth;

  for (const rect of rectsToDraw) {
    doc.drawRectangle({
      x: x + rect["x"] * widthFactor,
      y: y + rect["y"] * heightFactor,
      width: rect["width"] * widthFactor,
      height: rect["height"] * heightFactor
    });
  }
};
