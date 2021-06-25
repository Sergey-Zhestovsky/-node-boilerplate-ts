# Node boilerplate

Boilerplate for Node.js server side using pure js.

**Note:** Before using this boilerplate add particular lines to **.gitignore** file:

```.gitignore
.env*
!.env.example
```

Consider using [degit](https://www.npmjs.com/package/degit) to clone repository without **.git** folder.

    $ npm install -g degit

## Features

List of basic features:

- REST setup with middleware, routers, controllers, DTOs
- configured swagger
- socket setup with middleware, controllers, handlers, rooms and events
- logger setup (Winston, Morgan, Debug)
- client and server error handlers
- `.env` environment setup with `development`, `production` and `test` modes
- basic tests setup
- eslint & prettier configuration

## Modules

List of main modules used in this boilerplate:

- Express
- Socket.io
- Joi
- Winston
- Jest

## Scripts

To run server in `development` mode:

    $ npm run dev

To run server in `production` mode:

    $ npm run prod

To run tests:

    $ npm run test

## Folder and file structure

Folder & file structure and philosophy behind it (in /src folder):

- **/api** - incorporates all raw logic, including utility classes and modules.
  - **/classes** - folder for general abstract classes (if needed).
  - **/database** - consists of all db connections. Exports interfaces for all connections with: models, actions and connection controls.
- **/app** - incorporates main routes (controllers) for all server API.
  - **/graphql** - GraphQL controls
    - **/_<entity-name\>_** - embodies main entities of server logic (user, product, etc.). Could also be a folder for _common_ types and resolvers.
      - **/resolvers.js** - GraphQL resolvers for particular entity
      - **/types.graphql** - GraphQL types for particular entity
  - **/routers** - REST implementation of server API
    - **/_<entity-name\>_** - embodies main entities of server logic (user, product, etc.).
      - **/controllers.js** - all controllers for particular routes. One controller could belong only to one route, but one route could have many controllers.
      - **/dto.js** - Data transfer objet declarations. Can implement `validator` method for validation middleware.
      - **/routes.js** - Express routers.
      - **/swagger.yaml** - Swagger documentation for particular entity endpoints. `Tags`, `components` and `paths` can be declared in it for correspondent entity.
  - **/socket** - Socket implementation for server API. In root level of a folder correlates with root level (namespace) of Socket.io route tree.
    - **/controllers** - socket controllers for root namespace. Acts as proactive methods, _e.g. subscribe to server service in order to broadcast users about new events_. Receives namespace object as an argument (root server, in this case).
    - **/events** - all events (`incoming` an `outgoing`) that can happened. Also events can be related to the particular room.
    - **/handlers** - handler methods for all incoming events.
    - **/middleware** - socket middleware. Can be one of three types: `server entry` middleware, `socket entry` middleware and `error handler` that is also a middleware. Implements methods: `handle` - for handling particular event, `validator` - for validating payloads `guard` - for protecting paths if needed.
    - **/namespaces** - all other namespaces in socket that inherits current folder structure with own `controllers`, `events`, `handlers` and `rooms`. Although new namespaces cant have their own namespaces.
    - **/rooms** - room implementation of socket connection for users.
- **/config** - configuration files with all variables for any modules (e.g. db, services, auth, etc.).
- **/data** - (also can be named as `constants`) string rows or constants that is global and will not change.
- **/libs** - all utility classes that will be used all over the code (db, controllers, services, etc.).
- **/loaders** - server helpers that helps to build server app.
- **/middleware** - predominantly middleware methods for REST API.
- **/scripts** - scripts for npm commands.
- **/services** - classes that mostly using modules from `/api` folder i order to create main business logic of a server. Can be used from `GraphQL`, `REST` and `Socket` app interfaces.
- **/tests** - incorporates all tests.
- **/utils** - small utility methods that can be used all over the code. If some utility method is created specifically for a particular block of a server, it is a good idea to create a `/utils` folder near the respective block. E.g. `/utils` folder in `/app`.

Main files:

- **express.js** - returns builded Express based on middleware and app routes.
- **servers.js** - main file, starting point of a server.
