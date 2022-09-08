const toggleNav = document.querySelector('.navigation-toggle--js')
const nav = document.querySelector('.top-navigation--js')

if(toggleNav !== null) {
  toggleNav.addEventListener('click', () => {
    const exp = "true" === toggleNav.getAttribute('aria-expanded')

    toggleNav.setAttribute('aria-expanded', !exp)
    nav.classList.toggle('active');
    toggleNav.classList.toggle('active');
    document.body.classList.toggle('navigation-opened')

    exp ? toggleNav.setAttribute('aria-label', 'Открыть меню') :
      toggleNav.setAttribute('aria-label', 'Закрыть меню')
  })
}
