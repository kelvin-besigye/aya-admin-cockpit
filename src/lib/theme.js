// A simple helper to manage the theme state
// It saves the preference to LocalStorage so the user doesn't have to reset it every time.

export const toggleTheme = (isLight) => {
  const body = document.body;
  if (isLight) {
    body.classList.add('light-mode');
    localStorage.setItem('aya-theme', 'light');
  } else {
    body.classList.remove('light-mode');
    localStorage.setItem('aya-theme', 'dark');
  }
};

export const initTheme = () => {
  const savedTheme = localStorage.getItem('aya-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
};