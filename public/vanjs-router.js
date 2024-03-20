
// https://github.com/iuroc/vanjs-router
// ts to js converter.
//import van, { ChildDom, PropValueOrDerived, Props, PropsWithKnownKeys } from 'vanjs-core' //for typescript
//import van, { ChildDom, PropValueOrDerived, Props, PropsWithKnownKeys } from 'https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.3.0.nomodule.min.js'; //for typescript
//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.3.0.min.js";
import {van} from '/dps.js';
const { div } = van.tags;

/** from `location.hash` Get current route */
export const nowRoute = () => {
  const li = location.hash.split("/")
  const route = { name: li[1] ?? "home", args: li.slice(2) }
  return route
}

export const activeRoute = van.state(nowRoute())

window.addEventListener("hashchange", () => {
  activeRoute.val = nowRoute()
})

export const Route = (first, ...rest) => {
  const { name, onFirst, onLoad, ...otherProp } = first
  let firstLoad = true
  van.derive(() => {
    if (activeRoute.val.name == first.name) {
      if (firstLoad && first.onFirst) {
        first.onFirst(activeRoute.val)
        firstLoad = false
      }
      if (first.onLoad) first.onLoad(activeRoute.val)
    }
  })
  return div(
    { hidden: () => first.name != activeRoute.val.name, ...otherProp },
    rest
  )
}

export const routeTo = (name = "home", args = []) => {
  if (args.length == 0) {
    if (name == "home") {
      location.hash = ""
      history.replaceState(null, "", "./")
    } else location.hash = `/${name}`
  } else location.hash = `/${name}/${args.join("/")}`
}