let countdown;
let timeLeft = 0;

function startCountdown() {
  const input = document.getElementById("timeInput").value;
  timeLeft = parseInt(input);

  const display = document.getElementById("display");

  if (isNaN(timeLeft) || timeLeft <= 0) {
    display.innerText = "⚠️ Geçerli bir süre girin.";
    display.style.color = "#ffeb3b";
    return;
  }

  clearInterval(countdown);
  display.style.color = "#ffd600";
  display.innerText = timeLeft + " saniye kaldı.";

  countdown = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      display.innerText = timeLeft + " saniye kaldı.";
    } else {
      clearInterval(countdown);
      display.innerText = "⏰ Süre doldu!";
      display.style.color = "#ff5252";
    }
  }, 1000);
}

function resetCountdown() {
  clearInterval(countdown);
  timeLeft = 0;
  const display = document.getElementById("display");
  display.innerText = "🔄 Geri sayım sıfırlandı.";
  display.style.color = "#ffd600";
  document.getElementById("timeInput").value = "";
}
