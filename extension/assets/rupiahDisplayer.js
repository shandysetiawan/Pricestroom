function rupiahDisplayer(number) {
  const price = new Intl.NumberFormat('in-IN', { style: 'currency', currency: 'IDR' }).format(number);
  return price.slice(0, price.length - 7) + 'k';
}
