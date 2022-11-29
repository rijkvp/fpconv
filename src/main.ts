const ALPHABET: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

const numInput = <HTMLInputElement>document.getElementById('input-number')!;
const fromBaseInput = <HTMLInputElement>document.getElementById('input-base-from')!;
const toBaseInput = <HTMLInputElement>document.getElementById('input-base-to')!;
const fracLenInput = <HTMLInputElement>document.getElementById('input-frac-len')!;
const baseOutput = document.getElementById('base-output')!;
const baseText = document.getElementById('base-text')!;
const productOutput = document.getElementById('product-output')!;

function numToBase(n: number, base: number): Array<number> {
    let o: number[] = [];
    while (n > 0) {
        let r = n % base;
        o.unshift(r);
        n = Math.floor(n / base);
    }
    if (o.length == 0) {
        o.push(0);
    }
    return o;
}

function fracToBase(n: number, base: number, digits: number): number[] {
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

function stringToDigits(str: string, base: number): number[] | null {
    let arr: number[] = [];
    for (let ch of str) {
        let d = parseInt(ch, 36);
        if (d >= base) {
            return null;
        } else {
            arr.push(d);
        }
    }
    return arr;
}

function parseNumber(str: string, base: number, neg: boolean): number | null {
    let digits = stringToDigits(str, base);
    if (digits == null) {
        return null;
    }
    let p = neg ? -1 : digits.length - 1;
    let sum = 0;
    for (let d of digits) {
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

    if (numInput.value == null || numInput.value == '' || fromBaseInput == null || fromBaseInput.value == '' || toBaseInput.value == null || toBaseInput.value == '' || fracLenInput.value == null || fracLenInput.value == '') {
        baseText.innerHTML = '?';
        baseOutput.innerHTML = '?';
        productOutput.innerHTML = '?';
        return;
    }

    let inputNumber = numInput.value;
    let inputBase = parseInt(fromBaseInput.value);
    let base = parseInt(toBaseInput.value);
    let fracLen = parseInt(fracLenInput.value);

    baseText.innerHTML = `Number in base ${base}`;
    if (inputBase == base) {
        baseOutput.innerHTML = 'Select another base';
        productOutput.innerHTML = '';
        return;
    }

    let parts = inputNumber.split('.');
    let intPart = parseNumber(parts[0], inputBase, false);
    if (intPart == null) {
        baseOutput.innerHTML = 'Invalid input';
        productOutput.innerHTML = '';
        return;
    }

    if (parts.length == 1) {
        let digits = numToBase(intPart, base);
        baseOutput.innerHTML = digitsToString(digits);
        productOutput.innerHTML = formatPowers(digits, base, digits.length - 1);
    } else if (parts.length == 2) {
        let fracPart = parseNumber(parts[1], inputBase, true);
        if (fracPart == null) {
            baseOutput.innerHTML = 'Invalid input';
            productOutput.innerHTML = '';
            return;
        }
        let intDigits = numToBase(intPart, base);
        let fracDigits = fracToBase(fracPart, base, fracLen);
        removeTrailingZeros(fracDigits);
        if (fracDigits.length > 0) {
            baseOutput.innerHTML = digitsToString(intDigits) + '.' + digitsToString(fracDigits);
            productOutput.innerHTML = formatPowers(intDigits, base, intDigits.length - 1) + ' + ' + formatPowers(fracDigits, base, -1);
        } else {
            baseOutput.innerHTML = digitsToString(intDigits);
            productOutput.innerHTML = formatPowers(intDigits, base, intDigits.length - 1);
        }
    }
}

numInput.addEventListener('input', () => update());
toBaseInput.addEventListener('input', () => update());
fromBaseInput.addEventListener('input', () => update());
fracLenInput.addEventListener('input', () => update());
