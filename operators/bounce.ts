import {
	MonoTypeOperatorFunction,
	Observable,
	Subscription,
	debounce,
	merge,
	timer,
} from "rxjs";

export function bounce<T>(
	durationSelector: (arg: T) => Observable<any>,
	invert: boolean = false
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

export const bounceTime = <T>(duration: number, invert: boolean = false) =>
	bounce<T>(() => timer(duration), invert);
