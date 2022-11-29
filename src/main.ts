const ALPHABET: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

const numInput = <HTMLInputElement>document.getElementById('input-number')!;
const fromBaseInput = <HTMLInputElement>document.getElementById('input-base-from')!;
const toBaseInput = <HTMLInputElement>document.getElementById('input-base-to')!;
const fracLenInput = <HTMLInputElement>document.getElementById('input-frac-len')!;
const baseOutput = document.getElementById('base-output')!;
const productOutput = document.getElementById('product-output')!;

function numToBase(n: number, base: number): Array<number> {
    let o: number[] = [];
    while (n > 0) {
        let r = n % base;
        o.unshift(r);
        n = Math.floor(n / base);
    }
    return o;
}

function fracToBase(n: number, base: number, digits: number): number[] {
    console.log("DO: ", n);
    let o: number[] = [];
    for (let i = 0; i < digits; i++) {
        n *= base;
        let f = Math.floor(n);
        if (f >= 1) {
            n -= f;
        }
        o.push(f);
    }
    return o;
}

function digitToChar(digit: number): string {
    if (digit >= 0 && digit <= 9) {
        return digit.toString();
    } else if (digit - 10 < ALPHABET.length) {
        return ALPHABET[digit - 10].toUpperCase();
    } else {
        return '?';
    }
}

function digitsToString(arr: number[]): string {
    let str = '';
    for (let d of arr) {
        str += digitToChar(d);
    }
    return str;
}

function charToDigit(char: string): number {
  return parseInt(char, 36);
}

function stringToDigits(str: string): number[] {
  let arr: number[] = [];
  for (let c of str) {
    arr.push(charToDigit(c));
  }
  return arr;
}

function parseNumber(str: string, base: number, neg: bool): number {
  let digits = stringToDigits(str);
  console.log(digits);
  let p = neg ? -1 : digits.length - 1;
  let sum = 0;
  for (let d of digits) {
    console.log(`${d.toString()} * ${base}^${p}`)
    sum += d * Math.pow(base, p);
    p--;
  }
  return sum;
}

function formatPowers(arr: number[], base: number, start: number): string {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        let p = start - i;
        if (i != 0) {
            str += ' + ';
        }
        str += `${arr[i]}&middot;${base}<sup>${p}</sup>`;
    }
    return str;
}

function removeTrailingZeros(arr: number[]) {
    while (arr[arr.length - 1] == 0) {
        arr.pop();
    }
}

function update() {
    baseOutput.innerHTML = '';
    productOutput.innerHTML = '';

    let inputNumber = numInput.value;
    let inputBase = parseInt(fromBaseInput.value);
    let base = parseInt(toBaseInput.value);
    let fracLen = parseInt(fracLenInput.value);

    let parts = inputNumber.split('.');
    let intPart = parseNumber(parts[0], inputBase, false);

    if (parts.length == 1) {
        let digits = numToBase(intPart, base);
        baseOutput.innerHTML = digitsToString(digits);
        productOutput.innerHTML = formatPowers(digits, base, digits.length - 1);
    } else if (parts.length == 2) {
        let fracPart = parseNumber(parts[1], inputBase, true);
        let intDigits = numToBase(intPart, base);
        let fracDigits = fracToBase(fracPart, base, fracLen);
        removeTrailingZeros(fracDigits);
        baseOutput.innerHTML = digitsToString(intDigits) + '.' + digitsToString(fracDigits);
        productOutput.innerHTML = formatPowers(intDigits, base, intDigits.length - 1) + ' + ' + formatPowers(fracDigits, base, -1);
    }
}

numInput.addEventListener('input', () => update());
toBaseInput.addEventListener('input', () => update());
fromBaseInput.addEventListener('input', () => update());
fracLenInput.addEventListener('input', () => update());
