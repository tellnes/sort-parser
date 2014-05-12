var test = require('tap').test
  , SortParser = require('../')

test(function (t) {
  var parser = new SortParser()
  t.equals(typeof parser, 'function')
  t.deepEquals(parser(), [])

  t.deepEquals(parser('name'), [ [ 'name', 1 ] ])
  t.deepEquals(parser('a, -b,c'), [ ['a', 1], ['b', -1], ['c', 1] ])

  parser = new SortParser('mongodb')
  t.deepEquals(parser(), {})
  t.deepEquals(parser('a, -b,c'), { 'a': 1, 'b': -1, 'c': 1 })

  parser = new SortParser(SortParser.es)
  t.deepEquals(parser(), [])
  t.deepEquals(parser('a, -b,c'), [ { 'a': 'asc' }, { 'b': 'desc' }, { 'c': 'asc' } ])

  parser = new SortParser('normalize')
  t.deepEquals(parser(), '')
  t.equals(parser('a, -b,,,   ,, c'), 'a,-b,c')

  var map =
    { 'foo': 'f'
    , 'bar': 'b'
    }
  parser = new SortParser({ format: 'normalize', map: map })
  t.equals(parser('foo,-bar,baz'), 'f,-b,baz')

  parser = new SortParser({ format: 'normalize', fields: Object.keys(map) })
  t.equals(parser('foo,-bar,baz'), 'foo,-bar')

  parser = new SortParser({ format: 'normalize', fields: Object.keys(map), strict: true })
  t.equals(parser('foo,-bar,baz'), null)

  parser = new SortParser({ format: 'normalize', map: map, strict: true })
  t.equals(parser('foo,-bar,baz'), null)

  parser = new SortParser({ format: 'normalize', map: map, fields: Object.keys(map) })
  t.equals(parser('foo,-bar,baz'), 'f,-b')

  t.end()
})
