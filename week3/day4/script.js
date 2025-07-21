$(document).ready(function () {
  const API_URL = "https://fakestoreapi.com";
  const productList = $(".product-grid");
  const toastBox = $("#toastMsg");
  const cartKey = "cartItems";
  const favKey = "favItems";

  let allProducts = [];
  let shownCount = 0;
  const batchSize = 9;

  const debounce = (fn, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  $.ajax({
    url: `${API_URL}/products`,
    method: "GET",
    success: function (data) {
      allProducts = data;
      loadMoreProducts();
      renderCarousel(data);
    },

    error: function () {
      showToast("Error loading profile data!", "error");
    },
  });

  const renderCarousel = (products) => {
    const html = products
      .slice(0, 3)
      .map(
        (product) => `
        <div class="swiper-slide">
          <h3 class="product-title truncate-multi">${product.title}</h3>
          <img src="${product.image}" alt="${product.title}" />
        </div>`
      )
      .join("");

    $(".carousel-wrapper").html(`
    <div class="swiper">
      <div class="swiper-wrapper">
        ${html}
      </div>
      <div class="swiper-pagination"></div>
    </div>
  `);

    new Swiper(".swiper", {
      loop: true,
      autoplay: {
        delay: 1000,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  };

  const createCard = (product) => {
    const cartProducts = JSON.parse(localStorage.getItem(cartKey)) || [];
    const favProducts = JSON.parse(localStorage.getItem(favKey)) || [];

    const isAddedToCart = cartProducts.includes(product.id);
    const isFaved = favProducts.includes(product.id);

    return `
          <div class="product-card" data-id="${product.id}">
            <div class="product-image">
              <img src="${product.image}" alt="${product.title}" />
            </div>
            <div class="product-info">
              <p class="product-category truncate-single">${product.category}</p>
              <h3 class="product-title truncate-multi">${product.title}</h3>
              <p class="product-desc truncate-multi">${product.description}</p>
              <div class="product-footer">
                <div class="product-prices">
                  <h4 class="new-price">${product.price} TL</h4>
                </div>
                <div class="product-rate">
                  <i class="fa fa-star"></i>
                  <span class="rate">${product.rating.rate}</span>
                </div>
              </div>
              <div class="product-actions">
                <button class="action-btn open-detail-btn">
                  <i class='fas fa-info-circle'></i> Detail
                </button>
                <button class="action-btn add-basket-btn">
                  ${
                    isAddedToCart
                      ? "<i class='fa fa-cart-arrow-down'></i> Added to Cart"
                      : "<i class='fa fa-cart-plus'></i> Add to Cart"
                  }
                </button>
              </div>
            </div>
            <div class="status">In Stock</div>
            <button class="add-favorite-btn ${isFaved ? "added" : ""}">
              <i class="far fa-heart"></i>
              <i class="fas fa-heart"></i>
            </button>
          </div>`;
  };

  const loadMoreProducts = () => {
    const slice = allProducts.slice(shownCount, shownCount + batchSize);

    slice.forEach((product, i) => {
      productList.append(
        $(createCard(product))
          .css({ opacity: 0 })
          .delay(i * 100)
          .animate({ opacity: 1 }, 300)
      );
    });

    shownCount += slice.length;

    if (shownCount >= allProducts.length) {
      $("#loadMoreBtn").replaceWith(`<p>All products shown.</p>`);
    }
  };

  const renderFancyboxList = (type = "cart") => {
    const key = type === "cart" ? cartKey : favKey;
    const title = type === "cart" ? "My Cart" : "My Favorites";
    const data = JSON.parse(localStorage.getItem(key)) || [];

    let html = `
      <div class='modal-wrapper'>
        <h2 class='modal-title'>${title}</h2>
    `;

    if (data.length === 0) {
      html += `<p class="empty-message">No Products</p>`;
    } else {
      html += `<div class='modal-products'>`;
      html += data
        .map((id) => {
          const findProduct = allProducts.find((p) => p.id === id);
          if (!findProduct) return "";
          return `
          <div class="product-item">
            <img src="${findProduct.image}" alt="${findProduct.title}" class="item-image">
            <div class="item-info">
              <div class="item-texts">
                <h3 class="product-title">${findProduct.title}</h3>
                <p class="product-category">${findProduct.category}</p>
                <h4 class="item-price">${findProduct.price}₺</h4>
              </div>
              <button class="remove-btn" data-id="${findProduct.id}" data-key="${key}">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>`;
        })
        .join("");
      html += `</div>`;
      html += `<button class="clear-fancybox-btn" id="clearFancyboxData" data-key="${key}">Clear</button>`;
    }
    html += `</div>`;
    Fancybox.show([{ src: html, type: "html" }]);
  };

  const showToast = (message, type = "info") => {
    toastBox
      .text(message)
      .removeClass()
      .addClass("toast-msg " + type)
      .fadeIn(300);
    setTimeout(() => toastBox.fadeOut(500), 2000);
  };

  $(document).on("click", ".open-detail-btn", function () {
    const card = $(this).closest(".product-card");
    const clonedCard = card.clone();
    clonedCard
      .find(".add-basket-btn, .add-favorite-btn, .open-detail-btn")
      .remove();
    clonedCard.find(".product-desc").removeClass("truncate-multi");

    Fancybox.show([
      {
        src: `
        <div class="modal-wrapper">
          ${clonedCard.prop("outerHTML")}
        </div>`,
        type: "html",
      },
    ]);
  });

  $(document).on("click", ".add-basket-btn", function () {
    const id = $(this).closest(".product-card").data("id");
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (!cart.includes(id)) {
      cart.push(id);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      $(this).html("Added to Cart  <i class='fa fa-cart-arrow-down'></i>");
      showToast("Product Added to Cart", "success");
    } else {
      showToast("Product Already in the Cart", "info");
    }
  });

  $(document).on("click", ".add-favorite-btn", function () {
    const id = $(this).closest(".product-card").data("id");
    let favs = JSON.parse(localStorage.getItem(favKey)) || [];
    const index = favs.indexOf(id);

    if (index === -1) {
      favs.push(id);
      $(this).addClass("added");
      showToast("Product Added to Favorites", "success");
    } else {
      favs.splice(index, 1);
      $(this).removeClass("added");
      showToast("Product Removed from Favorites", "info");
    }

    localStorage.setItem(favKey, JSON.stringify(favs));
  });

  $(document).on("click", ".remove-btn", function () {
    const key = $(this).data("key");
    const id = $(this).data("id");

    const localData = JSON.parse(localStorage.getItem(key)) || [];

    if (localData.includes(id)) {
      const filteredData = localData.filter((d) => d !== id);
      localStorage.setItem(key, JSON.stringify(filteredData));
      showToast("The product has been deleted from the list!", "success");
      Fancybox.close();
      renderFancyboxList(key === cartKey ? "cart" : "fav");
    } else {
      showToast("Product Not Found!", "error");
    }
  });


  $(".basket-btn").on("click", () => renderFancyboxList("cart"));
  $(".fav-btn").on("click", () => renderFancyboxList("fav"));

  $(document).on("click", "#clearFancyboxData", function () {
    const key = $(this).data("key");
    localStorage.removeItem(key);
    showToast("List Cleared", "info");
    Fancybox.close();
  });

  $(document).on("click", "#loadMoreBtn", loadMoreProducts);
});
