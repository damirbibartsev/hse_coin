// Получение элементов DOM
const counter = document.querySelector("#counter");
const limitDisplay = document.querySelector("#limit_display");
const display = document.querySelector("#display");
const button = document.querySelector("#button");
const progress = document.querySelector('.progress');
const coin_icon = document.querySelector('#golden-coin');

// ТЕЛЕГРАМ,ПЕРЕМЕННЫЕ
const tg = window.Telegram.WebApp;
tg.expand();
// let user_id=tg.initDataUnsafe.user.id;
let user_id=1573346147;

let wallet_of_user;
let limit_clicks_of_user;
const limit_of_clicks=10000;

// Функция для отправки запроса к серверу по userId
async function getDataFromSeverById(userId) {
  try {
    // Отправка запроса к серверу с указанным userId
    const response = await fetch(`http://localhost:3001/getinfo?user_id=${userId}`);
    // Преобразование ответа сервера в JSON-формат
    const data = await response.json();
  
    // Извлечение значений wallet и limit_clicks из полученных данных
    let wallet = data.wallet;
    let limit_clicks = data.limit_clicks;

    //Изменение значение глобальных переменных
    wallet_of_user=wallet;
    limit_clicks_of_user=limit_clicks;

    // Возвращение значений wallet и limit_clicks
    return { wallet, limit_clicks };

  } catch (error) {
    // Обработка ошибок при получении данных и вывод их в консоль
    console.error('Ошибка при получении данных:', error);
    // Возвращение null в случае ошибки
    return null;
  }
}

// Обновление интерфейса пользователя
function updateUI(wallet_of_user,limit_clicks_of_user) {
  //Обновление баланса
  counter.textContent = wallet_of_user;
  limitDisplay.textContent = `⚡${limit_clicks_of_user}/${limit_of_clicks}`;

  // Обновление прогресс-бара
  let difference_bar = limit_of_clicks - limit_clicks_of_user;
  counter_of_progress_bar = Math.floor((difference_bar / 10000) * 100);
  progress.style.width = `${counter_of_progress_bar}%`;

  // Изменение размера шрифта в зависимости от значения кошелька
  if (wallet_of_user >= 1000000000) {
    counter.style.fontSize = '30px';
  } else if (wallet_of_user >= 100000000000) {
    counter.style.fontSize = '25px';
  }
}

// Запрос значения кошелька с сервера и его установка на страницу
getDataFromSeverById(user_id)
  .then(({ wallet, limit_clicks }) => {
    if (wallet !== null) {
      updateUI(wallet,limit_clicks)
    } else {
      // Обработка ошибки, если не удалось получить значение кошелька
      console.error('Не удалось получить значение кошелька');
    }
  })
  .catch((error) => {
    // Обработка ошибок при получении данных с сервера
    console.error('Ошибка при получении кошелька:', error);
  });


// Функция для обновления данных на сервере
async function updateDataOnServer(userId, wallet_of_user, limitclicks) {
  try {
    // Отправка запроса на обновление данных на сервере
    const response = await fetch(`http://localhost:3001/updateinfo?user_id=${userId}&wallet=${wallet_of_user}&limit_clicks=${limitclicks}`);
    // Проверка успешности запроса
    if (response.ok) {
      // Логирование успешного обновления данных
      console.log('Данные успешно обновлены!');
    } else {
      // Логирование ошибки при обновлении данных с указанием статуса ответа
      console.error('Ошибка при обновлении данных:', response.status);
    }
  } catch (error) {
    // Обработка ошибок при выполнении запроса и логирование их
    console.error('Ошибка при получении данных:', error);
    return null;
  }
}

// Обработка клика и добавление эффекта "+1"
function handlePlusOneEffect(event) {
  var button = event.target;
  var x = event.clientX - button.getBoundingClientRect().left;
  var y = event.clientY - button.getBoundingClientRect().top;
  var plusOne = document.createElement("span");

  plusOne.textContent = "+1";
  plusOne.className = "plus-one";
  plusOne.style.left = `${x}px`;
  plusOne.style.top = `${y}px`;

  button.appendChild(plusOne);

  // Установка анимации для элемента span
  setTimeout(function() {
    plusOne.style.opacity = 0;
    plusOne.style.transform = 'translateY(-20px)';
  }, 0);

  // Удаление элемента span после завершения анимации
  plusOne.addEventListener('transitionend', function() {
    plusOne.remove();
  });
}


// Логика обработчика клика
async function handleClick(event) {
  if (limit_clicks_of_user > 0 && wallet_of_user !== undefined) {
    wallet_of_user++;
    limit_clicks_of_user--;
    updateUI(wallet_of_user,limit_clicks_of_user);
    handlePlusOneEffect(event);
  }

  if (limit_clicks_of_user <= 0) {
    limitDisplay.textContent = `⚡0/${limit_of_clicks}`;
    display.textContent = "Limit!";
    button.removeEventListener('click', handleClick);
  }

  // Обновление данных на сервере перед выгрузкой страницы
  window.addEventListener('unload', () => {
    updateDataOnServer(user_id, wallet_of_user, limit_clicks_of_user);
});
}


// Назначение обработчика клика на кнопку
button.addEventListener('click', handleClick);











