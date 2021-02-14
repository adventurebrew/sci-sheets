export function sumOf<T>(arr: T[], fn: (x: T, i: number, a: T[]) => number): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++)
    sum += fn(arr[i], i, arr);
  return sum;
}
