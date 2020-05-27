# Server-Mesto

В проекте используются NoSQL база данных MongoDB

###Как обратиться к серверу

- по публичному IP-адресу: **84.201.128.212**

- по http и по https, используя домен: **roldglendonmesto.tk**


###На сервере в данный момент реализовано следующее API:
####Пользователь:

1. Вернуть всех пользователей

* URL ```/users```

* Method: **GET**

* URL Params: None

* Data Params: None

* Success Response:

```
Code: 200
Content: {
             "data": [
                 {
                     "_id": "5ea4336194fda62964025dd7",
                     "name": "Имя пользователя",
                     "about": "информация о пользователе",
                     "avatar": "https://i03.fotocdn.net/s119/d69501142c8bfad3/user_xl/2727465324.jpg",
                     "__v": 0
                 },
                 ...
                 ]
          }
```
* Error Response:

```
Code: 500 Internal Server Error
Message: На сервере произошла ошибка
```


2. **GET** /users/:userId - возвращает пользователя по _id
3. **POST** /users — создаёт пользователя (передаваемые параметры: *name*, *about* и *avatar*)

#### Карточка
1. **GET** /cards — возвращает все карточки
2. **POST** /cards — создаёт карточку (передаваемые параметры: *name*, *link*)
3. **DELETE** /cards/:cardId — удаляет карточку по идентификатору
