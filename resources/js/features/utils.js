// Bascule entre mode clair et mode sombre et mémorise le choix
function initTheme() {
  const button = document.getElementById('themeToggle')
  if (!button) return

  button.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  })
}

// Marque le lien de la section visible (data-active lu par Tailwind)
function initNav() {
  const links = document.querySelectorAll('[data-section]')
  const sections = [...links]
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        links.forEach((link) => {
          link.dataset.active = String(link.dataset.section === entry.target.id)
        })
      })
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )

  sections.forEach((section) => observer.observe(section))
}

// Filtre les éléments d'une section (compétences ou projets) selon le bouton cliqué
function initFilters() {
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter]')
    const items = group.querySelectorAll('[data-category]')

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter
        buttons.forEach((b) => {
          b.dataset.active = String(b === button)
        })
        items.forEach((item) => {
          item.hidden = filter !== 'all' && item.dataset.category !== filter
        })
      })
    })
  })
}

// Fait apparaître les éléments de chaque section un par un quand ils entrent à l'écran
function initReveal() {
  const items = []
  document.querySelectorAll('[data-reveal]').forEach((group) => {
    ;[...group.children].forEach((child) => {
      if (child.hasAttribute('data-stagger')) items.push(...child.children)
      else items.push(child)
    })
  })

  // État de départ : transparent et décalé vers le bas (styles en ligne, prioritaires)
  items.forEach((item) => {
    item.style.opacity = '0'
    item.style.translate = '0 1.75rem'
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          const item = entry.target
          const delay = index * 120
          item.style.transition = 'opacity 800ms ease-out, translate 800ms ease-out'
          item.style.transitionDelay = `${delay}ms`
          item.style.opacity = ''
          item.style.translate = ''
          observer.unobserve(item)
          // Nettoyage pour ne pas ralentir les animations au survol
          setTimeout(
            () => {
              item.style.transition = ''
              item.style.transitionDelay = ''
            },
            800 + delay + 50
          )
        })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )

  items.forEach((item) => observer.observe(item))
}

// Note de 1 à 6 étoiles du formulaire d'avis
function initRating() {
  const wrapper = document.querySelector('[data-rating]')
  if (!wrapper) return

  const input = wrapper.querySelector('input[name="rating"]')
  const stars = wrapper.querySelectorAll('[data-star]')

  const paint = (value) => {
    stars.forEach((star) => {
      star.dataset.on = String(Number(star.dataset.star) <= value)
    })
  }

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      input.value = star.dataset.star
      paint(Number(input.value))
    })
    star.addEventListener('mouseenter', () => paint(Number(star.dataset.star)))
    star.addEventListener('mouseleave', () => paint(Number(input.value)))
  })

  // Remet les étoiles choisies si le formulaire a été refusé
  paint(Number(input.value))
}

// Après l'envoi d'un formulaire, ramène à la section contact pour voir le résultat
function initFeedback() {
  const section = document.querySelector('#contact[data-feedback]')
  if (section) section.scrollIntoView()
}

export function initUi() {
  initTheme()
  initNav()
  initFilters()
  initReveal()
  initRating()
  initFeedback()
}
