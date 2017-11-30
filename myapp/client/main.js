import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var shopping = new Mongo.Collection("ast");
Meteor.subscribe('theAsteroids');
var bucket = new Mongo.Collection("bag");
Meteor.subscribe('theBag');

/*******************************************************ALL ROUTES - START***************************************************/
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function(){
			this.render('listshopping');
});
Router.route('/a', function(){
			this.render('view_new_list');
});
Router.route('/add_new_list', function(){
			this.render('add_new_list');
});
Router.route('/shop_list', function(){
			this.render('shop_list');
});
Router.route('/create_list/:_id', function(){
			this.render('create_list');
});
Router.route('/edit_created_list/:_id', function(){
	var item = bucket.findOne({ _id: this.params._id });
	this.render('edit_created_list', {data:item});
	}
);

Router.route('/login_screen', function(){
			this.render('login_screen');
});
Router.route('/edit_new_list', function(){
			this.render('edit_new_list');
});
Router.route('/delete_new_list', function(){
	this.render('delete_new_list');
});
Router.route('/view_created_list/:_id', function(){
	var item = bucket.findOne({ _id: this.params._id });
	this.render('view_created_list');
});
Router.route('/about_developer', function(){
	this.render('about_developer');
});
Router.route('/view_shop_list/:_id', function(){
	var item = bucket.findOne({ _id: this.params._id });
	this.render('view_shop_list');
});
Router.route('/viewdetails', function(){
	this.render('viewdetails');
});

Router.route('/view_new_list', function(){
		var item = shopping.findOne({ _id: this.params._id });
		this.render('view_new_list', {data:item});
});


/*Router.route('/view_created_list/:_id', function(){ // shopping list detail template
	var item = bucket.findOne({ _id: this.params._id });
	this.render('view_created_list', {data:item});
	}
);*/

/*******************************************************ALL ROUTES -  END***************************************************/

/*******************************************************ADD NEW SHOPPING LIST -  START***************************************************/
Template.add_new_list.rendered = function(){
	var date = new Date();
	date.setDate(date.getDate());
	$('#datepicker').datepicker({ startDate: date, format: "dd/mm/yyyy" });
}

Template.add_new_list.helpers({
	date(){
		var today = new Date(); var dd = today.getDate(); var mm = today.getMonth(); var yyyy = today.getFullYear();
    if(dd<10){ dd='0'+dd } if(mm<10){ mm='0'+mm }
    var today = dd+'/'+mm+'/'+yyyy;
		return today;
	},
});

Template.add_new_list.events({
	'submit form'(event, instance){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		//alert(currentUserId+"///"+event.target.nameofthelist.value+"///"+event.target.dateofcreation.value+"///"+event.target.datepicker.value);
		shopping.insert({
			name: "shopping_list",
			nameofthelist: event.target.nameofthelist.value,
			dateofcreation: event.target.dateofcreation.value,
			dateofshopping: event.target.datepicker.value,
      userid: currentUserId
		});
		Router.go('/');
	},
});

Template.create_list.events({
	'submit form'(event, instance){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		var url = window.location.pathname; var str = url.split("/"); var catid = str[2];
		//alert(currentUserId+"///"+event.target.nameofthelist.value+"///"+event.target.dateofcreation.value+"///"+event.target.datepicker.value);
		if(event.target.storename.value == false){ alert("Please select storename"); return false; }
		if(event.target.productname.value == ""){ alert("Please insert productname"); return false; }
		if(event.target.quantity.value == ""){ alert("Please insert quantity"); return false; }
		if(event.target.price.value == ""){ alert("Please insert price"); return false; }
		bucket.insert({
			name: "shopping_bag",
			category: catid,
			storename: event.target.storename.value,
			productname: event.target.productname.value,
      quantity: event.target.quantity.value,
      price: event.target.price.value,
			userid: currentUserId
		});
		Router.go('/view_new_list');
	},
});
/*******************************************************ADD NEW SHOPPING LIST -  END***************************************************/
Template.view_created_list.events({
	'submit form'(event, instance){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		var url = window.location.pathname; var str = url.split("/"); var catid = str[2];
		//alert(currentUserId+"///"+event.target.nameofthelist.value+"///"+event.target.dateofcreation.value+"///"+event.target.datepicker.value);
		bucket.insert({
			name: "shopping_bag",
			category: catid,
			storename: event.target.storename.value,
			productname: event.target.productname.value,
      quantity: event.target.quantity.value,
      price: event.target.price.value,
			userid: currentUserId
		});
		Router.go('/view_new_list');
	},
});
/*******************************************************DELETE NEW SHOPPING LIST -  END***************************************************/
Template.view_new_list.events({
	'click #delete'(event, instance){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		var id = event.target.value;
		var remove_confirm = confirm("Are you sure you want to delete this Store?");
		if (remove_confirm) {
			shopping.remove( { _id: id } );
			//Router.go('delete_new_list');
		}
	},

});
Template.view_created_list.events({
	'click #delete1'(event, instance){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		var id = event.target.value;
		var remove_confirm = confirm("Are you sure you want to delete this Store?");
		if (remove_confirm) {
			bucket.remove( { _id: id } );
			//Router.go('delete_new_list');
		}
	},

});

Template.view_shop_list.events({
	'click #delete1'(event, instance){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		var id = event.target.value;
		var remove_confirm = confirm("Are you sure you want to delete this Store?");
		if (remove_confirm) {
			bucket.remove( { _id: id } );
			//Router.go('delete_new_list');
		}
	},

});
/*View Created List Start*/
Template.view_created_list.events({
	'click #buy'(event, instance){
		event.preventDefault();
		var currentUserId = Meteor.userId();
		var id = event.target.value;
		var url = window.location.pathname; var str = url.split("/"); var catid = str[2];
		var storename = $("#storename").val();
		var productname = $("#productname").val();
		var quantity = $("#quantity").val();
		var price = $("#price").val();
		var bought = bucket.update({  _id: id },
						 {  name: "shopping_bag",
								category: catid,
								storename: storename,
								productname: productname,
					      quantity: quantity,
					      price: price,
								userid: currentUserId,
							 	bought: "bought" });
		if(bought){ alert("Product added into the cart"); }else{ alert("Please try again in few second"); }
	},
});
/*View Created List End*/
/*******************************************************DELETE SHOPPING LIST -  START***************************************************/
/*******************************************************VEIW SHOPPING LIST -  START***************************************************/
/*******************************************************HELPERS SECTION***************************************************/
Template.view_new_list.helpers({
		list_items(){
			var currentUserId = Meteor.userId();
			return shopping.find({ userid: currentUserId, name: "shopping_list" }).fetch();
		},
	});

  Template.add_new_list.helpers({
  		list_items(){
  			var currentUserId = Meteor.userId();
  			return shopping.find({ userid: currentUserId, name: "shopping_list" }).fetch();
  		},
  	});
    Template.create_list.helpers({
    		list_items(){
    			var currentUserId = Meteor.userId();
    			return bucket.find({ userid: currentUserId, name: "shopping_list" }).fetch();
    		},
    	});
			Template.shop_list.helpers({
	    		list_items(){
	    			var currentUserId = Meteor.userId();
	    			return shopping.find({ userid: currentUserId, name: "shopping_list" }).fetch();
	    		},
	    	});
/*******************************************************VEIW SHOPPING LIST -  END***************************************************/
Template.delete_new_list.helpers({
		list_items(){
			var currentUserId = Meteor.userId();
			return shopping.find({ userid: currentUserId, name: "shopping_list" }).fetch();
		},
	});
  Template.view_created_list.helpers({
  		list_items(){
  			var currentUserId = Meteor.userId();
				var url = window.location.pathname; var str = url.split("/"); var catid = str[2];
				var list;
				bucket.find({ userid: currentUserId, category: catid, name: "shopping_bag" }).forEach(function(obj){
					list += '<tr><td>'+obj.storename+'</td><td>'+obj.productname+'</td><td>'+obj.quality+'</td><td>'+obj.price+'</td>--<td>';
					if(obj.bought == "bought"){
						list += 'Bought';
					}else{
						list += '<button value="'+obj._id+'" id="buy">Buy</button>';
					}
						list += '</td></tr>';
				})
				return list;
  		},
  	});
		Template.view_shop_list.helpers({
	  		list_items(){
	  			var currentUserId = Meteor.userId();
					var url = window.location.pathname; var str = url.split("/"); var catid = str[2];
					return bucket.find({ userid: currentUserId, category: catid, name: "shopping_bag" }).fetch();
	  		},
	  	});
		/*Template.edit_created_list.helpers({
	  		list_items(){
	  			var currentUserId = Meteor.userId();
					var url = window.location.pathname; var str = url.split("/"); var catid = str[2];
					alert(catid);
					return bucket.find({ userid: currentUserId, _id:catid, name: "shopping_bag" }).fetch();
	  		},
	  	});*/
/*Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});*/
