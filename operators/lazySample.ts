import {
	MonoTypeOperatorFunction,
	Observable,
	ReplaySubject,
	concat,
	defer,
	exhaustMap,
	filter,
	finalize,
	map,
	takeUntil,
	takeWhile,
	tap,
} from "rxjs";

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

			return concat(intermediateValues, finalValue.pipe(filter(() => hasValue && includeFinal)));
		});
}
