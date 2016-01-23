import Rx from 'rx'
import Cycle from '@cycle/core'
import { div, input, makeDOMDriver } from '@cycle/dom'
import { $input } from 'style/formElements'
import { $center, $column, $row } from 'style/flex'

/*
 *  Helpers
 */

let If = (c, e) => c ? e : null
let Unless = (c, e) => c ? null : e

/*
 *  MVI
 */

let intent = ({ DOM }) => ({
  formSubmitted$: DOM.select(`input`).events(`keydown`)
    .filter(ev => ev.which === 13)
    .map(x => true),

  username$: DOM.select(`input`).events(`change`)
    .map(ev => event.target.value)
})

let model = ({ formSubmitted$, username$ }) =>
  Rx.Observable.combineLatest(
    username$.startWith(``),
    formSubmitted$.startWith(false),
    (username, formSubmitted) => ({ username, formSubmitted })
  )

let view = model$ =>
  model$.map(({ username, formSubmitted }) =>
    div([
      Unless(formSubmitted,
        div({ style: $center }, [
          input({
            type: `text`,
            style: $input,
            placeholder: "enter your username.."
          })
        ])
      ),
      If(formSubmitted,
        div({ style: { ...$column, width: `16rem` }}, [
          div({ style: { ...$row, color: `white` }}, [
            `Hello ${username}`
          ])
        ])
      )
    ])
  )

let main = ({ DOM }) => ({
  DOM: view(model(intent({ DOM })))
})

let drivers = {
  DOM: makeDOMDriver(`#app`)
}

Cycle.run(main, drivers)
