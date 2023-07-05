type TRomanNum = { [key: number]: string };

function arabicToRoman(num: number): string {
  if (num <= 0 || num > 3999) {
    throw new Error("Invalid input. The number must be between 1 and 3999.");
  }

  const romanNumerals: TRomanNum = {
    1: "I",
    4: "IV",
    5: "V",
    9: "IX",
    10: "X",
    40: "XL",
    50: "L",
    90: "XC",
    100: "C",
    400: "CD",
    500: "D",
    900: "CM",
    1000: "M",
  };

  let result = "";
  let remaining = num;

  const sortedKeys = Object.keys(romanNumerals)
    .map(Number)
    .sort((a, b) => b - a);

  for (const key of sortedKeys) {
    while (remaining >= key) {
      result += romanNumerals[key];
      remaining -= key;
    }
  }

  return result;
}
