(async ()=>{
	const base_data  =  await getChatData(); 
	const d  =  new Date();
	const user_temp  = `
	{{#each data}}
		<li class="chat-list chat-list-ccrate-user {{#if @first}}active{{/if}} pointer" data-target="{{id}}">
		    <div class="chat-profile flex">
		        <img src="assets/images/profiles/{{profile}}" alt="">
		        <span class="user-status" stat="{{status}}"></span>
		    </div>
		    <div class="chat-detail">
		        <h3 class="title font-light color-dark truncates chat-name-title">{{name}}</h3>
		        <p class="color-white-dark truncates">{{listen.0.listen}}</p>
		    </div>
		</li>
		{{/each}}
	`
	const  usr_temp  = Handlebars.compile(user_temp);
	$("#__user-temp__handle").html(usr_temp({"data":base_data}));
	const message_temp =  `
	{{#each data}}
	 <li class=" clear overflow-hidden {{#if byme}} byme {{/if}}">
	    <div class="parent">
	      {{#unless image}}
            <p>{{listen}}</p>
            {{/unless}}
            {{#if image}}
                <img src="{{image}}" width="100" class="float-right">
            {{/if}}
           <div class="wd-100-p">
             <small>{{#if date}} {{date}} {{/if}} {{#unless date}} ${day_ellapse[d.getDay()]}.${d.getHours()}.${d.getMinutes() }  {{/unless}} </small>
             </div>
	    </div>
	</li>
	{{/each}}`;


	var chatmake = async  (data = []) => {
		//console.log(data)
		$(".blok-chat").addClass('avenoor');
		var temp_chat  = Handlebars.compile(message_temp);
		await $("#__message-temp_ui").append(temp_chat({"data":data}));
		setTimeout(()=>{
            $(".temp_ui_message").scrollTop($(".temp_ui_message").height() ** 2 )
        },100)
	}

	 var createChatList =  async (id) =>{
        var data  = await getChatData({id:parseInt(id)});
        $("#__profile_chat_name").text(data[0]["name"]);
        $("#__profile_chat_image").attr('src', path_uri+`assets/images/profiles/${data[0]["profile"]}`);
        $("#pointer-status").attr('stat', data[0]["status"]);
        $("#__message-temp_ui").empty()
        chatmake(data[0]["listen"]);
    }
    $(document).on('click','.chat-list-ccrate-user',function (event) {
    	event.stopPropagation();
    	event.preventDefault();
    	var did  =  $(this).data("target");
    	createChatList(did);
    	request.replace("message.html?kayuku_message_bin="+did)
    	$(document).find('.chat-list-ccrate-user').removeClass('active');
    	$(this).addClass('active');
    })
    if ($(window).width() > 768) {
    	createChatList(0);
    }
    $(".back-chat").click(function(event) {
    	$(".blok-chat").removeClass('avenoor');
        request.replace("message.html");
    });

     $("#chat_get_upfile").change(async function() {
        var reader = new FileReader();
        reader.onload =async  (event)=>{
                 await  chatmake([{"listen":"","image":event.target.result,"byme":true}]);
                 console.log(event.target.result)
                     var dumy_text  =  await getShuffleChat();
                     makeRandom(dumy_text.length,1).forEach(async(result)=>{
                        $(".blok-chat .typing").removeClass('none');
                        await setTimeout(()=>{
                            chatmake([dumy_text[result]])
                            $(".blok-chat .typing").addClass('none');
                        },1000)
                     })
              
        }
        var file  =  reader.readAsDataURL(this.files[0]);
     });



    $(".form-typing").submit(async function(event) {
        event.preventDefault();
        var text  =  $(this).find('input[type=text]').val();
        if (text.length > 0) {
           await  chatmake([{"listen":text.split("\n").join(""),"image":false,"byme":true}]);
             var dumy_text  =  await getShuffleChat();
             makeRandom(dumy_text.length,1).forEach(async(result)=>{
                $(".typing").removeClass('none');
                await setTimeout(()=>{
                    chatmake([dumy_text[result]])
                    $(".typing").addClass('none');
                },1000)
             })
             $(this).trigger('reset')
        }

    });


     $("#find-client-chat").keyup(function(event) {
        var valme = $(this).val();
        if (valme.length > 0) {
            document.querySelectorAll("#__user-temp__handle li").forEach( function(element, index) {
                element.classList.add("hide");
                if (element.querySelector(".chat-name-title").textContent.toLowerCase().includes(valme.toLowerCase())) {
                    return element.classList.remove('hide');
                }
            });
        } else {
           $("#__user-temp__handle  li").removeClass('hide'); 
        }
    });
     if (request.get("kayuku_message_bin")) {
     	var bin  =  request.get("kayuku_message_bin");
     	createChatList(bin);
     	$(".chat-list-ccrate-user").removeClass('active');
     	$(`.chat-list-ccrate-user[data-target=${bin}]`).addClass('active');
     }



})()
/*

 window.addEventListener('popstate', function(e) {
  		alert("dem")
  		return false;
  })*/