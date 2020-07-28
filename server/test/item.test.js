const app = require('../app.js');
const request = require('supertest');
const Item = require('../models/track');
const axios = require('axios')
const scrapper = require('../scrapers/scrapper')


const newItem = {
  url: "https://www.tokopedia.com/snackneng/chiki-ball-balls-keju-ayam-coklat-free-bubble-wrap-ayam",
  imageUrl: "https://ecs7.tokopedia.net/img/cache/700/VqbcmM/2020/7/14/386d6f73-3821-46a5-b386-338f6856d403.jpg",
  storeName: "Toko Awan",
  stock: ">4121",
  time: new Date(),
  price: "Rp405.000",
  targetPrice: null,
  email: null
}
let currentItemId

let url = "https://www.tokopedia.com/headtotwo/garage-sale-preloved-cocolatte-carseat-omniguard?src=topads"

// jest.mock('axios')

// test('test should get data', () => {
//   // if (url.search("tokopedia") !== -1) {
//     // const tokopedia = url.replace(/m.tokopedia/g, "www.tokopedia");
//     const data = {
//       name,
//       price: Number(price.match(/\d+/g).join("")),
//       store,
//       stock: stock.split(",")[0],
//       date: new Date(),
//     }
//   // } else {

//   // }

//     axios.get.mockResolvedValue(resp);

//     // or you could use the following depending on your use case:
//     // axios.get.mockImplementation(() => Promise.resolve(resp))

//     return Users.all().then(data => expect(data).toEqual(users));
//   });

describe('Track', () => {
  // beforeAll((done) => {
  //   Item.deleteMany({})
  //     .then(_ => { done() })
  //     .catch(err => { done(err) })
  // })

  // afterAll(done => {
  //   Item.deleteMany({})
  //     .then(_ => done())
  //     .catch(err => done(err))
  // })

  describe('Successful Tracking', () => {
    describe('Add Item Tracking', () => {
      test('Response code 201 with object item data and string message', (done) => {
        request(app)
          .post('/tracks')
          .send(newItem)
          .end((err, response) => {
            if (err) return done(err)
            else {
              // const { Item } = response.body
              const { body, status, error } = response
              // console.log(error)
              expect(status).toBe(201)
              expect(body.data).toHaveProperty('_id', expect.any(String))
              currentItemId = body.data._id
              // console.log('>>>>>>>>', currentItemId)
              expect(body.data).toHaveProperty('url', newItem.url)
              expect(body.message).toHaveProperty('message', 'Item has been successfully tracked!')
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
        newItem.url = invalidUrl
        request(app)
          .post('/tracks')
          .send(newItem)
          .end((err, response) => {
            if (err) return done(err)
            else {
              const { body, status, error } = response
              // console.log(body)
              expect(status).toBe(400)
              // expect(response.body).toHaveProperty('type', "Bad Request")
              expect(body).toHaveProperty('message', "Invalid url format!")
              return done()
            }
          })
      })
    })
  })

  describe('Failed Tracking', () => {
    describe('Unsupported url', () => {
      // Invalid email address format
      test('Response code 400 bad request', (done) => {
        let unsupportedUrl = "https://shopee.co.id/"
        newItem.url = unsupportedUrl
        request(app)
          .post('/tracks')
          .send({ url: unsupportedUrl })
          .end((err, response) => {
            if (err) return done(err)
            else {
              const { body, status, error } = response
              expect(status).toBe(400)
              // expect(response.body).toHaveProperty('type', "Bad Request")
              expect(body).toHaveProperty('message', "This website is not supported with our app")
              return done()
            }
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
    it('responds 200 and receive an object', function (done) {
      request(app)
        .get(`/tracks/${currentItemId}`)
        .then(response => {
          // console.log(response)
          const { body, status } = response
          // console.log(body)
          expect(status).toBe(200)
          expect(body).toHaveProperty('_id', expect.any(String))
          expect(body).toHaveProperty('url', "https://www.tokopedia.com/snackneng/chiki-ball-balls-keju-ayam-coklat-free-bubble-wrap-ayam")
          expect(body).toHaveProperty('storeName', newItem.storeName)
          expect(body).toHaveProperty('currentPrice', 405000)
          done()
        })
    });
  });
  it('responds 400 id not found', function (done) {
    let idNotFound = "5f1ab124d6e5ce33c52ea563"
    request(app)
      .get(`/tracks/${idNotFound}`)
      .then(response => {
        // console.log(response)
        const { body, status } = response
        // console.log(body)
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', "Id not found")

        done()
      })
  });
});

describe('PUT /tracks/:id', function () {
  it('responds 200 in put and receive an object', function (done) {
    request(app)
      .put(`/tracks/${currentItemId}`)
      .send({ email: "lala@mail.com", targetPrice: 454000, pushNotif: "false", priceChangeNotif: "false" })
      .then(response => {
        const { body, status } = response
        expect(status).toBe(200)
        expect(body).toHaveProperty('message', 'Item has been successfully updated!')
        done()
      })
  });
  it('responds 200 in put for sending boolean type data and receive an object', function (done) {
    request(app)
      .put(`/tracks/${currentItemId}`)
      .send({ email: "lala@mail.com", targetPrice: null, pushNotif: true, priceChangeNotif: "true" })
      .then(response => {
        const { body, status } = response
        expect(status).toBe(200)
        expect(body).toHaveProperty('message', 'Item has been successfully updated!')
        done()
      })
  });
  it('responds 400 id not found', function (done) {
    let idNotFound = "5f1ab124d6e5ce33c52ea563"
    request(app)
      .put(`/tracks/${idNotFound}`)
      .send({ email: "shiioriseki@gmail.com", targetPrice: null, pushNotif: "true", priceChangeNotif: "false" })
      .then(response => {
        const { body, status } = response
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', "Id not found")
        done()
      })

  })


  describe('DELETE /tracks/:id', function () {
    it('responds 200 and receive message successfuly delete', function (done) {
      request(app)
        .delete(`/tracks/${currentItemId}`)
        .then(response => {
          const { body, status, error } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty('message', "Success to delete item!")

          done()
        })
    });
    it('responds 400,id not found', function (done) {
      let noId = "dmancan42423"
      request(app)
        .delete(`/tracks/${noId}`)
        .then(response => {
          const { body, status, error } = response
          // console.log(body)
          expect(status).toBe(400)
          expect(body).toHaveProperty('message', "Id not found")

          done()
        })
    });

  });



})

