// resourceType: {terminal: amount, storage: [ShortageLine, AbundantLine, ExceededLine]}
// if resource below shrtageLine, it requires to other rooms, if its below abundantLine, 
module.exports = {
    energy: {terminal: 100000, storage: [200000, 400000, 500000]},

    O: {terminal: 4000, storage: [10000, 20000, 30000]},
    H: {terminal: 4000, storage: [10000, 20000, 30000]},
    U: {terminal: 4000, storage: [5000, 10000, 20000]},
    K: {terminal: 4000, storage: [5000, 10000, 20000]},
    L: {terminal: 4000, storage: [5000, 10000, 20000]},
    Z: {terminal: 4000, storage: [5000, 10000, 20000]},
    X: {terminal: 4000, storage: [10000, 20000, 30000]},
    G: {terminal: 4000, storage: [5000, 10000, 20000]},
    
    T: {terminal: 4000, storage: [1000, 4000, 70000]},
    GH: {terminal: 4000, storage: [1000, 3500, 20000]}, // attack
    UO: {terminal: 4000, storage: [1000, 4000, 20000]}, // harvest

    XUH2O: {terminal: 4000, storage: [3000, 6000, 20000]}, // attack
    XUHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // harvest
    XKH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // carry
    XKHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // ranged_attack
    XLH2O: {terminal: 4000, storage: [3000, 6000, 20000]}, // repair & build
    XLHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // heal
    XZH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // dismantle
    XZHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // move
    XGH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // upgradeController    
    XGHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // tough
    
    power: {terminal: 2000, storage: [5000, 10000, 20000]},
    ops: {terminal: 1000, storage: [1000, 5000, 20000]},
    battery: {terminal: 2000, storage: [2000, 5000, 10000]},
};