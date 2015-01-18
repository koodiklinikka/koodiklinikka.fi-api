# koodiklinikka.fi API

[ ![Codeship Status for koodiklinikka/koodiklinikka.fi-api](https://codeship.com/projects/5ba71cf0-7f0a-0132-b32d-661179cb74c9/status?branch=master)](https://codeship.com/projects/57155)

### Start developing
* Install node.js
```
$ git clone git@github.com:koodiklinikka/koodiklinikka.fi-api.git
$ cd koodiklinikka.fi-api
$ npm install
```

* Create `config.json` file. See [config.template.json](https://github.com/koodiklinikka/koodiklinikka.fi-api/blob/master/config.template.json) for possible options.
The config file consists of environment specific blocks. Environment variable `NODE_ENV` determines which block is used. If the environment variable is not present, the `development` block will be selected. 
`all` block is always used and the block selected is merged into it so that it overwrites the values defined in it.

* ```
$ npm start
```