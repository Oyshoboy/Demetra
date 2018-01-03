import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';


FlowRouter.route("/xrp-rock", {
    subscriptions: function() {},
    action: function() {
       BlazeLayout.render('layout', { main: "rock" });
    },
  });

FlowRouter.route("/i_am_investor", { //MAKE A MAIN SOON 
  subscriptions: function() {},
  action: function() {
   // document.body.style.background = "url(/img/iamInvestorBg.jpg)";
    FlowRouter.go('/');
  },
});


FlowRouter.route("/enter", { //MAKE A MAIN SOON 
  subscriptions: function() {},
  action: function() {
    BlazeLayout.render('layout', { main: "frontPageCover" });
  },
});


FlowRouter.route("/", { //MAKE A MAIN SOON 
  subscriptions: function() {},
  action: function() {
    BlazeLayout.render('layout', { main: "iAmInvestor" });
  },
});
