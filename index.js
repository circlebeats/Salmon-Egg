

module.exports = async function (fastify) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
        host     : '35.203.0.180',
        user     : 'poweruser',
        password : 'admin',
        database : 'circlebeats'
    });
    const shortid = require('shortid');
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
                console.log(results);
                reply.send(results, fields)
            }
        });
    });
    //GET SNIPCART DATA FROM DATABASE
    fastify.get('/snips', async (req,reply)=>{

        let [rows] = await connection.execute('SELECT title FROM trakz');
        let [rowsC] = await connection.execute('SELECT name,options,type FROM customFields');



        reply.send({
            name:`${rows[0].title}`,
            url: `/`,
            id: shortid.generate(),
            price: 30.01,
            customFields: rowsC
        })
    });
    //POST COMPLETED CONTACT US FORMS TO DATABASE
    fastify.post('/contact', (request,reply)=>{
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