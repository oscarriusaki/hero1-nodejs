const express = require('express');
const cors = require('cors');
const pool = require('../database/config');

class Server{
    
    constructor(){
        
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            user: '/user',
            login: '/login',
            heroe: '/heroe',
            error: '/',
        }

        // database
        this.database();
        // middlewares
        this.middlewares();
        // routes
        this.routes();
        
    }
    async database(){
        await pool;

        try{

            pool.connect(( err, result, release) => {
                
                if(err){
                    return console.error(err);
                }else{
                    console.log('connect');
                }
            })

        } catch(err){
            console.log(err);
        }
        // pool.end();
    }
    middlewares(){
        // cors
        this.app.use(cors());
        // leer datos tipos json
        this.app.use(express.json());
        // archivo public
        this.app.use(express.static('public'));
    }
    routes(){
        
        this.app.use(this.path.user, require('../routes/user'));
        this.app.use(this.path.login, require('../routes/login'));
        this.app.use(this.path.heroe, require('../routes/heroe'))
        this.app.use(this.path.error, require('../routes/errors'));

    }
    listen(){
        this.app.listen(this.port, () => {
            console.log(`server running at ${this.port}`);
        });
    }

}

module.exports = Server;