document.getElementById("TrackProduct").addEventListener('click', () => {
  console.log("Popup DOM fully loaded and parsed");

  function modifyDOM() {
    let currentUrl = document.URL
    console.log(currentUrl.substring(0, currentUrl.indexOf("?")))
    // if (result.indexOf('?') > 0) result = result.substring(0, uri.indexOf("?"));

    //You can play with your DOM here or check URL against your regex
    console.log('Tab script:');
    // console.log(document.getElementsByTagName("img")[1]);
    let results = document.getElementsByTagName("img")
    console.log(results[1].src)
    let result = String(results[1].src)
    // DOM cannot be passed
    return result;
  };

  //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
  chrome.tabs.executeScript({
      code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
  }, (results) => {
      //Here we have just the innerHTML and not DOM structure
      console.log('Popup script:')
      console.log('results', results[0]);
  });
});