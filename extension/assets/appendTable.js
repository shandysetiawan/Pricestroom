// Append table everytime extension started
appendTable();
function appendTable() {
  $('#MainTableBody').empty()
  chrome.storage.sync.get(['newData', 'data'], function(result) {
    const { data, newData } = result;
    console.log('data', data)
    if (data) data.map(item => {
      let { name, currentPrice, initialPrice } = item
      name = "default"
      $('#MainTableBody').append(
        `<tr>
          <td>${ name }</td>
          <td class="text-right">${ initialPrice }</td>
          <td class="text-right">${ currentPrice }</td>
        </tr>`
      );
    })
    console.log('newData', newData);
  });  
};

$("#ClearButton").click(function() {
  $('#MainTableBody').empty()
  chrome.storage.sync.clear(function(response) {
    let { lastError } = chrome.runtime;
    if (lastError) {
        console.error(error);
    } else console.log(response)
  });
})

$("#SetButton").click(function() {
  let data = [
    {
      "_id": "5f1aed5c361a46576fd582a3",
      "url": "https://www.tokopedia.com/trugoods07/foldable-cup-premium-tru-goods-gelas-kopi-lipat-475-ml-green-hijau",
      "imageUrl": "https://ecs7.tokopedia.net/img/cache/700/attachment/2020/7/24/32520341/32520341_b0963c22-502a-44af-ae68-735048c8d2d9.jpg.webp",
      "storeName": "Tru_Goods",
      "initialPrice": 86250,
      "currentPrice": 86500,
      "history": [
        {
          "time": "2020-07-24T14:17:00.158Z",
          "price": 86250,
          "stock": "Tersedia"
        }
      ],
      "targetPrice": null,
      "email": null
    },
    {
      "_id": "5f1aee0a361a46576fd582a6",
      "url": "https://www.tokopedia.com/jack-zhop/travel-bag-tas-kosmetik-3-lapis-organizer-tas-multi-fungsi-omg-japan",
      "imageUrl": "https://ecs7.tokopedia.net/img/cache/700/attachment/2020/7/24/32520341/32520341_c0cfe360-b3b6-4aad-af93-0c86d12c11d7.jpg.webp",
      "storeName": "Jack-Zhop",
      "initialPrice": 26000,
      "currentPrice": 24000,
      "history": [
        {
          "time": "2020-07-24T14:19:54.121Z",
          "price": 24000,
          "stock": "Tersedia"
        }
      ],
      "targetPrice": null,
      "email": null
    },
    {
      "_id": "5f1b0fb2c7979f58691b6431",
      "url": "https://www.tokopedia.com/toleda/toleda-smartband-m4-smartbracelet-anti-air-support-android-dan-iphone-hitam",
      "imageUrl": "https://ecs7.tokopedia.net/img/cache/700/product-1/2020/6/5/47811335/47811335_f775842f-3d64-4ccb-a1dc-c91a86286f42_700_700.webp",
      "storeName": "Toleda Indonesia",
      "initialPrice": 89000,
      "currentPrice": 81000,
      "history": [
        {
          "time": "2020-07-24T16:43:30.599Z",
          "price": 89000,
          "stock": ""
        }
      ],
      "targetPrice": null,
      "email": null
    }
  ]
  
  chrome.storage.sync.set({ data, newData: 'newData' }, function() {
    appendTable();
  });
})
