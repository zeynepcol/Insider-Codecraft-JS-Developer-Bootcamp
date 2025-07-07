const user = {
  isim: prompt("Adınız:"),
  yas: prompt("Yaşınız:"),
  meslek: prompt("Mesleğiniz:")
};

console.log("👤 Kullanıcı Bilgileri:", user);

const sepet = [];

let devam = true;

while (devam) {
  const urunIsmi = prompt("Ürün adı:");
  const urunFiyat = parseFloat(prompt("Ürün fiyatı:"));

  if (!isNaN(urunFiyat)) {
    sepet.push({ name: urunIsmi, price: urunFiyat });
  } else {
    alert("Geçerli bir fiyat girilmedi!");
  }

  const cevap = prompt("Başka ürün eklemek ister misiniz? (evet/hayır)");
  if (cevap.toLowerCase() !== "evet") {
    devam = false;
  }
}

console.log("🛒 Sepetiniz:");
sepet.forEach((item, index) => {
  console.log(`${index + 1}. ${item.name} - ${item.price} TL`);
});

const toplam = sepet.reduce((acc, item) => acc + item.price, 0);
console.log(`💰 Toplam Tutar: ${toplam.toFixed(2)} TL`);

const silmekIsterMi = prompt("Bir ürünü sepetten çıkarmak ister misiniz? (evet/hayır)");

if (silmekIsterMi.toLowerCase() === "evet") {
  let urunListesi = "Silmek istediğiniz ürünün numarasını girin:\n";
  sepet.forEach((item, index) => {
    urunListesi += `${index + 1}. ${item.name}\n`;
  });

  const silIndex = parseInt(prompt(urunListesi)) - 1;

  if (silIndex >= 0 && silIndex < sepet.length) {
    const silinen = sepet.splice(silIndex, 1);
    alert(`❌ ${silinen[0].name} sepetten çıkarıldı.`);
  } else {
    alert("Geçersiz seçim!");
  }
}

console.log("📦 Güncel Sepet:");
sepet.forEach((item, index) => {
  console.log(`${index + 1}. ${item.name} - ${item.price} TL`);
});

const guncelToplam = sepet.reduce((acc, item) => acc + item.price, 0);
console.log(`🧾 Güncel Toplam: ${guncelToplam.toFixed(2)} TL`);
