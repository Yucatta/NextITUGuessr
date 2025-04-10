import csvParser from "csv-parser";
import { S3Client,GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createObjectCsvStringifier } from "csv-writer";
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
const bucketName = BUCKET_NAME
const fileName = "test.csv"
let csvData = [];

export default async function handler(req, res) {
  try {
    const fetchData = async () => {
      try {
        // const getcsvfile = async () => {
        //   try{

        //     const response = await fetch("https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/test.csv");
        //     const csvText = await response.text();
        //     return csvText
        //   }catch(){

        //   }
        // }


        const getObjectCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: fileName,
      });
      const response = await s3Client.send(getObjectCommand);
      const streamToString = promisify(stream.pipeline);
      // console.log(response.Body.pipe(csvParser()))
      await streamToString(
          response.Body.pipe(csvParser()),
          new stream.Writable({
              objectMode: true,
              write(chunk, encoding, callback) {
                  csvData.push(chunk);
                  callback();
                  if(response === "a"){
                    console.log(encoding)
                  }
              },
          })
      );

      // console.log(csvData)
      csvData.forEach(element => {
        element.Score = Number(element.Score)
      });



        // const response = await fetch("https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/test.csv");
        //     const csvText = await response.text();
        // Papa.parse(csvText, {
        //   header: false,
        //   skipEmptyLines: true,
        //   complete: (result) => {
        //     participants = result.data;
        //     participants.forEach((element) => {
        //       element[1] = Number(element[1]);
        //     });
        //   },
        // });
      } catch (error) {
        console.error("Error reading CSV file:", error);
      }
    };

    await fetchData();

    // if (!Array.isArray(participants) || participants.length === 0) {
    //   console.error("Participants array is not properly initialized:", participants);
    //   res.status(500).json({ error: "Participants data is invalid or empty" });
    //   return;
    // }


      if (req.method === "POST") {
      const { name, score, blinkmode } = req.body;
      // console.log(csvData.slice(50,103))

      for (let i = 0; i <= csvData.length; i++) {
        if (i === csvData.length || csvData[i].Score < score) {
          csvData.splice(i, 0,{ Name: name, Score: score, 'Blink Mode': `${blinkmode}`});
          break;
        }
      }

      // console.log(csvData)

    //   const formattedParticipants = participants.map(([name, score, blinkmode]) => ({
    //     name,
    //     score: Number(score),
    //     blinkmode: blinkmode === "true",
    //   }));
    //   formattedParticipants.shift()
      // console.log(formattedParticipants)


      const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: "Name", title: "Name" },
            { id: "Score", title: "Score" },
            { id: "Blink Mode", title: "Blink Mode" },
        ],
    });

    // console.log(csvStringifier.stringifyRecords(csvData))
      const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
      // console.log(csvContent)
      const putObjectCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: "test.csv",
        Body: csvContent,
        ContentType: "text/csv",
    });
    // this.is.nat.defined()
    console.log(csvContent)
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