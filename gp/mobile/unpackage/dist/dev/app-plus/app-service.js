if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key2, val] of props) {
      target[key2] = val;
    }
    return target;
  };
  const _sfc_main$6 = {
    data() {
      return {
        webviewStyles: {
          progress: {
            color: "#FF3333"
          }
        }
      };
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("web-view", {
        "webview-styles": $data.webviewStyles,
        src: "/static/html/html/home/index.html"
      }, null, 8, ["webview-styles"])
    ]);
  }
  const PagesHomeIndex = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$4], ["__file", "D:/workSpaces/snowy/gp/mobile/pages/home/index.vue"]]);
  function requireNativePlugin(name) {
    return weex.requireModule(name);
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = { ...defaultSettings };
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        }
      };
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && pluginDescriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(pluginDescriptor, hook) : null;
      const list2 = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list2.push({
        pluginDescriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * vuex v4.1.0
   * (c) 2022 Evan You
   * @license MIT
   */
  var storeKey = "store";
  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function(key2) {
      return fn(obj[key2], key2);
    });
  }
  function isObject$5(obj) {
    return obj !== null && typeof obj === "object";
  }
  function isPromise(val) {
    return val && typeof val.then === "function";
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vuex] " + msg);
    }
  }
  function partial(fn, arg) {
    return function() {
      return fn(arg);
    };
  }
  function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend ? subs.unshift(fn) : subs.push(fn);
    }
    return function() {
      var i2 = subs.indexOf(fn);
      if (i2 > -1) {
        subs.splice(i2, 1);
      }
    };
  }
  function resetStore(store2, hot) {
    store2._actions = /* @__PURE__ */ Object.create(null);
    store2._mutations = /* @__PURE__ */ Object.create(null);
    store2._wrappedGetters = /* @__PURE__ */ Object.create(null);
    store2._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    var state = store2.state;
    installModule(store2, state, [], store2._modules.root, true);
    resetStoreState(store2, state, hot);
  }
  function resetStoreState(store2, state, hot) {
    var oldState = store2._state;
    var oldScope = store2._scope;
    store2.getters = {};
    store2._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    var wrappedGetters = store2._wrappedGetters;
    var computedObj = {};
    var computedCache = {};
    var scope = vue.effectScope(true);
    scope.run(function() {
      forEachValue(wrappedGetters, function(fn, key2) {
        computedObj[key2] = partial(fn, store2);
        computedCache[key2] = vue.computed(function() {
          return computedObj[key2]();
        });
        Object.defineProperty(store2.getters, key2, {
          get: function() {
            return computedCache[key2].value;
          },
          enumerable: true
          // for local getters
        });
      });
    });
    store2._state = vue.reactive({
      data: state
    });
    store2._scope = scope;
    if (store2.strict) {
      enableStrictMode(store2);
    }
    if (oldState) {
      if (hot) {
        store2._withCommit(function() {
          oldState.data = null;
        });
      }
    }
    if (oldScope) {
      oldScope.stop();
    }
  }
  function installModule(store2, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store2._modules.getNamespace(path);
    if (module.namespaced) {
      if (store2._modulesNamespaceMap[namespace] && true) {
        console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
      }
      store2._modulesNamespaceMap[namespace] = module;
    }
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store2._withCommit(function() {
        {
          if (moduleName in parentState) {
            console.warn(
              '[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"'
            );
          }
        }
        parentState[moduleName] = module.state;
      });
    }
    var local = module.context = makeLocalContext(store2, namespace, path);
    module.forEachMutation(function(mutation, key2) {
      var namespacedType = namespace + key2;
      registerMutation(store2, namespacedType, mutation, local);
    });
    module.forEachAction(function(action, key2) {
      var type = action.root ? key2 : namespace + key2;
      var handler = action.handler || action;
      registerAction(store2, type, handler, local);
    });
    module.forEachGetter(function(getter, key2) {
      var namespacedType = namespace + key2;
      registerGetter(store2, namespacedType, getter, local);
    });
    module.forEachChild(function(child, key2) {
      installModule(store2, rootState, path.concat(key2), child, hot);
    });
  }
  function makeLocalContext(store2, namespace, path) {
    var noNamespace = namespace === "";
    var local = {
      dispatch: noNamespace ? store2.dispatch : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._actions[type]) {
            console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
            return;
          }
        }
        return store2.dispatch(type, payload);
      },
      commit: noNamespace ? store2.commit : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._mutations[type]) {
            console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
            return;
          }
        }
        store2.commit(type, payload, options);
      }
    };
    Object.defineProperties(local, {
      getters: {
        get: noNamespace ? function() {
          return store2.getters;
        } : function() {
          return makeLocalGetters(store2, namespace);
        }
      },
      state: {
        get: function() {
          return getNestedState(store2.state, path);
        }
      }
    });
    return local;
  }
  function makeLocalGetters(store2, namespace) {
    if (!store2._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store2.getters).forEach(function(type) {
        if (type.slice(0, splitPos) !== namespace) {
          return;
        }
        var localType = type.slice(splitPos);
        Object.defineProperty(gettersProxy, localType, {
          get: function() {
            return store2.getters[type];
          },
          enumerable: true
        });
      });
      store2._makeLocalGettersCache[namespace] = gettersProxy;
    }
    return store2._makeLocalGettersCache[namespace];
  }
  function registerMutation(store2, type, handler, local) {
    var entry = store2._mutations[type] || (store2._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store2, local.state, payload);
    });
  }
  function registerAction(store2, type, handler, local) {
    var entry = store2._actions[type] || (store2._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      var res = handler.call(store2, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store2.getters,
        rootState: store2.state
      }, payload);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store2._devtoolHook) {
        return res.catch(function(err) {
          store2._devtoolHook.emit("vuex:error", err);
          throw err;
        });
      } else {
        return res;
      }
    });
  }
  function registerGetter(store2, type, rawGetter, local) {
    if (store2._wrappedGetters[type]) {
      {
        console.error("[vuex] duplicate getter key: " + type);
      }
      return;
    }
    store2._wrappedGetters[type] = function wrappedGetter(store3) {
      return rawGetter(
        local.state,
        // local state
        local.getters,
        // local getters
        store3.state,
        // root state
        store3.getters
        // root getters
      );
    };
  }
  function enableStrictMode(store2) {
    vue.watch(function() {
      return store2._state.data;
    }, function() {
      {
        assert(store2._committing, "do not mutate vuex store state outside mutation handlers.");
      }
    }, { deep: true, flush: "sync" });
  }
  function getNestedState(state, path) {
    return path.reduce(function(state2, key2) {
      return state2[key2];
    }, state);
  }
  function unifyObjectStyle(type, payload, options) {
    if (isObject$5(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }
    {
      assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
    }
    return { type, payload, options };
  }
  var LABEL_VUEX_BINDINGS = "vuex bindings";
  var MUTATIONS_LAYER_ID = "vuex:mutations";
  var ACTIONS_LAYER_ID = "vuex:actions";
  var INSPECTOR_ID = "vuex";
  var actionId = 0;
  function addDevtools(app, store2) {
    setupDevtoolsPlugin(
      {
        id: "org.vuejs.vuex",
        app,
        label: "Vuex",
        homepage: "https://next.vuex.vuejs.org/",
        logo: "https://vuejs.org/images/icons/favicon-96x96.png",
        packageName: "vuex",
        componentStateTypes: [LABEL_VUEX_BINDINGS]
      },
      function(api) {
        api.addTimelineLayer({
          id: MUTATIONS_LAYER_ID,
          label: "Vuex Mutations",
          color: COLOR_LIME_500
        });
        api.addTimelineLayer({
          id: ACTIONS_LAYER_ID,
          label: "Vuex Actions",
          color: COLOR_LIME_500
        });
        api.addInspector({
          id: INSPECTOR_ID,
          label: "Vuex",
          icon: "storage",
          treeFilterPlaceholder: "Filter stores..."
        });
        api.on.getInspectorTree(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            if (payload.filter) {
              var nodes = [];
              flattenStoreForInspectorTree(nodes, store2._modules.root, payload.filter, "");
              payload.rootNodes = nodes;
            } else {
              payload.rootNodes = [
                formatStoreForInspectorTree(store2._modules.root, "")
              ];
            }
          }
        });
        api.on.getInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            makeLocalGetters(store2, modulePath);
            payload.state = formatStoreForInspectorState(
              getStoreModule(store2._modules, modulePath),
              modulePath === "root" ? store2.getters : store2._makeLocalGettersCache,
              modulePath
            );
          }
        });
        api.on.editInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            var path = payload.path;
            if (modulePath !== "root") {
              path = modulePath.split("/").filter(Boolean).concat(path);
            }
            store2._withCommit(function() {
              payload.set(store2._state.data, path, payload.state.value);
            });
          }
        });
        store2.subscribe(function(mutation, state) {
          var data = {};
          if (mutation.payload) {
            data.payload = mutation.payload;
          }
          data.state = state;
          api.notifyComponentUpdate();
          api.sendInspectorTree(INSPECTOR_ID);
          api.sendInspectorState(INSPECTOR_ID);
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: Date.now(),
              title: mutation.type,
              data
            }
          });
        });
        store2.subscribeAction({
          before: function(action, state) {
            var data = {};
            if (action.payload) {
              data.payload = action.payload;
            }
            action._id = actionId++;
            action._time = Date.now();
            data.state = state;
            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: action._time,
                title: action.type,
                groupId: action._id,
                subtitle: "start",
                data
              }
            });
          },
          after: function(action, state) {
            var data = {};
            var duration = Date.now() - action._time;
            data.duration = {
              _custom: {
                type: "duration",
                display: duration + "ms",
                tooltip: "Action duration",
                value: duration
              }
            };
            if (action.payload) {
              data.payload = action.payload;
            }
            data.state = state;
            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: Date.now(),
                title: action.type,
                groupId: action._id,
                subtitle: "end",
                data
              }
            });
          }
        });
      }
    );
  }
  var COLOR_LIME_500 = 8702998;
  var COLOR_DARK = 6710886;
  var COLOR_WHITE = 16777215;
  var TAG_NAMESPACED = {
    label: "namespaced",
    textColor: COLOR_WHITE,
    backgroundColor: COLOR_DARK
  };
  function extractNameFromPath(path) {
    return path && path !== "root" ? path.split("/").slice(-2, -1)[0] : "Root";
  }
  function formatStoreForInspectorTree(module, path) {
    return {
      id: path || "root",
      // all modules end with a `/`, we want the last segment only
      // cart/ -> cart
      // nested/cart/ -> cart
      label: extractNameFromPath(path),
      tags: module.namespaced ? [TAG_NAMESPACED] : [],
      children: Object.keys(module._children).map(
        function(moduleName) {
          return formatStoreForInspectorTree(
            module._children[moduleName],
            path + moduleName + "/"
          );
        }
      )
    };
  }
  function flattenStoreForInspectorTree(result, module, filter2, path) {
    if (path.includes(filter2)) {
      result.push({
        id: path || "root",
        label: path.endsWith("/") ? path.slice(0, path.length - 1) : path || "Root",
        tags: module.namespaced ? [TAG_NAMESPACED] : []
      });
    }
    Object.keys(module._children).forEach(function(moduleName) {
      flattenStoreForInspectorTree(result, module._children[moduleName], filter2, path + moduleName + "/");
    });
  }
  function formatStoreForInspectorState(module, getters2, path) {
    getters2 = path === "root" ? getters2 : getters2[path];
    var gettersKeys = Object.keys(getters2);
    var storeState = {
      state: Object.keys(module.state).map(function(key2) {
        return {
          key: key2,
          editable: true,
          value: module.state[key2]
        };
      })
    };
    if (gettersKeys.length) {
      var tree = transformPathsToObjectTree(getters2);
      storeState.getters = Object.keys(tree).map(function(key2) {
        return {
          key: key2.endsWith("/") ? extractNameFromPath(key2) : key2,
          editable: false,
          value: canThrow(function() {
            return tree[key2];
          })
        };
      });
    }
    return storeState;
  }
  function transformPathsToObjectTree(getters2) {
    var result = {};
    Object.keys(getters2).forEach(function(key2) {
      var path = key2.split("/");
      if (path.length > 1) {
        var target = result;
        var leafKey = path.pop();
        path.forEach(function(p) {
          if (!target[p]) {
            target[p] = {
              _custom: {
                value: {},
                display: p,
                tooltip: "Module",
                abstract: true
              }
            };
          }
          target = target[p]._custom.value;
        });
        target[leafKey] = canThrow(function() {
          return getters2[key2];
        });
      } else {
        result[key2] = canThrow(function() {
          return getters2[key2];
        });
      }
    });
    return result;
  }
  function getStoreModule(moduleMap, path) {
    var names = path.split("/").filter(function(n2) {
      return n2;
    });
    return names.reduce(
      function(module, moduleName, i2) {
        var child = module[moduleName];
        if (!child) {
          throw new Error('Missing module "' + moduleName + '" for path "' + path + '".');
        }
        return i2 === names.length - 1 ? child : child._children;
      },
      path === "root" ? moduleMap : moduleMap.root._children
    );
  }
  function canThrow(cb) {
    try {
      return cb();
    } catch (e) {
      return e;
    }
  }
  var Module = function Module2(rawModule, runtime) {
    this.runtime = runtime;
    this._children = /* @__PURE__ */ Object.create(null);
    this._rawModule = rawModule;
    var rawState = rawModule.state;
    this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
  };
  var prototypeAccessors$1 = { namespaced: { configurable: true } };
  prototypeAccessors$1.namespaced.get = function() {
    return !!this._rawModule.namespaced;
  };
  Module.prototype.addChild = function addChild(key2, module) {
    this._children[key2] = module;
  };
  Module.prototype.removeChild = function removeChild(key2) {
    delete this._children[key2];
  };
  Module.prototype.getChild = function getChild(key2) {
    return this._children[key2];
  };
  Module.prototype.hasChild = function hasChild(key2) {
    return key2 in this._children;
  };
  Module.prototype.update = function update2(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };
  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };
  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };
  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };
  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };
  Object.defineProperties(Module.prototype, prototypeAccessors$1);
  var ModuleCollection = function ModuleCollection2(rawRootModule) {
    this.register([], rawRootModule, false);
  };
  ModuleCollection.prototype.get = function get2(path) {
    return path.reduce(function(module, key2) {
      return module.getChild(key2);
    }, this.root);
  };
  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function(namespace, key2) {
      module = module.getChild(key2);
      return namespace + (module.namespaced ? key2 + "/" : "");
    }, "");
  };
  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update([], this.root, rawRootModule);
  };
  ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
    var this$1$1 = this;
    if (runtime === void 0)
      runtime = true;
    {
      assertRawModule(path, rawModule);
    }
    var newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function(rawChildModule, key2) {
        this$1$1.register(path.concat(key2), rawChildModule, runtime);
      });
    }
  };
  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key2 = path[path.length - 1];
    var child = parent.getChild(key2);
    if (!child) {
      {
        console.warn(
          "[vuex] trying to unregister module '" + key2 + "', which is not registered"
        );
      }
      return;
    }
    if (!child.runtime) {
      return;
    }
    parent.removeChild(key2);
  };
  ModuleCollection.prototype.isRegistered = function isRegistered(path) {
    var parent = this.get(path.slice(0, -1));
    var key2 = path[path.length - 1];
    if (parent) {
      return parent.hasChild(key2);
    }
    return false;
  };
  function update(path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    }
    targetModule.update(newModule);
    if (newModule.modules) {
      for (var key2 in newModule.modules) {
        if (!targetModule.getChild(key2)) {
          {
            console.warn(
              "[vuex] trying to add a new module '" + key2 + "' on hot reloading, manual reload is needed"
            );
          }
          return;
        }
        update(
          path.concat(key2),
          targetModule.getChild(key2),
          newModule.modules[key2]
        );
      }
    }
  }
  var functionAssert = {
    assert: function(value) {
      return typeof value === "function";
    },
    expected: "function"
  };
  var objectAssert = {
    assert: function(value) {
      return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
    },
    expected: 'function or object with "handler" function'
  };
  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };
  function assertRawModule(path, rawModule) {
    Object.keys(assertTypes).forEach(function(key2) {
      if (!rawModule[key2]) {
        return;
      }
      var assertOptions = assertTypes[key2];
      forEachValue(rawModule[key2], function(value, type) {
        assert(
          assertOptions.assert(value),
          makeAssertionMessage(path, key2, type, value, assertOptions.expected)
        );
      });
    });
  }
  function makeAssertionMessage(path, key2, type, value, expected) {
    var buf = key2 + " should be " + expected + ' but "' + key2 + "." + type + '"';
    if (path.length > 0) {
      buf += ' in module "' + path.join(".") + '"';
    }
    buf += " is " + JSON.stringify(value) + ".";
    return buf;
  }
  function createStore(options) {
    return new Store(options);
  }
  var Store = function Store2(options) {
    var this$1$1 = this;
    if (options === void 0)
      options = {};
    {
      assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store2, "store must be called with the new operator.");
    }
    var plugins = options.plugins;
    if (plugins === void 0)
      plugins = [];
    var strict = options.strict;
    if (strict === void 0)
      strict = false;
    var devtools = options.devtools;
    this._committing = false;
    this._actions = /* @__PURE__ */ Object.create(null);
    this._actionSubscribers = [];
    this._mutations = /* @__PURE__ */ Object.create(null);
    this._wrappedGetters = /* @__PURE__ */ Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    this._subscribers = [];
    this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    this._scope = null;
    this._devtools = devtools;
    var store2 = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store2, type, payload);
    };
    this.commit = function boundCommit(type, payload, options2) {
      return commit.call(store2, type, payload, options2);
    };
    this.strict = strict;
    var state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);
    resetStoreState(this, state);
    plugins.forEach(function(plugin) {
      return plugin(this$1$1);
    });
  };
  var prototypeAccessors = { state: { configurable: true } };
  Store.prototype.install = function install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
    var useDevtools = this._devtools !== void 0 ? this._devtools : true;
    if (useDevtools) {
      addDevtools(app, this);
    }
  };
  prototypeAccessors.state.get = function() {
    return this._state.data;
  };
  prototypeAccessors.state.set = function(v) {
    {
      assert(false, "use store.replaceState() to explicit replace store state.");
    }
  };
  Store.prototype.commit = function commit(_type, _payload, _options) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;
    var mutation = { type, payload };
    var entry = this._mutations[type];
    if (!entry) {
      {
        console.error("[vuex] unknown mutation type: " + type);
      }
      return;
    }
    this._withCommit(function() {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });
    this._subscribers.slice().forEach(function(sub) {
      return sub(mutation, this$1$1.state);
    });
    if (options && options.silent) {
      console.warn(
        "[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools"
      );
    }
  };
  Store.prototype.dispatch = function dispatch(_type, _payload) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;
    var action = { type, payload };
    var entry = this._actions[type];
    if (!entry) {
      {
        console.error("[vuex] unknown action type: " + type);
      }
      return;
    }
    try {
      this._actionSubscribers.slice().filter(function(sub) {
        return sub.before;
      }).forEach(function(sub) {
        return sub.before(action, this$1$1.state);
      });
    } catch (e) {
      {
        console.warn("[vuex] error in before action subscribers: ");
        console.error(e);
      }
    }
    var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
      return handler(payload);
    })) : entry[0](payload);
    return new Promise(function(resolve, reject2) {
      result.then(function(res) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.after;
          }).forEach(function(sub) {
            return sub.after(action, this$1$1.state);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in after action subscribers: ");
            console.error(e);
          }
        }
        resolve(res);
      }, function(error) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.error;
          }).forEach(function(sub) {
            return sub.error(action, this$1$1.state, error);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in error action subscribers: ");
            console.error(e);
          }
        }
        reject2(error);
      });
    });
  };
  Store.prototype.subscribe = function subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options);
  };
  Store.prototype.subscribeAction = function subscribeAction(fn, options) {
    var subs = typeof fn === "function" ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  };
  Store.prototype.watch = function watch$1(getter, cb, options) {
    var this$1$1 = this;
    {
      assert(typeof getter === "function", "store.watch only accepts a function.");
    }
    return vue.watch(function() {
      return getter(this$1$1.state, this$1$1.getters);
    }, cb, Object.assign({}, options));
  };
  Store.prototype.replaceState = function replaceState(state) {
    var this$1$1 = this;
    this._withCommit(function() {
      this$1$1._state.data = state;
    });
  };
  Store.prototype.registerModule = function registerModule(path, rawModule, options) {
    if (options === void 0)
      options = {};
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, "cannot register the root module by using registerModule.");
    }
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    resetStoreState(this, this.state);
  };
  Store.prototype.unregisterModule = function unregisterModule(path) {
    var this$1$1 = this;
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    this._modules.unregister(path);
    this._withCommit(function() {
      var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    resetStore(this);
  };
  Store.prototype.hasModule = function hasModule(path) {
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    return this._modules.isRegistered(path);
  };
  Store.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);
    resetStore(this, true);
  };
  Store.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };
  Object.defineProperties(Store.prototype, prototypeAccessors);
  const noTokenBackUrl = "/pages/login";
  const hasTokenBackUrl = "/pages/home/index";
  const config = {
    // 服务平台类型（SNOWY或SNOWY_CLOUD）
    SERVER_TYPE: "SNOWY",
    // 接口地址，也就是后端地址
    BASE_URL: "http://192.168.1.19:82/app",
    //  BASE_URL: 'http://ngg59g.natappfree.cc/app',
    // 后端配置文件的 snowy.config.common.front-url，相当于前端地址（开源版本非必要）
    TENANT_DOMAIN: "http://localhost:81",
    // 请求超时
    TIMEOUT: 1e4,
    // TokenName // Authorization
    TOKEN_NAME: "token",
    // Token前缀，注意最后有个空格，如不需要需设置空字符串 // Bearer
    TOKEN_PREFIX: "",
    // 系统基础配置，这些是数据库中保存起来的
    SYS_BASE_CONFIG: {
      // 默认logo
      SNOWY_SYS_LOGO: "/static/logo.png",
      // 背景图
      SNOWY_SYS_BACK_IMAGE: "",
      // 系统名称
      SNOWY_SYS_NAME: "Snowy",
      // 版本
      SNOWY_SYS_VERSION: "2.0",
      // 版权
      SNOWY_SYS_COPYRIGHT: "Snowy ©2022 Created by xiaonuo.vip",
      // 版权跳转URL
      SNOWY_SYS_COPYRIGHT_URL: "https://www.xiaonuo.vip",
      // 默认文件存储
      SNOWY_SYS_DEFAULT_FILE_ENGINE: "LOCAL",
      // 是否开启验证码
      SNOWY_SYS_DEFAULT_CAPTCHA_OPEN: "false",
      // 默认重置密码
      SNOWY_SYS_DEFAULT_PASSWORD: "123456"
    },
    // 没有token访问退回页面
    NO_TOKEN_BACK_URL: noTokenBackUrl,
    // 不需要登录（没有token）页面白名单
    NO_TOKEN_WHITE_LIST: [
      noTokenBackUrl
      // '/pages/home/index',
    ],
    // 有token访问退回页面
    HAS_TOKEN_BACK_URL: hasTokenBackUrl,
    // 登录（有token）可以访问的页面白名单
    HAS_TOKEN_WHITE_LIST: [
      hasTokenBackUrl,
      "/pages/work/index",
      "/pages/mine/index",
      "/pages/mine/setting/index",
      "/pages/mine/info/edit",
      "/pages/mine/pwd/index",
      "/pages/mine/info/index",
      "/pages/biz/custom/index",
      "/pages/biz/business/index",
      "/pages/biz/holding/index",
      "/pages/home/index.html",
      "/pages/biz/business/buy.html"
    ]
  };
  const constant = {
    sysBaseConfig: "sysBaseConfig",
    userInfo: "userInfo",
    userMenus: "userMenus",
    userMobileMenus: "userMobileMenus",
    dictTypeTreeData: "dictTypeTreeData"
  };
  let storageKey = "storage_data";
  let storageNodeKeys = [constant.sysBaseConfig, constant.userInfo, constant.userMenus, constant.userMobileMenus, constant.dictTypeTreeData];
  let storageData = uni.getStorageSync(storageKey) || {};
  const storage = {
    set: function(key2, value) {
      if (storageNodeKeys.indexOf(key2) != -1) {
        let tmp = uni.getStorageSync(storageKey);
        tmp = tmp ? tmp : {};
        tmp[key2] = value;
        uni.setStorageSync(storageKey, tmp);
      }
    },
    get: function(key2) {
      return storageData[key2] || "";
    },
    remove: function(key2) {
      delete storageData[key2];
      uni.setStorageSync(storageKey, storageData);
    },
    clean: function() {
      uni.removeStorageSync(storageKey);
    }
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var lookup = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    62,
    0,
    62,
    0,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    0,
    0,
    0,
    0,
    63,
    0,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ];
  function base64Decode(source, target) {
    var sourceLength = source.length;
    var paddingLength = source[sourceLength - 2] === "=" ? 2 : source[sourceLength - 1] === "=" ? 1 : 0;
    var tmp;
    var byteIndex = 0;
    var baseLength = sourceLength - paddingLength & 4294967292;
    for (var i2 = 0; i2 < baseLength; i2 += 4) {
      tmp = lookup[source.charCodeAt(i2)] << 18 | lookup[source.charCodeAt(i2 + 1)] << 12 | lookup[source.charCodeAt(i2 + 2)] << 6 | lookup[source.charCodeAt(i2 + 3)];
      target[byteIndex++] = tmp >> 16 & 255;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 1) {
      tmp = lookup[source.charCodeAt(i2)] << 10 | lookup[source.charCodeAt(i2 + 1)] << 4 | lookup[source.charCodeAt(i2 + 2)] >> 2;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 2) {
      tmp = lookup[source.charCodeAt(i2)] << 2 | lookup[source.charCodeAt(i2 + 1)] >> 4;
      target[byteIndex++] = tmp & 255;
    }
  }
  const $inject_window_crypto = {
    getRandomValues(arr) {
      if (!(arr instanceof Int8Array || arr instanceof Uint8Array || arr instanceof Int16Array || arr instanceof Uint16Array || arr instanceof Int32Array || arr instanceof Uint32Array || arr instanceof Uint8ClampedArray)) {
        throw new Error("Expected an integer array");
      }
      if (arr.byteLength > 65536) {
        throw new Error("Can only request a maximum of 65536 bytes");
      }
      var crypto = requireNativePlugin("DCloud-Crypto");
      base64Decode(crypto.getRandomValues(arr.byteLength), new Uint8Array(
        arr.buffer,
        arr.byteOffset,
        arr.byteLength
      ));
      return arr;
    }
  };
  var jsbnExports = {};
  var jsbn = {
    get exports() {
      return jsbnExports;
    },
    set exports(v) {
      jsbnExports = v;
    }
  };
  (function(module, exports) {
    (function() {
      var dbits;
      var canary = 244837814094590;
      var j_lm = (canary & 16777215) == 15715070;
      function BigInteger2(a, b, c) {
        if (a != null)
          if ("number" == typeof a)
            this.fromNumber(a, b, c);
          else if (b == null && "string" != typeof a)
            this.fromString(a, 256);
          else
            this.fromString(a, b);
      }
      function nbi() {
        return new BigInteger2(null);
      }
      function am1(i2, x, w, j, c, n2) {
        while (--n2 >= 0) {
          var v = x * this[i2++] + w[j] + c;
          c = Math.floor(v / 67108864);
          w[j++] = v & 67108863;
        }
        return c;
      }
      function am2(i2, x, w, j, c, n2) {
        var xl = x & 32767, xh = x >> 15;
        while (--n2 >= 0) {
          var l = this[i2] & 32767;
          var h = this[i2++] >> 15;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
          c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
          w[j++] = l & 1073741823;
        }
        return c;
      }
      function am3(i2, x, w, j, c, n2) {
        var xl = x & 16383, xh = x >> 14;
        while (--n2 >= 0) {
          var l = this[i2] & 16383;
          var h = this[i2++] >> 14;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 16383) << 14) + w[j] + c;
          c = (l >> 28) + (m >> 14) + xh * h;
          w[j++] = l & 268435455;
        }
        return c;
      }
      var inBrowser = typeof navigator !== "undefined";
      if (inBrowser && j_lm && navigator.appName == "Microsoft Internet Explorer") {
        BigInteger2.prototype.am = am2;
        dbits = 30;
      } else if (inBrowser && j_lm && navigator.appName != "Netscape") {
        BigInteger2.prototype.am = am1;
        dbits = 26;
      } else {
        BigInteger2.prototype.am = am3;
        dbits = 28;
      }
      BigInteger2.prototype.DB = dbits;
      BigInteger2.prototype.DM = (1 << dbits) - 1;
      BigInteger2.prototype.DV = 1 << dbits;
      var BI_FP = 52;
      BigInteger2.prototype.FV = Math.pow(2, BI_FP);
      BigInteger2.prototype.F1 = BI_FP - dbits;
      BigInteger2.prototype.F2 = 2 * dbits - BI_FP;
      var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
      var BI_RC = new Array();
      var rr, vv;
      rr = "0".charCodeAt(0);
      for (vv = 0; vv <= 9; ++vv)
        BI_RC[rr++] = vv;
      rr = "a".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv)
        BI_RC[rr++] = vv;
      rr = "A".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv)
        BI_RC[rr++] = vv;
      function int2char(n2) {
        return BI_RM.charAt(n2);
      }
      function intAt(s, i2) {
        var c = BI_RC[s.charCodeAt(i2)];
        return c == null ? -1 : c;
      }
      function bnpCopyTo(r) {
        for (var i2 = this.t - 1; i2 >= 0; --i2)
          r[i2] = this[i2];
        r.t = this.t;
        r.s = this.s;
      }
      function bnpFromInt(x) {
        this.t = 1;
        this.s = x < 0 ? -1 : 0;
        if (x > 0)
          this[0] = x;
        else if (x < -1)
          this[0] = x + this.DV;
        else
          this.t = 0;
      }
      function nbv(i2) {
        var r = nbi();
        r.fromInt(i2);
        return r;
      }
      function bnpFromString(s, b) {
        var k;
        if (b == 16)
          k = 4;
        else if (b == 8)
          k = 3;
        else if (b == 256)
          k = 8;
        else if (b == 2)
          k = 1;
        else if (b == 32)
          k = 5;
        else if (b == 4)
          k = 2;
        else {
          this.fromRadix(s, b);
          return;
        }
        this.t = 0;
        this.s = 0;
        var i2 = s.length, mi = false, sh = 0;
        while (--i2 >= 0) {
          var x = k == 8 ? s[i2] & 255 : intAt(s, i2);
          if (x < 0) {
            if (s.charAt(i2) == "-")
              mi = true;
            continue;
          }
          mi = false;
          if (sh == 0)
            this[this.t++] = x;
          else if (sh + k > this.DB) {
            this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
            this[this.t++] = x >> this.DB - sh;
          } else
            this[this.t - 1] |= x << sh;
          sh += k;
          if (sh >= this.DB)
            sh -= this.DB;
        }
        if (k == 8 && (s[0] & 128) != 0) {
          this.s = -1;
          if (sh > 0)
            this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
        }
        this.clamp();
        if (mi)
          BigInteger2.ZERO.subTo(this, this);
      }
      function bnpClamp() {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c)
          --this.t;
      }
      function bnToString(b) {
        if (this.s < 0)
          return "-" + this.negate().toString(b);
        var k;
        if (b == 16)
          k = 4;
        else if (b == 8)
          k = 3;
        else if (b == 2)
          k = 1;
        else if (b == 32)
          k = 5;
        else if (b == 4)
          k = 2;
        else
          return this.toRadix(b);
        var km = (1 << k) - 1, d, m = false, r = "", i2 = this.t;
        var p = this.DB - i2 * this.DB % k;
        if (i2-- > 0) {
          if (p < this.DB && (d = this[i2] >> p) > 0) {
            m = true;
            r = int2char(d);
          }
          while (i2 >= 0) {
            if (p < k) {
              d = (this[i2] & (1 << p) - 1) << k - p;
              d |= this[--i2] >> (p += this.DB - k);
            } else {
              d = this[i2] >> (p -= k) & km;
              if (p <= 0) {
                p += this.DB;
                --i2;
              }
            }
            if (d > 0)
              m = true;
            if (m)
              r += int2char(d);
          }
        }
        return m ? r : "0";
      }
      function bnNegate() {
        var r = nbi();
        BigInteger2.ZERO.subTo(this, r);
        return r;
      }
      function bnAbs() {
        return this.s < 0 ? this.negate() : this;
      }
      function bnCompareTo(a) {
        var r = this.s - a.s;
        if (r != 0)
          return r;
        var i2 = this.t;
        r = i2 - a.t;
        if (r != 0)
          return this.s < 0 ? -r : r;
        while (--i2 >= 0)
          if ((r = this[i2] - a[i2]) != 0)
            return r;
        return 0;
      }
      function nbits(x) {
        var r = 1, t2;
        if ((t2 = x >>> 16) != 0) {
          x = t2;
          r += 16;
        }
        if ((t2 = x >> 8) != 0) {
          x = t2;
          r += 8;
        }
        if ((t2 = x >> 4) != 0) {
          x = t2;
          r += 4;
        }
        if ((t2 = x >> 2) != 0) {
          x = t2;
          r += 2;
        }
        if ((t2 = x >> 1) != 0) {
          x = t2;
          r += 1;
        }
        return r;
      }
      function bnBitLength() {
        if (this.t <= 0)
          return 0;
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
      }
      function bnpDLShiftTo(n2, r) {
        var i2;
        for (i2 = this.t - 1; i2 >= 0; --i2)
          r[i2 + n2] = this[i2];
        for (i2 = n2 - 1; i2 >= 0; --i2)
          r[i2] = 0;
        r.t = this.t + n2;
        r.s = this.s;
      }
      function bnpDRShiftTo(n2, r) {
        for (var i2 = n2; i2 < this.t; ++i2)
          r[i2 - n2] = this[i2];
        r.t = Math.max(this.t - n2, 0);
        r.s = this.s;
      }
      function bnpLShiftTo(n2, r) {
        var bs = n2 % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n2 / this.DB), c = this.s << bs & this.DM, i2;
        for (i2 = this.t - 1; i2 >= 0; --i2) {
          r[i2 + ds + 1] = this[i2] >> cbs | c;
          c = (this[i2] & bm) << bs;
        }
        for (i2 = ds - 1; i2 >= 0; --i2)
          r[i2] = 0;
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
      }
      function bnpRShiftTo(n2, r) {
        r.s = this.s;
        var ds = Math.floor(n2 / this.DB);
        if (ds >= this.t) {
          r.t = 0;
          return;
        }
        var bs = n2 % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i2 = ds + 1; i2 < this.t; ++i2) {
          r[i2 - ds - 1] |= (this[i2] & bm) << cbs;
          r[i2 - ds] = this[i2] >> bs;
        }
        if (bs > 0)
          r[this.t - ds - 1] |= (this.s & bm) << cbs;
        r.t = this.t - ds;
        r.clamp();
      }
      function bnpSubTo(a, r) {
        var i2 = 0, c = 0, m = Math.min(a.t, this.t);
        while (i2 < m) {
          c += this[i2] - a[i2];
          r[i2++] = c & this.DM;
          c >>= this.DB;
        }
        if (a.t < this.t) {
          c -= a.s;
          while (i2 < this.t) {
            c += this[i2];
            r[i2++] = c & this.DM;
            c >>= this.DB;
          }
          c += this.s;
        } else {
          c += this.s;
          while (i2 < a.t) {
            c -= a[i2];
            r[i2++] = c & this.DM;
            c >>= this.DB;
          }
          c -= a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c < -1)
          r[i2++] = this.DV + c;
        else if (c > 0)
          r[i2++] = c;
        r.t = i2;
        r.clamp();
      }
      function bnpMultiplyTo(a, r) {
        var x = this.abs(), y = a.abs();
        var i2 = x.t;
        r.t = i2 + y.t;
        while (--i2 >= 0)
          r[i2] = 0;
        for (i2 = 0; i2 < y.t; ++i2)
          r[i2 + x.t] = x.am(0, y[i2], r, i2, 0, x.t);
        r.s = 0;
        r.clamp();
        if (this.s != a.s)
          BigInteger2.ZERO.subTo(r, r);
      }
      function bnpSquareTo(r) {
        var x = this.abs();
        var i2 = r.t = 2 * x.t;
        while (--i2 >= 0)
          r[i2] = 0;
        for (i2 = 0; i2 < x.t - 1; ++i2) {
          var c = x.am(i2, x[i2], r, 2 * i2, 0, 1);
          if ((r[i2 + x.t] += x.am(i2 + 1, 2 * x[i2], r, 2 * i2 + 1, c, x.t - i2 - 1)) >= x.DV) {
            r[i2 + x.t] -= x.DV;
            r[i2 + x.t + 1] = 1;
          }
        }
        if (r.t > 0)
          r[r.t - 1] += x.am(i2, x[i2], r, 2 * i2, 0, 1);
        r.s = 0;
        r.clamp();
      }
      function bnpDivRemTo(m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0)
          return;
        var pt = this.abs();
        if (pt.t < pm.t) {
          if (q != null)
            q.fromInt(0);
          if (r != null)
            this.copyTo(r);
          return;
        }
        if (r == null)
          r = nbi();
        var y = nbi(), ts = this.s, ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]);
        if (nsh > 0) {
          pm.lShiftTo(nsh, y);
          pt.lShiftTo(nsh, r);
        } else {
          pm.copyTo(y);
          pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0)
          return;
        var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt, d22 = (1 << this.F1) / yt, e = 1 << this.F2;
        var i2 = r.t, j = i2 - ys, t2 = q == null ? nbi() : q;
        y.dlShiftTo(j, t2);
        if (r.compareTo(t2) >= 0) {
          r[r.t++] = 1;
          r.subTo(t2, r);
        }
        BigInteger2.ONE.dlShiftTo(ys, t2);
        t2.subTo(y, y);
        while (y.t < ys)
          y[y.t++] = 0;
        while (--j >= 0) {
          var qd = r[--i2] == y0 ? this.DM : Math.floor(r[i2] * d1 + (r[i2 - 1] + e) * d22);
          if ((r[i2] += y.am(0, qd, r, j, 0, ys)) < qd) {
            y.dlShiftTo(j, t2);
            r.subTo(t2, r);
            while (r[i2] < --qd)
              r.subTo(t2, r);
          }
        }
        if (q != null) {
          r.drShiftTo(ys, q);
          if (ts != ms)
            BigInteger2.ZERO.subTo(q, q);
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0)
          r.rShiftTo(nsh, r);
        if (ts < 0)
          BigInteger2.ZERO.subTo(r, r);
      }
      function bnMod(a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger2.ZERO) > 0)
          a.subTo(r, r);
        return r;
      }
      function Classic(m) {
        this.m = m;
      }
      function cConvert(x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0)
          return x.mod(this.m);
        else
          return x;
      }
      function cRevert(x) {
        return x;
      }
      function cReduce(x) {
        x.divRemTo(this.m, null, x);
      }
      function cMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      function cSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      Classic.prototype.convert = cConvert;
      Classic.prototype.revert = cRevert;
      Classic.prototype.reduce = cReduce;
      Classic.prototype.mulTo = cMulTo;
      Classic.prototype.sqrTo = cSqrTo;
      function bnpInvDigit() {
        if (this.t < 1)
          return 0;
        var x = this[0];
        if ((x & 1) == 0)
          return 0;
        var y = x & 3;
        y = y * (2 - (x & 15) * y) & 15;
        y = y * (2 - (x & 255) * y) & 255;
        y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
        y = y * (2 - x * y % this.DV) % this.DV;
        return y > 0 ? this.DV - y : -y;
      }
      function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << m.DB - 15) - 1;
        this.mt2 = 2 * m.t;
      }
      function montConvert(x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger2.ZERO) > 0)
          this.m.subTo(r, r);
        return r;
      }
      function montRevert(x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }
      function montReduce(x) {
        while (x.t <= this.mt2)
          x[x.t++] = 0;
        for (var i2 = 0; i2 < this.m.t; ++i2) {
          var j = x[i2] & 32767;
          var u0 = j * this.mpl + ((j * this.mph + (x[i2] >> 15) * this.mpl & this.um) << 15) & x.DM;
          j = i2 + this.m.t;
          x[j] += this.m.am(0, u0, x, i2, 0, this.m.t);
          while (x[j] >= x.DV) {
            x[j] -= x.DV;
            x[++j]++;
          }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0)
          x.subTo(this.m, x);
      }
      function montSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      function montMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      Montgomery.prototype.convert = montConvert;
      Montgomery.prototype.revert = montRevert;
      Montgomery.prototype.reduce = montReduce;
      Montgomery.prototype.mulTo = montMulTo;
      Montgomery.prototype.sqrTo = montSqrTo;
      function bnpIsEven() {
        return (this.t > 0 ? this[0] & 1 : this.s) == 0;
      }
      function bnpExp(e, z2) {
        if (e > 4294967295 || e < 1)
          return BigInteger2.ONE;
        var r = nbi(), r2 = nbi(), g = z2.convert(this), i2 = nbits(e) - 1;
        g.copyTo(r);
        while (--i2 >= 0) {
          z2.sqrTo(r, r2);
          if ((e & 1 << i2) > 0)
            z2.mulTo(r2, g, r);
          else {
            var t2 = r;
            r = r2;
            r2 = t2;
          }
        }
        return z2.revert(r);
      }
      function bnModPowInt(e, m) {
        var z2;
        if (e < 256 || m.isEven())
          z2 = new Classic(m);
        else
          z2 = new Montgomery(m);
        return this.exp(e, z2);
      }
      BigInteger2.prototype.copyTo = bnpCopyTo;
      BigInteger2.prototype.fromInt = bnpFromInt;
      BigInteger2.prototype.fromString = bnpFromString;
      BigInteger2.prototype.clamp = bnpClamp;
      BigInteger2.prototype.dlShiftTo = bnpDLShiftTo;
      BigInteger2.prototype.drShiftTo = bnpDRShiftTo;
      BigInteger2.prototype.lShiftTo = bnpLShiftTo;
      BigInteger2.prototype.rShiftTo = bnpRShiftTo;
      BigInteger2.prototype.subTo = bnpSubTo;
      BigInteger2.prototype.multiplyTo = bnpMultiplyTo;
      BigInteger2.prototype.squareTo = bnpSquareTo;
      BigInteger2.prototype.divRemTo = bnpDivRemTo;
      BigInteger2.prototype.invDigit = bnpInvDigit;
      BigInteger2.prototype.isEven = bnpIsEven;
      BigInteger2.prototype.exp = bnpExp;
      BigInteger2.prototype.toString = bnToString;
      BigInteger2.prototype.negate = bnNegate;
      BigInteger2.prototype.abs = bnAbs;
      BigInteger2.prototype.compareTo = bnCompareTo;
      BigInteger2.prototype.bitLength = bnBitLength;
      BigInteger2.prototype.mod = bnMod;
      BigInteger2.prototype.modPowInt = bnModPowInt;
      BigInteger2.ZERO = nbv(0);
      BigInteger2.ONE = nbv(1);
      function bnClone() {
        var r = nbi();
        this.copyTo(r);
        return r;
      }
      function bnIntValue() {
        if (this.s < 0) {
          if (this.t == 1)
            return this[0] - this.DV;
          else if (this.t == 0)
            return -1;
        } else if (this.t == 1)
          return this[0];
        else if (this.t == 0)
          return 0;
        return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
      }
      function bnByteValue() {
        return this.t == 0 ? this.s : this[0] << 24 >> 24;
      }
      function bnShortValue() {
        return this.t == 0 ? this.s : this[0] << 16 >> 16;
      }
      function bnpChunkSize(r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
      }
      function bnSigNum() {
        if (this.s < 0)
          return -1;
        else if (this.t <= 0 || this.t == 1 && this[0] <= 0)
          return 0;
        else
          return 1;
      }
      function bnpToRadix(b) {
        if (b == null)
          b = 10;
        if (this.signum() == 0 || b < 2 || b > 36)
          return "0";
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a), y = nbi(), z2 = nbi(), r = "";
        this.divRemTo(d, y, z2);
        while (y.signum() > 0) {
          r = (a + z2.intValue()).toString(b).substr(1) + r;
          y.divRemTo(d, y, z2);
        }
        return z2.intValue().toString(b) + r;
      }
      function bnpFromRadix(s, b) {
        this.fromInt(0);
        if (b == null)
          b = 10;
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
        for (var i2 = 0; i2 < s.length; ++i2) {
          var x = intAt(s, i2);
          if (x < 0) {
            if (s.charAt(i2) == "-" && this.signum() == 0)
              mi = true;
            continue;
          }
          w = b * w + x;
          if (++j >= cs) {
            this.dMultiply(d);
            this.dAddOffset(w, 0);
            j = 0;
            w = 0;
          }
        }
        if (j > 0) {
          this.dMultiply(Math.pow(b, j));
          this.dAddOffset(w, 0);
        }
        if (mi)
          BigInteger2.ZERO.subTo(this, this);
      }
      function bnpFromNumber(a, b, c) {
        if ("number" == typeof b) {
          if (a < 2)
            this.fromInt(1);
          else {
            this.fromNumber(a, c);
            if (!this.testBit(a - 1))
              this.bitwiseTo(BigInteger2.ONE.shiftLeft(a - 1), op_or, this);
            if (this.isEven())
              this.dAddOffset(1, 0);
            while (!this.isProbablePrime(b)) {
              this.dAddOffset(2, 0);
              if (this.bitLength() > a)
                this.subTo(BigInteger2.ONE.shiftLeft(a - 1), this);
            }
          }
        } else {
          var x = new Array(), t2 = a & 7;
          x.length = (a >> 3) + 1;
          b.nextBytes(x);
          if (t2 > 0)
            x[0] &= (1 << t2) - 1;
          else
            x[0] = 0;
          this.fromString(x, 256);
        }
      }
      function bnToByteArray() {
        var i2 = this.t, r = new Array();
        r[0] = this.s;
        var p = this.DB - i2 * this.DB % 8, d, k = 0;
        if (i2-- > 0) {
          if (p < this.DB && (d = this[i2] >> p) != (this.s & this.DM) >> p)
            r[k++] = d | this.s << this.DB - p;
          while (i2 >= 0) {
            if (p < 8) {
              d = (this[i2] & (1 << p) - 1) << 8 - p;
              d |= this[--i2] >> (p += this.DB - 8);
            } else {
              d = this[i2] >> (p -= 8) & 255;
              if (p <= 0) {
                p += this.DB;
                --i2;
              }
            }
            if ((d & 128) != 0)
              d |= -256;
            if (k == 0 && (this.s & 128) != (d & 128))
              ++k;
            if (k > 0 || d != this.s)
              r[k++] = d;
          }
        }
        return r;
      }
      function bnEquals(a) {
        return this.compareTo(a) == 0;
      }
      function bnMin(a) {
        return this.compareTo(a) < 0 ? this : a;
      }
      function bnMax(a) {
        return this.compareTo(a) > 0 ? this : a;
      }
      function bnpBitwiseTo(a, op, r) {
        var i2, f, m = Math.min(a.t, this.t);
        for (i2 = 0; i2 < m; ++i2)
          r[i2] = op(this[i2], a[i2]);
        if (a.t < this.t) {
          f = a.s & this.DM;
          for (i2 = m; i2 < this.t; ++i2)
            r[i2] = op(this[i2], f);
          r.t = this.t;
        } else {
          f = this.s & this.DM;
          for (i2 = m; i2 < a.t; ++i2)
            r[i2] = op(f, a[i2]);
          r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
      }
      function op_and(x, y) {
        return x & y;
      }
      function bnAnd(a) {
        var r = nbi();
        this.bitwiseTo(a, op_and, r);
        return r;
      }
      function op_or(x, y) {
        return x | y;
      }
      function bnOr(a) {
        var r = nbi();
        this.bitwiseTo(a, op_or, r);
        return r;
      }
      function op_xor(x, y) {
        return x ^ y;
      }
      function bnXor(a) {
        var r = nbi();
        this.bitwiseTo(a, op_xor, r);
        return r;
      }
      function op_andnot(x, y) {
        return x & ~y;
      }
      function bnAndNot(a) {
        var r = nbi();
        this.bitwiseTo(a, op_andnot, r);
        return r;
      }
      function bnNot() {
        var r = nbi();
        for (var i2 = 0; i2 < this.t; ++i2)
          r[i2] = this.DM & ~this[i2];
        r.t = this.t;
        r.s = ~this.s;
        return r;
      }
      function bnShiftLeft(n2) {
        var r = nbi();
        if (n2 < 0)
          this.rShiftTo(-n2, r);
        else
          this.lShiftTo(n2, r);
        return r;
      }
      function bnShiftRight(n2) {
        var r = nbi();
        if (n2 < 0)
          this.lShiftTo(-n2, r);
        else
          this.rShiftTo(n2, r);
        return r;
      }
      function lbit(x) {
        if (x == 0)
          return -1;
        var r = 0;
        if ((x & 65535) == 0) {
          x >>= 16;
          r += 16;
        }
        if ((x & 255) == 0) {
          x >>= 8;
          r += 8;
        }
        if ((x & 15) == 0) {
          x >>= 4;
          r += 4;
        }
        if ((x & 3) == 0) {
          x >>= 2;
          r += 2;
        }
        if ((x & 1) == 0)
          ++r;
        return r;
      }
      function bnGetLowestSetBit() {
        for (var i2 = 0; i2 < this.t; ++i2)
          if (this[i2] != 0)
            return i2 * this.DB + lbit(this[i2]);
        if (this.s < 0)
          return this.t * this.DB;
        return -1;
      }
      function cbit(x) {
        var r = 0;
        while (x != 0) {
          x &= x - 1;
          ++r;
        }
        return r;
      }
      function bnBitCount() {
        var r = 0, x = this.s & this.DM;
        for (var i2 = 0; i2 < this.t; ++i2)
          r += cbit(this[i2] ^ x);
        return r;
      }
      function bnTestBit(n2) {
        var j = Math.floor(n2 / this.DB);
        if (j >= this.t)
          return this.s != 0;
        return (this[j] & 1 << n2 % this.DB) != 0;
      }
      function bnpChangeBit(n2, op) {
        var r = BigInteger2.ONE.shiftLeft(n2);
        this.bitwiseTo(r, op, r);
        return r;
      }
      function bnSetBit(n2) {
        return this.changeBit(n2, op_or);
      }
      function bnClearBit(n2) {
        return this.changeBit(n2, op_andnot);
      }
      function bnFlipBit(n2) {
        return this.changeBit(n2, op_xor);
      }
      function bnpAddTo(a, r) {
        var i2 = 0, c = 0, m = Math.min(a.t, this.t);
        while (i2 < m) {
          c += this[i2] + a[i2];
          r[i2++] = c & this.DM;
          c >>= this.DB;
        }
        if (a.t < this.t) {
          c += a.s;
          while (i2 < this.t) {
            c += this[i2];
            r[i2++] = c & this.DM;
            c >>= this.DB;
          }
          c += this.s;
        } else {
          c += this.s;
          while (i2 < a.t) {
            c += a[i2];
            r[i2++] = c & this.DM;
            c >>= this.DB;
          }
          c += a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c > 0)
          r[i2++] = c;
        else if (c < -1)
          r[i2++] = this.DV + c;
        r.t = i2;
        r.clamp();
      }
      function bnAdd(a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
      }
      function bnSubtract(a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
      }
      function bnMultiply(a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
      }
      function bnSquare() {
        var r = nbi();
        this.squareTo(r);
        return r;
      }
      function bnDivide(a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
      }
      function bnRemainder(a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
      }
      function bnDivideAndRemainder(a) {
        var q = nbi(), r = nbi();
        this.divRemTo(a, q, r);
        return new Array(q, r);
      }
      function bnpDMultiply(n2) {
        this[this.t] = this.am(0, n2 - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
      }
      function bnpDAddOffset(n2, w) {
        if (n2 == 0)
          return;
        while (this.t <= w)
          this[this.t++] = 0;
        this[w] += n2;
        while (this[w] >= this.DV) {
          this[w] -= this.DV;
          if (++w >= this.t)
            this[this.t++] = 0;
          ++this[w];
        }
      }
      function NullExp() {
      }
      function nNop(x) {
        return x;
      }
      function nMulTo(x, y, r) {
        x.multiplyTo(y, r);
      }
      function nSqrTo(x, r) {
        x.squareTo(r);
      }
      NullExp.prototype.convert = nNop;
      NullExp.prototype.revert = nNop;
      NullExp.prototype.mulTo = nMulTo;
      NullExp.prototype.sqrTo = nSqrTo;
      function bnPow(e) {
        return this.exp(e, new NullExp());
      }
      function bnpMultiplyLowerTo(a, n2, r) {
        var i2 = Math.min(this.t + a.t, n2);
        r.s = 0;
        r.t = i2;
        while (i2 > 0)
          r[--i2] = 0;
        var j;
        for (j = r.t - this.t; i2 < j; ++i2)
          r[i2 + this.t] = this.am(0, a[i2], r, i2, 0, this.t);
        for (j = Math.min(a.t, n2); i2 < j; ++i2)
          this.am(0, a[i2], r, i2, 0, n2 - i2);
        r.clamp();
      }
      function bnpMultiplyUpperTo(a, n2, r) {
        --n2;
        var i2 = r.t = this.t + a.t - n2;
        r.s = 0;
        while (--i2 >= 0)
          r[i2] = 0;
        for (i2 = Math.max(n2 - this.t, 0); i2 < a.t; ++i2)
          r[this.t + i2 - n2] = this.am(n2 - i2, a[i2], r, 0, 0, this.t + i2 - n2);
        r.clamp();
        r.drShiftTo(1, r);
      }
      function Barrett(m) {
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger2.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
        this.m = m;
      }
      function barrettConvert(x) {
        if (x.s < 0 || x.t > 2 * this.m.t)
          return x.mod(this.m);
        else if (x.compareTo(this.m) < 0)
          return x;
        else {
          var r = nbi();
          x.copyTo(r);
          this.reduce(r);
          return r;
        }
      }
      function barrettRevert(x) {
        return x;
      }
      function barrettReduce(x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
          x.t = this.m.t + 1;
          x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0)
          x.dAddOffset(1, this.m.t + 1);
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0)
          x.subTo(this.m, x);
      }
      function barrettSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      function barrettMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      Barrett.prototype.convert = barrettConvert;
      Barrett.prototype.revert = barrettRevert;
      Barrett.prototype.reduce = barrettReduce;
      Barrett.prototype.mulTo = barrettMulTo;
      Barrett.prototype.sqrTo = barrettSqrTo;
      function bnModPow(e, m) {
        var i2 = e.bitLength(), k, r = nbv(1), z2;
        if (i2 <= 0)
          return r;
        else if (i2 < 18)
          k = 1;
        else if (i2 < 48)
          k = 3;
        else if (i2 < 144)
          k = 4;
        else if (i2 < 768)
          k = 5;
        else
          k = 6;
        if (i2 < 8)
          z2 = new Classic(m);
        else if (m.isEven())
          z2 = new Barrett(m);
        else
          z2 = new Montgomery(m);
        var g = new Array(), n2 = 3, k1 = k - 1, km = (1 << k) - 1;
        g[1] = z2.convert(this);
        if (k > 1) {
          var g2 = nbi();
          z2.sqrTo(g[1], g2);
          while (n2 <= km) {
            g[n2] = nbi();
            z2.mulTo(g2, g[n2 - 2], g[n2]);
            n2 += 2;
          }
        }
        var j = e.t - 1, w, is1 = true, r2 = nbi(), t2;
        i2 = nbits(e[j]) - 1;
        while (j >= 0) {
          if (i2 >= k1)
            w = e[j] >> i2 - k1 & km;
          else {
            w = (e[j] & (1 << i2 + 1) - 1) << k1 - i2;
            if (j > 0)
              w |= e[j - 1] >> this.DB + i2 - k1;
          }
          n2 = k;
          while ((w & 1) == 0) {
            w >>= 1;
            --n2;
          }
          if ((i2 -= n2) < 0) {
            i2 += this.DB;
            --j;
          }
          if (is1) {
            g[w].copyTo(r);
            is1 = false;
          } else {
            while (n2 > 1) {
              z2.sqrTo(r, r2);
              z2.sqrTo(r2, r);
              n2 -= 2;
            }
            if (n2 > 0)
              z2.sqrTo(r, r2);
            else {
              t2 = r;
              r = r2;
              r2 = t2;
            }
            z2.mulTo(r2, g[w], r);
          }
          while (j >= 0 && (e[j] & 1 << i2) == 0) {
            z2.sqrTo(r, r2);
            t2 = r;
            r = r2;
            r2 = t2;
            if (--i2 < 0) {
              i2 = this.DB - 1;
              --j;
            }
          }
        }
        return z2.revert(r);
      }
      function bnGCD(a) {
        var x = this.s < 0 ? this.negate() : this.clone();
        var y = a.s < 0 ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
          var t2 = x;
          x = y;
          y = t2;
        }
        var i2 = x.getLowestSetBit(), g = y.getLowestSetBit();
        if (g < 0)
          return x;
        if (i2 < g)
          g = i2;
        if (g > 0) {
          x.rShiftTo(g, x);
          y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
          if ((i2 = x.getLowestSetBit()) > 0)
            x.rShiftTo(i2, x);
          if ((i2 = y.getLowestSetBit()) > 0)
            y.rShiftTo(i2, y);
          if (x.compareTo(y) >= 0) {
            x.subTo(y, x);
            x.rShiftTo(1, x);
          } else {
            y.subTo(x, y);
            y.rShiftTo(1, y);
          }
        }
        if (g > 0)
          y.lShiftTo(g, y);
        return y;
      }
      function bnpModInt(n2) {
        if (n2 <= 0)
          return 0;
        var d = this.DV % n2, r = this.s < 0 ? n2 - 1 : 0;
        if (this.t > 0)
          if (d == 0)
            r = this[0] % n2;
          else
            for (var i2 = this.t - 1; i2 >= 0; --i2)
              r = (d * r + this[i2]) % n2;
        return r;
      }
      function bnModInverse(m) {
        var ac = m.isEven();
        if (this.isEven() && ac || m.signum() == 0)
          return BigInteger2.ZERO;
        var u = m.clone(), v = this.clone();
        var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
        while (u.signum() != 0) {
          while (u.isEven()) {
            u.rShiftTo(1, u);
            if (ac) {
              if (!a.isEven() || !b.isEven()) {
                a.addTo(this, a);
                b.subTo(m, b);
              }
              a.rShiftTo(1, a);
            } else if (!b.isEven())
              b.subTo(m, b);
            b.rShiftTo(1, b);
          }
          while (v.isEven()) {
            v.rShiftTo(1, v);
            if (ac) {
              if (!c.isEven() || !d.isEven()) {
                c.addTo(this, c);
                d.subTo(m, d);
              }
              c.rShiftTo(1, c);
            } else if (!d.isEven())
              d.subTo(m, d);
            d.rShiftTo(1, d);
          }
          if (u.compareTo(v) >= 0) {
            u.subTo(v, u);
            if (ac)
              a.subTo(c, a);
            b.subTo(d, b);
          } else {
            v.subTo(u, v);
            if (ac)
              c.subTo(a, c);
            d.subTo(b, d);
          }
        }
        if (v.compareTo(BigInteger2.ONE) != 0)
          return BigInteger2.ZERO;
        if (d.compareTo(m) >= 0)
          return d.subtract(m);
        if (d.signum() < 0)
          d.addTo(m, d);
        else
          return d;
        if (d.signum() < 0)
          return d.add(m);
        else
          return d;
      }
      var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
      var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
      function bnIsProbablePrime(t2) {
        var i2, x = this.abs();
        if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
          for (i2 = 0; i2 < lowprimes.length; ++i2)
            if (x[0] == lowprimes[i2])
              return true;
          return false;
        }
        if (x.isEven())
          return false;
        i2 = 1;
        while (i2 < lowprimes.length) {
          var m = lowprimes[i2], j = i2 + 1;
          while (j < lowprimes.length && m < lplim)
            m *= lowprimes[j++];
          m = x.modInt(m);
          while (i2 < j)
            if (m % lowprimes[i2++] == 0)
              return false;
        }
        return x.millerRabin(t2);
      }
      function bnpMillerRabin(t2) {
        var n1 = this.subtract(BigInteger2.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0)
          return false;
        var r = n1.shiftRight(k);
        t2 = t2 + 1 >> 1;
        if (t2 > lowprimes.length)
          t2 = lowprimes.length;
        var a = nbi();
        for (var i2 = 0; i2 < t2; ++i2) {
          a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
          var y = a.modPow(r, this);
          if (y.compareTo(BigInteger2.ONE) != 0 && y.compareTo(n1) != 0) {
            var j = 1;
            while (j++ < k && y.compareTo(n1) != 0) {
              y = y.modPowInt(2, this);
              if (y.compareTo(BigInteger2.ONE) == 0)
                return false;
            }
            if (y.compareTo(n1) != 0)
              return false;
          }
        }
        return true;
      }
      BigInteger2.prototype.chunkSize = bnpChunkSize;
      BigInteger2.prototype.toRadix = bnpToRadix;
      BigInteger2.prototype.fromRadix = bnpFromRadix;
      BigInteger2.prototype.fromNumber = bnpFromNumber;
      BigInteger2.prototype.bitwiseTo = bnpBitwiseTo;
      BigInteger2.prototype.changeBit = bnpChangeBit;
      BigInteger2.prototype.addTo = bnpAddTo;
      BigInteger2.prototype.dMultiply = bnpDMultiply;
      BigInteger2.prototype.dAddOffset = bnpDAddOffset;
      BigInteger2.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
      BigInteger2.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
      BigInteger2.prototype.modInt = bnpModInt;
      BigInteger2.prototype.millerRabin = bnpMillerRabin;
      BigInteger2.prototype.clone = bnClone;
      BigInteger2.prototype.intValue = bnIntValue;
      BigInteger2.prototype.byteValue = bnByteValue;
      BigInteger2.prototype.shortValue = bnShortValue;
      BigInteger2.prototype.signum = bnSigNum;
      BigInteger2.prototype.toByteArray = bnToByteArray;
      BigInteger2.prototype.equals = bnEquals;
      BigInteger2.prototype.min = bnMin;
      BigInteger2.prototype.max = bnMax;
      BigInteger2.prototype.and = bnAnd;
      BigInteger2.prototype.or = bnOr;
      BigInteger2.prototype.xor = bnXor;
      BigInteger2.prototype.andNot = bnAndNot;
      BigInteger2.prototype.not = bnNot;
      BigInteger2.prototype.shiftLeft = bnShiftLeft;
      BigInteger2.prototype.shiftRight = bnShiftRight;
      BigInteger2.prototype.getLowestSetBit = bnGetLowestSetBit;
      BigInteger2.prototype.bitCount = bnBitCount;
      BigInteger2.prototype.testBit = bnTestBit;
      BigInteger2.prototype.setBit = bnSetBit;
      BigInteger2.prototype.clearBit = bnClearBit;
      BigInteger2.prototype.flipBit = bnFlipBit;
      BigInteger2.prototype.add = bnAdd;
      BigInteger2.prototype.subtract = bnSubtract;
      BigInteger2.prototype.multiply = bnMultiply;
      BigInteger2.prototype.divide = bnDivide;
      BigInteger2.prototype.remainder = bnRemainder;
      BigInteger2.prototype.divideAndRemainder = bnDivideAndRemainder;
      BigInteger2.prototype.modPow = bnModPow;
      BigInteger2.prototype.modInverse = bnModInverse;
      BigInteger2.prototype.pow = bnPow;
      BigInteger2.prototype.gcd = bnGCD;
      BigInteger2.prototype.isProbablePrime = bnIsProbablePrime;
      BigInteger2.prototype.square = bnSquare;
      BigInteger2.prototype.Barrett = Barrett;
      var rng_state;
      var rng_pool;
      var rng_pptr;
      function rng_seed_int(x) {
        rng_pool[rng_pptr++] ^= x & 255;
        rng_pool[rng_pptr++] ^= x >> 8 & 255;
        rng_pool[rng_pptr++] ^= x >> 16 & 255;
        rng_pool[rng_pptr++] ^= x >> 24 & 255;
        if (rng_pptr >= rng_psize)
          rng_pptr -= rng_psize;
      }
      function rng_seed_time() {
        rng_seed_int(new Date().getTime());
      }
      if (rng_pool == null) {
        rng_pool = new Array();
        rng_pptr = 0;
        var t;
        if (typeof window !== "undefined" && $inject_window_crypto) {
          if ($inject_window_crypto.getRandomValues) {
            var ua = new Uint8Array(32);
            $inject_window_crypto.getRandomValues(ua);
            for (t = 0; t < 32; ++t)
              rng_pool[rng_pptr++] = ua[t];
          } else if (navigator.appName == "Netscape" && navigator.appVersion < "5") {
            var z = $inject_window_crypto.random(32);
            for (t = 0; t < z.length; ++t)
              rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
          }
        }
        while (rng_pptr < rng_psize) {
          t = Math.floor(65536 * Math.random());
          rng_pool[rng_pptr++] = t >>> 8;
          rng_pool[rng_pptr++] = t & 255;
        }
        rng_pptr = 0;
        rng_seed_time();
      }
      function rng_get_byte() {
        if (rng_state == null) {
          rng_seed_time();
          rng_state = prng_newstate();
          rng_state.init(rng_pool);
          for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
            rng_pool[rng_pptr] = 0;
          rng_pptr = 0;
        }
        return rng_state.next();
      }
      function rng_get_bytes(ba) {
        var i2;
        for (i2 = 0; i2 < ba.length; ++i2)
          ba[i2] = rng_get_byte();
      }
      function SecureRandom2() {
      }
      SecureRandom2.prototype.nextBytes = rng_get_bytes;
      function Arcfour() {
        this.i = 0;
        this.j = 0;
        this.S = new Array();
      }
      function ARC4init(key2) {
        var i2, j, t2;
        for (i2 = 0; i2 < 256; ++i2)
          this.S[i2] = i2;
        j = 0;
        for (i2 = 0; i2 < 256; ++i2) {
          j = j + this.S[i2] + key2[i2 % key2.length] & 255;
          t2 = this.S[i2];
          this.S[i2] = this.S[j];
          this.S[j] = t2;
        }
        this.i = 0;
        this.j = 0;
      }
      function ARC4next() {
        var t2;
        this.i = this.i + 1 & 255;
        this.j = this.j + this.S[this.i] & 255;
        t2 = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = t2;
        return this.S[t2 + this.S[this.i] & 255];
      }
      Arcfour.prototype.init = ARC4init;
      Arcfour.prototype.next = ARC4next;
      function prng_newstate() {
        return new Arcfour();
      }
      var rng_psize = 256;
      {
        module.exports = {
          default: BigInteger2,
          BigInteger: BigInteger2,
          SecureRandom: SecureRandom2
        };
      }
    }).call(commonjsGlobal);
  })(jsbn);
  const { BigInteger: BigInteger$3 } = jsbnExports;
  function bigintToValue(bigint) {
    let h = bigint.toString(16);
    if (h[0] !== "-") {
      if (h.length % 2 === 1)
        h = "0" + h;
      else if (!h.match(/^[0-7]/))
        h = "00" + h;
    } else {
      h = h.substr(1);
      let len2 = h.length;
      if (len2 % 2 === 1)
        len2 += 1;
      else if (!h.match(/^[0-7]/))
        len2 += 2;
      let mask = "";
      for (let i2 = 0; i2 < len2; i2++)
        mask += "f";
      mask = new BigInteger$3(mask, 16);
      h = mask.xor(bigint).add(BigInteger$3.ONE);
      h = h.toString(16).replace(/^-/, "");
    }
    return h;
  }
  class ASN1Object {
    constructor() {
      this.tlv = null;
      this.t = "00";
      this.l = "00";
      this.v = "";
    }
    /**
     * 获取 der 编码比特流16进制串
     */
    getEncodedHex() {
      if (!this.tlv) {
        this.v = this.getValue();
        this.l = this.getLength();
        this.tlv = this.t + this.l + this.v;
      }
      return this.tlv;
    }
    getLength() {
      const n2 = this.v.length / 2;
      let nHex = n2.toString(16);
      if (nHex.length % 2 === 1)
        nHex = "0" + nHex;
      if (n2 < 128) {
        return nHex;
      } else {
        const head = 128 + nHex.length / 2;
        return head.toString(16) + nHex;
      }
    }
    getValue() {
      return "";
    }
  }
  class DERInteger extends ASN1Object {
    constructor(bigint) {
      super();
      this.t = "02";
      if (bigint)
        this.v = bigintToValue(bigint);
    }
    getValue() {
      return this.v;
    }
  }
  class DERSequence extends ASN1Object {
    constructor(asn1Array) {
      super();
      this.t = "30";
      this.asn1Array = asn1Array;
    }
    getValue() {
      this.v = this.asn1Array.map((asn1Object) => asn1Object.getEncodedHex()).join("");
      return this.v;
    }
  }
  function getLenOfL(str, start) {
    if (+str[start + 2] < 8)
      return 1;
    return +str.substr(start + 2, 2) & 127 + 1;
  }
  function getL(str, start) {
    const len2 = getLenOfL(str, start);
    const l = str.substr(start + 2, len2 * 2);
    if (!l)
      return -1;
    const bigint = +l[0] < 8 ? new BigInteger$3(l, 16) : new BigInteger$3(l.substr(2), 16);
    return bigint.intValue();
  }
  function getStartOfV(str, start) {
    const len2 = getLenOfL(str, start);
    return start + (len2 + 1) * 2;
  }
  var asn1 = {
    /**
     * ASN.1 der 编码，针对 sm2 签名
     */
    encodeDer(r, s) {
      const derR = new DERInteger(r);
      const derS = new DERInteger(s);
      const derSeq = new DERSequence([derR, derS]);
      return derSeq.getEncodedHex();
    },
    /**
     * 解析 ASN.1 der，针对 sm2 验签
     */
    decodeDer(input) {
      const start = getStartOfV(input, 0);
      const vIndexR = getStartOfV(input, start);
      const lR = getL(input, start);
      const vR = input.substr(vIndexR, lR * 2);
      const nextStart = vIndexR + vR.length;
      const vIndexS = getStartOfV(input, nextStart);
      const lS = getL(input, nextStart);
      const vS = input.substr(vIndexS, lS * 2);
      const r = new BigInteger$3(vR, 16);
      const s = new BigInteger$3(vS, 16);
      return { r, s };
    }
  };
  const { BigInteger: BigInteger$2 } = jsbnExports;
  const TWO = new BigInteger$2("2");
  const THREE = new BigInteger$2("3");
  class ECFieldElementFp {
    constructor(q, x) {
      this.x = x;
      this.q = q;
    }
    /**
     * 判断相等
     */
    equals(other) {
      if (other === this)
        return true;
      return this.q.equals(other.q) && this.x.equals(other.x);
    }
    /**
     * 返回具体数值
     */
    toBigInteger() {
      return this.x;
    }
    /**
     * 取反
     */
    negate() {
      return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
    }
    /**
     * 相加
     */
    add(b) {
      return new ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q));
    }
    /**
     * 相减
     */
    subtract(b) {
      return new ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
    }
    /**
     * 相乘
     */
    multiply(b) {
      return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
    }
    /**
     * 相除
     */
    divide(b) {
      return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
    }
    /**
     * 平方
     */
    square() {
      return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
    }
  }
  class ECPointFp {
    constructor(curve2, x, y, z) {
      this.curve = curve2;
      this.x = x;
      this.y = y;
      this.z = z == null ? BigInteger$2.ONE : z;
      this.zinv = null;
    }
    getX() {
      if (this.zinv === null)
        this.zinv = this.z.modInverse(this.curve.q);
      return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    }
    getY() {
      if (this.zinv === null)
        this.zinv = this.z.modInverse(this.curve.q);
      return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    }
    /**
     * 判断相等
     */
    equals(other) {
      if (other === this)
        return true;
      if (this.isInfinity())
        return other.isInfinity();
      if (other.isInfinity())
        return this.isInfinity();
      const u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);
      if (!u.equals(BigInteger$2.ZERO))
        return false;
      const v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);
      return v.equals(BigInteger$2.ZERO);
    }
    /**
     * 是否是无穷远点
     */
    isInfinity() {
      if (this.x === null && this.y === null)
        return true;
      return this.z.equals(BigInteger$2.ZERO) && !this.y.toBigInteger().equals(BigInteger$2.ZERO);
    }
    /**
     * 取反，x 轴对称点
     */
    negate() {
      return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
    }
    /**
     * 相加
     *
     * 标准射影坐标系：
     *
     * λ1 = x1 * z2
     * λ2 = x2 * z1
     * λ3 = λ1 − λ2
     * λ4 = y1 * z2
     * λ5 = y2 * z1
     * λ6 = λ4 − λ5
     * λ7 = λ1 + λ2
     * λ8 = z1 * z2
     * λ9 = λ3^2
     * λ10 = λ3 * λ9
     * λ11 = λ8 * λ6^2 − λ7 * λ9
     * x3 = λ3 * λ11
     * y3 = λ6 * (λ9 * λ1 − λ11) − λ4 * λ10
     * z3 = λ10 * λ8
     */
    add(b) {
      if (this.isInfinity())
        return b;
      if (b.isInfinity())
        return this;
      const x1 = this.x.toBigInteger();
      const y1 = this.y.toBigInteger();
      const z1 = this.z;
      const x2 = b.x.toBigInteger();
      const y2 = b.y.toBigInteger();
      const z2 = b.z;
      const q = this.curve.q;
      const w1 = x1.multiply(z2).mod(q);
      const w2 = x2.multiply(z1).mod(q);
      const w3 = w1.subtract(w2);
      const w4 = y1.multiply(z2).mod(q);
      const w5 = y2.multiply(z1).mod(q);
      const w6 = w4.subtract(w5);
      if (BigInteger$2.ZERO.equals(w3)) {
        if (BigInteger$2.ZERO.equals(w6)) {
          return this.twice();
        }
        return this.curve.infinity;
      }
      const w7 = w1.add(w2);
      const w8 = z1.multiply(z2).mod(q);
      const w9 = w3.square().mod(q);
      const w10 = w3.multiply(w9).mod(q);
      const w11 = w8.multiply(w6.square()).subtract(w7.multiply(w9)).mod(q);
      const x3 = w3.multiply(w11).mod(q);
      const y3 = w6.multiply(w9.multiply(w1).subtract(w11)).subtract(w4.multiply(w10)).mod(q);
      const z3 = w10.multiply(w8).mod(q);
      return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
    }
    /**
     * 自加
     *
     * 标准射影坐标系：
     *
     * λ1 = 3 * x1^2 + a * z1^2
     * λ2 = 2 * y1 * z1
     * λ3 = y1^2
     * λ4 = λ3 * x1 * z1
     * λ5 = λ2^2
     * λ6 = λ1^2 − 8 * λ4
     * x3 = λ2 * λ6
     * y3 = λ1 * (4 * λ4 − λ6) − 2 * λ5 * λ3
     * z3 = λ2 * λ5
     */
    twice() {
      if (this.isInfinity())
        return this;
      if (!this.y.toBigInteger().signum())
        return this.curve.infinity;
      const x1 = this.x.toBigInteger();
      const y1 = this.y.toBigInteger();
      const z1 = this.z;
      const q = this.curve.q;
      const a = this.curve.a.toBigInteger();
      const w1 = x1.square().multiply(THREE).add(a.multiply(z1.square())).mod(q);
      const w2 = y1.shiftLeft(1).multiply(z1).mod(q);
      const w3 = y1.square().mod(q);
      const w4 = w3.multiply(x1).multiply(z1).mod(q);
      const w5 = w2.square().mod(q);
      const w6 = w1.square().subtract(w4.shiftLeft(3)).mod(q);
      const x3 = w2.multiply(w6).mod(q);
      const y3 = w1.multiply(w4.shiftLeft(2).subtract(w6)).subtract(w5.shiftLeft(1).multiply(w3)).mod(q);
      const z3 = w2.multiply(w5).mod(q);
      return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
    }
    /**
     * 倍点计算
     */
    multiply(k) {
      if (this.isInfinity())
        return this;
      if (!k.signum())
        return this.curve.infinity;
      const k3 = k.multiply(THREE);
      const neg = this.negate();
      let Q = this;
      for (let i2 = k3.bitLength() - 2; i2 > 0; i2--) {
        Q = Q.twice();
        const k3Bit = k3.testBit(i2);
        const kBit = k.testBit(i2);
        if (k3Bit !== kBit) {
          Q = Q.add(k3Bit ? this : neg);
        }
      }
      return Q;
    }
  }
  let ECCurveFp$1 = class ECCurveFp {
    constructor(q, a, b) {
      this.q = q;
      this.a = this.fromBigInteger(a);
      this.b = this.fromBigInteger(b);
      this.infinity = new ECPointFp(this, null, null);
    }
    /**
     * 判断两个椭圆曲线是否相等
     */
    equals(other) {
      if (other === this)
        return true;
      return this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b);
    }
    /**
     * 生成椭圆曲线域元素
     */
    fromBigInteger(x) {
      return new ECFieldElementFp(this.q, x);
    }
    /**
     * 解析 16 进制串为椭圆曲线点
     */
    decodePointHex(s) {
      switch (parseInt(s.substr(0, 2), 16)) {
        case 0:
          return this.infinity;
        case 2:
        case 3:
          const x = this.fromBigInteger(new BigInteger$2(s.substr(2), 16));
          let y = this.fromBigInteger(x.multiply(x.square()).add(
            x.multiply(this.a)
          ).add(this.b).toBigInteger().modPow(
            this.q.divide(new BigInteger$2("4")).add(BigInteger$2.ONE),
            this.q
          ));
          if (!y.toBigInteger().mod(TWO).equals(new BigInteger$2(s.substr(0, 2), 16).subtract(TWO))) {
            y = y.negate();
          }
          return new ECPointFp(this, x, y);
        case 4:
        case 6:
        case 7:
          const len2 = (s.length - 2) / 2;
          const xHex = s.substr(2, len2);
          const yHex = s.substr(len2 + 2, len2);
          return new ECPointFp(this, this.fromBigInteger(new BigInteger$2(xHex, 16)), this.fromBigInteger(new BigInteger$2(yHex, 16)));
        default:
          return null;
      }
    }
  };
  var ec = {
    ECPointFp,
    ECCurveFp: ECCurveFp$1
  };
  const { BigInteger: BigInteger$1, SecureRandom } = jsbnExports;
  const { ECCurveFp } = ec;
  const rng = new SecureRandom();
  const { curve: curve$1, G: G$1, n: n$1 } = generateEcparam();
  function getGlobalCurve() {
    return curve$1;
  }
  function generateEcparam() {
    const p = new BigInteger$1("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF", 16);
    const a = new BigInteger$1("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC", 16);
    const b = new BigInteger$1("28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93", 16);
    const curve2 = new ECCurveFp(p, a, b);
    const gxHex = "32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7";
    const gyHex = "BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0";
    const G2 = curve2.decodePointHex("04" + gxHex + gyHex);
    const n2 = new BigInteger$1("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123", 16);
    return { curve: curve2, G: G2, n: n2 };
  }
  function generateKeyPairHex(a, b, c) {
    const random2 = a ? new BigInteger$1(a, b, c) : new BigInteger$1(n$1.bitLength(), rng);
    const d = random2.mod(n$1.subtract(BigInteger$1.ONE)).add(BigInteger$1.ONE);
    const privateKey2 = leftPad$1(d.toString(16), 64);
    const P = G$1.multiply(d);
    const Px = leftPad$1(P.getX().toBigInteger().toString(16), 64);
    const Py = leftPad$1(P.getY().toBigInteger().toString(16), 64);
    const publicKey2 = "04" + Px + Py;
    return { privateKey: privateKey2, publicKey: publicKey2 };
  }
  function compressPublicKeyHex(s) {
    if (s.length !== 130)
      throw new Error("Invalid public key to compress");
    const len2 = (s.length - 2) / 2;
    const xHex = s.substr(2, len2);
    const y = new BigInteger$1(s.substr(len2 + 2, len2), 16);
    let prefix = "03";
    if (y.mod(new BigInteger$1("2")).equals(BigInteger$1.ZERO))
      prefix = "02";
    return prefix + xHex;
  }
  function utf8ToHex(input) {
    input = unescape(encodeURIComponent(input));
    const length = input.length;
    const words = [];
    for (let i2 = 0; i2 < length; i2++) {
      words[i2 >>> 2] |= (input.charCodeAt(i2) & 255) << 24 - i2 % 4 * 8;
    }
    const hexChars = [];
    for (let i2 = 0; i2 < length; i2++) {
      const bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
      hexChars.push((bite >>> 4).toString(16));
      hexChars.push((bite & 15).toString(16));
    }
    return hexChars.join("");
  }
  function leftPad$1(input, num) {
    if (input.length >= num)
      return input;
    return new Array(num - input.length + 1).join("0") + input;
  }
  function arrayToHex(arr) {
    return arr.map((item) => {
      item = item.toString(16);
      return item.length === 1 ? "0" + item : item;
    }).join("");
  }
  function arrayToUtf8$1(arr) {
    const words = [];
    let j = 0;
    for (let i2 = 0; i2 < arr.length * 2; i2 += 2) {
      words[i2 >>> 3] |= parseInt(arr[j], 10) << 24 - i2 % 8 * 4;
      j++;
    }
    try {
      const latin1Chars = [];
      for (let i2 = 0; i2 < arr.length; i2++) {
        const bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
        latin1Chars.push(String.fromCharCode(bite));
      }
      return decodeURIComponent(escape(latin1Chars.join("")));
    } catch (e) {
      throw new Error("Malformed UTF-8 data");
    }
  }
  function hexToArray$2(hexStr) {
    const words = [];
    let hexStrLength = hexStr.length;
    if (hexStrLength % 2 !== 0) {
      hexStr = leftPad$1(hexStr, hexStrLength + 1);
    }
    hexStrLength = hexStr.length;
    for (let i2 = 0; i2 < hexStrLength; i2 += 2) {
      words.push(parseInt(hexStr.substr(i2, 2), 16));
    }
    return words;
  }
  function verifyPublicKey(publicKey2) {
    const point = curve$1.decodePointHex(publicKey2);
    if (!point)
      return false;
    const x = point.getX();
    const y = point.getY();
    return y.square().equals(x.multiply(x.square()).add(x.multiply(curve$1.a)).add(curve$1.b));
  }
  function comparePublicKeyHex(publicKey1, publicKey2) {
    const point1 = curve$1.decodePointHex(publicKey1);
    if (!point1)
      return false;
    const point2 = curve$1.decodePointHex(publicKey2);
    if (!point2)
      return false;
    return point1.equals(point2);
  }
  var utils = {
    getGlobalCurve,
    generateEcparam,
    generateKeyPairHex,
    compressPublicKeyHex,
    utf8ToHex,
    leftPad: leftPad$1,
    arrayToHex,
    arrayToUtf8: arrayToUtf8$1,
    hexToArray: hexToArray$2,
    verifyPublicKey,
    comparePublicKeyHex
  };
  const W = new Uint32Array(68);
  const M = new Uint32Array(64);
  function rotl$1(x, n2) {
    const s = n2 & 31;
    return x << s | x >>> 32 - s;
  }
  function xor(x, y) {
    const result = [];
    for (let i2 = x.length - 1; i2 >= 0; i2--)
      result[i2] = (x[i2] ^ y[i2]) & 255;
    return result;
  }
  function P0(X) {
    return X ^ rotl$1(X, 9) ^ rotl$1(X, 17);
  }
  function P1(X) {
    return X ^ rotl$1(X, 15) ^ rotl$1(X, 23);
  }
  function sm3$3(array) {
    let len2 = array.length * 8;
    let k = len2 % 512;
    k = k >= 448 ? 512 - k % 448 - 1 : 448 - k - 1;
    const kArr = new Array((k - 7) / 8);
    const lenArr = new Array(8);
    for (let i2 = 0, len3 = kArr.length; i2 < len3; i2++)
      kArr[i2] = 0;
    for (let i2 = 0, len3 = lenArr.length; i2 < len3; i2++)
      lenArr[i2] = 0;
    len2 = len2.toString(2);
    for (let i2 = 7; i2 >= 0; i2--) {
      if (len2.length > 8) {
        const start = len2.length - 8;
        lenArr[i2] = parseInt(len2.substr(start), 2);
        len2 = len2.substr(0, start);
      } else if (len2.length > 0) {
        lenArr[i2] = parseInt(len2, 2);
        len2 = "";
      }
    }
    const m = new Uint8Array([...array, 128, ...kArr, ...lenArr]);
    const dataView = new DataView(m.buffer, 0);
    const n2 = m.length / 64;
    const V = new Uint32Array([1937774191, 1226093241, 388252375, 3666478592, 2842636476, 372324522, 3817729613, 2969243214]);
    for (let i2 = 0; i2 < n2; i2++) {
      W.fill(0);
      M.fill(0);
      const start = 16 * i2;
      for (let j = 0; j < 16; j++) {
        W[j] = dataView.getUint32((start + j) * 4, false);
      }
      for (let j = 16; j < 68; j++) {
        W[j] = P1(W[j - 16] ^ W[j - 9] ^ rotl$1(W[j - 3], 15)) ^ rotl$1(W[j - 13], 7) ^ W[j - 6];
      }
      for (let j = 0; j < 64; j++) {
        M[j] = W[j] ^ W[j + 4];
      }
      const T1 = 2043430169;
      const T2 = 2055708042;
      let A = V[0];
      let B = V[1];
      let C = V[2];
      let D = V[3];
      let E = V[4];
      let F = V[5];
      let G2 = V[6];
      let H = V[7];
      let SS1;
      let SS2;
      let TT1;
      let TT2;
      let T;
      for (let j = 0; j < 64; j++) {
        T = j >= 0 && j <= 15 ? T1 : T2;
        SS1 = rotl$1(rotl$1(A, 12) + E + rotl$1(T, j), 7);
        SS2 = SS1 ^ rotl$1(A, 12);
        TT1 = (j >= 0 && j <= 15 ? A ^ B ^ C : A & B | A & C | B & C) + D + SS2 + M[j];
        TT2 = (j >= 0 && j <= 15 ? E ^ F ^ G2 : E & F | ~E & G2) + H + SS1 + W[j];
        D = C;
        C = rotl$1(B, 9);
        B = A;
        A = TT1;
        H = G2;
        G2 = rotl$1(F, 19);
        F = E;
        E = P0(TT2);
      }
      V[0] ^= A;
      V[1] ^= B;
      V[2] ^= C;
      V[3] ^= D;
      V[4] ^= E;
      V[5] ^= F;
      V[6] ^= G2;
      V[7] ^= H;
    }
    const result = [];
    for (let i2 = 0, len3 = V.length; i2 < len3; i2++) {
      const word = V[i2];
      result.push((word & 4278190080) >>> 24, (word & 16711680) >>> 16, (word & 65280) >>> 8, word & 255);
    }
    return result;
  }
  const blockLen = 64;
  const iPad = new Uint8Array(blockLen);
  const oPad = new Uint8Array(blockLen);
  for (let i2 = 0; i2 < blockLen; i2++) {
    iPad[i2] = 54;
    oPad[i2] = 92;
  }
  function hmac$1(input, key2) {
    if (key2.length > blockLen)
      key2 = sm3$3(key2);
    while (key2.length < blockLen)
      key2.push(0);
    const iPadKey = xor(key2, iPad);
    const oPadKey = xor(key2, oPad);
    const hash = sm3$3([...iPadKey, ...input]);
    return sm3$3([...oPadKey, ...hash]);
  }
  var sm3_1$1 = {
    sm3: sm3$3,
    hmac: hmac$1
  };
  const { BigInteger } = jsbnExports;
  const { encodeDer, decodeDer } = asn1;
  const _ = utils;
  const sm3$2 = sm3_1$1.sm3;
  const { G, curve, n } = _.generateEcparam();
  const C1C2C3 = 0;
  function doEncrypt(msg, publicKey2, cipherMode2 = 1) {
    msg = typeof msg === "string" ? _.hexToArray(_.utf8ToHex(msg)) : Array.prototype.slice.call(msg);
    publicKey2 = _.getGlobalCurve().decodePointHex(publicKey2);
    const keypair = _.generateKeyPairHex();
    const k = new BigInteger(keypair.privateKey, 16);
    let c1 = keypair.publicKey;
    if (c1.length > 128)
      c1 = c1.substr(c1.length - 128);
    const p = publicKey2.multiply(k);
    const x2 = _.hexToArray(_.leftPad(p.getX().toBigInteger().toRadix(16), 64));
    const y2 = _.hexToArray(_.leftPad(p.getY().toBigInteger().toRadix(16), 64));
    const c3 = _.arrayToHex(sm3$2([].concat(x2, msg, y2)));
    let ct = 1;
    let offset = 0;
    let t = [];
    const z = [].concat(x2, y2);
    const nextT = () => {
      t = sm3$2([...z, ct >> 24 & 255, ct >> 16 & 255, ct >> 8 & 255, ct & 255]);
      ct++;
      offset = 0;
    };
    nextT();
    for (let i2 = 0, len2 = msg.length; i2 < len2; i2++) {
      if (offset === t.length)
        nextT();
      msg[i2] ^= t[offset++] & 255;
    }
    const c2 = _.arrayToHex(msg);
    return cipherMode2 === C1C2C3 ? c1 + c2 + c3 : c1 + c3 + c2;
  }
  function doDecrypt(encryptData, privateKey2, cipherMode2 = 1, {
    output = "string"
  } = {}) {
    privateKey2 = new BigInteger(privateKey2, 16);
    let c3 = encryptData.substr(128, 64);
    let c2 = encryptData.substr(128 + 64);
    if (cipherMode2 === C1C2C3) {
      c3 = encryptData.substr(encryptData.length - 64);
      c2 = encryptData.substr(128, encryptData.length - 128 - 64);
    }
    const msg = _.hexToArray(c2);
    const c1 = _.getGlobalCurve().decodePointHex("04" + encryptData.substr(0, 128));
    const p = c1.multiply(privateKey2);
    const x2 = _.hexToArray(_.leftPad(p.getX().toBigInteger().toRadix(16), 64));
    const y2 = _.hexToArray(_.leftPad(p.getY().toBigInteger().toRadix(16), 64));
    let ct = 1;
    let offset = 0;
    let t = [];
    const z = [].concat(x2, y2);
    const nextT = () => {
      t = sm3$2([...z, ct >> 24 & 255, ct >> 16 & 255, ct >> 8 & 255, ct & 255]);
      ct++;
      offset = 0;
    };
    nextT();
    for (let i2 = 0, len2 = msg.length; i2 < len2; i2++) {
      if (offset === t.length)
        nextT();
      msg[i2] ^= t[offset++] & 255;
    }
    const checkC3 = _.arrayToHex(sm3$2([].concat(x2, msg, y2)));
    if (checkC3 === c3.toLowerCase()) {
      return output === "array" ? msg : _.arrayToUtf8(msg);
    } else {
      return output === "array" ? [] : "";
    }
  }
  function doSignature(msg, privateKey2, {
    pointPool,
    der,
    hash,
    publicKey: publicKey2,
    userId
  } = {}) {
    let hashHex = typeof msg === "string" ? _.utf8ToHex(msg) : _.arrayToHex(msg);
    if (hash) {
      publicKey2 = publicKey2 || getPublicKeyFromPrivateKey(privateKey2);
      hashHex = getHash(hashHex, publicKey2, userId);
    }
    const dA = new BigInteger(privateKey2, 16);
    const e = new BigInteger(hashHex, 16);
    let k = null;
    let r = null;
    let s = null;
    do {
      do {
        let point;
        if (pointPool && pointPool.length) {
          point = pointPool.pop();
        } else {
          point = getPoint();
        }
        k = point.k;
        r = e.add(point.x1).mod(n);
      } while (r.equals(BigInteger.ZERO) || r.add(k).equals(n));
      s = dA.add(BigInteger.ONE).modInverse(n).multiply(k.subtract(r.multiply(dA))).mod(n);
    } while (s.equals(BigInteger.ZERO));
    if (der)
      return encodeDer(r, s);
    return _.leftPad(r.toString(16), 64) + _.leftPad(s.toString(16), 64);
  }
  function doVerifySignature(msg, signHex, publicKey2, { der, hash, userId } = {}) {
    let hashHex = typeof msg === "string" ? _.utf8ToHex(msg) : _.arrayToHex(msg);
    if (hash) {
      hashHex = getHash(hashHex, publicKey2, userId);
    }
    let r;
    let s;
    if (der) {
      const decodeDerObj = decodeDer(signHex);
      r = decodeDerObj.r;
      s = decodeDerObj.s;
    } else {
      r = new BigInteger(signHex.substring(0, 64), 16);
      s = new BigInteger(signHex.substring(64), 16);
    }
    const PA = curve.decodePointHex(publicKey2);
    const e = new BigInteger(hashHex, 16);
    const t = r.add(s).mod(n);
    if (t.equals(BigInteger.ZERO))
      return false;
    const x1y1 = G.multiply(s).add(PA.multiply(t));
    const R = e.add(x1y1.getX().toBigInteger()).mod(n);
    return r.equals(R);
  }
  function getHash(hashHex, publicKey2, userId = "1234567812345678") {
    userId = _.utf8ToHex(userId);
    const a = _.leftPad(G.curve.a.toBigInteger().toRadix(16), 64);
    const b = _.leftPad(G.curve.b.toBigInteger().toRadix(16), 64);
    const gx = _.leftPad(G.getX().toBigInteger().toRadix(16), 64);
    const gy = _.leftPad(G.getY().toBigInteger().toRadix(16), 64);
    let px;
    let py;
    if (publicKey2.length === 128) {
      px = publicKey2.substr(0, 64);
      py = publicKey2.substr(64, 64);
    } else {
      const point = G.curve.decodePointHex(publicKey2);
      px = _.leftPad(point.getX().toBigInteger().toRadix(16), 64);
      py = _.leftPad(point.getY().toBigInteger().toRadix(16), 64);
    }
    const data = _.hexToArray(userId + a + b + gx + gy + px + py);
    const entl = userId.length * 4;
    data.unshift(entl & 255);
    data.unshift(entl >> 8 & 255);
    const z = sm3$2(data);
    return _.arrayToHex(sm3$2(z.concat(_.hexToArray(hashHex))));
  }
  function getPublicKeyFromPrivateKey(privateKey2) {
    const PA = G.multiply(new BigInteger(privateKey2, 16));
    const x = _.leftPad(PA.getX().toBigInteger().toString(16), 64);
    const y = _.leftPad(PA.getY().toBigInteger().toString(16), 64);
    return "04" + x + y;
  }
  function getPoint() {
    const keypair = _.generateKeyPairHex();
    const PA = curve.decodePointHex(keypair.publicKey);
    keypair.k = new BigInteger(keypair.privateKey, 16);
    keypair.x1 = PA.getX().toBigInteger();
    return keypair;
  }
  var sm2$1 = {
    generateKeyPairHex: _.generateKeyPairHex,
    compressPublicKeyHex: _.compressPublicKeyHex,
    comparePublicKeyHex: _.comparePublicKeyHex,
    doEncrypt,
    doDecrypt,
    doSignature,
    doVerifySignature,
    getPoint,
    verifyPublicKey: _.verifyPublicKey
  };
  const { sm3: sm3$1, hmac } = sm3_1$1;
  function leftPad(input, num) {
    if (input.length >= num)
      return input;
    return new Array(num - input.length + 1).join("0") + input;
  }
  function ArrayToHex$1(arr) {
    return arr.map((item) => {
      item = item.toString(16);
      return item.length === 1 ? "0" + item : item;
    }).join("");
  }
  function hexToArray$1(hexStr) {
    const words = [];
    let hexStrLength = hexStr.length;
    if (hexStrLength % 2 !== 0) {
      hexStr = leftPad(hexStr, hexStrLength + 1);
    }
    hexStrLength = hexStr.length;
    for (let i2 = 0; i2 < hexStrLength; i2 += 2) {
      words.push(parseInt(hexStr.substr(i2, 2), 16));
    }
    return words;
  }
  function utf8ToArray$1(str) {
    const arr = [];
    for (let i2 = 0, len2 = str.length; i2 < len2; i2++) {
      const point = str.codePointAt(i2);
      if (point <= 127) {
        arr.push(point);
      } else if (point <= 2047) {
        arr.push(192 | point >>> 6);
        arr.push(128 | point & 63);
      } else if (point <= 55295 || point >= 57344 && point <= 65535) {
        arr.push(224 | point >>> 12);
        arr.push(128 | point >>> 6 & 63);
        arr.push(128 | point & 63);
      } else if (point >= 65536 && point <= 1114111) {
        i2++;
        arr.push(240 | point >>> 18 & 28);
        arr.push(128 | point >>> 12 & 63);
        arr.push(128 | point >>> 6 & 63);
        arr.push(128 | point & 63);
      } else {
        arr.push(point);
        throw new Error("input is not supported");
      }
    }
    return arr;
  }
  var sm3_1 = function(input, options) {
    input = typeof input === "string" ? utf8ToArray$1(input) : Array.prototype.slice.call(input);
    if (options) {
      const mode = options.mode || "hmac";
      if (mode !== "hmac")
        throw new Error("invalid mode");
      let key2 = options.key;
      if (!key2)
        throw new Error("invalid key");
      key2 = typeof key2 === "string" ? hexToArray$1(key2) : Array.prototype.slice.call(key2);
      return ArrayToHex$1(hmac(input, key2));
    }
    return ArrayToHex$1(sm3$1(input));
  };
  const DECRYPT = 0;
  const ROUND = 32;
  const BLOCK = 16;
  const Sbox = [
    214,
    144,
    233,
    254,
    204,
    225,
    61,
    183,
    22,
    182,
    20,
    194,
    40,
    251,
    44,
    5,
    43,
    103,
    154,
    118,
    42,
    190,
    4,
    195,
    170,
    68,
    19,
    38,
    73,
    134,
    6,
    153,
    156,
    66,
    80,
    244,
    145,
    239,
    152,
    122,
    51,
    84,
    11,
    67,
    237,
    207,
    172,
    98,
    228,
    179,
    28,
    169,
    201,
    8,
    232,
    149,
    128,
    223,
    148,
    250,
    117,
    143,
    63,
    166,
    71,
    7,
    167,
    252,
    243,
    115,
    23,
    186,
    131,
    89,
    60,
    25,
    230,
    133,
    79,
    168,
    104,
    107,
    129,
    178,
    113,
    100,
    218,
    139,
    248,
    235,
    15,
    75,
    112,
    86,
    157,
    53,
    30,
    36,
    14,
    94,
    99,
    88,
    209,
    162,
    37,
    34,
    124,
    59,
    1,
    33,
    120,
    135,
    212,
    0,
    70,
    87,
    159,
    211,
    39,
    82,
    76,
    54,
    2,
    231,
    160,
    196,
    200,
    158,
    234,
    191,
    138,
    210,
    64,
    199,
    56,
    181,
    163,
    247,
    242,
    206,
    249,
    97,
    21,
    161,
    224,
    174,
    93,
    164,
    155,
    52,
    26,
    85,
    173,
    147,
    50,
    48,
    245,
    140,
    177,
    227,
    29,
    246,
    226,
    46,
    130,
    102,
    202,
    96,
    192,
    41,
    35,
    171,
    13,
    83,
    78,
    111,
    213,
    219,
    55,
    69,
    222,
    253,
    142,
    47,
    3,
    255,
    106,
    114,
    109,
    108,
    91,
    81,
    141,
    27,
    175,
    146,
    187,
    221,
    188,
    127,
    17,
    217,
    92,
    65,
    31,
    16,
    90,
    216,
    10,
    193,
    49,
    136,
    165,
    205,
    123,
    189,
    45,
    116,
    208,
    18,
    184,
    229,
    180,
    176,
    137,
    105,
    151,
    74,
    12,
    150,
    119,
    126,
    101,
    185,
    241,
    9,
    197,
    110,
    198,
    132,
    24,
    240,
    125,
    236,
    58,
    220,
    77,
    32,
    121,
    238,
    95,
    62,
    215,
    203,
    57,
    72
  ];
  const CK = [
    462357,
    472066609,
    943670861,
    1415275113,
    1886879365,
    2358483617,
    2830087869,
    3301692121,
    3773296373,
    4228057617,
    404694573,
    876298825,
    1347903077,
    1819507329,
    2291111581,
    2762715833,
    3234320085,
    3705924337,
    4177462797,
    337322537,
    808926789,
    1280531041,
    1752135293,
    2223739545,
    2695343797,
    3166948049,
    3638552301,
    4110090761,
    269950501,
    741554753,
    1213159005,
    1684763257
  ];
  function hexToArray(str) {
    const arr = [];
    for (let i2 = 0, len2 = str.length; i2 < len2; i2 += 2) {
      arr.push(parseInt(str.substr(i2, 2), 16));
    }
    return arr;
  }
  function ArrayToHex(arr) {
    return arr.map((item) => {
      item = item.toString(16);
      return item.length === 1 ? "0" + item : item;
    }).join("");
  }
  function utf8ToArray(str) {
    const arr = [];
    for (let i2 = 0, len2 = str.length; i2 < len2; i2++) {
      const point = str.codePointAt(i2);
      if (point <= 127) {
        arr.push(point);
      } else if (point <= 2047) {
        arr.push(192 | point >>> 6);
        arr.push(128 | point & 63);
      } else if (point <= 55295 || point >= 57344 && point <= 65535) {
        arr.push(224 | point >>> 12);
        arr.push(128 | point >>> 6 & 63);
        arr.push(128 | point & 63);
      } else if (point >= 65536 && point <= 1114111) {
        i2++;
        arr.push(240 | point >>> 18 & 28);
        arr.push(128 | point >>> 12 & 63);
        arr.push(128 | point >>> 6 & 63);
        arr.push(128 | point & 63);
      } else {
        arr.push(point);
        throw new Error("input is not supported");
      }
    }
    return arr;
  }
  function arrayToUtf8(arr) {
    const str = [];
    for (let i2 = 0, len2 = arr.length; i2 < len2; i2++) {
      if (arr[i2] >= 240 && arr[i2] <= 247) {
        str.push(String.fromCodePoint(((arr[i2] & 7) << 18) + ((arr[i2 + 1] & 63) << 12) + ((arr[i2 + 2] & 63) << 6) + (arr[i2 + 3] & 63)));
        i2 += 3;
      } else if (arr[i2] >= 224 && arr[i2] <= 239) {
        str.push(String.fromCodePoint(((arr[i2] & 15) << 12) + ((arr[i2 + 1] & 63) << 6) + (arr[i2 + 2] & 63)));
        i2 += 2;
      } else if (arr[i2] >= 192 && arr[i2] <= 223) {
        str.push(String.fromCodePoint(((arr[i2] & 31) << 6) + (arr[i2 + 1] & 63)));
        i2++;
      } else {
        str.push(String.fromCodePoint(arr[i2]));
      }
    }
    return str.join("");
  }
  function rotl(x, y) {
    return x << y | x >>> 32 - y;
  }
  function byteSub(a) {
    return (Sbox[a >>> 24 & 255] & 255) << 24 | (Sbox[a >>> 16 & 255] & 255) << 16 | (Sbox[a >>> 8 & 255] & 255) << 8 | Sbox[a & 255] & 255;
  }
  function l1(b) {
    return b ^ rotl(b, 2) ^ rotl(b, 10) ^ rotl(b, 18) ^ rotl(b, 24);
  }
  function l2(b) {
    return b ^ rotl(b, 13) ^ rotl(b, 23);
  }
  function sms4Crypt(input, output, roundKey) {
    const x = new Array(4);
    const tmp = new Array(4);
    for (let i2 = 0; i2 < 4; i2++) {
      tmp[0] = input[4 * i2] & 255;
      tmp[1] = input[4 * i2 + 1] & 255;
      tmp[2] = input[4 * i2 + 2] & 255;
      tmp[3] = input[4 * i2 + 3] & 255;
      x[i2] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
    }
    for (let r = 0, mid; r < 32; r += 4) {
      mid = x[1] ^ x[2] ^ x[3] ^ roundKey[r + 0];
      x[0] ^= l1(byteSub(mid));
      mid = x[2] ^ x[3] ^ x[0] ^ roundKey[r + 1];
      x[1] ^= l1(byteSub(mid));
      mid = x[3] ^ x[0] ^ x[1] ^ roundKey[r + 2];
      x[2] ^= l1(byteSub(mid));
      mid = x[0] ^ x[1] ^ x[2] ^ roundKey[r + 3];
      x[3] ^= l1(byteSub(mid));
    }
    for (let j = 0; j < 16; j += 4) {
      output[j] = x[3 - j / 4] >>> 24 & 255;
      output[j + 1] = x[3 - j / 4] >>> 16 & 255;
      output[j + 2] = x[3 - j / 4] >>> 8 & 255;
      output[j + 3] = x[3 - j / 4] & 255;
    }
  }
  function sms4KeyExt(key2, roundKey, cryptFlag) {
    const x = new Array(4);
    const tmp = new Array(4);
    for (let i2 = 0; i2 < 4; i2++) {
      tmp[0] = key2[0 + 4 * i2] & 255;
      tmp[1] = key2[1 + 4 * i2] & 255;
      tmp[2] = key2[2 + 4 * i2] & 255;
      tmp[3] = key2[3 + 4 * i2] & 255;
      x[i2] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
    }
    x[0] ^= 2746333894;
    x[1] ^= 1453994832;
    x[2] ^= 1736282519;
    x[3] ^= 2993693404;
    for (let r = 0, mid; r < 32; r += 4) {
      mid = x[1] ^ x[2] ^ x[3] ^ CK[r + 0];
      roundKey[r + 0] = x[0] ^= l2(byteSub(mid));
      mid = x[2] ^ x[3] ^ x[0] ^ CK[r + 1];
      roundKey[r + 1] = x[1] ^= l2(byteSub(mid));
      mid = x[3] ^ x[0] ^ x[1] ^ CK[r + 2];
      roundKey[r + 2] = x[2] ^= l2(byteSub(mid));
      mid = x[0] ^ x[1] ^ x[2] ^ CK[r + 3];
      roundKey[r + 3] = x[3] ^= l2(byteSub(mid));
    }
    if (cryptFlag === DECRYPT) {
      for (let r = 0, mid; r < 16; r++) {
        mid = roundKey[r];
        roundKey[r] = roundKey[31 - r];
        roundKey[31 - r] = mid;
      }
    }
  }
  function sm4$1(inArray, key2, cryptFlag, {
    padding = "pkcs#7",
    mode,
    iv = [],
    output = "string"
  } = {}) {
    if (mode === "cbc") {
      if (typeof iv === "string")
        iv = hexToArray(iv);
      if (iv.length !== 128 / 8) {
        throw new Error("iv is invalid");
      }
    }
    if (typeof key2 === "string")
      key2 = hexToArray(key2);
    if (key2.length !== 128 / 8) {
      throw new Error("key is invalid");
    }
    if (typeof inArray === "string") {
      if (cryptFlag !== DECRYPT) {
        inArray = utf8ToArray(inArray);
      } else {
        inArray = hexToArray(inArray);
      }
    } else {
      inArray = [...inArray];
    }
    if ((padding === "pkcs#5" || padding === "pkcs#7") && cryptFlag !== DECRYPT) {
      const paddingCount = BLOCK - inArray.length % BLOCK;
      for (let i2 = 0; i2 < paddingCount; i2++)
        inArray.push(paddingCount);
    }
    const roundKey = new Array(ROUND);
    sms4KeyExt(key2, roundKey, cryptFlag);
    const outArray = [];
    let lastVector = iv;
    let restLen = inArray.length;
    let point = 0;
    while (restLen >= BLOCK) {
      const input = inArray.slice(point, point + 16);
      const output2 = new Array(16);
      if (mode === "cbc") {
        for (let i2 = 0; i2 < BLOCK; i2++) {
          if (cryptFlag !== DECRYPT) {
            input[i2] ^= lastVector[i2];
          }
        }
      }
      sms4Crypt(input, output2, roundKey);
      for (let i2 = 0; i2 < BLOCK; i2++) {
        if (mode === "cbc") {
          if (cryptFlag === DECRYPT) {
            output2[i2] ^= lastVector[i2];
          }
        }
        outArray[point + i2] = output2[i2];
      }
      if (mode === "cbc") {
        if (cryptFlag !== DECRYPT) {
          lastVector = output2;
        } else {
          lastVector = input;
        }
      }
      restLen -= BLOCK;
      point += BLOCK;
    }
    if ((padding === "pkcs#5" || padding === "pkcs#7") && cryptFlag === DECRYPT) {
      const len2 = outArray.length;
      const paddingCount = outArray[len2 - 1];
      for (let i2 = 1; i2 <= paddingCount; i2++) {
        if (outArray[len2 - i2] !== paddingCount)
          throw new Error("padding is invalid");
      }
      outArray.splice(len2 - paddingCount, paddingCount);
    }
    if (output !== "array") {
      if (cryptFlag !== DECRYPT) {
        return ArrayToHex(outArray);
      } else {
        return arrayToUtf8(outArray);
      }
    } else {
      return outArray;
    }
  }
  var sm4_1 = {
    encrypt(inArray, key2, options) {
      return sm4$1(inArray, key2, 1, options);
    },
    decrypt(inArray, key2, options) {
      return sm4$1(inArray, key2, 0, options);
    }
  };
  var src = {
    sm2: sm2$1,
    sm3: sm3_1,
    sm4: sm4_1
  };
  const sm2 = src.sm2;
  const sm3 = src.sm3;
  const sm4 = src.sm4;
  const cipherMode = 1;
  const publicKey = "04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54";
  const privateKey = "3037723d47292171677ec8bd7dc9af696c7472bc5f251b2cec07e65fdef22e25";
  const key = "0123456789abcdeffedcba9876543210";
  const smCrypto = {
    // SM2加密
    doSm2Encrypt(msgString) {
      return sm2.doEncrypt(msgString, publicKey, cipherMode);
    },
    // SM2解密
    doSm2Decrypt(encryptData) {
      return sm2.doDecrypt(encryptData, privateKey, cipherMode);
    },
    // SM2数组加密
    doSm2ArrayEncrypt(msgString) {
      return sm2.doEncrypt(msgString, publicKey, cipherMode);
    },
    // SM2数组解密
    doSm2ArrayDecrypt(encryptData) {
      return sm2.doDecrypt(encryptData, privateKey, cipherMode, { output: "array" });
    },
    // SM3哈希
    doSm3Hash(msgString) {
      return sm3(msgString);
    },
    // SM4 加密
    doSm4Encrypt(msgString) {
      return sm4.encrypt(msgString, key);
    },
    // SM4 CBC加密
    doSm4CbcEncrypt(msgString) {
      return sm4.encrypt(msgString, key, { mode: "cbc", iv: "fedcba98765432100123456789abcdef" });
    },
    // SM4 解密
    doSm4Decrypt(encryptData) {
      return sm4.decrypt(encryptData, key);
    },
    // SM4 CBC解密
    doSm4CbcDecrypt(encryptData) {
      return sm4.decrypt(encryptData, key, { mode: "cbc", iv: "fedcba98765432100123456789abcdef" });
    }
  };
  function userLoginMobileMenu() {
    return request$1({
      url: "/sys/userCenter/loginMobileMenu",
      method: "get"
    });
  }
  var setupDefaults$a = {
    cookies: {
      path: "/"
    },
    treeOptions: {
      parentKey: "parentId",
      key: "id",
      children: "children"
    },
    parseDateFormat: "yyyy-MM-dd HH:mm:ss",
    firstDayOfWeek: 1,
    dateDiffRules: [
      ["yyyy", 31536e6],
      ["MM", 2592e6],
      ["dd", 864e5],
      ["HH", 36e5],
      ["mm", 6e4],
      ["ss", 1e3],
      ["S", 0]
    ]
  };
  var setupDefaults_1 = setupDefaults$a;
  function arrayEach$e(list2, iterate, context) {
    if (list2) {
      if (list2.forEach) {
        list2.forEach(iterate, context);
      } else {
        for (var index = 0, len2 = list2.length; index < len2; index++) {
          iterate.call(context, list2[index], index, list2);
        }
      }
    }
  }
  var arrayEach_1 = arrayEach$e;
  var objectToString$2 = Object.prototype.toString;
  var staticObjectToString = objectToString$2;
  var objectToString$1 = staticObjectToString;
  function helperCreateInInObjectString$5(type) {
    return function(obj) {
      return "[object " + type + "]" === objectToString$1.call(obj);
    };
  }
  var helperCreateInInObjectString_1 = helperCreateInInObjectString$5;
  var helperCreateInInObjectString$4 = helperCreateInInObjectString_1;
  var isArray$r = Array.isArray || helperCreateInInObjectString$4("Array");
  var isArray_1 = isArray$r;
  function hasOwnProp$a(obj, key2) {
    return obj && obj.hasOwnProperty ? obj.hasOwnProperty(key2) : false;
  }
  var hasOwnProp_1 = hasOwnProp$a;
  var hasOwnProp$9 = hasOwnProp_1;
  function objectEach$5(obj, iterate, context) {
    if (obj) {
      for (var key2 in obj) {
        if (hasOwnProp$9(obj, key2)) {
          iterate.call(context, obj[key2], key2, obj);
        }
      }
    }
  }
  var objectEach_1 = objectEach$5;
  var isArray$q = isArray_1;
  var arrayEach$d = arrayEach_1;
  var objectEach$4 = objectEach_1;
  function each$j(obj, iterate, context) {
    if (obj) {
      return (isArray$q(obj) ? arrayEach$d : objectEach$4)(obj, iterate, context);
    }
    return obj;
  }
  var each_1 = each$j;
  function helperCreateInTypeof$6(type) {
    return function(obj) {
      return typeof obj === type;
    };
  }
  var helperCreateInTypeof_1 = helperCreateInTypeof$6;
  var helperCreateInTypeof$5 = helperCreateInTypeof_1;
  var isFunction$c = helperCreateInTypeof$5("function");
  var isFunction_1 = isFunction$c;
  var each$i = each_1;
  function helperCreateGetObjects$3(name, getIndex) {
    var proMethod = Object[name];
    return function(obj) {
      var result = [];
      if (obj) {
        if (proMethod) {
          return proMethod(obj);
        }
        each$i(obj, getIndex > 1 ? function(key2) {
          result.push(["" + key2, obj[key2]]);
        } : function() {
          result.push(arguments[getIndex]);
        });
      }
      return result;
    };
  }
  var helperCreateGetObjects_1 = helperCreateGetObjects$3;
  var helperCreateGetObjects$2 = helperCreateGetObjects_1;
  var keys$a = helperCreateGetObjects$2("keys", 1);
  var keys_1 = keys$a;
  var objectToString = staticObjectToString;
  var objectEach$3 = objectEach_1;
  var arrayEach$c = arrayEach_1;
  function getCativeCtor(val, args) {
    var Ctor = val.__proto__.constructor;
    return args ? new Ctor(args) : new Ctor();
  }
  function handleValueClone(item, isDeep) {
    return isDeep ? copyValue(item, isDeep) : item;
  }
  function copyValue(val, isDeep) {
    if (val) {
      switch (objectToString.call(val)) {
        case "[object Object]": {
          var restObj = Object.create(val.__proto__);
          objectEach$3(val, function(item, key2) {
            restObj[key2] = handleValueClone(item, isDeep);
          });
          return restObj;
        }
        case "[object Date]":
        case "[object RegExp]": {
          return getCativeCtor(val, val.valueOf());
        }
        case "[object Array]":
        case "[object Arguments]": {
          var restArr = [];
          arrayEach$c(val, function(item) {
            restArr.push(handleValueClone(item, isDeep));
          });
          return restArr;
        }
        case "[object Set]": {
          var restSet = getCativeCtor(val);
          restSet.forEach(function(item) {
            restSet.add(handleValueClone(item, isDeep));
          });
          return restSet;
        }
        case "[object Map]": {
          var restMap = getCativeCtor(val);
          restMap.forEach(function(item, key2) {
            restMap.set(handleValueClone(item, isDeep));
          });
          return restMap;
        }
      }
    }
    return val;
  }
  function clone$3(obj, deep) {
    if (obj) {
      return copyValue(obj, deep);
    }
    return obj;
  }
  var clone_1 = clone$3;
  var arrayEach$b = arrayEach_1;
  var keys$9 = keys_1;
  var isArray$p = isArray_1;
  var clone$2 = clone_1;
  var objectAssignFns = Object.assign;
  function handleAssign(destination, args, isClone) {
    var len2 = args.length;
    for (var source, index = 1; index < len2; index++) {
      source = args[index];
      arrayEach$b(keys$9(args[index]), isClone ? function(key2) {
        destination[key2] = clone$2(source[key2], isClone);
      } : function(key2) {
        destination[key2] = source[key2];
      });
    }
    return destination;
  }
  var assign$b = function(target) {
    if (target) {
      var args = arguments;
      if (target === true) {
        if (args.length > 1) {
          target = isArray$p(target[1]) ? [] : {};
          return handleAssign(target, args, true);
        }
      } else {
        return objectAssignFns ? objectAssignFns.apply(Object, args) : handleAssign(target, args);
      }
    }
    return target;
  };
  var assign_1 = assign$b;
  var setupDefaults$9 = setupDefaults_1;
  var arrayEach$a = arrayEach_1;
  var each$h = each_1;
  var isFunction$b = isFunction_1;
  var assign$a = assign_1;
  var XEUtils$1 = function() {
  };
  function mixin() {
    arrayEach$a(arguments, function(methods) {
      each$h(methods, function(fn, name) {
        XEUtils$1[name] = isFunction$b(fn) ? function() {
          var result = fn.apply(XEUtils$1.$context, arguments);
          XEUtils$1.$context = null;
          return result;
        } : fn;
      });
    });
  }
  function setup(options) {
    return assign$a(setupDefaults$9, options);
  }
  XEUtils$1.VERSION = "3.5.7";
  XEUtils$1.mixin = mixin;
  XEUtils$1.setup = setup;
  var ctor = XEUtils$1;
  function lastArrayEach$3(obj, iterate, context) {
    for (var len2 = obj.length - 1; len2 >= 0; len2--) {
      iterate.call(context, obj[len2], len2, obj);
    }
  }
  var lastArrayEach_1 = lastArrayEach$3;
  var lastArrayEach$2 = lastArrayEach_1;
  var keys$8 = keys_1;
  function lastObjectEach$2(obj, iterate, context) {
    lastArrayEach$2(keys$8(obj), function(key2) {
      iterate.call(context, obj[key2], key2, obj);
    });
  }
  var lastObjectEach_1 = lastObjectEach$2;
  function isNull$9(obj) {
    return obj === null;
  }
  var isNull_1 = isNull$9;
  var isNull$8 = isNull_1;
  function property$5(name, defs) {
    return function(obj) {
      return isNull$8(obj) ? defs : obj[name];
    };
  }
  var property_1 = property$5;
  var each$g = each_1;
  var isFunction$a = isFunction_1;
  var property$4 = property_1;
  function objectMap$1(obj, iterate, context) {
    var result = {};
    if (obj) {
      if (iterate) {
        if (!isFunction$a(iterate)) {
          iterate = property$4(iterate);
        }
        each$g(obj, function(val, index) {
          result[index] = iterate.call(context, val, index, obj);
        });
      } else {
        return obj;
      }
    }
    return result;
  }
  var objectMap_1 = objectMap$1;
  function isPlainObject$6(obj) {
    return obj ? obj.constructor === Object : false;
  }
  var isPlainObject_1 = isPlainObject$6;
  var isArray$o = isArray_1;
  var isPlainObject$5 = isPlainObject_1;
  var each$f = each_1;
  function handleMerge(target, source) {
    if (isPlainObject$5(target) && isPlainObject$5(source) || isArray$o(target) && isArray$o(source)) {
      each$f(source, function(obj, key2) {
        target[key2] = handleMerge(target[key2], obj);
      });
      return target;
    }
    return source;
  }
  var merge$1 = function(target) {
    if (!target) {
      target = {};
    }
    var args = arguments;
    var len2 = args.length;
    for (var source, index = 1; index < len2; index++) {
      source = args[index];
      if (source) {
        handleMerge(target, source);
      }
    }
    return target;
  };
  var merge_1 = merge$1;
  var each$e = each_1;
  function map$6(obj, iterate, context) {
    var result = [];
    if (obj && arguments.length > 1) {
      if (obj.map) {
        return obj.map(iterate, context);
      } else {
        each$e(obj, function() {
          result.push(iterate.apply(context, arguments));
        });
      }
    }
    return result;
  }
  var map_1 = map$6;
  var hasOwnProp$8 = hasOwnProp_1;
  var isArray$n = isArray_1;
  function helperCreateIterateHandle$4(prop, useArray, restIndex, matchValue, defaultValue) {
    return function(obj, iterate, context) {
      if (obj && iterate) {
        if (prop && obj[prop]) {
          return obj[prop](iterate, context);
        } else {
          if (useArray && isArray$n(obj)) {
            for (var index = 0, len2 = obj.length; index < len2; index++) {
              if (!!iterate.call(context, obj[index], index, obj) === matchValue) {
                return [true, false, index, obj[index]][restIndex];
              }
            }
          } else {
            for (var key2 in obj) {
              if (hasOwnProp$8(obj, key2)) {
                if (!!iterate.call(context, obj[key2], key2, obj) === matchValue) {
                  return [true, false, key2, obj[key2]][restIndex];
                }
              }
            }
          }
        }
      }
      return defaultValue;
    };
  }
  var helperCreateIterateHandle_1 = helperCreateIterateHandle$4;
  var helperCreateIterateHandle$3 = helperCreateIterateHandle_1;
  var some$2 = helperCreateIterateHandle$3("some", 1, 0, true, false);
  var some_1 = some$2;
  var helperCreateIterateHandle$2 = helperCreateIterateHandle_1;
  var every$2 = helperCreateIterateHandle$2("every", 1, 1, false, true);
  var every_1 = every$2;
  var hasOwnProp$7 = hasOwnProp_1;
  function includes$5(obj, val) {
    if (obj) {
      if (obj.includes) {
        return obj.includes(val);
      }
      for (var key2 in obj) {
        if (hasOwnProp$7(obj, key2)) {
          if (val === obj[key2]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  var includes_1 = includes$5;
  var isArray$m = isArray_1;
  var includes$4 = includes_1;
  function includeArrays$2(array1, array2) {
    var len2;
    var index = 0;
    if (isArray$m(array1) && isArray$m(array2)) {
      for (len2 = array2.length; index < len2; index++) {
        if (!includes$4(array1, array2[index])) {
          return false;
        }
      }
      return true;
    }
    return includes$4(array1, array2);
  }
  var includeArrays_1 = includeArrays$2;
  var each$d = each_1;
  var includes$3 = includes_1;
  function uniq$2(array) {
    var result = [];
    each$d(array, function(value) {
      if (!includes$3(result, value)) {
        result.push(value);
      }
    });
    return result;
  }
  var uniq_1 = uniq$2;
  var map$5 = map_1;
  function toArray$3(list2) {
    return map$5(list2, function(item) {
      return item;
    });
  }
  var toArray_1 = toArray$3;
  var uniq$1 = uniq_1;
  var toArray$2 = toArray_1;
  function union$1() {
    var args = arguments;
    var result = [];
    var index = 0;
    var len2 = args.length;
    for (; index < len2; index++) {
      result = result.concat(toArray$2(args[index]));
    }
    return uniq$1(result);
  }
  var union_1 = union$1;
  var staticStrUndefined$b = "undefined";
  var staticStrUndefined_1 = staticStrUndefined$b;
  var staticStrUndefined$a = staticStrUndefined_1;
  var helperCreateInTypeof$4 = helperCreateInTypeof_1;
  var isUndefined$a = helperCreateInTypeof$4(staticStrUndefined$a);
  var isUndefined_1 = isUndefined$a;
  var isNull$7 = isNull_1;
  var isUndefined$9 = isUndefined_1;
  function eqNull$7(obj) {
    return isNull$7(obj) || isUndefined$9(obj);
  }
  var eqNull_1 = eqNull$7;
  var staticHGKeyRE$2 = /(.+)?\[(\d+)\]$/;
  var staticHGKeyRE_1 = staticHGKeyRE$2;
  function helperGetHGSKeys$3(property2) {
    return property2 ? property2.splice && property2.join ? property2 : ("" + property2).replace(/(\[\d+\])\.?/g, "$1.").replace(/\.$/, "").split(".") : [];
  }
  var helperGetHGSKeys_1 = helperGetHGSKeys$3;
  var staticHGKeyRE$1 = staticHGKeyRE_1;
  var helperGetHGSKeys$2 = helperGetHGSKeys_1;
  var hasOwnProp$6 = hasOwnProp_1;
  var isUndefined$8 = isUndefined_1;
  var eqNull$6 = eqNull_1;
  function get$5(obj, property2, defaultValue) {
    if (eqNull$6(obj)) {
      return defaultValue;
    }
    var result = getValueByPath(obj, property2);
    return isUndefined$8(result) ? defaultValue : result;
  }
  function getDeepProps(obj, key2) {
    var matchs = key2 ? key2.match(staticHGKeyRE$1) : "";
    return matchs ? matchs[1] ? obj[matchs[1]] ? obj[matchs[1]][matchs[2]] : void 0 : obj[matchs[2]] : obj[key2];
  }
  function getValueByPath(obj, property2) {
    if (obj) {
      var rest, props, len2;
      var index = 0;
      if (obj[property2] || hasOwnProp$6(obj, property2)) {
        return obj[property2];
      } else {
        props = helperGetHGSKeys$2(property2);
        len2 = props.length;
        if (len2) {
          for (rest = obj; index < len2; index++) {
            rest = getDeepProps(rest, props[index]);
            if (eqNull$6(rest)) {
              if (index === len2 - 1) {
                return rest;
              }
              return;
            }
          }
        }
        return rest;
      }
    }
  }
  var get_1 = get$5;
  var arrayEach$9 = arrayEach_1;
  var toArray$1 = toArray_1;
  var map$4 = map_1;
  var isArray$l = isArray_1;
  var isFunction$9 = isFunction_1;
  var isPlainObject$4 = isPlainObject_1;
  var isUndefined$7 = isUndefined_1;
  var isNull$6 = isNull_1;
  var eqNull$5 = eqNull_1;
  var get$4 = get_1;
  var property$3 = property_1;
  var ORDER_PROP_ASC = "asc";
  var ORDER_PROP_DESC = "desc";
  function handleSort(v1, v2) {
    if (isUndefined$7(v1)) {
      return 1;
    }
    if (isNull$6(v1)) {
      return isUndefined$7(v2) ? -1 : 1;
    }
    return v1 && v1.localeCompare ? v1.localeCompare(v2) : v1 > v2 ? 1 : -1;
  }
  function buildMultiOrders(name, confs, compares) {
    return function(item1, item2) {
      var v1 = item1[name];
      var v2 = item2[name];
      if (v1 === v2) {
        return compares ? compares(item1, item2) : 0;
      }
      return confs.order === ORDER_PROP_DESC ? handleSort(v2, v1) : handleSort(v1, v2);
    };
  }
  function getSortConfs(arr, list2, fieldConfs, context) {
    var sortConfs = [];
    fieldConfs = isArray$l(fieldConfs) ? fieldConfs : [fieldConfs];
    arrayEach$9(fieldConfs, function(handle, index) {
      if (handle) {
        var field = handle;
        var order;
        if (isArray$l(handle)) {
          field = handle[0];
          order = handle[1];
        } else if (isPlainObject$4(handle)) {
          field = handle.field;
          order = handle.order;
        }
        sortConfs.push({
          field,
          order: order || ORDER_PROP_ASC
        });
        arrayEach$9(list2, isFunction$9(field) ? function(item, key2) {
          item[index] = field.call(context, item.data, key2, arr);
        } : function(item) {
          item[index] = field ? get$4(item.data, field) : item.data;
        });
      }
    });
    return sortConfs;
  }
  function orderBy$3(arr, fieldConfs, context) {
    if (arr) {
      if (eqNull$5(fieldConfs)) {
        return toArray$1(arr).sort(handleSort);
      }
      var compares;
      var list2 = map$4(arr, function(item) {
        return { data: item };
      });
      var sortConfs = getSortConfs(arr, list2, fieldConfs, context);
      var len2 = sortConfs.length - 1;
      while (len2 >= 0) {
        compares = buildMultiOrders(len2, sortConfs[len2], compares);
        len2--;
      }
      if (compares) {
        list2 = list2.sort(compares);
      }
      return map$4(list2, property$3("data"));
    }
    return [];
  }
  var orderBy_1 = orderBy$3;
  var orderBy$2 = orderBy_1;
  var sortBy$1 = orderBy$2;
  var sortBy_1 = sortBy$1;
  function random$2(minVal, maxVal) {
    return minVal >= maxVal ? minVal : (minVal = minVal >> 0) + Math.round(Math.random() * ((maxVal || 9) - minVal));
  }
  var random_1 = random$2;
  var helperCreateGetObjects$1 = helperCreateGetObjects_1;
  var values$6 = helperCreateGetObjects$1("values", 0);
  var values_1 = values$6;
  var random$1 = random_1;
  var values$5 = values_1;
  function shuffle$2(array) {
    var index;
    var result = [];
    var list2 = values$5(array);
    var len2 = list2.length - 1;
    for (; len2 >= 0; len2--) {
      index = len2 > 0 ? random$1(0, len2) : 0;
      result.push(list2[index]);
      list2.splice(index, 1);
    }
    return result;
  }
  var shuffle_1 = shuffle$2;
  var shuffle$1 = shuffle_1;
  function sample$1(array, number) {
    var result = shuffle$1(array);
    if (arguments.length <= 1) {
      return result[0];
    }
    if (number < result.length) {
      result.length = number || 0;
    }
    return result;
  }
  var sample_1 = sample$1;
  function helperCreateToNumber$2(handle) {
    return function(str) {
      if (str) {
        var num = handle(str);
        if (!isNaN(num)) {
          return num;
        }
      }
      return 0;
    };
  }
  var helperCreateToNumber_1 = helperCreateToNumber$2;
  var helperCreateToNumber$1 = helperCreateToNumber_1;
  var toNumber$7 = helperCreateToNumber$1(parseFloat);
  var toNumber_1 = toNumber$7;
  var toNumber$6 = toNumber_1;
  function slice$7(array, startIndex, endIndex) {
    var result = [];
    var argsSize = arguments.length;
    if (array) {
      startIndex = argsSize >= 2 ? toNumber$6(startIndex) : 0;
      endIndex = argsSize >= 3 ? toNumber$6(endIndex) : array.length;
      if (array.slice) {
        return array.slice(startIndex, endIndex);
      }
      for (; startIndex < endIndex; startIndex++) {
        result.push(array[startIndex]);
      }
    }
    return result;
  }
  var slice_1 = slice$7;
  var each$c = each_1;
  function filter$1(obj, iterate, context) {
    var result = [];
    if (obj && iterate) {
      if (obj.filter) {
        return obj.filter(iterate, context);
      }
      each$c(obj, function(val, key2) {
        if (iterate.call(context, val, key2, obj)) {
          result.push(val);
        }
      });
    }
    return result;
  }
  var filter_1 = filter$1;
  var helperCreateIterateHandle$1 = helperCreateIterateHandle_1;
  var findKey$1 = helperCreateIterateHandle$1("", 0, 2, true);
  var findKey_1 = findKey$1;
  var helperCreateIterateHandle = helperCreateIterateHandle_1;
  var find$1 = helperCreateIterateHandle("find", 1, 3, true);
  var find_1 = find$1;
  var isArray$k = isArray_1;
  var values$4 = values_1;
  function findLast$1(obj, iterate, context) {
    if (obj) {
      if (!isArray$k(obj)) {
        obj = values$4(obj);
      }
      for (var len2 = obj.length - 1; len2 >= 0; len2--) {
        if (iterate.call(context, obj[len2], len2, obj)) {
          return obj[len2];
        }
      }
    }
  }
  var findLast_1 = findLast$1;
  var keys$7 = keys_1;
  function reduce$1(array, callback, initialValue) {
    if (array) {
      var len2, reduceMethod;
      var index = 0;
      var context = null;
      var previous = initialValue;
      var isInitialVal = arguments.length > 2;
      var keyList = keys$7(array);
      if (array.length && array.reduce) {
        reduceMethod = function() {
          return callback.apply(context, arguments);
        };
        if (isInitialVal) {
          return array.reduce(reduceMethod, previous);
        }
        return array.reduce(reduceMethod);
      }
      if (isInitialVal) {
        index = 1;
        previous = array[keyList[0]];
      }
      for (len2 = keyList.length; index < len2; index++) {
        previous = callback.call(context, previous, array[keyList[index]], index, array);
      }
      return previous;
    }
  }
  var reduce_1 = reduce$1;
  var isArray$j = isArray_1;
  function copyWithin$1(array, target, start, end) {
    if (isArray$j(array) && array.copyWithin) {
      return array.copyWithin(target, start, end);
    }
    var replaceIndex, replaceArray;
    var targetIndex = target >> 0;
    var startIndex = start >> 0;
    var len2 = array.length;
    var endIndex = arguments.length > 3 ? end >> 0 : len2;
    if (targetIndex < len2) {
      targetIndex = targetIndex >= 0 ? targetIndex : len2 + targetIndex;
      if (targetIndex >= 0) {
        startIndex = startIndex >= 0 ? startIndex : len2 + startIndex;
        endIndex = endIndex >= 0 ? endIndex : len2 + endIndex;
        if (startIndex < endIndex) {
          for (replaceIndex = 0, replaceArray = array.slice(startIndex, endIndex); targetIndex < len2; targetIndex++) {
            if (replaceArray.length <= replaceIndex) {
              break;
            }
            array[targetIndex] = replaceArray[replaceIndex++];
          }
        }
      }
    }
    return array;
  }
  var copyWithin_1 = copyWithin$1;
  var isArray$i = isArray_1;
  function chunk$1(array, size) {
    var index;
    var result = [];
    var arrLen = size >> 0 || 1;
    if (isArray$i(array)) {
      if (arrLen >= 0 && array.length > arrLen) {
        index = 0;
        while (index < array.length) {
          result.push(array.slice(index, index + arrLen));
          index += arrLen;
        }
      } else {
        result = array.length ? [array] : array;
      }
    }
    return result;
  }
  var chunk_1 = chunk$1;
  var map$3 = map_1;
  var property$2 = property_1;
  function pluck$2(obj, key2) {
    return map$3(obj, property$2(key2));
  }
  var pluck_1 = pluck$2;
  var isFunction$8 = isFunction_1;
  var eqNull$4 = eqNull_1;
  var get$3 = get_1;
  var arrayEach$8 = arrayEach_1;
  function helperCreateMinMax$2(handle) {
    return function(arr, iterate) {
      if (arr && arr.length) {
        var rest, itemIndex;
        arrayEach$8(arr, function(itemVal, index) {
          if (iterate) {
            itemVal = isFunction$8(iterate) ? iterate(itemVal, index, arr) : get$3(itemVal, iterate);
          }
          if (!eqNull$4(itemVal) && (eqNull$4(rest) || handle(rest, itemVal))) {
            itemIndex = index;
            rest = itemVal;
          }
        });
        return arr[itemIndex];
      }
      return rest;
    };
  }
  var helperCreateMinMax_1 = helperCreateMinMax$2;
  var helperCreateMinMax$1 = helperCreateMinMax_1;
  var max$2 = helperCreateMinMax$1(function(rest, itemVal) {
    return rest < itemVal;
  });
  var max_1 = max$2;
  var pluck$1 = pluck_1;
  var max$1 = max_1;
  function unzip$2(arrays) {
    var index, maxItem, len2;
    var result = [];
    if (arrays && arrays.length) {
      index = 0;
      maxItem = max$1(arrays, function(item) {
        return item ? item.length : 0;
      });
      for (len2 = maxItem ? maxItem.length : 0; index < len2; index++) {
        result.push(pluck$1(arrays, index));
      }
    }
    return result;
  }
  var unzip_1 = unzip$2;
  var unzip$1 = unzip_1;
  function zip$1() {
    return unzip$1(arguments);
  }
  var zip_1 = zip$1;
  var values$3 = values_1;
  var each$b = each_1;
  function zipObject$1(props, arr) {
    var result = {};
    arr = arr || [];
    each$b(values$3(props), function(val, key2) {
      result[val] = arr[key2];
    });
    return result;
  }
  var zipObject_1 = zipObject$1;
  var isArray$h = isArray_1;
  var arrayEach$7 = arrayEach_1;
  function flattenDeep(array, deep) {
    var result = [];
    arrayEach$7(array, function(vals) {
      result = result.concat(isArray$h(vals) ? deep ? flattenDeep(vals, deep) : vals : [vals]);
    });
    return result;
  }
  function flatten$1(array, deep) {
    if (isArray$h(array)) {
      return flattenDeep(array, deep);
    }
    return [];
  }
  var flatten_1 = flatten$1;
  var map$2 = map_1;
  var isArray$g = isArray_1;
  function deepGetObj(obj, path) {
    var index = 0;
    var len2 = path.length;
    while (obj && index < len2) {
      obj = obj[path[index++]];
    }
    return len2 && obj ? obj : 0;
  }
  function invoke$1(list2, path) {
    var func;
    var args = arguments;
    var params = [];
    var paths = [];
    var index = 2;
    var len2 = args.length;
    for (; index < len2; index++) {
      params.push(args[index]);
    }
    if (isArray$g(path)) {
      len2 = path.length - 1;
      for (index = 0; index < len2; index++) {
        paths.push(path[index]);
      }
      path = path[len2];
    }
    return map$2(list2, function(context) {
      if (paths.length) {
        context = deepGetObj(context, paths);
      }
      func = context[path] || path;
      if (func && func.apply) {
        return func.apply(context, params);
      }
    });
  }
  var invoke_1 = invoke$1;
  function helperDeleteProperty$2(obj, property2) {
    try {
      delete obj[property2];
    } catch (e) {
      obj[property2] = void 0;
    }
  }
  var helperDeleteProperty_1 = helperDeleteProperty$2;
  var isArray$f = isArray_1;
  var lastArrayEach$1 = lastArrayEach_1;
  var lastObjectEach$1 = lastObjectEach_1;
  function lastEach$2(obj, iterate, context) {
    if (obj) {
      return (isArray$f(obj) ? lastArrayEach$1 : lastObjectEach$1)(obj, iterate, context);
    }
    return obj;
  }
  var lastEach_1 = lastEach$2;
  var helperCreateInTypeof$3 = helperCreateInTypeof_1;
  var isObject$4 = helperCreateInTypeof$3("object");
  var isObject_1 = isObject$4;
  var helperDeleteProperty$1 = helperDeleteProperty_1;
  var isPlainObject$3 = isPlainObject_1;
  var isObject$3 = isObject_1;
  var isArray$e = isArray_1;
  var isNull$5 = isNull_1;
  var assign$9 = assign_1;
  var objectEach$2 = objectEach_1;
  function clear$2(obj, defs, assigns) {
    if (obj) {
      var len2;
      var isDefs = arguments.length > 1 && (isNull$5(defs) || !isObject$3(defs));
      var extds = isDefs ? assigns : defs;
      if (isPlainObject$3(obj)) {
        objectEach$2(obj, isDefs ? function(val, key2) {
          obj[key2] = defs;
        } : function(val, key2) {
          helperDeleteProperty$1(obj, key2);
        });
        if (extds) {
          assign$9(obj, extds);
        }
      } else if (isArray$e(obj)) {
        if (isDefs) {
          len2 = obj.length;
          while (len2 > 0) {
            len2--;
            obj[len2] = defs;
          }
        } else {
          obj.length = 0;
        }
        if (extds) {
          obj.push.apply(obj, extds);
        }
      }
    }
    return obj;
  }
  var clear_1 = clear$2;
  var helperDeleteProperty = helperDeleteProperty_1;
  var isFunction$7 = isFunction_1;
  var isArray$d = isArray_1;
  var each$a = each_1;
  var arrayEach$6 = arrayEach_1;
  var lastEach$1 = lastEach_1;
  var clear$1 = clear_1;
  var eqNull$3 = eqNull_1;
  function pluckProperty(name) {
    return function(obj, key2) {
      return key2 === name;
    };
  }
  function remove$2(obj, iterate, context) {
    if (obj) {
      if (!eqNull$3(iterate)) {
        var removeKeys = [];
        var rest = [];
        if (!isFunction$7(iterate)) {
          iterate = pluckProperty(iterate);
        }
        each$a(obj, function(item, index, rest2) {
          if (iterate.call(context, item, index, rest2)) {
            removeKeys.push(index);
          }
        });
        if (isArray$d(obj)) {
          lastEach$1(removeKeys, function(item, key2) {
            rest.push(obj[item]);
            obj.splice(item, 1);
          });
        } else {
          rest = {};
          arrayEach$6(removeKeys, function(key2) {
            rest[key2] = obj[key2];
            helperDeleteProperty(obj, key2);
          });
        }
        return rest;
      }
      return clear$1(obj);
    }
    return obj;
  }
  var remove_1 = remove$2;
  var setupDefaults$8 = setupDefaults_1;
  var orderBy$1 = orderBy_1;
  var clone$1 = clone_1;
  var each$9 = each_1;
  var remove$1 = remove_1;
  var assign$8 = assign_1;
  function strictTree(array, optChildren) {
    each$9(array, function(item) {
      if (item.children && !item.children.length) {
        remove$1(item, optChildren);
      }
    });
  }
  function toArrayTree$1(array, options) {
    var opts = assign$8({}, setupDefaults$8.treeOptions, options);
    var optStrict = opts.strict;
    var optKey = opts.key;
    var optParentKey = opts.parentKey;
    var optChildren = opts.children;
    var optMapChildren = opts.mapChildren;
    var optSortKey = opts.sortKey;
    var optReverse = opts.reverse;
    var optData = opts.data;
    var result = [];
    var treeMap = {};
    var idsMap = {};
    var id, treeData, parentId;
    if (optSortKey) {
      array = orderBy$1(clone$1(array), optSortKey);
      if (optReverse) {
        array = array.reverse();
      }
    }
    each$9(array, function(item) {
      id = item[optKey];
      idsMap[id] = true;
    });
    each$9(array, function(item) {
      id = item[optKey];
      if (optData) {
        treeData = {};
        treeData[optData] = item;
      } else {
        treeData = item;
      }
      parentId = item[optParentKey];
      treeMap[id] = treeMap[id] || [];
      treeMap[parentId] = treeMap[parentId] || [];
      treeMap[parentId].push(treeData);
      treeData[optKey] = id;
      treeData[optParentKey] = parentId;
      treeData[optChildren] = treeMap[id];
      if (optMapChildren) {
        treeData[optMapChildren] = treeMap[id];
      }
      if (!optStrict || optStrict && !parentId) {
        if (!idsMap[parentId]) {
          result.push(treeData);
        }
      }
    });
    if (optStrict) {
      strictTree(array, optChildren);
    }
    return result;
  }
  var toArrayTree_1 = toArrayTree$1;
  var setupDefaults$7 = setupDefaults_1;
  var each$8 = each_1;
  var assign$7 = assign_1;
  function unTreeList(result, array, opts) {
    var optChildren = opts.children;
    var optData = opts.data;
    var optClear = opts.clear;
    each$8(array, function(item) {
      var children = item[optChildren];
      if (optData) {
        item = item[optData];
      }
      result.push(item);
      if (children && children.length) {
        unTreeList(result, children, opts);
      }
      if (optClear) {
        delete item[optChildren];
      }
    });
    return result;
  }
  function toTreeArray$1(array, options) {
    return unTreeList([], array, assign$7({}, setupDefaults$7.treeOptions, options));
  }
  var toTreeArray_1 = toTreeArray$1;
  function helperCreateTreeFunc$4(handle) {
    return function(obj, iterate, options, context) {
      var opts = options || {};
      var optChildren = opts.children || "children";
      return handle(null, obj, iterate, context, [], [], optChildren, opts);
    };
  }
  var helperCreateTreeFunc_1 = helperCreateTreeFunc$4;
  var helperCreateTreeFunc$3 = helperCreateTreeFunc_1;
  function findTreeItem(parent, obj, iterate, context, path, node, parseChildren, opts) {
    if (obj) {
      var item, index, len2, paths, nodes, match;
      for (index = 0, len2 = obj.length; index < len2; index++) {
        item = obj[index];
        paths = path.concat(["" + index]);
        nodes = node.concat([item]);
        if (iterate.call(context, item, index, obj, paths, parent, nodes)) {
          return { index, item, path: paths, items: obj, parent, nodes };
        }
        if (parseChildren && item) {
          match = findTreeItem(item, item[parseChildren], iterate, context, paths.concat([parseChildren]), nodes, parseChildren);
          if (match) {
            return match;
          }
        }
      }
    }
  }
  var findTree$1 = helperCreateTreeFunc$3(findTreeItem);
  var findTree_1 = findTree$1;
  var helperCreateTreeFunc$2 = helperCreateTreeFunc_1;
  var each$7 = each_1;
  function eachTreeItem(parent, obj, iterate, context, path, node, parseChildren, opts) {
    var paths, nodes;
    each$7(obj, function(item, index) {
      paths = path.concat(["" + index]);
      nodes = node.concat([item]);
      iterate.call(context, item, index, obj, paths, parent, nodes);
      if (item && parseChildren) {
        paths.push(parseChildren);
        eachTreeItem(item, item[parseChildren], iterate, context, paths, nodes, parseChildren);
      }
    });
  }
  var eachTree$2 = helperCreateTreeFunc$2(eachTreeItem);
  var eachTree_1 = eachTree$2;
  var helperCreateTreeFunc$1 = helperCreateTreeFunc_1;
  var map$1 = map_1;
  function mapTreeItem(parent, obj, iterate, context, path, node, parseChildren, opts) {
    var paths, nodes, rest;
    var mapChildren = opts.mapChildren || parseChildren;
    return map$1(obj, function(item, index) {
      paths = path.concat(["" + index]);
      nodes = node.concat([item]);
      rest = iterate.call(context, item, index, obj, paths, parent, nodes);
      if (rest && item && parseChildren && item[parseChildren]) {
        rest[mapChildren] = mapTreeItem(item, item[parseChildren], iterate, context, paths, nodes, parseChildren, opts);
      }
      return rest;
    });
  }
  var mapTree$1 = helperCreateTreeFunc$1(mapTreeItem);
  var mapTree_1 = mapTree$1;
  var eachTree$1 = eachTree_1;
  function filterTree$1(obj, iterate, options, context) {
    var result = [];
    if (obj && iterate) {
      eachTree$1(obj, function(item, index, items, path, parent, nodes) {
        if (iterate.call(context, item, index, items, path, parent, nodes)) {
          result.push(item);
        }
      }, options);
    }
    return result;
  }
  var filterTree_1 = filterTree$1;
  var helperCreateTreeFunc = helperCreateTreeFunc_1;
  var arrayEach$5 = arrayEach_1;
  var assign$6 = assign_1;
  function searchTreeItem(parentAllow, parent, obj, iterate, context, path, node, parseChildren, opts) {
    var paths, nodes, rest, isAllow, hasChild;
    var rests = [];
    var hasOriginal = opts.original;
    var sourceData = opts.data;
    var mapChildren = opts.mapChildren || parseChildren;
    arrayEach$5(obj, function(item, index) {
      paths = path.concat(["" + index]);
      nodes = node.concat([item]);
      isAllow = parentAllow || iterate.call(context, item, index, obj, paths, parent, nodes);
      hasChild = parseChildren && item[parseChildren];
      if (isAllow || hasChild) {
        if (hasOriginal) {
          rest = item;
        } else {
          rest = assign$6({}, item);
          if (sourceData) {
            rest[sourceData] = item;
          }
        }
        rest[mapChildren] = searchTreeItem(isAllow, item, item[parseChildren], iterate, context, paths, nodes, parseChildren, opts);
        if (isAllow || rest[mapChildren].length) {
          rests.push(rest);
        }
      } else if (isAllow) {
        rests.push(rest);
      }
    });
    return rests;
  }
  var searchTree$1 = helperCreateTreeFunc(function(parent, obj, iterate, context, path, nodes, parseChildren, opts) {
    return searchTreeItem(0, parent, obj, iterate, context, path, nodes, parseChildren, opts);
  });
  var searchTree_1 = searchTree$1;
  function arrayIndexOf$2(list2, val) {
    if (list2.indexOf) {
      return list2.indexOf(val);
    }
    for (var index = 0, len2 = list2.length; index < len2; index++) {
      if (val === list2[index]) {
        return index;
      }
    }
  }
  var arrayIndexOf_1 = arrayIndexOf$2;
  function arrayLastIndexOf$2(list2, val) {
    if (list2.lastIndexOf) {
      return list2.lastIndexOf(val);
    }
    for (var len2 = list2.length - 1; len2 >= 0; len2--) {
      if (val === list2[len2]) {
        return len2;
      }
    }
    return -1;
  }
  var arrayLastIndexOf_1 = arrayLastIndexOf$2;
  var helperCreateInTypeof$2 = helperCreateInTypeof_1;
  var isNumber$a = helperCreateInTypeof$2("number");
  var isNumber_1 = isNumber$a;
  var isNumber$9 = isNumber_1;
  function isNumberNaN$1(obj) {
    return isNumber$9(obj) && isNaN(obj);
  }
  var _isNaN = isNumberNaN$1;
  var helperCreateInTypeof$1 = helperCreateInTypeof_1;
  var isString$9 = helperCreateInTypeof$1("string");
  var isString_1 = isString$9;
  var helperCreateInInObjectString$3 = helperCreateInInObjectString_1;
  var isDate$8 = helperCreateInInObjectString$3("Date");
  var isDate_1 = isDate$8;
  var staticParseInt$5 = parseInt;
  var staticParseInt_1 = staticParseInt$5;
  function helperGetUTCDateTime$1(resMaps) {
    return Date.UTC(resMaps.y, resMaps.M || 0, resMaps.d || 1, resMaps.H || 0, resMaps.m || 0, resMaps.s || 0, resMaps.S || 0);
  }
  var helperGetUTCDateTime_1 = helperGetUTCDateTime$1;
  function helperGetDateTime$c(date) {
    return date.getTime();
  }
  var helperGetDateTime_1 = helperGetDateTime$c;
  var staticParseInt$4 = staticParseInt_1;
  var helperGetUTCDateTime = helperGetUTCDateTime_1;
  var helperGetDateTime$b = helperGetDateTime_1;
  var isString$8 = isString_1;
  var isDate$7 = isDate_1;
  function getParseRule(txt) {
    return "(\\d{" + txt + "})";
  }
  function toParseMs(num) {
    if (num < 10) {
      return num * 100;
    } else if (num < 100) {
      return num * 10;
    }
    return num;
  }
  function toParseNum(num) {
    return isNaN(num) ? num : staticParseInt$4(num);
  }
  var d2 = getParseRule(2);
  var d1or2 = getParseRule("1,2");
  var d1or7 = getParseRule("1,7");
  var d3or4 = getParseRule("3,4");
  var place = ".{1}";
  var d1Or2RE = place + d1or2;
  var dzZ = "(([zZ])|([-+]\\d{2}:?\\d{2}))";
  var defaulParseStrs = [d3or4, d1Or2RE, d1Or2RE, d1Or2RE, d1Or2RE, d1Or2RE, place + d1or7, dzZ];
  var defaulParseREs = [];
  for (var len = defaulParseStrs.length - 1; len >= 0; len--) {
    var rule = "";
    for (var i = 0; i < len + 1; i++) {
      rule += defaulParseStrs[i];
    }
    defaulParseREs.push(new RegExp("^" + rule + "$"));
  }
  function parseDefaultRules(str) {
    var matchRest, resMaps = {};
    for (var i2 = 0, dfrLen = defaulParseREs.length; i2 < dfrLen; i2++) {
      matchRest = str.match(defaulParseREs[i2]);
      if (matchRest) {
        resMaps.y = matchRest[1];
        resMaps.M = matchRest[2];
        resMaps.d = matchRest[3];
        resMaps.H = matchRest[4];
        resMaps.m = matchRest[5];
        resMaps.s = matchRest[6];
        resMaps.S = matchRest[7];
        resMaps.Z = matchRest[8];
        break;
      }
    }
    return resMaps;
  }
  var customParseStrs = [
    ["yyyy", d3or4],
    ["yy", d2],
    ["MM", d2],
    ["M", d1or2],
    ["dd", d2],
    ["d", d1or2],
    ["HH", d2],
    ["H", d1or2],
    ["mm", d2],
    ["m", d1or2],
    ["ss", d2],
    ["s", d1or2],
    ["SSS", getParseRule(3)],
    ["S", d1or7],
    ["Z", dzZ]
  ];
  var parseRuleMaps = {};
  var parseRuleKeys = ["\\[([^\\]]+)\\]"];
  for (var i = 0; i < customParseStrs.length; i++) {
    var itemRule = customParseStrs[i];
    parseRuleMaps[itemRule[0]] = itemRule[1] + "?";
    parseRuleKeys.push(itemRule[0]);
  }
  var customParseRes = new RegExp(parseRuleKeys.join("|"), "g");
  var cacheFormatMaps = {};
  function parseCustomRules(str, format) {
    var cacheItem = cacheFormatMaps[format];
    if (!cacheItem) {
      var posIndexs = [];
      var re = format.replace(/([$(){}*+.?\\^|])/g, "\\$1").replace(customParseRes, function(text, val) {
        var firstChar = text.charAt(0);
        if (firstChar === "[") {
          return val;
        }
        posIndexs.push(firstChar);
        return parseRuleMaps[text];
      });
      cacheItem = cacheFormatMaps[format] = {
        _i: posIndexs,
        _r: new RegExp(re)
      };
    }
    var resMaps = {};
    var matchRest = str.match(cacheItem._r);
    if (matchRest) {
      var _i = cacheItem._i;
      for (var i2 = 1, len2 = matchRest.length; i2 < len2; i2++) {
        resMaps[_i[i2 - 1]] = matchRest[i2];
      }
      return resMaps;
    }
    return resMaps;
  }
  function parseTimeZone(resMaps) {
    if (/^[zZ]/.test(resMaps.Z)) {
      return new Date(helperGetUTCDateTime(resMaps));
    } else {
      var matchRest = resMaps.Z.match(/([-+])(\d{2}):?(\d{2})/);
      if (matchRest) {
        return new Date(helperGetUTCDateTime(resMaps) - (matchRest[1] === "-" ? -1 : 1) * staticParseInt$4(matchRest[2]) * 36e5 + staticParseInt$4(matchRest[3]) * 6e4);
      }
    }
    return new Date("");
  }
  function toStringDate$d(str, format) {
    if (str) {
      var isDType = isDate$7(str);
      if (isDType || !format && /^[0-9]{11,15}$/.test(str)) {
        return new Date(isDType ? helperGetDateTime$b(str) : staticParseInt$4(str));
      }
      if (isString$8(str)) {
        var resMaps = format ? parseCustomRules(str, format) : parseDefaultRules(str);
        if (resMaps.y) {
          if (resMaps.M) {
            resMaps.M = toParseNum(resMaps.M) - 1;
          }
          if (resMaps.S) {
            resMaps.S = toParseMs(toParseNum(resMaps.S.substring(0, 3)));
          }
          if (resMaps.Z) {
            return parseTimeZone(resMaps);
          } else {
            return new Date(resMaps.y, resMaps.M || 0, resMaps.d || 1, resMaps.H || 0, resMaps.m || 0, resMaps.s || 0, resMaps.S || 0);
          }
        }
      }
    }
    return new Date("");
  }
  var toStringDate_1 = toStringDate$d;
  function helperNewDate$4() {
    return new Date();
  }
  var helperNewDate_1 = helperNewDate$4;
  var isDate$6 = isDate_1;
  var toStringDate$c = toStringDate_1;
  var helperNewDate$3 = helperNewDate_1;
  function isLeapYear$2(date) {
    var year;
    var currentDate = date ? toStringDate$c(date) : helperNewDate$3();
    if (isDate$6(currentDate)) {
      year = currentDate.getFullYear();
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    return false;
  }
  var isLeapYear_1 = isLeapYear$2;
  var isArray$c = isArray_1;
  var hasOwnProp$5 = hasOwnProp_1;
  function forOf$1(obj, iterate, context) {
    if (obj) {
      if (isArray$c(obj)) {
        for (var index = 0, len2 = obj.length; index < len2; index++) {
          if (iterate.call(context, obj[index], index, obj) === false) {
            break;
          }
        }
      } else {
        for (var key2 in obj) {
          if (hasOwnProp$5(obj, key2)) {
            if (iterate.call(context, obj[key2], key2, obj) === false) {
              break;
            }
          }
        }
      }
    }
  }
  var forOf_1 = forOf$1;
  var isArray$b = isArray_1;
  var keys$6 = hasOwnProp_1;
  function lastForOf$1(obj, iterate, context) {
    if (obj) {
      var len2, list2;
      if (isArray$b(obj)) {
        for (len2 = obj.length - 1; len2 >= 0; len2--) {
          if (iterate.call(context, obj[len2], len2, obj) === false) {
            break;
          }
        }
      } else {
        list2 = keys$6(obj);
        for (len2 = list2.length - 1; len2 >= 0; len2--) {
          if (iterate.call(context, obj[list2[len2]], list2[len2], obj) === false) {
            break;
          }
        }
      }
    }
  }
  var lastForOf_1 = lastForOf$1;
  var isArray$a = isArray_1;
  var isString$7 = isString_1;
  var hasOwnProp$4 = hasOwnProp_1;
  function helperCreateIndexOf$2(name, callback) {
    return function(obj, val) {
      if (obj) {
        if (obj[name]) {
          return obj[name](val);
        }
        if (isString$7(obj) || isArray$a(obj)) {
          return callback(obj, val);
        }
        for (var key2 in obj) {
          if (hasOwnProp$4(obj, key2)) {
            if (val === obj[key2]) {
              return key2;
            }
          }
        }
      }
      return -1;
    };
  }
  var helperCreateIndexOf_1 = helperCreateIndexOf$2;
  var helperCreateIndexOf$1 = helperCreateIndexOf_1;
  var arrayIndexOf$1 = arrayIndexOf_1;
  var indexOf$1 = helperCreateIndexOf$1("indexOf", arrayIndexOf$1);
  var indexOf_1 = indexOf$1;
  var helperCreateIndexOf = helperCreateIndexOf_1;
  var arrayLastIndexOf$1 = arrayLastIndexOf_1;
  var lastIndexOf$2 = helperCreateIndexOf("lastIndexOf", arrayLastIndexOf$1);
  var lastIndexOf_1 = lastIndexOf$2;
  var isArray$9 = isArray_1;
  var isString$6 = isString_1;
  var each$6 = each_1;
  function getSize$2(obj) {
    var len2 = 0;
    if (isString$6(obj) || isArray$9(obj)) {
      return obj.length;
    }
    each$6(obj, function() {
      len2++;
    });
    return len2;
  }
  var getSize_1 = getSize$2;
  var isNumber$8 = isNumber_1;
  function isNumberFinite$1(obj) {
    return isNumber$8(obj) && isFinite(obj);
  }
  var _isFinite = isNumberFinite$1;
  var isArray$8 = isArray_1;
  var isNull$4 = isNull_1;
  var isInteger$2 = function(obj) {
    return !isNull$4(obj) && !isNaN(obj) && !isArray$8(obj) && obj % 1 === 0;
  };
  var isInteger_1 = isInteger$2;
  var isArray$7 = isArray_1;
  var isInteger$1 = isInteger_1;
  var isNull$3 = isNull_1;
  function isFloat$1(obj) {
    return !isNull$3(obj) && !isNaN(obj) && !isArray$7(obj) && !isInteger$1(obj);
  }
  var isFloat_1 = isFloat$1;
  var helperCreateInTypeof = helperCreateInTypeof_1;
  var isBoolean$2 = helperCreateInTypeof("boolean");
  var isBoolean_1 = isBoolean$2;
  var helperCreateInInObjectString$2 = helperCreateInInObjectString_1;
  var isRegExp$3 = helperCreateInInObjectString$2("RegExp");
  var isRegExp_1 = isRegExp$3;
  var helperCreateInInObjectString$1 = helperCreateInInObjectString_1;
  var isError$2 = helperCreateInInObjectString$1("Error");
  var isError_1 = isError$2;
  function isTypeError$1(obj) {
    return obj ? obj.constructor === TypeError : false;
  }
  var isTypeError_1 = isTypeError$1;
  function isEmpty$2(obj) {
    for (var key2 in obj) {
      return false;
    }
    return true;
  }
  var isEmpty_1 = isEmpty$2;
  var staticStrUndefined$9 = staticStrUndefined_1;
  var supportSymbol = typeof Symbol !== staticStrUndefined$9;
  function isSymbol$2(obj) {
    return supportSymbol && Symbol.isSymbol ? Symbol.isSymbol(obj) : typeof obj === "symbol";
  }
  var isSymbol_1 = isSymbol$2;
  var helperCreateInInObjectString = helperCreateInInObjectString_1;
  var isArguments$1 = helperCreateInInObjectString("Arguments");
  var isArguments_1 = isArguments$1;
  var isString$5 = isString_1;
  var isNumber$7 = isNumber_1;
  function isElement$1(obj) {
    return !!(obj && isString$5(obj.nodeName) && isNumber$7(obj.nodeType));
  }
  var isElement_1 = isElement$1;
  var staticStrUndefined$8 = staticStrUndefined_1;
  var staticDocument$3 = typeof document === staticStrUndefined$8 ? 0 : document;
  var staticDocument_1 = staticDocument$3;
  var staticDocument$2 = staticDocument_1;
  function isDocument$1(obj) {
    return !!(obj && staticDocument$2 && obj.nodeType === 9);
  }
  var isDocument_1 = isDocument$1;
  var staticStrUndefined$7 = staticStrUndefined_1;
  var staticWindow$2 = typeof window === staticStrUndefined$7 ? 0 : window;
  var staticWindow_1 = staticWindow$2;
  var staticWindow$1 = staticWindow_1;
  function isWindow$1(obj) {
    return staticWindow$1 && !!(obj && obj === obj.window);
  }
  var isWindow_1 = isWindow$1;
  var staticStrUndefined$6 = staticStrUndefined_1;
  var supportFormData = typeof FormData !== staticStrUndefined$6;
  function isFormData$1(obj) {
    return supportFormData && obj instanceof FormData;
  }
  var isFormData_1 = isFormData$1;
  var staticStrUndefined$5 = staticStrUndefined_1;
  var supportMap = typeof Map !== staticStrUndefined$5;
  function isMap$1(obj) {
    return supportMap && obj instanceof Map;
  }
  var isMap_1 = isMap$1;
  var staticStrUndefined$4 = staticStrUndefined_1;
  var supportWeakMap = typeof WeakMap !== staticStrUndefined$4;
  function isWeakMap$1(obj) {
    return supportWeakMap && obj instanceof WeakMap;
  }
  var isWeakMap_1 = isWeakMap$1;
  var staticStrUndefined$3 = staticStrUndefined_1;
  var supportSet = typeof Set !== staticStrUndefined$3;
  function isSet$1(obj) {
    return supportSet && obj instanceof Set;
  }
  var isSet_1 = isSet$1;
  var staticStrUndefined$2 = staticStrUndefined_1;
  var supportWeakSet = typeof WeakSet !== staticStrUndefined$2;
  function isWeakSet$1(obj) {
    return supportWeakSet && obj instanceof WeakSet;
  }
  var isWeakSet_1 = isWeakSet$1;
  var isFunction$6 = isFunction_1;
  var isString$4 = isString_1;
  var isArray$6 = isArray_1;
  var hasOwnProp$3 = hasOwnProp_1;
  function helperCreateiterateIndexOf$2(callback) {
    return function(obj, iterate, context) {
      if (obj && isFunction$6(iterate)) {
        if (isArray$6(obj) || isString$4(obj)) {
          return callback(obj, iterate, context);
        }
        for (var key2 in obj) {
          if (hasOwnProp$3(obj, key2)) {
            if (iterate.call(context, obj[key2], key2, obj)) {
              return key2;
            }
          }
        }
      }
      return -1;
    };
  }
  var helperCreateiterateIndexOf_1 = helperCreateiterateIndexOf$2;
  var helperCreateiterateIndexOf$1 = helperCreateiterateIndexOf_1;
  var findIndexOf$3 = helperCreateiterateIndexOf$1(function(obj, iterate, context) {
    for (var index = 0, len2 = obj.length; index < len2; index++) {
      if (iterate.call(context, obj[index], index, obj)) {
        return index;
      }
    }
    return -1;
  });
  var findIndexOf_1 = findIndexOf$3;
  var isNumber$6 = isNumber_1;
  var isArray$5 = isArray_1;
  var isString$3 = isString_1;
  var isRegExp$2 = isRegExp_1;
  var isDate$5 = isDate_1;
  var isBoolean$1 = isBoolean_1;
  var isUndefined$6 = isUndefined_1;
  var keys$5 = keys_1;
  var every$1 = every_1;
  function helperEqualCompare$2(val1, val2, compare, func, key2, obj1, obj2) {
    if (val1 === val2) {
      return true;
    }
    if (val1 && val2 && !isNumber$6(val1) && !isNumber$6(val2) && !isString$3(val1) && !isString$3(val2)) {
      if (isRegExp$2(val1)) {
        return compare("" + val1, "" + val2, key2, obj1, obj2);
      }
      if (isDate$5(val1) || isBoolean$1(val1)) {
        return compare(+val1, +val2, key2, obj1, obj2);
      } else {
        var result, val1Keys, val2Keys;
        var isObj1Arr = isArray$5(val1);
        var isObj2Arr = isArray$5(val2);
        if (isObj1Arr || isObj2Arr ? isObj1Arr && isObj2Arr : val1.constructor === val2.constructor) {
          val1Keys = keys$5(val1);
          val2Keys = keys$5(val2);
          if (func) {
            result = func(val1, val2, key2);
          }
          if (val1Keys.length === val2Keys.length) {
            return isUndefined$6(result) ? every$1(val1Keys, function(key3, index) {
              return key3 === val2Keys[index] && helperEqualCompare$2(val1[key3], val2[val2Keys[index]], compare, func, isObj1Arr || isObj2Arr ? index : key3, val1, val2);
            }) : !!result;
          }
          return false;
        }
      }
    }
    return compare(val1, val2, key2, obj1, obj2);
  }
  var helperEqualCompare_1 = helperEqualCompare$2;
  function helperDefaultCompare$2(v1, v2) {
    return v1 === v2;
  }
  var helperDefaultCompare_1 = helperDefaultCompare$2;
  var helperEqualCompare$1 = helperEqualCompare_1;
  var helperDefaultCompare$1 = helperDefaultCompare_1;
  function isEqual$2(obj1, obj2) {
    return helperEqualCompare$1(obj1, obj2, helperDefaultCompare$1);
  }
  var isEqual_1 = isEqual$2;
  var keys$4 = keys_1;
  var findIndexOf$2 = findIndexOf_1;
  var isEqual$1 = isEqual_1;
  var some$1 = some_1;
  var includeArrays$1 = includeArrays_1;
  function isMatch$1(obj, source) {
    var objKeys = keys$4(obj);
    var sourceKeys = keys$4(source);
    if (sourceKeys.length) {
      if (includeArrays$1(objKeys, sourceKeys)) {
        return some$1(sourceKeys, function(key2) {
          return findIndexOf$2(objKeys, function(key1) {
            return key1 === key2 && isEqual$1(obj[key1], source[key2]);
          }) > -1;
        });
      }
    } else {
      return true;
    }
    return isEqual$1(obj, source);
  }
  var isMatch_1 = isMatch$1;
  var helperEqualCompare = helperEqualCompare_1;
  var helperDefaultCompare = helperDefaultCompare_1;
  var isFunction$5 = isFunction_1;
  var isUndefined$5 = isUndefined_1;
  function isEqualWith$1(obj1, obj2, func) {
    if (isFunction$5(func)) {
      return helperEqualCompare(obj1, obj2, function(v1, v2, key2, obj12, obj22) {
        var result = func(v1, v2, key2, obj12, obj22);
        return isUndefined$5(result) ? helperDefaultCompare(v1, v2) : !!result;
      }, func);
    }
    return helperEqualCompare(obj1, obj2, helperDefaultCompare);
  }
  var isEqualWith_1 = isEqualWith$1;
  var isSymbol$1 = isSymbol_1;
  var isDate$4 = isDate_1;
  var isArray$4 = isArray_1;
  var isRegExp$1 = isRegExp_1;
  var isError$1 = isError_1;
  var isNull$2 = isNull_1;
  function getType$1(obj) {
    if (isNull$2(obj)) {
      return "null";
    }
    if (isSymbol$1(obj)) {
      return "symbol";
    }
    if (isDate$4(obj)) {
      return "date";
    }
    if (isArray$4(obj)) {
      return "array";
    }
    if (isRegExp$1(obj)) {
      return "regexp";
    }
    if (isError$1(obj)) {
      return "error";
    }
    return typeof obj;
  }
  var getType_1 = getType$1;
  var __uniqueId = 0;
  function uniqueId$1(prefix) {
    return [prefix, ++__uniqueId].join("");
  }
  var uniqueId_1 = uniqueId$1;
  var helperCreateiterateIndexOf = helperCreateiterateIndexOf_1;
  var findLastIndexOf$1 = helperCreateiterateIndexOf(function(obj, iterate, context) {
    for (var len2 = obj.length - 1; len2 >= 0; len2--) {
      if (iterate.call(context, obj[len2], len2, obj)) {
        return len2;
      }
    }
    return -1;
  });
  var findLastIndexOf_1 = findLastIndexOf$1;
  var isPlainObject$2 = isPlainObject_1;
  var isString$2 = isString_1;
  function toStringJSON$1(str) {
    if (isPlainObject$2(str)) {
      return str;
    } else if (isString$2(str)) {
      try {
        return JSON.parse(str);
      } catch (e) {
      }
    }
    return {};
  }
  var toStringJSON_1 = toStringJSON$1;
  var eqNull$2 = eqNull_1;
  function toJSONString$1(obj) {
    return eqNull$2(obj) ? "" : JSON.stringify(obj);
  }
  var toJSONString_1 = toJSONString$1;
  var helperCreateGetObjects = helperCreateGetObjects_1;
  var entries$1 = helperCreateGetObjects("entries", 2);
  var entries_1 = entries$1;
  var isFunction$4 = isFunction_1;
  var isArray$3 = isArray_1;
  var each$5 = each_1;
  var findIndexOf$1 = findIndexOf_1;
  function helperCreatePickOmit$2(case1, case2) {
    return function(obj, callback) {
      var item, index;
      var rest = {};
      var result = [];
      var context = this;
      var args = arguments;
      var len2 = args.length;
      if (!isFunction$4(callback)) {
        for (index = 1; index < len2; index++) {
          item = args[index];
          result.push.apply(result, isArray$3(item) ? item : [item]);
        }
        callback = 0;
      }
      each$5(obj, function(val, key2) {
        if ((callback ? callback.call(context, val, key2, obj) : findIndexOf$1(result, function(name) {
          return name === key2;
        }) > -1) ? case1 : case2) {
          rest[key2] = val;
        }
      });
      return rest;
    };
  }
  var helperCreatePickOmit_1 = helperCreatePickOmit$2;
  var helperCreatePickOmit$1 = helperCreatePickOmit_1;
  var pick$1 = helperCreatePickOmit$1(1, 0);
  var pick_1 = pick$1;
  var helperCreatePickOmit = helperCreatePickOmit_1;
  var omit$1 = helperCreatePickOmit(0, 1);
  var omit_1 = omit$1;
  var values$2 = values_1;
  function first$1(obj) {
    return values$2(obj)[0];
  }
  var first_1 = first$1;
  var values$1 = values_1;
  function last$1(obj) {
    var list2 = values$1(obj);
    return list2[list2.length - 1];
  }
  var last_1 = last$1;
  var staticHGKeyRE = staticHGKeyRE_1;
  var helperGetHGSKeys$1 = helperGetHGSKeys_1;
  var hasOwnProp$2 = hasOwnProp_1;
  function has$1(obj, property2) {
    if (obj) {
      if (hasOwnProp$2(obj, property2)) {
        return true;
      } else {
        var prop, arrIndex, objProp, matchs, rest, isHas;
        var props = helperGetHGSKeys$1(property2);
        var index = 0;
        var len2 = props.length;
        for (rest = obj; index < len2; index++) {
          isHas = false;
          prop = props[index];
          matchs = prop ? prop.match(staticHGKeyRE) : "";
          if (matchs) {
            arrIndex = matchs[1];
            objProp = matchs[2];
            if (arrIndex) {
              if (rest[arrIndex]) {
                if (hasOwnProp$2(rest[arrIndex], objProp)) {
                  isHas = true;
                  rest = rest[arrIndex][objProp];
                }
              }
            } else {
              if (hasOwnProp$2(rest, objProp)) {
                isHas = true;
                rest = rest[objProp];
              }
            }
          } else {
            if (hasOwnProp$2(rest, prop)) {
              isHas = true;
              rest = rest[prop];
            }
          }
          if (isHas) {
            if (index === len2 - 1) {
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }
  var has_1 = has$1;
  var staticParseInt$3 = staticParseInt_1;
  var helperGetHGSKeys = helperGetHGSKeys_1;
  var hasOwnProp$1 = hasOwnProp_1;
  var sKeyRE = /(.+)?\[(\d+)\]$/;
  function setDeepProps(obj, key2, isEnd, nextKey, value) {
    if (obj[key2]) {
      if (isEnd) {
        obj[key2] = value;
      }
    } else {
      var index;
      var rest;
      var currMatchs = key2 ? key2.match(sKeyRE) : null;
      if (isEnd) {
        rest = value;
      } else {
        var nextMatchs = nextKey ? nextKey.match(sKeyRE) : null;
        if (nextMatchs && !nextMatchs[1]) {
          rest = new Array(staticParseInt$3(nextMatchs[2]) + 1);
        } else {
          rest = {};
        }
      }
      if (currMatchs) {
        if (currMatchs[1]) {
          index = staticParseInt$3(currMatchs[2]);
          if (obj[currMatchs[1]]) {
            if (isEnd) {
              obj[currMatchs[1]][index] = rest;
            } else {
              if (obj[currMatchs[1]][index]) {
                rest = obj[currMatchs[1]][index];
              } else {
                obj[currMatchs[1]][index] = rest;
              }
            }
          } else {
            obj[currMatchs[1]] = new Array(index + 1);
            obj[currMatchs[1]][index] = rest;
          }
        } else {
          obj[currMatchs[2]] = rest;
        }
      } else {
        obj[key2] = rest;
      }
      return rest;
    }
    return obj[key2];
  }
  function set$1(obj, property2, value) {
    if (obj) {
      if ((obj[property2] || hasOwnProp$1(obj, property2)) && !isPrototypePolluted(property2)) {
        obj[property2] = value;
      } else {
        var rest = obj;
        var props = helperGetHGSKeys(property2);
        var len2 = props.length;
        for (var index = 0; index < len2; index++) {
          if (isPrototypePolluted(props[index])) {
            continue;
          }
          var isEnd = index === len2 - 1;
          rest = setDeepProps(rest, props[index], isEnd, isEnd ? null : props[index + 1], value);
        }
      }
    }
    return obj;
  }
  function isPrototypePolluted(key2) {
    return key2 === "__proto__" || key2 === "constructor" || key2 === "prototype";
  }
  var set_1 = set$1;
  var isEmpty$1 = isEmpty_1;
  var isObject$2 = isObject_1;
  var isFunction$3 = isFunction_1;
  var property$1 = property_1;
  var each$4 = each_1;
  function createiterateEmpty(iterate) {
    return function() {
      return isEmpty$1(iterate);
    };
  }
  function groupBy$2(obj, iterate, context) {
    var groupKey;
    var result = {};
    if (obj) {
      if (iterate && isObject$2(iterate)) {
        iterate = createiterateEmpty(iterate);
      } else if (!isFunction$3(iterate)) {
        iterate = property$1(iterate);
      }
      each$4(obj, function(val, key2) {
        groupKey = iterate ? iterate.call(context, val, key2, obj) : val;
        if (result[groupKey]) {
          result[groupKey].push(val);
        } else {
          result[groupKey] = [val];
        }
      });
    }
    return result;
  }
  var groupBy_1 = groupBy$2;
  var groupBy$1 = groupBy_1;
  var objectEach$1 = objectEach_1;
  function countBy$1(obj, iterate, context) {
    var result = groupBy$1(obj, iterate, context || this);
    objectEach$1(result, function(item, key2) {
      result[key2] = item.length;
    });
    return result;
  }
  var countBy_1 = countBy$1;
  function range$1(start, stop, step) {
    var index, len2;
    var result = [];
    var args = arguments;
    if (args.length < 2) {
      stop = args[0];
      start = 0;
    }
    index = start >> 0;
    len2 = stop >> 0;
    if (index < stop) {
      step = step >> 0 || 1;
      for (; index < len2; index += step) {
        result.push(index);
      }
    }
    return result;
  }
  var range_1 = range$1;
  var keys$3 = keys_1;
  var slice$6 = slice_1;
  var includes$2 = includes_1;
  var arrayEach$4 = arrayEach_1;
  var assign$5 = assign_1;
  function destructuring$1(destination, sources) {
    if (destination && sources) {
      var rest = assign$5.apply(this, [{}].concat(slice$6(arguments, 1)));
      var restKeys = keys$3(rest);
      arrayEach$4(keys$3(destination), function(key2) {
        if (includes$2(restKeys, key2)) {
          destination[key2] = rest[key2];
        }
      });
    }
    return destination;
  }
  var destructuring_1 = destructuring$1;
  var helperCreateMinMax = helperCreateMinMax_1;
  var min$1 = helperCreateMinMax(function(rest, itemVal) {
    return rest > itemVal;
  });
  var min_1 = min$1;
  function helperNumberDecimal$4(numStr) {
    return (numStr.split(".")[1] || "").length;
  }
  var helperNumberDecimal_1 = helperNumberDecimal$4;
  var staticParseInt$2 = staticParseInt_1;
  function helperStringRepeat$5(str, count) {
    if (str.repeat) {
      return str.repeat(count);
    }
    var list2 = isNaN(count) ? [] : new Array(staticParseInt$2(count));
    return list2.join(str) + (list2.length > 0 ? str : "");
  }
  var helperStringRepeat_1 = helperStringRepeat$5;
  function helperNumberOffsetPoint$2(str, offsetIndex) {
    return str.substring(0, offsetIndex) + "." + str.substring(offsetIndex, str.length);
  }
  var helperNumberOffsetPoint_1 = helperNumberOffsetPoint$2;
  var helperStringRepeat$4 = helperStringRepeat_1;
  var helperNumberOffsetPoint$1 = helperNumberOffsetPoint_1;
  function toNumberString$8(num) {
    var rest = "" + num;
    var scienceMatchs = rest.match(/^([-+]?)((\d+)|((\d+)?[.](\d+)?))e([-+]{1})([0-9]+)$/);
    if (scienceMatchs) {
      var isNegative = num < 0;
      var absFlag = isNegative ? "-" : "";
      var intNumStr = scienceMatchs[3] || "";
      var dIntNumStr = scienceMatchs[5] || "";
      var dFloatNumStr = scienceMatchs[6] || "";
      var sciencFlag = scienceMatchs[7];
      var scienceNumStr = scienceMatchs[8];
      var floatOffsetIndex = scienceNumStr - dFloatNumStr.length;
      var intOffsetIndex = scienceNumStr - intNumStr.length;
      var dIntOffsetIndex = scienceNumStr - dIntNumStr.length;
      if (sciencFlag === "+") {
        if (intNumStr) {
          return absFlag + intNumStr + helperStringRepeat$4("0", scienceNumStr);
        }
        if (floatOffsetIndex > 0) {
          return absFlag + dIntNumStr + dFloatNumStr + helperStringRepeat$4("0", floatOffsetIndex);
        }
        return absFlag + dIntNumStr + helperNumberOffsetPoint$1(dFloatNumStr, scienceNumStr);
      }
      if (intNumStr) {
        if (intOffsetIndex > 0) {
          return absFlag + "0." + helperStringRepeat$4("0", Math.abs(intOffsetIndex)) + intNumStr;
        }
        return absFlag + helperNumberOffsetPoint$1(intNumStr, intOffsetIndex);
      }
      if (dIntOffsetIndex > 0) {
        return absFlag + "0." + helperStringRepeat$4("0", Math.abs(dIntOffsetIndex)) + dIntNumStr + dFloatNumStr;
      }
      return absFlag + helperNumberOffsetPoint$1(dIntNumStr, dIntOffsetIndex) + dFloatNumStr;
    }
    return rest;
  }
  var toNumberString_1 = toNumberString$8;
  var helperNumberDecimal$3 = helperNumberDecimal_1;
  var toNumberString$7 = toNumberString_1;
  function helperMultiply$2(multiplier, multiplicand) {
    var str1 = toNumberString$7(multiplier);
    var str2 = toNumberString$7(multiplicand);
    return parseInt(str1.replace(".", "")) * parseInt(str2.replace(".", "")) / Math.pow(10, helperNumberDecimal$3(str1) + helperNumberDecimal$3(str2));
  }
  var helperMultiply_1 = helperMultiply$2;
  var helperMultiply$1 = helperMultiply_1;
  var toNumber$5 = toNumber_1;
  var toNumberString$6 = toNumberString_1;
  function helperCreateMathNumber$3(name) {
    return function(num, digits) {
      var numRest = toNumber$5(num);
      var rest = numRest;
      if (numRest) {
        digits = digits >> 0;
        var numStr = toNumberString$6(numRest);
        var nums = numStr.split(".");
        var intStr = nums[0];
        var floatStr = nums[1] || "";
        var fStr = floatStr.substring(0, digits + 1);
        var subRest = intStr + (fStr ? "." + fStr : "");
        if (digits >= floatStr.length) {
          return toNumber$5(subRest);
        }
        subRest = numRest;
        if (digits > 0) {
          var ratio = Math.pow(10, digits);
          rest = Math[name](helperMultiply$1(subRest, ratio)) / ratio;
        } else {
          rest = Math[name](subRest);
        }
      }
      return rest;
    };
  }
  var helperCreateMathNumber_1 = helperCreateMathNumber$3;
  var helperCreateMathNumber$2 = helperCreateMathNumber_1;
  var round$3 = helperCreateMathNumber$2("round");
  var round_1 = round$3;
  var helperCreateMathNumber$1 = helperCreateMathNumber_1;
  var ceil$2 = helperCreateMathNumber$1("ceil");
  var ceil_1 = ceil$2;
  var helperCreateMathNumber = helperCreateMathNumber_1;
  var floor$2 = helperCreateMathNumber("floor");
  var floor_1 = floor$2;
  var eqNull$1 = eqNull_1;
  var isNumber$5 = isNumber_1;
  var toNumberString$5 = toNumberString_1;
  function toValueString$e(obj) {
    if (isNumber$5(obj)) {
      return toNumberString$5(obj);
    }
    return "" + (eqNull$1(obj) ? "" : obj);
  }
  var toValueString_1 = toValueString$e;
  var round$2 = round_1;
  var toValueString$d = toValueString_1;
  var helperStringRepeat$3 = helperStringRepeat_1;
  var helperNumberOffsetPoint = helperNumberOffsetPoint_1;
  function toFixed$3(num, digits) {
    digits = digits >> 0;
    var str = toValueString$d(round$2(num, digits));
    var nums = str.split(".");
    var intStr = nums[0];
    var floatStr = nums[1] || "";
    var digitOffsetIndex = digits - floatStr.length;
    if (digits) {
      if (digitOffsetIndex > 0) {
        return intStr + "." + floatStr + helperStringRepeat$3("0", digitOffsetIndex);
      }
      return intStr + helperNumberOffsetPoint(floatStr, Math.abs(digitOffsetIndex));
    }
    return intStr;
  }
  var toFixed_1 = toFixed$3;
  var setupDefaults$6 = setupDefaults_1;
  var round$1 = round_1;
  var ceil$1 = ceil_1;
  var floor$1 = floor_1;
  var isNumber$4 = isNumber_1;
  var toValueString$c = toValueString_1;
  var toFixed$2 = toFixed_1;
  var toNumberString$4 = toNumberString_1;
  var assign$4 = assign_1;
  function commafy$1(num, options) {
    var opts = assign$4({}, setupDefaults$6.commafyOptions, options);
    var optDigits = opts.digits;
    var isNum = isNumber$4(num);
    var rest, result, isNegative, intStr, floatStr;
    if (isNum) {
      rest = (opts.ceil ? ceil$1 : opts.floor ? floor$1 : round$1)(num, optDigits);
      result = toNumberString$4(optDigits ? toFixed$2(rest, optDigits) : rest).split(".");
      intStr = result[0];
      floatStr = result[1];
      isNegative = intStr && rest < 0;
      if (isNegative) {
        intStr = intStr.substring(1, intStr.length);
      }
    } else {
      rest = toValueString$c(num).replace(/,/g, "");
      result = rest ? [rest] : [];
      intStr = result[0];
    }
    if (result.length) {
      return (isNegative ? "-" : "") + intStr.replace(new RegExp("(?=(?!(\\b))(.{" + (opts.spaceNumber || 3) + "})+$)", "g"), opts.separator || ",") + (floatStr ? "." + floatStr : "");
    }
    return rest;
  }
  var commafy_1 = commafy$1;
  var staticParseInt$1 = staticParseInt_1;
  var helperCreateToNumber = helperCreateToNumber_1;
  var toInteger$1 = helperCreateToNumber(staticParseInt$1);
  var toInteger_1 = toInteger$1;
  var helperMultiply = helperMultiply_1;
  var toNumber$4 = toNumber_1;
  function multiply$3(num1, num2) {
    var multiplier = toNumber$4(num1);
    var multiplicand = toNumber$4(num2);
    return helperMultiply(multiplier, multiplicand);
  }
  var multiply_1 = multiply$3;
  var helperNumberDecimal$2 = helperNumberDecimal_1;
  var toNumberString$3 = toNumberString_1;
  var multiply$2 = multiply_1;
  function helperNumberAdd$2(addend, augend) {
    var str1 = toNumberString$3(addend);
    var str2 = toNumberString$3(augend);
    var ratio = Math.pow(10, Math.max(helperNumberDecimal$2(str1), helperNumberDecimal$2(str2)));
    return (multiply$2(addend, ratio) + multiply$2(augend, ratio)) / ratio;
  }
  var helperNumberAdd_1 = helperNumberAdd$2;
  var helperNumberAdd$1 = helperNumberAdd_1;
  var toNumber$3 = toNumber_1;
  function add$1(num1, num2) {
    return helperNumberAdd$1(toNumber$3(num1), toNumber$3(num2));
  }
  var add_1 = add$1;
  var helperNumberDecimal$1 = helperNumberDecimal_1;
  var toNumberString$2 = toNumberString_1;
  var toNumber$2 = toNumber_1;
  var toFixed$1 = toFixed_1;
  function subtract$1(num1, num2) {
    var subtrahend = toNumber$2(num1);
    var minuend = toNumber$2(num2);
    var str1 = toNumberString$2(subtrahend);
    var str2 = toNumberString$2(minuend);
    var digit1 = helperNumberDecimal$1(str1);
    var digit2 = helperNumberDecimal$1(str2);
    var ratio = Math.pow(10, Math.max(digit1, digit2));
    var precision = digit1 >= digit2 ? digit1 : digit2;
    return parseFloat(toFixed$1((subtrahend * ratio - minuend * ratio) / ratio, precision));
  }
  var subtract_1 = subtract$1;
  var helperNumberDecimal = helperNumberDecimal_1;
  var toNumberString$1 = toNumberString_1;
  var multiply$1 = multiply_1;
  function helperNumberDivide$2(divisor, dividend) {
    var str1 = toNumberString$1(divisor);
    var str2 = toNumberString$1(dividend);
    var divisorDecimal = helperNumberDecimal(str1);
    var dividendDecimal = helperNumberDecimal(str2);
    var powY = dividendDecimal - divisorDecimal;
    var isMinus = powY < 0;
    var multiplicand = Math.pow(10, isMinus ? Math.abs(powY) : powY);
    return multiply$1(str1.replace(".", "") / str2.replace(".", ""), isMinus ? 1 / multiplicand : multiplicand);
  }
  var helperNumberDivide_1 = helperNumberDivide$2;
  var helperNumberDivide$1 = helperNumberDivide_1;
  var toNumber$1 = toNumber_1;
  function divide$1(num1, num2) {
    return helperNumberDivide$1(toNumber$1(num1), toNumber$1(num2));
  }
  var divide_1 = divide$1;
  var helperNumberAdd = helperNumberAdd_1;
  var isFunction$2 = isFunction_1;
  var each$3 = each_1;
  var get$2 = get_1;
  function sum$2(array, iterate, context) {
    var result = 0;
    each$3(array, iterate ? isFunction$2(iterate) ? function() {
      result = helperNumberAdd(result, iterate.apply(context, arguments));
    } : function(val) {
      result = helperNumberAdd(result, get$2(val, iterate));
    } : function(val) {
      result = helperNumberAdd(result, val);
    });
    return result;
  }
  var sum_1 = sum$2;
  var helperNumberDivide = helperNumberDivide_1;
  var getSize$1 = getSize_1;
  var sum$1 = sum_1;
  function mean$1(array, iterate, context) {
    return helperNumberDivide(sum$1(array, iterate, context), getSize$1(array));
  }
  var mean_1 = mean$1;
  var staticStrFirst$5 = "first";
  var staticStrFirst_1 = staticStrFirst$5;
  var staticStrLast$4 = "last";
  var staticStrLast_1 = staticStrLast$4;
  function helperGetDateFullYear$5(date) {
    return date.getFullYear();
  }
  var helperGetDateFullYear_1 = helperGetDateFullYear$5;
  var staticDayTime$5 = 864e5;
  var staticDayTime_1 = staticDayTime$5;
  function helperGetDateMonth$4(date) {
    return date.getMonth();
  }
  var helperGetDateMonth_1 = helperGetDateMonth$4;
  var isDate$3 = isDate_1;
  var helperGetDateTime$a = helperGetDateTime_1;
  function isValidDate$c(val) {
    return isDate$3(val) && !isNaN(helperGetDateTime$a(val));
  }
  var isValidDate_1 = isValidDate$c;
  var staticStrFirst$4 = staticStrFirst_1;
  var staticStrLast$3 = staticStrLast_1;
  var staticDayTime$4 = staticDayTime_1;
  var helperGetDateFullYear$4 = helperGetDateFullYear_1;
  var helperGetDateTime$9 = helperGetDateTime_1;
  var helperGetDateMonth$3 = helperGetDateMonth_1;
  var toStringDate$b = toStringDate_1;
  var isValidDate$b = isValidDate_1;
  var isNumber$3 = isNumber_1;
  function getWhatMonth$5(date, offsetMonth, offsetDay) {
    var monthNum = offsetMonth && !isNaN(offsetMonth) ? offsetMonth : 0;
    date = toStringDate$b(date);
    if (isValidDate$b(date)) {
      if (offsetDay === staticStrFirst$4) {
        return new Date(helperGetDateFullYear$4(date), helperGetDateMonth$3(date) + monthNum, 1);
      } else if (offsetDay === staticStrLast$3) {
        return new Date(helperGetDateTime$9(getWhatMonth$5(date, monthNum + 1, staticStrFirst$4)) - 1);
      } else if (isNumber$3(offsetDay)) {
        date.setDate(offsetDay);
      }
      if (monthNum) {
        var currDate = date.getDate();
        date.setMonth(helperGetDateMonth$3(date) + monthNum);
        if (currDate !== date.getDate()) {
          date.setDate(1);
          return new Date(helperGetDateTime$9(date) - staticDayTime$4);
        }
      }
    }
    return date;
  }
  var getWhatMonth_1 = getWhatMonth$5;
  var staticStrFirst$3 = staticStrFirst_1;
  var staticStrLast$2 = staticStrLast_1;
  var helperGetDateFullYear$3 = helperGetDateFullYear_1;
  var getWhatMonth$4 = getWhatMonth_1;
  var toStringDate$a = toStringDate_1;
  var isValidDate$a = isValidDate_1;
  function getWhatYear$4(date, offset, month) {
    var number;
    date = toStringDate$a(date);
    if (isValidDate$a(date)) {
      if (offset) {
        number = offset && !isNaN(offset) ? offset : 0;
        date.setFullYear(helperGetDateFullYear$3(date) + number);
      }
      if (month || !isNaN(month)) {
        if (month === staticStrFirst$3) {
          return new Date(helperGetDateFullYear$3(date), 0, 1);
        } else if (month === staticStrLast$2) {
          date.setMonth(11);
          return getWhatMonth$4(date, 0, staticStrLast$2);
        } else {
          date.setMonth(month);
        }
      }
    }
    return date;
  }
  var getWhatYear_1 = getWhatYear$4;
  var getWhatMonth$3 = getWhatMonth_1;
  var toStringDate$9 = toStringDate_1;
  var isValidDate$9 = isValidDate_1;
  function getQuarterNumber(date) {
    var month = date.getMonth();
    if (month < 3) {
      return 1;
    } else if (month < 6) {
      return 2;
    } else if (month < 9) {
      return 3;
    }
    return 4;
  }
  function getWhatQuarter$1(date, offset, day) {
    var currMonth, monthOffset = offset && !isNaN(offset) ? offset * 3 : 0;
    date = toStringDate$9(date);
    if (isValidDate$9(date)) {
      currMonth = (getQuarterNumber(date) - 1) * 3;
      date.setMonth(currMonth);
      return getWhatMonth$3(date, monthOffset, day);
    }
    return date;
  }
  var getWhatQuarter_1 = getWhatQuarter$1;
  var staticStrFirst$2 = staticStrFirst_1;
  var staticStrLast$1 = staticStrLast_1;
  var staticParseInt = staticParseInt_1;
  var helperGetDateFullYear$2 = helperGetDateFullYear_1;
  var helperGetDateMonth$2 = helperGetDateMonth_1;
  var helperGetDateTime$8 = helperGetDateTime_1;
  var toStringDate$8 = toStringDate_1;
  var isValidDate$8 = isValidDate_1;
  function getWhatDay$2(date, offset, mode) {
    date = toStringDate$8(date);
    if (isValidDate$8(date) && !isNaN(offset)) {
      date.setDate(date.getDate() + staticParseInt(offset));
      if (mode === staticStrFirst$2) {
        return new Date(helperGetDateFullYear$2(date), helperGetDateMonth$2(date), date.getDate());
      } else if (mode === staticStrLast$1) {
        return new Date(helperGetDateTime$8(getWhatDay$2(date, 1, staticStrFirst$2)) - 1);
      }
    }
    return date;
  }
  var getWhatDay_1 = getWhatDay$2;
  function helperStringUpperCase$2(str) {
    return str.toUpperCase();
  }
  var helperStringUpperCase_1 = helperStringUpperCase$2;
  var staticDayTime$3 = staticDayTime_1;
  var staticWeekTime$2 = staticDayTime$3 * 7;
  var staticWeekTime_1 = staticWeekTime$2;
  var setupDefaults$5 = setupDefaults_1;
  var staticDayTime$2 = staticDayTime_1;
  var staticWeekTime$1 = staticWeekTime_1;
  var helperGetDateTime$7 = helperGetDateTime_1;
  var toStringDate$7 = toStringDate_1;
  var isValidDate$7 = isValidDate_1;
  var isNumber$2 = isNumber_1;
  function getWhatWeek$2(date, offsetWeek, offsetDay, firstDay) {
    date = toStringDate$7(date);
    if (isValidDate$7(date)) {
      var hasCustomDay = isNumber$2(offsetDay);
      var hasStartDay = isNumber$2(firstDay);
      var whatDayTime = helperGetDateTime$7(date);
      if (hasCustomDay || hasStartDay) {
        var viewStartDay = hasStartDay ? firstDay : setupDefaults$5.firstDayOfWeek;
        var currentDay = date.getDay();
        var customDay = hasCustomDay ? offsetDay : currentDay;
        if (currentDay !== customDay) {
          var offsetNum = 0;
          if (viewStartDay > currentDay) {
            offsetNum = -(7 - viewStartDay + currentDay);
          } else if (viewStartDay < currentDay) {
            offsetNum = viewStartDay - currentDay;
          }
          if (customDay > viewStartDay) {
            whatDayTime += ((customDay === 0 ? 7 : customDay) - viewStartDay + offsetNum) * staticDayTime$2;
          } else if (customDay < viewStartDay) {
            whatDayTime += (7 - viewStartDay + customDay + offsetNum) * staticDayTime$2;
          } else {
            whatDayTime += offsetNum * staticDayTime$2;
          }
        }
      }
      if (offsetWeek && !isNaN(offsetWeek)) {
        whatDayTime += offsetWeek * staticWeekTime$1;
      }
      return new Date(whatDayTime);
    }
    return date;
  }
  var getWhatWeek_1 = getWhatWeek$2;
  var setupDefaults$4 = setupDefaults_1;
  var staticWeekTime = staticWeekTime_1;
  var isNumber$1 = isNumber_1;
  var isValidDate$6 = isValidDate_1;
  var getWhatWeek$1 = getWhatWeek_1;
  var helperGetDateTime$6 = helperGetDateTime_1;
  function helperCreateGetDateWeek$2(getStartDate) {
    return function(date, firstDay) {
      var viewStartDay = isNumber$1(firstDay) ? firstDay : setupDefaults$4.firstDayOfWeek;
      var targetDate = getWhatWeek$1(date, 0, viewStartDay, viewStartDay);
      if (isValidDate$6(targetDate)) {
        var targetOffsetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        var targerStartDate = getStartDate(targetDate);
        var targetFirstDay = targerStartDate.getDay();
        if (targetFirstDay > viewStartDay) {
          targerStartDate.setDate(7 - targetFirstDay + viewStartDay + 1);
        }
        if (targetFirstDay < viewStartDay) {
          targerStartDate.setDate(viewStartDay - targetFirstDay + 1);
        }
        return Math.floor((helperGetDateTime$6(targetOffsetDate) - helperGetDateTime$6(targerStartDate)) / staticWeekTime + 1);
      }
      return NaN;
    };
  }
  var helperCreateGetDateWeek_1 = helperCreateGetDateWeek$2;
  var helperCreateGetDateWeek$1 = helperCreateGetDateWeek_1;
  var getYearWeek$2 = helperCreateGetDateWeek$1(function(targetDate) {
    return new Date(targetDate.getFullYear(), 0, 1);
  });
  var getYearWeek_1 = getYearWeek$2;
  var helperGetDateFullYear$1 = helperGetDateFullYear_1;
  var helperGetDateMonth$1 = helperGetDateMonth_1;
  function helperGetYMD$1(date) {
    return new Date(helperGetDateFullYear$1(date), helperGetDateMonth$1(date), date.getDate());
  }
  var helperGetYMD_1 = helperGetYMD$1;
  var helperGetDateTime$5 = helperGetDateTime_1;
  var helperGetYMD = helperGetYMD_1;
  function helperGetYMDTime$1(date) {
    return helperGetDateTime$5(helperGetYMD(date));
  }
  var helperGetYMDTime_1 = helperGetYMDTime$1;
  var staticDayTime$1 = staticDayTime_1;
  var staticStrFirst$1 = staticStrFirst_1;
  var helperGetYMDTime = helperGetYMDTime_1;
  var getWhatYear$3 = getWhatYear_1;
  var toStringDate$6 = toStringDate_1;
  var isValidDate$5 = isValidDate_1;
  function getYearDay$2(date) {
    date = toStringDate$6(date);
    if (isValidDate$5(date)) {
      return Math.floor((helperGetYMDTime(date) - helperGetYMDTime(getWhatYear$3(date, 0, staticStrFirst$1))) / staticDayTime$1) + 1;
    }
    return NaN;
  }
  var getYearDay_1 = getYearDay$2;
  var toValueString$b = toValueString_1;
  var isUndefined$4 = isUndefined_1;
  var helperStringRepeat$2 = helperStringRepeat_1;
  function padStart$2(str, targetLength, padString) {
    var rest = toValueString$b(str);
    targetLength = targetLength >> 0;
    padString = isUndefined$4(padString) ? " " : "" + padString;
    if (rest.padStart) {
      return rest.padStart(targetLength, padString);
    }
    if (targetLength > rest.length) {
      targetLength -= rest.length;
      if (targetLength > padString.length) {
        padString += helperStringRepeat$2(padString, targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + rest;
    }
    return rest;
  }
  var padStart_1 = padStart$2;
  var setupDefaults$3 = setupDefaults_1;
  var helperStringUpperCase$1 = helperStringUpperCase_1;
  var helperGetDateFullYear = helperGetDateFullYear_1;
  var helperGetDateMonth = helperGetDateMonth_1;
  var toStringDate$5 = toStringDate_1;
  var getYearWeek$1 = getYearWeek_1;
  var getYearDay$1 = getYearDay_1;
  var assign$3 = assign_1;
  var isValidDate$4 = isValidDate_1;
  var isFunction$1 = isFunction_1;
  var padStart$1 = padStart_1;
  function handleCustomTemplate(date, formats, match, value) {
    var format = formats[match];
    if (format) {
      if (isFunction$1(format)) {
        return format(value, match, date);
      } else {
        return format[value];
      }
    }
    return value;
  }
  var dateFormatRE = /\[([^\]]+)]|y{2,4}|M{1,2}|d{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|Z{1,2}|W{1,2}|D{1,3}|[aAeEq]/g;
  function toDateString$2(date, format, options) {
    if (date) {
      date = toStringDate$5(date);
      if (isValidDate$4(date)) {
        var result = format || setupDefaults$3.parseDateFormat || setupDefaults$3.formatString;
        var hours = date.getHours();
        var apm = hours < 12 ? "am" : "pm";
        var formats = assign$3({}, setupDefaults$3.parseDateRules || setupDefaults$3.formatStringMatchs, options ? options.formats : null);
        var fy = function(match, length) {
          return ("" + helperGetDateFullYear(date)).substr(4 - length);
        };
        var fM = function(match, length) {
          return padStart$1(helperGetDateMonth(date) + 1, length, "0");
        };
        var fd = function(match, length) {
          return padStart$1(date.getDate(), length, "0");
        };
        var fH = function(match, length) {
          return padStart$1(hours, length, "0");
        };
        var fh = function(match, length) {
          return padStart$1(hours <= 12 ? hours : hours - 12, length, "0");
        };
        var fm = function(match, length) {
          return padStart$1(date.getMinutes(), length, "0");
        };
        var fs = function(match, length) {
          return padStart$1(date.getSeconds(), length, "0");
        };
        var fS = function(match, length) {
          return padStart$1(date.getMilliseconds(), length, "0");
        };
        var fZ = function(match, length) {
          var zoneHours = date.getTimezoneOffset() / 60 * -1;
          return handleCustomTemplate(date, formats, match, (zoneHours >= 0 ? "+" : "-") + padStart$1(zoneHours, 2, "0") + (length === 1 ? ":" : "") + "00");
        };
        var fW = function(match, length) {
          return padStart$1(handleCustomTemplate(date, formats, match, getYearWeek$1(date, (options ? options.firstDay : null) || setupDefaults$3.firstDayOfWeek)), length, "0");
        };
        var fD = function(match, length) {
          return padStart$1(handleCustomTemplate(date, formats, match, getYearDay$1(date)), length, "0");
        };
        var parseDates = {
          yyyy: fy,
          yy: fy,
          MM: fM,
          M: fM,
          dd: fd,
          d: fd,
          HH: fH,
          H: fH,
          hh: fh,
          h: fh,
          mm: fm,
          m: fm,
          ss: fs,
          s: fs,
          SSS: fS,
          S: fS,
          ZZ: fZ,
          Z: fZ,
          WW: fW,
          W: fW,
          DDD: fD,
          D: fD,
          a: function(match) {
            return handleCustomTemplate(date, formats, match, apm);
          },
          A: function(match) {
            return handleCustomTemplate(date, formats, match, helperStringUpperCase$1(apm));
          },
          e: function(match) {
            return handleCustomTemplate(date, formats, match, date.getDay());
          },
          E: function(match) {
            return handleCustomTemplate(date, formats, match, date.getDay());
          },
          q: function(match) {
            return handleCustomTemplate(date, formats, match, Math.floor((helperGetDateMonth(date) + 3) / 3));
          }
        };
        return result.replace(dateFormatRE, function(match, skip) {
          return skip || (parseDates[match] ? parseDates[match](match, match.length) : match);
        });
      }
      return "Invalid Date";
    }
    return "";
  }
  var toDateString_1 = toDateString$2;
  var helperGetDateTime$4 = helperGetDateTime_1;
  var helperNewDate$2 = helperNewDate_1;
  var now$2 = Date.now || function() {
    return helperGetDateTime$4(helperNewDate$2());
  };
  var now_1 = now$2;
  var helperGetDateTime$3 = helperGetDateTime_1;
  var now$1 = now_1;
  var toStringDate$4 = toStringDate_1;
  var isDate$2 = isDate_1;
  var timestamp$1 = function(str, format) {
    if (str) {
      var date = toStringDate$4(str, format);
      return isDate$2(date) ? helperGetDateTime$3(date) : date;
    }
    return now$1();
  };
  var timestamp_1 = timestamp$1;
  var toDateString$1 = toDateString_1;
  function isDateSame$1(date1, date2, format) {
    if (date1 && date2) {
      date1 = toDateString$1(date1, format);
      return date1 !== "Invalid Date" && date1 === toDateString$1(date2, format);
    }
    return false;
  }
  var isDateSame_1 = isDateSame$1;
  var helperCreateGetDateWeek = helperCreateGetDateWeek_1;
  var getMonthWeek$1 = helperCreateGetDateWeek(function(targetDate) {
    return new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  });
  var getMonthWeek_1 = getMonthWeek$1;
  var getWhatYear$2 = getWhatYear_1;
  var toStringDate$3 = toStringDate_1;
  var isValidDate$3 = isValidDate_1;
  var isLeapYear$1 = isLeapYear_1;
  function getDayOfYear$1(date, year) {
    date = toStringDate$3(date);
    if (isValidDate$3(date)) {
      return isLeapYear$1(getWhatYear$2(date, year)) ? 366 : 365;
    }
    return NaN;
  }
  var getDayOfYear_1 = getDayOfYear$1;
  var staticDayTime = staticDayTime_1;
  var staticStrFirst = staticStrFirst_1;
  var staticStrLast = staticStrLast_1;
  var helperGetDateTime$2 = helperGetDateTime_1;
  var getWhatMonth$2 = getWhatMonth_1;
  var toStringDate$2 = toStringDate_1;
  var isValidDate$2 = isValidDate_1;
  function getDayOfMonth$1(date, month) {
    date = toStringDate$2(date);
    if (isValidDate$2(date)) {
      return Math.floor((helperGetDateTime$2(getWhatMonth$2(date, month, staticStrLast)) - helperGetDateTime$2(getWhatMonth$2(date, month, staticStrFirst))) / staticDayTime) + 1;
    }
    return NaN;
  }
  var getDayOfMonth_1 = getDayOfMonth$1;
  var setupDefaults$2 = setupDefaults_1;
  var helperGetDateTime$1 = helperGetDateTime_1;
  var helperNewDate$1 = helperNewDate_1;
  var toStringDate$1 = toStringDate_1;
  var isValidDate$1 = isValidDate_1;
  function getDateDiff$1(startDate, endDate, rules) {
    var startTime, endTime, item, diffTime, rule2, len2, index;
    var result = { done: false, time: 0 };
    startDate = toStringDate$1(startDate);
    endDate = endDate ? toStringDate$1(endDate) : helperNewDate$1();
    if (isValidDate$1(startDate) && isValidDate$1(endDate)) {
      startTime = helperGetDateTime$1(startDate);
      endTime = helperGetDateTime$1(endDate);
      if (startTime < endTime) {
        diffTime = result.time = endTime - startTime;
        rule2 = rules && rules.length > 0 ? rules : setupDefaults$2.dateDiffRules;
        result.done = true;
        for (index = 0, len2 = rule2.length; index < len2; index++) {
          item = rule2[index];
          if (diffTime >= item[1]) {
            if (index === len2 - 1) {
              result[item[0]] = diffTime || 0;
            } else {
              result[item[0]] = Math.floor(diffTime / item[1]);
              diffTime -= result[item[0]] * item[1];
            }
          } else {
            result[item[0]] = 0;
          }
        }
      }
    }
    return result;
  }
  var getDateDiff_1 = getDateDiff$1;
  var toValueString$a = toValueString_1;
  var isUndefined$3 = isUndefined_1;
  var helperStringRepeat$1 = helperStringRepeat_1;
  function padEnd$1(str, targetLength, padString) {
    var rest = toValueString$a(str);
    targetLength = targetLength >> 0;
    padString = isUndefined$3(padString) ? " " : "" + padString;
    if (rest.padEnd) {
      return rest.padEnd(targetLength, padString);
    }
    if (targetLength > rest.length) {
      targetLength -= rest.length;
      if (targetLength > padString.length) {
        padString += helperStringRepeat$1(padString, targetLength / padString.length);
      }
      return rest + padString.slice(0, targetLength);
    }
    return rest;
  }
  var padEnd_1 = padEnd$1;
  var toValueString$9 = toValueString_1;
  var helperStringRepeat = helperStringRepeat_1;
  function repeat$1(str, count) {
    return helperStringRepeat(toValueString$9(str), count);
  }
  var repeat_1 = repeat$1;
  var toValueString$8 = toValueString_1;
  function trimRight$2(str) {
    return str && str.trimRight ? str.trimRight() : toValueString$8(str).replace(/[\s\uFEFF\xA0]+$/g, "");
  }
  var trimRight_1 = trimRight$2;
  var toValueString$7 = toValueString_1;
  function trimLeft$2(str) {
    return str && str.trimLeft ? str.trimLeft() : toValueString$7(str).replace(/^[\s\uFEFF\xA0]+/g, "");
  }
  var trimLeft_1 = trimLeft$2;
  var trimRight$1 = trimRight_1;
  var trimLeft$1 = trimLeft_1;
  function trim$2(str) {
    return str && str.trim ? str.trim() : trimRight$1(trimLeft$1(str));
  }
  var trim_1 = trim$2;
  var staticEscapeMap$2 = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };
  var staticEscapeMap_1 = staticEscapeMap$2;
  var toValueString$6 = toValueString_1;
  var keys$2 = keys_1;
  function helperFormatEscaper$2(dataMap) {
    var replaceRegexp = new RegExp("(?:" + keys$2(dataMap).join("|") + ")", "g");
    return function(str) {
      return toValueString$6(str).replace(replaceRegexp, function(match) {
        return dataMap[match];
      });
    };
  }
  var helperFormatEscaper_1 = helperFormatEscaper$2;
  var staticEscapeMap$1 = staticEscapeMap_1;
  var helperFormatEscaper$1 = helperFormatEscaper_1;
  var escape$2 = helperFormatEscaper$1(staticEscapeMap$1);
  var _escape = escape$2;
  var staticEscapeMap = staticEscapeMap_1;
  var helperFormatEscaper = helperFormatEscaper_1;
  var each$2 = each_1;
  var unescapeMap = {};
  each$2(staticEscapeMap, function(item, key2) {
    unescapeMap[staticEscapeMap[key2]] = key2;
  });
  var unescape$2 = helperFormatEscaper(unescapeMap);
  var _unescape = unescape$2;
  function helperStringSubstring$2(str, start, end) {
    return str.substring(start, end);
  }
  var helperStringSubstring_1 = helperStringSubstring$2;
  function helperStringLowerCase$2(str) {
    return str.toLowerCase();
  }
  var helperStringLowerCase_1 = helperStringLowerCase$2;
  var toValueString$5 = toValueString_1;
  var helperStringSubstring$1 = helperStringSubstring_1;
  var helperStringUpperCase = helperStringUpperCase_1;
  var helperStringLowerCase$1 = helperStringLowerCase_1;
  var camelCacheMaps = {};
  function camelCase$1(str) {
    str = toValueString$5(str);
    if (camelCacheMaps[str]) {
      return camelCacheMaps[str];
    }
    var strLen = str.length;
    var rest = str.replace(/([-]+)/g, function(text, flag, index) {
      return index && index + flag.length < strLen ? "-" : "";
    });
    strLen = rest.length;
    rest = rest.replace(/([A-Z]+)/g, function(text, upper, index) {
      var upperLen = upper.length;
      upper = helperStringLowerCase$1(upper);
      if (index) {
        if (upperLen > 2 && index + upperLen < strLen) {
          return helperStringUpperCase(helperStringSubstring$1(upper, 0, 1)) + helperStringSubstring$1(upper, 1, upperLen - 1) + helperStringUpperCase(helperStringSubstring$1(upper, upperLen - 1, upperLen));
        }
        return helperStringUpperCase(helperStringSubstring$1(upper, 0, 1)) + helperStringSubstring$1(upper, 1, upperLen);
      } else {
        if (upperLen > 1 && index + upperLen < strLen) {
          return helperStringSubstring$1(upper, 0, upperLen - 1) + helperStringUpperCase(helperStringSubstring$1(upper, upperLen - 1, upperLen));
        }
      }
      return upper;
    }).replace(/(-[a-zA-Z])/g, function(text, upper) {
      return helperStringUpperCase(helperStringSubstring$1(upper, 1, upper.length));
    });
    camelCacheMaps[str] = rest;
    return rest;
  }
  var camelCase_1 = camelCase$1;
  var toValueString$4 = toValueString_1;
  var helperStringSubstring = helperStringSubstring_1;
  var helperStringLowerCase = helperStringLowerCase_1;
  var kebabCacheMaps = {};
  function kebabCase$1(str) {
    str = toValueString$4(str);
    if (kebabCacheMaps[str]) {
      return kebabCacheMaps[str];
    }
    if (/^[A-Z]+$/.test(str)) {
      return helperStringLowerCase(str);
    }
    var rest = str.replace(/^([a-z])([A-Z]+)([a-z]+)$/, function(text, prevLower, upper, nextLower) {
      var upperLen = upper.length;
      if (upperLen > 1) {
        return prevLower + "-" + helperStringLowerCase(helperStringSubstring(upper, 0, upperLen - 1)) + "-" + helperStringLowerCase(helperStringSubstring(upper, upperLen - 1, upperLen)) + nextLower;
      }
      return helperStringLowerCase(prevLower + "-" + upper + nextLower);
    }).replace(/^([A-Z]+)([a-z]+)?$/, function(text, upper, nextLower) {
      var upperLen = upper.length;
      return helperStringLowerCase(helperStringSubstring(upper, 0, upperLen - 1) + "-" + helperStringSubstring(upper, upperLen - 1, upperLen) + (nextLower || ""));
    }).replace(/([a-z]?)([A-Z]+)([a-z]?)/g, function(text, prevLower, upper, nextLower, index) {
      var upperLen = upper.length;
      if (upperLen > 1) {
        if (prevLower) {
          prevLower += "-";
        }
        if (nextLower) {
          return (prevLower || "") + helperStringLowerCase(helperStringSubstring(upper, 0, upperLen - 1)) + "-" + helperStringLowerCase(helperStringSubstring(upper, upperLen - 1, upperLen)) + nextLower;
        }
      }
      return (prevLower || "") + (index ? "-" : "") + helperStringLowerCase(upper) + (nextLower || "");
    });
    rest = rest.replace(/([-]+)/g, function(text, flag, index) {
      return index && index + flag.length < rest.length ? "-" : "";
    });
    kebabCacheMaps[str] = rest;
    return rest;
  }
  var kebabCase_1 = kebabCase$1;
  var toValueString$3 = toValueString_1;
  function startsWith$1(str, val, startIndex) {
    var rest = toValueString$3(str);
    return (arguments.length === 1 ? rest : rest.substring(startIndex)).indexOf(val) === 0;
  }
  var startsWith_1 = startsWith$1;
  var toValueString$2 = toValueString_1;
  function endsWith$1(str, val, startIndex) {
    var rest = toValueString$2(str);
    var argsLen = arguments.length;
    return argsLen > 1 && (argsLen > 2 ? rest.substring(0, startIndex).indexOf(val) === startIndex - 1 : rest.indexOf(val) === rest.length - 1);
  }
  var endsWith_1 = endsWith$1;
  var setupDefaults$1 = setupDefaults_1;
  var toValueString$1 = toValueString_1;
  var trim$1 = trim_1;
  var get$1 = get_1;
  function template$2(str, args, options) {
    return toValueString$1(str).replace((options || setupDefaults$1).tmplRE || /\{{2}([.\w[\]\s]+)\}{2}/g, function(match, key2) {
      return get$1(args, trim$1(key2));
    });
  }
  var template_1 = template$2;
  var template$1 = template_1;
  function toFormatString$1(str, obj) {
    return template$1(str, obj, { tmplRE: /\{([.\w[\]\s]+)\}/g });
  }
  var toFormatString_1 = toFormatString$1;
  function noop$1() {
  }
  var noop_1 = noop$1;
  var slice$5 = slice_1;
  function bind$1(callback, context) {
    var args = slice$5(arguments, 2);
    return function() {
      return callback.apply(context, slice$5(arguments).concat(args));
    };
  }
  var bind_1 = bind$1;
  var slice$4 = slice_1;
  function once$1(callback, context) {
    var done = false;
    var rest = null;
    var args = slice$4(arguments, 2);
    return function() {
      if (done) {
        return rest;
      }
      rest = callback.apply(context, slice$4(arguments).concat(args));
      done = true;
      return rest;
    };
  }
  var once_1 = once$1;
  var slice$3 = slice_1;
  function after$1(count, callback, context) {
    var runCount = 0;
    var rests = [];
    return function() {
      var args = arguments;
      runCount++;
      if (runCount <= count) {
        rests.push(args[0]);
      }
      if (runCount >= count) {
        callback.apply(context, [rests].concat(slice$3(args)));
      }
    };
  }
  var after_1 = after$1;
  var slice$2 = slice_1;
  function before$1(count, callback, context) {
    var runCount = 0;
    var rests = [];
    context = context || this;
    return function() {
      var args = arguments;
      runCount++;
      if (runCount < count) {
        rests.push(args[0]);
        callback.apply(context, [rests].concat(slice$2(args)));
      }
    };
  }
  var before_1 = before$1;
  function throttle$1(callback, wait, options) {
    var args, context;
    var opts = options || {};
    var runFlag = false;
    var timeout = 0;
    var optLeading = "leading" in opts ? opts.leading : true;
    var optTrailing = "trailing" in opts ? opts.trailing : false;
    var runFn = function() {
      {
        runFlag = true;
        callback.apply(context, args);
        timeout = setTimeout(endFn, wait);
      }
    };
    var endFn = function() {
      timeout = 0;
      if (!runFlag && optTrailing === true) {
        runFn();
      }
    };
    var cancelFn = function() {
      var rest = timeout !== 0;
      clearTimeout(timeout);
      args = null;
      context = null;
      runFlag = false;
      timeout = 0;
      return rest;
    };
    var throttled = function() {
      args = arguments;
      context = this;
      runFlag = false;
      if (timeout === 0) {
        if (optLeading === true) {
          runFn();
        } else if (optTrailing === true) {
          timeout = setTimeout(endFn, wait);
        }
      }
    };
    throttled.cancel = cancelFn;
    return throttled;
  }
  var throttle_1 = throttle$1;
  function debounce$1(callback, wait, options) {
    var args, context;
    var opts = options || {};
    var runFlag = false;
    var timeout = 0;
    var isLeading = typeof options === "boolean";
    var optLeading = "leading" in opts ? opts.leading : isLeading;
    var optTrailing = "trailing" in opts ? opts.trailing : !isLeading;
    var runFn = function() {
      {
        runFlag = true;
        timeout = 0;
        callback.apply(context, args);
      }
    };
    var endFn = function() {
      if (optLeading === true) {
        timeout = 0;
      }
      if (!runFlag && optTrailing === true) {
        runFn();
      }
    };
    var cancelFn = function() {
      var rest = timeout !== 0;
      clearTimeout(timeout);
      args = null;
      context = null;
      timeout = 0;
      return rest;
    };
    var debounced = function() {
      runFlag = false;
      args = arguments;
      context = this;
      if (timeout === 0) {
        if (optLeading === true) {
          runFn();
        }
      } else {
        clearTimeout(timeout);
      }
      timeout = setTimeout(endFn, wait);
    };
    debounced.cancel = cancelFn;
    return debounced;
  }
  var debounce_1 = debounce$1;
  var slice$1 = slice_1;
  function delay$1(callback, wait) {
    var args = slice$1(arguments, 2);
    var context = this;
    return setTimeout(function() {
      callback.apply(context, args);
    }, wait);
  }
  var delay_1 = delay$1;
  var staticDecodeURIComponent$2 = decodeURIComponent;
  var staticDecodeURIComponent_1 = staticDecodeURIComponent$2;
  var staticDecodeURIComponent$1 = staticDecodeURIComponent_1;
  var arrayEach$3 = arrayEach_1;
  var isString$1 = isString_1;
  function unserialize$2(str) {
    var items;
    var result = {};
    if (str && isString$1(str)) {
      arrayEach$3(str.split("&"), function(param) {
        items = param.split("=");
        result[staticDecodeURIComponent$1(items[0])] = staticDecodeURIComponent$1(items[1] || "");
      });
    }
    return result;
  }
  var unserialize_1 = unserialize$2;
  var staticEncodeURIComponent$2 = encodeURIComponent;
  var staticEncodeURIComponent_1 = staticEncodeURIComponent$2;
  var staticEncodeURIComponent$1 = staticEncodeURIComponent_1;
  var each$1 = each_1;
  var isArray$2 = isArray_1;
  var isNull$1 = isNull_1;
  var isUndefined$2 = isUndefined_1;
  var isPlainObject$1 = isPlainObject_1;
  function stringifyParams(resultVal, resultKey, isArr) {
    var _arr;
    var result = [];
    each$1(resultVal, function(item, key2) {
      _arr = isArray$2(item);
      if (isPlainObject$1(item) || _arr) {
        result = result.concat(stringifyParams(item, resultKey + "[" + key2 + "]", _arr));
      } else {
        result.push(staticEncodeURIComponent$1(resultKey + "[" + (isArr ? "" : key2) + "]") + "=" + staticEncodeURIComponent$1(isNull$1(item) ? "" : item));
      }
    });
    return result;
  }
  function serialize$1(query) {
    var _arr;
    var params = [];
    each$1(query, function(item, key2) {
      if (!isUndefined$2(item)) {
        _arr = isArray$2(item);
        if (isPlainObject$1(item) || _arr) {
          params = params.concat(stringifyParams(item, key2, _arr));
        } else {
          params.push(staticEncodeURIComponent$1(key2) + "=" + staticEncodeURIComponent$1(isNull$1(item) ? "" : item));
        }
      }
    });
    return params.join("&").replace(/%20/g, "+");
  }
  var serialize_1 = serialize$1;
  var staticStrUndefined$1 = staticStrUndefined_1;
  var staticLocation$4 = typeof location === staticStrUndefined$1 ? 0 : location;
  var staticLocation_1 = staticLocation$4;
  var staticLocation$3 = staticLocation_1;
  function helperGetLocatOrigin$2() {
    return staticLocation$3 ? staticLocation$3.origin || staticLocation$3.protocol + "//" + staticLocation$3.host : "";
  }
  var helperGetLocatOrigin_1 = helperGetLocatOrigin$2;
  var staticLocation$2 = staticLocation_1;
  var unserialize$1 = unserialize_1;
  var helperGetLocatOrigin$1 = helperGetLocatOrigin_1;
  function parseURLQuery(uri) {
    return unserialize$1(uri.split("?")[1] || "");
  }
  function parseUrl$2(url) {
    var hashs, portText, searchs, parsed;
    var href = "" + url;
    if (href.indexOf("//") === 0) {
      href = (staticLocation$2 ? staticLocation$2.protocol : "") + href;
    } else if (href.indexOf("/") === 0) {
      href = helperGetLocatOrigin$1() + href;
    }
    searchs = href.replace(/#.*/, "").match(/(\?.*)/);
    parsed = {
      href,
      hash: "",
      host: "",
      hostname: "",
      protocol: "",
      port: "",
      search: searchs && searchs[1] && searchs[1].length > 1 ? searchs[1] : ""
    };
    parsed.path = href.replace(/^([a-z0-9.+-]*:)\/\//, function(text, protocol) {
      parsed.protocol = protocol;
      return "";
    }).replace(/^([a-z0-9.+-]*)(:\d+)?\/?/, function(text, hostname, port) {
      portText = port || "";
      parsed.port = portText.replace(":", "");
      parsed.hostname = hostname;
      parsed.host = hostname + portText;
      return "/";
    }).replace(/(#.*)/, function(text, hash) {
      parsed.hash = hash.length > 1 ? hash : "";
      return "";
    });
    hashs = parsed.hash.match(/#((.*)\?|(.*))/);
    parsed.pathname = parsed.path.replace(/(\?|#.*).*/, "");
    parsed.origin = parsed.protocol + "//" + parsed.host;
    parsed.hashKey = hashs ? hashs[2] || hashs[1] || "" : "";
    parsed.hashQuery = parseURLQuery(parsed.hash);
    parsed.searchQuery = parseURLQuery(parsed.search);
    return parsed;
  }
  var parseUrl_1 = parseUrl$2;
  var staticLocation$1 = staticLocation_1;
  var helperGetLocatOrigin = helperGetLocatOrigin_1;
  var lastIndexOf$1 = lastIndexOf_1;
  function getBaseURL$1() {
    if (staticLocation$1) {
      var pathname = staticLocation$1.pathname;
      var lastIndex = lastIndexOf$1(pathname, "/") + 1;
      return helperGetLocatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex));
    }
    return "";
  }
  var getBaseURL_1 = getBaseURL$1;
  var staticLocation = staticLocation_1;
  var parseUrl$1 = parseUrl_1;
  function locat$1() {
    return staticLocation ? parseUrl$1(staticLocation.href) : {};
  }
  var locat_1 = locat$1;
  var setupDefaults = setupDefaults_1;
  var staticDocument$1 = staticDocument_1;
  var staticDecodeURIComponent = staticDecodeURIComponent_1;
  var staticEncodeURIComponent = staticEncodeURIComponent_1;
  var isArray$1 = isArray_1;
  var isObject$1 = isObject_1;
  var isDate$1 = isDate_1;
  var isUndefined$1 = isUndefined_1;
  var includes$1 = includes_1;
  var keys$1 = keys_1;
  var assign$2 = assign_1;
  var arrayEach$2 = arrayEach_1;
  var helperNewDate = helperNewDate_1;
  var helperGetDateTime = helperGetDateTime_1;
  var getWhatYear$1 = getWhatYear_1;
  var getWhatMonth$1 = getWhatMonth_1;
  var getWhatDay$1 = getWhatDay_1;
  function toCookieUnitTime(unit, expires) {
    var num = parseFloat(expires);
    var nowdate = helperNewDate();
    var time = helperGetDateTime(nowdate);
    switch (unit) {
      case "y":
        return helperGetDateTime(getWhatYear$1(nowdate, num));
      case "M":
        return helperGetDateTime(getWhatMonth$1(nowdate, num));
      case "d":
        return helperGetDateTime(getWhatDay$1(nowdate, num));
      case "h":
      case "H":
        return time + num * 60 * 60 * 1e3;
      case "m":
        return time + num * 60 * 1e3;
      case "s":
        return time + num * 1e3;
    }
    return time;
  }
  function toCookieUTCString(date) {
    return (isDate$1(date) ? date : new Date(date)).toUTCString();
  }
  function cookie$1(name, value, options) {
    if (staticDocument$1) {
      var opts, expires, values2, result, cookies, keyIndex;
      var inserts = [];
      var args = arguments;
      if (isArray$1(name)) {
        inserts = name;
      } else if (args.length > 1) {
        inserts = [assign$2({ name, value }, options)];
      } else if (isObject$1(name)) {
        inserts = [name];
      }
      if (inserts.length > 0) {
        arrayEach$2(inserts, function(obj) {
          opts = assign$2({}, setupDefaults.cookies, obj);
          values2 = [];
          if (opts.name) {
            expires = opts.expires;
            values2.push(staticEncodeURIComponent(opts.name) + "=" + staticEncodeURIComponent(isObject$1(opts.value) ? JSON.stringify(opts.value) : opts.value));
            if (expires) {
              if (isNaN(expires)) {
                expires = expires.replace(/^([0-9]+)(y|M|d|H|h|m|s)$/, function(text, num, unit) {
                  return toCookieUTCString(toCookieUnitTime(unit, num));
                });
              } else if (/^[0-9]{11,13}$/.test(expires) || isDate$1(expires)) {
                expires = toCookieUTCString(expires);
              } else {
                expires = toCookieUTCString(toCookieUnitTime("d", expires));
              }
              opts.expires = expires;
            }
            arrayEach$2(["expires", "path", "domain", "secure"], function(key2) {
              if (!isUndefined$1(opts[key2])) {
                values2.push(opts[key2] && key2 === "secure" ? key2 : key2 + "=" + opts[key2]);
              }
            });
          }
          staticDocument$1.cookie = values2.join("; ");
        });
        return true;
      } else {
        result = {};
        cookies = staticDocument$1.cookie;
        if (cookies) {
          arrayEach$2(cookies.split("; "), function(val) {
            keyIndex = val.indexOf("=");
            result[staticDecodeURIComponent(val.substring(0, keyIndex))] = staticDecodeURIComponent(val.substring(keyIndex + 1) || "");
          });
        }
        return args.length === 1 ? result[name] : result;
      }
    }
    return false;
  }
  function hasCookieItem(value) {
    return includes$1(cookieKeys(), value);
  }
  function getCookieItem(name) {
    return cookie$1(name);
  }
  function setCookieItem(name, value, options) {
    cookie$1(name, value, options);
    return cookie$1;
  }
  function removeCookieItem(name, options) {
    cookie$1(name, "", assign$2({ expires: -1 }, setupDefaults.cookies, options));
  }
  function cookieKeys() {
    return keys$1(cookie$1());
  }
  function cookieJson() {
    return cookie$1();
  }
  assign$2(cookie$1, {
    has: hasCookieItem,
    set: setCookieItem,
    setItem: setCookieItem,
    get: getCookieItem,
    getItem: getCookieItem,
    remove: removeCookieItem,
    removeItem: removeCookieItem,
    keys: cookieKeys,
    getJSON: cookieJson
  });
  var cookie_1 = cookie$1;
  var staticStrUndefined = staticStrUndefined_1;
  var staticDocument = staticDocument_1;
  var staticWindow = staticWindow_1;
  var assign$1 = assign_1;
  var arrayEach$1 = arrayEach_1;
  function isBrowseStorage(storage2) {
    try {
      var testKey = "__xe_t";
      storage2.setItem(testKey, 1);
      storage2.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  function isBrowseType(type) {
    return navigator.userAgent.indexOf(type) > -1;
  }
  function browse$1() {
    var $body, isChrome, isEdge;
    var isMobile = false;
    var result = {
      isNode: false,
      isMobile,
      isPC: false,
      isDoc: !!staticDocument
    };
    if (!staticWindow && typeof process !== staticStrUndefined) {
      result.isNode = true;
    } else {
      isEdge = isBrowseType("Edge");
      isChrome = isBrowseType("Chrome");
      isMobile = /(Android|webOS|iPhone|iPad|iPod|SymbianOS|BlackBerry|Windows Phone)/.test(navigator.userAgent);
      if (result.isDoc) {
        $body = staticDocument.body || staticDocument.documentElement;
        arrayEach$1(["webkit", "khtml", "moz", "ms", "o"], function(core) {
          result["-" + core] = !!$body[core + "MatchesSelector"];
        });
      }
      assign$1(result, {
        edge: isEdge,
        firefox: isBrowseType("Firefox"),
        msie: !isEdge && result["-ms"],
        safari: !isChrome && !isEdge && isBrowseType("Safari"),
        isMobile,
        isPC: !isMobile,
        isLocalStorage: isBrowseStorage(staticWindow.localStorage),
        isSessionStorage: isBrowseStorage(staticWindow.sessionStorage)
      });
    }
    return result;
  }
  var browse_1 = browse$1;
  var XEUtils = ctor;
  var assign = assign_1;
  var objectEach = objectEach_1;
  var lastObjectEach = lastObjectEach_1;
  var objectMap = objectMap_1;
  var merge = merge_1;
  var map = map_1;
  var some = some_1;
  var every = every_1;
  var includeArrays = includeArrays_1;
  var arrayEach = arrayEach_1;
  var lastArrayEach = lastArrayEach_1;
  var uniq = uniq_1;
  var union = union_1;
  var toArray = toArray_1;
  var sortBy = sortBy_1;
  var orderBy = orderBy_1;
  var shuffle = shuffle_1;
  var sample = sample_1;
  var slice = slice_1;
  var filter = filter_1;
  var findKey = findKey_1;
  var includes = includes_1;
  var find = find_1;
  var findLast = findLast_1;
  var reduce = reduce_1;
  var copyWithin = copyWithin_1;
  var chunk = chunk_1;
  var zip = zip_1;
  var unzip = unzip_1;
  var zipObject = zipObject_1;
  var flatten = flatten_1;
  var pluck = pluck_1;
  var invoke = invoke_1;
  var toArrayTree = toArrayTree_1;
  var toTreeArray = toTreeArray_1;
  var findTree = findTree_1;
  var eachTree = eachTree_1;
  var mapTree = mapTree_1;
  var filterTree = filterTree_1;
  var searchTree = searchTree_1;
  var arrayIndexOf = arrayIndexOf_1;
  var arrayLastIndexOf = arrayLastIndexOf_1;
  var hasOwnProp = hasOwnProp_1;
  var isArray = isArray_1;
  var isNull = isNull_1;
  var isNumberNaN = _isNaN;
  var isUndefined = isUndefined_1;
  var isFunction = isFunction_1;
  var isObject = isObject_1;
  var isString = isString_1;
  var isPlainObject = isPlainObject_1;
  var isLeapYear = isLeapYear_1;
  var isDate = isDate_1;
  var eqNull = eqNull_1;
  var each = each_1;
  var forOf = forOf_1;
  var lastForOf = lastForOf_1;
  var indexOf = indexOf_1;
  var lastIndexOf = lastIndexOf_1;
  var keys = keys_1;
  var values = values_1;
  var clone = clone_1;
  var getSize = getSize_1;
  var lastEach = lastEach_1;
  var remove = remove_1;
  var clear = clear_1;
  var isNumberFinite = _isFinite;
  var isFloat = isFloat_1;
  var isInteger = isInteger_1;
  var isBoolean = isBoolean_1;
  var isNumber = isNumber_1;
  var isRegExp = isRegExp_1;
  var isError = isError_1;
  var isTypeError = isTypeError_1;
  var isEmpty = isEmpty_1;
  var isSymbol = isSymbol_1;
  var isArguments = isArguments_1;
  var isElement = isElement_1;
  var isDocument = isDocument_1;
  var isWindow = isWindow_1;
  var isFormData = isFormData_1;
  var isMap = isMap_1;
  var isWeakMap = isWeakMap_1;
  var isSet = isSet_1;
  var isWeakSet = isWeakSet_1;
  var isMatch = isMatch_1;
  var isEqual = isEqual_1;
  var isEqualWith = isEqualWith_1;
  var getType = getType_1;
  var uniqueId = uniqueId_1;
  var findIndexOf = findIndexOf_1;
  var findLastIndexOf = findLastIndexOf_1;
  var toStringJSON = toStringJSON_1;
  var toJSONString = toJSONString_1;
  var entries = entries_1;
  var pick = pick_1;
  var omit = omit_1;
  var first = first_1;
  var last = last_1;
  var has = has_1;
  var get = get_1;
  var set = set_1;
  var groupBy = groupBy_1;
  var countBy = countBy_1;
  var range = range_1;
  var destructuring = destructuring_1;
  var random = random_1;
  var max = max_1;
  var min = min_1;
  var commafy = commafy_1;
  var round = round_1;
  var ceil = ceil_1;
  var floor = floor_1;
  var toFixed = toFixed_1;
  var toInteger = toInteger_1;
  var toNumber = toNumber_1;
  var toNumberString = toNumberString_1;
  var add = add_1;
  var subtract = subtract_1;
  var multiply = multiply_1;
  var divide = divide_1;
  var sum = sum_1;
  var mean = mean_1;
  var getWhatYear = getWhatYear_1;
  var getWhatQuarter = getWhatQuarter_1;
  var getWhatMonth = getWhatMonth_1;
  var getWhatDay = getWhatDay_1;
  var toStringDate = toStringDate_1;
  var toDateString = toDateString_1;
  var now = now_1;
  var timestamp = timestamp_1;
  var isValidDate = isValidDate_1;
  var isDateSame = isDateSame_1;
  var getWhatWeek = getWhatWeek_1;
  var getYearDay = getYearDay_1;
  var getYearWeek = getYearWeek_1;
  var getMonthWeek = getMonthWeek_1;
  var getDayOfYear = getDayOfYear_1;
  var getDayOfMonth = getDayOfMonth_1;
  var getDateDiff = getDateDiff_1;
  var padEnd = padEnd_1;
  var padStart = padStart_1;
  var repeat = repeat_1;
  var trim = trim_1;
  var trimRight = trimRight_1;
  var trimLeft = trimLeft_1;
  var escape$1 = _escape;
  var unescape$1 = _unescape;
  var camelCase = camelCase_1;
  var kebabCase = kebabCase_1;
  var startsWith = startsWith_1;
  var endsWith = endsWith_1;
  var template = template_1;
  var toFormatString = toFormatString_1;
  var toValueString = toValueString_1;
  var noop = noop_1;
  var property = property_1;
  var bind = bind_1;
  var once = once_1;
  var after = after_1;
  var before = before_1;
  var throttle = throttle_1;
  var debounce = debounce_1;
  var delay = delay_1;
  var unserialize = unserialize_1;
  var serialize = serialize_1;
  var parseUrl = parseUrl_1;
  var getBaseURL = getBaseURL_1;
  var locat = locat_1;
  var cookie = cookie_1;
  var browse = browse_1;
  assign(XEUtils, {
    // object
    assign,
    objectEach,
    lastObjectEach,
    objectMap,
    merge,
    // array
    uniq,
    union,
    sortBy,
    orderBy,
    shuffle,
    sample,
    some,
    every,
    slice,
    filter,
    find,
    findLast,
    findKey,
    includes,
    arrayIndexOf,
    arrayLastIndexOf,
    map,
    reduce,
    copyWithin,
    chunk,
    zip,
    unzip,
    zipObject,
    flatten,
    toArray,
    includeArrays,
    pluck,
    invoke,
    arrayEach,
    lastArrayEach,
    toArrayTree,
    toTreeArray,
    findTree,
    eachTree,
    mapTree,
    filterTree,
    searchTree,
    // base
    hasOwnProp,
    eqNull,
    isNaN: isNumberNaN,
    isFinite: isNumberFinite,
    isUndefined,
    isArray,
    isFloat,
    isInteger,
    isFunction,
    isBoolean,
    isString,
    isNumber,
    isRegExp,
    isObject,
    isPlainObject,
    isDate,
    isError,
    isTypeError,
    isEmpty,
    isNull,
    isSymbol,
    isArguments,
    isElement,
    isDocument,
    isWindow,
    isFormData,
    isMap,
    isWeakMap,
    isSet,
    isWeakSet,
    isLeapYear,
    isMatch,
    isEqual,
    isEqualWith,
    getType,
    uniqueId,
    getSize,
    indexOf,
    lastIndexOf,
    findIndexOf,
    findLastIndexOf,
    toStringJSON,
    toJSONString,
    keys,
    values,
    entries,
    pick,
    omit,
    first,
    last,
    each,
    forOf,
    lastForOf,
    lastEach,
    has,
    get,
    set,
    groupBy,
    countBy,
    clone,
    clear,
    remove,
    range,
    destructuring,
    // number
    random,
    min,
    max,
    commafy,
    round,
    ceil,
    floor,
    toFixed,
    toNumber,
    toNumberString,
    toInteger,
    add,
    subtract,
    multiply,
    divide,
    sum,
    mean,
    // date
    now,
    timestamp,
    isValidDate,
    isDateSame,
    toStringDate,
    toDateString,
    getWhatYear,
    getWhatQuarter,
    getWhatMonth,
    getWhatWeek,
    getWhatDay,
    getYearDay,
    getYearWeek,
    getMonthWeek,
    getDayOfYear,
    getDayOfMonth,
    getDateDiff,
    // string
    trim,
    trimLeft,
    trimRight,
    escape: escape$1,
    unescape: unescape$1,
    camelCase,
    kebabCase,
    repeat,
    padStart,
    padEnd,
    startsWith,
    endsWith,
    template,
    toFormatString,
    toString: toValueString,
    toValueString,
    // function
    noop,
    property,
    bind,
    once,
    after,
    before,
    throttle,
    debounce,
    delay,
    // url
    unserialize,
    serialize,
    parseUrl,
    // web
    getBaseURL,
    locat,
    browse,
    cookie
  });
  var xeUtils = XEUtils;
  const TokenKey = "App-Token";
  function getToken() {
    return uni.getStorageSync(TokenKey);
  }
  function setToken(token) {
    return uni.setStorageSync(TokenKey, token);
  }
  function removeToken() {
    return uni.removeStorageSync(TokenKey);
  }
  function checkPermission(path) {
    if (!getToken()) {
      if (config.NO_TOKEN_WHITE_LIST.includes(path)) {
        return true;
      } else {
        uni.showToast({
          title: "页面【" + path + "】需要进行登录，才能进行访问！",
          icon: "none"
        });
        uni.reLaunch({
          url: config.NO_TOKEN_BACK_URL
        });
        return false;
      }
    }
  }
  function configSysBaseList() {
    return request$1({
      url: "/dev/config/sysBaseList",
      headers: {
        isToken: true
      },
      method: "get",
      timeout: 2e4
    });
  }
  function dictTree(data) {
    return request$1({
      url: "/dev/dict/tree",
      method: "get",
      data
    });
  }
  const global$1 = {
    state: {
      // token信息
      token: getToken(),
      // 用户移动端菜单（用户菜单处理后的结果）
      userMobileMenus: storage.get(constant.userMobileMenus),
      // 用户信息
      userInfo: storage.get(constant.userInfo),
      // 系统配置
      sysBaseConfig: storage.get(constant.sysBaseConfig),
      // 字典数据
      dictTypeTreeData: storage.get(constant.dictTypeTreeData)
    },
    mutations: {
      SET_token: (state, token) => {
        state.token = token;
        setToken(token);
      },
      SET_userMobileMenus: (state, userMobileMenus) => {
        state.userMobileMenus = userMobileMenus;
        storage.set(constant.userMobileMenus, userMobileMenus);
      },
      SET_userInfo: (state, userInfo) => {
        state.userInfo = userInfo;
        storage.set(constant.userInfo, userInfo);
      },
      SET_sysBaseConfig: (state, sysBaseConfig) => {
        state.sysBaseConfig = sysBaseConfig;
        storage.set(constant.sysBaseConfig, sysBaseConfig);
      },
      SET_dictTypeTreeData: (state, dictTypeTreeData) => {
        state.dictTypeTreeData = dictTypeTreeData;
        storage.set(constant.dictTypeTreeData, dictTypeTreeData);
      },
      // 清除缓存
      CLEAR_cache: (state) => {
        state.token = "";
        removeToken();
        state.userMobileMenus = {};
        storage.remove(constant.userMobileMenus);
        state.userInfo = {};
        storage.remove(constant.userInfo);
        state.dictTypeTreeData = {};
        storage.remove(constant.dictTypeTreeData);
        state.sysBaseConfig = {};
        storage.remove(constant.sysBaseConfig);
      }
    },
    actions: {
      // 登录获取token
      Login({
        commit
      }, userInfo) {
        const paramData = {
          account: userInfo.account.trim(),
          // 密码进行SM2加密，传输过程中看到的只有密文，后端存储使用hash
          password: smCrypto.doSm2Encrypt(userInfo.password),
          validCode: userInfo.validCode,
          validCodeReqNo: userInfo.validCodeReqNo
        };
        return new Promise((resolve, reject2) => {
          login(paramData).then((res) => {
            commit("SET_token", res.data);
            resolve(res.data);
          }).catch((error) => {
            reject2(error);
          });
        });
      },
      // 获取用户信息
      GetUserInfo({
        commit,
        state
      }) {
        return new Promise((resolve, reject2) => {
          getLoginUser().then((res) => {
            commit("SET_userInfo", res.data);
            resolve(res.data);
          }).catch((error) => {
            reject2(error);
          });
        });
      },
      // 获取登錄用戶菜單
      GetUserLoginMenu({
        commit,
        state
      }) {
        return new Promise((resolve, reject2) => {
          userLoginMobileMenu().then((res) => {
            commit("SET_userMobileMenus", res.data);
            resolve(res.data);
          }).catch((error) => {
            reject2(error);
          });
        });
      },
      // 获取数据字典
      GetDictTypeTreeData({
        commit,
        state
      }) {
        return new Promise((resolve, reject2) => {
          dictTree().then((res) => {
            if (res.data) {
              commit("SET_dictTypeTreeData", res.data);
              resolve(res.data);
            }
          }).catch((error) => {
            reject2(error);
          });
        });
      },
      // 获取系统基础配置
      GetSysBaseConfig({
        commit,
        state
      }) {
        return new Promise((resolve, reject2) => {
          let sysBaseConfig = config.SYS_BASE_CONFIG;
          commit("SET_sysBaseConfig", sysBaseConfig);
          configSysBaseList().then((res) => {
            if (res.data) {
              res.data.forEach((item) => {
                sysBaseConfig[item.configKey] = item.configValue;
              });
              commit("SET_sysBaseConfig", sysBaseConfig);
              resolve(sysBaseConfig);
            }
          });
        }).catch((error) => {
          reject(error);
        });
      },
      // 退出系统
      LogOut({
        commit,
        state,
        dispatch
      }) {
        return new Promise((resolve, reject2) => {
          logout().then(() => {
            commit("CLEAR_cache");
            resolve();
          }).catch((error) => {
            reject2(error);
          });
        });
      }
    }
  };
  const getters = {
    token: (state) => state.global.token,
    // userMenus: state => state.global.userMenus,
    userMobileMenus: (state) => state.global.userMobileMenus,
    userInfo: (state) => state.global.userInfo,
    sysBaseConfig: (state) => state.global.sysBaseConfig,
    dictTypeTreeData: (state) => state.global.dictTypeTreeData
  };
  const store = createStore({
    modules: {
      global: global$1
    },
    getters
  });
  const reloadCodes = [401, 1011007, 1011008];
  const errorCodeMap = {
    400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
    401: "用户没有权限（令牌、用户名、密码错误）。",
    403: "用户得到授权，但是访问是被禁止的。",
    404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
    406: "请求的格式不可得。",
    410: "请求的资源被永久删除，且不会再得到的。",
    422: "当创建一个对象时，发生一个验证错误。",
    500: "服务器发生错误，请检查服务器。",
    502: "网关错误。",
    503: "服务不可用，服务器暂时过载或维护。",
    504: "网关超时。",
    "default": "系统未知错误，请反馈给管理员"
  };
  function toast(content) {
    uni.showToast({
      icon: "none",
      title: content
    });
  }
  function showConfirm(content) {
    return new Promise((resolve, reject2) => {
      uni.showModal({
        title: "提示",
        content,
        cancelText: "取消",
        confirmText: "确定",
        success: function(res) {
          resolve(res);
        }
      });
    });
  }
  function tansParams(params) {
    let result = "";
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && value !== "" && typeof value !== "undefined") {
        if (typeof value === "object") {
          for (const key2 of Object.keys(value)) {
            if (value[key2] !== null && value[key2] !== "" && typeof value[key2] !== "undefined") {
              let params2 = propName + "[" + key2 + "]";
              var subPart = encodeURIComponent(params2) + "=";
              result += subPart + encodeURIComponent(value[key2]) + "&";
            }
          }
        } else {
          result += part + encodeURIComponent(value) + "&";
        }
      }
    }
    return result;
  }
  const prefixUrl = (url) => {
    {
      return url;
    }
  };
  const {
    BASE_URL,
    TIMEOUT,
    TOKEN_NAME,
    TOKEN_PREFIX,
    TENANT_DOMAIN
  } = config;
  const request = (config2) => {
    config2.url = prefixUrl(config2.url);
    const isToken = (config2.headers || {}).isToken === false;
    config2.header = config2.header || {};
    if (getToken() && !isToken) {
      config2.header[TOKEN_NAME] = TOKEN_PREFIX + getToken();
    }
    config2.header.Domain = TENANT_DOMAIN;
    if (config2.params) {
      let url = config2.url + "?" + tansParams(config2.params);
      url = url.slice(0, -1);
      config2.url = url;
    }
    return new Promise((resolve, reject2) => {
      uni.request({
        method: config2.method || "get",
        timeout: config2.timeout || TIMEOUT,
        url: config2.baseUrl || BASE_URL + config2.url,
        data: config2.data,
        header: config2.header,
        dataType: "json"
      }).then((response) => {
        const code = response.data.code || 200;
        const msg = response.data.msg || errorCodeMap[code] || errorCodeMap["default"];
        if (reloadCodes.includes(code)) {
          showConfirm("登录状态已过期，您可以清除缓存，重新进行登录?").then((res) => {
            if (res.confirm) {
              store.commit("CLEAR_cache");
              uni.reLaunch({
                url: "/pages/login"
              });
            }
          });
          reject2("无效的会话，或者会话已过期，请重新登录。");
        } else if (code !== 200) {
          toast(msg);
          reject2(code);
        }
        resolve(response.data);
      }).catch((error) => {
        let {
          errMsg
        } = error;
        if (errMsg === "Network Error") {
          errMsg = "后端接口连接异常";
        } else if (errMsg.includes("timeout")) {
          errMsg = "系统接口请求超时";
        } else if (errMsg.includes("Request failed with status code")) {
          errMsg = "系统接口" + errMsg.substr(errMsg.length - 3) + "异常";
        } else if (errMsg.includes("request:fail")) {
          errMsg = "请求失败";
        }
        toast(errMsg);
        reject2(error);
      });
    });
  };
  const request$1 = request;
  function login(data) {
    return request$1({
      url: "/auth/c/doLogin",
      headers: {
        isToken: false
      },
      method: "post",
      data
    });
  }
  function getLoginUser() {
    return request$1({
      url: "/auth/getLoginUser",
      method: "get"
    });
  }
  function logout() {
    return request$1({
      url: "/auth/doLogout",
      method: "get"
    });
  }
  function getPicCaptcha() {
    return request$1({
      url: "/auth/b/getPicCaptcha",
      headers: {
        isToken: false
      },
      method: "get",
      timeout: 2e4
    });
  }
  const _sfc_main$5 = {
    __name: "login",
    setup(__props) {
      const {
        proxy
      } = vue.getCurrentInstance();
      let sysBaseConfig = vue.ref({});
      store.dispatch("GetSysBaseConfig").then((configData) => {
        sysBaseConfig.value = configData;
        if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
          loginCaptcha();
        }
      });
      const validCodeBase64 = vue.ref("");
      const loginForm = vue.reactive({
        account: "123",
        password: "123",
        validCode: "",
        validCodeReqNo: ""
      });
      const loginCaptcha = () => {
        getPicCaptcha().then((res) => {
          validCodeBase64.value = res.data.validCodeBase64;
          loginForm.validCodeReqNo = res.data.validCodeReqNo;
        });
      };
      const handleLogin = async () => {
        if (loginForm.account === "") {
          proxy.$modal.msgError("请输入您的账号");
        } else if (loginForm.password === "") {
          proxy.$modal.msgError("请输入您的密码");
        } else if (loginForm.validCode === "" && sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === "true") {
          proxy.$modal.msgError("请输入验证码");
        } else {
          pwdLogin();
        }
      };
      const pwdLogin = async () => {
        proxy.$modal.loading("登录中...");
        store.dispatch("Login", loginForm).then(() => {
          Promise.all([
            // store.dispatch('GetUserLoginMenu'),
            store.dispatch("GetUserInfo")
            // store.dispatch('GetDictTypeTreeData'),
          ]).then((result) => {
            proxy.$tab.reLaunch("/pages/home/index");
            proxy.$modal.closeLoading();
          }).catch((err) => {
            formatAppLog("error", "at pages/login.vue:106", err);
          });
        }).catch((err) => {
          formatAppLog("error", "at pages/login.vue:109", err);
        });
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "normal-login-container" }, [
          vue.createElementVNode("view", { class: "logo-content align-center justify-center flex" }, [
            vue.createElementVNode("image", {
              style: { "width": "100rpx", "height": "100rpx" },
              alt: vue.unref(sysBaseConfig).SNOWY_SYS_NAME,
              src: vue.unref(sysBaseConfig).SNOWY_SYS_LOGO,
              mode: "widthFix"
            }, null, 8, ["alt", "src"]),
            vue.createElementVNode(
              "text",
              { class: "title" },
              vue.toDisplayString(vue.unref(sysBaseConfig).SNOWY_SYS_NAME) + " " + vue.toDisplayString(vue.unref(sysBaseConfig).SNOWY_SYS_VERSION),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "login-form-content" }, [
            vue.createElementVNode("view", { class: "input-item flex align-center" }, [
              vue.createElementVNode("view", { class: "iconfont icon-user icon" }),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => loginForm.account = $event),
                  class: "input",
                  type: "text",
                  placeholder: "请输入账号",
                  maxlength: "30"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, loginForm.account]
              ])
            ]),
            vue.createElementVNode("view", { class: "input-item flex align-center" }, [
              vue.createElementVNode("view", { class: "iconfont icon-password icon" }),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => loginForm.password = $event),
                  type: "password",
                  class: "input",
                  placeholder: "请输入密码",
                  maxlength: "20"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, loginForm.password]
              ])
            ]),
            vue.unref(sysBaseConfig).SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === "true" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "input-item flex align-center"
            }, [
              vue.createElementVNode("view", { class: "iconfont icon-code icon" }),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => loginForm.validCode = $event),
                  type: "text",
                  class: "input",
                  placeholder: "请输入验证码",
                  maxlength: "4"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, loginForm.validCode]
              ]),
              vue.createElementVNode("image", {
                src: validCodeBase64.value,
                onClick: loginCaptcha,
                class: "login-code-img"
              }, null, 8, ["src"])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "action-btn" }, [
              vue.createElementVNode("button", {
                onClick: handleLogin,
                class: "login-btn cu-btn block bg-blue lg round"
              }, "登录")
            ])
          ])
        ]);
      };
    }
  };
  const PagesLogin = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__file", "D:/workSpaces/snowy/gp/mobile/pages/login.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        webviewStyles: {
          progress: {
            color: "#FF3333"
          }
        }
      };
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("web-view", {
        "webview-styles": $data.webviewStyles,
        src: "/static/html/html/strategy/dynamics.html"
      }, null, 8, ["webview-styles"])
    ]);
  }
  const PagesStrategyIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/workSpaces/snowy/gp/mobile/pages/strategy/index.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        webviewStyles: {
          progress: {
            color: "#FF3333"
          }
        }
      };
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("web-view", {
        "webview-styles": $data.webviewStyles,
        src: "/static/html/html/stock/buy.html"
      }, null, 8, ["webview-styles"])
    ]);
  }
  const PagesStockIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/workSpaces/snowy/gp/mobile/pages/stock/index.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        webviewStyles: {
          progress: {
            color: "#FF3333"
          }
        }
      };
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("web-view", {
        "webview-styles": $data.webviewStyles,
        src: "/static/html/html/order/index.html"
      }, null, 8, ["webview-styles"])
    ]);
  }
  const PagesOrderIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/workSpaces/snowy/gp/mobile/pages/order/index.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        webviewStyles: {
          progress: {
            color: "#FF3333"
          }
        }
      };
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("web-view", {
        "webview-styles": $data.webviewStyles,
        src: "/static/html/html/user/home.html"
      }, null, 8, ["webview-styles"])
    ]);
  }
  const PagesUserIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/workSpaces/snowy/gp/mobile/pages/user/index.vue"]]);
  __definePage("pages/home/index", PagesHomeIndex);
  __definePage("pages/login", PagesLogin);
  __definePage("pages/strategy/index", PagesStrategyIndex);
  __definePage("pages/stock/index", PagesStockIndex);
  __definePage("pages/order/index", PagesOrderIndex);
  __definePage("pages/user/index", PagesUserIndex);
  const _sfc_main = {
    onLaunch: function() {
      store.dispatch("GetSysBaseConfig");
    },
    onShow: function() {
    },
    onHide: function() {
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/workSpaces/snowy/gp/mobile/App.vue"]]);
  let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  list.forEach((item) => {
    uni.addInterceptor(item, {
      invoke(args) {
        return checkPermission(args.url.split("?")[0]);
      },
      fail(err) {
        formatAppLog("log", "at interceptor.js:15", err);
      }
    });
  });
  var vxeUtils_common = {};
  (function(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    function VXEUtils2(app, XEUtils2, options) {
      var isV3 = typeof app !== "function";
      var mounts = options && options.mounts && options.mounts.length ? options.mounts.join(";") : [];
      var variate = "$utils";
      var setMount = function setMount2(name) {
        if (mounts.indexOf(name) > -1) {
          if (isV3) {
            app.config.globalProperties["$" + name] = XEUtils2[name];
          } else {
            app.prototype["$" + name] = XEUtils2[name];
          }
        }
      };
      if (isV3) {
        app.config.globalProperties[variate] = XEUtils2;
      } else {
        Object.defineProperty(app.prototype, variate, {
          get: function get2() {
            XEUtils2.$context = this;
            return XEUtils2;
          }
        });
      }
      setMount("cookie");
      setMount("browse");
      setMount("locat");
    }
    var _default = VXEUtils2;
    exports["default"] = _default;
  })(vxeUtils_common);
  const VXEUtils = /* @__PURE__ */ getDefaultExportFromCjs(vxeUtils_common);
  const tab = {
    // 关闭所有页面，打开到应用内的某个页面
    reLaunch(url) {
      return uni.reLaunch({
        url
      });
    },
    // 跳转到tabBar页面，并关闭其他所有非tabBar页面
    switchTab(url) {
      return uni.switchTab({
        url
      });
    },
    // 关闭当前页面，跳转到应用内的某个页面
    redirectTo(url) {
      return uni.redirectTo({
        url
      });
    },
    // 保留当前页面，跳转到应用内的某个页面
    navigateTo(url) {
      return uni.navigateTo({
        url
      });
    },
    // 关闭当前页面，返回上一页面或多级页面
    navigateBack() {
      return uni.navigateBack();
    }
  };
  const modal = {
    // 消息提示
    msg(content) {
      uni.showToast({
        title: content,
        icon: "none"
      });
    },
    // 错误消息
    msgError(content) {
      uni.showToast({
        title: content,
        icon: "error"
      });
    },
    // 成功消息
    msgSuccess(content) {
      uni.showToast({
        title: content,
        icon: "success"
      });
    },
    // 隐藏消息
    hideMsg(content) {
      uni.hideToast();
    },
    // 弹出提示
    alert(content) {
      uni.showModal({
        title: "提示",
        content,
        showCancel: false
      });
    },
    // 确认窗体
    confirm(content) {
      return new Promise((resolve, reject2) => {
        uni.showModal({
          title: "系统提示",
          content,
          cancelText: "取消",
          confirmText: "确定",
          success: function(res) {
            if (res.confirm) {
              resolve(res.confirm);
            }
          }
        });
      });
    },
    // 提示信息
    showToast(option) {
      if (typeof option === "object") {
        uni.showToast(option);
      } else {
        uni.showToast({
          title: option,
          icon: "none",
          duration: 2500
        });
      }
    },
    // 打开遮罩层
    loading(content) {
      uni.showLoading({
        title: content,
        icon: "none"
      });
    },
    // 关闭遮罩层
    closeLoading() {
      uni.hideLoading();
    }
  };
  const tool = {};
  tool.dictTypeData = (dictValue, value) => {
    const dictTypeTree = store.getters.dictTypeTreeData;
    if (!dictTypeTree) {
      return "需重新登录";
    }
    const tree = dictTypeTree.find((item) => item.dictValue === dictValue);
    if (!tree) {
      return "无此字典";
    }
    const children = tree.children;
    const dict = children.find((item) => item.dictValue === value);
    return (dict == null ? void 0 : dict.name) || "无此字典";
  };
  tool.dictList = (dictValue) => {
    const dictTypeTree = store.getters.dictTypeTreeData;
    if (!dictTypeTree) {
      return [];
    }
    const tree = dictTypeTree.find((item) => item.dictValue === dictValue);
    if (tree) {
      return tree.children.map((item) => {
        return {
          value: item["dictValue"],
          text: item["name"]
        };
      });
    }
    return [];
  };
  function hasPerm(data, rule2 = "or") {
    if (!data) {
      return false;
    }
    const userInfo = store.getters.userInfo;
    if (!userInfo) {
      return false;
    }
    const { mobileButtonCodeList } = userInfo;
    if (!mobileButtonCodeList) {
      return false;
    }
    if (Array.isArray(data)) {
      const fn = rule2 === "or" ? "some" : "every";
      return data[fn]((item) => mobileButtonCodeList.includes(item));
    }
    return mobileButtonCodeList.includes(data);
  }
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(VXEUtils, xeUtils, { mounts: ["cookie"] });
    app.config.globalProperties.$tab = tab;
    app.config.globalProperties.$modal = modal;
    app.config.globalProperties.$store = store;
    app.config.globalProperties.$tool = tool;
    app.config.globalProperties.hasPerm = hasPerm;
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
