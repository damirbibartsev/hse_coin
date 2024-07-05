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

// Обработчик для проверки существования пользователя в базе данных
app.get('/isuserexists', (req, res) => {
  // Подключение к пулу соединений с базой данных
  pool.connect((err, client, done) => {
    if (err) {
      // Логирование ошибки подключения к базе данных
      console.error('Connection error. Can\'t connect to the database', err.stack);
      // Возвращаем false на фронтенд в случае ошибки подключения к базе данных
      res.send(false);
    } else {
      // Выполнение запроса к базе данных для проверки существования пользователя
      client.query(`SELECT * FROM "tasks" WHERE id = $1`, [req.query.user_id], (err, result) => {
        // Возвращаем соединение в пул
        done();
  
        if (err) {
          // Логирование ошибки выполнения запроса
          console.error('Error executing query', err.stack);
          // Возвращаем false на фронтенд в случае ошибки выполнения запроса
          res.send(false);
        } else {
          // Проверка наличия записей в результате запроса
          if (result.rows.length > 0) {
            // Возвращаем true на фронтенд, если идентификатор существует в базе данных
            res.send(true);
          } else {
            // Возвращаем false на фронтенд, если идентификатор не существует в базе данных
            res.send(false);
          }
        }
      });
    }
  });
});


// Обработчик для добавления нового пользователя в базу данных
app.get('/adduser', (req, res) => {
  // Подключение к пулу соединений с базой данных
  pool.connect((err, client, done) => {
    if (err) {
      // Логирование ошибки подключения к базе данных
      console.error('Connection error. Can\'t connect to the database', err.stack);
      res.status(500).send('Database connection error'); // Отправка ошибки клиенту
    } else {
      // Выполнение запроса на добавление нового пользователя в базу данных
      client.query(
        `INSERT INTO "tasks" (id, des_channel, des_chat, des_x_twitter)
         VALUES ($1, $2, $3, $4);`, 
        [req.query.user_id, false, false, false], 
        (err, result) => {
          if (err) {
            // Логирование ошибки выполнения запроса
            console.log(err);
            res.status(500).send('Error inserting user'); // Отправка ошибки клиенту
          } else {
            done(); // Возвращение соединения в пул
            res.status(200).send('User added successfully'); // Отправка успешного ответа клиенту
          }
        }
      );
    }
  });
});


// Обработчик маршрута для завершения задачи и начисления монет
app.get('/taskdone', (req, res) => {
  // Подключение к пулу соединений с базой данных
  pool.connect((err, client, done) => {
    if (err) {
      // Логирование ошибки подключения к базе данных
      console.error('Connection error. Can\'t connect to the database', err.stack);
      // Возвращение соединения в пул
      done();
    } else {
      // Выполнение запроса на получение состояния задачи пользователя
      client.query(`SELECT ${req.query.task} FROM "tasks" WHERE id=$1`, [req.query.user_id], (err, result) => {
        if (err) {
          // Логирование ошибки выполнения запроса
          console.error('Error executing query', err.stack);
          // Отправка сообщения об ошибке клиенту
          res.status(500).send('Error executing query');
        } else {
          // Проверка наличия записей в результате запроса и выполнения задачи
          if (result.rows.length > 0 && result.rows[0][req.query.task] === false) {
            // Выполнение запроса на обновление состояния задачи
            client.query(`UPDATE "tasks" SET ${req.query.task}=$1 WHERE id=$2`, [true, req.query.user_id], (err, result) => {
              if (err) {
                // Логирование ошибки выполнения запроса
                console.error('Error executing query', err.stack);
                // Отправка сообщения об ошибке клиенту
                res.status(500).send('Error executing query');
              } else {
                // Выполнение запроса на начисление монет пользователю
                client.query(`UPDATE "users" SET wallet = wallet + ${req.query.added_coins} WHERE id = ${req.query.user_id}`, (err, result) => {
                  if (err) {
                    // Логирование ошибки выполнения запроса
                    console.error('Error executing query', err.stack);
                    // Отправка сообщения об ошибке клиенту
                    res.status(500).send('Error executing query');
                  } else {
                    // Отправка клиенту сообщения о выполнении задачи и начислении монет
                    res.send('task_done_now');
                  }
                });
              }
            });
          } else {
            // Отправка клиенту сообщения о том, что задача уже выполнена
            res.send('task_done_yet');
          }
        }
        // Возвращение соединения в пул
        done();
      });
    }
  });
});

//Запуск сервера на порту 3003
const server = app.listen(3003, () => {
    console.log('Сервер запущен на порту 3003');
});


