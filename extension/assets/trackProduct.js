let url = 'https://jsonplaceholder.typicode.com/posts/1';

$(function() {
  $("#TrackProduct").click(function() {
    $('#name').empty();

    console.log(data);

    // get current tab
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      console.log(tabs[0].url);
      $('#name').append(tabs[0].url);
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
