let url = 'http://localhost:3001/tracks';

$(function() {
  $("#TrackProduct").click(function() {
    // console.log(data);

    // get current tab
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      console.log(tabs[0].url);
    });

    // get data with ajax
    $.ajax({
      method: 'get',
      url
    })
      .done(data => console.log('done', data))
      .fail(err => console.log('err', err))

  });
});

// function checkUrl(url) {
//   if (url.search('tokopedia')) return 'tokopedia'
//   else if (url.search('bukalapak')) return 'bukalapak'
//   else return false
// };
