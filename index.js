const express = require('express');
const httpStatus = require('http-status');
const { exec } = require('child_process');
const app = express();
const PORT = 3000; // HTTP sunucusu bu portta çalışacak
app.use(express.json());
// CORS ayarları (güvenlik için)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Bilgisayarı kapatma isteği
app.get('/shutdown', (req, res) => {
  console.log(req);  
  exec('shutdown /s /t 1', (error, stdout, stderr) => {
    if (error) {
      console.error(`Kapatma hatası: ${error.message}`);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Hata: ${error.message}`);
    }
    console.log('Bilgisayar kapatılıyor...');
    res.status(httpStatus.OK).send({message:'Bilgisayar kapatılıyor...'});
  });
});

// Bilgisayarı yeniden başlatma isteği
app.post('/restart', (req, res) => {
  exec('shutdown /r /t 1', (error, stdout, stderr) => {
    if (error) {
      console.error(`Yeniden başlatma hatası: ${error.message}`);
      return res.status(500).send(`Hata: ${error.message}`);
    }
    console.log('Bilgisayar yeniden başlatılıyor...');
    res.send('Bilgisayar yeniden başlatılıyor...');
  });
});
// Bilgisayarı yeniden başlatma isteği
app.get('/info', (req, res) => {
  res.status(httpStatus.OK).send({
    name: "anan",
    mac: "mac",
    ip: "192.168.1.163",
    ping: "13132123",
    port: "9",
  });
});
app.get('/', (req, res) => {
  res.status(200).send({status:true, message:"index"})
});
// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
