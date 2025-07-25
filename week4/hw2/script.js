const appendLocation = '#ins-api-users';
const STORAGE_KEY = 'userListWithExpiry';
const SESSION_KEY = 'reloadUsedThisSession';
const EXPIRATION_MS = 1000 * 60 * 60; 

(function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    body {
      font-family: Arial, sans-serif;
      background: #E8EFFF;
      margin: 0;
      padding: 20px;
    }

    h2 {
      text-align: center;
      color: #000;
      margin-bottom: 20px;
    }

    .user-grid {
      display: grid;
      justify-content: center;
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(250px, 400px));
      max-width: 1200px;
      margin: 0 auto;
    }

    .user-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      border-left: 5px solid #003366;
      min-height: 180px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.3s ease;
    }

    .user-card:hover {
      transform: scale(1.02);
    }

    .delete-btn {
      background: #d32f2f;
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 6px;
      margin-top: 10px;
      align-self: flex-start;
    }

    .delete-btn:hover {
      background: #b71c1c;
    }

    #reload-button {
      background: #2ecc71;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      margin: 30px auto;
      display: block;
    }

    #reload-button:hover {
      background: #27ae60;
    }

    .error-message {
      text-align: center;
      color: #d32f2f;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
})();

function showError(msg) {
  console.error('Hata:', msg);
  alert('Hata: ' + msg);
}

async function fetchUsers() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('Veri çekilemedi');
    return await res.json();
  } catch (e) {
    showError(e.message);
    return [];
  }
}

function saveUsers(users) {
  const now = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    users,
    expiry: now + EXPIRATION_MS
  }));
}

function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.users;
  } catch {
    return null;
  }
}

function deleteUser(id) {
  const users = getUsers();
  if (!users) return;
  const updated = users.filter(user => user.id !== id);
  if (updated.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    saveUsers(updated);
  }
  renderUsers(updated);
}

function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';

  const name = document.createElement('h3');
  name.textContent = user.name;

  const email = document.createElement('p');
  email.innerHTML = `<strong>Email:</strong> ${user.email}`;

  const address = document.createElement('p');
  address.innerHTML = `<strong>Adres:</strong> ${user.address.street}, ${user.address.city}`;

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Sil';
  delBtn.className = 'delete-btn';
  delBtn.onclick = () => deleteUser(user.id);

  card.appendChild(name);
  card.appendChild(email);
  card.appendChild(address);
  card.appendChild(delBtn);

  return card;
}

function renderUsers(users) {
  const container = document.querySelector(appendLocation);
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Kullanıcı Listesi';
  container.appendChild(title);

  if (!users || users.length === 0) return;

  const grid = document.createElement('div');
  grid.className = 'user-grid';

  users.forEach(user => {
    grid.appendChild(createUserCard(user));
  });

  container.appendChild(grid);
}

function showReloadButtonIfNeeded() {
  const container = document.querySelector(appendLocation);
  const cards = container.querySelectorAll('.user-card');
  const reloadUsed = sessionStorage.getItem(SESSION_KEY) === 'used';
  const existingBtn = document.querySelector('#reload-button');
  const existingMsg = document.querySelector('#no-more-users');

  if (cards.length === 0) {
    if (!reloadUsed && !existingBtn) {
      const btn = document.createElement('button');
      btn.id = 'reload-button';
      btn.textContent = 'Verileri Tekrar Yükle';
      btn.onclick = async () => {
        const users = await fetchUsers();
        if (users.length > 0) {
          saveUsers(users);
          renderUsers(users);
          sessionStorage.setItem(SESSION_KEY, 'used');
          btn.remove();
        }
      };
      container.appendChild(btn);
    } else if (reloadUsed && !existingMsg) {
      const msg = document.createElement('p');
      msg.id = 'no-more-users';
      msg.className = 'error-message';
      msg.textContent = 'Tüm veriler silindi. Bu oturumda tekrar yükleyemezsiniz.';
      container.appendChild(msg);
    }
  }
}

function observeChanges() {
  const container = document.querySelector(appendLocation);
  const observer = new MutationObserver(showReloadButtonIfNeeded);
  observer.observe(container, { childList: true, subtree: true });
}

async function init() {
  let users = getUsers();
  if (!users) {
    users = await fetchUsers();
    if (users.length > 0) saveUsers(users);
  }
  renderUsers(users || []);
  observeChanges();
}

init();
