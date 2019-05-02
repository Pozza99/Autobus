const sql = require("mssql");

const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash: true
});


const config = {
    user: 'sa',
    password: 'Vmware1!',
    server: 'localhost\\sqlexpress',
    database: 'Autobus',
    option: {
        encrypt: true
    }
};
//tutti i dati nel db
fastify.get('/api/autobus', async (request, reply) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('Select * from Posizione');
        sql.close();
        return result.recordset;
    } catch (error) {
        console.log(error);
        reply.status(404).send('Errore');

    }
});

//inserimento dei dati nel database

fastify.post('/api/autobus/', async (request, reply) => {

    let id = request.params.id;
    try {
        let res = request.body;
        let pool = await sql.connect(config);
        await pool.query`
        INSERT INTO [dbo].[Posizione]
           ([Latitudine]
           ,[Longitutdine]
           ,[Persone]
           ,[AperturaPorte]
           )
     VALUES
           (${res.Long},
            ${res.Lat},
            ${res.Persone},
            ${res.Porte}
            )
        `
        sql.close();
        reply.status(201).send('fatto');
    }
    catch (error) {
        sql.close();
        reply.status(500).send('Errore');
        console.log(error);
    }
});

const start = async () => {
    try {
        await fastify.listen(3000)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()