const { KEEPER } = require("../constants/roomTypes");
const roomUtil = require("./roomUtil");

const inRoomUtil = {
    getEnclosureMatrix: function (room) {
        if (!room) return null;
        if (room.memory.recreateEnclosureMatrix === true || !room.memory.enclosureMatrix) {
            console.log('Generate eMatrix')
            let enclosureMatrix = this.generateEnclosureMatrix(room);
            room.memory.enclosureMatrix = enclosureMatrix.serialize();
            room.memory.recreateEnclosureMatrix = false;
            return enclosureMatrix;
        }
        else {
            return PathFinder.CostMatrix.deserialize(room.memory.enclosureMatrix);
        }
    },

    generateEnclosureMatrix: function (room) {
        let roomExits = room.find(FIND_EXIT);
        let enclosureMatrix = new PathFinder.CostMatrix;

        // set rampart
        let ramparts = room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_RAMPART });
        ramparts.map(rampart => {
            let pos = rampart.pos
            enclosureMatrix.set(pos.x, pos.y, 1);
        });

        // set construction wall
        let constWalls = room.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_WALL });
        constWalls.map(constWall => {
            let pos = constWall.pos
            enclosureMatrix.set(pos.x, pos.y, 1);
        });

        // set wall
        const terrain = new Room.Terrain(room.name);
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                if (tile === TERRAIN_MASK_WALL) {
                    enclosureMatrix.set(x, y, 1);
                }
            }
        }

        var boundaries = [];
        this.outerBFS(roomExits, enclosureMatrix, boundaries);
        this.innerBFS(boundaries, enclosureMatrix, 2);

        ramparts.map(rampart => {
            let pos = rampart.pos
            enclosureMatrix.set(pos.x, pos.y, 0);
        });
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                if (tile === TERRAIN_MASK_WALL) {
                    enclosureMatrix.set(x, y, 255);
                }
                else if (tile === TERRAIN_MASK_WALL && enclosureMatrix.get(x, y) === 0) {
                    enclosureMatrix.set(x, y, 5);
                }
            }
        }

        let blockStructs = room.find(FIND_STRUCTURES, {
            filter: struct => (
                struct.structureType != STRUCTURE_RAMPART &&
                struct.structureType != STRUCTURE_ROAD &&
                struct.structureType != STRUCTURE_CONTAINER
            )
        })
        blockStructs.map(bStruct => {
            let pos = bStruct.pos
            enclosureMatrix.set(pos.x, pos.y, 255);
        });

        return enclosureMatrix;
    },

    outerBFS: function (roots, eMatrix, boundaries) {
        if (!roots.length) return;

        let current = [];
        for (let pos of roots) {
            if (eMatrix.get(pos.x, pos.y) === 0) eMatrix.set(pos.x, pos.y, 255);
            let adjacents = this.getAdjPos(pos);
            for (let adjPos of adjacents) {
                let cost = eMatrix.get(adjPos.x, adjPos.y);
                if (cost > 0) {
                    if (cost === 1) {
                        eMatrix.set(adjPos.x, adjPos.y, 2);
                        boundaries.push(adjPos);
                    }
                    continue;
                }
                eMatrix.set(adjPos.x, adjPos.y, 255);
                current.push(adjPos);
            }
        }

        this.outerBFS(current, eMatrix, boundaries);
    },

    innerBFS: function (roots, eMatrix, dis) {
        console.log(roots)
        if (!roots.length) return;
        if (dis < 1) return;

        let current = [];
        for (let pos of roots) {
            let adjacents = this.getAdjPos(pos);
            for (let adjPos of adjacents) {
                let cost = eMatrix.get(adjPos.x, adjPos.y);
                if (cost > 1) continue;
                eMatrix.set(adjPos.x, adjPos.y, dis * 50)
                current.push(adjPos);
            }
        }

        this.innerBFS(current, eMatrix, dis - 1);
    },

    getAdjPos: function (pos) {
        const dir = [1, 0, -1]
        let res = [];

        for (var addX of dir) {
            for (var addY of dir) {
                if (addX === 0 && addY === 0) continue;

                let newX = pos.x + addX;
                let newY = pos.y + addY;

                if (newX > 49 || newX < 0 || newY > 49 || newY < 0) continue;

                res.push(new RoomPosition(newX, newY, pos.roomName));
            }
        }

        return res;
    },

    getInRangePos: function (pos, range) {
        let res = [];

        for(var x = pos.x - range; x <= pos.x + range; x++) {
            if(x < 0 || x > 49) continue;
            for(var y = pos.y - range; y <= pos.y + range; y++) {
                if(y < 0 || y > 49) continue;

                res.push(new RoomPosition(x, y, pos.roomName));
            }
        }

        return res;
    },

    getSKMatrix: function (roomName) {
        if(roomUtil.getRoomType(roomName) !== KEEPER) return undefined;

        let roomMemory = Memory.rooms[roomName];
        let room = Game.rooms[roomName];
        if(roomMemory && roomMemory.skMatrix) return PathFinder.CostMatrix.deserialize(roomMemory.skMatrix);
        else if(room) {
            console.log('Generate skMatrix');
            let skMatrix = this.generateSKMatrix(room);
            room.memory.skMatrix = skMatrix.serialize();
            return skMatrix;
        }
        
        return undefined;
    },

    generateSKMatrix: function (room) {
        if(!room) return undefined;
        if(roomUtil.getRoomType(room.name) !== KEEPER) return undefined;
        let sources = room.find(FIND_SOURCES);
        let mines = room.find(FIND_MINERALS);
        let KeeperLairs = room.find(FIND_HOSTILE_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR });

        dangerObjs = [...sources, ...mines, ...KeeperLairs];

        let skMatrix = new PathFinder.CostMatrix;

        const terrain = new Room.Terrain(room.name);
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                if (tile === TERRAIN_MASK_WALL) {
                    skMatrix.set(x, y, 255);
                }
                else if (tile === TERRAIN_MASK_SWAMP) {
                    skMatrix.set(x, y, 5);
                }
                else {
                    skMatrix.set(x, y, 1);
                }
            }
        }

        for(let obj of dangerObjs) {
            let inRangeDangerPoses = this.getInRangePos(obj.pos, 5);
            for(let pos of inRangeDangerPoses) {
                skMatrix.set(pos.x, pos.y, 255);
            }
        }

        return skMatrix;
    },
}
module.exports = inRoomUtil;