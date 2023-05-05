# AlexBot_Js
AlexBot is an automation bot for game `Screeps`, written in JavaScripts

This project uses Atanner's **[screeps-starter](https://github.com/AydenRennaker/screeps-starter)** template.

## Progress

This bot is still under development, currently it's a semi-automation bot. Use this bot requires player manually: 

- claim new rooms,
- create new structures
- select out sourcing rooms



### Capabilities

- Create core creeps for running the room
- Adjust creep size & num based on RCL and room income
- Auto repair
- Basic enemy and level 0 invader core defense
- Adjust worker size based on room income
- Out-sourcing
- Resources balancing between rooms

### Expected Functionalities

1. Lab logic
    - Lab reaction creation logic. :white_check_mark:
    - Auto generate tasks to get sources, including creating sub-reaction task to create required sources.
    - Cooperate with treading logic to get sources if not enough.
2. Factory logic
3. Active defense logic
    - Measure threaten level.
    - Cease some functions if threaten level to certain degree.
    - Create defense creep.
    - Auto boost if required.
    - Auto repair and emergency repair.
    - Keep self creep under rampart or keep distance to enemy creeps.
    - Work together with towers.
4. Nuke defense logic
5. Neutral room harvesting & mining (managing  Source Keeper & Invader Base)
6. Auto room planner
7. Auto out sourcing planner
8. Mining deposit & power bank
9. Power creep control
10. Treading logic
    - Find best price/distance deal.
    - Auto buy and sell required sources.
    - Warning for abnormal prices.
11. Attacks and retaliations
    - Pair/quads logic and combinations.
    - Record enemy attckes.
