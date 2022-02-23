module.exports = {
  trailingSlash: true,
  exportPathMap: async function () {
    const paths = {
      '/': { page: '/' },
      '/appointments': { page: '/appointments' },
      '/myaccount': { page: '/myaccount' },
      '/bookappointment': { page: '/bookappointment' },
      '/editappointment': { page: '/editappointment' },
      '/changepassword': { page: '/changepassword' },
      '/editaccount': { page: '/editaccount' },
      '/editpractice': { page: '/editpractice' },
      '/editschedule': { page: '/editschedule' },
      '/signin': { page: '/signin' },
      '/signup': { page: '/signup' },
      '/termsofuse': { page: '/termsofuse' },
      '/privacypolicy': { page: '/privacypolicy' }
    };

    return paths;
  }
}