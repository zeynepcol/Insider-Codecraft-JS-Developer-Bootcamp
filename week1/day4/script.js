    function toggleMenu() {
      document.getElementById("navLinks").classList.toggle("active");
    }

    function toggleFavorite() {
      const btn = document.getElementById("favBtn");
      btn.classList.toggle("favorited");
      btn.innerText = btn.classList.contains("favorited") ? "💖 Favorilere Eklendi" : "❤️ Favorilere Ekle";
    }
