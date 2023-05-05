# Lab Logic Design

## Reaction procedures

1. Take a task from labTasks queue, change labStatus from 0 to 2.
2. Status 2: Mineral carrier bring required reaction sources to center labs.
3. After center labs are needed, change status to 1.
4. Status 1: Run lab reaction.
5. If resource is not enough, change status to 2, if products is full, change status to 3, if created required amount of compounds, change status to 0.
6. Status 3: withdraw outer lab componds
7. Status 0: Reaction finished, withdraw all resources from all labs (empty labs).
8. If all labs are empty: ready to take another labTask.

## Memory storage and data structures:

```js
// task queue
room.memory.tasks.labTasks = [labTask];
// ceter labs: used to store reaction sources
room.memory.labs.center = [centerLab1_id, centerLab2_id];
// lab status
room.memory.labStatus = labStatus

// task object
labTask = {resourceType: resourceType, amount: amount};

```

## Tasks

- Lab only create compounds when there are lab tasks in room memory.
- When get task, find reaction required resources in `../src/constants/reactionResources`  and do reactions

## Mineral Carrier

- Mineral carrier will only be spawned when there has labTasks.
- Currently, mineral carrier is responsible to carrier minerals from storage/terminal to lab and bring produced compounds back to storage.

## Lab status

- **Finished 0**: Current task is completed, all mineral/ compounds are removed from the lab and labs are ready for next reaction task. Lab status is 0 when labs are idle.
- **Running 1**: Current reaction is ongoing.
- **Center feed 2**: center lab minerals are not enough, waiting for carriers to send minerals.
- **Outer withdraw 3**: outer lab store is full or compound production is finished, waiting carriers to withdraw resources from them.

