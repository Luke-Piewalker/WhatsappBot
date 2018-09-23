(() => {

    const ignoreLastMsg = {};

    //
    // FUNCTIONS
    //

    // Get random value between a range
    function rand(high, low = 0) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    // Call the main function again
    const goAgain = (fn, sec) => {
        setTimeout(fn, sec * 1000);
    };

    // Dispath an event (of click, por instance)
    const eventFire = (el, etype) => {
        let evObj = document.createEvent("Events");
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    };

    // Select a chat to show the main box
    const selectChat = (chat, cb) => {
        const title = chat.querySelector(".emojitext").title;
        eventFire(chat, "mousedown");

        if (!cb) return;

        const loopFewTimes = () => {
            setTimeout(() => {
                const titleMain = document.querySelector("h2.chat-title").innerText;

                if (titleMain != title) {
                    console.log("not yet");
                    return loopFewTimes();
                }

                return cb();
            }, 1);
        };

        loopFewTimes();
    };

    // Send a message
    const sendMessage = (chat, message, cb) => {
        //avoid duplicate sending
        const title = chat.querySelector(".emojitext").title;
        ignoreLastMsg[title] = message;

        //add text into input field
        document.querySelector(".input").innerHTML = message.replace(/  /gm,"");

        //Force refresh
        event = document.createEvent("UIEvents");
        event.initUIEvent("input", true, true, window, 1);
        document.querySelector(".input").dispatchEvent(event);

        //Click at Send Button
        eventFire(document.querySelector(".compose-btn-send"), "click");

        cb();
    };


    const start = (_chats, cnt = 0) => {
        // get next unread chat
        const chats = _chats || document.querySelectorAll(".chat");
        const chat = chats[cnt];
        
        if (chats.length == 0 || !chat) 
		{
            console.log(new Date(), "nothing to do now... (1)", chats.length, chat);
            return goAgain(start, 3);
        }
      
        // get infos
        const title = chat.querySelector(".emojitext").title + "";
      
      	//console.log(title);
      	//console.log(title.indexOf("SE:"));
      
		if (title.indexOf("SE:") == -1)
		{
			//console.log(new Date(), "not south east chat", chats.length, chat);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1)
		}
      
        const lastMsg = (chat.querySelector(".last-msg") || { innerText: "" }).innerText; //.last-msg returns null when some user is typing a message to me

        // avoid sending duplicate messaegs
        if ((ignoreLastMsg[title]) == lastMsg) 
				{
            console.log(new Date(), "nothing to do now... (2)", title, lastMsg);
            return goAgain(() => { start(chats, cnt + 1) }, 0.1)
        }

        let sendText;

        console.log(lastMsg);
                                 
        if (lastMsg.toUpperCase().indexOf("@HELP") > -1)
		{
            sendText = `
                Some commands that you can send me:
                1. *@TIME*
                2. *@RAND* (between 0-10)`;
		}

        if (lastMsg.toUpperCase().indexOf("@TIME") > -1)
		{
            sendText = `The time is : *${new Date()}*`;
		}

        if (lastMsg.toUpperCase().indexOf("@RAND") > -1)
		{
            random = rand(10);
			sendText = "Number : "+ random;
		}

        if (!sendText) {
            ignoreLastMsg[title] = lastMsg;
            console.log(new Date(), "new message ignored -> ", title, lastMsg);
            return goAgain(() => { start(chats, cnt + 1) }, 0.1);
        }

        console.log(new Date(), "new message to process, uhull -> ", title, lastMsg);

        sendMessage(chat, sendText.trim(), () => {
            goAgain(() => { start(chats, cnt + 1) }, 0.1);
        })
    }

    start()
})()