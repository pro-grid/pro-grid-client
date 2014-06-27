progrid.io client
===
[progrid.io][] is a live multiplayer pixel art game.

![progrid.io][progrid gif]

[progrid.io][] is made up of two modules. [pro-grid][], a [node][]/[socket.io][] server
which handles many clients, and [pro-grid-client][], the user interface built as
a client-side javascript app using [angularjs][]. 


## quickstart
If you know what you are doing:

```bash
# make sure deps are installed
gem install sass
npm i -g bower gulp
bower install && npm install
```
Then start up a server following the instructions here: [pro-grid][]

Once you have a [pro-grid][] server up you launch your client server:

```bash
# configure your client
gulp config

# launch a client server at http://localhost:9000
gulp watch
```

If you need some help see below.

## getting started tutorial
### install dependencies
We assume you have up-to-date versions of both [ruby][] and [node][]
installed on your machine. We recommend [rvm][] and [nvm][] for managing your
node and ruby installations.
#### global
you need [sass][], [bower][], and [gulp][] installed globally

```bash
gem install sass
npm i -g bower gulp
```
#### project
install the project dependencies

```bash
bower install && npm install
```

### start up a pro-grid server
This project interfaces with a pro-grid server. Your client needs a copy of it
running. 

Instructions for building and running a pro-grid server live over at:
[pro-grid][]

The `hostname` for development and production is configured in
`config/development.json` and `config/production.json` respectively. By default
this should be `http://localhost:9001` for your local development environment.

### configure your environment
You must generate a `config.js` file specific to your environment (development,
production, etc.). 

```bash
gulp config
```

Will generate a `config.js` reading values from `config/default.json` and
`config/development.json`.

By default your environment will be set to `development`. The target build
environment is set via the environment variable `GULP_ENV`. You can generate a
`config.js` to read values from `config/production.json` by running:

```bash
GULP_ENV=production gulp config
```

### launch a client server
The client app essentially compiles down a bunch of static files. So this
project comes with a static file server to aid development. The development
server reloads and recompiles files when it has detected they have changed.

```bash
gulp watch
```

This will launch a server at `http://localhost:9000`

The server serves files within the `app/` directory and the `.tmp/` directory.
It also fires up a [livereload][] server so the browser is refreshed every time
a file is changed and compiled.

### done!
Happy coding! You should be all good to go now

## Want to get involved?
We could always use some help!

We primarily need help with:

 - Writing tests
 - Coming up with siq new features

## Fun Stuff
If you are a fan of the grid (and have had the resolve to read this far) you
would probably enjoy [pro-grid-utils][], a collection of fun hacks you can run
in your console.

[progrid gif]: http://i.imgur.com/GiLvpX3.gif
[progrid.io]: http://www.progrid.io "progrid.io"
[pro-grid]: http://github.com/pro-grid/pro-grid
[pro-grid-client]: http://github.com/pro-grid/pro-grid-client
[ruby]: https://www.ruby-lang.org
[node]: http://nodejs.org/ "Node.js"
[socket.io]: http://socket.io/
[angularjs]: https://angularjs.org/ "AngularJS"
[nvm]: https://github.com/creationix/nvm "Node Version Manager (NVM)"
[rvm]: https://rvm.io/ "Ruby Version Manager (RVM)"
[sass]: http://sass-lang.com/ "Sass"
[bower]: http://bower.io/ "Bower"
[gulp]: http://gulpjs.com/ "gulp.js"
[livereload]: https://github.com/intesso/connect-livereload
[pro-grid-utils]: http://github.com/austinpray/pro-grid-utils
