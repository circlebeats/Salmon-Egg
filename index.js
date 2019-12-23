const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : '35.203.0.180',
    user     : 'poweruser',
    password : 'admin',
    database : 'circlebeats'
});

module.exports = async function (fastify) {
    // POST BEAT DATA TO DATABASE
    fastify.post('/beatsFull', async (request,reply)=>{
        let addUrl = `http://35.203.87.148:80/beats/mp3/${request.body.title}`
        connection.query( 'insert into trakz (title, producer, bpm, userTag1, userTag2, url, filterTag1, filterTag2,genre) values (?,?,?,?,?,?,?,?,?)',[request.body.title,request.body.producer,request.body.bpm,request.body.userTag1,request.body.userTag2,addUrl,request.body.filterTag1,request.body.filterTag2,request.body.genre], function (err,result) {
            if(err){
                reply.send(err).code(400)
            }else {
                reply.send({
                    db:'Successfully added to DB',
                    result:`${result}`
                })
            }
        })
    })
    //GET BEAT DATA FROM DATABASE
    fastify.get('/beatsFull', async (request,reply)=>{
        await connection.query('SELECT fid, title, producer, plays, bpm, userTag1, userTag2, filterTag1, filterTag2, url,genre FROM trakz', function (error, results, fields) {
            if (error) {

            }else {
                console.log(results)
                reply.send(results, fields)
                //connection.end();
            }
        });
    })
    //POST COMPLETED CONTACT US FORMS TO DATABASE
    fastify.post('/contact', async (request,reply)=>{
        connection.query( 'insert into contact (title, email, message) values (?,?,?)',[request.body.title,request.body.email,request.body.message], function (err,result) {
            if(err){
                reply.send(err).code(400)
            }else {
                reply.send({
                    db:'Successfully added to DB',
                    result:`${result}`,
                    code: '1'
                })
            }
        })
    })
}