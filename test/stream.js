var getDb = require('./util').getDb
var test = require('tape')

test('stream', function (t) {
  t.plan(4)
  
  getDb(function (db, dispose) {
    db.put('foo', 'bar', function (err) {
      if (err) throw err
      
      db.readStream()
      .on('data', function (data) {
        t.equal(data.key, 'foo')
        t.equal(data.value, 'bar')
      })
      .on('end', function () {
        var stream = db.writeStream()
        stream.write({ key : 'bar', value : 'baz' })
        stream.on('close', function () {
          db.get('bar', function (err, value) {
            t.notOk(err)
            t.equal(value, 'baz')
            dispose()
          })
        })
        stream.end()
      })
    })
  })
})
