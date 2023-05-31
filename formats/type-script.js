// import { CreateLabelResponse, DocumentFormat, DocumentType, LabelPackage } from "@shipengine/connect-carrier-api";
// import { ExternalServerError } from "@shipengine/connect-runtime";
// import { pdfToPng, PngPageOutput } from "pdf-to-png-converter";
// import { processApiRequest } from "../../api/api-communicator";
// import { CreateLabelApiResponse } from "../../api/models/create-label-api-response";
// import { addPackageBarcodeToLabel, generateBaseLabel, getLabelData } from "./label-generator";
// import { MaerskB2CCreateLabelRequest } from "./maersk-b2c-create-label-request";
// import { mapRequest } from "./map-request";
// import { mapResponse } from "./map-response";
// import { validate } from "./validate";
// import * as fs from "fs";
// import * as path from "path";

// export const CreateLabel = async (request: MaerskB2CCreateLabelRequest): Promise<CreateLabelResponse> => {
//   validate(request);
//   const thirdPartyRequest = mapRequest(request);

//   const response = await processApiRequest<CreateLabelApiResponse>(thirdPartyRequest);

//   if (response.Error?.Code) {
//     throw new ExternalServerError(`Error received from API: ${response.Error.Details.replace("\n", " ")}`);
//   }

//   const packagesData: LabelPackage[] = [];
//   const parcels = thirdPartyRequest.data?.Prealert?.Shipment?.ShipmentPackage;
//   const labelData = getLabelData(thirdPartyRequest.data, response);
//   const pdfDoc = await generateBaseLabel(labelData);

//   for (let parcelNumber = 0; parcelNumber < parcels.length; parcelNumber++) {
//     let result = await addPackageBarcodeToLabel(await pdfDoc.copy(), parcels[parcelNumber].PackageBarcode);
//     let format = DocumentFormat.Pdf;
//     //fs.writeFileSync(path.join(__dirname, "./output.pdf"), Buffer.from(result, "base64"));
//     if (request.label_format.toUpperCase() === DocumentFormat.Png) {
//       result = Buffer.from((await pdfToPng(Buffer.from(result, "base64")))[0].content).toString("base64");
//       format = DocumentFormat.Png;
//     }
//     packagesData.push({
//       tracking_number: `${response.Prealert.Shipment.OrderNumber}0${parcelNumber + 1}`,
//       documents: [
//         {
//           data: result,
//           format: format,
//           type: [DocumentType.Label]
//         }
//       ]
//     });
//   }

//   return mapResponse(request, response, packagesData);
// };

// let result = await addPackageBarcodeToLabel(await pdfDoc.copy(), parcels[parcelNumber].PackageBarcode);
//     let format = DocumentFormat.Pdf;
//     //fs.writeFileSync(path.join(__dirname, "./output.pdf"), Buffer.from(result, "base64"));
//     if (request.label_format.toUpperCase() === DocumentFormat.Png) {
//       result = Buffer.from((await pdfToPng(Buffer.from(result, "base64")))[0].content).toString("base64");
//       format = DocumentFormat.Png;
//     }
