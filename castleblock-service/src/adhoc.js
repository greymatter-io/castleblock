import fs from "fs";

let adhocClients = [];
export function updateClients(appPath) {
  console.log("ADHOC Clients:", adhocClients.length);
  adhocClients = adhocClients
    .map((c) => {
      console.log("cinfo", c.request.info.referrer);
      if (c.request.info.referrer.includes(appPath)) {
        //Tell client to refresh.
        c.event({
          data: "refresh",
        });
        return null;
      }
      return c;
    })
    .filter(Boolean);

  console.log("ADHOC Clients:", adhocClients.length);
}
export function injectHotReloadClient(path) {
  let htmlFile = fs.readFileSync(path);

  //insert hot-reloading client script
  htmlFile = `${htmlFile}`.replace(
    "</body>",
    `<script>
    var source = new EventSource('/refresh');source.onmessage = function(e) { console.log(e); if(e.data=="refresh"){ location.reload();}}</script></body>`
  );

  //save file
  fs.writeFileSync(path, htmlFile);
}

export function addClient(client) {
  adhocClients = adhocClients.concat([client]);
  console.log("ADHOC Clients:", adhocClients.length);
}

export function removeClients(name, version) {
  console.log(`REMOVING: ${name} version: ${version}`);
  adhocClients = adhocClients.filter(
    (c) => !c.request.info.referrer.includes(`${name}/${version}`)
  );

  console.log("ADHOC Clients:", adhocClients.length);
}

export default {
  injectHotReloadClient,
  updateClients,
  removeClients,
  addClient,
};
