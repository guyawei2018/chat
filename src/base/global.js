export default {
  ws: {},
  setWs: function (newWs) {
    this.ws = newWs
  },
  saveUserChatHistory: function (myId, friendId, msg, flag, me) {
    var chatKey = 'chat-' + myId + '-' + friendId
    // 从本地缓存获取聊天记录是否存在
    var chatHistoryListStr = plus.storage.getItem(chatKey)
    var chatHistoryList
    if (chatHistoryListStr !== null && chatHistoryListStr !== '') {
    // 如果不为空
      chatHistoryList = JSON.parse(chatHistoryListStr)
    } else {
    // 如果为空，赋一个空的list
      chatHistoryList = []
    }
    // 构建聊天记录对象
    var singleMsg = me.msgHis(myId, friendId, msg, flag)
    console.log('msg=' + msg)
    // 向list中追加msg对象
    chatHistoryList.push(singleMsg)
    plus.storage.setItem(chatKey, JSON.stringify(chatHistoryList))
  },
  getUserChatHistory: function (myId, friendId) {
    var chatKey = 'chat-' + myId + '-' + friendId
    var chatHistoryListStr = plus.storage.getItem(chatKey)
    var chatHistoryList
    if (chatHistoryListStr !== null && chatHistoryListStr !== '') {
    // 如果不为空
      chatHistoryList = JSON.parse(chatHistoryListStr)
    } else {
    // 如果为空，赋一个空的list
      chatHistoryList = []
    }
    return chatHistoryList
  },
  saveUserChatSnapshot: function (myId, friendId, msg, isRead, me) {
    var chatKey = 'chat-snapshot' + myId
    // 从本地缓存获取聊天快照的list
    var chatSnapshotListStr = plus.storage.getItem(chatKey)
    var chatSnapshotList
    if (chatSnapshotListStr !== null && chatSnapshotListStr !== '') {
      // 如果不为空
      chatSnapshotList = JSON.parse(chatSnapshotListStr)
      // 循环快照list，并且判断每个元素是否包含（匹配）friendId，如果匹配，则删除
      for (var i = 0; i < chatSnapshotList.length; i++) {
        if (chatSnapshotList[i].friendId === friendId) {
          // 删除已经存在的friendId所对应的快照对象
          chatSnapshotList.splice(i, 1)
          break
        }
      }
    } else {
      // 如果为空，赋一个空的list
      chatSnapshotList = []
    }
    // 构建聊天快照对象
    var singleMsg = me.chatSnapshot(myId, friendId, msg, isRead)
    // 向list中追加快照对象
    chatSnapshotList.unshift(singleMsg)
    plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList))
  },
  getUserChatSnapshot: function (myId) {
    var chatKey = 'chat-snapshot' + myId
    // 从本地缓存获取聊天快照的list
    var chatSnapshotListStr = plus.storage.getItem(chatKey)
    var chatSnapshotList
    if (chatSnapshotListStr !== null && chatSnapshotListStr !== '') {
      // 如果不为空
      chatSnapshotList = JSON.parse(chatSnapshotListStr)
    } else {
      // 如果为空，赋一个空的list
      chatSnapshotList = []
    }
    return chatSnapshotList
  },
  deleteUserChatSnapshot: function (myId, friendId) {
    var chatKey = 'chat-snapshot' + myId
    // 从本地缓存获取聊天快照的list
    var chatSnapshotListStr = plus.storage.getItem(chatKey)
    var chatSnapshotList
    if (chatSnapshotListStr !== null && chatSnapshotListStr !== '') {
      // 如果不为空
      chatSnapshotList = JSON.parse(chatSnapshotListStr)
      // 循环快照list，并且判断每个元素是否包含（匹配）friendId，如果匹配，则删除
      for (var i = 0; i < chatSnapshotList.length; i++) {
        if (chatSnapshotList[i].friendId === friendId) {
          // 删除已经存在的friendId所对应的快照对象
          chatSnapshotList.splice(i, 1)
          break
        }
      }
    } else {
      // 如果为空，不做处理
      return
    }
    plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList))
  },
  readUserChatSnapshot: function (myId, friendId) {
    var chatKey = 'chat-snapshot' + myId
    // 从本地缓存获取聊天快照的list
    var chatSnapshotListStr = plus.storage.getItem(chatKey)
    var chatSnapshotList
    if (chatSnapshotListStr !== null && chatSnapshotListStr !== '') {
      // 如果不为空
      chatSnapshotList = JSON.parse(chatSnapshotListStr)
      // 循环这个list，判断是否存在好友，比对friendId，
      // 如果有，在list中的原有位置删除该 快照 对象，然后重新放入一个标记已读的快照对象
      for (var i = 0; i < chatSnapshotList.length; i++) {
        var item = chatSnapshotList[i]
        if (item.friendId === friendId) {
          // 标记为已读
          item.isRead = true
          // 替换原有的快照
          chatSnapshotList.splice(i, 1, item)
          break
        }
      }
      // 替换原有的快照列表
      plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList))
    } else {
      // 如果为空
    }
  }
}
