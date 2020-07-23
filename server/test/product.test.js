const app = require('../app.js');
const request = require('supertest');
const Item = require('../models/item.js');

let url = "https://www.tokopedia.com/snackneng/chiki-ball-balls-keju-ayam-coklat-free-bubble-wrap-ayam";
let targetPrice = "50000";

describe('Track', () => {
  beforeAll((done) => {
    Item.deleteMany({ })
      .then(_=> { done() })
      .catch(err => { done(err) })
  })

  afterAll(done => {
    Item.deleteMany({ })
      .then( _=> done())
      .catch(err => done(err))
  })

  describe('Successful Tracking', () => {
    describe('Add Item Tracking', () => {
      test('Response code 201 with object item data and string message', (done) => {
        request(app)
          .post('/track')
          .send({ url })
          .end((err, response) => {
            if (err) return done(err)
            else {
              const { Item } = response.body
              expect(response.status).toBe(201)
              expect(Item).toHaveProperty('_id', expect.any(String))
              expect(Item).toHaveProperty('url', url)
              expect(response.body).toHaveProperty('message', 'Item has been successfully tracked!')
              return done()
            }
        })
      })
    })

    describe('Add Item and Target Price', () => {
      test('Response code 201 with object item data and string message', (done) => {
        request(app)
          .post('/track')
          .send({ url, targetPrice })
          .end((err, response) => {
            if (err) return done(err)
            else {                           
              const { Item } = response.body
              expect(response.status).toBe(201)
              expect(Item).toHaveProperty('_id', expect.any(String))
              expect(Item).toHaveProperty('url', url)
              expect(Item).toHaveProperty('targetPrice', targetPrice)
              expect(response.body).toHaveProperty('message', 'Item has been successfully tracked!')
              return done()
            }
        })
      })
    })

    describe('Add Item and Target Price with Email', () => {
      test('Response code 201 with object item data and string message', (done) => {
        let email = "admin@hareuga.com"
        request(app)
          .post('/track')
          .send({ url, targetPrice, email })
          .end((err, response) => {
            if (err) return done(err)
            else {
              const { Item } = response.body
              expect(response.status).toBe(201)
              expect(Item).toHaveProperty('_id', expect.any(String))
              expect(Item).toHaveProperty('url', url)
              expect(Item).toHaveProperty('targetPrice', targetPrice)
              expect(Item).toHaveProperty('email', email)
              expect(response.body).toHaveProperty('message', 'Item has been successfully tracked!')
              return done()
            }
        })
      })
    })

  })

  describe('Failed Tracking', () => {
    describe('Invalid url format', () => {
      // Invalid email address format
      test('Response code 400 bad request', (done) => {
        let invalidUrl = "invalidUrl"
        request(app)
          .post('/track')
          .send({ url: invalidUrl })
          .end((err, response) => {
            if (err) return done(err)
            else {                            
              expect(response.status).toBe(400)
              expect(response.body).toHaveProperty('type', "Bad Request")
              expect(response.body).toHaveProperty('message', "Invalid email address format")
              return done()
            }
        })
      })
    })

    describe("Invalid targetPrice format", () => {
      // targetPrice cannot be converted into integer by Number(targetPrice)
      test('Response code 400 bad request', (done) => {
        let invalidTargetPrice = "Rp.30000"
        request(app)
          .post('/track')
          .send({ url, targetPrice: invalidTargetPrice })
          .end((err, response) => {
            if (err) return done(err)
            else {
              expect(response.status).toBe(400)
              expect(response.body).toHaveProperty('type', "Bad Request")
              expect(response.body).toHaveProperty('message', "Invalid target price format")
              return done()
            }
          })
      })
    })

    describe('Invalid email address', () => {
      // Invalid email address format
      test('Response code 400 bad request', (done) => {
        let invalidEmail = "budimail.ru"
        request(app)
          .post('/track')
          .send({ url, targetPrice, email: invalidEmail })
          .end((err, response) => {
            if (err) return done(err)
            else {
              expect(response.status).toBe(400)
              expect(response.body).toHaveProperty('type', "Bad Request")
              expect(response.body).toHaveProperty('message', "Invalid email address format")
              return done()
            }
        })
      })
    })

  })

})