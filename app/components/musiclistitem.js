import  React from  'react'
import  './musiclistitem.less'
//事件订阅pubsup
import  Pubsub from  'pubsub-js';
let MusicListItem = React.createClass({
    playMusic(musicItem){
        Pubsub.publish('PLAY_MUSIC',musicItem);
    },
    deleteMusicItem(musicItem,e){
        //禁止事件冒泡
        e.stopPropagation();
        Pubsub.publish("DELETE_MUSICITEM",musicItem)
    },
      render(){
          let musicItem = this.props.musicItem;
          return(
              <li onClick={this.playMusic.bind(this,musicItem)} className={`components-listitem row ${this.
                  props.focus?' focus':''}`}>
                  <p><b>{musicItem.title}-{musicItem.artist}</b></p>
                  <p onClick={this.deleteMusicItem.bind(this,musicItem)} className="-col-auto delete"></p>
              </li>
          );
      }
});
export  default  MusicListItem;