module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '188.166.94.104',
      username: 'root',
      // pem: './path/to/pem'
      password: 'd165574f95e3aae429cfb22cf61'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'Demetra',
    path: '../',

    servers: {
      one: {}
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      PORT:'3000',
      ROOT_URL: 'http://188.166.94.104/',
      MONGO_URL: 'mongodb://localhost/meteor'
    },


    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma separated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
