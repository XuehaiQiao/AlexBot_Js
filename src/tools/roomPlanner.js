
function planner_loop(roomName, opts = {}) {
    let _this = {};
    _this.visual = new RoomVisual(roomName);
    _this.anchor = getAnchor(roomName);
    _this.terrain = new Room.Terrain(roomName);

    if (!_this.anchor) return;

    let s = 1;

    /**
     * 0 = empty
     * 1 = road
     * 10 = wall
     * 20 = struct
     * 100 = border
     */
    let structuresMatrix = new Uint8Array(2500);
    structuresMatrix_updateTerrain(_this, structuresMatrix);

    let minimalStructs = generateMinimalBase(_this, structuresMatrix);
    if (!minimalStructs) return;
/**/if (opts.render) renderStructs(_this, minimalStructs); if (opts.step < ++s) return;
/**/if (opts.render) renderMinimal(_this);

    let labs = generateLabs(_this, structuresMatrix);
    if (!labs) return;
/**/if (opts.render) renderStructs(_this, labs); if (opts.step < ++s) return;

    let exts = generateExtensions(_this, structuresMatrix);
    if (!exts) return;
/**/if (opts.render) renderStructs(_this, exts); if (opts.step < ++s) return;
};



function getAnchor(roomName) {
    let room = Game.rooms[roomName];
    if (!room) { console.log('no room'); return null; }
    let flags = room.find(FIND_FLAGS, { filter: { color: COLOR_RED } });
    if (!flags.length) { console.log(`getAnchor: no (red) flag!`); return null; }
    if (flags.length > 1) { console.log(`getAnchor: too many (red) flags!`); return null; }
    return flags[0].pos;
};

function generateMinimalBase(_this, structuresMatrix) {
    let minimal = getMinimalBase();
    for (let elem of minimal) {
        let x = elem[0] + _this.anchor.x;
        let y = elem[1] + _this.anchor.y;
        let type = elem[2];
        if (type == STRUCTURE_ROAD) structuresMatrix[x * 50 + y] = 1;
        else structuresMatrix[x * 50 + y] = 20 + structToNumber(elem[2]);
    }
    return minimal;
};

function getMinimalBase() {
    return [[- 2, -2, STRUCTURE_EXTENSION],
    [-1, -2, STRUCTURE_EXTENSION],
    [0, -2, STRUCTURE_SPAWN],
    [1, -2, STRUCTURE_ROAD],
    [2, -2, STRUCTURE_EXTENSION],
    [-2, -1, STRUCTURE_ROAD],
    //[-1, -1],
    [0, -1, STRUCTURE_ROAD],
    [1, -1, STRUCTURE_SPAWN],
    [2, -1, STRUCTURE_EXTENSION],
    [-2, 0, STRUCTURE_EXTENSION],
    [-1, 0, STRUCTURE_ROAD],
    //[0,0],
    [1, 0, STRUCTURE_POWER_SPAWN],
    [2, 0, STRUCTURE_SPAWN],
    [-2, 1, STRUCTURE_ROAD],
    //[-1, 1]
    [0, 1, STRUCTURE_ROAD],
    //[1, 1]
    [2, 1, STRUCTURE_ROAD],
    [-2, 2, STRUCTURE_LINK],
    [-1, 2, STRUCTURE_STORAGE],
    [0, 2, STRUCTURE_TERMINAL],
    [1, 2, STRUCTURE_ROAD],
    [2, 2, STRUCTURE_EXTENSION],
    ];
};

function renderStructs(_this, structs) {
    for (let elem of structs) {
        renderElem(_this, elem);
    }
};


function renderMinimal(_this) {
    let x = _this.anchor.x;
    let y = _this.anchor.y;
    let points = [[x - 2.4, y - 2.4], [x + 2.4, y - 2.4], [x + 2.4, y + 2.4], [x - 2.4, y + 2.4], [x - 2.4, y - 2.4]];
    _this.visual.poly(points, { stroke: '#ff4444', lineStyle: 'dashed' });
}


function renderElem(_this, elem) {
    if (!elem) return;
    let type = elem[2];
    if (!type) return;

    let x = _this.anchor.x + elem[0];
    let y = _this.anchor.y + elem[1];
    _this.visual.structure(x, y, type);
};

function structuresMatrix_updateTerrain(_this, structuresMatrix) {
    for (var x = 0; x < 50; ++x) {
        for (var y = 0; y < 50; ++y) {
            if (_this.terrain.get(x, y) & TERRAIN_MASK_WALL) {
                structuresMatrix[x * 50 + y] = 10;
            } else {
                structuresMatrix[x * 50 + y] = 0;
            }
        }
    }
    for (var i = 0; i < 50; ++i) {
        let x, y;
        x = 0; y = i; structuresMatrix[x * 50 + y] = 100;
        x = 49; y = i; structuresMatrix[x * 50 + y] = 100;
        x = i; y = 0; structuresMatrix[x * 50 + y] = 100;
        x = i; y = 49; structuresMatrix[x * 50 + y] = 100;
    }
};

function generateLabs(_this, structuresMatrix) {
    let labs = getLabs();
    if (!canPlaceStructs(_this.anchor, structuresMatrix, labs)) {
        console.log('cant place labs');
        return null;
    }
    structuresMatrix_updateStructures(_this, structuresMatrix, labs);
    return labs;
};

function getLabs() {
    return [[-1, 3, STRUCTURE_LAB],
    [-2, 3, STRUCTURE_LAB],
    [-2, 4, STRUCTURE_LAB],
    [-3, 4, STRUCTURE_LAB],
    [-3, 5, STRUCTURE_LAB],
    [0, 4, STRUCTURE_LAB],
    [0, 5, STRUCTURE_LAB],
    [-1, 5, STRUCTURE_LAB],
    [-1, 6, STRUCTURE_LAB],
    [-2, 6, STRUCTURE_LAB]
    ];
};

function canPlaceStructs(anchor, structuresMatrix, array) {
    for (let elem of array) {
        let x = anchor.x + elem[0];
        let y = anchor.y + elem[1];
        if (!isEmptySpot(structuresMatrix, x, y)) return false;
    }
    return true;
};

function isEmptySpot(structuresMatrix, x, y) {
    return structuresMatrix[x * 50 + y] < 1;
};

function isNotWall(anchor, structuresMatrix, elem) {
    let x = anchor.x + elem[0];
    let y = anchor.y + elem[1];
    let val = structuresMatrix[x * 50 + y];
    if (val == 10 || val == 100) {
        return false;
    }
    return true;
};

function structuresMatrix_updateStructures(_this, structuresMatrix, structs) {
    for (let elem of structs) {
        let x = _this.anchor.x + elem[0];
        let y = _this.anchor.y + elem[1];
        if (structuresMatrix[x * 50 + y] > 1) { console.log(x + ' ' + y + ' bad ' + structuresMatrix[x * 50 + y]); }
        structuresMatrix[x * 50 + y] = 20 + structToNumber(elem[2]);
    }
};

function structuresMatrix_updateStructures_revert(_this, structuresMatrix, structs) {
    for (let elem of structs) {
        let x = _this.anchor.x + elem[0];
        let y = _this.anchor.y + elem[1];
        structuresMatrix[x * 50 + y] = 0;
    }
};



function generateExtensions(_this, structuresMatrix) {
    let consider_points = getMinimalBaseExitPoints();

    let diagonals = [[-2, -2], [2, -2], [-2, 2], [2, 2]];
    let result = [];

    let ext_no = 0;

    while (consider_points.length) {
        let consider_start = consider_points.shift();

        for (let d of diagonals) {
            let new_point = addPoints(consider_start, d);
            let exts = tryBuildExtAroundPoint(_this.anchor, structuresMatrix, new_point);
            if (!exts) continue;

            structuresMatrix_updateStructures(_this, structuresMatrix, exts);

            let res = generateRoadsBetween(structuresMatrix, exts, consider_start, new_point, _this.anchor, result);
            if (res === null) {
                structuresMatrix_updateStructures_revert(_this, structuresMatrix, exts);
                continue;
            }

            structuresMatrix_updateStructures(_this, structuresMatrix, res);
            exts = exts.concat(res);

            result = result.concat(exts);
            ext_no += exts.filter(x => x[2] == STRUCTURE_EXTENSION).length;

            for (let dx = -1; dx <= 1; ++dx) {
                if (dx == 0) continue;
                for (let dy = -1; dy <= 1; ++dy) {
                    if (dy == 0) continue;
                    consider_points.push(addPoints(new_point, [dx, dy]));
                }
            }
        }

        if (ext_no >= 80) break;
    }
    return result;
};


function getMinimalBaseExitPoints() {
    return [
        [-2, -1],
        [-2, 1],
        [1, -2],
        [1, 2],
        [2, 1],
    ];
};

function addPoints(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1]];
}

function tryBuildExtAroundPoint(anchor, structuresMatrix, new_point) {
    let exts = [];
    for (let dx = -1; dx <= 1; ++dx) {
        for (let dy = -1; dy <= 1; ++dy) {
            let x = new_point[0] + dx;
            let y = new_point[1] + dy;

            if (dx == 0 && dy == 0)
                exts.push([x, y, STRUCTURE_ROAD]);
            else
                exts.push([x, y, STRUCTURE_EXTENSION]);
        }
    }

    let matching_ext = 0;
    for (let i = exts.length - 1; i >= 0; --i) {
        let elem = exts[i];
        let x = anchor.x + elem[0];
        let y = anchor.y + elem[1];
        if (structuresMatrix[x * 50 + y] == (20 + structToNumber(STRUCTURE_EXTENSION))) matching_ext++;
        if (structuresMatrix[x * 50 + y] > 0) {
            exts.splice(i, 1);
        }
    }
    if (matching_ext > 2 || exts.length < 6) return null;
    return exts;
};

function generateRoadsBetween(structuresMatrix, exts, p1, p2, anchor, structs) {
    let dx = 0;
    let dy = 0;
    if (p1[0] < p2[0]) dx = 1;
    if (p1[0] > p2[0]) dx = -1;
    if (p1[1] < p2[1]) dy = 1;
    if (p1[1] > p2[1]) dy = -1;

    let bonusExt = [];
    const placeRoadAndBonusExt = (x, y, s) => {
        s[2] = STRUCTURE_ROAD;
        let e = generateBonusExtsBetween(x, y, structuresMatrix, anchor, exts);
        for (let it_e of e) {
            let duplicate = false;
            for (let elem of bonusExt) {
                if (elem[0] == it_e[0] && elem[1] == it_e[1]) { duplicate = true; break; }
            }
            if (!duplicate) bonusExt.push(it_e);
        }
    };

    let x = p1[0];
    let y = p1[1];
    let _limit = 0;
    while (_limit++ < 1000) {

        if (!isNotWall(anchor, structuresMatrix, [x, y, STRUCTURE_ROAD])) {
            return null;
        }

        for (let s of exts) {
            if (s[0] == x && s[1] == y) {
                if (s[2] == STRUCTURE_EXTENSION) {
                    placeRoadAndBonusExt(x, y, s);
                } else if (s[2] != STRUCTURE_ROAD) {
                    return null;
                }
                break;
            }
        }

        for (let s of structs) {
            if (s[0] == x && s[1] == y) {
                if (s[2] == STRUCTURE_EXTENSION) {
                    //if (!isNotWall(anchor, structuresMatrix, s)) return null;
                    placeRoadAndBonusExt(x, y, s);
                } else if (s[2] != STRUCTURE_ROAD) {
                    return null;
                }
                break;
            }
        }
        if (x == p2[0] && y == p2[1]) break;
        x += dx;
        y += dy;
    }

    return bonusExt;
};

function generateBonusExtsBetween(mx, my, structuresMatrix, anchor, exts) {
    let result = [];
    for (let dx = -1; dx <= 1; ++dx) {
        for (let dy = -1; dy <= 1; ++dy) {
            if (dx == 0 && dy == 0) continue;
            let x = anchor.x + mx + dx;
            let y = anchor.y + my + dy;

            if (!isEmptySpot(structuresMatrix, x, y)) continue;
            let stop = false;
            for (let s of exts) {
                if (s[0] == (mx + dx) && s[1] == (my + dy)) stop = true;
            }
            if (stop) continue;
            result.push([mx + dx, my + dy, STRUCTURE_EXTENSION]);
        }
    }

    return result;
};





function structToNumber(s) {
    switch (s) {
        case STRUCTURE_SPAWN: return 1;
        case STRUCTURE_EXTENSION: return 2;
        case STRUCTURE_ROAD: return 3;
        case STRUCTURE_WALL: return 4;
        case STRUCTURE_RAMPART: return 5;
        case STRUCTURE_KEEPER_LAIR: return 6;
        case STRUCTURE_PORTAL: return 7;
        case STRUCTURE_CONTROLLER: return 8;
        case STRUCTURE_LINK: return 9;
        case STRUCTURE_STORAGE: return 10;
        case STRUCTURE_TOWER: return 11;
        case STRUCTURE_OBSERVER: return 12;
        case STRUCTURE_POWER_BANK: return 13;
        case STRUCTURE_POWER_SPAWN: return 14;
        case STRUCTURE_EXTRACTOR: return 15;
        case STRUCTURE_LAB: return 16;
        case STRUCTURE_TERMINAL: return 17;
        case STRUCTURE_CONTAINER: return 18;
        case STRUCTURE_NUKER: return 19;
        case STRUCTURE_FACTORY: return 20;
        case STRUCTURE_INVADER_CORE: return 21;
        default: return 30;
    }
}








const colors = {
    gray: '#9c9c9c',
    light: '#cfcfcf',
    road: '#969696',
    energy: '#fff1a8',
    power: '#f98591',
    dark: '#5e5e5e',
    outline: '#c3dac5',
}

const speechSize = 0.5
const speechFont = 'Times New Roman'
function calculateFactoryLevelGapsPoly() {
    let x = -0.08;
    let y = -0.52;
    let result = [];

    let gapAngle = 16 * (Math.PI / 180);
    let c1 = Math.cos(gapAngle);
    let s1 = Math.sin(gapAngle);

    let angle = 72 * (Math.PI / 180);
    let c2 = Math.cos(angle);
    let s2 = Math.sin(angle);

    for (let i = 0; i < 5; ++i) {
        result.push([0.0, 0.0]);
        result.push([x, y]);
        result.push([x * c1 - y * s1, x * s1 + y * c1]);
        let tmpX = x * c2 - y * s2;
        y = x * s2 + y * c2;
        x = tmpX;
    }
    return result;
}
const factoryLevelGaps = calculateFactoryLevelGapsPoly();

RoomVisual.prototype.structure = function (x, y, type, opts = {}) {
    if (!opts.opacity) opts.opacity = 1;
    switch (type) {
        case STRUCTURE_FACTORY: {
            const outline = [
                [-0.68, -0.11],
                [-0.84, -0.18],
                [-0.84, -0.32],
                [-0.44, -0.44],
                [-0.32, -0.84],
                [-0.18, -0.84],
                [-0.11, -0.68],

                [0.11, -0.68],
                [0.18, -0.84],
                [0.32, -0.84],
                [0.44, -0.44],
                [0.84, -0.32],
                [0.84, -0.18],
                [0.68, -0.11],

                [0.68, 0.11],
                [0.84, 0.18],
                [0.84, 0.32],
                [0.44, 0.44],
                [0.32, 0.84],
                [0.18, 0.84],
                [0.11, 0.68],

                [-0.11, 0.68],
                [-0.18, 0.84],
                [-0.32, 0.84],
                [-0.44, 0.44],
                [-0.84, 0.32],
                [-0.84, 0.18],
                [-0.68, 0.11]
            ];
            this.poly(outline.map(p => [p[0] + x, p[1] + y]), {
                fill: null,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            });
            // outer circle
            this.circle(x, y, {
                radius: 0.65,
                fill: '#232323',
                strokeWidth: 0.035,
                stroke: '#140a0a',
                opacity: opts.opacity
            });
            const spikes = [
                [-0.4, -0.1],
                [-0.8, -0.2],
                [-0.8, -0.3],
                [-0.4, -0.4],
                [-0.3, -0.8],
                [-0.2, -0.8],
                [-0.1, -0.4],

                [0.1, -0.4],
                [0.2, -0.8],
                [0.3, -0.8],
                [0.4, -0.4],
                [0.8, -0.3],
                [0.8, -0.2],
                [0.4, -0.1],

                [0.4, 0.1],
                [0.8, 0.2],
                [0.8, 0.3],
                [0.4, 0.4],
                [0.3, 0.8],
                [0.2, 0.8],
                [0.1, 0.4],

                [-0.1, 0.4],
                [-0.2, 0.8],
                [-0.3, 0.8],
                [-0.4, 0.4],
                [-0.8, 0.3],
                [-0.8, 0.2],
                [-0.4, 0.1]
            ];
            this.poly(spikes.map(p => [p[0] + x, p[1] + y]), {
                fill: colors.gray,
                stroke: '#140a0a',
                strokeWidth: 0.04,
                opacity: opts.opacity
            });
            // factory level circle
            this.circle(x, y, {
                radius: 0.54,
                fill: '#302a2a',
                strokeWidth: 0.04,
                stroke: '#140a0a',
                opacity: opts.opacity
            });
            this.poly(factoryLevelGaps.map(p => [p[0] + x, p[1] + y]), {
                fill: '#140a0a',
                stroke: null,
                opacity: opts.opacity
            });
            // inner black circle
            this.circle(x, y, {
                radius: 0.42,
                fill: '#140a0a',
                opacity: opts.opacity
            });
            this.rect(x - 0.24, y - 0.24, 0.48, 0.48, {
                fill: '#3f3f3f',
                opacity: opts.opacity
            });
            break;
        }
        case STRUCTURE_EXTENSION:
            this.circle(x, y, {
                radius: 0.5,
                fill: colors.dark,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.circle(x, y, {
                radius: 0.35,
                fill: colors.gray,
                opacity: opts.opacity
            })
            break
        case STRUCTURE_SPAWN:
            this.circle(x, y, {
                radius: 0.65,
                fill: colors.dark,
                stroke: '#CCCCCC',
                strokeWidth: 0.10,
                opacity: opts.opacity
            })
            this.circle(x, y, {
                radius: 0.40,
                fill: colors.energy,
                opacity: opts.opacity
            })

            break;
        case STRUCTURE_POWER_SPAWN:
            this.circle(x, y, {
                radius: 0.65,
                fill: colors.dark,
                stroke: colors.power,
                strokeWidth: 0.10,
                opacity: opts.opacity
            })
            this.circle(x, y, {
                radius: 0.40,
                fill: colors.energy,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_LINK:
            {
                let osize = 0.3
                let isize = 0.2
                let outer = [
                    [0.0, -0.5],
                    [0.4, 0.0],
                    [0.0, 0.5],
                    [-0.4, 0.0]
                ]
                let inner = [
                    [0.0, -0.3],
                    [0.25, 0.0],
                    [0.0, 0.3],
                    [-0.25, 0.0]
                ]
                outer = relPoly(x, y, outer)
                inner = relPoly(x, y, inner)
                outer.push(outer[0])
                inner.push(inner[0])
                this.poly(outer, {
                    fill: colors.dark,
                    stroke: colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                })
                this.poly(inner, {
                    fill: colors.gray,
                    stroke: false,
                    opacity: opts.opacity
                })
                break;
            }
        case STRUCTURE_TERMINAL:
            {
                let outer = [
                    [0.0, -0.8],
                    [0.55, -0.55],
                    [0.8, 0.0],
                    [0.55, 0.55],
                    [0.0, 0.8],
                    [-0.55, 0.55],
                    [-0.8, 0.0],
                    [-0.55, -0.55],
                ]
                let inner = [
                    [0.0, -0.65],
                    [0.45, -0.45],
                    [0.65, 0.0],
                    [0.45, 0.45],
                    [0.0, 0.65],
                    [-0.45, 0.45],
                    [-0.65, 0.0],
                    [-0.45, -0.45],
                ]
                outer = relPoly(x, y, outer)
                inner = relPoly(x, y, inner)
                outer.push(outer[0])
                inner.push(inner[0])
                this.poly(outer, {
                    fill: colors.dark,
                    stroke: colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                })
                this.poly(inner, {
                    fill: colors.light,
                    stroke: false,
                    opacity: opts.opacity
                })
                this.rect(x - 0.45, y - 0.45, 0.9, 0.9, {
                    fill: colors.gray,
                    stroke: colors.dark,
                    strokeWidth: 0.1,
                    opacity: opts.opacity
                })
                break;
            }
        case STRUCTURE_LAB:
            this.circle(x, y - 0.025, {
                radius: 0.55,
                fill: colors.dark,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.circle(x, y - 0.025, {
                radius: 0.40,
                fill: colors.gray,
                opacity: opts.opacity
            })
            this.rect(x - 0.45, y + 0.3, 0.9, 0.25, {
                fill: colors.dark,
                stroke: false,
                opacity: opts.opacity
            })
            {
                let box = [
                    [-0.45, 0.3],
                    [-0.45, 0.55],
                    [0.45, 0.55],
                    [0.45, 0.3],
                ]
                box = relPoly(x, y, box)
                this.poly(box, {
                    stroke: colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                })
            }
            break
        case STRUCTURE_TOWER:
            this.circle(x, y, {
                radius: 0.6,
                fill: colors.dark,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.rect(x - 0.4, y - 0.3, 0.8, 0.6, {
                fill: colors.gray,
                opacity: opts.opacity
            })
            this.rect(x - 0.2, y - 0.9, 0.4, 0.5, {
                fill: colors.light,
                stroke: colors.dark,
                strokeWidth: 0.07,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_ROAD:
            this.circle(x, y, {
                radius: 0.175,
                fill: colors.road,
                stroke: false,
                opacity: opts.opacity
            })
            if (!this.roads) this.roads = []
            this.roads.push([x, y])
            break;
        case STRUCTURE_RAMPART:
            this.circle(x, y, {
                radius: 0.65,
                fill: '#434C43',
                stroke: '#5D735F',
                strokeWidth: 0.10,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_WALL:
            this.circle(x, y, {
                radius: 0.40,
                fill: colors.dark,
                stroke: colors.light,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_STORAGE:
            let outline1 = relPoly(x, y, [
                [-0.45, -0.55],
                [0, -0.65],
                [0.45, -0.55],
                [0.55, 0],
                [0.45, 0.55],
                [0, 0.65],
                [-0.45, 0.55],
                [-0.55, 0],
                [-0.45, -0.55],
            ])
            this.poly(outline1, {
                stroke: colors.outline,
                strokeWidth: 0.05,
                fill: colors.dark,
                opacity: opts.opacity
            })
            this.rect(x - 0.35, y - 0.45, 0.7, 0.9, {
                fill: colors.energy,
                opacity: opts.opacity,
            })
            break;
        case STRUCTURE_OBSERVER:
            this.circle(x, y, {
                fill: colors.dark,
                radius: 0.45,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.circle(x + 0.225, y, {
                fill: colors.outline,
                radius: 0.20,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_NUKER:
            let outline = [
                [0, -1],
                [-0.47, 0.2],
                [-0.5, 0.5],
                [0.5, 0.5],
                [0.47, 0.2],
                [0, -1],
            ];
            outline = relPoly(x, y, outline)
            this.poly(outline, {
                stroke: colors.outline,
                strokeWidth: 0.05,
                fill: colors.dark,
                opacity: opts.opacity
            })
            let inline = [
                [0, -.80],
                [-0.40, 0.2],
                [0.40, 0.2],
                [0, -.80],
            ]
            inline = relPoly(x, y, inline)
            this.poly(inline, {
                stroke: colors.outline,
                strokeWidth: 0.01,
                fill: colors.gray,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_CONTAINER:
            this.rect(x - 0.225, y - 0.3, 0.45, 0.6, {
                fill: colors.gray,
                opacity: opts.opacity,
                stroke: colors.dark,
                strokeWidth: 0.09,
            })
            this.rect(x - 0.17, y + 0.07, 0.34, 0.2, {
                fill: colors.energy,
                opacity: opts.opacity,
            })
            break;
        default:
            this.circle(x, y, {
                fill: colors.light,
                radius: 0.35,
                stroke: colors.dark,
                strokeWidth: 0.20,
                opacity: opts.opacity
            })
            break;
    }

    return this;
}

const dirs = [
    [],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
]

function relPoly(x, y, poly) {
    return poly.map(p => {
        p[0] += x
        p[1] += y
        return p
    })
}

module.exports = planner_loop;