const mbv = require(`mailboxvalidator-nodejs`)
const axios = require('axios');

class VerificationEmailController {

    static emailVerification(req, res, next) {
        const api = `045JCSD8J80QQZ22761H`
        axios.get('https://api.mailboxvalidator.com/v1/validation/single', {
            params: {
                key: api,
                email: req.body.email
            }
        })
            .then(function (response) {
                console.log(`tes`);
                res.status(200).json(response.data)
            })
            .catch(function (error) {
                res.json(error)
            })
    }

}

module.exports = VerificationEmailController