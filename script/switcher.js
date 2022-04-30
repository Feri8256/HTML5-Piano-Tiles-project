/**
 * Toggle between two HTML elements, to make multiple screens.
 * One of them have to contain `style="display: none;"`
 * @param {Element} from will be hidden
 * @param {Element} to will be visible
 */
export function switcher(from, to) {
    from.style.display = (from.style.display == "none" ? "block" : "none"); 
    to.style.display = (to.style.display == "none" ? "block" : "none"); 
}