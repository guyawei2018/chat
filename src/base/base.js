import Vue from 'vue'

Vue.prototype.$CONNECT = 1
Vue.prototype.$CHAT = 2
Vue.prototype.$SIGNED = 3
Vue.prototype.$KEEPALIVE = 4
Vue.prototype.$PULL_FRIEND = 5
Vue.prototype.$ADD_FRIEND = 6

Vue.prototype.chatMsg = (senderId, receiverId, msg, msgId) => {
  return {
    senderId: senderId,
    receiverId: receiverId,
    msg: msg,
    msgId: msgId
  }
}

Vue.prototype.dataContent = (action, chatmsg, extand) => {
  return {
    action: action,
    chatmsg: chatmsg,
    extand: extand
  }
}

Vue.prototype.msgHis = (myId, friendId, msg, flag) => {
  return {
    myId: myId,
    friendId: friendId,
    msg: msg,
    flag: flag
  }
}

Vue.prototype.chatSnapshot = (myId, friendId, msg, isRead) => {
  return {
    myId: myId,
    friendId: friendId,
    msg: msg,
    isRead: isRead
  }
}
