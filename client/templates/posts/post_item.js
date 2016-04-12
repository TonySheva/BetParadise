Template.postItem.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  },
  ticketInfo: function(id) {
    var ticketsObject = Tickets.find({_id: id}).fetch();
    if(ticketsObject.length == 0){
      return 
    }
    var ticketsGenerate = 
    "奖金:"+ticketsObject[0].winPrice+" "+
    "还剩:"+ticketsObject[0].restMatch+"场"+" "+
    "仅剩:"+ticketsObject[0].deadline+"天"
    return ticketsGenerate;
  }
});

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});