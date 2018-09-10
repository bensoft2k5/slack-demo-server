'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DBHelper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _User = require('../model/User');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DBHelper = function () {
    function DBHelper() {
        _classCallCheck(this, DBHelper);

        // this.configString = config['PG_CONNECT'];
        /*  this._pool = new Pool({
             user: process.env.USER,
             host: 'localhost',
             database: 'slackdemo',
             password: null,
             port: 5432,
             max: 400,
         }); */
        this._pool = new _pg.Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
            password: '60d6bb2b37b54132e3213d6bc8dfd6497df61c418b831decaadce4a9528fdad6',
            database: 'd90op6gho8t6jp'
        });

        /*  this._pool = new Client({
             connectionString: process.env.DATABASE_URL,
             ssl: false,
             database: 'slackdemo',
           });
            this._pool.connect(); */
    }

    // callback takes client object
    /* _connect(err, callback){
        pg.connect(this.configString, (err, client, done) => {
                
            if(err){
                    err();
                    return;
                }
            callback(client);
            done()
            return
         });
    } */

    /**
     * Executes Queries
     * 
     * @param {Callback} errCallback 
     * @param {String} query 
     * @param {Callback} callback 
     * 
     * @returns {Boolean}
     */


    _createClass(DBHelper, [{
        key: 'query',
        value: function query(_query, callback) {
            var pool = this.getPool();

            pool.query(_query.toString(), function (err, res) {
                callback(err, res);
                pool.end();
            });
        }

        /**
         * Executes Queries with config
         * 
         * @param {Callback} errCallback 
         * @param {String} query 
         * @param {Callback} callback 
         * 
         * @returns {Boolean}
         */

    }, {
        key: 'queryWithConfig',
        value: function queryWithConfig(query, callback) {
            var pool = this.getPool();

            pool.query(query, function (err, res) {
                callback(err, res);
            });

            // pool.end();
        }

        /**
         * Adds a user to database
         * 
         * @param {User} user 
         * 
         * @returns {Boolean}
         */

    }, {
        key: 'addUser',
        value: function addUser(user) {
            if (user instanceof _User.User) {
                return true;
            }
            return false;
        }
    }, {
        key: 'setUpDb',
        value: function setUpDb() {

            /**
             * Users table
             */
            var createUserTable = {
                name: 'create-users-table',
                text: 'CREATE TABLE users (' + 'id SERIAL NOT NULL primary key,' + 'name varchar(30) NOT NULL,' + 'email varchar(30) NOT NULL UNIQUE,' + 'password varchar(60) NOT NULL,' + 'timestamp timestamp' + ');' + ''
                // + 'CREATE TABLE answers ('
                // + 'id int primary key,'
                // + 'question_id int ,' // references Question(question_id)
                // + 'content varchar(80),'
                // + 'user_id int references users(user_id),'
                // + 'timestamp timestamp'
                // + ');'
                + ''
                // value: [] 
            };

            /** Question Table */
            var createQuestionQuery = {
                name: 'create-questions-table',
                text: 'CREATE TABLE questions (' + 'id SERIAL NOT NULL primary key,' + 'accepted_answer_id int,' // 
                + 'content varchar(5000) NOT NULL,' + 'user_id int NOT NULL references users(id),' + 'total_answers int DEFAULT 0,' + 'timestamp timestamp' + ');' + ''
                // value: [] 
            };

            var createQuestionCommentQuery = {
                name: 'create-qcomment-table',
                text: 'CREATE TABLE q_comments (' + 'id SERIAL NOT NULL primary key,' + 'question_id int NOT NULL references questions(id),' // 
                + 'content varchar(5000) NOT NULL,' + 'user_id int NOT NULL references users(id),' + 'timestamp timestamp' + ');' + ''
                // value: [] 
            };

            /** Answer Table  */
            /* -------- Answer Table starts here  */
            var createAnswerTable = {
                name: 'create-answers-table',
                text: 'CREATE TABLE answers (' + 'id SERIAL NOT NULL primary key,' + 'question_id int NOT NULL references questions(id),' // 
                + 'content varchar(5000) NOT NULL,' + 'up_vote int DEFAULT 0,' + 'down_vote int DEFAULT 0,' + 'user_id int NOT NULL references users(id),' + 'timestamp timestamp' + ') ;' + ''
                // value: [] 
            };

            var createAnswersCommentTable = {
                name: 'create-acomments-table',
                text: 'CREATE TABLE a_comments (' + 'id SERIAL NOT NULL primary key,' + 'answer_id int NOT NULL references answers(id),' // 
                + 'content varchar(5000),' + 'user_id int NOT NULL references users(id),' + 'timestamp timestamp' + ');' + ''
            };

            var pool = this.getPool();

            var flag = false;

            pool.query(createUserTable, function (err, res) {
                if (err) {
                    console.error(err.stack);
                    console.log("Error setting up UserTable");
                    return;
                }
                console.log("UserTable was set up succesfully");

                pool.query(createQuestionQuery, function (err, res) {
                    if (err) {
                        console.error(err.stack);
                        console.log("Error setting up QuestionQuery");
                        return;
                    }

                    console.log("QuestionQuery was set up succesfully");
                    pool.query(createQuestionCommentQuery, function (err, res) {
                        if (err) {
                            console.error(err.stack);
                            console.log("Error setting up QuestionCommentQuery");
                            return;
                        }

                        console.log("QuestionCommentQuery was set up succesfully");
                        pool.query(createAnswerTable, function (err, res) {
                            if (err) {
                                console.error(err.stack);
                                console.log("Error setting AnswerTable");
                                return;
                            }

                            console.log("AnswerTable was set up succesfully");
                            pool.query(createAnswersCommentTable, function (err, res) {
                                if (err) {
                                    console.error(err.stack);
                                    console.log("Error setting AnswersCommentTable");
                                    flag = false;
                                    return;
                                }
                                flag = true;
                                // pool.end();
                                console.log("AnswersCommentTable was set up succesfully");
                                console.log("Database was set up succesfully");
                            });
                        });
                    });
                });
            });

            return flag;
        }
    }, {
        key: 'createDatabase',
        value: function createDatabase(callback) {
            var query = {
                name: 'delete-questions',
                text: 'createdb  slackdemo'
                // values: [questionId]
            };

            //'DELETE FROM questions where id = $1;', //'DELETE FROM questions where id = $1 AND user_id = $2;',
            this.getPool().query(query, function (err, res) {
                if (err) {
                    callback(false);
                    console.log("Error creating database: \n");
                    console.error(err.stack);
                    return;
                }

                // true means query ran right;
                console.log("Database creation was Succesful");
                callback(true);
            });
        }
    }, {
        key: 'dropTables',
        value: function dropTables(callback) {

            var text = 'DROP TABLE ';
            var pool = this.getPool();

            var query = {
                name: 'drop-tables',
                text: text + " users, questions, answers, a_comments, q_comments"
                // value: ,
            };

            pool.query(query, function (err, res) {
                if (err) {
                    console.error(err.stack);
                    callback(false);
                }

                callback(true);
                console.log('Tables were removed successfully');
            });
        }
    }, {
        key: 'end',
        value: function end() {
            this._pool.end();
        }
    }, {
        key: 'getPool',
        value: function getPool() {
            return this._pool;
        }
    }, {
        key: 'tester',
        value: function tester() {
            return 'Testing DBConncter! ';
            // ${config['PG_CONNET']}
        }
    }]);

    return DBHelper;
}();

exports.DBHelper = DBHelper;
//# sourceMappingURL=DBHelper.js.map
