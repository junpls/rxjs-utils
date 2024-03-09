import {
	MonoTypeOperatorFunction,
	Observable,
	debounce,
	merge,
	timer,
} from "rxjs";
import { bounce } from "./bounce";

export function hug<T>(
	durationSelector: (arg: T) => Observable<any>,
): MonoTypeOperatorFunction<T> {
	return (source) =>
		merge(
			source.pipe(bounce(durationSelector)),
			source.pipe(bounce(durationSelector, true), debounce(durationSelector)),
		);
}

export const hugTime = <T>(duration: number) => hug<T>(() => timer(duration));
