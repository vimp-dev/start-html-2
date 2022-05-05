const videoInit = () => {
  const videos = document.querySelectorAll('.video-block')

  if(videos.length > 0) {
    videos.forEach(video => {
      setup(video)
    })
  }
}

const setup = (video) => {
  let container = video.querySelector('.video-block__inner')
  let btn = video.querySelector('.video-block__play')
  let id = btn.dataset.videoId

  btn.addEventListener('click', () => {
    let iframe = createIframe(id)

    container.innerHTML = ''
    container.appendChild(iframe)
    video.classList.add('video-block--play')
  })
}

const createIframe = (id) => {
  let iframe = document.createElement('iframe');

  let query = '?rel=0&showinfo=0&autoplay=1'
  let src = `https://www.youtube.com/embed/${id + query}`

  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay');
  iframe.setAttribute('src',src);
  iframe.classList.add('video-block__media');

  return iframe;
}



export default videoInit;
