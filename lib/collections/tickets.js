Tickets = new Mongo.Collection('tickets');

Tickets.allow({
  update: function(userId, ticket) {
      return ownsDocument(userId, ticket);
  },  
  remove: function(userId, ticket) { 
      
      return ownsDocument(userId, ticket); },
});

Tickets.deny({
  update: function(userId, ticket, fieldNames) {
    return (_.without(fieldNames, 'ticketName','winMatch',
    'restMatch','winPrice','cost','deadline').length > 0);
  }
});

Tickets.deny({
  update: function(userId, ticket, fieldNames, modifier) {
    var errors = validateTicket(modifier.$set);
    return errors.ticketName || errors.winMatch ||errors.winPrice || 
    errors.restMatch || errors.cost || errors.deadline;
  }
});

validateTicket = function (ticket) {
  var errors = {};
  if(!ticket.ticketName)
    errors.ticketName = "起个你喜欢的名字呗";
  if (!ticket.winMatch)
    errors.winMatch = "请填写你已经获胜的场次";
    else if (ticket.winMatch <= 0)
     errors.winMatch = "获胜的场次必须是大于0的数字"  
  if (!ticket.winPrice)
    errors.winPrice = "请填写你彩票的最终奖金额";
    else if (ticket.winPrice <= 0)
     errors.winPrice = "最终奖金额必须是大于0的数字"
  if (!ticket.restMatch)
    errors.restMatch= "请填写你彩票的剩余场次";
    else if (ticket.restMatch >= 4)
      errors.restMatch = "剩余场次大于4以上我们建议你继续观望"; 
  if (!ticket.cost)
    errors.cost= "请填写你彩票的投注额";
    else if (ticket.cost <= 2)
     errors.cost = "彩票的投注额必须是大于2的数字" 
  if (!ticket.deadline)
    errors.deadline= "请填写你彩票的截至日期（注：即下一场比赛日期）";
    else if (ticket.deadline <= 0)
     errors.deadline = "有效期必须是大于0的数字"
  return errors;
}

Meteor.methods({
  ticketInsert: function(ticketAttributes) {
    check(this.userId, String);
    check(ticketAttributes, {
      ticketName: String,
      winMatch: String,
      restMatch:  String,
      winPrice: String,  
      cost:    String,
      deadline: String 
    });  
    
    var errors = validateTicket(ticketAttributes);
    if (errors.ticketName || errors.winMatch || errors.winPrice ||
        errors.restMatch || errors.cost || errors.deadline)
      throw new Meteor.Error('invalid-post', "You must check your form info");
     
    var user = Meteor.user();
    var ticket = _.extend(ticketAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(), 
    });
    
    var ticketId = Tickets.insert(ticket);
    
    return {
      _id: ticketId
    };
  },
  
  ticketUpdate: function(ticketProperties, currentTicketId, currentUserId) {
    check(currentUserId, String);
    check(ticketProperties, {
      ticketName: String,
      cost: String,
      winMatch: String,
      restMatch:  String,
      winPrice: String,   
      deadline: String,
    });
   Tickets.update(currentTicketId, {$set: ticketProperties}, function(error){
      if(error){
         throwError(error.reason);
      } else{
         Router.go('ticketsList');
      }
   })
  },
  });