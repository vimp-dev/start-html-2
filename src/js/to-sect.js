document.querySelectorAll('a.to-sect').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault()
    let href = el.getAttribute('href')
    let target = document.querySelector(href)
    if(target !== null) target.scrollIntoView({behavior: "smooth"});
  })
})
