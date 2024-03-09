import {
	Observable,
	OperatorFunction,
	ReplaySubject,
	Subject,
	concatAll,
	map,
	takeUntil,
} from "rxjs";

export function queueMap<T, R>(
	project: (arg: T) => Observable<R>,
): OperatorFunction<T, R> {
	return (source) => {
		return new Observable((subscriber) => {
			const teardown = new Subject<void>();
			source
				.pipe(
					map((val) => {
						const buffer = new ReplaySubject<R>();
						project(val).pipe(takeUntil(teardown)).subscribe(buffer);
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
