Template.counter.helpers({
  optimumArr: function(){
     console.log(Session.get("optimum_data"));
     return Session.get("optimum_data")
  },
});

Template.counter.events({
  'click .CheckMatch': function(e) {
    e.preventDefault();
    var matchCount = $(".matchSelect").val();
    if(!matchCount){
      console.log("matchCount is not define")
      return 
    }
    if(matchCount == 1){
      $(".two-match").hide();
      $(".three-match").hide();
      $(".one-match").show();
    } else if(matchCount ==2){
      $(".three-match").hide();
      $(".one-match").show();
      $(".two-match").show();
    } else if(matchCount ==3){
      $(".one-match").show();
      $(".two-match").show();
      $(".three-match").show();
    } else{
      $(".one-match").hide();
      $(".two-match").hide();
      $(".three-match").hide();
    }
  },
  'click .ticketValue': function() {
    //e.preventDefault()
    var matchCount = $(".matchSelect").val();
    var winPrice = $(".winPrice").val();
    var cost = $(".cost").val();
    console.log(winPrice);
    console.log(cost);
    var matcharr = [];
    var matcharr1 = [];
    var matcharr2 = [];
    var matcharr3 = [];
    var matchobj = {};
    var optimumarr = [];
    var optimumobj = {};
    
    var Setmatcharr = function (count) {
      for (var i = 1; i < count * 3 + 1; i++) {
        var selectorNum = '.check' + i;
        var selectorMatch = '.match' + i;
        if ($(selectorNum).prop("checked") == true) {
          matchobj = {
            "key": i,
            "value": $(selectorMatch).val(),
            "sign": true
          }
        } else {
          matchobj = {
            "key": i,
            "value": $(selectorMatch).val(),
            "sign": false
          }
        }
         matcharr.push(matchobj);
      }
      return matcharr.push(matchobj);      

    }
    var JudgeValue = function (optimumarr){
      for(var i =1; i< optimumarr.length; i++){
        if(optimumarr[i].value <= 2){
           $(".fail-message").show();
           return
        }else{
           $(".fail-message").hide();
        }
      }
    }
    
    var SessionSetDate = function(optimumarr) {
      return Session.set("optimum_data", optimumarr);
    }
    
    if(!winPrice){
       $(".notify-message").show();
       $(".no-winPrice").show();
        $(".result-message").hide();
       return 
    }else{
      $(".no-winPrice").hide(); 
      $(".notify-message").hide();
    }
    
    if(!cost){
      $(".notify-message").show();
      $(".no-cost").show();
        $(".result-message").hide();
      return
    }else{
      $(".notify-message").hide();
      $(".no-cost").hide();

    }
    
    if(cost > winPrice/2){
        $(".fail-message").show();
        $(".result-message").hide();
        return
    }else{
      $(".fail-message").hide();
    }
    // match 1
    if(matchCount == 1) {
    Setmatcharr(1);
    for(var k=0; k<2; k++){
       optimumobj = {
        "key": matcharr[k].key,
        "value": winPrice/2/matcharr[k].value,
        "nowValue": winPrice / 2
      }
      optimumarr.push(optimumobj);
    }
      console.log(optimumarr);
      JudgeValue(optimumarr);
      SessionSetDate(optimumarr);
      
  }
  
  // match 2 
  if(matchCount == 2){
    Setmatcharr(2);
    matcharr1 = matcharr.slice(0,3);
    matcharr2 = matcharr.slice(3,6); 
    for(var k=0; k<3; k++){
      for(var v=0; v<3; v++){
         var keyArr = [];
         keyArr.push(matcharr1[k].key, matcharr2[v].key);
         if(matcharr1[k].sign && matcharr2[v].sign){
          optimumobj = {
            "key" : keyArr,
            "value": winPrice/8/matcharr1[k].value/matcharr2[v].value,
            "sign": true,
            "nowValue": winPrice/8
          } 
         }else{
          optimumobj = {
            "key" : keyArr,
            "value": winPrice/8/matcharr1[k].value/matcharr2[v].value,
            "sign": false,
            "nowValue": winPrice/8
          }  
         }
         optimumarr.push(optimumobj)
      }
    }
    console.log(optimumarr);
    JudgeValue(optimumarr);
    SessionSetDate(optimumarr);
  }
  
  // match 3
  if(matchCount == 3){
     Setmatcharr(3);
     matcharr1 = matcharr.slice(0, 3);
     matcharr2 = matcharr.slice(3, 6);
     matcharr3 = matcharr.slice(6, 9);
     for (var k = 0; k < 3; k++) {
       for (var v = 0; v < 3; v++) {
         for (var z = 0; z < 3; z++) {
           var keyArr = [];
           keyArr.push(matcharr1[k].key, matcharr2[v].key, matcharr3[z].key);
           if (matcharr1[k].sign && matcharr2[v].sign && matcharr3[z].sign) {
             optimumobj = {
               "key": keyArr,
               "value": winPrice / 26 / matcharr1[k].value / matcharr2[v].value / matcharr3[z].value,
               "sign": true,
               "nowValue": winPrice / 26
             }
           } else {
             optimumobj = {
               "key": keyArr,
               "value": winPrice / 26 / matcharr1[k].value / matcharr2[v].value / matcharr3[z].value,
               "sign": false,
               "nowValue": winPrice / 26
             }
           }
           optimumarr.push(optimumobj)
         }
       }
     }
     console.log(optimumarr);
     JudgeValue(optimumarr);
     SessionSetDate(optimumarr);
  }
  if(optimumarr.length> 0){
      var checkCount = 0;
      for(var i=0; i< optimumarr.length; i++){
          checkCount = checkCount + optimumarr[i].value;
      }
      console.log(checkCount);
      if(checkCount < winPrice){
          $(".result-message").show();
          $(".fail-message").hide();
      }else {
          $(".result-message").hide();
          $(".fail-message").show();
      }
  }
  },
  'click .clearAll': function() {
    var matchCount = $(".matchSelect").val();
    for (var i = 1; i < matchCount * 3 + 1; i++) {
        var selectorNum = '.check' + i;
        var selectorMatch = '.match' + i;
        $(selectorMatch).val(0);
        if ($(selectorNum).prop("checked") == true) {
          $(selectorNum).prop('checked', false);
        }
    }
    
  },
  'click .check1': function(){
    if($(".check1").prop("checked") == true){
      $(".check2").attr('disabled', 'disabled');
      $(".check3").attr('disabled', 'disabled');
    }else{
      $(".check2").removeAttr("disabled");
      $(".check3").removeAttr("disabled");
    }
  },
  'click .check2': function(){
    if($(".check2").prop("checked") == true){
      $(".check1").attr('disabled', 'disabled');
      $(".check3").attr('disabled', 'disabled');
    }else{
      $(".check1").removeAttr("disabled");
      $(".check3").removeAttr("disabled");
    }
  },
  'click .check3': function(){
    if($(".check3").prop("checked") == true){
      $(".check1").attr('disabled', 'disabled');
      $(".check2").attr('disabled', 'disabled');
    }else{
      $(".check1").removeAttr("disabled");
      $(".check2").removeAttr("disabled");
    }
  },
  'click .check4': function(){
    if($(".check4").prop("checked") == true){
      $(".check5").attr('disabled', 'disabled');
      $(".check6").attr('disabled', 'disabled');
    }else{
      $(".check5").removeAttr("disabled");
      $(".check6").removeAttr("disabled");
    }
  },
  'click .check5': function(){
    if($(".check5").prop("checked") == true){
      $(".check4").attr('disabled', 'disabled');
      $(".check6").attr('disabled', 'disabled');
    }else{
      $(".check4").removeAttr("disabled");
      $(".check6").removeAttr("disabled");
    }
  },
  'click .check6': function(){
    if($(".check6").prop("checked") == true){
      $(".check4").attr('disabled', 'disabled');
      $(".check5").attr('disabled', 'disabled');
    }else{
      $(".check4").removeAttr("disabled");
      $(".check5").removeAttr("disabled");
    }
  },
  'click .check7': function(){
    if($(".check7").prop("checked") == true){
      $(".check8").attr('disabled', 'disabled');
      $(".check9").attr('disabled', 'disabled');
    }else{
      $(".check8").removeAttr("disabled");
      $(".check9").removeAttr("disabled");
    }
  },
  'click .check8': function(){
    if($(".check8").prop("checked") == true){
      $(".check7").attr('disabled', 'disabled');
      $(".check9").attr('disabled', 'disabled');
    }else{
      $(".check7").removeAttr("disabled");
      $(".check9").removeAttr("disabled");
    }
  },
  'click .check9': function(){
    if($(".check9").prop("checked") == true){
      $(".check7").attr('disabled', 'disabled');
      $(".check8").attr('disabled', 'disabled');
    }else{
      $(".check7").removeAttr("disabled");
      $(".check8").removeAttr("disabled");
    }
  },
  
});