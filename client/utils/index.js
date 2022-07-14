export const getErrMsg = error => error.response && error.response.data ? error.response.data : error.message;

export const currencyFormatter = data => {
    return data.amount.toLocaleString(data.currency, {
        style: 'currency',
        currency: data.currency
    });
};