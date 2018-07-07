import React from 'react'
import MusicListItem from '../components/musiclistitem'

let MusicList = React.createClass({
     render(){
         let listEle = null;
         let curItem = this.props.currentMusicItem;
         console.log(curItem);
         //使用无副作用的函数map
         listEle = this.props.musicList.map(function (item) {
                  return  (
                      <MusicListItem
                          focus={item === curItem}
                          key={item.id}
                          musicItem = {item}
                      >
                      </MusicListItem>
                  );
         });
         return (
             <ul>
                 {listEle}
             </ul>
         )
     }
});
 export  default MusicList;
