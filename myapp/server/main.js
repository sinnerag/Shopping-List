import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
Meteor.startup(() => {
  // code to run on server at startup
});
var shopping = new Mongo.Collection("ast");
var bucket = new Mongo.Collection("bag");
Meteor.publish('theAsteroids',
          	function(){
                  		var currentUserId = this.userId;
                  		return shopping.find({ userid : currentUserId });
          	          });
Meteor.publish('theBag',
          	function(){
                  		var currentUserId = this.userId;
                  		return bucket.find({ userid : currentUserId });
                      });
