import {
	Observable,
	OperatorFunction,
	ReplaySubject,
	Subject,
	concatAll,
} from "rxjs";
import { map, takeUntil } from "rxjs/operators";

/**
 * Like a marriage between `mergeMap` and `concatMap`:
 * The inner Observables run in concurrently, but the operator ensures, that
 * their results are emitted in the original order.
 *
 * @param project A function that, when applied to an item emitted by the
 * source Observable, returns an Observable.
 */
export function queueMap<T, R>(
	project: (arg: T, index: number) => Observable<R>,
): OperatorFunction<T, R> {
	return (source) => {
		return new Observable((subscriber) => {
			const teardown = new Subject<void>();
			source
				.pipe(
					map((val, index) => {
						const buffer = new ReplaySubject<R>();
						project(val, index).pipe(takeUntil(teardown)).subscribe(buffer);
						return buffer.asObservable();
					}),
					concatAll(),
				)
				.subscribe(subscriber);
			return () => {
				teardown.next();
			};
		});
	};
}
