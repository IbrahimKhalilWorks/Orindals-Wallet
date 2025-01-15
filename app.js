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
      iconUrl: coin.iconUrl, // Add this field
      holders: 0,
      category: "ALL",
    }));
    

    renderTransactions();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    document.getElementById(
      "transactionBody"
    ).innerHTML = `<tr><td colspan="7">Failed to load coins :( </td></tr>`;
  }
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

    filteredTransactions.forEach((t) => {
      const row = `
        <tr>
          <td>${t.id}</td>
          <td>
            <div class="token">
              <img src="${t.iconUrl}" alt="${t.token} Icon" class="token-icon" />
              ${t.token}
            </div>
          </td>
          <td>$${t.price.toFixed(2)}</td>
          <td>
            $${formatNumber(t.marketCap)}
            <span class="${t.marketCapChange >= 0 ? "green" : "red"}">
              ${t.marketCapChange >= 0 ? "+" : ""}${t.marketCapChange.toFixed(2)}%
            </span>
          </td>
          <td>$${formatNumber(t.volume)}</td>
          <td>${t.supply > 0 ? formatNumber(t.supply) : "N/A"}</td>
          <td>${t.holders > 0 ? formatNumber(t.holders) : "N/A"}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
     
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
  renderTransactions("ALL", searchQuery);
});

document
  .querySelector(".transaction-search-bar input")
  .addEventListener("input", function () {
    const searchQuery = this.value;
    renderTransactions("ALL", searchQuery);
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

fetchTransactions();

// Set default theme to dark
document.body.classList.add("dark-theme");

// Select the theme toggle button
const themeToggle = document.getElementById("themeToggle");

// Add click event listener to the button
themeToggle.addEventListener("click", () => {
  // Toggle the dark theme class on the body
  document.body.classList.toggle("dark-theme");

  // Change the icon dynamically based on the theme
  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("dark-theme")) {
    icon.classList.replace("fa-sun", "fa-moon"); // Dark theme icon
  } else {
    icon.classList.replace("fa-moon", "fa-sun"); // Light theme icon
  }
});

// Notification Bell Functionality
const notificationIcon = document.getElementById("notificationIcon");
const notificationBox = document.getElementById("notificationBox");

// Toggle the notification box on bell icon click
notificationIcon.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent event from propagating to document
  notificationBox.classList.toggle("hidden");
});

// Close the notification box when clicking outside of it
document.addEventListener("click", (event) => {
  if (
    !notificationBox.classList.contains("hidden") &&
    !notificationBox.contains(event.target)
  ) {
    notificationBox.classList.add("hidden");
  }
});
