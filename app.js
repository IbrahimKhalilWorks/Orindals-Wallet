const API_URL = "https://api.coinranking.com/v2/coins";
const API_HEADERS = {
  "Content-Type": "application/json",
  "x-access-token":
    "coinranking79f8e800b84a7cf8783091f5f45fa02caa1f7e2aa532de7c",
};

let transactions = [];
let visibleTransactions = 5;

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toFixed(2);
}

async function fetchTransactions() {
  try {
    const response = await fetch(API_URL, { headers: API_HEADERS });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched data:");
    transactions = data.data.coins.map((coin) => ({
      id: coin.rank,
      token: coin.symbol,
      price: parseFloat(coin.price),
      marketCap: coin.marketCap,
      marketCapChange: parseFloat(coin.change),
      volume: parseFloat(coin["24hVolume"]),
      supply: coin.supply?.total || 0,
      iconUrl: coin.iconUrl,
      holders: 0,
      category: categorizeCoin(coin), // Assign category dynamically
    }));

    renderTransactions();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    document.getElementById(
      "transactionBody"
    ).innerHTML = `<tr><td colspan="7">Failed to load coins :( </td></tr>`;
  }
}

// Categorize coins based on a more robust condition
function categorizeCoin(coin) {
  if (coin.name.toLowerCase().includes("dao")) return "DAO";
  if (coin.name.toLowerCase().includes("nft")) return "NFT ECOSYSTEM";
  if (coin.name.toLowerCase().includes("defi")) return "DEFI";
  if (coin.name.toLowerCase().includes("game")) return "GAMEFI";
  if (coin.name.toLowerCase().includes("meme")) return "MEME";
  return "ALL"; // If no specific category matches, return "ALL"
}

function renderTransactions(category = "ALL", searchQuery = "") {
  const tbody = document.getElementById("transactionBody");
  tbody.innerHTML = "";

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesCategory = category === "ALL" || t.category === category;
      const matchesSearch =
        searchQuery === "" ||
        t.token.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .slice(0, visibleTransactions);

  if (filteredTransactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No coin found for this category.</td></tr>`;
  } else {
    filteredTransactions.forEach((t) => {
      const row = `
        <tr>
          <td>${t.id}</td>
          <td>
            <div class="token">
              <img src="${t.iconUrl}" alt="${
        t.token
      } Icon" class="token-icon" />
              ${t.token}
            </div>
          </td>
          <td>$${t.price.toFixed(2)}</td>
          <td>
            $${formatNumber(t.marketCap)}
            <span class="${t.marketCapChange >= 0 ? "green" : "red"}">
              ${t.marketCapChange >= 0 ? "+" : ""}${t.marketCapChange.toFixed(
        2
      )}%
            </span>
          </td>
          <td>$${formatNumber(t.volume)}</td>
          <td>${t.supply > 0 ? formatNumber(t.supply) : "N/A"}</td>
          <td>${t.holders > 0 ? formatNumber(t.holders) : "N/A"}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }

  const seeMoreButton = document.getElementById("seeMoreButton");
  if (visibleTransactions >= transactions.length) {
    seeMoreButton.style.display = "none";
  } else {
    seeMoreButton.style.display = "block";
  }
}

document.getElementById("seeMoreButton").addEventListener("click", () => {
  visibleTransactions += 5;
  const searchQuery = document.querySelector(
    ".transaction-search-bar input"
  ).value;
  const activeTab = document
    .querySelector(".tabs .tab.active")
    .textContent.trim();
  renderTransactions(activeTab, searchQuery);
});

document
  .querySelector(".transaction-search-bar input")
  .addEventListener("input", function () {
    const searchQuery = this.value;
    const activeTab = document
      .querySelector(".tabs .tab.active")
      .textContent.trim();
    renderTransactions(activeTab, searchQuery);
  });

document.querySelectorAll(".tabs .tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document
      .querySelectorAll(".tabs .tab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    const category = this.textContent.trim();
    const searchQuery = document.querySelector(
      ".transaction-search-bar input"
    ).value;
    renderTransactions(category, searchQuery);
  });
});

// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
document.body.classList.add("dark-theme");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("dark-theme")) {
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
  }
});

// Notification bell functionality
const notificationIcon = document.getElementById("notificationIcon");
const notificationBox = document.getElementById("notificationBox");

notificationIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  notificationBox.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  if (
    !notificationBox.classList.contains("hidden") &&
    !notificationBox.contains(event.target)
  ) {
    notificationBox.classList.add("hidden");
  }
});

fetchTransactions();

const home = document.querySelector(".home");
const logout = document.querySelector(".logout");
const setting = document.querySelector(".setting");
const settingPage = document.querySelector(".settings-page");
home.addEventListener("click", () => {
  settingPage.style.display = "none";
});
setting.addEventListener("click", () => {
  settingPage.style.display = "flex";
});
logout.addEventListener("click", () => {
  alert("Status: success ☺");
});

 