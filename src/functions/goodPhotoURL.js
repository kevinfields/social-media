export default function goodPhotoURL(url) {
  return(url.match(/\.(jpeg|jpg|png)$/) != null);
}