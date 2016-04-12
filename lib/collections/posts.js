Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) {
      return ownsDocument(userId, post);
  },  
  remove: function(userId, post) { 
      
      return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    return (_.without(fieldNames, 'url', 'title', 'ticketId').length > 0);
  }
});
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url || errors.ticketId;
  }
});

validatePost = function (post) {
  var errors = {};

  if (!post.title)
    errors.title = "请填写一个引人入胜的标题";
  if (!post.url)
    errors.url =  "请填写你的交易详情链接";
  // if (!post.winMatch)
  //   errors.winMatch = "请填写你已经获胜的场次";
  //   else if (post.winMatch <= 0)
  //    errors.deadline = "获胜的场次必须是大于0的数字"  
  // if (!post.winPrice)
  //   errors.winPrice = "请填写你彩票的最终奖金额";
  //   else if (post.winPrice <= 0)
  //    errors.deadline = "最终奖金额必须是大于0的数字"
  // if (!post.restMatch)
  //   errors.restMatch= "请填写你彩票的剩余场次";
  //   else if (post.restMatch >= 4)
  //     errors.restMatch = "剩余场次大于4以上我们建议你继续观望"; 
  // if (!post.cost)
  //   errors.cost= "请填写你彩票的投注额";
  //   else if (post.winMatch <= 0)
  //    errors.deadline = "彩票的投注额必须是大于2的数字" 
  // if (!post.deadline)
  //   errors.deadline = "请填写你彩票的截至日期（注：即下一场比赛日期）";
  //   else if (post.deadline <= 0)
  //    errors.deadline = "有效期必须是大于0的数字"
  if(!post.ticketId)
    errors.ticketId = "请选择你的票";   
  return errors;
}

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String,
      // winMatch: String,
      // restMatch:  String,
      // winPrice: String,  
      // cost:    String,
      // deadline: String,
      ticketId: String   
    });  
    
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url || errors.ticketId)
      throw new Meteor.Error('invalid-post', "You must check your form info");
    
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }
    
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [], 
      votes: 0  
    });
    
    var postId = Posts.insert(post);
    
    return {
      _id: postId
    };
  },
  
  postUpdate: function(postProperties, currentPostId, currentUserId) {
    check(currentUserId, String);
    check(postProperties, {
      url: String,
      title: String,
      // cost: String,
      // winMatch: String,
      // restMatch:  String,
      // winPrice: String,   
      // deadline: String,
      ticketId: String
    });
   Posts.update(currentPostId, {$set: postProperties}, function(error){
      if(error){
         throwError(error.reason);
      } else{
         Router.go('postPage',{_id: currentPostId});
      }
   })
  },

  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);
    
    var affected = Posts.update({
      _id: postId, 
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  }
});
