
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#F8F8F8","navigationBar":{"backgroundColor":"#F8F8F8","titleText":"uni-app","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"Snowy-App","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"3.4.15","entryPagePath":"pages/login","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"tabBar":{"position":"bottom","color":"#000000","selectedColor":"#000000","borderStyle":"white","blurEffect":"none","fontSize":"10px","iconWidth":"24px","spacing":"3px","height":"50px","backgroundColor":"#ffffff","list":[{"pagePath":"pages/home/index","iconPath":"/static/images/tabbar/home.png","selectedIconPath":"/static/images/tabbar/home_.png","text":"首页"},{"pagePath":"pages/work/index","iconPath":"/static/images/tabbar/work.png","selectedIconPath":"/static/images/tabbar/work_.png","text":"工作台"},{"pagePath":"pages/mine/index","iconPath":"/static/images/tabbar/mine.png","selectedIconPath":"/static/images/tabbar/mine_.png","text":"我的"}],"selectedIndex":0,"shown":true},"locales":{}};
  const __uniRoutes = [{"path":"pages/login","meta":{"isQuit":true,"isEntry":true,"enablePullDownRefresh":false,"navigationBar":{"titleText":"登录"},"isNVue":false}},{"path":"pages/home/index","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":0,"navigationBar":{"titleText":"首页","style":"custom"},"isNVue":false}},{"path":"pages/work/index","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":1,"navigationBar":{"titleText":"工作台"},"isNVue":false}},{"path":"pages/biz/org/index","meta":{"navigationBar":{"titleText":"机构管理"},"isNVue":false}},{"path":"pages/biz/org/form","meta":{"onReachBottomDistance":50,"navigationBar":{"titleText":"机构管理"},"isNVue":false}},{"path":"pages/biz/position/index","meta":{"navigationBar":{"titleText":"职位管理"},"isNVue":false}},{"path":"pages/biz/position/form","meta":{"navigationBar":{"titleText":"职位管理"},"isNVue":false}},{"path":"pages/biz/user/index","meta":{"enablePullDownRefresh":true,"onReachBottomDistance":50,"navigationBar":{"titleText":"用户管理"},"isNVue":false}},{"path":"pages/biz/user/form","meta":{"onReachBottomDistance":50,"navigationBar":{"titleText":"用户管理"},"isNVue":false}},{"path":"pages/mine/index","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":2,"navigationBar":{"titleText":"我的"},"isNVue":false}},{"path":"pages/mine/info/index","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"个人信息"},"isNVue":false}},{"path":"pages/mine/info/edit","meta":{"navigationBar":{"titleText":"编辑资料"},"isNVue":false}},{"path":"pages/mine/pwd/index","meta":{"navigationBar":{"titleText":"修改密码"},"isNVue":false}},{"path":"pages/mine/setting/index","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"应用设置"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  