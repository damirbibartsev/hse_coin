const { Pool } = require('pg');
const express = require('express');
const app = express();
var cors = require('cors')
var cron = require('node-cron');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'vahagn2009',
  database: 'descoin',
  port: 5432
});


app.use(cors())

app.get('/getinfo', (req, res) => {
  // Подключение к базе данных
  pool.connect((err, client, done) => {
    if (err) {
      // Обработка ошибки подключения к базе данных
      console.error('Connection error. Can\'t connect to the database', err.stack);
    } else {
      // Выполнение запроса к базе данных для получения информации о пользователе по user_id
      client.query(`SELECT wallet, limit_clicks FROM "users" WHERE id=$1`, [req.query.user_id], (err, result) => {
        if (err) {
          // Обработка ошибок выполнения запроса
          console.error(err);
        } else {
          // СЛУЧАЙ, КОГДА НЕТ УЧЕТНОЙ ЗАПИСИ
          if (result.rows.length === 0) {
            // Если учетной записи нет, создаем новый объект данных с начальными значениями
            let responseData = {
              wallet: 0,
              userId: req.query.user_id,
              limit_clicks: 10000
            };

            // Вставляем новую учетную запись в базу данных
            client.query(`INSERT INTO "users" VALUES($1,$2, $3)`, [req.query.user_id, responseData.wallet, responseData.limit_clicks]);
            
            // Отправляем созданные данные клиенту
            res.send(responseData);

          } else { // СЛУЧАЙ, КОГДА УЧЕТНАЯ ЗАПИСЬ ЕСТЬ
            // Если учетная запись существует, извлекаем данные из результата запроса
            let wallet = result.rows[0].wallet;
            let limit_clicks = result.rows[0].limit_clicks;

            // Создаем объект данных для отправки клиенту
            let responseData = {
              wallet: wallet,
              userId: req.query.user_id,
              limit_clicks: limit_clicks
            };

            // Отправляем данные клиенту
            res.send(responseData);
          }
        }
        // Возврат подключения в пул соединений
        done();
      });
    }
  });
});


app.get('/updateinfo', (req, res) => {
  // Подключение к базе данных
  pool.connect((err, client, done) => {
    if (err) {
      // Обработка ошибки подключения к базе данных
      console.error('Connection error. Can\'t connect to the database', err.stack);
    } else {
      // Выполнение запроса к базе данных для обновления информации о пользователе
      client.query(`UPDATE "users" SET wallet=$1, limit_clicks=$2 WHERE id=$3`, 
        [req.query.wallet, req.query.limit_clicks, req.query.user_id], (err, result) => {
        if (err) {
          // Обработка ошибки выполнения запроса (в данном случае, нет действий)
          null;
        } else {
          // Обработка успешного выполнения запроса (в данном случае, нет действий)
          null;
        }
        // Возврат подключения в пул соединений
        done();
      });
    };
  });
});

// Планировщик cron для обновления limit_clicks всех пользователей ежедневно в полночь
cron.schedule('0 0 * * *', () => {
  // Подключение к базе данных
  pool.connect((err, client, done) => {
    if (err) {
      // Обработка ошибки подключения к базе данных
      console.error('Connection error. Can\'t connect to the database', err.stack);
    } else {
      // Выполнение запроса к базе данных для обновления limit_clicks всех пользователей
      client.query(`UPDATE "users" SET limit_clicks = 10000;`, (err, result) => {
        if (err) {
          // Обработка ошибки выполнения запроса (в данном случае, нет действий)
          null;
        } else {
          // Сообщение об успешном выполнении запроса
          console.log("Значение колонки limit_clicks успешно обновлено у всех пользователей!");
        }
        // Возврат подключения в пул соединений
        done();
      });
    };
  });
});

// Запуск сервера на порту 3001
const server = app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});









