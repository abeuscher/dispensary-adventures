const formatDateToMMDDYYYY = (dateInput) => {
  if (!dateInput) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  try {
    return formatter.format(new Date(dateInput));
  } catch (error) {
    return "";
  }
};
function productProcessor(products) {
  return JSON.parse(products).map((p) => [
    {
      label: "Manufacturer",
      type: "alpha",
      value: p.product_info.fields.brand,
      link: p.url,
      mobile: true,
    },
    {
      label: "Strain",
      type: "alpha",
      value: p.product_info.fields.strain,
      link: p.slug,
      mobile: true,
    },
    {
      label: "Dispensary",
      type: "alpha",
      value: p.product_info.fields.dispensary,
      mobile: false,
    },
    {
      label: "THC %",
      type: "number",
      value:
        parseFloat(p.product_info.fields.listed_thc_percentage.toString().replace("%", "")) + "%",
      mobile: true,
    },
    {
      label: "Amount Purchased",
      type: "number",
      value: p.product_info.fields.weight,
      mobile: false,
    },
    {
      label: "$/Gram",
      type: "number",
      value: "$" + parseFloat(p.product_info.fields.cost / p.product_info.fields.weight).toFixed(2),
      mobile: true,
    },
    {
      label: "Pack. Date",
      type: "date",
      value: formatDateToMMDDYYYY(p.product_info.fields.package_date),
      mobile: false,
    },
    {
      label: "Purch. Date",
      type: "date",
      value: formatDateToMMDDYYYY(p.product_info.fields.purchase_date),
      mobile: false,
      default: true,
    },
    {
      label: "Taste",
      type: "number",
      value: p.scores.fields.taste,
      mobile: false,
      score: true,
    },
    {
      label: "Look",
      type: "number",
      value: p.scores.fields.quality,
      mobile: false,
      score: true,
    },
    {
      label: "Strength",
      type: "number",
      value: p.scores.fields.strength,
      mobile: false,
      score: true,
    },
    {
      label: "Overall",
      type: "number",
      value:
        parseInt(p.scores.fields.taste) +
        parseInt(p.scores.fields.quality) +
        parseInt(p.scores.fields.strength),
      mobile: true,
      score: true,
    },
  ]);
}

module.exports = productProcessor;
