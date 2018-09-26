
define(function (require, exports, module) {

    require("ko");
    require("frozencss");
    require("appcss");
    
    // 未使用2017投票
    function userInfoBind(msg) {
        
        var jdat = JSON.parse(msg);

        if (jdat.status == "100") {
            console.log(jdat.data);
            var userTypeValue;
            switch (jdat.data.userType){ 
                case 1 : 
                    userTypeValue="业主";
                    break; 

                case 2 :     
                    userTypeValue="家属";
                    break; 
                case 3:
                    userTypeValue = "租客";
                    break;
                case 4:
                    userTypeValue = "伙伴";
                    break;
                case 5:
                    userTypeValue = "嘉宾";
                    break;
                default: "";
                    break; 
            } 
            var viewModel = {     
                result: jdat.data,
                userType:userTypeValue
            }
            var div = document.getElementById("contain");
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);

            $("#btnSub").on(_CLICK_MODEL, function () {
                if (jdat.data.realnameExamine == 1) {
                    //以实名认证，直接跳转
                    window.location.href = './index.html#/satisfaction/vote'+
                                            '?token=' + token +
                                            '&companyCode=' + companyCode +
                                            '&defCommunityId=' + defCommunityId +
                                            '&defRoomId=' + defRoomId +
                                            '&voteId=' + voteId;
                }
                else {
                    //调用修改姓名接口
                    var username = $('.infoRight input').val();
                    //alert(username);
                    //return false;
                    if (username == "" || username == null) {
                        alert("姓名不能为空哦~");
                    }
                    else {
                        if (confirm("请确认您的信息真实有效，否则拿不到大奖哦")) {
                            var modifyUserNameData = new Object();
                            for (var x in postData) {
                                modifyUserNameData[x] = postData[x];
                            }
                            modifyUserNameData.userName = username;

                            post("scVoteAction!modifyUserName.action", modifyUserNameData, locationBind);
                        }
                    }
                }
            });
        }

    }

    function voteCheck(msg) {
        var jdat = JSON.parse(msg);
        if (jdat.status == "100") {
            //未参与投票
            if (jdat.data.isVote == 0) {
                voteId = getVal("voteId");
                newPost("/vote/" + voteId + "/surveyInfo",undefined, voteBind, undefined, 'get');
            }
            else {
                //跳转到首页
                window.location.href = './index.html#/satisfaction/home' +
                                      '?token=' + token +
                                      '&companyCode=' + companyCode +
                                      '&defCommunityId=' + defCommunityId +
                                      '&defRoomId=' + defRoomId +
                                      '&voteId=' + voteId;
            }
      
        }
    }
    function voteBind(msg) {
        var jdat = JSON.parse(msg);
        if (jdat.status == "100") {
            var placeholder = "";
            if (agent.indexOf("android") == -1) {
                placeholder = "   ";
            }
            // var questionType = [
            //     {
            //         "id": "d55a76e7-9d05-11e7-b3fe-ecf4bbbf7d00",//住宅
            //         "questions": [{ "explain": "一、甄别问题", "begin": 0, "end": 4, "index": 0,"displayIndex":-1 },
            //             { "explain": "二、服务评分<p>以下服务是物业服务工作的重点（不包括房产、周边配套等其他服务的评价），请您对下面的一些指标进行打分。(5分为非常满意，4分为比较满意，3分为一般，2分为不太满意，1分为非常不满意。)</p>", "begin": 4, "end": 20,"index": 4 ,"displayIndex":-1},
            //         { "explain": "三、园区活动服务评价<p>对于开展的以下园区活动，您的参与情况和满意程度如何？（5分为非常满意，4分为比较满意，3分为一般，2分为不太满意，1分为不满意。）</p>", "begin": 20, "end": 23, "index": 20,"displayIndex":1},
            //         { "explain": "四、其他项评分", "begin": 23, "end": 27 ,"index": 23,"displayIndex":-1},
            //         { "explain": "五、背景资料", "begin": 27, "end": 32,"index":27 ,"displayIndex":-1}],
            //         "display": 22
            //     },
            //     {
            //         "id": "2f603041-9d24-11e7-b3fe-ecf4bbbf7d00",//写字楼
            //         "questions": [{ "explain": "一、甄别问题", "begin": 0, "end": 4, "index": 0 ,"displayIndex":-1},
            //         { "explain": "二、服务评分<p>以下服务是物业服务工作的重点，请您对下面的一些指标进行打分。(5分为非常满意，4分为比较满意，3分为一般，2分为不太满意，1分为非常不满意。)</p>", "begin": 4, "end": 19,"index": 4,"displayIndex":-1 },
            //         { "explain": "三、其他项评分", "begin": 19, "end": 23,"index": 19 ,"displayIndex":-1},
            //         { "explain": "四、背景资料", "begin": 23, "end": 27 ,"index": 23 ,"displayIndex":-1}],
            //         "display": 22
            //     },
            // ];
            // questionType.forEach(function(vote) {
            //     if (vote.id == voteId) {
            //         vote.questions.forEach(function (type, index) {
            //             type.isName = 1;
            //             if (index == 0) type.isName = 0;
            //             type.question = jdat.data.questions.slice(type.begin, type.end);
            //         });
            //         jdat.data.newQuestions = vote;
            //     }
            // }, this);
            console.log(jdat.data);
            var viewModel = {
                paper: jdat.data,
                placeholder: placeholder
            }

            var div = document.getElementById("contain");
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);
            $("#satisPaper").show();
            $(".ui-loading-wrap").remove();
            bindOptionClickHandler();
            function bindOptionClickHandler() {
                $(".votetable li").on("click", function () {
                    //  checkPermission();
                    var hasSCnt = $(this).parent().parent().find(".check").size();
                    var hasSlt = $(this).hasClass("check");
                    var maxSCnt = $(this).parent().attr("maxSCnt");
                    var queIndex = $(this).parent().attr('queIndex');
                    if (!hasSlt) {
                        if (maxSCnt == 1 && hasSCnt == 1) {
                            $(this).parent().parent().find(".check").eq(0).find('img').eq(0).show();
                            $(this).parent().parent().find(".check").eq(0).find('img').eq(1).hide();
                            $(this).parent().parent().find(".check").removeClass("check");
                        } else if (hasSCnt + 1 > maxSCnt) {
                            alert("该题最多只能选择" + maxSCnt + "项");
                            return false;
                        }
                        $(this).addClass("check");
                        $(this).find('img').eq(0).hide();
                        $(this).find('img').eq(1).show();
                        //chuxian
                        if (voteId == 'd55a76e7-9d05-11e7-b3fe-ecf4bbbf7d00' && queIndex == 20) {
                            if ($(this).attr('oIndex') == 5) {
                                $('#satisPaper').find(".questions").eq(21).hide();
                            } else{
                                 $('#satisPaper').find(".questions").eq(21).show();
                            }
                        }
                    } else {
                        $(this).removeClass("check");
                        $(this).find('img').eq(0).show();
                        $(this).find('img').eq(1).hide();
                    }
                });
                $(".sup textarea").bind("input propertychange keyup", function () {
                    var lenInput = $(this).val().length;
                    console.log(lenInput);
                    if (lenInput >= 0 && lenInput <= 500) {
                        $(this).parent().find('.textareaInput').css('color','#aaa');
                    } else {
                        $(this).val($(this).val().substr(0, 500));
                        lenInput = 500;
                        $(this).parent().find('.textareaInput').css('color','red');
                    }
                    $(this).parent().find('.textareaInput').html(lenInput);
                });
            }
        }
    }

    function drawResultBind(msg) {
        var jdat = JSON.parse(msg);

        if (jdat.status == "100") {
            var drawResult, drawName, noneResult = {},userName='',mobileNum='';
           //  jdat.data = [{ "level": 3 }];
            if (jdat.data == null) {
                $('.drawNone').show()
                var result = [{ "imgTitle": "回来啦社区股票代码HK2869", "img": './img/satis/random1.png' },
                    { "imgTitle": "报事分类，让我们更快的了解你的需求!", "img": './img/satis/random2.png' },
                    { "imgTitle": "联系管家用管家专属号更方便哦!", "img": './img/satis/random3.png' },
                    { "imgTitle": "有客来访不如给他发个访客二维码，出入更便捷!", "img": './img/satis/random4.png' },
                    { "imgTitle": "领取快递用二维码，扫一扫带回家!", "img": './img/satis/random5.png' }]
                noneResult = result[Math.floor(Math.random() * result.length)];
            }
            else {
                $('.drawResult').show();   
                userName = jdat.data.userName;
                mobileNum = jdat.data.mobileNum;
                switch (jdat.data.level) {
                    case 1:    
                        drawName = "<div class='redInfo'> <p style='padding-top:73px;'>恭喜您中奖回来啦社区20元通用红包，红包将在24小时内发放至您的账户，请前往“我的-我的红包”中查看。</p></div>  ";
                        break;
                    case 2:
                        drawName = "<div class='redInfo'> <p style='padding-top:73px;'>恭喜您中奖回来啦社区15元通用红包，红包将在24小时内发放至您的账户，请前往“我的-我的红包”中查看。</p></div>  ";
                        break;
                    case 3:
                        drawName = "<div class='redInfo'> <p style='padding-top:73px;'>恭喜您中奖回来啦社区10元通用红包，红包将在24小时内发放至您的账户，请前往“我的-我的红包”中查看。</p></div> ";
                          break;
                    case 4:
                        drawName = "<div class='redInfo'> <p style='padding-top:73px;'>恭喜您中奖回来啦社区5元通用红包，红包将在24小时内发放至您的账户，请前往“我的-我的红包”中查看。</p> </div> ";
                        break;
                    case 5:
                        drawName = "<div class='redInfo'> <p style='padding-top:73px;'>恭喜您中奖回来啦社区3元通用红包，红包将在24小时内发放至您的账户，请前往“我的-我的红包”中查看。</p></div>  ";
                        break; 
                    case 6:
                        drawName = "<div class='redInfo'> <p style='padding-top:73px;'>恭喜您中奖回来啦社区2元通用红包，红包将在24小时内发放至您的账户，请前往“我的-我的红包”中查看。</p></div>  ";
                        break; 
                    default:"";
                        break;
                }
            }
            var viewModel = {
                result: drawResult,
                noneResult:noneResult,
                drawName: drawName,
                userName: userName,
                mobileNum: mobileNum
            }

            var div = document.getElementById("contain");
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);

        }
    }

    function drawFun(msg) {
        var jdat = JSON.parse(msg);
        //获取奖品列表
        var award = [],drawName = '',billboardTitle = '奖品信息',hasWinning=false;
        if (jdat.status == 100) {
            award = jdat.data.awards;
            awardInfo = splitArray(jdat.data.luckyDogs,5);
            hasWinning = jdat.data.hasWinning;
        }
        console.log(awardInfo);
        var viewModel = {
            drawName: ko.observable(drawName),
            award: ko.observableArray(award),
            awardInfo: ko.observableArray(awardInfo),
            billboardTitle:ko.observable(billboardTitle)
        }

        var div = document.getElementById("contain");
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
        if (hasWinning) {
            $('.drawInfo').show();
            $('.drawlist').hide();
            viewModel.billboardTitle('中奖名单');
        }
        if (awardInfo.length > 1) {
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                autoplay: 3000,
                loop: true,
                autoplayDisableOnInteraction: false,
                height: 175
            })
        } else if(awardInfo.length == 1)  {
            var length = awardInfo[0].length * 35;
            $('.swiper-container').css('height',length+'px')
              var mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                height: length
            })
        }
       	var luck={
			index:-1,	//当前转动到哪个位置，起点位置
			count:0,	//总共有多少个位置
			timer:0,	//setTimeout的ID，用clearTimeout清除
			speed:20,	//初始转动速度
			times:0,	//转动次数
			cycle:50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
			prize:-1,	//中奖位置
			init:function(id){
				if ($("#"+id).find(".luck-unit").length>0) {
					$luck = $("#"+id);
					$units = $luck.find(".luck-unit");
					this.obj = $luck;
					this.count = $units.length;
					$luck.find(".luck-unit-"+this.index).addClass("active");
				};
			},			
			roll:function(){
				var index = this.index;
				var count = this.count;
				var luck = this.obj;
				$(luck).find(".luck-unit-"+index).removeClass("active");
				index += 1;
				if (index > count-1) {
					index = 0;
				};
				$(luck).find(".luck-unit-"+index).addClass("active");
				this.index=index;
				return false;
			},
			stop:function(index){
				this.prize=index;
				return false;
			}
        };
        var prizeIndex = 0;
        function roll() {
            luck.times += 1;
            luck.roll();
            if (luck.times > luck.cycle + 10 && luck.prize == luck.index) {
                clearTimeout(luck.timer);
                luck.prize = -1;
                luck.times = 0;
                click = false;
                var $alert = null;
                // if (prizeIndex == 1 || prizeIndex == 5 || prizeIndex == 2 || prizeIndex == 4) {
                //     $alert = $('.layeriphone');
                // }
                // if (prizeIndex == 0 || prizeIndex == 3 || prizeIndex == 6) {
                //     $alert = $('.layerred');
                // }
                // if (prizeIndex == 7) {
                //     $alert = $('.layernone');
                // }
                $alert = $('.layerred');
                // $('#layer').show(500);
                //     $alert.show();
                setTimeout(function () {
                    $('#layer').show();
                    $alert.show();
                }, 1000)
              
            } else {
                if (luck.times < luck.cycle) {
                    luck.speed -= 10;
                } else if (luck.times == luck.cycle) {
                    var index = prizeIndex;// Math.random() * (luck.count) | 0;           
                    luck.prize = index;
                    console.log(luck);
                } else {
                    if (luck.times > luck.cycle +10 ) {
                        luck.speed += 110;
                    } else {
                        luck.speed += 20;
                    }
                }
                if (luck.speed < 40) {
                    luck.speed = 40;
                };
                luck.timer = setTimeout(roll, luck.speed);
            }
            return false;
        }
            var click=false;
            luck.init('luck'); 
			$("#awardbtn").click(function(){
				//按下弹起效果
                $("#awardbtn").parent().addClass("cjBtnDom");
                $("#awardbtn").attr("disabled", true);
				setTimeout(function(){	
					$("#awardbtn").parent().removeClass("cjBtnDom");
				},200);			
			    postData.voteId = getVal("voteId");
                newPost("/vote/general/drawLottery", { "voteId":voteId }, drawBind);
			});
		

            function drawBind(msg) {
                var jdat = JSON.parse(msg);

                if (jdat.status == "100") {
                    var awardid = jdat.data;
                    if (awardid != "0") {
                        for (var x in award) {
                            console.log(award[x].id);
                            if (awardid == award[x].id) {
                                if (award[x].level == 1) {
                                    var prize = [1, 5];
                                    prizeIndex = prize[Math.floor(Math.random() * prize.length)];
                                    viewModel.drawName('回来啦社区20元通用红包');
                                }
                                else if (award[x].level == 2) {
                                    prizeIndex = 4;
                                    viewModel.drawName('回来啦社区15元通用红包');
                                }
                                else if (award[x].level == 3) {
                                    var prize = [3, 7];
                                    prizeIndex = prize[Math.floor(Math.random() * prize.length)];
                                    viewModel.drawName('回来啦社区10元通用红包');
                                }
                                else if (award[x].level == 4) {
                                    prizeIndex = 2;
                                    viewModel.drawName('回来啦社区5元通用红包');
                                }
                                else if (award[x].level == 5) {
                                    prizeIndex = 6;
                                    viewModel.drawName('回来啦社区3元通用红包');
                                }
                                else if (award[x].level == 6) {
                                    prizeIndex = 0;
                                    viewModel.drawName('回来啦社区2元通用红包');
                                }
                            }
                        }
                    }
                    else {
                        prizeIndex = 7;
                    }
                    if (click) {
                        return false;
                    }
                    else {
                        luck.speed = 100;
                        roll();
                        click = true;
                        return false;
                    }
                }
                else if (jdat.status == "106") {
                    alert(jdat.msg);
                     //跳转到首页
                    window.location.href = './index.html#/satisfaction/home' +
                                      '?token=' + token +
                                      '&companyCode=' + companyCode +
                                      '&defCommunityId=' + defCommunityId +
                                      '&defRoomId=' + defRoomId +
                                      '&voteId=' + voteId;
                }
            }
        
            $('.sureBtn').bind('click', function (e) {
                $('#layer').hide();
                $(this).parent().parent().hide();
                window.location.href = './index.html#/satisfaction/drawResult' +
                    '?token=' + token +
                    '&companyCode=' + companyCode +
                    '&defCommunityId=' + defCommunityId +
                    '&defRoomId=' + defRoomId +
                    '&voteId=' + voteId;
            });
        

    }

    function homeFun(jdat) {
        var alerttxt = '';
        if (jdat.status == "106") {
            $('#voteAlert').show();
            alerttxt = jdat.msg;
        } else if (jdat.status == "100") {
            var jdatData = jdat.data;
            if (jdatData.isEnd == 1 || jdatData.isVote == 2) {
                $('#voteAlert').show();
                if (jdatData.isEnd == 1) {
                    alerttxt = "本次调查已结束，请下次及时参与。";
                }
                if (jdatData.isVote == 2) {
                    alerttxt = "您登录的房号下已有业主参与调查，请勿重复参与。";
                }
            }
            if (jdatData.status == 0 || jdatData.status == 1 || jdatData.status == 5) {

            }
            else if (jdatData.isVote == 1 && jdatData.isLottery == 0) { //已投票 未抽奖
                $('#lottery').show();
                // $('#lottery button').click(function () {
                //     window.location.href = './index.html#/satisfaction/lottery' +
                //                      '?token=' + token +
                //                      '&companyCode=' + companyCode +
                //                      '&defCommunityId=' + defCommunityId +
                //                      '&voteId=' + voteId;
                // });
            }
            else if (jdatData.isVote == 1 && jdatData.isLottery == 1) { //已投票 已抽奖 查看结果
                $('#lotteryResult').show();
                // $('#lotteryResult button').on(_CLICK_MODEL, function () {
                //     window.location.href = './index.html#/satisfaction/drawResult' +
                //                       '?token=' + token +
                //                        '&companyCode=' + companyCode +
                //                        '&defCommunityId=' + defCommunityId +
                //                        '&voteId=' + voteId;
                // });
            }
            else if (jdatData.isVote == -1) {
                $('#lotteryCancel').show();
            }
        }    
       var viewModel = {
                alerttxt: alerttxt
        }
        var div = document.getElementById("contain");
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
        $("#btnSub").on(_CLICK_MODEL, function () {
            if (jdatData.isVote == 0) {
                window.location.href = './index.html#/satisfaction/houseType' +
                                '?token=' + token +
                                '&companyCode=' + companyCode +
                                '&defCommunityId=' + defCommunityId +
                                '&defRoomId=' + defRoomId;
            }
        });
    }

    //授权跳转
    function oauthFun() {
        var code = decodeURI(getVal("code"));  
        var appid = "1051e4b6-4701-11e5-9575-008cfae40d20";
        var redirect_url = window.location.href.split('#')[0] + "%23/satisfaction/home?companyCode=lc%26voteId=" + voteId;//_HOME +
       // var redirect_url ="http://192.168.10.37:6080/h5/lc/community/index.html"+ "%23/satisfaction/home?companyCode=lc%26voteId=" + voteId;//_HOME +
        window.location.href = decodeURI(thirdBaseUrl + "OauthAction!autoOauth.action?code=" + code + "&appid=" + appid + "&redirect_url=" + redirect_url);
    }
    //数组分割
    function splitArray(array, size) {
        var result = []
        for (var x = 0; x < Math.ceil(array.length / size); x++) {
            var childlist = []
            var start = x * size
            var end = start + size
            childlist = array.slice(start, end)
            result.push(childlist)
        }
        return result
    }

       
    exports.init = function (template, jdatData, category) {   
        template = template + '?random=' + new Date().getTime(); 
        $.get(template, function (result) {
            $("body").html(result);
            if (category == "oauth") {
                oauthFun();
            }
            else if(category == "home"){
                homeFun(jdatData);
            }
            else if (category == "userInfo") {
                post("scVoteAction!getUserInfo.action", postData, userInfoBind);
            }
            else if (category == "vote") {
                postData.voteId = getVal("voteId");
                newPost("/vote/general/participationInfo", { "voteId": voteId }, voteCheck, undefined, "get");
             
            }
            else if (category == "lottery") {
                //var navImgUrls = ['.././img/satis/drawbtn.png', '.././img/satis/alertb.png', '.././img/satis/drawbg.png', '.././img/satis/alertb.png', '.././img/satis/drawro.png'];
                //preloadimages(navImgUrls);
                var html = document.documentElement;
                window.rem = html.getBoundingClientRect().width / 10;
                console.log(window.rem);
                html.style.fontSize = window.rem + 'px';
                $('#contain').css('fontSize', window.rem + 'px');
                newPost("/vote/general/latestWinning",  { "voteId": voteId }, drawFun, undefined, 'GET');     
               
            }
            else if (category == "drawResult") {
                newPost("/vote/general/awardInfo",  { "voteId": voteId}, drawResultBind, undefined, 'GET');     
            }
        });
    }

  

});


function locationBind(msg) {
    var jdat = JSON.parse(msg);

    if (jdat.status == "100") {
        window.location.href = './index.html#/satisfaction/vote'+
                                '?token=' + token +
                                '&companyCode=' + companyCode +
                                '&defCommunityId=' + defCommunityId +
                                '&defRoomId=' + defRoomId +
                                '&voteId=' + voteId;
    }
    else {
        alert("修改失败");
    }
}


function preloadimages(arr) {
    var newimages = [], loadedimages = 0
    var arr = (typeof arr != "object") ? [arr] : arr
    function imageloadpost() {
        loadedimages++
        if (loadedimages == arr.length) {
            console.log("图片已经加载完成")
        }
    }
    for (var i = 0; i < arr.length; i++) {
        newimages[i] = new Image()
        newimages[i].src = arr[i]
        newimages[i].onload = function () {
            imageloadpost()
        }
        newimages[i].onerror = function () {
            imageloadpost()
        }
    }
}
