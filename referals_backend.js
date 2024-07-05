const { Pool } = require('pg');
const express = require('express');
const app = express();
var cors = require('cors')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'vahagn2009',
    database: 'descoin',
    port: 5432
});
  
app.use(cors())
app.get('/getreferalslist', (req, res) => {
  // Подключение к базе данных
  pool.connect((err, client, done) => {
      if (err) {
          // Обработка ошибки подключения к базе данных
          console.error('Connection error. Can\'t connect to the database', err.stack);
      } else {
          // Выполнение запроса к базе данных для получения списка рефералов по user_id
          client.query(`SELECT referal_id, referal_name
                        FROM "ref"
                        WHERE referent_id=${req.query.user_id}`, (err, result) => {
              if (err) {
                  // Обработка ошибок выполнения запроса
                  console.error(err);
              } else {
                // Отправка результатов запроса клиенту
                res.send(result.rows);
              }
              // Возврат подключения в пул соединений
              done();
          });
      }
  });
});

// Запуск сервера на порту 3002
const server = app.listen(3002, () => {
  console.log('Сервер запущен на порту 3002');
});
