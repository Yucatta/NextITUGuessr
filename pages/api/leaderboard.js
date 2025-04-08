import { createObjectCsvWriter } from 'csv-writer';
import Papa from "papaparse";
import fs from "fs";
let participants = [];
export default async function handler(req, res) {
  try {
    const fetchData = async () => {
      try {
        const csvText = fs.readFileSync("C:/Users/Ahmet/Downloads/KMS/RAnd/itu-guessr/public/test.csv", "utf-8");

        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (result) => {
            participants = result.data;
            participants.forEach((element) => {
              element[1] = Number(element[1]); // Convert score to a number
            });
          },
        });
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

      const csvWriter = createObjectCsvWriter({
        path: "C:/Users/Ahmet/Downloads/KMS/RAnd/itu-guessr/public/test.csv",
        header: [
              { id: "name", title: "Name" },
              { id: "score", title: "Score" },
              { id: "blinkmode", title: "Blink Mode" },
            ],
      });

      const formattedParticipants = participants.map(([name, score, blinkmode]) => ({
        name,
        score: Number(score),
        blinkmode: blinkmode === "true",
      }));
      formattedParticipants.shift()
      await csvWriter.writeRecords(formattedParticipants);

      res.status(200).json({ message: "Data successfully written to CSV" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}