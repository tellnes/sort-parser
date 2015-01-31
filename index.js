
module.exports = exports = SortParser

exports.normalize = normalize

exports.es = es
exports.elasticSearch = es

exports.mongo = mongodb
exports.mongodb = mongodb



function SortParser(options) {
  if (typeof options === 'string' || typeof options === 'function') {
    options = { format: options }
  }

  if (!options) {
    options = {}
  }

  var format = options.format
  if (typeof format === 'string') format = exports[format]
  if (!format) format = defaultFormat

  var map = options.map || {}
    , fields = options.fields
    , strict = Boolean(options.strict)

  if (strict && !fields) {
    if (!map) throw new Error('`strict` requires either `map` or `fields`')
    fields = Object.keys(map)
  }

  function parser(str) {
    str = (str || '').split(/\,|\s/g)

    var i, field, order
      , result = format()

    for (i = 0; i < str.length; i++) {
      field = str[i]
      if (!field) continue
      if (field[0] === '-') {
        order = -1
        field = field.slice(1)
      } else {
        order = 1
      }

      if (fields && !~fields.indexOf(field)) {
        if (strict) return null
        else continue
      }

      field = map[field] || field

      result = format(result, field, order)
    }

    return result
  }

  return parser
}


function es(result, field, order) {
  if (!result) result = []
  if (field) {
    var obj = {}
    obj[field] = order < 0 ? 'desc' : 'asc'
    result.push(obj)
  }
  return result
}

function mongodb(result, field, order) {
  if (!result) result = {}
  if (field) result[field] = order
  return result
}

function defaultFormat(result, field, order) {
  if (!result) result = []
  if (field) result.push([ field, order ])
  return result
}

function normalize(result, field, order) {
  if (!result) result = ''
  else result += ','
  if (field) result += (order < 0 ? '-' : '') + field
  return result
}
