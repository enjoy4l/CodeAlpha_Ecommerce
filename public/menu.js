const menuToggle = document.querySelector('.menu-toggle');
const categoryMenu = document.querySelector('#category-menu');

if (menuToggle && categoryMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open categories' : 'Close categories');
    categoryMenu.hidden = isOpen;
  });

}
