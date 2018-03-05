
export default [
  {
    path: '/samples/hello-world',
    title: 'hello-world',
    view: '/pages/views/samples/hello-world/hello-world.swig'
  },
  {
    path: '/samples/reference',
    title: 'reference',
    view: '/pages/views/samples/reference/reference.swig'
  },
  {
    path: '/samples/lazy-load',
    title: 'lazy-load',
    view: '/pages/views/samples/lazy-load/lazy-load.swig'
  },
  {
    path: '/samples/vue-ssr-app*',
    title: 'vue-ssr-app',
    view: '/pages/views/samples/vue-ssr-app/app.swig',
    action: require('../actions/samples/vue-ssr-app.js').default.index,
    ssr: {
      type: 'vue',
      entry: '/pages/views/samples/vue-ssr-app/app.js'
    }
  },
  {
    path: '/samples/calculator',
    title: 'calculator',
    view: '/pages/views/samples/calculator/calculator.swig'
  },
  {
    path: '/samples/mirage',
    title: 'mirage',
    view: '/pages/views/samples/mirage/mirage.swig'
  }
];
