var methodQueue  = function()
{
    if( !this instanceof methodQueue )   return new methodQueue();
    var _this = this,
        _methodList = [],
        instance;
    _methodQueueItem = function( mq , method, isAsync, args )
    {
        var _mq = mq, _method = method, _isAsync = isAsync, _args = args;
        return{
            execute : function(){
                _method.apply( null,  _args );
                !_isAsync && _mq.next() ;
            },
            method : function(){
                return _method;
            },
            args : function(){
                return _args;
            }
        }
    };
    return{
        add : function( method, isAsync, args ){
            _methodList.push( new _methodQueueItem( _this, method, isAsync, args ) ) ;
        },
        next : function(){
            _methodList.length > 0 && _methodList.shift().execute();
        },
        addToIndex : function(){

        },
        length : function(){
            return _methodList.length;
        }
    }
}

let colorLog = new function(message, color) {
    return{
        warning : function(message){
            console.log(`%c ${message}`, "color: yellow; font-weight: bold; font-size : 14px;");
           return this;
        },
        success : function(message){
            console.log("%c" + message, "color: #24e394; font-weight: bold; font-size : 14px;");
            return this;
        },
        info : function(message){
            console.log("%c" + message, "color: DodgerBlue; font-weight: bold; font-size : 14px;");
        },
    }
}



const resizeWindow = function(){
    $(window).on("resize", function(){
        var scale = $(window).outerWidth()/1920;

        gsap.set( $("#screen"), { scale : scale ,  transformOrigin : "0% 0%"});
    })
    $(window).trigger("resize");
}
$("#screen.resizable").length > 0 && resizeWindow();


function getUrlParams(){
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(str, key, value) {
            params[key] = value;
        }
    );
    return params;
}
var screenType = getUrlParams();

if( screenType.type && screenType.type === "launcher"){
    $("#screen_header").addClass("on");
}

if( screenType.fixed && screenType.fixed === "1" ){
    $("#screen").addClass("fixed")
}


var rankScene = function( sceneID ){
    var $scene = $(".scene_"+sceneID);
    function Counter($digitElem, $nameElem, _index){
        var numFunc = function(){
            var number = $digitElem.attr("data-number");
            $digitElem.attr('data-number',number);
            $digitElem.empty();
            var numChars = number.split("");
            var numArray = [];
            var setOfNumbers = [0,1,2,3,4,5,6,7,8,9];
            for(var i=0; i<numChars.length; i++) {
                if ($.inArray(parseInt(numChars[i], 10),setOfNumbers) != -1) {
                    $digitElem.append(`<span class="digit_box"><span class="digit${numArray.length}">${numChars[i]}<br>0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br></span></span>`);
                    numArray[numArray.length] = parseInt(numChars[i], 10);
                }
                else {
                    $digitElem.append('<span>'+numChars[i]+'</span>');
                }
            }

            var increment = $digitElem.find('.digit_box').outerHeight();
            var speed = 1.5;

            for(var i=0; i<numArray.length; i++) {
                gsap.to( $digitElem.find('.digit'+i), 0.5+(0.15*i), { delay :  1+0.1*_index, top :  -(increment * (numArray[i]+1) ) , ease : Back.easeInOut})
            }
        }

        var nameFunc = function(){
            var currentName = $nameElem.attr("data-current-name");
            var prevName = $nameElem.attr("data-prev-name");
            $nameElem.empty();
            $nameElem.append(`<div class="text_box"><p>${prevName}</p><p>${currentName}</p></div>`);
            gsap.set( $nameElem.siblings(".placeTag, .nickname"), { x : 10, opacity : 0})
            gsap.to( $nameElem.siblings(".placeTag, .nickname"), 0.5, { delay : 1.2+0.1*_index, x : 0, opacity : 1, ease : Circ.easeOut })
            gsap.to( $nameElem.find(".text_box"), 0.5, { delay : 1+0.1*_index, y : -($nameElem.find(".text_box p").height()), ease : Back.easeInOut });
        }

        numFunc();
        nameFunc();
    }
    const getClock = function(){
        const _today = moment();
        const _clock = _today.format('YYYY.MM.DD HH:mm');
        const today = moment();
        const diffDay = moment( new Date( $scene.find(".clock").attr("data-end") ).getTime() );
        const calc = diffDay.diff(today);
        if( moment.duration(calc).days() >= 0 &&  moment.duration(calc).hours() >= 0  && moment.duration(calc).minutes() >= 0 ){
            const addZero = d=> d < 10 ? "0"+d : d;
            const diffDate = `D${addZero(moment.duration(calc).days() )} ${ addZero(moment.duration(calc).hours()) }:${addZero(moment.duration(calc).minutes())}`;
            $scene.find(".clock").html( "남은 시간 : "+ diffDate );
        }
        else{
            $scene.find(".clock").html( "남은 시간 : 토너먼트 종료");
        }
    }
    // setInterval(function(){
    //     getClock();
    // }, 1000);

    const start = function(){
        $scene.find('.rank_box>li').each(function(idx){
            const $digit = $(this).find(".number");
            const $name = $(this).find(".name");
            Counter($digit, $name, idx );
            gsap.set( $(this), { y : 30, opacity : 0 });
            gsap.to( $(this), 0.5,{delay : 0.05*(10-idx)+0.5, opacity : 1, y : 0, ease : Back.easeOut });

        });

    }

    const end = function(){
        var length = $scene.find('.rank_box>li').length;
        $scene.find('.rank_box>li').each(function(idx){
            gsap.to( $(this), 0.5,{delay : 0.05*idx, opacity : 0, y : 30, ease : Back.easeInOut, onCompleteParams : [ idx+1], onCompleted : function( _idx ){
                    // ( idx === length-1) && gsap.delayedCall(  0.5, start );
                }
            }, );
        });
    }
    start();
}


var sceneByRank = function( mq, _rankList, _index ){
    $("#wrap").append( RankList.injectHtml(_rankList, _index ) );
    rankScene(_index);
    mq.next();
}

var sceneByImage = function( mq, _adsData, _index){
    $("#wrap").append( AdsData.injectImgHtml( _adsData, _index ) );
    mq.next();
}

var sceneByVideo = function( mq, _adsData, _index){
    $("#wrap").append( AdsData.injectVideoHtml( _adsData, _index ) );
    mq.next();
}

var initLoading = function(mq){
    $(".loading").show();
    colorLog.info( "initLoading");
    mq.next();
}


var initData = function( mq ){
    var proxy = false ? "http://127.0.0.1:8080" : "https://battlepod.playdonut.com";
    var _privateMq = new methodQueue();
    var results = [];
    colorLog.info("initData : "+proxy )

    let gotoErrorPage = function(){
        setTimeout(function(){
            location.href = "http://3.35.248.201/inspect";
        }, 5000000)
    }
    try{
        _privateMq.add( function(){
            $.get(proxy+"/api/v1/pcroom/info").then(function (result) {
                colorLog.success("get : /api/v1/pcroom/info complete.")
                GlobalConfig.PC_ROOM_NAME = result.data.tagName;
                GlobalConfig.NOT_TN = result.data.screenTournamentIds === null ? false : true;
                console.log( "GlobalConfig.PC_ROOM_NAME : ", GlobalConfig.PC_ROOM_NAME )
                if( GlobalConfig.NOT_TN ){
                    GlobalConfig.TOURNAMENTS = result.data.screenTournamentIds;
                    GlobalConfig.TAG_NAME = result.data.tagName;
                    GlobalConfig.NAME = result.data.name;
                    _privateMq.next()
                }else{
                    $.get(proxy+"/api/v1/pcroom/screenAds").then(function (result) {
                        colorLog.success(`get : /api/v1/pcroom/screenAds complete.`)
                        if( result.data.length > 0  ){
                            DataDefine.ins.find(AdsData).reset(result.data);
                            $(".loading").hide();
                            mq.next();
                        }else{
                            gotoErrorPage();
                        }

                    }).catch(error => {
                        console.log(error, "api/v1/pcroom/screenAds load failed");
                        gotoErrorPage();
                    });
                }
            }).catch(error => {
                console.log(error, "api/v1/pcroom/info load failed");
                gotoErrorPage();
            });
        }, true );
        _privateMq.add( function(){

            $.get(proxy+"/api/v1/tournament?ids="+GlobalConfig.TOURNAMENTS).then(function (result) {
                colorLog.success(`get : /api/v1/tournament?ids=${GlobalConfig.TOURNAMENTS} complete.`)
                results = result.data;
                _privateMq.next()
            }).catch(error => {
                console.log(error, "api/v1/tournament?ids load failed");
                gotoErrorPage();
            });

        }, true );
        _privateMq.add( function(){
            $.get(proxy+"/api/v1/tournament/team/standing?rankRange=1,20&ids="+GlobalConfig.TOURNAMENTS).then(function (result) {
                colorLog.success(`get : api/v1/tournament/team/standing?rankRange=1,20&ids=${GlobalConfig.TOURNAMENTS}`)
                results.forEach( function(value, idx){
                    value["tournament"] = result.data[idx];
                });
                DataDefine.ins.find( RankList ).reset( results );
                _privateMq.next()
            }).catch(error => {
                console.log(error, "api/v1/tournament/team/standing?rankRange=1,10 load failed");
                gotoErrorPage();
            });
        }, true );

        _privateMq.add( function(){
            $.get(proxy+"/api/v1/pcroom/screenAds").then(function (result) {
                colorLog.success(`get : /api/v1/pcroom/screenAds complete.`)
                DataDefine.ins.find(AdsData).reset(result.data);
                $(".loading").hide();
                mq.next();
            }).catch(error => {
                console.log(error, "api/v1/pcroom/screenAds load failed");
                gotoErrorPage();
            });
        }, true );
        _privateMq.next();
    }catch (e){
        console.log( "e : ", e )
    }
}

var initApp = function( mq ){
    let i = -1;
    let _sceneIndex = -1;
    let _rankList = DataDefine.ins.find(RankList)._all;
    let _adsList = DataDefine.ins.find(AdsData)._all;


    let result = ()=>{
        let _rank = _rankList.shift();
        let _ads  = _adsList.shift();
        if( _rank )
        {
            mq.add( sceneByRank, true , [ mq, _rank, ++_sceneIndex ]);
        }
        if( _ads )
        {
            if( _ads._gubun === AdsData.IMG ){
                mq.add( sceneByImage, true, [ mq, _ads, ++_sceneIndex ] )
            }
            else if( _ads._gubun === AdsData.VIDEO){
                mq.add( sceneByVideo, true, [ mq, _ads, ++_sceneIndex ] )
            }
        }

        if( _rankList.length > 0 || _adsList.length > 0 ){
            result();
        }
    }
    result();
    // mq.add( initPagination, true, [mq]);
    mq.add( handleCompleted , true, [mq]);
    mq.next()
}


var mainQueue = function(){
    var mq = new methodQueue();
    mq.add( initLoading, true, [ mq ]);
    mq.add( initData, true , [mq] );
    mq.add( getUnderconstruction, true , [mq]) ;
    mq.add( initApp, true, [mq] );
    mq.next();
}

var handleCompleted = function(mq){
    const swiper = new Swiper('.swiper', {
        pagination: {
            el: '.pagination',
            type: 'bullets',
            clickable: true
        },
        on: {
            init: function (_swiper) {
                let currentIdx = _swiper.activeIndex;

                if( $(".swiper-slide-active").hasClass("rank") ){
                    setTimeout(function(){
                        $(".swiper-slide-active").find(".ctrl a").eq(1).trigger("click");

                        setTimeout(function(){
                            if( currentIdx === _swiper.slides.length-1 ){
                                _swiper.slideTo(0);
                            }else{
                                _swiper.slideNext();
                            }
                        }, 3000);

                    }, 3000);
                }else{
                    setTimeout(function(){
                       _swiper.slideNext();
                    }, 3000);
                }
                // 페이지 이동이 끝나면 다시 순위를 1-10위로 바꿔야 함 리셋? 잘 모르겠음
            },
            slideChangeTransitionEnd : function(_swiper){
                let currentIdx = _swiper.activeIndex;

                if( $(".swiper-slide-active").hasClass("rank") ){
                    setTimeout(function(){
                        $(".swiper-slide-active").find(".ctrl a").eq(1).trigger("click");

                        setTimeout(function(){
                            if( currentIdx === _swiper.slides.length-1 ){
                                _swiper.slideTo(0);
                            }else{
                                _swiper.slideNext();
                            }
                        }, 3000);

                    }, 3000);
                }else{
                    setTimeout(function(){
                        if( currentIdx === _swiper.slides.length-1 ){
                            console.log("마지막")
                            _swiper.slideTo(0);
                        }else{
                            _swiper.slideNext();
                        }
                    }, 3000);
                }
            }
        }
    });
    mq.next();
}

$("body").on("click", ".ctrl a", function(e){
    let parentIdx = $(this).parent().attr("data-parent");
    let currentIdx = $(this).index();
    $(this).addClass("on").siblings("a").removeClass("on");

    currentIdx === 0 ? $(`[data-parent="${parentIdx}"]`).removeClass("on") : $(`[data-parent="${parentIdx}"]`).addClass("on");
});

function getUnderconstruction(mq=null){
   $.get(`http://3.35.248.201/inc/ko.screen.config.json?date=${new Date().getTime()}`).then(v=>{
       colorLog.info( "idle json load success" )
       setTimeout(function(){
           if( !v.available ) location.href = "http://3.35.248.201/inspect";
       },5000)

       let stores = v.closed_stores;
       const found = stores.find( val=> val === GlobalConfig.PC_ROOM_NAME )

       if( found !== undefined ){
           $(".btn_window_closed").hide();
       }
       mq && mq.next();
	}).catch(error => {
        console.log( error, "idle json load failed" );
       mq?? mq.next();
   })
}

setTimeout(function(){
    location.reload();
}, 1000*60*15);
//

setInterval( function(){
    getUnderconstruction(null);
}, 1000*60*5);

mainQueue();
