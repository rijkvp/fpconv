const ALPHABET: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

const numInput = <HTMLInputElement>document.getElementById('input-number')!;
const baseInput = <HTMLInputElement>document.getElementById('input-base')!;
const fracLenInput = <HTMLInputElement>document.getElementById('input-frac-len')!;
const baseOutput = document.getElementById('base-output')!;
const powerOutput = document.getElementById('power-output')!;

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

function digitCharacter(digit: number): string {
    if (digit >= 0 && digit <= 9) {
        return digit.toString();
    } else if (digit - 10 < ALPHABET.length) {
        return ALPHABET[digit - 10].toUpperCase();
    } else {
        return '?';
    }
}

function formatDigits(arr: number[]): string {
    let str = '';
    for (let d of arr) {
        str += digitCharacter(d);
    }
    return str;
}

function formatPowers(arr: number[], base: number, start: number): string {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        let p = start - i;
        if (i != 0) {
            str += ' + ';
        }
        str += `${arr[i]} &middot; ${base}<sup>${p}</sup>`;
    }
    return str;
}

function update() {
    baseOutput.innerHTML = '';
    powerOutput.innerHTML = '';

    let num = numInput.value;
    let base = parseInt(baseInput.value);
    let fracLen = parseInt(fracLenInput.value);

    let parts = num.split('.');
    let intPart = parseInt(parts[0]);
    if (parts.length == 1) {
        let digits = numToBase(intPart, base);
        baseOutput.innerHTML = formatDigits(digits);
        powerOutput.innerHTML = formatPowers(digits, base, digits.length - 1);
    } else if (parts.length == 2) {
        let fracPart = parseFloat('0.' + parts[1]);
        let intDigits = numToBase(intPart, base);
        let fracDigits = fracToBase(fracPart, base, fracLen);
        baseOutput.innerHTML = formatDigits(intDigits) + '.' + formatDigits(fracDigits);
        powerOutput.innerHTML = formatPowers(intDigits, base, intDigits.length - 1) + ' + ' + formatPowers(fracDigits, base, -1);
    }
}

numInput.addEventListener('input', () => update());
baseInput.addEventListener('input', () => update());
fracLenInput.addEventListener('input', () => update());