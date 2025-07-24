(() => {
  'use strict';

  // Create HTML structure 
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Kullanıcı Listesi</title>
    </head>
    <body>
    <div id="ins-api-users"></div>
    </body>
    </html>
  `;

  document.body.innerHTML = htmlContent;

  // Style
  const style = document.createElement('style');
  style.textContent = `
    body {
        font-family: Arial, sans-serif;
        background: #E8EFFF;
        text-align: center;
        padding: 20px;
        margin: 0;
    }
    .user-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }
    .user-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        width: 300px;
        text-align: left;
        transition: transform 0.3s ease, background 0.3s ease;
        border-left: 5px solid #003366;
    }
    .user-card:hover {
        transform: scale(1.05);
        background: #f9fbff;
    }
    .delete-btn {
        background: #d32f2f;
        color: white;
        border: none;
        padding: 10px 15px;
        cursor: pointer;
        border-radius: 6px;
        margin-top: 10px;
        transition: background 0.3s ease;
    }
    .delete-btn:hover {
        background: #b71c1c;
    }
    .error-message {
        color: #d32f2f;
        font-weight: bold;
    }
    h2 {
        color: #000;
    }
  `;
  document.head.appendChild(style);

  // constants
  const apiUrl = "https://jsonplaceholder.typicode.com/users";
  const container = document.getElementById("ins-api-users");

  const fetchUsers = () => {
    return new Promise((resolve, reject) => {
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Veri çekme başarısız oldu");
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem(
            "users",
            JSON.stringify({ data, expiry: Date.now() + 86400000 })  // Saving data to localStorage for 1 day
          );
          resolve(data);
        })
        .catch((error) => reject(error));
    });
  };

  const getUsers = async () => {
    const storedData = localStorage.getItem("users");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Date.now() < parsedData.expiry) {
        return parsedData.data;
      }
    }
    return fetchUsers();
  };

  const deleteUser = (id) => {
    let storedData = JSON.parse(localStorage.getItem("users"));
    if (storedData) {
      storedData.data = storedData.data.filter((user) => user.id !== id);
      localStorage.setItem("users", JSON.stringify(storedData));
      renderUsers();
    }
  };

  const renderUsers = async () => {
    try {
      const users = await getUsers();
      container.textContent = "";

      const title = document.createElement("h2");
      title.textContent = "Kullanıcı Listesi";
      container.appendChild(title);

      const userContainer = document.createElement("div");
      userContainer.className = "user-container";

      users.forEach((user) => {
        const userCard = document.createElement("div");
        userCard.className = "user-card";

        const userName = document.createElement("h3");
        userName.textContent = user.name;

        const userEmail = document.createElement("p");
        userEmail.innerHTML = `<strong>Email:</strong> ${user.email}`;

        const userAddress = document.createElement("p");
        userAddress.innerHTML = `<strong>Adres:</strong> ${user.address.street}, ${user.address.city}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Sil";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteUser(user.id);

        userCard.appendChild(userName);
        userCard.appendChild(userEmail);
        userCard.appendChild(userAddress);
        userCard.appendChild(deleteButton);
        userContainer.appendChild(userCard);
      });

      container.appendChild(userContainer);
    } catch (error) {
      const errorMessage = document.createElement("p");
      errorMessage.className = "error-message";
      errorMessage.textContent = `Hata: ${error.message}`;
      container.appendChild(errorMessage);
    }
  };

  // First render
  renderUsers();

})();
