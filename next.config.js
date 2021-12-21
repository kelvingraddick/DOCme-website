module.exports = {
  trailingSlash: true,
  exportPathMap: async function () {
    const paths = {
      '/': { page: '/' },
      '/appointments': { page: '/appointments' },
      '/myaccount': { page: '/myaccount' }
    };

    return paths;
  }
}