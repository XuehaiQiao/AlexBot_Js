const { roomTypes } = require("../constants");

roomUtil = {
    getRoomCoord: function (roomName) {
        if (roomName.includes('N')) {
            return roomName.substring(1).split('N').map(pos => Number(pos));
        } else {
            return roomName.substring(1).split('S').map(pos => Number(pos));
        }
    },

    getRoomType: function (roomName) {
        const roomPos = this.getRoomCoord(roomName);
        if (roomPos[0] % 10 === 0 || roomPos[1] % 10 === 0) return roomTypes.HIGHWAY;
        else if (roomPos[0] % 10 === 5 || roomPos[1] % 10 === 5) return roomTypes.CENTER;
        else if (
            (roomPos[0] % 10 === 4 || roomPos[0] % 10 === 6) &&
            (roomPos[1] % 10 === 4 || roomPos[1] % 10 === 6)
        ) return roomTypes.KEEPER;
        else return roomTypes.NORMAL;
    },

    // skip keeper
    getRoomsInRange: function (roomName, range, curret = null) {
        if (!range) return [];

        if (!curret) curret = [roomName];
        _.forEach(Game.map.describeExits(roomName), rN => {
            if (!curret.includes(rN) && this.getRoomType(rN) === roomTypes.NORMAL) {
                curret.push(rN);
                this.getRoomsInRange(rN, range - 1, curret);
            }
        })

        return curret;
    },

    getRoomsInRangeBFS: function (roomName, range) {
        const inRangeRooms = [roomName];
        let p = 0;

        while (range > 0) {
            let roomCount = inRangeRooms.length - p;
            for (let i = 0; i < roomCount; i++) {
                const neerRooms = Game.map.describeExits(inRangeRooms[p++]);
                _.forEach(neerRooms, rN => {
                    if (!inRangeRooms.includes(rN)) {
                        inRangeRooms.push(rN);
                    }
                })
            }
            range -= 1;
        }

        return inRangeRooms;
    },

    getRoomInfo: function (room) {
        if (!room) return;
        // if (room.memory.roomInfo) return room.memory.roomInfo;
        
        const roomInfo = {};
        roomInfo.roomType = this.getRoomType(room.name);
        roomInfo.sourceInfo = room.find(FIND_SOURCES).map(source => {
            return {
                pos: source.pos,
                space: this.getPosAccessSpace(room, source.pos)
            };
        });
        if (roomInfo.roomType !== roomTypes.HIGHWAY) {
            let mineral = room.find(FIND_MINERALS)[0];
            roomInfo.mineralPos = mineral.pos;
            roomInfo.mineralType = mineral.mineralType;
        }

        return roomInfo;
    },

    getPosAccessSpace: function (room, pos) {
        if (!room || !pos) return null;

        let res = 0;

        let directions = [
            [1, 1],
            [1, 0],
            [1, -1],
            [0, 1],
            [0, -1],
            [-1, 1],
            [-1, 0],
            [-1, -1],
        ]

        let terrain = new Room.Terrain(room.name);
        for (const d of directions) {
            if(terrain.get(pos.x + d[0], pos.y + d[1]) !== TERRAIN_MASK_WALL) {
                res += 1;
            }
        }

        return res;

    }
};

module.exports = roomUtil;