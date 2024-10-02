const express = require("express");
const httpStatus = require("http-status");
const { hostname } = require("os");
const { Netmask } = require("netmask");
const { get_active_interface } = require("network");
const { exec } = require("child_process");
const app = express();
const PORT = 3000; // HTTP sunucusu bu portta çalışacak
app.use(express.json());
// CORS ayarları (güvenlik için)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Bilgisayarı kapatma isteği
app.get("/shutdown", (req, res) => {
  console.log(req);
  exec("shutdown /s /t 1", (error, stdout, stderr) => {
    if (error) {
      console.error(`Kapatma hatası: ${error.message}`);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(`Hata: ${error.message}`);
    }
    console.log("Bilgisayar kapatılıyor...");
    res.status(httpStatus.OK).send({ message: "Bilgisayar kapatılıyor..." });
  });
});

// Bilgisayarı yeniden başlatma isteği
app.post("/restart", (req, res) => {
  exec("shutdown /r /t 1", (error, stdout, stderr) => {
    if (error) {
      console.error(`Yeniden başlatma hatası: ${error.message}`);
      return res.status(500).send(`Hata: ${error.message}`);
    }
    console.log("Bilgisayar yeniden başlatılıyor...");
    res.send("Bilgisayar yeniden başlatılıyor...");
  });
});
//NODEJS Bilgisayarın adını alma
function getNetworkInterfaces() {
  return new Promise((resolve, reject) => {
    get_active_interface((err, activeInterface) => {
      if (err) {
        reject(err);
      } else {
        resolve(activeInterface);
      }
    });
  });
}
// Bilgisayarı yeniden başlatma isteği
app.get("/info", async (req, res) => {
  const computerName = await hostname();
  const networkInterfaces = await getNetworkInterfaces();
  const block = await new Netmask(
    `${networkInterfaces.ip_address}/${networkInterfaces.netmask}`
  );
  res.status(httpStatus.OK).send({
    name: computerName,
    mac: networkInterfaces?.mac_address,
    ip: networkInterfaces?.ip_address,
    broadcast: block?.broadcast,
    port: "9",
  });
});
app.get("/", (req, res) => {
  res.status(200).send({ status: true, message: "index" });
});
// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
