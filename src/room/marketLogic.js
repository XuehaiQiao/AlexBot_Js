module.exports = function() {
    let w21s19 = Game.rooms['W21S19'];
    if(!w21s19 || !w21s19.terminal) return;

    let alloyAmount = w21s19.terminal.store[RESOURCE_ALLOY];

    if(alloyAmount === 0) {
        console.log("Alloy Soldout");
        return;
    }

    let orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ALLOY});
    if(orders.length === 0) {
        return;
        console.log("No order exist");
    }

    orders.sort((o1, o2) => (o2.price - o1.price));

    if(orders[0].price > 2450) {
        let result = Game.market.deal(orders[0].id, alloyAmount, "W21S19");
        if(result === OK) {
            console.log("Alloy sold " + orders[0].amount);
        }
        
    }
    else {
        console.log("Top Price is", orders[0].price);
    }


}