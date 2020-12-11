const dgram = require("dgram");
const CryptoJS = require("crypto-js");
const ip = require("ip");

const client = dgram.createSocket("udp4");

const port = 4545;
const host = ip.address();
let your;
const macHost = "239.10.10.100";
const cipher = "avaliacao 1";

client.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  client.close();
});

client.on("message", (msg, rinfo) => {
  let message = CryptoJS.AES.decrypt(msg.toString(), cipher).toString(
    CryptoJS.enc.Utf8
  );
  Recivied(message);
  console.log(`server got: ${message} from ${rinfo.address}:${rinfo.port}`);
});

client.on("listening", () => {
  const address = client.address();
  console.log(`server listening ${address.address}:${address.port}`);
  client.setBroadcast(true);
  client.setMulticastTTL(128);
  client.addMembership(macHost, "0.0.0.0");
});

client.bind(port, host);

function SendC(message) {
  // SendViewMessage(your, message);

  let messageEncrypt = CryptoJS.AES.encrypt(`${your} | ${message}`, cipher);
  console.log("" + messageEncrypt);
  let buffer = Buffer.from("" + messageEncrypt);
  client.send(buffer, port, macHost);
}

function generatePort() {
  return Math.random() * (4800 - 4000) + 4000;
}
