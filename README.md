# NestJS API

<a href="#docs">Docs</a>
<a href="#configuration">Configuration</a>
<a href="#installation">Installation</a>
<a href="#running-the-app">Running the app</a>
<a href="#docs__types">Types</a>

---

## This is a NestJS todo Rest API

<br id="configuration">

## Configuration

- in the **root folder** *create* a `.env` file and add the followind ***variables***:

`.env`
```env
DB_NAME=... #your postgres database name
DB_PASSWORD=... #your postgres password
DB_USERNAME=... #your postgres username
DB_PORT=... #your postgres port
DB_HOST=localhost #this is default value, you can change it if you run don't run app on localhost
```

<br id="installation">

## Installation

- to ***run*** the app you ***need to install*** all **dependencies**:

`bash`
```bash
yarn install
```

---

<br id="running-the-app">

## Running the app

`bash`
- to ***run app*** in *`dev`* mode:
```bash
yarn start:dev
```

`bash`
- to ***run app*** in *`prod`* mode:
```bash
yarn start:prod
```

`bash`
- to ***`build`*** the app: 
```bash
yarn build
```

---

<br id="docs">

# ***API Documentation***

<a href="#docs__auth">Auth</a>
<a href="#docs__user">User</a>
<a href="#docs__tasks">Tasks</a>

<br id="docs__auth">

## **Auth**

- ***`POST`*** `/auth/register`
  - register a new user
  - **Request Body**
    - `name`: *string*
    - `email`: *string*
    - `password`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `token`: *string*

- ***`POST`*** `/auth/login`
  - login a user
  - **Request Body**
    - `login`: *string*
    - `password`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `token`: *string*

<br id="docs__user">

## **User** 

- ***`POST`*** `/user/change-avatar`
  - changes user avatar
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Request Body**
    - `avatar`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*

- ***`PATCH`*** `/user/change-name`
  - changes user name
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Request Body**
    - `id`: *number*
    - `name`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*

- ***`GET`*** `/user/get-tasks`
  - get all user tasks
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Task[]*

- ***`GET`*** `/user/get-avatar`
  - get user avatar file by user id
  - **Query**
    - `id`: *number*
  - **Response**
    - `status`: *number*
    - `avatar`: *Buffer*

- ***`GET`*** `/user/get-user`
  - get public user DTO by user id
  - **Query**
    - `id`: *number*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `user`: *PublicUserDto*

### <a href="#docs__types__Task">Task[]</a>

- ***`GET`*** `/user/get-user`
  - get public user DTO by token
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `user`: *PublicUserDto*

### <a href="#docs__types__PublicUserDto">PublicUserDto</a>

- ***`GET`*** `/user/get-avatar`
  - get user avatar url by token
  - **Query**
    - `id`: *number*
    - `time`: *Date*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `avatar`: *string*

- ***`PATCH`*** `/user/change-password`
  - changes user password
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `id`: *number*
  - **Request Body**
    - `password`: *string*
    - `confirmPassword`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `token`: *`Basic` string*

<br id="docs__tasks">

## **Tasks**

- ***`PATCH`*** `/tasks/change-header`
  - changes task header
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Request Body**
    - `id`: *number*
    - `header`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*

- ***`DELETE`*** `/tasks/delete-task`
  - delete task
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `id`: *number* // task id
  - **Response**
    - `status`: *number*
    - `message`: *string*

- ***`GET`*** `tasks/get-tasks-by-substring` *(deprecated)*
  - get tasks by substring
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `substring`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Task[]*

### <a href="#docs__types__Task">Task[]</a>

- ***`GET`*** `tasks/get-tasks-by-type`
  - get tasks by type
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `type`: *TodoType*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Task[]*

### <a href="#docs__types__Task">Task[]</a>, <a href="#docs__types__TodoType">TodoType</a>

- ***`GET`*** `tasks/get-today-tasks`
  - get today tasks
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `createdAt`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Task[]*

### <a href="#docs__types__Task">Task[]</a>

- ***`GET`*** `tasks/get-tasks-by-header`
  - get tasks by header
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `header`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Task[]*

###  <a href="#docs__types__Task">Task[]</a>

- ***`GET`*** `tasks/get-tasks-by-month`
  - get tasks by month
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `month`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Task[]*

### <a href="#docs__types__Task">Task[]</a>

- ***`GET`*** `tasks/get-tasks-by-week` *(deprecated)*
  - get tasks by week
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Query**
    - `week`: *string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Task[]*

###  *<a href="#docs__types__Task">Task</a>*

- ***`GET`*** `tasks/get-tasks-length`
  - get tasks length
  - **Request Headers**
    - `Authorization`: *`Basic` string*
  - **Response**
    - `status`: *number*
    - `message`: *string*
    - `tasks`: *Record<TodoType, number>*

###  *<a href="#docs__types__TodoType">TodoType</a>*

<br id="docs__types">

# ***Types***

### ***Task***

<br id="docs__types__Task">

```typescript
  interface Task {
    header: string;
    isChecked: boolean;
    createdAt: string;
    from: string;
    till: string;
    important: boolean;
    creator: string; // user name
    id: number;
    type: TodoType;
    tasks: Array<{ isChecked: boolean, content: string }>; // subtasks
  }
```

<br id="docs__types__user">

### ***User***

```typescript
interface User {
  name: string;
  email: string;
  password: string;
  avatar: Buffer;
  isHaveAvatar: boolean;
  tasks: Task[];
}
```

<br id="docs__types__CreateTodoDto">

### ***CreateTodoDto***

```typescript
interface CreateTodoDto {
  isChecked: boolean;
  createdAt: string;
  from: string;
  header: string;
  important: boolean;
  tasks: Array<{ isChecked: boolean, content: string }>;
  till: string;
  type: TodoType;
}
```

<br id="docs__types__TodoType">

### ***TodoType***

```typescript
type TodoType = 
  | 'school'
  | 'work'
  | 'shop'
  | 'read'
  | 'work out';
```

<br id="docs__types__PublicUserDto">

### ***PublicUserDto***

```typescript
interface PublicUserDto {
  isHaveAvatar: boolean;
  name: string;
  email: string;
  avatar: string; // `${process.env.API_URL}/user/get-avatar?id=${user.id}&time=${new Date()}`
}
```
