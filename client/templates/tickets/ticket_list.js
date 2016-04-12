Template.ticketsList.helpers({
  ticketsItem: function(){
    return Tickets.find({userId: Meteor.userId()}).fetch();
  }
});



