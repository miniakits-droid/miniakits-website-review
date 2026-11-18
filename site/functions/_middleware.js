/** Redirect www to apex so Google consolidates on https://miniakits.com */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'www.miniakits.com') {
    url.hostname = 'miniakits.com';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
