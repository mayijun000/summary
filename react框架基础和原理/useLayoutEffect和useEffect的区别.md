# useLayoutEffect和useEffect的区别

`useEffect` 和 `useLayoutEffect`，我们使用的最多的应该就是`useEffect`。那他们两个到底有什么不一样的地方？

### 使用方式

这两个函数的使用方式其实非常简单，他们都接受一个函数一个数组，只有在数组里面的值改变的情况下才会再次执行 effect。所以对于使用方式我就不过多介绍了，不清楚的可以先参考[官网 ](https://link.zhihu.com/?target=https%3A//zh-hans.reactjs.org/docs/hooks-reference.html)。

### 差异

- `useEffect` 是异步执行的，而`useLayoutEffect`是同步执行的。
- `useEffect` 的执行时机是浏览器完成渲染之后，而 `useLayoutEffect` 的执行时机是浏览器把内容真正渲染到界面之前，和 `componentDidMount` 等价。

### 具体表现

我们用一个很简单的例子

```js
import React, { useEffect, useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [state, setState] = useState("hello world")

  useEffect(() => {
    let i = 0;
    while(i <= 100000000) {
      i++;
    };
    setState("world hello");
  }, []);

  // useLayoutEffect(() => {
  //   let i = 0;
  //   while(i <= 100000000) {
  //     i++;
  //   };
  //   setState("world hello");
  // }, []);

  return (
    <>
      <div>{state}</div>
    </>
  );
}

export default App;
```

这是它的效果

![img](https://pic1.zhimg.com/v2-1bd5e1f4ee47d408cb4d09f784dbd544_b.jpg)

而换成 `useLayoutEffect` 之后闪烁现象就消失了

![img](https://pic1.zhimg.com/v2-090a4d5a6deb4dd492ebd262aefaac0c_b.jpg)

看到这里我相信你应该能理解他们的区别了，因为 `useEffect` 是渲染完之后异步执行的，所以会导致 hello world 先被渲染到了屏幕上，再变成 world hello，就会出现闪烁现象。而 `useLayoutEffect` 是渲染之前同步执行的，所以会等它执行完再渲染上去，就避免了闪烁现象。也就是说我们最好把操作 dom 的相关操作放到 `useLayouteEffect` 中去，避免导致闪烁。

### ssr

也正是因为 `useLayoutEffect` 可能会导致渲染结果不一样的关系，如果你在 ssr 的时候使用这个函数会有一个 warning。

```text
Warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://fb.me/react-uselayouteffect-ssr for common fixes.
```

这是因为 `useLayoutEffect` 是不会在服务端执行的，所以就有可能导致 ssr 渲染出来的内容和实际的首屏内容并不一致。而解决这个问题也很简单：

1. 放弃使用 `useLayoutEffect`，使用 `useEffect` 代替
2. 如果你明确知道 `useLayouteffect` 对于首屏渲染并没有影响，但是后续会需要，你可以这样写

```js
import { useEffect, useLayoutEffect } from 'react';
export const useCustomLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```

当你使用 `useLayoutEffect` 的时候就用 `useCustomLayoutEffect` 代替。这样在服务端就会用 `useEffect` ，这样就不会报 warning 了。

### 源码剖析

那么 `useEffect` 和 `useLayoutEffect` 到底是在什么时候被调用的呢？我们去源码中一探究竟。

### useEffect

首先找到 `useEffect` 调用的入口

```js
function updateEffect(create, deps) {
  {
    // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
    if ('undefined' !== typeof jest) {
      warnIfNotCurrentlyActingEffectsInDEV(currentlyRenderingFiber$1);
    }
  }

  return updateEffectImpl(Update | Passive, Passive$1, create, deps);
}
```

调用 `updateEffectImpl` 时传入的 `hookEffectTag` 为 Passive$1, 所以我们找一下：Passive$1。

然后我们找到是在这里传入了 Passive$1 类型来调用 `useEffect` 。

```js
function commitPassiveHookEffects(finishedWork) {
  if ((finishedWork.effectTag & Passive) !== NoEffect) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent:
      case Block:
        {
          // TODO (#17945) We should call all passive destroy functions (for all fibers)
          // before calling any create functions. The current approach only serializes
          // these for a single fiber.
          commitHookEffectListUnmount(Passive$1 | HasEffect, finishedWork);
          commitHookEffectListMount(Passive$1 | HasEffect, finishedWork);
          break;
        }
    }
  }
}
```

那我们继续顺藤摸瓜找 `commitPassiveHookEffects`

```js
function flushPassiveEffectsImpl() {
    ...省略
    while (_effect2 !== null) {
      {
        setCurrentFiber(_effect2);
        invokeGuardedCallback(null, commitPassiveHookEffects, null, _effect2);
      }
   }
    ...省略
}
```

老样子，找`flushPassiveEffectsImpl`

```js
function flushPassiveEffects() {
  if (pendingPassiveEffectsRenderPriority !== NoPriority) {
    var priorityLevel = pendingPassiveEffectsRenderPriority > NormalPriority ? NormalPriority : pendingPassiveEffectsRenderPriority;
    pendingPassiveEffectsRenderPriority = NoPriority;
    return runWithPriority$1(priorityLevel, flushPassiveEffectsImpl);
  }
}
```

再往上一层是`commitBeforeMutationEffects`，这里面调用`flushPassiveEffects`的方法是`scheduleCallback`，这是一个调度操作，是异步执行的。

```js
function commitBeforeMutationEffects{
    ...省略
    if ((effectTag & Passive) !== NoEffect) {
      // If there are passive effects, schedule a callback to flush at
      // the earliest opportunity.
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalPriority, function () {
          flushPassiveEffects();
          return null;
        });
      }
    }
    ...省略
}
```

继续顺着 `commitBeforeMutationEffects`方法往上找的话，我们可以找到最终调用 useEffect 的地方是 `commitRootImpl` ，这是我们 commit 阶段会调用的一个函数，所以就是在这里面对 `useEffect` 进行了调度，在完成渲染工作以后去异步执行了 `useEffect` 。

### useLayoutEffect

老样子，从入口找起

```js
function updateLayoutEffect(create, deps) {
  return updateEffectImpl(Update, Layout, create, deps);
}
```

这里传进去的 `hookEffectTag` 是`Layout`，那么我们找一下`Layout`。

```js
function commitLifeCycles(finishedRoot, current, finishedWork, committedExpirationTime) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block:
      {
        // At this point layout effects have already been destroyed (during mutation phase).
        // This is done to prevent sibling component effects from interfering with each other,
        // e.g. a destroy function in one component should never override a ref set
        // by a create function in another component during the same commit.
        commitHookEffectListMount(Layout | HasEffect, finishedWork);

        return;
      }

    case ClassComponent:
      {
        var instance = finishedWork.stateNode;

        if (finishedWork.effectTag & Update) {
          if (current === null) {
            startPhaseTimer(finishedWork, 'componentDidMount'); // We could update instance props and state here,
            // but instead we rely on them being set during last render.
            // TODO: revisit this when we implement resuming.

            {
              if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                if (instance.props !== finishedWork.memoizedProps) {
                  error('Expected %s props to match memoized props before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }

                if (instance.state !== finishedWork.memoizedState) {
                  error('Expected %s state to match memoized state before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }
              }
            }

            instance.componentDidMount();
            stopPhaseTimer();
          } else {
            var prevProps = finishedWork.elementType === finishedWork.type ? current.memoizedProps : resolveDefaultProps(finishedWork.type, current.memoizedProps);
            var prevState = current.memoizedState;
            startPhaseTimer(finishedWork, 'componentDidUpdate'); // We could update instance props and state here,
            // but instead we rely on them being set during last render.
            // TODO: revisit this when we implement resuming.

            {
              if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                if (instance.props !== finishedWork.memoizedProps) {
                  error('Expected %s props to match memoized props before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }

                if (instance.state !== finishedWork.memoizedState) {
                  error('Expected %s state to match memoized state before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }
              }
            }

            instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
            stopPhaseTimer();
          }
        }
      ...省略
}
```

而在这里我们可以看到，class 组件的 `componentDidMount`生命周期也是在这里被调用的，所以其实`useLayoutEffect`是和`componentDidMount`等价的。

而一直往上找最后还是会找到 `commitRootImpl`方法中去，同时在这个过程中并没有找到什么调度的方法，所以 `useLayoutEffect`会同步执行。

### 总结

1. 优先使用 `useEffect`，因为它是异步执行的，不会阻塞渲染
2. 会影响到渲染的操作尽量放到 `useLayoutEffect`中去，避免出现闪烁问题
3. `useLayoutEffect`和`componentDidMount`是等价的，会同步调用，阻塞渲染
4. 在服务端渲染的时候使用会有一个 warning，因为它可能导致首屏实际内容和服务端渲染出来的内容不一致。