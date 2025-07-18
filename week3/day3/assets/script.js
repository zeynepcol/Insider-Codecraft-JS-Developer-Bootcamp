function loadAndDisplayUsers(numResults) {
  $("#cardsContainer").empty();
  if ($('#userSlider').hasClass('slick-initialized')) {
    $('#userSlider').slick('unslick');
  }
  $("#userSlider").empty();

  $.ajax({
    url: `https://randomuser.me/api/?results=${numResults}`,
    dataType: "json",
    success: function (data) {
      const colors = ['var(--color-a)', 'var(--color-b)', 'var(--color-c)', 'var(--color-d)', 'var(--color-e)', 'var(--color-f)'];
      data.results.forEach(function (user, index) {
        var cardHtml = `
          <div class="user-card" style="display:none; background-color: ${colors[index % colors.length]}" data-fancybox="user-gallery" data-src="#userModal-${user.login.uuid}">
            <div class="image-container">
              <img src="${user.picture.large}" alt="Profile Picture">
            </div>
            <div class="info-container">
              <p><strong>${user.name.first} ${user.name.last}</strong></p>
              <p>${user.email}</p>
              <p>${user.location.country}</p>
            </div>
          </div>
        `;
        $("#cardsContainer").append(cardHtml);
        $("#cardsContainer .user-card:last").slideDown(800);

        var modalHtml = `
          <div id="userModal-${user.login.uuid}" style="display:none; padding: 30px; max-width: 400px;">
            <img src="${user.picture.large}" style="width: 150px; height: 150px; border-radius: 50%;"/>
            <h2>${user.name.title} ${user.name.first} ${user.name.last}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Location:</strong> ${user.location.city}, ${user.location.country}</p>
          </div>
        `;
        $("body").append(modalHtml);

        $("#userSlider").append(`<div><img src="${user.picture.thumbnail}" alt="${user.name.first} ${user.name.last}"/></div>`);
      });

      $("[data-fancybox]").fancybox();

      $('#userSlider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        dots: true,
        arrows: true,
        responsive: [
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 768, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
      });
    }
  });
}

$(document).ready(function () {
  loadAndDisplayUsers(6);
  $("#loadUsers").click(function () {
    $(this).addClass("shake-effect");
    loadAndDisplayUsers(6);
    setTimeout(() => $(this).removeClass("shake-effect"), 500);
  });
});
