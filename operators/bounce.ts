import {
	MonoTypeOperatorFunction,
	Observable,
	Subscription,
	timer,
} from "rxjs";

/**
 * A counterpart to `debounce`: Emits only the first event in a series.
 *
 * E.g. `bounce(() => timer(3))`:
 * ```
 * in:  ab-c---de|
 * out: a------d-|
 * ```
 *
 * @param durationSelector A function that receives a value from the source
 * Observable, for computing the timeout duration for each source value,
 * returned as an Observable.
 * @param invert Set to `true` to make the operator do the inverse:
 *
 *  E.g. `bounce(() => timer(3), true)`:
 *  ```text
 *	in:  ab-c---de|
 * 	out: -b-c----e|
 *  ```
 */
export function bounce<T>(
	durationSelector: (arg: T) => Observable<any>,
	invert: boolean = false,
): MonoTypeOperatorFunction<T> {
	return (source) => {
		return new Observable((subscriber) => {
			let blocked = false;
			let selectorSub: Subscription | undefined;
			const sourceSub = source.subscribe({
				next: (val) => {
					if (blocked === invert) {
						subscriber.next(val);
					}
					blocked = true;
					selectorSub?.unsubscribe();
					selectorSub = durationSelector(val).subscribe(() => {
						blocked = false;
						selectorSub?.unsubscribe();
					});
				},
				error: (e) => {
					subscriber.error(e);
				},
				complete: () => {
					subscriber.complete();
				},
			});
			return () => {
				selectorSub?.unsubscribe();
				sourceSub.unsubscribe();
			};
		});
	};
}

/**
 * Shortcut for using {@link bounce} with a timer.
 */
export const bounceTime = <T>(duration: number, invert: boolean = false) =>
	bounce<T>(() => timer(duration), invert);
