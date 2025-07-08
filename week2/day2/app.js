function calculateCollatz() {
  const limit = 1000000;
  const cache = {};

  function getCollatzLength(n) {
    if (n === 1) return 1;
    if (cache[n]) return cache[n];

    let next = n % 2 === 0 ? n / 2 : 3 * n + 1;
    cache[n] = 1 + getCollatzLength(next);
    return cache[n];
  }

  let maxLength = 0;
  let numberWithMaxChain = 0;

  for (let i = 1; i < limit; i++) {
    const length = getCollatzLength(i);
    if (length > maxLength) {
      maxLength = length;
      numberWithMaxChain = i;
    }
  }

  document.getElementById("result").innerHTML = `
    <strong>Longest chain starts at:</strong> ${numberWithMaxChain}<br>
    <strong>Length of chain:</strong> ${maxLength}
  `;
}
