import { useMemo } from 'react';

export function calcZScore(values) {
  if (!values || values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(
    values.map((v) => (v - mean) ** 2).reduce((a, b) => a + b, 0) / values.length
  );
  return std === 0 ? 0 : (values[values.length - 1] - mean) / std;
}

export function useZScore(historicalValues) {
  return useMemo(() => calcZScore(historicalValues), [historicalValues]);
}
