import csvParser from "csv-parser";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import stream from "stream";
import { promisify } from "util";
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
const s3Client = new S3Client({
  region: "auto",
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});
const bucketName = BUCKET_NAME;
const fileName = "test.csv";
let csvData = [];

export default async function handler(req, res) {
  if (req.method === "GET") {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const response = await s3Client.send(getObjectCommand);
    const streamToString = promisify(stream.pipeline);
    await streamToString(
      response.Body.pipe(csvParser()),
      new stream.Writable({
        objectMode: true,
        write(chunk, encoding, callback) {
          csvData.push(chunk);
          callback();
          if (response === "a") {
            console.log(encoding);
          }
        },
      })
    );
    csvData.forEach((element) => {
      element.Score = Number(element.Score);
    });
    for (let i = 0; i < csvData.length; i++) {
      csvData[i] = [
        csvData[i].Name,
        csvData[i].Score,
        csvData[i]["Blink Mode"],
      ];
    }
    res
      .status(200)
      .json({ message: "Data successfully written to CSV", csvData: csvData });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
