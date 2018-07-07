import  React from  "react"
import  Header from "./components/header"
import  Progress from "./components/progress"
import  MusicList from "./page/musiclist"
import  Player from  "./page/player"
//Pubsub 在root中进行事件监听

import  Pubsub from  'pubsub-js'
import  {Router,IndexRoute,Link,Route,hashHistory} from 'react-router'

//导出的时候没有使用default，所以添加一个大括号
import { MUSIC_LIST } from './config/musiclist'
let App = React.createClass({
    getInitialState(){
        return {
            musicList:MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0]
        };

    },
    playMusic(musicitem){
         $("#player").jPlayer('setMedia',{
             mp3:musicitem.file
         }).jPlayer('play');
         this.setState({
             currentMusicItem:musicitem
         });
    },
    playNext(type="next"){
       let index = this.findMusicIndex(this.state.currentMusicItem);
        let newIndex = null;
        let musicListLength = this.state.musicList.length
       if(type = 'next'){
              newIndex = (index +1)%musicListLength;
       }else{
              newIndex = (index-1+musicListLength) % musicListLength;
       }
       this.playMusic(this.state.musicList[newIndex]);
    },
    //找到当前音乐的位置
    findMusicIndex(musicitem){
        return this.state.musicList.indexOf(musicitem);
    },
    componentDidMount(){
        $('#player').jPlayer({
            /* 把音乐播放器的逻辑移出来
            ready:function(){

               $(this).jPlayer('setMedia',{
                    mp3:'http://oj4t8z2d5.bkt.clouddn.com/%E9%AD%94%E9%AC%BC%E4%B8%AD%E7%9A%84%E5%A4%A9%E4%BD%BF.mp3'
                }).jPlayer('play');


            }, */
            supplied:'mp3',
            wmode:'window'
        }),
            this.playMusic(this.state.currentMusicItem);
            //对音乐播放进行监听，播放完了之后继续播放
            $("#player").bind($.jPlayer.event.ended,(e)=>{
               this.playNext();
            });
            Pubsub.subscribe('PLAY_MUSIC',(msg,musicitem)=>{
                  this.playMusic(musicitem);
            }),
            Pubsub.subscribe('DELETE_MUSICITEM',(msg,musicitem)=>{
                console.log("jdjdjdjdjddjdj");
                this.setState({
                    musicList:this.state.musicList.filter(item =>{
                        return item  !=  musicitem;
                    })
                });
            }),
                Pubsub.subscribe('PLAY_PRE',(msg,musicitem)=>{
                    this.playPre('prev');
                }),
                Pubsub.subscribe('PLAY_NEXT',(msg,musicitem)=>{
                    this.playNext();
                })

    },
    componentWillUnmount() {
     Pubsub.unsubscribe('DELETE_MUSICITEM');
     Pubsub.unsubscribe('PLAY_MUSIC');
     $("#player").unbind($.jPlayer.event.ended,(e)=>{
            this.playNext();
        });
        Pubsub.unsubscribe('PLAY_PRE',(msg,musicitem)=>{
            this.playPre('prev');
        }),
            Pubsub.unsubscribe('PLAY_NEXT',(msg,musicitem)=>{
                this.playNext();
            })
    },
    render(){
        return (
            <div>
                <Header/>
                { React.cloneElement(this.props.children,
                    this.state)}
            </div>

        );
    }
});
let Root = React.createClass({
    render(){

        return (<Router history={hashHistory}>
           <Route path="/" component={App}>
               <IndexRoute component={Player}></IndexRoute>
               <Route path="/list" component={MusicList}></Route>
           </Route>
        </Router>);
    }
});
export  default  Root;