export function __handleAddCommasToNumber(number: any) {
    if(number)
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function __handleRoundToThreeDecimalPlaces(number: number): number {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new Error('Invalid input. Please provide a valid number.');
    }
    return Math.round(number / 1000) * 1000;
}
