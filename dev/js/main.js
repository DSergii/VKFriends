window.onload = function(){

	VK.init({
		apiId: 5371076
	});

	var btn_vk = document.getElementById('btn-vk');
	var fName = document.getElementById('fName');
	var lName = document.getElementById('lName');
	var login = document.getElementById('btn-login');
	var logout = document.getElementById('btn-logout');
	var userImg = document.getElementsByTagName('img')[0];
	var btnSave = document.getElementById('btn-save');

	var leftList = document.getElementsByClassName('leftSide')[0];
	var rightList = document.getElementsByClassName('rightSide')[0];
	var holder = document.getElementsByClassName('holder')[0];
	var input = document.getElementsByClassName('hold-input')[0];

	var userName = {};

new Promise(function(resolve){
	function loginVk() {
		VK.Auth.login(function(response) {
			if (response.session) {
				resolve(response);
				userName.fname = response.session.user.first_name;
				userName.lname = response.session.user.last_name;
			} else {
				alert('Не удалось авторизоваться');
			}
		}, 2);
	}
	btn_vk.addEventListener('click', loginVk);
	
}).then(function(){
	return new Promise(function (resolve, reject){
		VK.api('users.get', {'fields':'photo_50'}, function(response) {
			if (response.error) {
				console.log(response.error);
			} else {
				userImg.setAttribute('src', response.response[0].photo_50);
				resolve();
			}
		});
	})
}).then(function(resolve, reject){
	logout.addEventListener('click', logoutVk);
	
	fill(userName);

	function logoutVk() {
		VK.Auth.logout(function(response){
			if(response.session === null){
				userName.fname = '';
				userName.lname = '';
				fill(userName);
				userImg.removeAttribute('src');
			}
		});
	}

	function fill(obj) {
		for(var i in obj){
			if(obj[i].length > 0){
				fName.innerHTML = obj.fname;
				lName.innerHTML = obj.lname;
				login.style.display = 'none';
				logout.style.display = 'block';
			}else{
				fName.innerHTML = '';
				lName.innerHTML = '';
				login.style.display = 'block';
				logout.style.display = 'none';
			}
		}
	}
}).then(function(){
	return new Promise(function(resolve, reject){
			VK.api('friends.get', {'fields': 'nickname,  photo_50', 'order': 'name'}, function(response) {
	            if (response.error) {
	                reject(new Error(response.error.error_msg));
	            } else {

	            	var friends = response.response;
	            	var savedFriends = [],
	            		array = [],
	                	array2 = [],
	                	familyArr = [],
	                	filterArr = [],
	                	name = [],
	                	html = template.innerHTML,
	            		html2 = template2.innerHTML;

	            	if(localStorage.getItem('friends') === null){
	            		localStorage.setItem('friends', '');
	            	}
	            	if(localStorage.getItem('friends').length > 0){
	            		savedFriends = JSON.parse(localStorage.getItem('friends'));
	            		filterArr = friends.filter(filtering);
	            		for (var i = 0; i < savedFriends.length; i++) {
	            			familyArr.push(savedFriends[i].last_name.toLowerCase());
	            		};
	                }else{
	                	filterArr = friends;
	                }

	                function filtering(el){
	                	for (var i = 0; i < savedFriends.length; i++) {
	                		name.push(savedFriends[i].last_name.toLowerCase());
	                	};
	                	if(name.indexOf(el.last_name.toLowerCase()) != -1 ){
                			return false;
                		}else{
                			return true;
                		}
	                }

		            templateFn = Handlebars.compile(html);
		            templateFn2 = Handlebars.compile(html2);

                    template = templateFn({list: filterArr});
                    templateRight = templateFn2({list: savedFriends});

                    leftList.innerHTML = template;
                    rightList.innerHTML = templateRight;

	                resolve();
	                sortFriend();
	                

	                holder.addEventListener('click', addFriend);
	                btnSave.addEventListener('click', saveFriend);

		            function addFriend(e){
	                	if(e.target.className.indexOf('glyphicon-remove') > -1){
	                		var element = e.target.parentNode;
	                		var pos = familyArr.indexOf(element.getAttribute('data-last').toLowerCase());
	                		familyArr.splice(pos, 1);
	                	}
	                	if(e.target.nodeName === 'SPAN' && e.target.classList[2] === 'myClass'){	
	                		console.log('familyArr', familyArr);
							for (var i = 0; i < e.path.length; i++) {

								if(e.path[i].nodeType == 1 && e.path[i].classList.contains('leftSide')){
									e.target.className = 'glyphicon glyphicon-remove myClass';
									var element = e.target.parentNode;
									rightList.appendChild(element);
									familyArr.push(element.getAttribute('data-last').toLowerCase());
								}else if(e.path[i].nodeType == 1 && e.path[i].classList.contains('rightSide')){
									e.target.className = 'glyphicon glyphicon-plus myClass';
									var element = e.target.parentNode;
									leftList.appendChild(element);
								}
							};

							if(rightList.childNodes.length > 1){
								btnSave.classList.add('visible');
							}else{
								btnSave.classList.remove('visible');
							}
						}
					}

	                function sortFriend(){
						input.addEventListener('keyup', function(e){
				            if(e.target.getAttribute('id') == 'searchFriend1'){
				            	array = [];

								var match = e.srcElement.value.trim();

								for (var i = 0; i < filterArr.length; i++) {
									if(filterArr[i].last_name.toLowerCase().indexOf(match) > -1){
										array.push(filterArr[i]);
									}
								};

								leftList.innerHTML = '';
					            template = templateFn({list: array});
				            	leftList.innerHTML = template;
				            }else{

			            		array = [];
								array2 = [];

								for (var i = 0; i < friends.length; i++) {
			            			if(familyArr.indexOf(friends[i].last_name.toLowerCase()) != -1){
			            				array.push(friends[i]);
			            			} 
			            		};

								var match = e.srcElement.value.trim();

			            		for (var i = 0; i < array.length; i++) {
									if(array[i].last_name.toLowerCase().indexOf(match) > -1){
										array2.push(array[i]);
									}
								};

								rightList.innerHTML = '';
								template = templateFn({list: array2});
			            		rightList.innerHTML = template;

				            }

						});
					}

					function saveFriend(){
						var sf = [];
						if(familyArr.length > 0){
							for (var i = 0; i < friends.length; i++) {
		                		if(familyArr.indexOf(friends[i].last_name.toLowerCase()) > -1){
		                			sf.push(friends[i]);
		                		}
		                	};
							localStorage.setItem('friends', JSON.stringify(sf));
						}else{
							localStorage.removeItem('friends');
						}
					}
	            }
	        });
		});
});
	

	
	
};