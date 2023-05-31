var app = require("express")();
var config = require("./config.json");
const http = require("http");
const bodyParser = require("body-parser");
const { createPDF } = require("./formats/pdf");
const { createZPL } = require("./formats/zpl");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.post("/native-label/label", async (req, res) => {
  response = [];
  for (let label of req.body) {
    if (label?.label_format === "ZPL") {
      response.push({ label: await createZPL(label) });
    } else {
      response.push({ label: await createPDF(label) });
    }
  }
  res.send(response);
});
var server = http.createServer(app);
server.listen(config.port, function () {
  console.log("%s mockup app listening at %s://localhost:%s", config.moduleName, "http", config.port);
});
