const filters = document.querySelector('.filters');
if (filters) {
  filters.hidden = false;
  const buttons = [...filters.querySelectorAll('button')];
  const projects = [...document.querySelectorAll('.project-card')];
  filters.addEventListener('click', (event) => {
    const selected = event.target.closest('button[data-filter]');
    if (!selected) return;
    for (const button of buttons) {
      button.classList.toggle('active', button === selected);
      button.setAttribute('aria-pressed', String(button === selected));
    }
    for (const project of projects) project.hidden = selected.dataset.filter !== 'all' && project.dataset.category !== selected.dataset.filter;
    document.querySelector('#filter-status').textContent = `Hiển thị ${projects.filter(project => !project.hidden).length} dự án.`;
  });
}

// Native disclosure works without JavaScript; add predictable dismissal behavior.
const productMenu = document.querySelector('.products-menu');
if (productMenu) {
  document.addEventListener('click', (event) => {
    if (!productMenu.contains(event.target)) productMenu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && productMenu.open) {
      productMenu.open = false;
      productMenu.querySelector('summary').focus();
    }
  });
  productMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { productMenu.open = false; }));
}
