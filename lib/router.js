Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      posts: self.posts(),
      ready: self.postsSub.ready,
      nextPath: function() {
        if (self.posts().count() === self.postsLimit())
          return self.nextPath();
      }
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {
  name: 'newPosts',
  waitOn: function() {
    return Meteor.subscribe('tickets')
  }
});

Router.route('/best/:postsLimit?', {
  name: 'bestPosts',
  waitOn: function() {
    return Meteor.subscribe('tickets')
  } 
 });

Router.route('/tickets/ticketsList', {
  name: 'ticketsList',
  // waitOn: function(){
  //   return Meteor.subscribe('tickets');
  // },
  subscriptions: function() {
    this.subscribe('tickets');
  },
});

Router.route('/tickets/submit', {name: 'ticketSubmit'});

Router.route('/tickets/:_id/edit', {
  name: 'ticketEdit',
  waitOn: function() { 
    return Meteor.subscribe('tickets');
  },
   data: function() { return Tickets.findOne(this.params._id); }
});

Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() { 
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('tickets')
    ]
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {
  name: 'postSubmit',
  waitOn: function() {
    return Meteor.subscribe('tickets')
  }
});

Router.route('/counter', {
  name: 'counter',
  
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
