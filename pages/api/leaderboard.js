import Papa from "papaparse";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createObjectCsvStringifier } from "csv-writer";
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
const bucketName = BUCKET_NAME
let participants = [];
export default async function handler(req, res) {
  try {
    const fetchData = async () => {
      try {
        const response = await fetch("https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/test.csv");
          
          const csvText = await response.text();
          // console.log(csvText); 
        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (result) => {
            participants = result.data;
            participants.forEach((element) => {
              element[1] = Number(element[1]);
            });
          },
        });
        // console.log(participants)
      } catch (error) {
        console.error("Error reading CSV file:", error);
      }
    };

    await fetchData();

    if (!Array.isArray(participants) || participants.length === 0) {
      console.error("Participants array is not properly initialized:", participants);
      res.status(500).json({ error: "Participants data is invalid or empty" });
      return;
    }


      if (req.method === "POST") {
      const { name, score, blinkmode } = req.body;
      for (let i = 0; i <= participants.length; i++) {
        if (i === participants.length || participants[i][1] < score) {
          participants.splice(i, 0, [name, score, `${blinkmode}`]);
          break;
        }
      }
      const formattedParticipants = participants.map(([name, score, blinkmode]) => ({
        name,
        score: Number(score),
        blinkmode: blinkmode === "true",
      }));
      formattedParticipants.shift()
      // console.log(formattedParticipants)
      const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: "name", title: "Name" },
            { id: "score", title: "Score" },
            { id: "blinkmode", title: "Blink Mode" },
        ],
    });
      const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(formattedParticipants);
      // console.log(csvContent)
      const putObjectCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: "test.csv",
        Body: csvContent,
        ContentType: "text/csv",
    });
    // this.is.nat.defined()
    await s3Client.send(putObjectCommand);

      res.status(200).json({ message: "Data successfully written to CSV" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}