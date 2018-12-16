# vue-event-channels

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run server
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
npm run lint --fix
```

## 主要模块的设计


### 使用到的第三方库

此项目基于Vue开发，使用的第三方库有Vue-router, Vuex，date-fns（用于处理时间格式和计算）, axios（用于发ajax）。


### 项目主体概览

此项目根据模块的角色功能主要包括`views`, `components`, `router`, `store`, `services`, `utils`, `config`几个部分。

- `views`是几个核心的主页面，其中有使用各种`components`；

- `router`是Vue Router的入口文件，包含了APP各页面的router设置；

- `services`文件夹里的是封装了请求各数据的服务器API，主要分为服务给event和user的service；其中部分API支持了paginated请求
的需求。

- `store`文件夹包含Vuex Store的module，主要分为event和user两个module。Store一方面提供映射了service对应接口的Actions，
Vue components可以利用其来发起改变状态和发动副作用。另一方面，store各module存储了对应模块的核心状态量，可以提供给多个
Vue components来共享。

- `utils`和`config`就是一些辅助工具方法和APP的一些设定。


### Store的设计规划

Vuex Store主要分为`event`和`user`两个module。event模块包括了和event相关的状态和行为，如eventList，eventParticipants，
eventLikes，eventComments，eventDetail等，以及对应改变该状态量的actions。
这些状态量在EventList，Search，EventDetail/Comments等页面有使用到。

user模块则是包括和用户相关的状态和行为，如login，userProfile，userEvents等。主要在登录页，用户详情页使用。


### 主要组件及其数据状态

1. Login。主要与user Store中关于登录状态的部分进行数据交互。

2. Home。主要包括默认主页，搜索过滤，以及搜索结果的显示。其中使用了包括MainHeader，EventList，Search，SearchResultInfo，InfiniteScroll等组件。
数据方面，主要与Store中event模块进行关于eventList的交互，包括支持搜索过滤的场景，此外也通过user模块拿到当前用户的avatar显示在MainHeader上。

3. UserProfile。主要使用了MainHeader，EventList，InfiniteScroll等组件。数据上和Store的user模块交互进行userDetails和userEvents状态的显示和改变。

4. EventDetails。通过子路由根据不同的子路径载入不同的Component。
例如默认页使用EventBrief， EventDetailBody；Participant页使用EventInvolvements；而Comments页用EventComments。
数据上和Store的event模块交互，显示和改变和单个event数据相关的数据。

### 无限滚动的设计实现思路

本项目中的无限滚动设计为一个独立的InfiniteScroll的component。
使用时将该组件wrap到需要实现无限滚动的目标list，并在该list上增加`slot="scrollBody"`的属性。

例如：
```
<InfiniteScroll
  :threshold="20"
  :disabled="shouldInfiniteScrollDisabled"
  :completed="!hasMore && userEvents.length > 0"
  :handler="loadMoreEvent"
>
  <EventList slot="scrollBody" v-if="userEvents.length > 0" :events="userEvents" />
  <NoEvent slot="scrollBody" v-else class="no-event-wrap" />
</InfiniteScroll>
```

其中`handler`是触发loadMore时会调用的方法。

`threshold`是会开始触发loadMore事件的，距当前list最底部的最远距离。

`disabled`是判断是否暂停触发loadmore事件的条件。

`complete`是判断当前list的无限滚动是否结束了，结束了将不再监听scroll事件。此时会在list尾部显示“Scrolled to end"。

**无限滚动的实现主要包括以下几点：**

1. 设定、找到无限滚动的目标container，当InfiniteScroll组件”mounted“时，在其身上添加监听"scroll"事件。

2. 对scroll事件的触发增加throttle，节约不必要的scroll事件触发。

3. 当scroll事件触发时，判断其是否达到触发loadMore的条件。在InfiniteScroll组件中是通过判断目标container是否满足：
scrollHeight - clientHeight - scrollTop <= threshold来决定是否触发loadMore事件。这个判断方法在主流浏览器都
可行。
（注：其他第三方库还有另外的计算方法，用于处理当目标container独立于scroll列表对象的情况，可以让其使用更灵活，本例中的
InfiniteScroll组件主要服务于当前项目，由于时间关系，暂不考虑支持各种不同的用法）

4. 当无限滚动完成时，或是component destroyed了，不再监听scroll事件。


### 其他值得注意的功能实现

1. 利用Vue router提供的code splitting特性延迟加载所需的Vue Component，从而提高性能。

2. 利用服务器未在文档记录的“join"接口，实现了用户自动注册并登录的功能（没有注册页面的设计）。注意由于服务器要求注册的email
要unique，而注册用的email在APP中hardcoded设定了，所以用户暂时只能注册一个账号。

3. 在无限滚动中的loadMore触发时，或是其他一些请求正在进行时，APP都会显示一个loading的overlay，一方面告知用户APP当前状态，
另一方面从使用安全性的角度考虑，防止用户在此时进行额外操作。

4. 使用ES语言尽可能新的特性，如async await, object destructing等等，让JavaScript代码尽可能简洁。另外使用了Vue提供的
Scss来写样式，具有更好的样式层次和嵌套性。

5. 额外的UI细节增强，如美化scrollbar的样式；Search页显示隐藏的过渡效果；Detail页图片mousewheel滚动控制。以及Event detail留言板的良好交互等。