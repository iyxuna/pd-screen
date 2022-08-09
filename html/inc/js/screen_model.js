class Singleton {
    static get sb() {return 'singleton';}

    static get ins() {
        return this[Singleton.sb] = this[Singleton.sb] || new this;
    }

    constructor() {
        let Class = Object.create(Singleton);
        return Class[Singleton.sb] = Class[Singleton.sb] || this;
    }

    create() {
        console.log('singleton create')
    }
}

class DataDefine extends Singleton {
    constructor() {
        super();
        this.all = [];
        this._map = new Map();
    }

    add(list) {
        this._map.set(list._cls, list);
        this.all.push(list)
    }

    find(_cls) {
        return this._map.get(_cls);
    }
}

class List {
    constructor(_cls) {
        this._cls = _cls;
        this._all = []
        this._hashMap = {}
    }

    reset(objs) {
        for (let s in objs) {
            this.add(objs[s])
        }
    }

    add(obj) {
        let m = new this._cls(obj);
        let _id = this._all.length;
        this._hashMap[_id] = m
        this._all.push(this._hashMap[_id])
        return this
    }

    find(_id) {
        return this._hashMap[_id]
    }

    remove(_cls) {
        this._hashMap[_cls] = {};
        this._all = [];
    }

    eq( idx ){
        return this._all[idx];
    }


    get all() {
        return this._all
    }

    get length() {
        return this._all.length
    }

}

class RankDefine extends List{
    static create(_cls, _type){
        return new RankDefine(_cls, _type);
    }
    constructor(_cls) {
        super(_cls);
    }

    add(obj) {
        let m = this._cls.create(obj);
        let _id = this._all.length;
        this._hashMap[_id] = m
        this._all.push(this._hashMap[_id])
        return this
    }

    findRankRange( mapId, startIdx, endIdx ){
        let currentRanks = this._hashMap[_id];
        return currentRanks.slice(startIdx, endIdx );
    }


}

class AdsDefine extends List{
    static create(_cls){
        return new AdsDefine(_cls);
    }

    constructor(_cls) {
        super(_cls);
    }

}

class RankList{
    static injectHtml( _rankList, index ){
        let bg = _rankList.screenBgImage ? _rankList.screenBgImage : "";
        let hasBg = _rankList.screenBgImage ? true : false;

        let backgroundBg = `style="background : url( ${_rankList.screenBgImage} ) no-repeat;"`

        return `
        <div class="swiper-slide scene scene_${index} rank ${_rankList.gameGCode}" ${ hasBg ?  backgroundBg : ""} >
            <div class="tournment">
                <div id="header">
                    <h2 class="title">
                        ${_rankList.season ? `<span class="store">[${_rankList.season}]</span>` : "" }
                        <span class="contest">${_rankList.tournamentTitle} </span>
                    </h2>
                    
                    <div class="contest_duration">
                        <p>${_rankList.gameName }</p>
                        <span class="gap">|</span>
                        <p class="schedule">대회 기간 : <span>${moment( _rankList.createdAt).format('MM.DD')}</span><span> ~ </span>
                        <span>${moment(_rankList.completedAt).format('MM.DD')}</span></p>
                        <div class="rank_sort">
                            <div class="ctrl" data-parent="${index}">
                                <a href="#none" class="on">
                                    <span>1-10위</span>
                                </a>   
                                <a href="#none" class="">
                                    <span>11-20위</span>
                                </a>           
                            </div>
                            <p class="total_score"><a href="https://battlepod.playdonut.com/battlepod/tournament/${_rankList.id}}/standing" class="tournament_total">전체 순위 보기</a></p>
                        </div>
                    </div>
                    <div class="join_btn">
                        <a href="https://battlepod.playdonut.com/battlepod/tournament/${_rankList.id}/info#utm_source=dapp&utm_medium=click&utm_campaign=tournament_join" class="tournament_join">
                            <img src="../img/screen/header_logo.png" alt="">
                            <span>즉시 참가</span>
                        </a>
                    </div>
                </div>
                </div>
                <div id="contents">
                    <div class="rank_header">
                        <div class="items">
                            <span class="item1">순위</span>
                            <span class="item2">닉네임</span>
                            <span class="item3">캐릭터명</span>
                            <span class="item4">점수</span>
                        </div>
                        <div class="items">
                            <span class="item1">순위</span>
                            <span class="item2">닉네임</span>
                            <span class="item3">캐릭터명</span>
                            <span class="item4">점수</span>
                        </div>
                    </div>
                    <div class="rank_panel" data-parent="${index}">
                        <div class="inner">
                            <div class="rank_wrap">
                                <ul class="rank_box">
                                ${_rankList.injectRangeHtml(0,5)}
                                </ul>
                                <ul class="rank_box">
                                ${_rankList.injectRangeHtml(5,10)}
                                </ul>
                            </div>
                            ${_rankList._ranks.length > 10 ?
                            `<div class="rank_wrap">
                                            <ul class="rank_box">
                                            ${_rankList.injectRangeHtml(10,15)}
                                            </ul>
                                            <ul class="rank_box">
                                            ${_rankList.injectRangeHtml(15,20)}
                                            </ul>
                                </div>` : ''}
                        </div>
                    </div>
                    
                    <p class="update_time">
                        <span class="star">&#42;</span><span>30분 단위로 갱신됩니다</span>
                    </p>
                </div>
            </div>
        </div>
        `;
    }

    static create( data ){
        let i = -1;
        let _results = [];

        while( ++i < data.tournament.length ){
            let cls = RankData.create( data.tournament[i], data.id, data.title, data.playStartAt, data.playEndAt, data.gameGCode, data.screenBgImage, data.gameName, data.season );
            _results.push( cls );
        }
        
        const fill = function(){
            let _count = 10 - data.tournament.length
            let _length = data.tournament.length+1;
            if( _count > 0 ){
                let i = -1;
                while( ++i < _count ){
                    const fillData = {arrivalOrder: 16, completedAt: 1630408648000, createdAt: 1630405570000, leaderPlayerIngameNickname: "소환중..", logoUrl: "https://dhgilmy0l2xzq.cloudfront.net/6e4980cc-476c-4848-b5fa-1d955d8d78a6-20200712134623.gif", name: "소환중", placeTag: "소환사 모집중", preRank: i+_length, rank: i+_length, rankInterval: null, rankUpDownEq: "equal", teamNumber: 16, teamPrize: null, totalScore: 0}
                    let cls = RankData.create( fillData, data.id, data.title, data.playStartAt, data.playEndAt, data.gameGCode, data.screenBgImage , data.gameName, data.season);
                    _results.push( cls );
                }
            }
        }
        fill();
        return new RankList( _results )
    }

    constructor( _ranks ) {
        this._ranks = _ranks;
    }

    get tournamentTitle(){
        return this._ranks[0]._tournamentTitle;
    }

    get createdAt(){
        return this._ranks[0]._createdAt;
    }
    get completedAt(){
        return this._ranks[0]._completedAt;
    }

    get screenBgImage(){
        return this._ranks[0]._screenBgImage;
    }

    get gameGCode(){
        return this._ranks[0]._gameGCode;
    }

    get id(){
        return this._ranks[0]._id;
    }

    get gameName(){
        return this._ranks[0]._gameName;
    }

    get season(){
        return this._ranks[0]._season;
    }

    injectRangeHtml(start, end ){
        let html ="";
        var i = -1;
        var arr = this._ranks.slice( start, end );

        while( ++i < arr.length )
        {
            let _rank = arr[i];
            html += `
            <li>
                <span class="rank">
                    ${_rank._rank}
                     <span class="fluctuation ${_rank._rankUpDownEq}">${ _rank._rankInterval ? _rank._rankInterval : "-"}</span> 
                </span>
                <div class="name" data-current-name="${_rank._name}" data-prev-name="-------------">

                </div>
                <div class="placeTag">
                    <span>#${_rank._placeTag}</span>
                </div>
                <div class="nickname">
                    <span class="icon"><img src="/img/screen/icon_${_rank._gameGCode}.png" alt=""></span>
                    <p>${_rank._leaderPlayerIngameNickname}</p>
                </div>
                <div class="number" data-number="${_rank._totalScore}"></div>
            </li>
            `
        }
        return html;
    }
}


class RankData{
    static create( obj, id, title, playStartAt, playEndAt, gameGCode, screenBgImage, gameName, season){
        return new RankData(obj, id, title, playStartAt, playEndAt, gameGCode, screenBgImage, gameName, season );
    }
    constructor( dataObj, tournamentID, tournamentTitle, startAt, completedAt, gameGCode, screenBgImage, gameName, season ) {
        this._id = tournamentID;
        this._tournamentId = tournamentID;
        this._tournamentTitle = tournamentTitle
        this._name = dataObj.name ? dataObj.name : "";
        this._rank = dataObj.rank ? dataObj.rank : "";
        this._preRank = dataObj.preRank ? dataObj.preRank : "";
        this._rankInterval = dataObj.rankInterval ? dataObj.rankInterval : "";
        this._rankUpDownEq = dataObj.rankUpDownEq ? dataObj.rankUpDownEq : "";
        this._totalScore = dataObj.totalScore ? String(dataObj.totalScore).comma() : "";
        this._leaderPlayerIngameNickname = dataObj.leaderPlayerIngameNickname ? dataObj.leaderPlayerIngameNickname : "";
        this._createdAt = startAt;
        this._completedAt = completedAt;
        this._gameGCode = gameGCode;
        this._placeTag = dataObj.placeTag;
        this._screenBgImage = screenBgImage;
        this._gameName = gameName;
        this._season = season;
    }
}


class AdsData{
    static get IMG(){return "IMG";}
    static get VIDEO(){return "VIDEO"}
    static injectImgHtml( _adsData, index ){
        return`
        <div class="swiper-slide scene scene_${index} img">
            <div class="ads_img">
                <a href="${_adsData._link ? _adsData._link : 'https://battlepod.playdonut.com/' }#utm_medium=click&utm_campaign=ads${_adsData._id}" class="ads_link"><img src="${_adsData._imageUrl}" alt=""></a>
            </div>
        </div>
        `
    }
    static injectVideoHtml( _adsData, index ){
        return`
        <div class="swiper-slide scene scene_${index} video">
            <div class="ads_player">
                <iframe width="100%" height="100%" src="${_adsData._html}?autoplay=0&mute=0&enablejsap=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
        `
    }

    constructor( dataObj ) {
        this._gubun = dataObj.gubun
        this._html = dataObj.html
        this._id = dataObj.id
        this._imageUrl = dataObj.imageUrl
        this._link = dataObj.link
        this._ord = dataObj.ord
        this.slideTime = dataObj.slideTime
    }
}

class GlobalConfig{
    static PC_ROOM_NAME;
    static TOURNAMENTS;
    static TAG_NAME;
    static NAME;
    constructor(){

    }
}

DataDefine.ins.add( RankDefine.create( RankList ) );
DataDefine.ins.add( AdsDefine.create( AdsData ) );

String.prototype.comma = function(){
    let num = parseInt( this );
    const result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return result;
}


