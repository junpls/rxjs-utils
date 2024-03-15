import {
	MonoTypeOperatorFunction,
	Observable,
	ReplaySubject,
	concat,
	defer,
} from "rxjs";
import {
	exhaustMap,
	filter,
	finalize,
	map,
	takeUntil,
	takeWhile,
	tap,
} from "rxjs/operators";

/**
 * A versatile throttling operator.
 *
 * Like the `sample` operator, but it "sleeps" during stretches of silence
 * and "awakes" when the first event in a series occurs.
 *
 * This means, you are sure to get...
 *  - the first event of the series (always instantly).
 *  - the final event of the series (potentially delayed).
 *  - a guarantee, that no emissions occur faster than the `durationSelector`(*)
 *
 *  (*) unless the source completes and you've set `includeFinal=true`.
 *
 * E.g. `lazySample(() => timer(0, 3))`
 * ```text
 * in:  abc----de|
 * out: a--c---d-(e|)
 * ```
 *
 * @param notifierSelector A function that receives a value from the source
 * Observable, for computing the timeout duration for each source value,
 * returned as an Observable.
 * @param includeFinal Mimic the behavior of `debounce`, of emitting a pending
 * value when the source completes, even if the `notifierSelector` has not yet
 * fired.
 */
export function lazySample<T>(
	notifierSelector: (value: T) => Observable<any>,
	includeFinal: boolean = true,
): MonoTypeOperatorFunction<T> {
	return (source) =>
		defer(() => {
			const finalValue = new ReplaySubject<T>(1);
			let hasValue = false;
			let lastValue: T | null = null;

			const intermediateValues = source.pipe(
				tap((val) => {
					lastValue = val;
					hasValue = true;
				}),
				finalize(() => {
					if (lastValue) {
						finalValue.next(lastValue);
					}
					finalValue.complete();
				}),
				exhaustMap((value) =>
					notifierSelector(value).pipe(
						takeUntil(finalValue),
						takeWhile(() => hasValue),
						map(() => {
							hasValue = false;
							return lastValue;
						}),
					),
				),
			) as Observable<T>;

			return concat(
				intermediateValues,
				finalValue.pipe(filter(() => hasValue && includeFinal)),
			);
		});
}
