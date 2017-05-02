export function formatMoney (intl, value, currencyCode) {
  return intl.formatNumber(
    value / 100,
    {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
    }
  )
}
