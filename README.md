# Node boilerplate

Boilerplate for Node.js server side using `typescript`.

## Initialize

Consider using [degit](https://www.npmjs.com/package/degit) to clone repository without **.git** folder:

    $ npm install -g degit
    $ degit <this repo>

Add particular lines to **.gitignore** file:

```.gitignore
/environment/.env*
!/environment/.env.example
```

After that, initialize git:

    $ git init -y

Before starting server with current configuration you need to generate RSA key pair for authorization process (it will generate key pair for `development` mode):

    $ npm run generate-jwt-key-pair dev

## Scripts

To run server in `development` mode:

    $ npm run dev

To run server in `production` mode:

    $ npm run prod

To run tests:

    $ npm run test

Build server for production:

    $ npm run build

Run eslint against source code:

    $ npm run lint

Print role structure from RBAC module. You can also specify environment `<mode>` (default `development`) for witch you want to run the script. Posable variants: `development`, `dev`, `production`, `prod`, `test`:

    $ npm run print-roles <mode>

Generate RSA key pairs for JWT auth flow. You can also specify environment `<mode>` (default `development`):

    $ npm run generate-jwt-key-pair <mode>

Print all posable error messages for the `Joi` module. Useful for translation purposes. You can also specify environment `<mode>` (default `development`):

    $ npm run get-validator-error-messages <mode>

## Folder and file structure

// TODO
