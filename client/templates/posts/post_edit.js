Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  },
  ticketsItem: function(){
    console.log(Tickets.find({userId: Meteor.userId()}).fetch())
    return Tickets.find({userId: Meteor.userId()}).fetch();
  },
});
Template.selectOption.helpers({
  ticketSelectDefault: function(id){
    var tId = id;
    var path = Iron.Location.get().path;
    pId = path.split("/")[2];
    if(!pId){
      console.log("pId is not define")
      return 
    }
    if(!tId){
      console.log("pId is not define")
      return 
    }
    tId = Posts.find({_id: pId}).fetch()[0].ticketId;
    return tId==id
  },
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    var currentUserId = this.userId;
    // var postList = Posts.find({_id: this._id}).fetch()
    // console.log(postList);
    //console.log(Tickets.find({userId: Meteor.userId()}).fetch()); 
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
     // userId: postList[0].userId,
     // author: postList[0].author,
     // submitted: postList[0].submitted,
     // upvoters: postList[0].upvoters,
     // votes: postList[0].votes,
     // commentsCount: postList[0].commentsCount,
     ticketId: $(e.target).find('[name=ticketId]').val(),
    };
    console.log(postProperties);
    
    var errors = validatePost(postProperties);
    if (errors.title || errors.url || errors.ticketId)
      return Session.set('postEditErrors', errors);
                              
  
   Meteor.call('postUpdate', postProperties, currentPostId, currentUserId) 
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("确认删除该帖？")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('home');
    }
  },
  'click .search': function(e) {
    e.preventDefault();
    var tId = $(".ticketSelect").val();
    var searchId = $(".ticket-unviewed[data-search="+tId+"]").data("search");
    var ticketLength= $(".ticket-unviewed").length;
    for(i=0; i<ticketLength; i++){
      $(".ticket-unviewed").eq(i).hide();
    }
     $(".ticket-unviewed[data-search="+tId+"]").show(); 
  }
  
});
