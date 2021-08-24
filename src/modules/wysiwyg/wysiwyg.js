/**
 * Initializes the site's wysiwyg module.
 * @constructor
 * @param {Object} el - The site's wysiwyg container element.
 */
function wysiwyg (el) {
  const h4Tags = el.querySelectorAll('h4')

  for (const tag of h4Tags) {
    var newTag = document.createElement('h2')
    newTag.innerHTML = tag.innerHTML
    tag.replaceWith(newTag)
  }
}

export default wysiwyg
