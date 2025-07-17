$(document).ready(function () {
  let start = 0;
  const limit = 5;
  let isLoading = false;

  function loadPosts() {
    if (isLoading) return;
    isLoading = true;
    $('#loader').removeClass('hidden');

    $.get(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
      .done(function (data) {
        data.forEach(post => {
          const $li = $(`
            <li>
              <h3>${post.title}</h3>
              <p>${post.body}</p>
            </li>
          `);

          $li.on('mouseover', function () {
            $(this).css('background-color', '#eef6ff');
          });

          $li.on('mouseout', function () {
            $(this).css('background-color', '#fff');
          });

          $('#postList').append($li);
        });
        start += limit;
      })
      .fail(function () {
        $('#error').removeClass('hidden');
      })
      .always(function () {
        isLoading = false;
        $('#loader').addClass('hidden');
      });
  }

  loadPosts();

  $(window).on('scroll', function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
      loadPosts();
    }
  });
});
