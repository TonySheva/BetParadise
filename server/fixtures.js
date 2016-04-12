// Fixture data 
if (Posts.find().count() === 0) {
  var now = new Date().getTime();
  
  // create two users
  var tonyId = Meteor.users.insert({
    profile: { name: 'Tony Sheva' }
  });
  var tony = Meteor.users.findOne(tonyId);
  var maxId = Meteor.users.insert({
    profile: { name: 'Maxsonic' }
  });
  var maxsonic = Meteor.users.findOne(maxId);

  var telescopeId = Posts.insert({
    title: 'init title for test',
    userId: maxsonic._id,
    author: maxsonic.profile.name,
    url: 'http://www.google.com',
    submitted: new Date(now - 7 * 3600 * 1000),
    commentsCount: 2,
    upvoters: [], votes: 0
  });
  
  Comments.insert({
    postId: telescopeId,
    userId: tony._id,
    author: tony.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Interesting test'
  });
  
  Comments.insert({
    postId: telescopeId,
    userId: maxsonic._id,
    author: maxsonic.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'yep '
  });
  
  Posts.insert({
    title: 'it is unhappy',
    userId: maxsonic._id,
    author: maxsonic.profile.name,
    url: 'http://www.github.com',
    submitted: new Date(now - 10 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  Posts.insert({
    title: 'it is crazy',
    userId: maxsonic._id,
    author: maxsonic.profile.name,
    url: 'http://www.sina.com',
    submitted: new Date(now - 12 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  for (var i = 0; i < 10; i++) {
    Posts.insert({
      title: 'Test post #' + i,
      author: maxsonic.profile.name,
      userId: maxsonic._id,
      url: 'http://google.com/?q=test-' + i,
      submitted: new Date(now - i * 3600 * 1000 + 1),
      commentsCount: 0,
      upvoters: [], votes: 0
    });
  }
}