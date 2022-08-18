const http = require("http");
const fs = require("fs");
const requests = require("requests");

const indexFile = fs.readFileSync("index.html", "utf-8");

const replaceFile = (unchangeData, originalData) => {
  let temperature = unchangeData.replace(
    "{%temp%}",
    Math.floor(originalData.main.temp - 273.15)
  );
  temperature = temperature.replace(
    "{%temp_min%}",
    Math.floor(originalData.main.temp_min - 273.15)
  );
  temperature = temperature.replace(
    "{%temp_max%}",
    Math.floor(originalData.main.temp_max - 273.15)
  );
  temperature = temperature.replace("{%name%} ", originalData.name);
  temperature = temperature.replace("{%country%}", originalData.sys.country);
  temperature = temperature.replace(
    "{%tempstatus%}",
    originalData.weather[0].main
  );

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=London&appid=fb1f6fa1236a1f193021bd57d25d8df5"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        console.log(arrData[0].weather);

        const realTimeData = arrData
          .map((realVal) => replaceFile(indexFile, realVal))
          .join("");
        res.write(realTimeData);
        console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        console.log("end");
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");
