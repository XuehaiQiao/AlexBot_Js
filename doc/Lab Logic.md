# Lab Logic Design

Lab logic always works together with the cooperate with mineralCarrier (scientist) creep and lab data is stored under its located room's memory: room.memory.labs

This article will cover all 4 reactions of the structure_lab:

1. runReaction :white_check_mark:
2. reverseReaction
3. boostCreep
4. unboostCreep



## 1. runReaction

runReaction contains two main parts: taskManager and runReaction logic.



### taskManager

for every 200 ticks, taskManager will check if there are compounds needed to be created, if yes, generate tasks for reaction. If resources to create that compound is not enough, write the short compound name into Memory.resourceShortage.

```js
// task queue
room.memory.tasks.labTasks = [labTask];
// task object
labTask = {resourceType: resourceType, amount: amount};
// resourceShortage
Memory.resourceShortage = {roomName: compoundName...};
```

### Reaction procedures

1. Take a task from labTasks queue, change labStatus from 0 to 2.
2. Status 2: Mineral carrier bring required reaction sources to center labs.
3. After center labs are needed, change status to 1.
4. Status 1: Run lab reaction.
5. If resource is not enough, change status to 2, if products is full, change status to 3, if created required amount of compounds, change status to 0.
6. Status 3: withdraw outer lab componds
7. Status 0: Reaction finished, withdraw all resources from all labs (empty labs).
8. If all labs are empty: ready to take another labTask.

```js

// ceter labs: used to store reaction sources
room.memory.labs.center = [centerLab1_id, centerLab2_id];
// lab status
room.memory.labStatus = labStatus

```

### Tasks

- Lab only create compounds when there are lab tasks in room memory.
- When get task, find reaction required resources in `../src/constants/reactionResources`  and do reactions

### Mineral Carrier

- Mineral carrier will only be spawned when there has labTasks.
- Currently, mineral carrier is responsible to carrier minerals from storage/terminal to lab and bring produced compounds back to storage.

### Lab status

- **Finished 0**: Current task is completed, all mineral/ compounds are removed from the lab and labs are ready for next reaction task. Lab status is 0 when labs are idle.
- **Running 1**: Current reaction is ongoing.
- **Center feed 2**: center lab minerals are not enough, waiting for carriers to send minerals.
- **Outer withdraw 3**: outer lab store is full or compound production is finished, waiting carriers to withdraw resources from them.



## 2. reverseReaction

todo

## 3. boostCreep

boostCreep requires cooperate with boosting creep, room and mineralCarrier.

To boost a creep, creep memory should contain:

```js
Game.creeps[creepName].memory = {boost: true, boosted: false, boostInfo: {[resourceType]: bodyPartCount}, ...}, base: spawnRoomName, targetRoom: targetRoom}
```

 When spawn this creep, room will assign boost task to boostLab Object.

Once there are boostLabs that not meet resource requirements, mineralCarrier will transfer/withdraw resource from lab.

After creep is spawned, check if `boostLab` Object contain all required resources, if not, change `creep.memory.boost` to `false`, once boosted all required body parts, change `creep.memory.boosted` to `true` and remove lab from `boostLab` Object if no more this type of resources needed. 





### boostLab Object

```js
room.memory.labs.boostLab = {id: {resourceType: 'XKH2O', amount: 1000}...}
```



### boost creep

Move to target lab and control lab to do lab.boostCreep()

### lab

Monitor need boost creep, if have, 
