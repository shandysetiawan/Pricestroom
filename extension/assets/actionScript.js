// This function will have access to browser DOM
function searcDOM() {
  console.log('Tab script:', document.body);
  let currentUrl, imageUrl, storeName, price, stock, name;

  // We can play with DOM or validate URL here
  currentUrl = document.URL;

  if (currentUrl.search("tokopedia.com") > 0 || currentUrl.search("bukalapak.com") > 0) {
    if (currentUrl.indexOf("?") > 0) currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"))

    // DOM cannot be passed to extension directly
    let imgDOMs = document.getElementsByTagName("img")

    /* -----TOKOPEDIA----- */
    if (currentUrl.search("www.tokopedia.com") > 0) {
      imageUrl = String(imgDOMs[1].src)
      
      let imageElement, storeNameElement, priceElement, stockElement, nameElement;
      imageElement = "[data-testid='PDPImageMain']";
      priceElement = "[data-testid='lblPDPDetailProductPrice']"; // lblPDPFooterTotalHargaProduk
      nameElement = "[data-testid='lblPDPDetailProductName']";
      stockElement = "[data-testid='lblPDPDetailProductStock']";
      storeNameElement = "[data-testid='llbPDPFooterShopName']";

      price = document.querySelectorAll(priceElement)[0].textContent
      name = document.querySelectorAll(nameElement)[0].textContent
      stock = document.querySelectorAll(stockElement)[0].textContent
      storeName = document.querySelectorAll(storeNameElement)[0].textContent

      // let nameDOMs = document.getElementsByTagName("h1")
      // name = nameDOMs[0].textContent;

      // let DOMS = document.getElementsByTagName("h3")
      // price = DOMS[0].textContent;

    /* -----BUKALAPAK----- */
    } else if (currentUrl.search("bukalapak.com") > 0) {
      imageUrl = String(imgDOMs[4].src);
      let scriptElement = 'script[type="application/ld+json"]';
      // let scriptString = $(`${scriptElement}`)[1].children[0].data;
      let scripts = document.querySelectorAll(scriptElement)
      let scriptObject = JSON.parse(scripts[2].innerText)
      if (currentUrl.search("m.bukalapak") > 0) scriptObject = JSON.parse(scripts[1].innerText)
      let { image, url, offers } = scriptObject
      let { lowPrice, seller, offerCount } = offers
      imageUrl = image
      currentUrl = url
      name = scriptObject.name
      price = lowPrice
      storeName = seller.name
      stock = offerCount
    } else {
      return false
    }

    console.log('currentUrl', currentUrl)
    console.log('imageUrl', imageUrl)    
    console.log('name', name)
    console.log('price', price)
    console.log('stock', stock)
    console.log('storeName', storeName)

    return { url: currentUrl, imageUrl, price, storeName, stock, name };
  } else {
    return false;
  }
};

// The following function will have access to extension
// We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
// argument here is a string but function.toString() returns function's code
chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' },
  (response) => {
    console.log('Popup script:');

    $('#previewImage').attr("src", "");
    $('#notFound').empty();
    if (!response[0]) {
      $('#TrackProduct').attr("disabled", true);
      $('#notFound').append(
        `<p class='small'>Sorry, currently our service is not available for this page.</p>
        <p>Try visiting specific product site on tokopedia.com or bukalapak.com</p>`
      );
    } else {
      $('#TrackProduct').attr("disabled", false);
      $('#previewImage').attr("src", response[0].imageUrl);
    }
});

$("#TrackProduct").click(function() {
  chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' },
  (response) => {
    console.log('Popup script:');
    $('#previewImage').attr("src", "");
    $('#MainTableBody').empty();
    $('#notFound').empty();
    
    if (!response[0]) {
      $('#notFound').append(
        `<p class='small'>Sorry, currently our service is not available for this page.</p>
        <p>Try visiting specific product site on tokopedia.com or bukalapak.com</p>`
      );
    } else {
      const data = response[0]
      console.log('actionScript', data);
      $.ajax({
        method: 'post',
        url,
        data
      })
        .done(data => console.log('POST done', data))
        .fail(err => console.log('POST err', err))
      $('#previewImage').attr("src", data.imageUrl);

    }
  });

});

// Watch changes in chrome.storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

// Append table everytime extension started
appendTable();
function appendTable() {
  $('#MainTableBody').empty()
  chrome.storage.sync.get(['newData', 'data'], function(result) {
    const { data, newData } = result;
    console.log('data', data)
    data.map(item => {
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
