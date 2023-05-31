const { Poppler } = require("node-poppler");
const nodeHtmlToImage = require("node-html-to-image");

module.exports = {
  createPNG: async (labelBuffer) => {
    let labelBodyTemplate = `<html><head><style>* { width: 384px;height: 576px}</style></head><body><img src="{{imageSource}}" alt=""></body></html>`;
    const poppler = new Poppler();
    const options = {
      firstPageToConvert: 1,
      lastPageToConvert: 1,
      svgFile: true
    };
    let svgImage = await poppler.pdfToCairo(labelBuffer, undefined, options);
    let image = await nodeHtmlToImage({
      html: labelBodyTemplate,
      content: { imageSource: "data:image/svg+xml;base64," + Buffer.from(svgImage).toString("base64") }
    });

    let png = Buffer.from(image).toString("base64");

    return png;
  }
};
