Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  },
  ticketsItem: function(){
    console.log(Tickets.find({userId: Meteor.userId()}).fetch())
    return Tickets.find({userId: Meteor.userId()}).fetch();
  },
});

Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      ticketId: $(e.target).find('[name=ticketId]').val(),
    };
    //console.log(post);
    var errors = validatePost(post);
    if (errors.title || errors.url || errors.ticketId)
      return Session.set('postSubmitErrors', errors);
    
    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.postExists)
        throwError('This link has already been posted');
      
      Router.go('postPage', {_id: result._id});  
    });
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
