const app = require('../app.js');
const request = require('supertest');
const Item = require('../models/track');

let url = "https://www.tokopedia.com/snackneng/chiki-ball-balls-keju-ayam-coklat-free-bubble-wrap-ayam";
let targetPrice = "50000";

describe('Track', () => {
  // beforeAll((done) => {
  //   Item.deleteMany({ })
  //     .then(_=> { done() })
  //     .catch(err => { done(err) })
  // })

  // afterAll(done => {
  //   Item.deleteMany({ })
  //     .then( _=> done())
  //     .catch(err => done(err))
  // })

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

describe('GET /tracks', function () {
  it('responds 200 and receive array of object', function (done) {
    request(app)
      .get('/tracks')
      .then(response => {
        // console.log(response)
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toEqual(expect.any(Array))

        done()
      })
  });
});

describe('GET /tracks/:id', function () {
  it('responds 200 and receive array of object', function (done) {
    request(app)
      .get(`/tracks/${currentProductId}`)
      .set('access_token', tokens)
      .then(response => {
        // console.log(response)
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toHaveProperty('name', 'boneka')
        expect(body).toHaveProperty('image_url', "jncjkbcja")
        expect(body).toHaveProperty('price', 1000)
        expect(body).toHaveProperty('stock', 5)

        done()
      })
  });
});

describe('PUT /tracks/:id', function () {
  it('responds 200 in put and receive an object', function (done) {
    request(app)
      .put(`/products/${currentProductId}`)
      .set('access_token', tokens)
      .send({ name: 'boneko', image_url: "jncjkbcja", price: 3000, stock: 5 })
      .then(response => {
        const { body, status } = response
        expect(status).toBe(200)
        expect(body).toHaveProperty('name', 'boneko')
        expect(body).toHaveProperty('image_url', "jncjkbcja")
        expect(body).toHaveProperty('price', 3000)
        expect(body).toHaveProperty('stock', 5)
        done()
      })
  });
  it('responds 400 in put and receive message Stock must not minus', function (done) {
    request(app)
      .put(`/tracks/${itemId}`)
      .send({ name: 'boneka', image_url: "jncjkbcja", price: 4000, stock: -4 })
      .set('access_token', tokens)
      .then(response => {
        const { status, body } = response
        // console.log(error)
        expect(status).toBe(400)
        expect(body).toEqual({ error: "SequelizeValidationError", message: expect.arrayContaining(["Stock must not minus"]) })
        done()
      });
  });




  describe('DELETE /tracks/:id', function () {
    it('responds 200 and receive message successfuly delete', function (done) {
      request(app)
        .delete(`/tracks/${itemId}`)
        .then(response => {
          const { body, status, error } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty('message', "Success to delete item!")

          done()
        })
    });
    it('responds 400,failed to acquired params', function (done) {
      request(app)
        .delete(`/tracks/:${itemIdd}`)
        .then(response => {
          const { body, status, error } = response

          expect(status).toBe(400)
          expect(error).toHaveProperty('message')

          done()
        })
    });

  });
})
