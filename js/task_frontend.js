const des_channel_btn =document.querySelector('#descoin_channel');
const des_chat_btn =document.querySelector('#descoin_chat');
const des_X_btn =document.querySelector('#descoin_x');

const tg = window.Telegram.WebApp;
tg.expand();
// let user_id=tg.initDataUnsafe.user.id;
let user_id=1573346147;

// ИЗМЕНЕНИЕ СТАТУСА ТАСКА
async function setTaskStatus(userId, nameOfTask, added_coins) {
  try {
    const response = await fetch(`http://localhost:3003/taskdone?user_id=${userId}&task=${nameOfTask}&added_coins=${added_coins}`);
    const data = await response.text();

    if (data === 'task_done_now') {
      return true;
    } else if (data === 'task_done_yet') {
      return false;
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return null;
  }
}

// ПРОВЕРКА, ЕСТЬ ЛИ ЮЗЕР В БД
async function isUserExists(userId) {
  try {
    const response = await fetch(`http://localhost:3003/isuserexists?user_id=${userId}`);
    const data = await response.json();

    if (response.ok) {
      return data; // Возвращаем результат проверки наличия пользователя
    } else {
      console.error('Ошибка при проверке наличия пользователя:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return false;
  }
}

// ДОБАВЛЕНИЕ ЮЗЕРА В БД
async function addUser(userId) {
  try {
    await fetch(`http://localhost:3003/adduser?user_id=${userId}`);
    console.log('User added successfully');
  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
  }
}

// Переход по ссылке в зависимости от статуса задачи
async function redirectToLink(taskName, link, coins) {
  const taskStatus = await setTaskStatus(user_id, taskName, coins);
  if (taskStatus) {
    window.location.href = link; // Переход по ссылке, если задача выполнена успешно
  } else {
    alert('Задание уже выполнено!'); // Вывод сообщения, если задача уже выполнена
  }
}

// Проверка наличия пользователя и добавление его, если он отсутствует
isUserExists(user_id)
  .then((userExists) => {
    if (!userExists) {
      return addUser(user_id);
    }
  })
  .catch((error) => {
    console.error('Ошибка при проверке пользователя:', error);
  });

// Обработчики событий для кнопок
des_channel_btn.onclick = () => redirectToLink('des_channel', 'https://t.me/descoin_token', 80000);
des_chat_btn.onclick = () => redirectToLink('des_chat', 'https://www.office.com/', 80000);
des_X_btn.onclick = () => redirectToLink('des_x_twitter', 'https://dzen.ru/?clid=2233626&yredirect=true&utm_referrer=ntp.msn.com', 150000);
