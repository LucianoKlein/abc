!function() {
    let view = {
        "body": document.body,
        "button": messageSubmitButton,
        "messageList": forumMessageList,
        "input": messageInputBox,
        "dialog": dialog,
        "dialogButton": document.getElementById("dialog-button"),
        "loginButton": document.querySelector(".dialogLogin .buttonSec .yes-button"),
        "loginDialog": document.querySelector(".dialogLogin"),
        "messageList": forumMessageList,
        "messageItemTemplate": commentItemTemplate,
        "popAlert": function() {

        },
        "popLogin": function() {

        }
    };
    let controller = {
        view: null,
        model: null,
        init: function(view, model) {
            this.view = view;
            this.model = model;
            this.model.init();
            this.bindEvents();
            this.clearMessageList();
            this.loadMessage();
        },
        bindEvents: function() {
            view.button.addEventListener("mouseover", function(e){
                let child = e.currentTarget.parentNode.firstChild;
                while (child.nodeType === Node.TEXT_NODE) {
                    child = child.nextSibling;
                }
                e.currentTarget.classList.remove("abledButton");
                e.currentTarget.classList.remove("inputActive");
                e.currentTarget.classList.add("disabledButton");
                if (child.value !== "") {
                    e.currentTarget.classList.remove("disabledButton");
                    e.currentTarget.classList.add("inputActive");
                }
            });
            // abledButton   -- 鼠标悬浮状态           -- state1
            // inputActive   -- 出现状态              -- state2
            // disableButton -- 鼠标悬浮，但是输入框为空 -- state3
            // 不加类         -- 那就是原始状态         -- state0
            
            view.button.addEventListener("mousedown", function(e) {
                let buttonClassList = e.currentTarget.classList;
                let findFlag = false;
                buttonClassList.forEach((element) => {
                    if (element === "disabledButton") {
                        findFlag = true;
                    }
                });
                view.button.classList.remove("inputActive");
                view.button.classList.remove("disabledButton");
                view.button.classList.remove("abledButton");


                view.button.onmouseleave = null;

                if (findFlag === true) {
                    globalMask.classList.add("maskActive");
                    dialog.classList.add("popout");
                } else {
                    globalMask.classList.add("maskActive");
                    view.loginDialog.classList.add("popout");
                }
            });

            view.dialogButton.addEventListener("click", function (e) {
                view.dialog.classList.remove("popout");
                view.button.onmouseleave = function(e) {
                    view.button.classList.remove("disabledButton");
                    view.button.classList.remove("abledButton");
                    view.button.classList.add("inputActive");
                };
                globalMask.classList.remove("maskActive");
            });

            view.loginButton.addEventListener("click", function(e) {
                let name = $("#userName").val();
                let email = $("#userEmail").val();
                let date = new Date();
                let text = $("#messageInputBox").val();
                if (name === "" || email === "") {
                    alert("请输入用户名和密码");
                    return;
                } else {
                    console.dir(this);
                    this.model.save(email, name, date, text).then(
                        function() {
                            console.log("保存成功");
                            this.addAMessage(email, name, date, text);
                        }.bind(this), 
                        function() {
                            console.log("请求失败");
                        }
                    );
                }
                
                view.loginDialog.classList.remove("popout");
                view.button.onmouseleave = function(e) {
                    view.button.classList.remove("disabledButton");
                    view.button.classList.remove("abledButton");
                    view.button.classList.add("inputActive");
                };

                globalMask.classList.remove("maskActive");
                $("#messageInputBox").val("");
                $("#userName").val("");
                $("#userEmail").val("");
            }.bind(this))

            view.button.onmouseleave = this.toStateNormalAppear;
            view.input.addEventListener("focus", this.toStateNormalAppear);
            view.input.addEventListener("blur", this.toStateDisappear);


        },
        // abledButton   -- 鼠标悬浮状态           -- state1
        // inputActive   -- 出现状态              -- state2
        // disableButton -- 鼠标悬浮，但是输入框为空 -- state3
        // 不加类         -- 那就是原始状态         -- state0
        popError: function() {

        },
        toStateDisappear: function(e) {
            view.button.classList.remove("inputActive");
            view.button.classList.remove("disabledButton");
            view.button.classList.remove("abledButton");
        },
        toStateHoverActive: function(e) {
            view.button.classList.remove("disabledButton");
            view.button.classList.remove("inputActive");
            view.button.classList.add("abledButton");
        },
        toStateNormalAppear: function(e) {
            view.button.classList.remove("disabledButton");
            view.button.classList.remove("abledButton");
            view.button.classList.add("inputActive");
        },
        toStateHoverInactive: function(e) {
            view.button.classList.remove("inputActive");
            view.button.classList.remove("abledButton");
            view.button.classList.add("disabledButton");
        }, 
        loadMessage: function() {
            this.model.fetch().then(
                (messages) => {
                    let array = messages.map((item) => item.attributes);
                    array.forEach((item) => {
                        var aMessage = this.generateMessageTemplate(item.email, item.name, item.submitdate, item.text);
                        $("#forumMessageList").append(aMessage);
                    })
                }
            );
        },
        generateMessageTemplate: function(email, name, submitdate, text) {
            let root = this.view.messageItemTemplate;
            let clone = $(root).clone();
            let timeString = `${submitdate.getFullYear()}年${submitdate.getMonth() + 1}月${submitdate.getDate()}日${submitdate.getHours()}点${submitdate.getMinutes()}分`;
            clone.removeClass("commentItemTemplate");
            clone.addClass("commentItem");
            clone.find(".comment-username").text(name);
            clone.find(".Comment-time").text(timeString);
            clone.find(".CommentItem-content").text(text);
            clone.find(".emailUser").text(email);
            return clone;
        },
        clearMessageList: function() {
            $("#forumMessageList").children().remove();
        },
        addAMessage: function(email, name, date, text) {
            let messageTemp = this.generateMessageTemplate(email, name, date, text);
            $("#forumMessageList").append(messageTemp);
        }
    }
    let model = {
        init: function() {
            var APP_ID = 'gTIQW49yzP1BMrtopOL25gTs-gzGzoHsz';
            var APP_KEY = '3zPgB95C8IdicN3ynFJXokGw';
            AV.init({appId: APP_ID, appKey: APP_KEY});
        },
        fetch: function() {
            let query = new AV.Query("Message");
            return query.find(); //Promise对象
        }, 
        save: function(email, name, submitdate, text) {
            let Message = AV.Object.extend('Message');
            let message = new Message();
            let dateString = `${submitdate.getFullYear()}年${submitdate.getMonth() + 1}月${submitdate.getDate()}日${submitdate.getHours()}点${submitdate.getMinutes()}分`;
            console.log(email);
            console.log(name);
            console.log(dateString);
            console.log(text);
            return message.save({
                "email": email,
                "name": name,
                "submitdate": submitdate, 
                "text": text
            });
        }
    }
    controller.init(view, model);

}.call();
