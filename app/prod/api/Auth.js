import { Router } from 'express';
import { Factory } from '../Factory';
import { detect } from 'detect-browser';
import crypto from 'crypto';
import session from 'express-session';




// config();
let router = Router();


const factory = new Factory();
const auth = factory.getAuth();
let browser = detect();

let db = factory
    .getDbc();


/**
 *  This endpoint authenticates a user using th user's password and email 
 *  (Note: change method from get to post)
 *  PAYLOAD:
 * @method POST
 * @param String email
 * @param String password
 * 
 * @returns JSON
 */
router.post('/login', (req, res) => {

    let email = req.body.email.toString();
    let password = req.body.password.toString();

    auth.login(email, password, (flag, data) => {

        if (flag) {

            if (typeof data !== 'undefined') {
                // create session here 
                let footPrint = auth.createFootprint(email, password);
                req.session.footPrint = footPrint;
                req.session.user = {
                    email,
                    id: data[0].id,
                    footPrint,
                };

                console.log(req.session.user.id);
                
                console.log("footprint", req.session.footPrint)

                res.json({
                    msg: "Login Succesful",
                    status: true,
                    userId: data[0].id
                });
                return;

            }

            res.json({
                msg: "Login Error: Could not get user",
                status: false,
            });

            return;
        }
        if (flag === 'undefined' || flag == false) {
            res.json({
                msg: "Login Error: please check credentials ",
                status: false,
            });
        }

    });

});

/**
 * This endpoint create a user account
 * 
 * @method POST
 * 
 * @param String email
 * @param String password
 * 
 * @return JSON 
 */
router.post('/signup', (req, res) => {

    // TODO validate and clean user date

    let name = req.body.name.toString();
    let email = req.body.email.toString();
    let password = req.body.password.toString();

    console.log(`parameters: ${name, email, password}`);

    auth
        .signUp(name, email, password, (flag, data) => {
            if (flag) {

                console.log("Value" + data);
                if (typeof data !== 'undefined') {
                    console.log("Value" + data);

                    // create session here 
                    let footPrint = auth.createFootprint(email, password);
                    req.session.footPrint  = footPrint;

                    req.session.user = {
                        email,
                        id: data[0].id,
                        footPrint,
                    };
                    console.log("footprint", req.session.footPrint)
                    res.json({
                        msg: "Sign Up Succesful",
                        status: true,
                        userId: data[0].id

                    });
                    return;
                }

                res.json({
                    msg: "Login Error: Could not retrive user creds",
                    status: false,
                });

                return;

            }

            res.json({
                msg: "Login Error: please check credentials ",
                status: false,
            });
        });

});

router.get('/dbsetup/:key', (req, res) => {

    // let key = req.params.key.toString();

    // if (key ===  "123"){




    // let createDb = db.createDatabase();

    // set up db
    let result = db
        .setUpDb();




    if (result) {
        res.json({
            msg: true,
        });
    }

    res.json({
        msg: false,
    });


    // }
});


router.get('/cleardb', (req, res) => {

    db.dropTables((result) => {
        if (result != false) {

            res.json({
                msg: 'success',
                status: false,
            });
            return;
        }

    });

    res.json({
        msg: 'error',
        status: false,
    });

});


router.get('/crypto', (req, res) => {

    let email = 'bensoft2k5@gmail.com';
    let password = 'admin';



    const footPrint = email + password + browser.name + browser.os + browser.version;
    const cipher = crypto.createCipher('aes192', email);
    const decipher = crypto.createDecipher('aes192', email);

    let encrypted = cipher.update(footPrint, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log("Encrypted: " + encrypted);


   
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log("Decrypted: " + decrypted);

    req.session.footprint = encrypted;
    let sessionFootPrint = req.session.footprint;

    if (sessionFootPrint === 'undefined'){
        res.send(500, "invalid session"); 
        return;
    }

    res.json({
        encrypted,
        decrypted,
        footprint: req.session.footprint,
        });

});


router.get('/footprint', (req, res) => {
    res.send(req.session.footprint);
})



module.exports = router;
