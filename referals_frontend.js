const button = document.querySelector("#copy_url_of_ref_btn");
const url_of_referal = document.querySelector("#url_of_referent");
const list_of_ref=document.querySelector("#list_of_referals")
const num_of_referals = document.querySelector("#num_of_ref");
const name_of_user=document.querySelector("#name_of_user");

const tg = window.Telegram.WebApp;
tg.expand();

// let user_id=tg.initDataUnsafe.user.id;
// let user_name = tg.initDataUnsafe.user.username;

let user_id=1573346147;
let user_name = 'jhon';

name_of_user.textContent = "@"+user_name;
url_of_referent.textContent = `https://t.me/descoin_league_bot?start=${user_id}`


async function sendRequestForReferalsList(userId) {
  try {
    // Выполняем запрос к серверу для получения списка рефералов по userId
    let response = await fetch(`http://localhost:3002/getreferalslist?user_id=${userId}`);
    // Преобразуем ответ сервера в JSON-формат
    let data = await response.json();
    // Очищаем контейнер списка рефералов перед добавлением новых данных
    list_of_ref.innerHTML = '';
    
    if (data.length === 0) {
      // Обработка случая, когда JSON пуст (нет рефералов)
      let emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'У вас пока нет рефералов:((';
      list_of_ref.appendChild(emptyMessage);
      // Обновляем счетчик количества рефералов
      num_of_referals.textContent = 0;
      return;
    }

    // Создаем контейнер для списка рефералов
    let divElement = document.createElement('div');
    
    // Проходим по каждому рефералу в данных
    data.forEach((referal, index) => {
      // Создаем элемент для имени реферала
      let pElementForName = document.createElement('p');
      let nameText = document.createTextNode(`${index+1}. @${referal.referal_name}`);
      
      // Добавляем текстовое содержимое к элементу
      pElementForName.appendChild(nameText);
      // Добавляем элемент в контейнер
      divElement.appendChild(pElementForName);
    });

    // Добавляем контейнер со списком рефералов в основной контейнер
    list_of_ref.appendChild(divElement);
    
    // Обновляем счетчик количества рефералов
    num_of_referals.textContent = data.length;

  } catch (error) {
    // Обработка ошибок при получении данных
    console.error('Ошибка при получении данных:', error);
    let errorMessage = document.createElement('p');
    // errorMessage.textContent = 'Ошибка при получении данных. Попробуйте еще раз позже.';
    // list_of_ref.appendChild(errorMessage);
    // Обновляем счетчик количества рефералов на 0 в случае ошибки
    num_of_referals.textContent = 0;
  }
}

// Вызов функции для отправки запроса и получения списка рефералов для указанного userId
sendRequestForReferalsList(user_id);



// КОПИРОВАНИЕ РЕФЕРАЛЬНОЙ ССЫЛКИ
button.addEventListener("click", function() {
  try {
      // Создание временного текстового поля
      const tempTextarea = document.createElement("textarea");
      // Установка значения текстового поля на реферальную ссылку
      tempTextarea.value = url_of_referal.textContent;
      // Добавление временного текстового поля в DOM
      document.body.appendChild(tempTextarea);
      // Выбор текста внутри текстового поля
      tempTextarea.select();
      // Копирование выделенного текста в буфер обмена
      document.execCommand('copy');
      // Удаление временного текстового поля из DOM
      document.body.removeChild(tempTextarea);
      // Уведомление пользователя об успешном копировании
      alert("Ссылка успешно скопирована!");
  } catch (error) {
      // Обработка ошибок при копировании ссылки
      console.error("An error occurred while copying the URL:", error);
  }
});
