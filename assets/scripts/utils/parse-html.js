function parseHTML(data) {
  var div = document.createElement("div");
  div.innerHTML = data;
  return div.firstElementChild;
}
export default parseHTML;
