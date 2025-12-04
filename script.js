// ===== CONFIG =====
const GITHUB_USERNAME = "ShoSama03";

// ===== THEME TOGGLE =====
const root = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");
const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Load saved theme
const savedTheme = localStorage.getItem("rajat-theme");
if (savedTheme === "light") {
  root.classList.add("light");
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = "☀️ <span class=\"btn-label\">Light</span>";
  }
}

// Toggle theme on click
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isLight = root.classList.toggle("light");
    localStorage.setItem("rajat-theme", isLight ? "light" : "dark");
    themeToggleBtn.innerHTML = isLight
      ? "☀️ <span class=\"btn-label\">Light</span>"
      : "🌙 <span class=\"btn-label\">Dark</span>";
  });
}

// ===== GITHUB REPOS =====
async function loadRepos() {
  const container = document.getElementById("repos");
  if (!container) return;

  container.innerHTML = `
    <div class="card placeholder">
      Loading your GitHub repositories...
    </div>
  `;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );

    if (!res.ok) {
      throw new Error("GitHub API error");
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `
        <div class="card placeholder">
          No public repositories found yet. Once you push projects to GitHub, they will appear here.
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    data.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "card project-card";

      const stars = repo.stargazers_count || 0;
      const lang = repo.language || "Unknown";

      card.innerHTML = `
        <h4>${repo.name}</h4>
        <p>${repo.description || "No description provided."}</p>
        <div class="project-meta">
          <span>🧠 ${lang}</span>
          <span>⭐ ${stars}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="btn ghost">
          🔗 View on GitHub
        </a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div class="card placeholder">
        Could not load repositories from GitHub. Try refreshing later.
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadRepos);
