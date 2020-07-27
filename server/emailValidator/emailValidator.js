const axios = require('axios');

async function emailValidator(email) {

    const api = `045JCSD8J80QQZ22761H`

    try {
        const response = await axios.get('https://api.mailboxvalidator.com/v1/validation/single', {
            params: {
                key: api,
                email: email
            },
            adapter: require('axios/lib/adapters/http'),
        })
        // console.log('>>>>>', response.data.is_verified)
        return response.data.is_verified
    } catch (error) {
        // return error
    }

}

module.exports = emailValidator