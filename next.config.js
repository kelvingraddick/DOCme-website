const data = [
  {
      path: '/appointments'
  }
];

module.exports = {
  trailingSlash: true,
  exportPathMap: async function () {
    //you can get route by fetch
    const paths = {
      '/': { page: '/' }
    };

    data.forEach((project) => {
        paths[`${project.path}`] = {
            page: project.path,
        };
    });

    return paths;
  }
}