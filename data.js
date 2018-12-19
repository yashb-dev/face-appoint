module.exports = function(config) {
	const Firestore = require('@google-cloud/firestore');
	const settings = {timestampsInSnapshots: true};
    const firestore = new Firestore({
        projectId:config.projectId,
        keyFilename:config.keyFilename
    });
    firestore.settings(settings);
    
    function register(user, callback){
        var error = null;
    	var user_query = firestore.collection('user-data').doc(user.username).get()
        	.then(account => {
                if (account.exists){
                    error = new Error('Username already in use');
                    user = null;
                } else {
                    firestore.collection('user-data').doc(user.username).set({
                        username:user.username, password:user.password, account_type:user.account_type,
                        first_name:user.first_name, last_name:user.last_name, appointments:[]
                    });
                }
                callback(error,user)
    		});
    }
	
	function getItems(user, callback){
		var service_type = '';
		
		if (user.account_type === 'customer'){
			service_type = 'service_requester';
		} else if (user.account_type === 'calendar_owner'){
			service_type = 'service_provider';
		}
		var query = firestore.collection('appointments').where(service_type,'==',user.username).get()
			.then(snapshot =>{
				var array = [];
				snapshot.forEach(apt => {
                    if(apt.exists){
                        var ret = apt.data();
                        ret.date = ret.date.toDate().toDateString();
						ret.start_time = ret.start_time.toDate().toTimeString().substr(0,5);
                        ret.end_time = ret.end_time.toDate().toTimeString().substr(0,5);
						array.push(ret);	
                    }
				});
				callback(null,array);
			});
    }

    function getService(search, callback){
        var query = firestore.collection('user-data').where('service_types', 'array-contains',search['search']).get()
            .then(snapshot => {
                var array = [];
                snapshot.forEach(result => {
                    if (result.exists){
                        array.push(result.data());
                    }
                });
                callback(null, array);
            });
    }

    function getProfile(user, callback){
        var query = firestore.collection('user-data').doc(user).get()
            .then(user => {
                if (user.exists){
                    callback(null,user.data());
                }
            })
    }

    function submitRequest(request, callback){
        var date = Date.parse(request.date);
        var h = parseInt(request.time.substr(0,2));
        var m = parseInt(request.time.substr(3,2));
        var time = ((h+5)*60+m)*60*1000;
        var datetime = new Date(date+time);
        var requestID = firestore.collection('appointments').doc();
        requestID.set({
            service_provider:request.service_provider,
            service_requester:request.service_requester,
            date:datetime, start_time:datetime, end_time:datetime,
            name:request.name, status:'requested', id:requestID.id
        });
        callback(null, requestID);
        
    }
		
	return {
        updateTime:updateTime,
		register:register,
		getItems:getItems,
        getService:getService,
        getProfile:getProfile,
        submitRequest:submitRequest
	};
};