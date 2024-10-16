function productProcessor(products) {
    return products.map(p => [{
    "label":"Manufacturer",
    "type":"alpha",
    "value":p.info.brand,
    "link":p.url,
    "mobile":true
},{
    "label":"Strain",
    "type":"alpha",
    "value":p.info.strain,
    "link":p.url,
    "mobile":true
},{
    "label":"Dispensary",
    "type":"alpha",
    "value":p.info.dispensary,
    "mobile":false            
},{
    "label":"THC %",
    "type":"number",
    "value":parseFloat(p.info.listed_thc_percentage.replace("%","")) + "%",
    "mobile":true 
},{
    "label":"Amount Purchased",
    "type":"number",
    "value":p.info.weight,
    "mobile":false           
},{
    "label":"$/Gram",
    "type":"number",
    "value":"$" + parseFloat(p.info.cost / p.info.weight).toFixed(2),
    "mobile":true          
},{
    "label":"Pack. Date",
    "type":"date",
    "value":p.info.package_date,
    "mobile":false           
},{
    "label":"Purch. Date",
    "type":"date",
    "value":p.info.purchase_date,
    "mobile":false,
    "default":true           
},{
    "label":"Taste",
    "type":"number",
    "value":p.scores.taste,
    "mobile":false,
    "score":true            
},{
    "label":"Look",
    "type":"number",
    "value":p.scores.quality,
    "mobile":false,
    "score":true               
},{
    "label":"Strength",
    "type":"number",
    "value":p.scores.strength,
    "mobile":false,
    "score":true               
},{
    "label":"Overall",
    "type":"number",
    "value":parseInt(p.scores.taste) + parseInt(p.scores.quality) + parseInt(p.scores.strength),
    "mobile":true,
    "score":true            
}]);
}

module.exports = productProcessor;