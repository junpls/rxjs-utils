# RxJS Utils

Just my collection of custom RxJS operators, ready to copy+paste.

## Package contents

- `bufferRing`: A basic ring buffer implementation.
- `queueMap`: Like `mergeMap`, but the results get emitted in order.
- `lazySample`: The missing throttling operator, imho.
- `bounce`: The counterpart to `debounce`. Emits only the first event in a series.
- `hug`: `bounce`+`debounce`=`hug`. Emits the first and last event of a series, but nothing in between.
- `transaction`: Mainly for letting multiple state changes of a `BehaviorSubject` appear as one.

## Disclaimer

While there are a couple of unit tests, the quality of the operators can range anywhere from "pretty solid" over "well, if it works...🤞" to "come on, that's just code golf". What unites them is only a complete disregard for performance.