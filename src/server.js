let app = require('./app')
var cors = require('cors')

app.use(cors({}))

//socket io for game
let server = require('http').createServer(app)
let io = require('socket.io').listen(server)
require('./socket')(io)

io.origins()

server.listen(process.env.PORT || 2409, () => {
  console.log('Server listening on port 2409')
})
