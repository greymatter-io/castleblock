const frinkiac = require("frinkiac");
const fetch = require("node-fetch");

const handler = async function (request, h, env) {
  const { text } = request.payload;

  let mySearchURL = frinkiac.searchURL(text);
  let response = await fetch(mySearchURL);
  let results = await response.json();

  console.log("results", results);

  if (!results.length) {
    mySearchURL = frinkiac.searchURL("Nothing!");
    response = await fetch(mySearchURL);
    results = await response.json();
  }

  const selection = results[Math.floor(Math.random() * results.length)];
  //   const selection = results[0];

  const { Episode: episode, Id: id, Timestamp: timestamp } = selection;

  const memeURL = frinkiac.memeURL(episode, timestamp, text);

  return {
    parse: "full",
    response_type: "in_channel",
    text: memeURL,
    unfurl_media: true,
    unfurl_links: true,
  };
};

module.exports = handler;
