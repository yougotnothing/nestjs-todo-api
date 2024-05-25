# NestJS API
---

<a href="#docs">Docs</a>
<a href="#configuration">Configuration</a>
<a href="#installation">Installation</a>
<a href="#running-the-app">Running the app</a>
<a href="#building-the-app">Building the app</a>

## This is a NestJS todo Rest API

## Configuration

- in the root folder create a `.env` file and add the followind variables:

```env
  DB_NAME=... #your postgres database name
  DB_PASSWORD=... #your postgres password
  DB_USERNAME=... #your postgres username
  DB_PORT=... #your postgres port
  DB_HOST=localhost #this is default value, you can change it if you run don't run app on localhost
```

## Installation

- to run the app you need to isntall all dependencies:

```bash
  yarn install
```

---

## Running the app

- to run app in dev mode:
```bash
  yarn start:dev
```

- to run app in prod mode:
```bash
  yarn start:prod
```

- to build the app: 
```bash
  yarn build
```

---

<br id="docs">

## API Documentation

### Auth

- `POST /auth/register`
  - register a new user
  - **Request Body**
    - `name`: string
    - `email`: string
    - `password`: string
  - **Response**
    - `status`: number
    - `message`: string
    - `token`: string
