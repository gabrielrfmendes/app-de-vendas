export default function formatMonetaryValue(amount: number) {
    let formattedAmount = String(amount.toFixed(2));
    
    if (formattedAmount.indexOf('.') !== -1) {
        let [reais, cents] = formattedAmount.split('.');

        reais = reais
            .replace(/^(0+)(\d)/g, '$2')
            .replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');

        if (cents.length === 1) {
            cents = `${cents}0`
        }

        return `R$ ${reais},${cents}`
    }
    formattedAmount = formattedAmount
        .replace(/^(0+)(\d)/g, '$2')
        .replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');
    
    return `R$ ${formattedAmount},00`
}