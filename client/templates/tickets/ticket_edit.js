Template.ticketEdit.onCreated(function() {
  Session.set('ticketEditErrors', {});
});

Template.ticketEdit.helpers({
  errorMessage: function(field) {
    return Session.get('ticketEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('ticketEditErrors')[field] ? 'has-error' : '';
  },
  
});

Template.ticketEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentTicketId = this._id;
    var currentUserId = this.userId;
    var ticketProperties = {
      ticketName: $(e.target).find('[name=ticketName]').val(),
      cost: $(e.target).find('[name=cost]').val(),
      winMatch: $(e.target).find('[name=winMatch]').val(),
      restMatch: $(e.target).find('[name=restMatch]').val(),
      winPrice: $(e.target).find('[name=winPrice]').val(),
      deadline: $(e.target).find('[name=deadline]').val(),
    };
    
    var errors = validateTicket(ticketProperties);
    if (errors.ticketName|| errors.winMatch || errors.winPrice ||
        errors.restMatch || errors.cost || errors.deadline)
      return Session.set('ticketEditErrors', errors);
                              
  
   Meteor.call('ticketUpdate', ticketProperties, currentTicketId, currentUserId) 
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("确认删除该票？")) {
      var currentTicketId = this._id;
      Tickets.remove(currentTicketId);
      Router.go('ticketsList');
    }
  }
});
