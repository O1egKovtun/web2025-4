const http = require('http');
const fs = require('fs');
const { Command } = require('commander');
const xml2js = require('xml2js');

// Налаштування командного рядка
const program = new Command();
program
  .option('--host <host>', 'Server address', 'localhost')
  .option('--port <port>', 'Port to listen on', 3000)
  .option('--input <file>', 'Input JSON file', 'data.json')
  .parse(process.argv);

// Створення сервера
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Читання JSON-файлу
    fs.readFile(program.input, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Cannot find input file');
        return;
      }

      try {
        // Перетворення JSON у XML
        const jsonData = JSON.parse(data);
        const builder = new xml2js.Builder();
        const xmlData = builder.buildObject(jsonData);

        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(xmlData);
      } catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Error processing JSON to XML');
      }
    });
  } else {
    res.writeHead(405, {'Content-Type': 'text/plain'});
    res.end('Method Not Allowed');
  }
});

// Запуск сервера
server.listen(program.port, program.host, () => {
  console.log(`Server is running on http://${program.host}:${program.port}`);
});
