Template.ticketSubmit.onCreated(function() {
  Session.set('ticketSubmitErrors', {});
});

Template.ticketSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('ticketSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('ticketSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.ticketSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var ticket = {
      ticketName: $(e.target).find('[name=ticketName]').val(),
      cost: $(e.target).find('[name=cost]').val(),
      winMatch: $(e.target).find('[name=winMatch]').val(),
      restMatch: $(e.target).find('[name=restMatch]').val(),
      winPrice: $(e.target).find('[name=winPrice]').val(),
      deadline: $(e.target).find('[name=deadline]').val()
    };
    
    var errors = validateTicket(ticket);
    if (errors.ticketName || errors.winMatch || errors.winPrice ||
        errors.restMatch || errors.cost || errors.deadline)
      return Session.set('ticketSubmitErrors', errors);
    
    Meteor.call('ticketInsert', ticket, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.ticketExists)
        throwError('This link has already been posted');
      
      Router.go('ticketsList');  
    });
  }
});
