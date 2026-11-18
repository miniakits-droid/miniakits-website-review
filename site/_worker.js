/** Pages Worker: force apex host so Google does not treat www as a duplicate site. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.miniakits.com') {
      url.hostname = 'miniakits.com';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  }
};
