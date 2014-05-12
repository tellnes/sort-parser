# Sort Parser

sort-parser

## Example

```js
var SortParser = require('sort-parser')

var sp = new SortParser(
      { format: SortParser.es
      , fields: ['name', 'email']
      , strict: true
      }
    )

assert.deepEquals(
    sp.parse('-email,name')
  , [ { 'email': 'desc' }, { 'name': 'asc' } ]
  )
```

## Install

    $ npm install sort-parser

## Test

    $ npm test

## License

MIT
