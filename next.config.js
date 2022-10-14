module.exports = {
  trailingSlash: true,
  exportPathMap: async function () {
    const paths = {
      '/': { page: '/' },
      '/doctor': { page: '/doctor' },
      '/doctor/ratings': { page: '/doctor/ratings' },
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
      '/forgotpassword': { page: '/forgotpassword' },
      '/resetpassword': { page: '/resetpassword' },
      '/termsofuse': { page: '/termsofuse' },
      '/privacypolicy': { page: '/privacypolicy' }
    };

    return paths;
  }
}