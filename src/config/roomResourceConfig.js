// resourceType: {terminal: amount, storage: [ShortageLine, AbundantLine, ExceededLine]}
// if resource below shrtageLine, it requires to other rooms, if its below abundantLine, 
module.exports = {
    energy: {terminal: 50000, storage: [200000, 500000, 600000]},

    O: {terminal: 5000, storage: [10000, 20000, 30000]},
    H: {terminal: 5000, storage: [10000, 20000, 30000]},
    U: {terminal: 5000, storage: [5000, 10000, 20000]},
    K: {terminal: 5000, storage: [5000, 10000, 20000]},
    L: {terminal: 5000, storage: [5000, 10000, 20000]},
    Z: {terminal: 5000, storage: [5000, 10000, 20000]},
    X: {terminal: 5000, storage: [5000, 10000, 20000]},
    G: {terminal: 5000, storage: [5000, 10000, 20000]},

    XUH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // attack
    XUHO2: {terminal: 5000, storage: [5000, 10000, 15000]}, // harvest
    XKH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // carry
    XKHO2: {terminal: 5000, storage: [10000, 20000, 30000]}, // ranged_attack
    XLH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // repair & build
    XLHO2: {terminal: 5000, storage: [10000, 20000, 30000]}, // heal
    XZH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // dismantle
    XZHO2: {terminal: 5000, storage: [10000, 20000, 30000]}, // move
    XGH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // upgradeController
    XGHO2: {terminal: 5000, storage: [5000, 10000, 15000]}, // tough
    
    power: {terminal: 1000, storage: [1000, 5000, 20000]},
    ops: {terminal: 1000, storage: [1000, 5000, 20000]},
    battery: {terminal: 2000, storage: [2000, 5000, 10000]},
};