var ManagerTask = function(from, to, resourceType, amount, priority = 0) {
    return {
        from: from,
        to: to,
        resourceType: resourceType,
        amount: amount,
        priority: priority,
    }
};

var TowerRepairTask = function(structId, targethits = null) {
    return {structId: structId, targethits: targethits}
};

var LabTask = function(resourceType, amount) {
    return {resourceType: resourceType, amount: amount}
};

var transferTask = function(withdrawTarget, transferTarget, resourceType, amount) {
    return {
        withdrawTarget: withdrawTarget,
        transferTarget: transferTarget,
        resourceType: resourceType,
        amount: amount,
    }
};

module.exports = {ManagerTask, TowerRepairTask, LabTask, transferTask};