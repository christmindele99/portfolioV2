// Écrit, efface puis réécrit les deux compétences clés en boucle
export function initTypewriter() {
  const target = document.getElementById('typewriter')
  if (!target) return

  const words = ['Graphiste designer', 'Développeur web']
  let wordIndex = 0
  let charIndex = 0
  let deleting = false

  function tick() {
    const word = words[wordIndex]
    charIndex += deleting ? -1 : 1
    target.textContent = word.slice(0, charIndex)

    let delay = deleting ? 40 : 90
    if (!deleting && charIndex === word.length) {
      deleting = true
      delay = 1500
    } else if (deleting && charIndex === 0) {
      deleting = false
      wordIndex = (wordIndex + 1) % words.length
      delay = 400
    }
    setTimeout(tick, delay)
  }

  tick()
}
