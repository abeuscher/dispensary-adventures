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
  // Check if products is a string (JSON) or already an object
  const productsArray = typeof products === "string" ? JSON.parse(products) : products;
  console.log(productsArray);
  return productsArray.map((p) => {
    // Store the URL for the entire row
    const rowData = {
      url: p.permalink || "#",
      data: [
        {
          label: "Manufacturer",
          type: "alpha",
          value: p.product_info?.brand || "",
          mobile: true,
        },
        {
          label: "Strain",
          type: "alpha",
          value: p.product_info?.strain || "",
          mobile: true,
        },
        {
          label: "Dispensary",
          type: "alpha",
          value: p.product_info?.dispensary || "",
          mobile: false,
        },
        {
          label: "THC %",
          type: "number",
          value: p.product_info?.listed_thc_percentage
            ? parseFloat(p.product_info.listed_thc_percentage.toString().replace("%", "")) + "%"
            : "N/A",
          mobile: true,
        },
        {
          label: "Amount Purchased",
          type: "number",
          value: p.product_info?.weight || 0,
          mobile: false,
        },
        {
          label: "$/Gram",
          type: "number",
          value:
            p.product_info?.cost && p.product_info?.weight
              ? "$" + parseFloat(p.product_info.cost / p.product_info.weight).toFixed(2)
              : "N/A",
          mobile: true,
        },
        {
          label: "Pack. Date",
          type: "date",
          value: formatDateToMMDDYYYY(p.product_info?.package_date),
          mobile: false,
        },
        {
          label: "Purch. Date",
          type: "date",
          value: formatDateToMMDDYYYY(p.product_info?.purchase_date),
          mobile: false,
          default: true,
        },
        {
          label: "Taste",
          type: "number",
          value: p.scores?.taste || 0,
          mobile: false,
          score: true,
        },
        {
          label: "Look",
          type: "number",
          value: p.scores?.quality || 0,
          mobile: false,
          score: true,
        },
        {
          label: "Strength",
          type: "number",
          value: p.scores?.strength || 0,
          mobile: false,
          score: true,
        },
        {
          label: "Overall",
          type: "number",
          value:
            parseInt(p.scores?.taste || 0) +
            parseInt(p.scores?.quality || 0) +
            parseInt(p.scores?.strength || 0),
          mobile: true,
          score: true,
        },
      ],
    };

    return rowData;
  });
}

export default productProcessor;
