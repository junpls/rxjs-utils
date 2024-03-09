import { OperatorFunction, scan } from "rxjs";

export function bufferRing<T>(size: number): OperatorFunction<T, T[]> {
	return scan((acc, curr) => [curr, ...acc].slice(0, size), [] as T[]);
}
