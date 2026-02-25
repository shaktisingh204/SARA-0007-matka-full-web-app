// src/lib/matka-rules.ts

/**
 * Generates all valid Single (Ank) numbers (0-9).
 * Total: 10
 */
export const getValidAnk = (): string[] => {
    return Array.from({ length: 10 }, (_, i) => i.toString());
};

/**
 * Generates all valid Jodi numbers (00-99).
 * Total: 100
 */
export const getValidJodi = (): string[] => {
    return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
};

/**
 * Generates all valid Single Patti numbers.
 * A Single Patti has 3 unique digits in ascending order.
 * Total: 120
 */
export const getValidSinglePatti = (): string[] => {
    const result: string[] = [];
    for (let i = 1; i <= 9; i++) {
        for (let j = i + 1; j <= 9; j++) {
            for (let k = j + 1; k <= 9; k++) {
                result.push(`${i}${j}${k}`);
            }
        }
    }
    // Include combinations with 0, which acts as 10 (always at the end)
    for (let i = 1; i <= 8; i++) {
        for (let j = i + 1; j <= 9; j++) {
            result.push(`${i}${j}0`);
        }
    }
    return result.sort();
};

/**
 * Generates all valid Double Patti numbers.
 * A Double Patti has exactly two same digits, and the digits are in ascending order
 * (treating 0 as 10, so 0 is always the last digit).
 * Total: 90
 */
export const getValidDoublePatti = (): string[] => {
    const result: string[] = [];

    // Non-zero combinations (e.g., 112, 122)
    for (let i = 1; i <= 9; i++) {
        for (let j = i + 1; j <= 9; j++) {
            result.push(`${i}${i}${j}`);
            result.push(`${i}${j}${j}`);
        }
    }

    // Combinations with 0 (e.g., 110, 100)
    // 0 is treated as 10, so it always goes at the end
    for (let i = 1; i <= 9; i++) {
        result.push(`${i}${i}0`);
        result.push(`${i}00`);
    }

    return result.sort();
};

/**
 * Generates all valid Triple Patti numbers.
 * A Triple Patti has all three digits the same.
 * Total: 10
 */
export const getValidTriplePatti = (): string[] => {
    const result: string[] = [];
    for (let i = 1; i <= 9; i++) {
        result.push(`${i}${i}${i}`);
    }
    result.push('000');
    return result.sort();
};

/**
 * Generates all valid Pattis (Single + Double + Triple).
 * Total: 120 + 90 + 10 = 220
 */
export const getAllValidPattis = (): string[] => {
    return [
        ...getValidSinglePatti(),
        ...getValidDoublePatti(),
        ...getValidTriplePatti(),
    ].sort();
};

// Cached arrays for faster validation
export const VALID_ANK = new Set(getValidAnk());
export const VALID_JODI = new Set(getValidJodi());
export const VALID_SINGLE_PATTI = new Set(getValidSinglePatti());
export const VALID_DOUBLE_PATTI = new Set(getValidDoublePatti());
export const VALID_TRIPLE_PATTI = new Set(getValidTriplePatti());
export const ALL_VALID_PATTIS = new Set(getAllValidPattis());
