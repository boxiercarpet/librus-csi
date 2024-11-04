const { LibrusAPI } = require("librus-api-rewrited");
const express = require("express");
const dotenv = require("dotenv");
const ics = require("ics");
const { getEvents } = require("./utils");
dotenv.config();

const librusApi = new LibrusAPI();
const app = express();

app.get("/calendar", async (req, res) => {
  let tokenCreated = false;

  try {
    tokenCreated = await librusApi.mkToken(
      process.env.LOGIN,
      process.env.PASSWORD
    );
  } catch (error) {
    console.error("Error:", error);
  }

  if (!tokenCreated) {
    res.send("Token not created");
    return;
  }

  const entries = await getEvents(librusApi);

  const { error, value } = ics.createEvents(entries);

  if (error) {
    console.error("Error:", error);
  }

  res.send(value);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
