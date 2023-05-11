(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@youwol/math"), require("@youwol/dataframe"));
	else if(typeof define === 'function' && define.amd)
		define("@youwol/geometry", ["@youwol/math", "@youwol/dataframe"], factory);
	else if(typeof exports === 'object')
		exports["@youwol/geometry"] = factory(require("@youwol/math"), require("@youwol/dataframe"));
	else
		root["@youwol/geometry"] = factory(root["@youwol/math"], root["@youwol/dataframe"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__youwol_math__, __WEBPACK_EXTERNAL_MODULE__youwol_dataframe__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/AnglesToNormal.ts":
/*!*******************************!*\
  !*** ./lib/AnglesToNormal.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnglesToNormal": () => (/* binding */ AnglesToNormal)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _extrude_angles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extrude/angles */ "./lib/extrude/angles.ts");
// import { Vector3, between_0_360, rad2deg, deg2rad } from "@youwol/math"


class AnglesToNormal {
    constructor() {
        this._dip = 0;
        this._dipAzim = 0;
        this._n = undefined;
    }
    get dipAngle() {
        return this._dip;
    }
    get dipAzimuth() {
        return this._dipAzim;
    }
    get strikeAngle() {
        return (0,_extrude_angles__WEBPACK_IMPORTED_MODULE_1__.between_0_360)(this._dipAzim - 90);
    }
    get strikeVector() {
        let l = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.norm(this._n);
        if (l === 0) {
            l = 1;
        }
        let nx = this._n[0] / l;
        let ny = this._n[1] / l;
        if (this._n[2] < 0) {
            nx = -nx;
            ny = -ny;
        }
        let s = [-ny, nx, 0];
        s = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.normalize(s);
        return s;
    }
    get normal() {
        return this._n;
    }
    get normalX() {
        return this._n[0];
    }
    get normalY() {
        return this._n[1];
    }
    get normalZ() {
        return this._n[2];
    }
    setNormal(n) {
        this.__set_normal__(n);
        const n_ = this._n;
        // Get the dip-azimuth
        let l = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.norm(this._n);
        if (l === 0) {
            l = 1;
        }
        let nx = n_[0] / l;
        let ny = n_[1] / l;
        if (n_[2] < 0) {
            // put the nornal up
            nx = -nx;
            ny = -ny;
        }
        let alpha = (0,_extrude_angles__WEBPACK_IMPORTED_MODULE_1__.rad2deg)(Math.asin(nx));
        if (ny < 0) {
            alpha = 180 - alpha;
        }
        if (alpha < 0) {
            alpha = 360 + alpha;
        }
        const dip_azim = alpha;
        // Get the dip-angle
        let dip = 0;
        if (n_[2] >= 0) {
            dip = (0,_extrude_angles__WEBPACK_IMPORTED_MODULE_1__.rad2deg)(Math.acos(n_[2]));
        }
        else {
            dip = (0,_extrude_angles__WEBPACK_IMPORTED_MODULE_1__.rad2deg)(Math.acos(-n_[2]));
        }
        this._dip = dip;
        this._dipAzim = dip_azim;
    }
    setOrientation({ dipAngle, dipAzimuth, }) {
        this.__set_angles__(dipAngle, dipAzimuth);
        const delta = (0,_extrude_angles__WEBPACK_IMPORTED_MODULE_1__.deg2rad)(dipAngle);
        const alpha = (0,_extrude_angles__WEBPACK_IMPORTED_MODULE_1__.deg2rad)(dipAzimuth);
        this._n = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.normalize([
            Math.sin(delta) * Math.sin(alpha),
            Math.sin(delta) * Math.cos(alpha),
            Math.cos(delta),
        ]);
    }
    __set_normal__(n) {
        this._n = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.clone(n);
        this._n = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.normalize(this._n);
    }
    __set_angles__(dip, dipazim) {
        this._dip = dip;
        this._dipAzim = dipazim;
    }
}


/***/ }),

/***/ "./lib/HarmonicDiffusion.ts":
/*!**********************************!*\
  !*** ./lib/HarmonicDiffusion.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HarmonicDiffusion": () => (/* binding */ HarmonicDiffusion)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _he__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./he */ "./lib/he/index.ts");


/**
 * Use Laplace equation to diffuse an attribute (number or Array<number>) given
 * some constraints at nodes on triangulated surface.
 *
 * @example
 * Diffuse a scalar field
 * ```js
 * const diff = new geom.HarmonicDiffusion(positions, indices)
 * laplace.constrainsBorders(-1)
 * laplace.addConstraint([-800,-300,-800], 1)
 * laplace.addConstraint([   0,-300, 800], 1)
 * const dataframe = diff.solve({name='P'}) // Serie.itemSize = 1
 * ```
 *
 * @example
 * Diffuse a vector field of size 3
 * ```js
 * const diff = new geom.HarmonicDiffusion(positions, indices, [0,0,0])
 * laplace.constrainsBorders(              [-1, -2, -3])
 * laplace.addConstraint([-800,-300,-800], [ 3,  2,  1])
 * laplace.addConstraint([   0,-300, 800], [ 1,  3,  5])
 * const dataframe = diff.solve({name='P', record: true}) // Serie.itemSize = 3
 * ```
 */
class HarmonicDiffusion {
    /**
     *
     * @param positions The node positions
     * @param indices The indices of the triangles
     * @param initValue The init value tells what kind of data we are going to diffuse. This can be
     * either a scalar or an array of any size. The size of the array will be the `itemSize` of the
     * returned Serie after calling `solve()`
     * The `itemSize` of the returned Serie (after calling `solve()`) will be the length of this array,
     * or 1 if a number is passed.
     */
    constructor(positions, indices, initValue = 0) {
        this.positions = positions;
        this.indices = indices;
        this.surface_ = undefined;
        this.map = new Map();
        this.constrainedNodes = [];
        this.maxIter_ = 618; // :-)
        this.eps_ = 0.382e-5; // :-)
        this.epsilon_ = 0.5;
        this.dataSize = 1;
        this.surface_ = _he__WEBPACK_IMPORTED_MODULE_1__.Surface.create(positions, indices);
        if (Array.isArray(initValue)) {
            this.surface_.forEachNode((n) => this.map.set(n, [...initValue]));
            this.dataSize = initValue.length;
        }
        else {
            this.surface_.forEachNode((n) => this.map.set(n, new Array(1).fill(initValue)));
            this.dataSize = 1;
        }
    }
    get surface() {
        return this.surface_;
    }
    set maxIter(n) {
        this.maxIter_ = n;
    }
    set eps(n) {
        // convergence
        this.eps_ = n;
    }
    set epsilon(n) {
        // smoothing
        this.epsilon_ = n;
    }
    /**
     * Convenient method to constrain all the borders
     */
    constrainsBorders(value) {
        this.surface_.borderNodes.forEach((n) => this.addConstraint(n, value));
    }
    addConstraint(n, value) {
        // Checking...
        if (Array.isArray(value)) {
            if (value.length !== this.dataSize) {
                throw new Error(`array length problem. Should be ${this.dataSize}`);
            }
        }
        else {
            if (this.dataSize !== 1) {
                throw new Error(`value problem. Should be an array of size ${this.dataSize}`);
            }
        }
        if (Array.isArray(n)) {
            const node = this.findNode(n);
            if (node && this.constrainedNodes.includes(node) === false) {
                this.pushNode(node, value);
            }
        }
        else {
            if (this.constrainedNodes.includes(n) === false) {
                this.pushNode(n, value);
            }
        }
    }
    /**
     * Solve the discrete laplace equation using relaxation
     * @returns A DataFrame containing positions, indices series as well as the computed `"property"` as a serie.
     * If `record=true`, a serie will be recorded every `step`. If `step=0`, only the begining step is recorded.
     */
    solve({ name = 'property', record = false, step = 0, }) {
        // TODO: optimize by removing the map and creating array
        //       of active nodes and array of values
        let conv = 1;
        let idx = 0;
        let j = 1;
        const initData = new Map(this.map);
        const df = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.DataFrame.create({
            series: {
                positions: this.positions,
                indices: this.indices,
            },
        });
        while (conv > this.eps_) {
            conv = 0;
            this.surface_.forEachNode((n) => {
                if (this.constrainedNodes.includes(n) === false) {
                    const val = new Array(this.dataSize).fill(0);
                    let nb = 0;
                    (0,_he__WEBPACK_IMPORTED_MODULE_1__.nodesAroundNode)(n, (m) => {
                        nb++;
                        this.add(this.map.get(m), val);
                    });
                    this.scale(val, 1 / nb);
                    const tmp = this.map.get(n);
                    this.scale(val, this.epsilon_);
                    this.add(this.scale(tmp, 1 - this.epsilon_), val);
                    this.map.set(n, val);
                    conv += this.norm2(val, this.scale(tmp, 1 / (1 - this.epsilon_)));
                }
            });
            conv = Math.sqrt(conv);
            if (record && step > 0 && idx % step === 0) {
                let i = 0;
                const array = new Array(this.map.size * this.dataSize).fill(0);
                this.map.forEach((value) => value.forEach((v) => (array[i++] = v)));
                df.series[`${name}${j++}`] = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({
                    array,
                    itemSize: this.dataSize,
                });
            }
            idx++;
            if (idx > this.maxIter_) {
                break;
            }
        }
        console.log('HarmonicDiffusion nb iter:', idx);
        console.log('HarmonicDiffusion conv   :', conv);
        // ----------------------------------
        let i = 0;
        const array = new Array(this.map.size * this.dataSize).fill(0);
        this.map.forEach((value) => value.forEach((v) => (array[i++] = v)));
        df.series[name] = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array, itemSize: this.dataSize });
        // ----------------------------------
        if (record && step === 0) {
            let i = 0;
            const array = new Array(this.map.size * this.dataSize).fill(0);
            initData.forEach((value) => value.forEach((v) => (array[i++] = v)));
            df.series[`${name}_init`] = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({
                array,
                itemSize: this.dataSize,
            });
        }
        return df;
    }
    // -------------------------------------------------------------
    add(from, to) {
        from.forEach((v, i) => (to[i] += v));
        return to;
    }
    norm2(a, b) {
        return a.reduce((cur, v, i) => cur + (v - b[i]) ** 2, 0);
    }
    scale(data, sc) {
        for (let i = 0; i < data.length; ++i) {
            data[i] *= sc;
        }
        return data;
    }
    pushNode(node, value) {
        if (Array.isArray(value)) {
            this.map.set(node, value);
        }
        else {
            this.map.set(node, [value]);
        }
        this.constrainedNodes.push(node);
    }
    findNode(p) {
        let node = undefined;
        let d = Number.POSITIVE_INFINITY;
        this.surface_.forEachNode((n) => {
            const dd = (n.pos[0] - p[0]) ** 2 +
                (n.pos[1] - p[1]) ** 2 +
                (n.pos[2] - p[2]) ** 2;
            if (dd < d) {
                d = dd;
                node = n;
            }
        });
        return node;
    }
}


/***/ }),

/***/ "./lib/ImplicitGrid.ts":
/*!*****************************!*\
  !*** ./lib/ImplicitGrid.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./lib/InterpolateInGrid2D.ts":
/*!************************************!*\
  !*** ./lib/InterpolateInGrid2D.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InterpolateInGrid2D": () => (/* binding */ InterpolateInGrid2D)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _background2DGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./background2DGrid */ "./lib/background2DGrid.ts");


/**
 * Usage:
 * ```js
 * const dataframe = io.decodeGocadTS( fs.readFileSync(filename, 'utf8') )[0]
 *
 * const inter = new InterpolateInGrid2D({
 *     positions: dataframe.series.positions,
 *     indices  : dataframe.series.indices,
 *     attribute: dataframe.series.fric,
 *     nx: 100,
 *     ny: 100,
 *     flatten: true
 * })
 *
 * const value = inter.interpolate([0,1])
 * ```
 */
class InterpolateInGrid2D {
    constructor({ positions, indices, attribute, nx, ny, flatten = true, scaling = 1, }) {
        this.positions = undefined;
        this.indices = undefined;
        this.attribute = undefined;
        this.bg = undefined;
        this.eps = 1e-7;
        this.indices = indices;
        this.attribute = attribute;
        this.positions = positions.map((p) => [
            p[0] * scaling,
            p[1] * scaling,
            flatten ? 0 : p[2],
        ]);
        this.bg = (0,_background2DGrid__WEBPACK_IMPORTED_MODULE_1__.createBackgroundGrid2D)({
            positions: this.positions,
            indices: this.indices,
            dims: [nx, ny],
        });
        this.eps = Math.max(this.bg.bbox.width, this.bg.bbox.height) * 1e-4;
    }
    get backgroundGrid() {
        return this.bg;
    }
    interpolate(p) {
        const inTriangle = (p, p1, p2, p3) => {
            const unity = (coord) => coord >= -this.eps && coord <= 1 + this.eps;
            const w = (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.barycentric2)(p, p1, p2, p3);
            return unity(w[0]) && unity(w[1]) && unity(w[2]);
        };
        const sol = this.bg.candidates(p);
        if (sol && sol.length) {
            for (let k = 0; k < sol.length; ++k) {
                const s = sol[k];
                const index = s.obj;
                const cell = this.indices.itemAt(index);
                const p1 = this.positions.itemAt(cell[0]);
                const p2 = this.positions.itemAt(cell[1]);
                const p3 = this.positions.itemAt(cell[2]);
                if (inTriangle(p, p1, p2, p3)) {
                    const q1 = this.attribute.itemAt(cell[0]);
                    const q2 = this.attribute.itemAt(cell[1]);
                    const q3 = this.attribute.itemAt(cell[2]);
                    const v = (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.triangleLerp2D)([p[0], p[1]], [p1[0], p1[1]], [p2[0], p2[1]], [p3[0], p3[1]], q1, q2, q3);
                    return v;
                }
            }
        }
        return undefined;
    }
}


/***/ }),

/***/ "./lib/InterpolateSerie.ts":
/*!*********************************!*\
  !*** ./lib/InterpolateSerie.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InterpolateSerieFromCsysOnSurface": () => (/* binding */ InterpolateSerieFromCsysOnSurface)
/* harmony export */ });
/* harmony import */ var _he__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./he */ "./lib/he/index.ts");
/* harmony import */ var _plane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plane */ "./lib/plane.ts");


/**
 * For a given triangulated surface where a serie is defined at the triangles and localy, allows to interpolation
 * this serie at nodes (or not) and globaly (or not).
 *
 * The local coordinate system is the one defoned in Arch (see Arch documentation), i.e., the Okada local
 * coordinate system.
 *
 * @example
 * ```js
 * const arch = require('@youwol/arch')
 * const geom = require('@youwol/geometry')
 *
 * // Given a serie defined in local coordinate system
 * // and at triangles...
 * //
 * const solution = new arch.Solution(model)
 * const burgers  = solution.burgers(true, true)
 *
 * // ...get a new serie defined at nodes and globally
 * //
 * const i = new InterpolateSerieOnSurface(positions, indices)
 * const newSerie = i.interpolate({
 *      serie      : burgers,
 *      atTriangles: false,
 *      localCsys  : false
 * })
 * ```
 */
class InterpolateSerieFromCsysOnSurface {
    constructor(positions, indices) {
        this.surface = undefined;
        this.surface = _he__WEBPACK_IMPORTED_MODULE_0__.Surface.create(positions, indices);
    }
    // setAxisOrder (x: string, y: string, z: string) {
    // }
    // setAxisRevert(x: boolean, y: boolean, z: boolean) {
    // }
    /**
     * serie must be defined at triangles and only (for the moment) with itemSize = 3
     */
    interpolate({ serie, atTriangles = false, localCsys = true, }) {
        if (serie.itemSize !== 3) {
            throw new Error('For the moment, only series with itemSize = 3 is allowed');
        }
        if (serie.count !== this.surface.nbFacets) {
            throw new Error(`serie must be either defined at triangles (count=${this.surface.nbFacets}). Got count=${serie.itemSize}`);
        }
        if (atTriangles == true) {
            // no interpolation
            // const b = serie.newInstance({count: serie.count, itemSize: 3})
            const b = serie.image(serie.count, 3);
            const array = b.array;
            let id = 0;
            this.surface.forEachFace((face, i) => {
                let v = serie.itemAt(i);
                if (localCsys === false) {
                    const t = new _plane__WEBPACK_IMPORTED_MODULE_1__.TriangleCSys(face.normal);
                    v = t.toGlobal(v);
                }
                array[id++] = v[0];
                array[id++] = v[1];
                array[id++] = v[2];
            });
            return b;
        }
        else {
            // Linear-interpolate displ from triangles to vertices
            // const b = serie.newInstance({count: this.surface.nbNodes, itemSize: 3})
            const b = serie.image(this.surface.nbNodes, 3);
            const array = b.array;
            const values = new Array(this.surface.nbNodes).fill([
                0, 0, 0,
            ]);
            const weights = new Array(this.surface.nbNodes).fill(0);
            this.surface.forEachFace((face, i) => {
                const ids = face.nodeIds;
                let d = serie.itemAt(i);
                if (localCsys === false) {
                    const t = new _plane__WEBPACK_IMPORTED_MODULE_1__.TriangleCSys(face.normal);
                    d = t.toGlobal(d);
                }
                for (let j = 0; j < 3; ++j) {
                    for (let k = 0; k < 3; ++k) {
                        values[ids[j]][k] += d[k];
                    }
                    weights[ids[j]]++;
                }
                for (let j = 0; j < this.surface.nbNodes; ++j) {
                    const w = weights[j];
                    for (let k = 0; k < 3; ++k) {
                        values[j][k] /= w;
                    }
                }
            });
            let id = 0;
            values.forEach((v) => {
                array[id++] = v[0];
                array[id++] = v[1];
                array[id++] = v[2];
            });
            return b;
        }
    }
}


/***/ }),

/***/ "./lib/MarchingCubes.ts":
/*!******************************!*\
  !*** ./lib/MarchingCubes.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MarchingCubes": () => (/* binding */ MarchingCubes)
/* harmony export */ });
class MarchingCubes {
    constructor(grid, values) {
        this.grid = grid;
        this.values = values;
        this.XYZ_ = true;
        this.bounds_ = [];
        if (this.grid.sizes.length !== 3) {
            throw new Error('sizes must be an array of length 3');
        }
        const nb = grid.sizes.reduce((cur, dim) => cur * dim, 1);
        if (nb !== values.length) {
            throw new Error(`number of points (${nb}) must equal the number of values (${values.length})`);
        }
    }
    get valid() {
        return this.grid !== undefined && this.values !== undefined;
    }
    /**
     * Set the order of the cube axis to be in XYZ or not (by default XYZ is choosen)
     * The XYZ order means that x is traversed first, then y, then z.
     * Recall that XYZ order means x variation first.
     * The loop is therefore for(z) { for(y) { for(x) {} } } leading to coordinates:
     * 0 0 0
     * 1 0 0
     * 2 0 0
     * 0 1 0
     * 1 1 0
     * 2 1 0
     * ...
     *
     * When the order is not XYZ, thz z axis is traversed first, then y, then x.
     * The loop is therefore for(x) { for(y) { for(z) {} } } leading to coordinates:
     * 0 0 0
     * 0 0 1
     * 0 0 2
     * 0 1 0
     * 0 1 1
     * 0 1 2
     * ...
     *
     * By default the order is XYZ.
     * @param {bool} isXYZ if the cube is defined in the XYZ order
     */
    set xyzOrder(isXYZ) {
        this.XYZ_ = isXYZ;
    }
    get xyzOrder() {
        return this.XYZ_;
    }
    /**
     *
     * @param isoValue The iso value
     * @param bounds Bounds of the attribute if necessary
     * @returns the object `{positions: number[], indices: number[]}`
     */
    run(isoValue, bounds) {
        if (!this.valid) {
            return { positions: [], indices: [] };
        }
        if (bounds === undefined) {
            this.bounds_ = [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
        }
        else {
            this.bounds_ = bounds;
        }
        const vlist = new Array(12);
        const positions = [];
        const indices = [];
        // const nx = this.grid.sizes[0]
        // const ny = this.grid.sizes[1]
        // const nz = this.grid.sizes[2]
        // const nxy = nx * ny
        let ni, nj, nk;
        if (this.XYZ_ === false) {
            ni = this.grid.sizes[0];
            nj = this.grid.sizes[1];
            nk = this.grid.sizes[2];
        }
        else {
            ni = this.grid.sizes[2];
            nj = this.grid.sizes[1];
            nk = this.grid.sizes[0];
        }
        const nn = nj * nk;
        let vertexIndex = 0;
        for (let ii = 0; ii < ni - 1; ii++) {
            for (let jj = 0; jj < nj - 1; jj++) {
                for (let kk = 0; kk < nk - 1; kk++) {
                    let x, y, z, p, px, py, pxy, pz, pxz, pyz, pxyz;
                    if (this.XYZ_ === false) {
                        x = ii;
                        y = jj;
                        z = kk;
                        p = z + nk * y + nn * x;
                        px = p + nn;
                        py = p + nk;
                        pxy = py + nn;
                        pz = p + 1;
                        pxz = px + 1;
                        pyz = py + 1;
                        pxyz = pxy + 1;
                    }
                    else {
                        x = kk;
                        y = jj;
                        z = ii;
                        p = x + nk * y + nn * z;
                        px = p + 1;
                        py = p + nk;
                        pxy = py + 1;
                        pz = p + nn;
                        pxz = px + nn;
                        pyz = py + nn;
                        pxyz = pxy + nn;
                    }
                    const value0 = this.values[p];
                    const value1 = this.values[px];
                    const value2 = this.values[py];
                    const value3 = this.values[pxy];
                    const value4 = this.values[pz];
                    const value5 = this.values[pxz];
                    const value6 = this.values[pyz];
                    const value7 = this.values[pxyz];
                    const allValues = [
                        value0,
                        value1,
                        value2,
                        value3,
                        value4,
                        value5,
                        value6,
                        value7,
                    ];
                    if (this._ok(allValues) === false) {
                        continue;
                    }
                    let cubeindex = 0;
                    if (value0 < isoValue) {
                        cubeindex |= 1;
                    }
                    if (value1 < isoValue) {
                        cubeindex |= 2;
                    }
                    if (value2 < isoValue) {
                        cubeindex |= 8;
                    }
                    if (value3 < isoValue) {
                        cubeindex |= 4;
                    }
                    if (value4 < isoValue) {
                        cubeindex |= 16;
                    }
                    if (value5 < isoValue) {
                        cubeindex |= 32;
                    }
                    if (value6 < isoValue) {
                        cubeindex |= 128;
                    }
                    if (value7 < isoValue) {
                        cubeindex |= 64;
                    }
                    const bits = edgeTable[cubeindex];
                    if (bits === 0) {
                        continue;
                    }
                    let mu = 0.5;
                    if (bits & 1) {
                        mu = (isoValue - value0) / (value1 - value0);
                        //vlist[0] = this.points[p].clone().lerp(this.points[px], mu)
                        vlist[0] = this.lerp(p, px, mu);
                    }
                    if (bits & 2) {
                        mu = (isoValue - value1) / (value3 - value1);
                        //vlist[1] = this.points[px].clone().lerp(this.points[pxy], mu)
                        vlist[1] = this.lerp(px, pxy, mu);
                    }
                    if (bits & 4) {
                        mu = (isoValue - value2) / (value3 - value2);
                        //vlist[2] = this.points[py].clone().lerp(this.points[pxy], mu)
                        vlist[2] = this.lerp(py, pxy, mu);
                    }
                    if (bits & 8) {
                        mu = (isoValue - value0) / (value2 - value0);
                        //vlist[3] = this.points[p].clone().lerp(this.points[py], mu)
                        vlist[3] = this.lerp(p, py, mu);
                    }
                    if (bits & 16) {
                        mu = (isoValue - value4) / (value5 - value4);
                        //vlist[4] = this.points[pz].clone().lerp(this.points[pxz], mu)
                        vlist[4] = this.lerp(pz, pxz, mu);
                    }
                    if (bits & 32) {
                        mu = (isoValue - value5) / (value7 - value5);
                        //vlist[5] = this.points[pxz].clone().lerp(this.points[pxyz], mu)
                        vlist[5] = this.lerp(pxz, pxyz, mu);
                    }
                    if (bits & 64) {
                        mu = (isoValue - value6) / (value7 - value6);
                        //vlist[6] = this.points[pyz].clone().lerp(this.points[pxyz], mu)
                        vlist[6] = this.lerp(pyz, pxyz, mu);
                    }
                    if (bits & 128) {
                        mu = (isoValue - value4) / (value6 - value4);
                        //vlist[7] = this.points[pz].clone().lerp(this.points[pyz], mu)
                        vlist[7] = this.lerp(pz, pyz, mu);
                    }
                    if (bits & 256) {
                        mu = (isoValue - value0) / (value4 - value0);
                        //vlist[8] = this.points[p].clone().lerp(this.points[pz], mu)
                        vlist[8] = this.lerp(p, pz, mu);
                    }
                    if (bits & 512) {
                        mu = (isoValue - value1) / (value5 - value1);
                        //vlist[9] = this.points[px].clone().lerp(this.points[pxz], mu)
                        vlist[9] = this.lerp(px, pxz, mu);
                    }
                    if (bits & 1024) {
                        mu = (isoValue - value3) / (value7 - value3);
                        //vlist[10] = this.points[pxy].clone().lerp(this.points[pxyz], mu)
                        vlist[10] = this.lerp(pxy, pxyz, mu);
                    }
                    if (bits & 2048) {
                        mu = (isoValue - value2) / (value6 - value2);
                        //vlist[11] = this.points[py].clone().lerp(this.points[pyz], mu)
                        vlist[11] = this.lerp(py, pyz, mu);
                    }
                    let i = 0;
                    cubeindex <<= 4;
                    while (triTable[cubeindex + i] !== -1) {
                        const index1 = triTable[cubeindex + i];
                        const index2 = triTable[cubeindex + i + 1];
                        const index3 = triTable[cubeindex + i + 2];
                        // const p1 = vlist[index1]
                        // const p2 = vlist[index2]
                        // const p3 = vlist[index3]
                        // positions.push(p1.x, p1.y, p1.z)
                        // positions.push(p2.x, p2.y, p2.z)
                        // positions.push(p3.x, p3.y, p3.z)
                        positions.push(...vlist[index1], ...vlist[index2], ...vlist[index3]);
                        indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
                        vertexIndex += 3;
                        i += 3;
                    }
                }
            }
        }
        return { positions, indices };
    }
    // -----------------------------------------------------------------------
    _in(p) {
        return p >= this.bounds_[0] && p <= this.bounds_[1];
    }
    _ok(values) {
        let ok = true;
        values.forEach((v) => {
            ok = ok && this._in(v);
        });
        return ok;
    }
    unflat(l) {
        const ny = this.grid.sizes[1];
        const nz = this.grid.sizes[2];
        const di = l / ny / nz;
        const i = Math.trunc(di);
        const m = ny * nz * (di - i);
        const dj = m / nz;
        const j = Math.trunc(dj);
        const k = nz * (dj - j);
        return [Math.round(i), Math.round(j), Math.round(k)];
    }
    lerp(p1, p2, mu) {
        const i = this.unflat(p1);
        const v1 = this.grid.pos(i[0], i[1], i[2]);
        const j = this.unflat(p2);
        const v2 = this.grid.pos(j[0], j[1], j[2]);
        v1[0] += (v2[0] - v1[0]) * mu;
        v1[1] += (v2[1] - v1[1]) * mu;
        v1[2] += (v2[2] - v1[2]) * mu;
        return v1;
    }
}
// --------------------------------------------------------------------------------
const edgeTable = new Int32Array([
    0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c, 0x80c, 0x905, 0xa0f,
    0xb06, 0xc0a, 0xd03, 0xe09, 0xf00, 0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f,
    0x795, 0x69c, 0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90, 0x230,
    0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c, 0xa3c, 0xb35, 0x83f, 0x936,
    0xe3a, 0xf33, 0xc39, 0xd30, 0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5,
    0x4ac, 0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0, 0x460, 0x569,
    0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c, 0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a,
    0x963, 0xa69, 0xb60, 0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc,
    0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0, 0x650, 0x759, 0x453,
    0x55a, 0x256, 0x35f, 0x55, 0x15c, 0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53,
    0x859, 0x950, 0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc, 0xfcc,
    0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0, 0x8c0, 0x9c9, 0xac3, 0xbca,
    0xcc6, 0xdcf, 0xec5, 0xfcc, 0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9,
    0x7c0, 0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c, 0x15c, 0x55,
    0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650, 0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6,
    0xfff, 0xcf5, 0xdfc, 0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
    0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c, 0x36c, 0x265, 0x16f,
    0x66, 0x76a, 0x663, 0x569, 0x460, 0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af,
    0xaa5, 0xbac, 0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0, 0xd30,
    0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c, 0x53c, 0x435, 0x73f, 0x636,
    0x13a, 0x33, 0x339, 0x230, 0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895,
    0x99c, 0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190, 0xf00, 0xe09,
    0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c, 0x70c, 0x605, 0x50f, 0x406, 0x30a,
    0x203, 0x109, 0x0,
]);
const triTable = new Int32Array([
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, 0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 0,
    2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 8, 3, 2, 10, 8, 10, 9, 8,
    -1, -1, -1, -1, -1, -1, -1, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, 0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 11, 2, 1, 9,
    11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1, 3, 10, 1, 11, 10, 3, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, 0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1,
    -1, -1, -1, 3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1, 9, 8,
    10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 7, 8, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 7, 3, 4, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, 0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, 4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 8,
    4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, 7, 3, 0, 4, 1, 2, 10,
    -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1,
    -1, -1, 2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1, 8, 4, 7, 3, 11,
    2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 4, 7, 11, 2, 4, 2, 0, 4, -1,
    -1, -1, -1, -1, -1, -1, 9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1,
    -1, 4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1, 3, 10, 1, 3, 11,
    10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1, 1, 11, 10, 1, 4, 11, 1, 0, 4, 7,
    11, 4, -1, -1, -1, -1, 4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1,
    -1, 4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 3, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, 8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1, 1, 2,
    10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 10, 4,
    9, 5, -1, -1, -1, -1, -1, -1, -1, 5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1,
    -1, -1, -1, -1, 2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1, 9, 5,
    4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 0, 8, 11, 4,
    9, 5, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1,
    -1, -1, -1, -1, 2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1, 10, 3,
    11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 0, 8, 1, 8, 10,
    1, 8, 11, 10, -1, -1, -1, -1, 5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1,
    -1, -1, -1, 5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, 9, 7,
    8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 3, 0, 9, 5, 3, 5, 7,
    3, -1, -1, -1, -1, -1, -1, -1, 0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1,
    -1, -1, -1, 1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 7,
    8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 9, 5, 0, 5, 3,
    0, 5, 7, 3, -1, -1, -1, -1, 8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1,
    -1, 2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, 7, 9, 5, 7, 8,
    9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, 9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7,
    11, -1, -1, -1, -1, 2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1, 11,
    2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1, 9, 5, 8, 8, 5, 7, 10,
    1, 3, 10, 3, 11, -1, -1, -1, -1, 5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11,
    10, 0, -1, 11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1, 11, 10, 5,
    7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, 9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, 1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 2, 6,
    1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 1, 2, 6, 3, 0, 8, -1,
    -1, -1, -1, -1, -1, -1, 9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1,
    -1, 5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1, 2, 3, 11, 10, 6, 5,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 0, 8, 11, 2, 0, 10, 6, 5, -1,
    -1, -1, -1, -1, -1, -1, 0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1,
    -1, 5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1, 6, 3, 11, 6, 5,
    3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11,
    6, -1, -1, -1, -1, 3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1, 6,
    5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 8, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1,
    -1, -1, -1, -1, 1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 10,
    6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1, 6, 1, 2, 6, 5, 1, 4, 7, 8,
    -1, -1, -1, -1, -1, -1, -1, 1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1,
    -1, 8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1, 7, 3, 9, 7, 9, 4, 3,
    2, 9, 5, 9, 6, 2, 6, 9, -1, 3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1,
    -1, -1, 5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1, 0, 1, 9, 4, 7,
    8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, 9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11,
    4, 5, 10, 6, -1, 8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1, 5, 1,
    11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1, 0, 5, 9, 0, 6, 5, 0, 3, 6,
    11, 6, 3, 8, 4, 7, -1, 6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
    10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 10, 6, 4, 9,
    10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, 10, 0, 1, 10, 6, 0, 6, 4, 0, -1,
    -1, -1, -1, -1, -1, -1, 8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
    1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 9, 2,
    4, 9, 2, 6, 4, -1, -1, -1, -1, 0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, 8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, 10, 4, 9,
    10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 2, 2, 8, 11, 4, 9, 10,
    4, 10, 6, -1, -1, -1, -1, 3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1,
    -1, 6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1, 9, 6, 4, 9, 3, 6, 9,
    1, 3, 11, 6, 3, -1, -1, -1, -1, 8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4,
    1, -1, 3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1, 6, 4, 8, 11,
    6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 10, 6, 7, 8, 10, 8, 9, 10,
    -1, -1, -1, -1, -1, -1, -1, 0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1,
    -1, -1, 10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1, 10, 6, 7, 10,
    7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1, 1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6,
    7, -1, -1, -1, -1, 2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1, 7, 8, 0,
    7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1, 7, 3, 2, 6, 7, 2, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, 2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1,
    -1, -1, 2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1, 1, 8, 0, 1, 7,
    8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1, 11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1,
    -1, -1, -1, -1, 8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1, 0, 9, 1,
    11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 8, 0, 7, 0, 6, 3, 11,
    0, 11, 6, 0, -1, -1, -1, -1, 7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, 3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 11,
    7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 1, 9, 8, 3, 1, 11, 7, 6,
    -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, 1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 2, 9,
    0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 2, 10, 3, 10,
    8, 3, 10, 9, 8, -1, -1, -1, -1, 7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, 7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1, 2, 7,
    6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, 1, 6, 2, 1, 8, 6, 1, 9, 8,
    8, 7, 6, -1, -1, -1, -1, 10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1,
    -1, -1, 10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1, 0, 3, 7, 0, 7,
    10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1, 7, 6, 10, 7, 10, 8, 8, 10, 9, -1,
    -1, -1, -1, -1, -1, -1, 6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, 3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 6, 11, 8,
    4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1, 9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3,
    6, -1, -1, -1, -1, 6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
    1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1, 4, 11, 8, 4, 6, 11,
    0, 2, 9, 2, 10, 9, -1, -1, -1, -1, 10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4,
    6, 3, -1, 8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, 0, 4, 2, 4,
    6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 4, 2, 4, 6, 4,
    3, 8, -1, -1, -1, -1, 1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
    8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1, 10, 1, 0, 10, 0, 6, 6,
    0, 4, -1, -1, -1, -1, -1, -1, -1, 4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10,
    9, 3, -1, 10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9,
    5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 5, 11,
    7, 6, -1, -1, -1, -1, -1, -1, -1, 5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1,
    -1, -1, -1, -1, 11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1, 9, 5,
    4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 1, 2, 10, 0, 8,
    3, 4, 9, 5, -1, -1, -1, -1, 7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1,
    -1, -1, 3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1, 7, 2, 3, 7, 6, 2,
    5, 4, 9, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1,
    -1, -1, -1, 3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1, 6, 2, 8, 6,
    8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1, 9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7,
    -1, -1, -1, -1, 1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1, 4, 0, 10,
    4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1, 7, 6, 10, 7, 10, 8, 5, 4, 10, 4,
    8, 10, -1, -1, -1, -1, 6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1,
    -1, 3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1, 0, 11, 8, 0, 5, 11,
    0, 1, 5, 5, 6, 11, -1, -1, -1, -1, 6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1,
    -1, -1, -1, -1, 1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1, 0,
    11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1, 11, 8, 5, 11, 5, 6, 8, 0,
    5, 10, 5, 2, 0, 2, 5, -1, 6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1,
    -1, 5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1, 9, 5, 6, 9, 6, 0, 0,
    6, 2, -1, -1, -1, -1, -1, -1, -1, 1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2,
    8, -1, 1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 6, 1,
    6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1, 10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0,
    -1, -1, -1, -1, 0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 7,
    5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 11, 7, 5, 8, 3, 0,
    -1, -1, -1, -1, -1, -1, -1, 5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1,
    -1, -1, -1, 10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1, 11, 1, 2,
    11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 7, 1, 7, 5, 7,
    2, 11, -1, -1, -1, -1, 9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
    7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1, 2, 5, 10, 2, 3, 5, 3, 7,
    5, -1, -1, -1, -1, -1, -1, -1, 8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1,
    -1, -1, 9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1, 9, 8, 2, 9, 2,
    1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1, 1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, 0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1, 9, 0,
    3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1, 9, 8, 7, 5, 9, 7, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, 5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1,
    -1, -1, -1, -1, 5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1, 0,
    1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1, 10, 11, 4, 10, 4, 5,
    11, 3, 4, 9, 4, 1, 3, 1, 4, -1, 2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1,
    -1, -1, 0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1, 0, 2, 5, 0, 5,
    9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1, 9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, 2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1, 5,
    10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1, 3, 10, 2, 3, 5, 10, 3,
    8, 5, 4, 5, 8, 0, 1, 9, -1, 5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1,
    -1, 8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 4, 5, 1, 0, 5,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5,
    -1, -1, -1, -1, 9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 7,
    9, 11, 7, 9, 10, 11, -1, -1, -1, -1, 1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11,
    -1, -1, -1, -1, 3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1, 4, 11,
    7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1, 9, 7, 4, 9, 11, 7, 9, 1, 11,
    2, 11, 1, 0, 8, 3, -1, 11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1,
    -1, 11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1, 2, 9, 10, 2, 7, 9,
    2, 3, 7, 7, 4, 9, -1, -1, -1, -1, 9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2,
    0, 7, -1, 3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1, 1, 10, 2, 8,
    7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 7, 1, 3, -1,
    -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
    4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 8, 7, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 10, 8, 10, 11, 8, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1,
    -1, -1, -1, 0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1, 3, 1,
    10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 11, 1, 11, 9,
    9, 11, 8, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9,
    -1, -1, -1, -1, 0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8,
    10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1, 9, 10, 2, 0, 9, 2, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1,
    -1, 1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 8,
    9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 9, 1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
]);


/***/ }),

/***/ "./lib/background2DGrid.ts":
/*!*********************************!*\
  !*** ./lib/background2DGrid.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createBackgroundGrid2D": () => (/* binding */ createBackgroundGrid2D),
/* harmony export */   "BackgroundGrid2D": () => (/* binding */ BackgroundGrid2D)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);
/*eslint @typescript-eslint/no-explicit-any: off -- WTF*/

/**
 * Put all cells from a 2D unstructured mesh (not the points) into a background-brid
 * @see BackgroundGrid2D
 */
function createBackgroundGrid2D({ positions, indices, dims = [20, 20], eps = 1e-2, }) {
    // const nbNodes = positions.count
    // const nbElements = indices.count
    const minmax = (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.minMax)(positions);
    const dx = [];
    dx.push((minmax[3] - minmax[0] + 2 * eps) / dims[0]);
    dx.push((minmax[4] - minmax[1] + 2 * eps) / dims[1]);
    const pmin = [minmax[0] - eps, minmax[1] - eps];
    const backgroundgrid = new BackgroundGrid2D();
    backgroundgrid.set(pmin, dx[0], dx[1], dims[0], dims[1]);
    indices.forEach((elt, i) => {
        const xs = [];
        const ys = [];
        elt.forEach((j) => {
            const p = positions.itemAt(j);
            xs.push(p[0]);
            ys.push(p[1]);
        });
        const _err = backgroundgrid.insert(new CBox([Math.min(...xs), Math.max(...xs)], [Math.min(...ys), Math.max(...ys)], i));
    });
    return backgroundgrid;
}
// ---------------------------------------------------------------------
/**
 * @see createBackgroundGrid2D
 */
class BackgroundGrid2D {
    constructor() {
        this.origin_ = [0, 0];
        this.dx_ = 0;
        this.dy_ = 0;
        this.nx_ = 0;
        this.ny_ = 0;
    }
    set(o, dx, dy, nx, ny) {
        this.origin_ = [...o];
        this.dx_ = dx;
        this.dy_ = dy;
        this.nx_ = nx;
        this.ny_ = ny;
        this.cells_ = Array(this.nx_ * this.ny_)
            .fill(undefined)
            .map(() => new Cell());
    }
    get nx() {
        return this.nx_;
    }
    get ny() {
        return this.ny_;
    }
    get dx() {
        return this.dx_;
    }
    get dy() {
        return this.dy_;
    }
    get origin() {
        return this.origin_;
    }
    get bbox() {
        return {
            x: this.origin_[0],
            y: this.origin_[1],
            width: this.dx_ * this.nx_,
            height: this.dy_ * this.ny_,
        };
    }
    forAllPoints(cb) {
        for (let i = 0; i < this.nx_; ++i) {
            for (let j = 0; j < this.ny_; ++j) {
                const flatcellindex = this.getFlatIndex(i, j);
                const cell = this.cells_[flatcellindex];
                cb(cell.objects, i, j, this.getCoordinates(i, j));
            }
        }
    }
    insert(box) {
        // console.assert(this.nx_ !== 0);
        // console.assert(this.ny_ !== 0);
        const o1 = this.getIJ(box.min);
        if (!o1.ok) {
            return false;
        }
        const ij0 = o1.ij;
        const o2 = this.getIJ(box.max);
        if (!o2.ok) {
            return false;
        }
        const ij1 = o2.ij;
        const IXmin = Math.min(ij0[0], ij1[0]);
        const IXmax = Math.max(ij0[0], ij1[0]);
        const IYmin = Math.min(ij0[1], ij1[1]);
        const IYmax = Math.max(ij0[1], ij1[1]);
        for (let i = IXmin; i <= IXmax; ++i) {
            for (let j = IYmin; j <= IYmax; ++j) {
                const flatindex = this.getFlatIndex(i, j);
                this.cells_[flatindex].objects.push(box);
            }
        }
        return true;
    }
    candidatesFromIJ(i, j) {
        const flatcellindex = this.getFlatIndex(i, j);
        const cell = this.cells_[flatcellindex];
        return cell.objects;
    }
    candidates(p) {
        const { ok, ij } = this.getIJ(p);
        if (!ok) {
            return [];
        }
        const flatcellindex = this.getFlatIndex(ij[0], ij[1]);
        const cell = this.cells_[flatcellindex];
        return cell.objects;
    }
    getIJ(p) {
        // console.assert(this.nx_ != 0 && this.ny_ != 0)
        // console.assert(this.dx_ != 0 && this.dy_ != 0)
        const lx = p[0] - this.origin_[0];
        if (lx < 0) {
            return FALSE;
        }
        const ly = p[1] - this.origin_[1];
        if (ly < 0) {
            return FALSE;
        }
        const xg = lx / this.dx_;
        if (xg > this.nx_) {
            return FALSE;
        }
        const yg = ly / this.dy_;
        if (yg > this.ny_) {
            return FALSE;
        }
        const ix = Math.floor(xg);
        const iy = Math.floor(yg);
        //console.log(ix, iy)
        return {
            ok: true,
            ij: [ix, iy],
        };
    }
    getCoordinates(i, j) {
        return [this.origin_[0] + i * this.dx_, this.origin_[1] + j * this.dy_];
    }
    getFlatIndex(Ix, Iy) {
        return this.nx_ * Iy + Ix;
    }
}
const FALSE = { ok: false };
class CBox {
    constructor(xbounds, ybounds, obj) {
        this.min = [0, 0];
        this.max = [0, 0];
        this.min = [xbounds[0], ybounds[0]];
        this.max = [xbounds[1], ybounds[1]];
        this.obj = obj;
    }
    contains(x, y) {
        return (x >= this.min[0] &&
            x <= this.max[0] &&
            y >= this.min[1] &&
            y <= this.max[1]);
    }
}
class Cell {
    constructor() {
        this.objects = [];
    }
}


/***/ }),

/***/ "./lib/bbox.ts":
/*!*********************!*\
  !*** ./lib/bbox.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BBox": () => (/* binding */ BBox),
/* harmony export */   "inflateBBox": () => (/* binding */ inflateBBox)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);

// See also https://github.com/vanruesc/math-ds/tree/master/src
const BBOX_FLATNESS_THRESHOLD = 1e-12;
class BBox {
    constructor(p1, p2) {
        this.min_ = [0, 0, 0];
        this.max_ = [0, 0, 0];
        this.empty_ = false;
        this.reset();
        //if (p1) this.grow(p1)
        //if (p2) this.grow(p2)
        if (p1 && p2) {
            for (let i = 0; i < 3; ++i) {
                const min = Math.min(p1[i], p2[i]);
                const Max = Math.max(p1[i], p2[i]);
                if (Math.abs(Max - min) >= BBOX_FLATNESS_THRESHOLD) {
                    _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.setCoord(this.min_, i, min);
                    _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.setCoord(this.max_, i, Max);
                }
                else {
                    _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.setCoord(this.min_, i, Max);
                    _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.setCoord(this.max_, i, Max);
                }
                /*
                if (Math.abs(Max - min) >= BBOX_FLATNESS_THRESHOLD) {
                    this.min_.setCoord(i, min);
                    this.max_.setCoord(i, Max);
                } else {
                    this.min_.setCoord(i, Max);
                    this.max_.setCoord(i, Max);
                }
                */
                if (Max < min) {
                    this.empty_ = true;
                }
            }
        }
    }
    reset() {
        this.empty_ = true;
        _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.set(this.min_, [1e32, 1e32, 1e32]);
        _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.set(this.max_, [-1e32, -1e32, -1e32]);
    }
    get empty() {
        return this.empty_;
    }
    get min() {
        return [...this.min_];
    }
    get max() {
        return [...this.max_];
    }
    get xLength() {
        return this.max_[0] - this.min_[0];
    }
    get yLength() {
        return this.max_[1] - this.min_[1];
    }
    get zLength() {
        return this.max_[2] - this.min_[2];
    }
    get sizes() {
        return [this.xLength, this.yLength, this.zLength];
    }
    get center() {
        let c = [...this.min_];
        c = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.scale(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.add(c, this.max_), 0.5);
        return c;
    }
    get radius() {
        return _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.norm(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(this.min_, this.max_)) / 2;
    }
    scale(s) {
        const r1 = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.add(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.scale(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(this.center, this.min), s), this.center);
        const r2 = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.add(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.scale(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(this.center, this.max), s), this.center);
        _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.set(this.min_, r1);
        _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.set(this.max_, r2);
    }
    grow(p) {
        this.empty_ = false;
        for (let i = 0; i < 3; ++i) {
            if (p[i] < this.min_[i]) {
                this.min_[i] = p[i];
            }
            if (p[i] > this.max_[i]) {
                this.max_[i] = p[i];
            }
        }
    }
    randPoint() {
        return [
            this.min_[0] + Math.random() * this.xLength,
            this.min_[1] + Math.random() * this.yLength,
            this.min_[2] + Math.random() * this.zLength,
        ];
    }
    /**
     * Check if a bbox or a Point (Vector3) is inside this (not strict)
     * @param param Either a BBox or a Vector3
     * @param tol The tolerence for the test
     */
    contains(param, tol = 0) {
        if (param instanceof BBox) {
            return (this.contains(param.min, tol) === true &&
                this.contains(param.max, tol) === true);
        }
        const p = param; // a Vector3
        for (let i = 0; i < 3; ++i) {
            if (p[i] < this.min_[i] - tol || p[i] > this.max_[i] + tol) {
                return false;
            }
        }
        return true;
    }
    /**
     * For compatibility
     * @deprecated
     * @see contains
     */
    inside(p, tol = 0) {
        return this.contains(p, tol);
    }
    getIntersection(b) {
        if (this.intersect(b) === false) {
            return new BBox();
        }
        const new_min = [0, 0, 0];
        const new_max = [0, 0, 0];
        for (let i = 0; i < 3; ++i) {
            if (this.min_[i] >= b.min_[i]) {
                new_min[i] = this.min_[i];
            }
            else {
                new_min[i] = b.min_[i];
            }
            if (this.max_[i] <= b.max_[i]) {
                new_max[i] = this.max_[i];
            }
            else {
                new_max[i] = b.max_[i];
            }
        }
        return new BBox(new_min, new_max);
    }
    intersect(b) {
        let ok = true;
        for (let i = 0; i < 3; ++i) {
            ok = ok && this.min_[i] <= b.max_[i] && b.min_[i] <= this.max_[i];
        }
        return ok;
    }
}
function inflateBBox(bbox, flat_factor = 1e-2) {
    let change_box = false;
    const new_min = bbox.min;
    const new_max = bbox.max;
    {
        const rad = bbox.radius;
        const delta_x = bbox.max[0] - bbox.min[0];
        const delta_y = bbox.max[1] - bbox.min[1];
        const delta_z = bbox.max[2] - bbox.min[2];
        const min_delta = rad * flat_factor;
        const eps = min_delta / 2;
        if (delta_x < min_delta) {
            const mid_x = (bbox.max[0] + bbox.min[0]) / 2;
            new_min[0] = mid_x - eps;
            new_max[0] = mid_x + eps;
            change_box = true;
        }
        if (delta_y < min_delta) {
            const mid_y = (bbox.max[1] + bbox.min[1]) / 2;
            new_min[1] = mid_y - eps;
            new_max[1] = mid_y + eps;
            change_box = true;
        }
        if (delta_z < min_delta) {
            const mid_z = (bbox.max[2] + bbox.min[2]) / 2;
            new_min[2] = mid_z - eps;
            new_max[2] = mid_z + eps;
            change_box = true;
        }
    }
    if (change_box === true) {
        bbox.reset();
        bbox.grow(new_min);
        bbox.grow(new_max);
    }
}


/***/ }),

/***/ "./lib/dataframe/TriangleToNodeDecomposer.ts":
/*!***************************************************!*\
  !*** ./lib/dataframe/TriangleToNodeDecomposer.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TriangleToNodeDecomposer": () => (/* binding */ TriangleToNodeDecomposer)
/* harmony export */ });
/* harmony import */ var _fromTriangleToNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fromTriangleToNode */ "./lib/dataframe/fromTriangleToNode.ts");

/**
 * A decomposer which uses a decomposer and interpolate from triangles to nodes
 * @example
 * The NormalsDecomposer get the normals at triangles but we want those normals at vertices.
 * ```ts
 * const decomposer = new TriangleToNodeDecomposer({
 *      positions,
 *      indices,
 *      decomposer: new NormalsDecomposer('n')
 * })
 *
 * const mng   = new Manager(df, [decomposer])
 * const serie = mng.serie(3, 'n')
 * ```
 */
class TriangleToNodeDecomposer {
    constructor({ positions, indices, decomposer, }) {
        this.positions = positions;
        this.indices = indices;
        this.decomposer = decomposer;
    }
    names(df, itemSize, serie, name) {
        return this.decomposer.names(df, itemSize, serie, name);
    }
    serie(df, itemSize, name) {
        const s = this.decomposer.serie(df, itemSize, name);
        if (s) {
            return (0,_fromTriangleToNode__WEBPACK_IMPORTED_MODULE_0__.fromTriangleToNode)({
                positions: this.positions,
                indices: this.indices,
                serie: this.decomposer.serie(df, itemSize, name),
            });
        }
        else {
            return undefined;
        }
    }
}


/***/ }),

/***/ "./lib/dataframe/fromNodeToTriangle.ts":
/*!*********************************************!*\
  !*** ./lib/dataframe/fromNodeToTriangle.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromNodeToTriangle": () => (/* binding */ fromNodeToTriangle)
/* harmony export */ });
/* harmony import */ var _he__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../he */ "./lib/he/index.ts");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Linear interpolate any Serie of any itemSize from nodes to triangles using topological
 * information.
 * @category dataframe
 */
function fromNodeToTriangle({ positions, indices, serie, }) {
    const surface = _he__WEBPACK_IMPORTED_MODULE_0__.Surface.create(positions, indices);
    if (serie.count !== surface.nbNodes) {
        throw new Error(`serie must be defined at nodes (count=${surface.nbNodes}). Got count=${serie.itemSize}`);
    }
    // Linear-interpolate displ from triangles to vertices
    const size = serie.itemSize;
    const b = serie.newInstance({ count: surface.nbFacets, itemSize: size });
    const array = b.array;
    surface.forEachFace((face, i) => {
        const ids = face.nodeIds;
        for (let j = 0; j < 3; ++j) {
            // nodes of triangle
            const d = serie.itemAt(ids[j]);
            if (size === 1) {
                array[i] += d;
            }
            else {
                for (let k = 0; k < size; ++k) {
                    array[size * i + k] += d[k];
                }
            }
        }
    });
    for (let i = 0; i < array.length; ++i) {
        array[i] /= 3;
    }
    return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_1__.Serie.create({ array, itemSize: size });
}


/***/ }),

/***/ "./lib/dataframe/fromTriangleToNode.ts":
/*!*********************************************!*\
  !*** ./lib/dataframe/fromTriangleToNode.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromTriangleToNode": () => (/* binding */ fromTriangleToNode)
/* harmony export */ });
/* harmony import */ var _he__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../he */ "./lib/he/index.ts");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Linear interpolate any Serie of any itemSize from triangle to nodes using topological
 * information.
 * @category dataframe
 */
function fromTriangleToNode({ positions, indices, serie, }) {
    const surface = _he__WEBPACK_IMPORTED_MODULE_0__.Surface.create(positions, indices);
    if (serie.count !== surface.nbFacets) {
        throw new Error(`serie must be defined at triangles (count=${surface.nbFacets}). Got count=${serie.itemSize}`);
    }
    // Linear-interpolate displ from triangles to vertices
    const size = serie.itemSize;
    const b = serie.newInstance({ count: surface.nbNodes, itemSize: size });
    const array = b.array;
    const weights = new Array(surface.nbNodes).fill(0);
    // array = array.map( _ => 0 )
    surface.forEachFace((face, i) => {
        const ids = face.nodeIds;
        const d = serie.itemAt(i);
        for (let j = 0; j < 3; ++j) {
            // nodes of triangle
            const id = ids[j];
            if (size === 1) {
                array[id] += d;
            }
            else {
                for (let k = 0; k < size; ++k) {
                    array[size * id + k] += d[k];
                }
            }
            weights[id]++;
        }
    });
    for (let i = 0, k = 0; i < array.length; i += size, ++k) {
        for (let j = 0; j < size; ++j) {
            array[i + j] /= weights[k];
        }
    }
    return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_1__.Serie.create({ array, itemSize: size });
}


/***/ }),

/***/ "./lib/dataframe/gaussianCurvature.ts":
/*!********************************************!*\
  !*** ./lib/dataframe/gaussianCurvature.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CurvatureDecomposer": () => (/* binding */ CurvatureDecomposer)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);

// Excerpt from https://github.com/GeometryCollective/geometry-processing-js/tree/master/node/core
// MIT license
/**
 * Get the gaussian curvatures named `k1`, `k2`, `H` and `K` (in this order!)
 */
class CurvatureDecomposer {
    constructor({ positions, indices, names = undefined, }) {
        this.names_ = ['k1', 'k2', 'H', 'K'];
        if (positions && indices) {
            this.geo = new Geometry(positions, indices, true);
        }
        if (names !== undefined) {
            if (names.length !== 4) {
                throw new Error('curvature names length must be 4 (principal 1, principal 2, mean, gaussian)');
            }
            this.names_ = names;
        }
    }
    /**
     * @hidden
     */
    names(df, itemSize, _serie, _name) {
        if (itemSize !== 1) {
            return [];
        }
        if (this.geo === undefined) {
            return [];
        }
        return this.names_;
    }
    /**
     * @hidden
     */
    serie(df, itemSize, name) {
        if (!this.names_.includes(name)) {
            return undefined;
        }
        switch (name) {
            case this.names_[0]:
                return this.geo.k1();
            case this.names_[1]:
                return this.geo.k2();
            case this.names_[2]:
                return this.geo.H();
            case this.names_[3]:
                return this.geo.K();
            default:
                return undefined;
        }
    }
}
// ================================================================
class Halfedge {
    constructor() {
        this.vertex = undefined;
        this.edge = undefined;
        this.face = undefined;
        this.corner = undefined;
        this.next = undefined;
        this.prev = undefined;
        this.twin = undefined;
        this.onBoundary = false;
        this.index = -1; // an ID between 0 and |H| - 1, where |H| is the number of halfedges in a mesh
    }
    toString() {
        return this.index;
    }
}
// ================================================================
class Edge {
    constructor() {
        this.halfedge = undefined;
        this.index = -1; // an ID between 0 and |E| - 1, where |E| is the number of edges in a mesh
    }
    onBoundary() {
        return this.halfedge.onBoundary || this.halfedge.twin.onBoundary;
    }
    toString() {
        return this.index;
    }
}
// ================================================================
class Face {
    constructor() {
        this.halfedge = undefined;
        this.index = -1; // an ID between 0 and |F| - 1 if this face is not a boundary loop
        // or an ID between 0 and |B| - 1 if this face is a boundary loop, where |F| is the
        // number of faces in the mesh and |B| is the number of boundary loops in the mesh
    }
    isBoundaryLoop() {
        return this.halfedge.onBoundary;
    }
    adjacentVertices(ccw = true) {
        return new FaceVertexIterator(this.halfedge, ccw);
    }
    adjacentEdges(ccw = true) {
        return new FaceEdgeIterator(this.halfedge, ccw);
    }
    adjacentFaces(ccw = true) {
        return new FaceFaceIterator(this.halfedge, ccw);
    }
    adjacentHalfedges(ccw = true) {
        return new FaceHalfedgeIterator(this.halfedge, ccw);
    }
    adjacentCorners(ccw = true) {
        return new FaceCornerIterator(this.halfedge, ccw);
    }
    toString() {
        return this.index;
    }
}
class FaceVertexIterator {
    // constructor
    constructor(halfedge, ccw) {
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const vertex = this.current.vertex;
                    this.current = this.ccw
                        ? this.current.next
                        : this.current.prev;
                    return {
                        done: false,
                        value: vertex,
                    };
                }
            },
        };
    }
}
class FaceEdgeIterator {
    // constructor
    constructor(halfedge, ccw) {
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const edge = this.current.edge;
                    this.current = this.ccw
                        ? this.current.next
                        : this.current.prev;
                    return {
                        done: false,
                        value: edge,
                    };
                }
            },
        };
    }
}
class FaceFaceIterator {
    // constructor
    constructor(halfedge, ccw) {
        while (halfedge.twin.onBoundary) {
            halfedge = halfedge.next;
        } // twin halfedge must not be on the boundary
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                while (this.current.twin.onBoundary) {
                    this.current = this.ccw
                        ? this.current.next
                        : this.current.prev;
                } // twin halfedge must not be on the boundary
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const face = this.current.twin.face;
                    this.current = this.ccw
                        ? this.current.next
                        : this.current.prev;
                    return {
                        done: false,
                        value: face,
                    };
                }
            },
        };
    }
}
class FaceHalfedgeIterator {
    // constructor
    constructor(halfedge, ccw) {
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const halfedge = this.current;
                    this.current = this.ccw
                        ? this.current.next
                        : this.current.prev;
                    return {
                        done: false,
                        value: halfedge,
                    };
                }
            },
        };
    }
}
class FaceCornerIterator {
    // constructor
    constructor(halfedge, ccw) {
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    this.current = this.ccw
                        ? this.current.next
                        : this.current.prev;
                    const corner = this.current.corner; // corner will be undefined if this face is a boundary loop
                    return {
                        done: false,
                        value: corner,
                    };
                }
            },
        };
    }
}
// ================================================================
class Vertex {
    constructor() {
        this.halfedge = undefined;
        this.index = -1; // an ID between 0 and |V| - 1, where |V| is the number of vertices in a mesh
    }
    degree() {
        let k = 0;
        for (const _e of this.adjacentEdges()) {
            k++;
        }
        return k;
    }
    isIsolated() {
        return this.halfedge === undefined;
    }
    onBoundary() {
        for (const h of this.adjacentHalfedges()) {
            if (h.onBoundary) {
                return true;
            }
        }
        return false;
    }
    /**
     * Convenience function to iterate over the vertices neighboring this vertex.
     * @example
     * let v = mesh.vertices[0];
     * for (let u of v.adjacentVertices()) {
     *     // Do something with u
     * }
     */
    adjacentVertices(ccw = true) {
        return new VertexVertexIterator(this.halfedge, ccw);
    }
    /**
     * Convenience function to iterate over the edges adjacent to this vertex.
     * @example
     * let v = mesh.vertices[0];
     * for (let e of v.adjacentEdges()) {
     *     // Do something with e
     * }
     */
    adjacentEdges(ccw = true) {
        return new VertexEdgeIterator(this.halfedge, ccw);
    }
    /**
     * Convenience function to iterate over the faces adjacent to this vertex.
     * @example
     * let v = mesh.vertices[0];
     * for (let f of v.adjacentFaces()) {
     *     // Do something with f
     * }
     */
    adjacentFaces(ccw = true) {
        return new VertexFaceIterator(this.halfedge, ccw);
    }
    /**
     * Convenience function to iterate over the halfedges adjacent to this vertex.
     * @example
     * let v = mesh.vertices[0];
     * for (let h of v.adjacentHalfedges()) {
     *     // Do something with h
     * }
     */
    adjacentHalfedges(ccw = true) {
        return new VertexHalfedgeIterator(this.halfedge, ccw); // outgoing halfedges
    }
    /**
     * Convenience function to iterate over the corners adjacent to this vertex.
     * @example
     * let v = mesh.vertices[0];
     * for (let c of v.adjacentCorners()) {
     *     // Do something with c
     * }
     */
    adjacentCorners(ccw = true) {
        return new VertexCornerIterator(this.halfedge, ccw);
    }
    toString() {
        return this.index;
    }
}
class VertexVertexIterator {
    // constructor
    constructor(halfedge, ccw) {
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const vertex = this.current.twin.vertex;
                    this.current = this.ccw
                        ? this.current.twin.next
                        : this.current.prev.twin;
                    return {
                        done: false,
                        value: vertex,
                    };
                }
            },
        };
    }
}
class VertexEdgeIterator {
    // constructor
    constructor(halfedge, ccw) {
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const edge = this.current.edge;
                    this.current = this.ccw
                        ? this.current.twin.next
                        : this.current.prev.twin;
                    return {
                        done: false,
                        value: edge,
                    };
                }
            },
        };
    }
}
class VertexFaceIterator {
    // constructor
    constructor(halfedge, ccw) {
        while (halfedge.onBoundary) {
            halfedge = halfedge.twin.next;
        } // halfedge must not be on the boundary
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                while (this.current.onBoundary) {
                    this.current = this.ccw
                        ? this.current.twin.next
                        : this.current.prev.twin;
                } // halfedge must not be on the boundary
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const face = this.current.face;
                    this.current = this.ccw
                        ? this.current.twin.next
                        : this.current.prev.twin;
                    return {
                        done: false,
                        value: face,
                    };
                }
            },
        };
    }
}
class VertexHalfedgeIterator {
    // constructor
    constructor(halfedge, ccw) {
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const halfedge = this.current;
                    this.current = this.ccw
                        ? this.current.twin.next
                        : this.current.prev.twin;
                    return {
                        done: false,
                        value: halfedge,
                    };
                }
            },
        };
    }
}
class VertexCornerIterator {
    // constructor
    constructor(halfedge, ccw) {
        while (halfedge.onBoundary) {
            halfedge = halfedge.twin.next;
        } // halfedge must not be on the boundary
        this._halfedge = halfedge;
        this._ccw = ccw;
    }
    [Symbol.iterator]() {
        return {
            current: this._halfedge,
            end: this._halfedge,
            ccw: this._ccw,
            justStarted: true,
            next() {
                while (this.current.onBoundary) {
                    this.current = this.ccw
                        ? this.current.twin.next
                        : this.current.prev.twin;
                } // halfedge must not be on the boundary
                if (!this.justStarted && this.current === this.end) {
                    return {
                        done: true,
                    };
                }
                else {
                    this.justStarted = false;
                    const corner = this.current.next.corner;
                    this.current = this.ccw
                        ? this.current.twin.next
                        : this.current.prev.twin;
                    return {
                        done: false,
                        value: corner,
                    };
                }
            },
        };
    }
}
// ================================================================
class Corner {
    constructor() {
        this.halfedge = undefined;
        this.halfedge = undefined;
        this.index = -1; // an ID between 0 and |C| - 1, where |C| is the number of corners in a mesh
    }
    get vertex() {
        return this.halfedge.prev.vertex;
    }
    get face() {
        return this.halfedge.face;
    }
    get next() {
        return this.halfedge.next.corner;
    }
    get prev() {
        return this.halfedge.prev.corner;
    }
    toString() {
        return this.index;
    }
}
// ================================================================
class Mesh {
    constructor() {
        this.vertices = [];
        this.edges = [];
        this.faces = [];
        this.corners = [];
        this.halfedges = [];
        this.boundaries = [];
        this.generators = [];
        this.vertices = [];
        this.edges = [];
        this.faces = [];
        this.corners = [];
        this.halfedges = [];
        this.boundaries = [];
        this.generators = [];
    }
    /**
     * Computes the euler characteristic of this mesh.
     * @method module:Core.Mesh#eulerCharacteristic
     * @returns {number}
     */
    eulerCharacteristic() {
        return this.vertices.length - this.edges.length + this.faces.length;
    }
    /**
     * Constructs this mesh.
     * @returns {boolean} True if this mesh is constructed successfully and false if not
     * (when this mesh contains any one or a combination of the following - non-manifold vertices,
     *  non-manifold edges, isolated vertices, isolated faces).
     */
    build(positions, indices) {
        // preallocate elements
        this.preallocateElements(positions, indices);
        // create and insert vertices
        const indexToVertex = new Map();
        for (let i = 0; i < positions.count; i++) {
            const v = new Vertex();
            v.index = i;
            this.vertices[i] = v;
            indexToVertex.set(i, v);
        }
        // create and insert halfedges, edges and non boundary loop faces
        let eIndex = 0;
        const edgeCount = new Map();
        const existingHalfedges = new Map();
        const hasTwinHalfedge = new Map();
        for (let I = 0; I < indices.array.length; I += 3) {
            // create new face
            const f = new Face();
            this.faces[I / 3] = f;
            // create a halfedge for each edge of the newly created face
            for (let J = 0; J < 3; J++) {
                const h = new Halfedge();
                this.halfedges[I + J] = h;
            }
            // initialize the newly created halfedges
            for (let J = 0; J < 3; J++) {
                // current halfedge goes from vertex i to vertex j
                const K = (J + 1) % 3;
                let i = indices.array[I + J];
                let j = indices.array[I + K];
                // set the current halfedge's attributes
                const h = this.halfedges[I + J];
                h.next = this.halfedges[I + K];
                h.prev = this.halfedges[I + ((J + 3 - 1) % 3)];
                h.onBoundary = false;
                hasTwinHalfedge.set(h, false);
                // point the new halfedge and vertex i to each other
                const v = indexToVertex.get(i);
                h.vertex = v;
                v.halfedge = h;
                // point the new halfedge and face to each other
                h.face = f;
                f.halfedge = h;
                // swap if i > j
                if (i > j) {
                    j = [i, (i = j)][0];
                }
                const value = [i, j];
                const key = value.toString();
                if (existingHalfedges.has(key)) {
                    // if a halfedge between vertex i and j has been created in the past, then it
                    // is the twin halfedge of the current halfedge
                    const twin = existingHalfedges.get(key);
                    h.twin = twin;
                    twin.twin = h;
                    h.edge = twin.edge;
                    hasTwinHalfedge.set(h, true);
                    hasTwinHalfedge.set(twin, true);
                    edgeCount.set(key, edgeCount.get(key) + 1);
                }
                else {
                    // create an edge and set its halfedge
                    const e = new Edge();
                    this.edges[eIndex++] = e;
                    h.edge = e;
                    e.halfedge = h;
                    // record the newly created edge and halfedge from vertex i to j
                    existingHalfedges.set(key, h);
                    edgeCount.set(key, 1);
                }
                // check for non-manifold edges
                if (edgeCount.get(key) > 2) {
                    console.warn('Mesh has non-manifold edges!');
                    return false;
                }
            }
        }
        // create and insert boundary halfedges and "imaginary" faces for boundary cycles
        // also create and insert corners
        let hIndex = indices.array.length;
        let cIndex = 0;
        for (let i = 0; i < indices.array.length; i++) {
            // if a halfedge has no twin halfedge, create a new face and
            // link it the corresponding boundary cycle
            const h = this.halfedges[i];
            if (!hasTwinHalfedge.get(h)) {
                // create new face
                const f = new Face();
                this.boundaries.push(f);
                // walk along boundary cycle
                const boundaryCycle = [];
                let he = h;
                do {
                    // create a new halfedge
                    const bH = new Halfedge();
                    this.halfedges[hIndex++] = bH;
                    boundaryCycle.push(bH);
                    // grab the next halfedge along the boundary that does not have a twin halfedge
                    let nextHe = he.next;
                    while (hasTwinHalfedge.get(nextHe)) {
                        nextHe = nextHe.twin.next;
                    }
                    // set the current halfedge's attributes
                    bH.vertex = nextHe.vertex;
                    bH.edge = he.edge;
                    bH.onBoundary = true;
                    // point the new halfedge and face to each other
                    bH.face = f;
                    f.halfedge = bH;
                    // point the new halfedge and he to each other
                    bH.twin = he;
                    he.twin = bH;
                    // continue walk
                    he = nextHe;
                } while (he !== h);
                // link the cycle of boundary halfedges together
                const n = boundaryCycle.length;
                for (let j = 0; j < n; j++) {
                    boundaryCycle[j].next = boundaryCycle[(j + n - 1) % n]; // boundary halfedges are linked in clockwise order
                    boundaryCycle[j].prev = boundaryCycle[(j + 1) % n];
                    hasTwinHalfedge.set(boundaryCycle[j], true);
                    hasTwinHalfedge.set(boundaryCycle[j].twin, true);
                }
            }
            // point the newly created corner and its halfedge to each other
            if (!h.onBoundary) {
                const c = new Corner();
                c.halfedge = h;
                h.corner = c;
                this.corners[cIndex++] = c;
            }
        }
        // check if mesh has isolated vertices, isolated faces or
        // non-manifold vertices
        if (this.hasIsolatedVertices() ||
            this.hasIsolatedFaces() ||
            this.hasNonManifoldVertices()) {
            return false;
        }
        // index elements
        this.indexElements();
        return true;
    }
    /**
     * Preallocates mesh elements.
     */
    preallocateElements(positions, indices) {
        let nBoundaryHalfedges = 0;
        const sortedEdges = new Map();
        for (let I = 0; I < indices.array.length; I += 3) {
            for (let J = 0; J < 3; J++) {
                const K = (J + 1) % 3;
                let i = indices.array[I + J];
                let j = indices.array[I + K];
                // swap if i > j
                if (i > j) {
                    j = [i, (i = j)][0];
                }
                const value = [i, j];
                const key = value.toString();
                if (sortedEdges.has(key)) {
                    nBoundaryHalfedges--;
                }
                else {
                    sortedEdges.set(key, value);
                    nBoundaryHalfedges++;
                }
            }
        }
        const nVertices = positions.count;
        const nEdges = sortedEdges.size;
        const nFaces = indices.count;
        const nHalfedges = 2 * nEdges;
        const nInteriorHalfedges = nHalfedges - nBoundaryHalfedges;
        // clear arrays
        this.vertices.length = 0;
        this.edges.length = 0;
        this.faces.length = 0;
        this.halfedges.length = 0;
        this.corners.length = 0;
        this.boundaries.length = 0;
        this.generators.length = 0;
        // allocate space
        this.vertices = new Array(nVertices);
        this.edges = new Array(nEdges);
        this.faces = new Array(nFaces);
        this.halfedges = new Array(nHalfedges);
        this.corners = new Array(nInteriorHalfedges);
    }
    /**
     * Checks whether this mesh has isolated vertices.
     */
    hasIsolatedVertices() {
        for (const v of this.vertices) {
            if (v.isIsolated()) {
                console.warn('Mesh has isolated vertices!');
                return true;
            }
        }
        return false;
    }
    /**
     * Checks whether this mesh has isolated faces.
     */
    hasIsolatedFaces() {
        for (const f of this.faces) {
            let boundaryEdges = 0;
            for (const h of f.adjacentHalfedges()) {
                if (h.twin.onBoundary) {
                    boundaryEdges++;
                }
            }
            if (boundaryEdges === 3) {
                console.warn('Mesh has isolated faces!');
                return true;
            }
        }
        return false;
    }
    /**
     * Checks whether this mesh has non-manifold vertices.
     */
    hasNonManifoldVertices() {
        const adjacentFaces = new Map();
        for (const v of this.vertices) {
            adjacentFaces.set(v, 0);
        }
        for (const f of this.faces) {
            for (const v of f.adjacentVertices()) {
                adjacentFaces.set(v, adjacentFaces.get(v) + 1);
            }
        }
        for (const b of this.boundaries) {
            for (const v of b.adjacentVertices()) {
                adjacentFaces.set(v, adjacentFaces.get(v) + 1);
            }
        }
        for (const v of this.vertices) {
            if (adjacentFaces.get(v) !== v.degree()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Assigns indices to this mesh's elements.
     */
    indexElements() {
        let index = 0;
        for (const v of this.vertices) {
            v.index = index++;
        }
        index = 0;
        for (const e of this.edges) {
            e.index = index++;
        }
        index = 0;
        for (const f of this.faces) {
            f.index = index++;
        }
        index = 0;
        for (const h of this.halfedges) {
            h.index = index++;
        }
        index = 0;
        for (const c of this.corners) {
            c.index = index++;
        }
        index = 0;
        for (const b of this.boundaries) {
            b.index = index++;
        }
    }
}
// ================================================================
function normalize(positions, vertices, rescale = true) {
    // compute center of mass
    const N = vertices.length;
    const cm = new Vector();
    for (const v of vertices) {
        const p = positions.itemAt(v.index);
        cm.incrementBy(p);
    }
    cm.divideBy(N);
    // translate to origin and determine radius
    let radius = -1;
    for (const v of vertices) {
        const p = new Vector(positions.itemAt(v.index));
        p.decrementBy(cm);
        radius = Math.max(radius, p.norm());
    }
    // rescale to unit radius
    if (rescale) {
        for (const v of vertices) {
            const p = new Vector(positions.itemAt(v.index));
            p.divideBy(radius);
        }
    }
}
class Geometry {
    constructor(positions, indices, normalizePositions = true) {
        this.mesh = new Mesh();
        this.mesh.build(positions, indices);
        this.positions = positions;
        // for (let i = 0; i < positions.count; i++) {
        // 	let v = this.mesh.vertices[i]
        // 	let p = positions.itemAt(i)
        // 	this.positions[v] = p
        // }
        if (normalizePositions) {
            normalize(this.positions, this.mesh.vertices);
        }
    }
    vector(h) {
        const a = this.pos(h.vertex);
        const b = this.pos(h.next.vertex);
        return b.minus(a);
    }
    /**
     * Computes the length of an edge.
     */
    length(e) {
        return this.vector(e.halfedge).norm();
    }
    pos(v) {
        return new Vector(this.positions.itemAt(v.index));
    }
    /**
     * Computes the midpoint of an edge.
     */
    midpoint(e) {
        const h = e.halfedge;
        const a = this.pos(h.vertex);
        const b = this.pos(h.twin.vertex);
        return a.plus(b).over(2);
    }
    /**
     * Computes the mean edge length of all the edges in a mesh.
     */
    meanEdgeLength() {
        let sum = 0;
        const edges = this.mesh.edges;
        for (const e of edges) {
            sum += this.length(e);
        }
        return sum / edges.length;
    }
    /**
     * Computes the area of a face.
     */
    area(f) {
        if (f.isBoundaryLoop()) {
            return 0.0;
        }
        const u = this.vector(f.halfedge);
        const v = this.vector(f.halfedge.prev).negated();
        return 0.5 * u.cross(v).norm();
    }
    /**
     * Computes the total surface area of a mesh.
     * @method module:Core.Geometry#totalArea
     * @returns {number}
     */
    totalArea() {
        let sum = 0.0;
        for (const f of this.mesh.faces) {
            sum += this.area(f);
        }
        return sum;
    }
    /**
     * Computes the normal of a face.
     * @method module:Core.Geometry#faceNormal
     * @param {module:Core.Face} f The face whose normal needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    faceNormal(f) {
        if (f.isBoundaryLoop()) {
            return undefined;
        }
        const u = this.vector(f.halfedge);
        const v = this.vector(f.halfedge.prev).negated();
        return u.cross(v).unit();
    }
    /**
     * Computes the centroid of a face.
     * @method module:Core.Geometry#centroid
     * @param {module:Core.Face} f The face whose centroid needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    centroid(f) {
        const h = f.halfedge;
        const a = this.pos(h.vertex);
        const b = this.pos(h.next.vertex);
        const c = this.pos(h.prev.vertex);
        if (f.isBoundaryLoop()) {
            return a.plus(b).over(2);
        }
        return a.plus(b).plus(c).over(3);
    }
    /**
     * Computes the circumcenter of a face.
     * @method module:Core.Geometry#circumcenter
     * @param {module:Core.Face} f The face whose circumcenter needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    circumcenter(f) {
        const h = f.halfedge;
        const a = this.pos(h.vertex);
        const b = this.pos(h.next.vertex);
        const c = this.pos(h.prev.vertex);
        if (f.isBoundaryLoop()) {
            return a.plus(b).over(2);
        }
        const ac = c.minus(a);
        const ab = b.minus(a);
        const w = ab.cross(ac);
        const u = w.cross(ab).times(ac.norm2());
        const v = ac.cross(w).times(ab.norm2());
        const x = u.plus(v).over(2 * w.norm2());
        return x.plus(a);
    }
    /**
     * Computes an orthonormal bases for a face.
     * @method module:Core.Geometry#orthonormalBases
     * @param {module:Core.Face} f The face on which the orthonormal bases needs to be computed.
     * @returns {module:LinearAlgebra.Vector[]} An array containing two orthonormal vectors tangent to the face.
     */
    orthonormalBases(f) {
        const e1 = this.vector(f.halfedge).unit();
        const normal = this.faceNormal(f);
        const e2 = normal.cross(e1);
        return [e1, e2];
    }
    /**
     * Computes the angle (in radians) at a corner.
     * @method module:Core.Geometry#angle
     * @param {module:Core.Corner} c The corner at which the angle needs to be computed.
     * @returns {number} The angle clamped between 0 and π.
     */
    angle(c) {
        const u = this.vector(c.halfedge.prev).unit();
        const v = this.vector(c.halfedge.next).negated().unit();
        return Math.acos(Math.max(-1.0, Math.min(1.0, u.dot(v))));
    }
    /**
     * Computes the cotangent of the angle opposite to a halfedge.
     * @method module:Core.Geometry#cotan
     * @param {module:Core.Halfedge} h The halfedge opposite to the angle whose cotangent needs to be computed.
     * @returns {number}
     */
    cotan(h) {
        if (h.onBoundary) {
            return 0.0;
        }
        const u = this.vector(h.prev);
        const v = this.vector(h.next).negated();
        return u.dot(v) / u.cross(v).norm();
    }
    /**
     * Computes the signed angle (in radians) between two adjacent faces.
     * @method module:Core.Geometry#dihedralAngle
     * @param {module:Core.Halfedge} h The halfedge (shared by the two adjacent faces) on which
     * the dihedral angle is computed.
     * @returns {number} The dihedral angle.
     */
    dihedralAngle(h) {
        if (h.onBoundary || h.twin.onBoundary) {
            return 0.0;
        }
        const n1 = this.faceNormal(h.face);
        const n2 = this.faceNormal(h.twin.face);
        const w = this.vector(h).unit();
        const cosTheta = n1.dot(n2);
        const sinTheta = n1.cross(n2).dot(w);
        return Math.atan2(sinTheta, cosTheta);
    }
    /**
     * Computes the barycentric dual area of a vertex.
     * @method module:Core.Geometry#barycentricDualArea
     * @param {module:Core.Vertex} v The vertex whose barycentric dual area needs to be computed.
     * @returns {number}
     */
    barycentricDualArea(v) {
        let area = 0.0;
        for (const f of v.adjacentFaces()) {
            area += this.area(f) / 3;
        }
        return area;
    }
    /**
     * Computes the circumcentric dual area of a vertex.
     * @see {@link http://www.cs.cmu.edu/~kmcrane/Projects/Other/TriangleAreasCheatSheet.pdf}
     * @method module:Core.Geometry#circumcentricDualArea
     * @param {module:Core.Vertex} v The vertex whose circumcentric dual area needs to be computed.
     * @returns {number}
     */
    circumcentricDualArea(v) {
        let area = 0.0;
        for (const h of v.adjacentHalfedges()) {
            const u2 = this.vector(h.prev).norm2();
            const v2 = this.vector(h).norm2();
            const cotAlpha = this.cotan(h.prev);
            const cotBeta = this.cotan(h);
            area += (u2 * cotAlpha + v2 * cotBeta) / 8;
        }
        return area;
    }
    /**
     * Computes the normal at a vertex using the "equally weighted" method.
     * @method module:Core.Geometry#vertexNormalEquallyWeighted
     * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    vertexNormalEquallyWeighted(v) {
        const n = new Vector();
        for (const f of v.adjacentFaces()) {
            const normal = this.faceNormal(f);
            n.incrementBy(normal);
        }
        n.normalize();
        return n;
    }
    /**
     * Computes the normal at a vertex using the "face area weights" method.
     * @method module:Core.Geometry#vertexNormalAreaWeighted
     * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    vertexNormalAreaWeighted(v) {
        const n = new Vector();
        for (const f of v.adjacentFaces()) {
            const normal = this.faceNormal(f);
            const area = this.area(f);
            n.incrementBy(normal.times(area));
        }
        n.normalize();
        return n;
    }
    /**
     * Computes the normal at a vertex using the "tip angle weights" method.
     * @method module:Core.Geometry#vertexNormalAngleWeighted
     * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    vertexNormalAngleWeighted(v) {
        const n = new Vector();
        for (const c of v.adjacentCorners()) {
            const normal = this.faceNormal(c.halfedge.face);
            const angle = this.angle(c);
            n.incrementBy(normal.times(angle));
        }
        n.normalize();
        return n;
    }
    /**
     * Computes the normal at a vertex using the "gauss curvature" method.
     * @method module:Core.Geometry#vertexNormalGaussCurvature
     * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    vertexNormalGaussCurvature(v) {
        const n = new Vector();
        for (const h of v.adjacentHalfedges()) {
            const weight = (0.5 * this.dihedralAngle(h)) / this.length(h.edge);
            n.decrementBy(this.vector(h).times(weight));
        }
        n.normalize();
        return n;
    }
    /**
     * Computes the normal at a vertex using the "mean curvature" method (same as the "area gradient" method).
     * @method module:Core.Geometry#vertexNormalMeanCurvature
     * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    vertexNormalMeanCurvature(v) {
        const n = new Vector();
        for (const h of v.adjacentHalfedges()) {
            const weight = 0.5 * (this.cotan(h) + this.cotan(h.twin));
            n.decrementBy(this.vector(h).times(weight));
        }
        n.normalize();
        return n;
    }
    /**
     * Computes the normal at a vertex using the "inscribed sphere" method.
     * @method module:Core.Geometry#vertexNormalSphereInscribed
     * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
     * @returns {module:LinearAlgebra.Vector}
     */
    vertexNormalSphereInscribed(v) {
        const n = new Vector();
        for (const c of v.adjacentCorners()) {
            const u = this.vector(c.halfedge.prev);
            const v = this.vector(c.halfedge.next).negated();
            n.incrementBy(u.cross(v).over(u.norm2() * v.norm2()));
        }
        n.normalize();
        return n;
    }
    /**
     * Computes the angle defect at a vertex (= 2π minus the sum of incident angles
     * at an interior vertex or π minus the sum of incident angles at a boundary vertex).
     * @method module:Core.Geometry#angleDefect
     * @param {module:Core.Vertex} v The vertex whose angle defect needs to be computed.
     * @returns {number}
     */
    angleDefect(v) {
        let angleSum = 0.0;
        for (const c of v.adjacentCorners()) {
            angleSum += this.angle(c);
        }
        return v.onBoundary() ? Math.PI - angleSum : 2 * Math.PI - angleSum;
    }
    /**
     * Computes the total angle defect (= 2π times the euler characteristic of the mesh).
     * @method module:Core.Geometry#totalAngleDefect
     * @returns {number}
     */
    totalAngleDefect() {
        let totalDefect = 0.0;
        for (const v of this.mesh.vertices) {
            totalDefect += this.angleDefect(v);
        }
        return totalDefect;
    }
    /**
     * Computes the (integrated) scalar gauss curvature K at a vertex.
     */
    scalarGaussCurvature(v) {
        return this.angleDefect(v);
    }
    /**
     * Computes the (integrated) scalar mean curvature H at a vertex.
     */
    scalarMeanCurvature(v) {
        let sum = 0.0;
        for (const h of v.adjacentHalfedges()) {
            sum += 0.5 * this.length(h.edge) * this.dihedralAngle(h);
        }
        return sum;
    }
    /**
     * Computes the (pointwise) minimum and maximum principal curvature values at a vertex.
     * @method module:Core.Geometry#principalCurvatures
     * @param {module:Core.Vertex} v The vertex on which the principal curvatures need to be computed.
     * @returns {number[]} An array containing the minimum and maximum principal curvature values at a vertex.
     */
    principalCurvatures(v) {
        const A = this.circumcentricDualArea(v);
        const H = this.scalarMeanCurvature(v) / A;
        const K = this.angleDefect(v) / A;
        let discriminant = H * H - K;
        if (discriminant > 0) {
            discriminant = Math.sqrt(discriminant);
        }
        else {
            discriminant = 0;
        }
        const k1 = H - discriminant;
        const k2 = H + discriminant;
        return [k1, k2];
    }
    /**
     * Get the Gaussian curvature
     */
    K() {
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({
            array: this.mesh.vertices.map((v) => this.angleDefect(v)),
            itemSize: 1,
        });
    }
    /**
     * Get the mean curvature
     */
    H() {
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({
            array: this.mesh.vertices.map((v) => this.scalarMeanCurvature(v)),
            itemSize: 1,
        });
    }
    /**
     * Get the first principal curvature
     */
    k1() {
        const array = this.mesh.vertices.map((v) => {
            const c = this.principalCurvatures(v);
            return c[0];
        });
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array, itemSize: 1 });
    }
    /**
     * Get the second principal curvature
     */
    k2() {
        const array = this.mesh.vertices.map((v) => {
            const c = this.principalCurvatures(v);
            return c[1];
        });
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array, itemSize: 1 });
    }
}
// ====================================================================
class Vector {
    constructor(x = 0, y, z) {
        if (Array.isArray(x)) {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        }
        else {
            this.x = x;
            this.y = y !== undefined ? y : 0;
            this.z = z !== undefined ? z : 0;
        }
    }
    /**
     * Computes the Euclidean length of this vector.
     * @method Vector#norm
     * @returns {number}
     */
    norm() {
        return Math.sqrt(this.norm2());
    }
    /**
     * Computes the Euclidean length squared of this vector.
     * @method Vector#norm2
     * @returns {number}
     */
    norm2() {
        return this.dot(this);
    }
    /**
     * Divides this vector by its Euclidean length.
     * @method Vector#normalize
     */
    normalize() {
        const n = this.norm();
        this.x /= n;
        this.y /= n;
        this.z /= n;
    }
    /**
     * Returns a normalized copy of this vector.
     * @method Vector#unit
     * @returns {Vector}
     */
    unit() {
        const n = this.norm();
        const x = this.x / n;
        const y = this.y / n;
        const z = this.z / n;
        return new Vector(x, y, z);
    }
    /**
     * Checks whether this vector's components are finite.
     * @method Vector#isValid
     * @returns {boolean}
     */
    isValid() {
        return (!isNaN(this.x) &&
            !isNaN(this.y) &&
            !isNaN(this.z) &&
            isFinite(this.x) &&
            isFinite(this.y) &&
            isFinite(this.z));
    }
    /**
     * u += v
     * @method Vector#incrementBy
     * @param {Vector} v The vector added to this vector.
     */
    incrementBy(v) {
        if (Array.isArray(v)) {
            this.x += v[0];
            this.y += v[1];
            this.z += v[2];
        }
        else {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        }
    }
    /**
     * u -= v
     * @method Vector#decrementBy
     * @param {Vector} v The vector subtracted from this vector.
     */
    decrementBy(v) {
        if (Array.isArray(v)) {
            this.x -= v[0];
            this.y -= v[1];
            this.z -= v[2];
        }
        else {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        }
    }
    /**
     * u *= s
     * @method Vector#scaleBy
     * @param {number} s The number this vector is scaled by.
     */
    scaleBy(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }
    /**
     * u /= s
     * @method Vector#divideBy
     * @param {number} s The number this vector is divided by.
     */
    divideBy(s) {
        this.scaleBy(1 / s);
    }
    /**
     * Returns u + v
     * @method Vector#plus
     * @param {Vector} v The vector added to this vector.
     * @return {Vector}
     */
    plus(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    /**
     * Returns u - v
     * @method Vector#minus
     * @param {Vector} v The vector subtracted from this vector.
     * @return {Vector}
     */
    minus(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    /**
     * Returns u * s
     * @method Vector#times
     * @param {number} s The number this vector is multiplied by.
     * @return {Vector}
     */
    times(s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }
    /**
     * Returns u / s
     * @method Vector#over
     * @param {number} s The number this vector is divided by.
     * @return {Vector}
     */
    over(s) {
        return this.times(1 / s);
    }
    /**
     * Returns -u
     * @method Vector#negated
     * @return {Vector}
     */
    negated() {
        return this.times(-1);
    }
    /**
     * Computes the dot product of this vector and v
     * @method Vector#dot
     * @param {Vector} v The vector this vector is dotted with.
     * @return {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    /**
     * Computes the cross product of this vector and v
     * @method Vector#cross
     * @param {Vector} v The vector this vector is crossed with.
     * @return {Vector}
     */
    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
}


/***/ }),

/***/ "./lib/dataframe/generateNormals.ts":
/*!******************************************!*\
  !*** ./lib/dataframe/generateNormals.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateNormals": () => (/* binding */ generateNormals)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _he__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../he */ "./lib/he/index.ts");
/* harmony import */ var _fromTriangleToNode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fromTriangleToNode */ "./lib/dataframe/fromTriangleToNode.ts");




function generateNormals(dataframe, atNode = true) {
    const surface = _he__WEBPACK_IMPORTED_MODULE_2__.Surface.create(dataframe.series.positions, dataframe.series.indices);
    const n = (0,_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.createEmptySerie)({
        Type: Array,
        count: surface.nbFacets,
        itemSize: 3,
        shared: false,
    });
    surface.forEachFace((face, i) => {
        const ids = face.nodeIds;
        const p1 = surface.nodes[ids[0]].pos;
        const p2 = surface.nodes[ids[1]].pos;
        const p3 = surface.nodes[ids[2]].pos;
        const v1 = vector(p1, p2);
        const v2 = vector(p1, p3);
        n.setItemAt(i, _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.cross(v1, v2));
    });
    if (atNode === true) {
        return (0,_fromTriangleToNode__WEBPACK_IMPORTED_MODULE_3__.fromTriangleToNode)({
            positions: dataframe.series.positions,
            indices: dataframe.series.indices,
            serie: n,
        });
    }
    return n;
}
const vector = (p1, p2) => {
    const x = p2[0] - p1[0];
    const y = p2[1] - p1[1];
    const z = p2[2] - p1[2];
    const n = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    return [x / n, y / n, z / n];
};


/***/ }),

/***/ "./lib/dataframe/index.ts":
/*!********************************!*\
  !*** ./lib/dataframe/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromTriangleToNode": () => (/* reexport safe */ _fromTriangleToNode__WEBPACK_IMPORTED_MODULE_0__.fromTriangleToNode),
/* harmony export */   "fromNodeToTriangle": () => (/* reexport safe */ _fromNodeToTriangle__WEBPACK_IMPORTED_MODULE_1__.fromNodeToTriangle),
/* harmony export */   "NormalsToNodeDecomposer": () => (/* reexport safe */ _normalsToNodeDecomposer__WEBPACK_IMPORTED_MODULE_2__.NormalsToNodeDecomposer),
/* harmony export */   "TriangleToNodeDecomposer": () => (/* reexport safe */ _TriangleToNodeDecomposer__WEBPACK_IMPORTED_MODULE_3__.TriangleToNodeDecomposer),
/* harmony export */   "CurvatureDecomposer": () => (/* reexport safe */ _gaussianCurvature__WEBPACK_IMPORTED_MODULE_4__.CurvatureDecomposer),
/* harmony export */   "generateNormals": () => (/* reexport safe */ _generateNormals__WEBPACK_IMPORTED_MODULE_5__.generateNormals)
/* harmony export */ });
/* harmony import */ var _fromTriangleToNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fromTriangleToNode */ "./lib/dataframe/fromTriangleToNode.ts");
/* harmony import */ var _fromNodeToTriangle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fromNodeToTriangle */ "./lib/dataframe/fromNodeToTriangle.ts");
/* harmony import */ var _normalsToNodeDecomposer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./normalsToNodeDecomposer */ "./lib/dataframe/normalsToNodeDecomposer.ts");
/* harmony import */ var _TriangleToNodeDecomposer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TriangleToNodeDecomposer */ "./lib/dataframe/TriangleToNodeDecomposer.ts");
/* harmony import */ var _gaussianCurvature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gaussianCurvature */ "./lib/dataframe/gaussianCurvature.ts");
/* harmony import */ var _generateNormals__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./generateNormals */ "./lib/dataframe/generateNormals.ts");








/***/ }),

/***/ "./lib/dataframe/normalsToNodeDecomposer.ts":
/*!**************************************************!*\
  !*** ./lib/dataframe/normalsToNodeDecomposer.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NormalsToNodeDecomposer": () => (/* binding */ NormalsToNodeDecomposer)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fromTriangleToNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fromTriangleToNode */ "./lib/dataframe/fromTriangleToNode.ts");


/**
 * Get normals to the node of a mesh
 * @category dataframe
 */
class NormalsToNodeDecomposer extends _youwol_math__WEBPACK_IMPORTED_MODULE_0__.NormalsDecomposer {
    /**
     * @hidden
     */
    serie(df, itemSize, name) {
        const serie = super.serie(df, itemSize, name);
        if (!serie) {
            return undefined;
        }
        return (0,_fromTriangleToNode__WEBPACK_IMPORTED_MODULE_1__.fromTriangleToNode)({
            positions: df.series.positions,
            indices: df.series.indices,
            serie,
        });
    }
}
/*

What about writting:
    new FromTriangleToNodeDecomposer<NormalsDecomposer>

*/


/***/ }),

/***/ "./lib/delaunay/delaunator.ts":
/*!************************************!*\
  !*** ./lib/delaunay/delaunator.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Delaunator": () => (/* binding */ Delaunator)
/* harmony export */ });
/**
 * @see https://github.com/mapbox/delaunator
 */
/*
ISC License

Copyright (c) 2017, Mapbox

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
*/
/*eslint @typescript-eslint/no-explicit-any: off -- not our code, so disable eslint errors*/
/*eslint no-constant-condition: off -- not our code, so disable eslint errors*/
const EPSILON = Math.pow(2, -52);
const EDGE_STACK = new Uint32Array(512);
class Delaunator {
    constructor(coords) {
        this.trianglesLen = 0;
        const n = coords.length >> 1;
        if (n > 0 && typeof coords[0] !== 'number') {
            throw new Error('Expected coords to contain numbers.');
        }
        this.coords = coords;
        // arrays that will store the triangulation graph
        const maxTriangles = Math.max(2 * n - 5, 0);
        this._triangles = new Uint32Array(maxTriangles * 3);
        this._halfedges = new Int32Array(maxTriangles * 3);
        // temporary arrays for tracking the edges of the advancing convex hull
        this._hashSize = Math.ceil(Math.sqrt(n));
        this._hullPrev = new Uint32Array(n); // edge to prev edge
        this._hullNext = new Uint32Array(n); // edge to next edge
        this._hullTri = new Uint32Array(n); // edge to adjacent triangle
        this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash
        // temporary arrays for sorting points
        this._ids = new Uint32Array(n);
        this._dists = new Float64Array(n);
        this.update();
    }
    static from(points, getX = defaultGetX, getY = defaultGetY) {
        const n = points.length;
        const coords = new Float64Array(n * 2);
        for (let i = 0; i < n; i++) {
            const p = points[i];
            coords[2 * i] = getX(p);
            coords[2 * i + 1] = getY(p);
        }
        return new Delaunator(coords);
    }
    update() {
        const { coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash, } = this;
        const n = coords.length >> 1;
        // populate an array of point indices; calculate input data bbox
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < n; i++) {
            const x = coords[2 * i];
            const y = coords[2 * i + 1];
            if (x < minX) {
                minX = x;
            }
            if (y < minY) {
                minY = y;
            }
            if (x > maxX) {
                maxX = x;
            }
            if (y > maxY) {
                maxY = y;
            }
            this._ids[i] = i;
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        let minDist = Infinity;
        let i0 = 0, i1 = 0, i2 = 0;
        // pick a seed point close to the center
        for (let i = 0; i < n; i++) {
            const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist) {
                i0 = i;
                minDist = d;
            }
        }
        const i0x = coords[2 * i0];
        const i0y = coords[2 * i0 + 1];
        minDist = Infinity;
        // find the point closest to the seed
        for (let i = 0; i < n; i++) {
            if (i === i0) {
                continue;
            }
            const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist && d > 0) {
                i1 = i;
                minDist = d;
            }
        }
        let i1x = coords[2 * i1];
        let i1y = coords[2 * i1 + 1];
        let minRadius = Infinity;
        // find the third point which forms the smallest circumcircle with the first two
        for (let i = 0; i < n; i++) {
            if (i === i0 || i === i1) {
                continue;
            }
            const r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
            if (r < minRadius) {
                i2 = i;
                minRadius = r;
            }
        }
        let i2x = coords[2 * i2];
        let i2y = coords[2 * i2 + 1];
        if (minRadius === Infinity) {
            // order collinear points by dx (or dy if all x are identical)
            // and return the list as a hull
            for (let i = 0; i < n; i++) {
                this._dists[i] =
                    coords[2 * i] - coords[0] || coords[2 * i + 1] - coords[1];
            }
            quicksort(this._ids, this._dists, 0, n - 1);
            const hull = new Uint32Array(n);
            let j = 0;
            for (let i = 0, d0 = -Infinity; i < n; i++) {
                const id = this._ids[i];
                if (this._dists[id] > d0) {
                    hull[j++] = id;
                    d0 = this._dists[id];
                }
            }
            this.hull = hull.subarray(0, j);
            this.triangles = new Uint32Array(0);
            this.halfedges = new Uint32Array(0);
            return;
        }
        // swap the order of the seed points for counter-clockwise orientation
        if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
            const i = i1;
            const x = i1x;
            const y = i1y;
            i1 = i2;
            i1x = i2x;
            i1y = i2y;
            i2 = i;
            i2x = x;
            i2y = y;
        }
        const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
        this._cx = center.x;
        this._cy = center.y;
        for (let i = 0; i < n; i++) {
            this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
        }
        // sort the points by distance from the seed triangle circumcenter
        quicksort(this._ids, this._dists, 0, n - 1);
        // set up the seed triangle as the starting hull
        this._hullStart = i0;
        let hullSize = 3;
        hullNext[i0] = hullPrev[i2] = i1;
        hullNext[i1] = hullPrev[i0] = i2;
        hullNext[i2] = hullPrev[i1] = i0;
        hullTri[i0] = 0;
        hullTri[i1] = 1;
        hullTri[i2] = 2;
        hullHash.fill(-1);
        hullHash[this._hashKey(i0x, i0y)] = i0;
        hullHash[this._hashKey(i1x, i1y)] = i1;
        hullHash[this._hashKey(i2x, i2y)] = i2;
        this.trianglesLen = 0;
        this._addTriangle(i0, i1, i2, -1, -1, -1);
        for (let k = 0, xp, yp; k < this._ids.length; k++) {
            const i = this._ids[k];
            const x = coords[2 * i];
            const y = coords[2 * i + 1];
            // skip near-duplicate points
            if (k > 0 &&
                Math.abs(x - xp) <= EPSILON &&
                Math.abs(y - yp) <= EPSILON) {
                continue;
            }
            xp = x;
            yp = y;
            // skip seed triangle points
            if (i === i0 || i === i1 || i === i2) {
                continue;
            }
            // find a visible edge on the convex hull using edge hash
            let start = 0;
            for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
                start = hullHash[(key + j) % this._hashSize];
                if (start !== -1 && start !== hullNext[start]) {
                    break;
                }
            }
            start = hullPrev[start];
            let e = start, q;
            while (((q = hullNext[e]),
                !orient(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1]))) {
                e = q;
                if (e === start) {
                    e = -1;
                    break;
                }
            }
            if (e === -1) {
                continue;
            } // likely a near-duplicate point; skip it
            // add the first triangle from the point
            let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);
            // recursively flip triangles from the point until they satisfy the Delaunay condition
            hullTri[i] = this._legalize(t + 2);
            hullTri[e] = t; // keep track of boundary triangles on the hull
            hullSize++;
            // walk forward through the hull, adding more triangles and flipping recursively
            let n = hullNext[e];
            while (((q = hullNext[n]),
                orient(x, y, coords[2 * n], coords[2 * n + 1], coords[2 * q], coords[2 * q + 1]))) {
                t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]);
                hullTri[i] = this._legalize(t + 2);
                hullNext[n] = n; // mark as removed
                hullSize--;
                n = q;
            }
            // walk backward from the other side, adding more triangles and flipping
            if (e === start) {
                while (((q = hullPrev[e]),
                    orient(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1]))) {
                    t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
                    this._legalize(t + 2);
                    hullTri[q] = t;
                    hullNext[e] = e; // mark as removed
                    hullSize--;
                    e = q;
                }
            }
            // update the hull indices
            this._hullStart = hullPrev[i] = e;
            hullNext[e] = hullPrev[n] = i;
            hullNext[i] = n;
            // save the two new edges in the hash table
            hullHash[this._hashKey(x, y)] = i;
            hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
        }
        this.hull = new Uint32Array(hullSize);
        for (let i = 0, e = this._hullStart; i < hullSize; i++) {
            this.hull[i] = e;
            e = hullNext[e];
        }
        // trim typed triangle mesh arrays
        this.triangles = this._triangles.subarray(0, this.trianglesLen);
        this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
    }
    _hashKey(x, y) {
        return (Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize);
    }
    _legalize(a) {
        const { _triangles: triangles, _halfedges: halfedges, coords } = this;
        let i = 0;
        let ar = 0;
        // recursion eliminated with a fixed-size stack
        while (true) {
            const b = halfedges[a];
            /* if the pair of triangles doesn't satisfy the Delaunay condition
             * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
             * then do the same check/flip recursively for the new pair of triangles
             *
             *           pl                    pl
             *          /||\                  /  \
             *       al/ || \bl            al/    \a
             *        /  ||  \              /      \
             *       /  a||b  \    flip    /___ar___\
             *     p0\   ||   /p1   =>   p0\---bl---/p1
             *        \  ||  /              \      /
             *       ar\ || /br             b\    /br
             *          \||/                  \  /
             *           pr                    pr
             */
            const a0 = a - (a % 3);
            ar = a0 + ((a + 2) % 3);
            if (b === -1) {
                // convex hull edge
                if (i === 0) {
                    break;
                }
                a = EDGE_STACK[--i];
                continue;
            }
            const b0 = b - (b % 3);
            const al = a0 + ((a + 1) % 3);
            const bl = b0 + ((b + 2) % 3);
            const p0 = triangles[ar];
            const pr = triangles[a];
            const pl = triangles[al];
            const p1 = triangles[bl];
            const illegal = inCircle(coords[2 * p0], coords[2 * p0 + 1], coords[2 * pr], coords[2 * pr + 1], coords[2 * pl], coords[2 * pl + 1], coords[2 * p1], coords[2 * p1 + 1]);
            if (illegal) {
                triangles[a] = p1;
                triangles[b] = p0;
                const hbl = halfedges[bl];
                // edge swapped on the other side of the hull (rare); fix the halfedge reference
                if (hbl === -1) {
                    let e = this._hullStart;
                    do {
                        if (this._hullTri[e] === bl) {
                            this._hullTri[e] = a;
                            break;
                        }
                        e = this._hullPrev[e];
                    } while (e !== this._hullStart);
                }
                this._link(a, hbl);
                this._link(b, halfedges[ar]);
                this._link(ar, bl);
                const br = b0 + ((b + 1) % 3);
                // don't worry about hitting the cap: it can only happen on extremely degenerate input
                if (i < EDGE_STACK.length) {
                    EDGE_STACK[i++] = br;
                }
            }
            else {
                if (i === 0) {
                    break;
                }
                a = EDGE_STACK[--i];
            }
        }
        return ar;
    }
    _link(a, b) {
        this._halfedges[a] = b;
        if (b !== -1) {
            this._halfedges[b] = a;
        }
    }
    // add a new triangle given vertex indices and adjacent half-edge ids
    _addTriangle(i0, i1, i2, a, b, c) {
        const t = this.trianglesLen;
        this._triangles[t] = i0;
        this._triangles[t + 1] = i1;
        this._triangles[t + 2] = i2;
        this._link(t, a);
        this._link(t + 1, b);
        this._link(t + 2, c);
        this.trianglesLen += 3;
        return t;
    }
}
// monotonically increases with real angle, but doesn't need expensive trigonometry
function pseudoAngle(dx, dy) {
    const p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
}
function dist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
}
// return 2d orientation sign if we're confident in it through J. Shewchuk's error bound check
function orientIfSure(px, py, rx, ry, qx, qy) {
    const l = (ry - py) * (qx - px);
    const r = (rx - px) * (qy - py);
    return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r)
        ? l - r
        : 0;
}
// a more robust orientation test that's stable in a given triangle (to fix robustness issues)
function orient(rx, ry, qx, qy, px, py) {
    return ((orientIfSure(px, py, rx, ry, qx, qy) ||
        orientIfSure(rx, ry, qx, qy, px, py) ||
        orientIfSure(qx, qy, px, py, rx, ry)) < 0);
}
function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    const dx = ax - px;
    const dy = ay - py;
    const ex = bx - px;
    const ey = by - py;
    const fx = cx - px;
    const fy = cy - py;
    const ap = dx * dx + dy * dy;
    const bp = ex * ex + ey * ey;
    const cp = fx * fx + fy * fy;
    return (dx * (ey * cp - bp * fy) -
        dy * (ex * cp - bp * fx) +
        ap * (ex * fy - ey * fx) <
        0);
}
function circumradius(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;
    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);
    const x = (ey * bl - dy * cl) * d;
    const y = (dx * cl - ex * bl) * d;
    return x * x + y * y;
}
function circumcenter(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;
    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);
    const x = ax + (ey * bl - dy * cl) * d;
    const y = ay + (dx * cl - ex * bl) * d;
    return { x, y };
}
function quicksort(ids, dists, left, right) {
    if (right - left <= 20) {
        for (let i = left + 1; i <= right; i++) {
            const temp = ids[i];
            const tempDist = dists[temp];
            let j = i - 1;
            while (j >= left && dists[ids[j]] > tempDist) {
                ids[j + 1] = ids[j--];
            }
            ids[j + 1] = temp;
        }
    }
    else {
        const median = (left + right) >> 1;
        let i = left + 1;
        let j = right;
        swap(ids, median, i);
        if (dists[ids[left]] > dists[ids[right]]) {
            swap(ids, left, right);
        }
        if (dists[ids[i]] > dists[ids[right]]) {
            swap(ids, i, right);
        }
        if (dists[ids[left]] > dists[ids[i]]) {
            swap(ids, left, i);
        }
        const temp = ids[i];
        const tempDist = dists[temp];
        while (true) {
            do {
                i++;
            } while (dists[ids[i]] < tempDist);
            do {
                j--;
            } while (dists[ids[j]] > tempDist);
            if (j < i) {
                break;
            }
            swap(ids, i, j);
        }
        ids[left + 1] = ids[j];
        ids[j] = temp;
        if (right - i + 1 >= j - left) {
            quicksort(ids, dists, i, right);
            quicksort(ids, dists, left, j - 1);
        }
        else {
            quicksort(ids, dists, left, j - 1);
            quicksort(ids, dists, i, right);
        }
    }
}
function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
function defaultGetX(p) {
    return p[0];
}
function defaultGetY(p) {
    return p[1];
}


/***/ }),

/***/ "./lib/extractSurfaceBorder.ts":
/*!*************************************!*\
  !*** ./lib/extractSurfaceBorder.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extractSurfaceBorders": () => (/* binding */ extractSurfaceBorders)
/* harmony export */ });
/* harmony import */ var _he__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./he */ "./lib/he/index.ts");

/**
 * Get borders ([[Serie]]) as pair of two 3D nodes, i.e., `[x11,y11,z11, x12,y12,z12,  x21,y21,z21, x22,y22,z22, ...]`
 */
function extractSurfaceBorders(positions, indices) {
    const surface = _he__WEBPACK_IMPORTED_MODULE_0__.Surface.create(positions, indices);
    return surface.bordersAsSerie;
}


/***/ }),

/***/ "./lib/extrude/angles.ts":
/*!*******************************!*\
  !*** ./lib/extrude/angles.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deg2rad": () => (/* binding */ deg2rad),
/* harmony export */   "rad2deg": () => (/* binding */ rad2deg),
/* harmony export */   "between_0_360": () => (/* binding */ between_0_360),
/* harmony export */   "between_0_180": () => (/* binding */ between_0_180),
/* harmony export */   "between_0_2pi": () => (/* binding */ between_0_2pi),
/* harmony export */   "between_0_pi": () => (/* binding */ between_0_pi)
/* harmony export */ });
function deg2rad(a) {
    return (a * Math.PI) / 180;
}
function rad2deg(a) {
    return (a * 180) / Math.PI;
}
function between_0_360(a) {
    if (a < 0) {
        while (a < 0) {
            a += 360;
        }
    }
    else if (a > 360) {
        while (a > 360) {
            a -= 360;
        }
    }
    return a;
}
function between_0_180(a) {
    if (a < 0) {
        while (a < 0) {
            a += 180;
        }
    }
    if (a > 180) {
        while (a > 180) {
            a -= 180;
        }
    }
    return a;
}
function between_0_2pi(a) {
    const twopi = Math.PI * 2.0;
    if (a < 0) {
        while (a < 0) {
            a += twopi;
        }
    }
    if (a >= twopi) {
        while (a >= twopi) {
            a -= twopi;
        }
    }
    return a;
}
function between_0_pi(a) {
    if (a < 0) {
        while (a < 0) {
            a += Math.PI;
        }
    }
    if (a >= Math.PI) {
        while (a >= Math.PI) {
            a -= Math.PI;
        }
    }
    return a;
}


/***/ }),

/***/ "./lib/extrude/extrude.ts":
/*!********************************!*\
  !*** ./lib/extrude/extrude.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extrude": () => (/* binding */ extrude)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./angles */ "./lib/extrude/angles.ts");


/**
 * Extruce a 2D/3D trace using the dip angle, dip-direction and a depth.
 *
 * Example:
 * ```ts
 * const trace = {
 *      is: "1",
 *      dip: 35,
 *      dipDirection: 135,
 *      depth: 1000,
 *      rows: 5,
 *      points: Serie.create({array: [0,0, 0,1, 0,2, 1,3, 2,4], itemSize: 2})
 * }
 * const surface = extrude(trace)
 * console.log(surface.positions, surface.indices)
 * ```
 * @category Extrude
 */
function extrude(trace) {
    const t = new Trace(trace);
    return {
        positions: t.positions,
        indices: t.indices,
    };
}
// ------------------------------------------------------------
class Trace {
    constructor(trace) {
        if (trace === undefined) {
            throw new Error('data for trace is undefned');
        }
        if (trace.points.itemSize !== 2 && trace.points.itemSize !== 3) {
            throw new Error('points must be a Serie with itemSize equals to 2 or 3');
        }
        this.info = trace;
        if (this.info.depth === undefined) {
            this.info.depth = 0.1;
        }
        if (this.info.dip === undefined) {
            this.info.dip = 30;
        }
        if (this.info.dipDirection === undefined) {
            this.info.dipDirection = 90;
        }
        if (this.info.rows === undefined) {
            this.info.rows = 5;
        }
        if (this.info.id === undefined) {
            this.info.id = 'no-name';
        }
        this.perform();
    }
    pt(i) {
        return this.info.points.itemAt(i);
    }
    perform() {
        const N = this.info.rows;
        const n = this.info.points.count;
        const dip = (0,_angles__WEBPACK_IMPORTED_MODULE_1__.deg2rad)(this.info.dip);
        const dipDir = (0,_angles__WEBPACK_IMPORTED_MODULE_1__.deg2rad)(this.info.dipDirection);
        const dh = this.info.depth / (N - 1);
        const T = [
            dh * Math.sin(dipDir) * Math.cos(dip),
            dh * Math.cos(dipDir) * Math.cos(dip),
            dh * Math.sin(dip),
        ];
        const positions = [];
        const indices = [];
        for (let j = 0; j < N; ++j) {
            for (let i = 0; i < n; ++i) {
                const p = this.pt(i);
                if (p.length === 3) {
                    positions.push(p[0] + j * T[0], p[1] + j * T[1], p[2] - j * T[2]);
                }
                else {
                    positions.push(p[0] + j * T[0], p[1] + j * T[1], -j * T[2]);
                }
            }
        }
        for (let j = 0; j < N - 1; ++j) {
            const start = j * n;
            for (let i = 0; i < n - 1; ++i) {
                // one line of triangles
                const id = start + i;
                indices.push(id, 1 + id, n + id, 1 + id, n + 1 + id, n + id);
            }
        }
        this.positions = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: positions, itemSize: 3 });
        this.indices = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: indices, itemSize: 3 });
    }
}


/***/ }),

/***/ "./lib/extrude/index.ts":
/*!******************************!*\
  !*** ./lib/extrude/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extrude": () => (/* reexport safe */ _extrude__WEBPACK_IMPORTED_MODULE_0__.extrude),
/* harmony export */   "mapToMnt": () => (/* reexport safe */ _mapToMnt__WEBPACK_IMPORTED_MODULE_1__.mapToMnt)
/* harmony export */ });
/* harmony import */ var _extrude__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extrude */ "./lib/extrude/extrude.ts");
/* harmony import */ var _mapToMnt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mapToMnt */ "./lib/extrude/mapToMnt.ts");




/***/ }),

/***/ "./lib/extrude/mapToMnt.ts":
/*!*********************************!*\
  !*** ./lib/extrude/mapToMnt.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapToMnt": () => (/* binding */ mapToMnt)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../bbox */ "./lib/bbox.ts");
// import BBox3D from '@youwol/core/geom/BBox3D.js'
// import Vec3   from '@youwol/core/math/Vec3.js'


/**
 * Map 2D or 3D segments onto a mnt
 * @param mnt The mnt given by the [[Serie]] positions and indices
 * @param traces An array of [[TraceInfo]]
 * @returns An array of [[Serie]]
 * @category Extrude
 */
function mapToMnt(mnt, traces) {
    const t = new MapToMnt();
    t.setMnt(mnt);
    t.setTraces(traces);
    return t.run();
}
// -------------------------------------------------------
class MapToMnt {
    constructor() {
        this.mnt = undefined;
        this.active = true;
        this.mnt = undefined;
        this.traces = undefined;
    }
    setMnt(mnt) {
        this.mnt = mnt;
    }
    setTraces(traces) {
        this.traces = traces;
    }
    run() {
        if (!this.mnt || this.traces.length === 0) {
            return undefined;
        }
        const bbox = new _bbox__WEBPACK_IMPORTED_MODULE_1__.BBox();
        this.mnt.positions.forEach((p) => {
            bbox.grow(p);
        });
        // const zmin = bbox.min[2]
        // const zmax = bbox.max[2]
        // const z = (zmin + zmax) / 2
        // const z1 = z - (zmax - zmin) * 100
        // const z2 = z + (zmax - zmin) * 100
        const series = [];
        this.traces.forEach((trace) => {
            // const n = trace.points.length / 2
            //trace["newPoints"] = [] // extend the class
            const newPoints = [];
            trace.points.forEach((p) => {
                if (this.active) {
                    let found = false;
                    for (let j = 0; j < this.mnt.indices.length; j += 3) {
                        const i1 = this.mnt.indices.array[j];
                        const i2 = this.mnt.indices.array[j + 1];
                        const i3 = this.mnt.indices.array[j + 2];
                        const p1 = this.mnt.positions.itemAt(i1);
                        const p2 = this.mnt.positions.itemAt(i2);
                        const p3 = this.mnt.positions.itemAt(i3);
                        const z = (p1[2] + p2[2] + p3[2]) / 3;
                        if (this.pointInTriangle(p, p1, p2, p3)) {
                            // Bon, j'ai la cagne...on va approximer le z en supposant que
                            // la densité du maillage est assez bonne par rapport aux traces des failles...
                            newPoints.push(p[0], p[1], z);
                            found = true;
                            break;
                        }
                    }
                    console.assert(found);
                }
                else {
                    newPoints.push(p[0], p[1], 0);
                }
            }); // end points of current trace
            series.push(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: newPoints, itemSize: 3 }));
        }); // end all traces
        return series;
    }
    pointInTriangle(pt, v1, v2, v3) {
        function sign(p1, p2, p3) {
            return ((p1[0] - p3[0]) * (p2[1] - p3[1]) -
                (p2[0] - p3[0]) * (p1[1] - p3[1]));
        }
        const d1 = sign(pt, v1, v2);
        const d2 = sign(pt, v2, v3);
        const d3 = sign(pt, v3, v1);
        const has_neg = d1 < 0 || d2 < 0 || d3 < 0;
        const has_pos = d1 > 0 || d2 > 0 || d3 > 0;
        return !(has_neg && has_pos);
    }
}


/***/ }),

/***/ "./lib/generate.ts":
/*!*************************!*\
  !*** ./lib/generate.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateEllipse": () => (/* binding */ generateEllipse),
/* harmony export */   "generateRectangle": () => (/* binding */ generateRectangle)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _triangulate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./triangulate */ "./lib/triangulate.ts");


/**
 * Generate a meshed ellipse made of nbRings rings. The number of points
 * in a ring is function of the number of rings: nbNodes = ringIndex * density, with
 * ringIndex starting from 1 and ending at nbRings.
 * @param a The x axis length
 * @param b The y axis length
 * @param nbRings The number of internal rings (default 8)
 * @param center The position of the ellipse center
 *
 * Example:
 * ```ts
 * const dataframe = generateEllipse({
 *      a: 100,
 *      b: 200
 * })
 *
 * console.log( dataframe.series.positions )
 * console.log( dataframe.series.indices )
 * ```
 */
function generateEllipse({ a, b, nbRings = 4, density = 8, center = [0, 0, 0], }) {
    const add = (x, y) => nodes.push(x + center[0], y + center[1], center[2]);
    const onering = (an, bn, n) => {
        for (let i = 0; i < n; ++i) {
            const theta = (2 * Math.PI * i) / (n - 1);
            const x = (an * Math.cos(theta)) / 2;
            const y = (bn * Math.sin(theta)) / 2;
            add(x, y);
        }
    };
    const nodes = [];
    const an = a / nbRings;
    const bn = b / nbRings;
    for (let i = 1; i <= nbRings; ++i) {
        onering(an * i, bn * i, density * i);
    }
    add(0, 0);
    return (0,_triangulate__WEBPACK_IMPORTED_MODULE_1__.triangulate)(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: nodes, itemSize: 3 }));
}
/**
 * Generate a meshed rectangle
 * @param a The x axis length
 * @param b The y axis length
 * @param na The number of points along the x axis
 * @param nb The number of points along the y axis
 * @param center The position of the rectangle center
 *
 * Example:
 * ```ts
 * const dataframe = generateRectangle({
 *      a: 100,
 *      b: 100,
 *      na: 10,
 *      nb: 10,
 *      center: [0,0,0]
 * })
 *
 * console.log( dataframe.series.positions )
 * console.log( dataframe.series.indices )
 * ```
 */
function generateRectangle({ a, b, na, nb, center = [0, 0, 0], }) {
    const add = (x, y) => nodes.push(x + center[0] - a / 2, y + center[1] - b / 2, center[2]);
    const nodes = [];
    const aa = 1 / (na - 1);
    const bb = 1 / (nb - 1);
    for (let i = 0; i < na; ++i) {
        for (let j = 0; j < nb; ++j) {
            add(a * i * aa, b * j * bb);
        }
    }
    return (0,_triangulate__WEBPACK_IMPORTED_MODULE_1__.triangulate)(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: nodes, itemSize: 3 }));
}


/***/ }),

/***/ "./lib/generateSphere.ts":
/*!*******************************!*\
  !*** ./lib/generateSphere.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateSphere": () => (/* binding */ generateSphere)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
// From https://observablehq.com/@mbostock/geodesic-rainbow
//

/**
 * Return two typed array for the faces and the vertices making a sphere given by a subdivision.
 * Note that all triangles are decoupled.
 * ```ts
 * {
 *      position: Float32Array,
 *      indices : Int16Array
 * }
 * ```
 * @example
 * ```ts
 * import { generateSphere, Surface } from '@youwol/geometry
 *
 * const {positions, indices} = generateSphere(10)
 * console.log('nb vertices :', positions.count)
 * console.log('nb triangles:', indices.count)
 *
 * const surface    = Surface.create(positions, indices)
 *
 * // const archSrface = new arch.Surface(positions.array, indices.array)
 * ```
 * @param subdivision The number of subdivision (>0)
 */
function generateSphere(subdivision, { shared = true, typed = true } = {}) {
    if (subdivision < 1) {
        throw new Error('Subdivision must be > 0');
    }
    const phi = (1 + Math.sqrt(5)) / 2; // golden number
    const positions = new Array();
    const indices = new Array();
    let idx = 0;
    const vertices = [
        [1, phi, 0],
        [-1, phi, 0],
        [1, -phi, 0],
        [-1, -phi, 0],
        [0, 1, phi],
        [0, -1, phi],
        [0, 1, -phi],
        [0, -1, -phi],
        [phi, 0, 1],
        [-phi, 0, 1],
        [phi, 0, -1],
        [-phi, 0, -1],
    ];
    const faces = [
        [0, 1, 4],
        [1, 9, 4],
        [4, 9, 5],
        [5, 9, 3],
        [2, 3, 7],
        [3, 2, 5],
        [7, 10, 2],
        [0, 8, 10],
        [0, 4, 8],
        [8, 2, 10],
        [8, 4, 5],
        [8, 5, 2],
        [1, 0, 6],
        [11, 1, 6],
        [3, 9, 11],
        [6, 10, 7],
        [3, 11, 7],
        [11, 6, 7],
        [6, 0, 10],
        [9, 1, 11],
    ].map((face) => face.map((i) => vertices[i]));
    const R = 3;
    const proj = ([x, y, z]) => {
        const k = R / Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        return [k * x, k * y, k * z];
    };
    const lerp = ([x0, y0, z0], [x1, y1, z1], t) => [x0 + t * (x1 - x0), y0 + t * (y1 - y0), z0 + t * (z1 - z0)];
    const newP = (...P) => P.forEach((p) => {
        positions.push(p[0], p[1], p[2]);
        indices.push(idx++);
    });
    for (const [f0, f1, f2] of faces) {
        let f10, f20 = lerp(f0, f1, 1 / subdivision);
        let f11, f21 = lerp(f0, f2, 1 / subdivision);
        newP(proj(f0), proj(f20), proj(f21));
        for (let i = 1; i < subdivision; ++i) {
            f10 = f20;
            f20 = lerp(f0, f1, (i + 1) / subdivision);
            f11 = f21;
            f21 = lerp(f0, f2, (i + 1) / subdivision);
            for (let j = 0; j <= i; ++j) {
                newP(proj(lerp(f10, f11, j / i)), proj(lerp(f20, f21, j / (i + 1))), proj(lerp(f20, f21, (j + 1) / (i + 1))));
            }
            for (let j = 0; j < i; ++j) {
                newP(proj(lerp(f10, f11, j / i)), proj(lerp(f20, f21, (j + 1) / (i + 1))), proj(lerp(f10, f11, (j + 1) / i)));
            }
        }
    }
    if (typed) {
        return {
            positions: (0,_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.createTyped)(Float32Array, positions, shared),
            indices: (0,_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.createTyped)(Int16Array, indices, shared),
        };
    }
    else {
        return {
            positions,
            indices,
        };
    }
}


/***/ }),

/***/ "./lib/grid2DHelper.ts":
/*!*****************************!*\
  !*** ./lib/grid2DHelper.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Grid2DHelper": () => (/* binding */ Grid2DHelper)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Represent a 2D cartesian grid (axis aligned)
 */
class Grid2DHelper {
    constructor(min, max, nx, ny, eps = 1e-7) {
        this._origin = [0, 0];
        this._n = [0, 0];
        this._dx = 0;
        this._dy = 0;
        this._n = [nx, ny];
        this._dx = (max[0] - min[0] + 2 * eps) / (nx - 1);
        this._dy = (max[1] - min[1] + 2 * eps) / (ny - 1);
        this._origin = [min[0] - eps, min[1] - eps];
    }
    get count() {
        return this._n[0] * this._n[1];
    }
    get nx() {
        return this._n[0];
    }
    get ny() {
        return this._n[1];
    }
    get dx() {
        return this._dx;
    }
    get dy() {
        return this._dy;
    }
    get origin() {
        return this._origin;
    }
    get xLength() {
        return this._n[0] * this._dx;
    }
    get yLength() {
        return this._n[1] * this._dy;
    }
    getIJ(p) {
        const lx = p[0] - this._origin[0];
        const xg = lx / this._dx;
        if (lx < 0 || xg > this._n[0]) {
            return { ok: false };
        }
        const ix = Math.trunc(xg);
        const ly = p[1] - this._origin[1];
        const yg = ly / this._dy;
        if (ly < 0 || yg > this._n[1]) {
            return { ok: false };
        }
        const iy = Math.trunc(yg);
        return {
            ok: true,
            ij: [ix, iy],
        };
    }
    /**
     * Given the (i,j) indices of a cell, return its flatten index.
     * This index varies from 0 to nx*ny and is unique for each corner
     * cell of the grid. It is mainly used to get the attribute at a given
     * position.
     */
    flatIndex(i, j) {
        return i + j * this._n[0];
    }
    /**
     * Return the flat-indices of the 4 corners of the intersecting cell
     * with point p
     */
    flatIndices(p) {
        const c = this.candidate(p);
        if (c === undefined) {
            return undefined;
        }
        const i1 = this.flatIndex(c[0], c[1]);
        const i2 = this.flatIndex(c[0], c[1] + 1);
        return [i1, i2, i1 + 1, i2 + 1];
    }
    /**
     * Given the (i,j) indices of a cell (lower-left corner),
     * return its (x,y) position
     */
    positionAt(i, j) {
        const x = this._origin[0] + i * this._dx;
        const y = this._origin[1] + j * this._dy;
        return [x, y];
    }
    /**
     * Get the (i,j) position of the intersecting cell.
     * The 4 corners will be
     * ```
     * (i,j), (i+1,j), (i+1,j+1) and (i,j+1)
     *
     *       y
     *       ^
     *       |
     *       *---* (i+1,j+1)
     *       |   |
     * (i,j) *---* --> x
     * ```
     */
    candidate(p) {
        const { ok, ij } = this.getIJ(p);
        if (!ok) {
            return undefined;
        }
        return ij;
    }
    interpolate(p, attribute) {
        const ij = this.getIJ(p);
        if (ij.ok) {
            const I = ij.ij[0];
            const J = ij.ij[1];
            const p1 = this.positionAt(I, J);
            const p2 = this.positionAt(I + 1, J + 1);
            const ids = this.flatIndices(p);
            // console.log(attribute)
            const values = ids.map((v) => attribute.itemAt(v));
            if (Array.isArray(values[0])) {
                return values[0].map((a1, i) => {
                    return (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.biLerp)(p, p1, p2, a1, values[1][i], values[2][i], values[3][i]);
                });
            }
            return (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.biLerp)(p, p1, p2, values[0], values[1], values[2], values[3]);
        }
        return undefined;
    }
    /**
     * Iterate aver all points of the grids and call cb = Function(x, y, i, j, flat)
     * @param cb
     */
    forEach(cb) {
        let k = 0;
        for (let i = 0; i < this._n[0]; ++i) {
            for (let j = 0; j < this._n[1]; ++j) {
                const p = this.positionAt(i, j);
                cb(p[0], p[1], i, j, k++);
            }
        }
    }
    /**
     * Iterate aver all points of the grids and generate a new array of the transformed point
     * by calling cb = Function(x, y, i, j, flat)
     * @param cb
     */
    map(cb) {
        const arr = new Array(this.count);
        let k = 0;
        for (let i = 0; i < this._n[0]; ++i) {
            for (let j = 0; j < this._n[1]; ++j) {
                const p = this.positionAt(i, j);
                arr[k] = cb(p[0], p[1], i, j, k++);
            }
        }
        return arr;
    }
}


/***/ }),

/***/ "./lib/grid3DHelper.ts":
/*!*****************************!*\
  !*** ./lib/grid3DHelper.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Grid3DHelper": () => (/* binding */ Grid3DHelper)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Represent a 3D cartesian grid (axis aligned)
 */
class Grid3DHelper {
    constructor(min, max, nx, ny, nz, eps = 1e-7) {
        this._origin = [0, 0, 0];
        this._n = [0, 0, 0];
        this._dx = 0;
        this._dy = 0;
        this._dz = 0;
        this._n = [nx, ny, nz];
        this._dx = (max[0] - min[0] + 2 * eps) / (nx - 1);
        this._dy = (max[1] - min[1] + 2 * eps) / (ny - 1);
        this._dz = (max[2] - min[2] + 2 * eps) / (nz - 1);
        this._origin = [min[0] - eps, min[1] - eps, min[2] - eps];
    }
    get count() {
        return this._n[0] * this._n[1] * this._n[2];
    }
    get nx() {
        return this._n[0];
    }
    get ny() {
        return this._n[1];
    }
    get nz() {
        return this._n[2];
    }
    get dx() {
        return this._dx;
    }
    get dy() {
        return this._dy;
    }
    get dz() {
        return this._dz;
    }
    get origin() {
        return this._origin;
    }
    get xLength() {
        return this._n[0] * this._dx;
    }
    get yLength() {
        return this._n[1] * this._dy;
    }
    get zLength() {
        return this._n[2] * this._dz;
    }
    getIJK(p) {
        const lx = p[0] - this._origin[0];
        if (lx < 0) {
            return { ok: false };
        }
        const ly = p[1] - this._origin[1];
        if (ly < 0) {
            return { ok: false };
        }
        const lz = p[2] - this._origin[2];
        if (lz < 0) {
            return { ok: false };
        }
        const xg = lx / this._dx;
        if (xg > this._n[0]) {
            return { ok: false };
        }
        const yg = ly / this._dy;
        if (yg > this._n[1]) {
            return { ok: false };
        }
        const zg = lz / this._dz;
        if (zg > this._n[2]) {
            return { ok: false };
        }
        const ix = Math.trunc(xg);
        const iy = Math.trunc(yg);
        const iz = Math.trunc(yg);
        return {
            ok: true,
            ijk: [ix, iy, iz],
        };
    }
    /**
     * Given the (i,j,k) indices of a cell, return its faltten index.
     * This index varies from 0 to nx*ny and is unique for each corner
     * cell of teh grid. It is mainly used to get the attribute at a given
     * position.
     */
    flatIndex(i, j, k) {
        return i + this._n[0] * j + this._n[0] * this._n[1] * k;
    }
    /**
     * Return the flat-indices of the 8 corners of the intersecting cell
     * with point p
     */
    flatIndices(p) {
        const c = this.candidate(p);
        if (c === undefined) {
            return undefined;
        }
        const i11 = this.flatIndex(c[0], c[1], c[2]);
        const i12 = this.flatIndex(c[0], c[1] + 1, c[2]);
        const i21 = this.flatIndex(c[0], c[1], c[2] + 1);
        const i22 = this.flatIndex(c[0], c[1] + 1, c[2] + 1);
        return [i11, i11 + 1, i12, i12 + 1, i21, i21 + 1, i22, i22 + 1];
    }
    /**
     * Given the (i,j) indices of a cell (lower-left corner),
     * return its (x,y) position
     */
    positionAt(i, j, k) {
        const x = this._origin[0] + i * this._dx;
        const y = this._origin[1] + j * this._dy;
        const z = this._origin[2] + k * this._dz;
        return [x, y, z];
    }
    /**
     * Get the (i,j,k) position of the intersecting cell.
     * The 4 corners will be
     * ```
     * (i,j), (i+1,j), (i+1,j+1) and (i,j+1)
     *
     *       y
     *       ^
     *       |
     *       *---* (i+1,j+1)
     *       |   |
     * (i,j) *---* --> x
     * ```
     */
    candidate(p) {
        const { ok, ijk } = this.getIJK(p);
        if (!ok) {
            return undefined;
        }
        return ijk;
    }
    interpolate(p, attribute) {
        const ijk = this.getIJK(p);
        if (ijk.ok) {
            const I = ijk.ijk[0];
            const J = ijk.ijk[1];
            const K = ijk.ijk[2];
            const p1 = this.positionAt(I, J, K);
            const p2 = this.positionAt(I + 1, J + 1, K + 1);
            // order: q000, q001, q010, q011, q100, q101, q110, q111
            const ids = new Array(8);
            ids[0] = this.flatIndex(I, J, K);
            ids[1] = this.flatIndex(I, J, K + 1);
            ids[2] = this.flatIndex(I, J + 1, K);
            ids[3] = this.flatIndex(I, J + 1, K + 1);
            ids[4] = this.flatIndex(I + 1, J, K);
            ids[5] = this.flatIndex(I + 1, J, K + 1);
            ids[6] = this.flatIndex(I + 1, J + 1, K);
            ids[7] = this.flatIndex(I + 1, J + 1, K + 1);
            const values = ids.map((v) => attribute.itemAt(v));
            if (Array.isArray(values[0])) {
                return values[0].map((a1, i) => (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.triLerp)(p, p1, p2, a1, values[1][i], values[2][i], values[3][i], values[4][i], values[5][i], values[6][i], values[7][i]));
            }
            return (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.triLerp)(p, p1, p2, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7]);
        }
        return undefined;
    }
    /**
     * Iterate aver all points of the grids and call cb = Function(x, y, z, i, j, k, flat)
     * @param cb
     */
    forEach(cb) {
        let l = 0;
        for (let i = 0; i < this._n[0]; ++i) {
            for (let j = 0; j < this._n[1]; ++j) {
                for (let k = 0; k < this._n[2]; ++k) {
                    const p = this.positionAt(i, j, k);
                    cb(p[0], p[1], p[2], i, j, k, l++);
                }
            }
        }
    }
    /**
     * Iterate aver all points of the grids and generate a new array of the transformed point
     * by calling cb = Function(x, y, z, i, j, k, flat)
     * @param cb
     */
    map(cb) {
        const arr = new Array(this.count);
        let l = 0;
        for (let i = 0; i < this._n[0]; ++i) {
            for (let j = 0; j < this._n[1]; ++j) {
                for (let k = 0; k < this._n[2]; ++k) {
                    const p = this.positionAt(i, j, k);
                    arr[l] = cb(p[0], p[1], p[2], i, j, k, l++);
                }
            }
        }
        return arr;
    }
}


/***/ }),

/***/ "./lib/he/Stack.ts":
/*!*************************!*\
  !*** ./lib/he/Stack.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Stack": () => (/* binding */ Stack)
/* harmony export */ });
/**
 * @category Halfedge
 */
class Stack {
    constructor() {
        this.items = [];
    }
    /**
     * Add a new element at the end of the stack
     */
    push(element) {
        this.items.push(element);
    }
    /**
     * Remove and return the last element
     */
    pop() {
        if (this.items.length === 0) {
            return undefined;
        }
        return this.items.pop();
    }
    /**
     * Remove and return the first element
     */
    shift() {
        if (this.items.length === 0) {
            return undefined;
        }
        return this.items.shift();
    }
    clear() {
        this.items = [];
    }
    /**
     * Get the first element
     */
    get first() {
        return this.items.length === 0 ? undefined : this.items[0];
    }
    /**
     * Get the last element
     */
    get top() {
        return this.items.length === 0
            ? undefined
            : this.items[this.items.length - 1];
    }
    /**
     * Same as top()
     */
    get last() {
        return this.top;
    }
    get isEmpty() {
        return this.items.length === 0;
    }
    get count() {
        return this.items.length;
    }
    toString() {
        let str = '';
        for (let i = 0; i < this.items.length; i++) {
            str += this.items[i] + ' ';
        }
        return str;
    }
    forEach(cb) {
        this.items.forEach(cb, this);
    }
    /*eslint @typescript-eslint/no-explicit-any: off -- WTF*/
    map(cb) {
        return this.items.map(cb, this);
    }
}


/***/ }),

/***/ "./lib/he/Surface.ts":
/*!***************************!*\
  !*** ./lib/he/Surface.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Surface": () => (/* binding */ Surface)
/* harmony export */ });
/* harmony import */ var _combels__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./combels */ "./lib/he/combels.ts");
/* harmony import */ var _Stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Stack */ "./lib/he/Stack.ts");
/* harmony import */ var _SurfaceBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SurfaceBuilder */ "./lib/he/SurfaceBuilder.ts");
/* harmony import */ var _bbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../bbox */ "./lib/bbox.ts");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Usage:
 * ```ts
 * Surface.create(positionArray, cellsArray)
 * ```
 * where `positionArray` and cellsArray are either a `Serie`, a `TypedArray` or an `Array`
 * @category Halfedge
 */
class Surface {
    constructor() {
        this.list_n_ = [];
        this.list_e_ = [];
        this.list_f_ = [];
        this.bbox_ = undefined;
    }
    beginDescription() {
        this.list_n_ = [];
        this.list_e_ = [];
        this.list_f_ = [];
    }
    endDescription() {
        /* nothing to do */
    }
    static create(positions, cells) {
        let pos = undefined;
        if (_youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.isSerie(positions)) {
            pos = positions;
        }
        else {
            pos = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.create({
                array: positions,
                itemSize: 3,
            });
        }
        let idx = undefined;
        if (_youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.isSerie(cells)) {
            idx = cells;
        }
        else {
            idx = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.create({
                array: cells,
                itemSize: 3,
            });
        }
        const m = new Surface();
        m.build(pos, idx);
        return m;
    }
    get nodesAsSerie() {
        const pos = new Array(this.list_n_.length * 3).fill(0);
        for (let i = 0; i < this.list_n_.length; ++i) {
            const node = this.list_n_[i];
            const id = 3 * i;
            pos[id] = node.pos[0];
            pos[id + 1] = node.pos[1];
            pos[id + 2] = node.pos[2];
        }
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.create({ array: pos, itemSize: 3 });
    }
    get trianglesAsSerie() {
        const index = new Array(this.list_f_.length * 3).fill(0);
        for (let i = 0; i < this.list_f_.length; ++i) {
            const ids = this.list_f_[i].nodeIds;
            const id = 3 * i;
            index[id] = ids[0];
            index[id + 1] = ids[1];
            index[id + 2] = ids[2];
        }
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.create({ array: index, itemSize: 3 });
    }
    build(positions, cells) {
        const itemSize = cells.itemSize;
        const builder = new _SurfaceBuilder__WEBPACK_IMPORTED_MODULE_2__.SurfaceBuilder();
        builder.beginSurface(this);
        const b = new _bbox__WEBPACK_IMPORTED_MODULE_3__.BBox();
        positions.forEach((p) => {
            builder.addNode(p);
            b.grow(p);
        });
        this.bbox_ = b;
        cells.forEach((cell) => {
            builder.beginFacet();
            for (let j = 0; j < itemSize; ++j) {
                builder.addNodeToFacet(cell[j]);
            }
            builder.endFacet();
        });
        builder.endSurface();
    }
    // ------------------------------------------
    get bbox() {
        return this.bbox_;
    }
    // ------------------------------------------
    get nbNodes() {
        return this.list_n_.length;
    }
    get nodes() {
        return this.list_n_;
    }
    node(i) {
        return this.list_n_[i];
    }
    forEachNode(cb) {
        const fs = this.list_n_;
        for (let i = 0; i < fs.length; ++i) {
            cb(fs[i], i);
        }
    }
    // ------------------------------------------
    get halfedges() {
        return this.list_e_;
    }
    get nbHalfedges() {
        return this.list_e_.length;
    }
    halfedge(i) {
        return this.list_e_[i];
    }
    forEachHalfedge(cb) {
        const fs = this.list_e_;
        for (let i = 0; i < fs.length; ++i) {
            cb(fs[i], i);
        }
    }
    // ------------------------------------------
    get facets() {
        return this.list_f_;
    }
    get nbFacets() {
        return this.list_f_.length;
    }
    facet(i) {
        return this.list_f_[i];
    }
    forEachFace(cb) {
        const fs = this.list_f_;
        for (let i = 0; i < fs.length; ++i) {
            cb(fs[i], i);
        }
    }
    // ------------------------------------------
    get borderEdges() {
        const edges = [];
        this.halfedges.forEach((e) => {
            if (e.facet === undefined) {
                edges.push(e);
            }
        });
        return edges;
    }
    get bordersAsSerie() {
        const nodes = [];
        this.halfedges.forEach((e) => {
            if (e.facet === undefined) {
                const n1 = e.node;
                const n2 = e.opposite.node;
                nodes.push(n1.pos[0], n1.pos[1], n1.pos[2]);
                nodes.push(n2.pos[0], n2.pos[1], n2.pos[2]);
            }
        });
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.create({ array: nodes, itemSize: 3 });
    }
    get borderIdsAsSerie() {
        const nodes = [];
        this.halfedges.forEach((e) => {
            if (e.facet === undefined) {
                const n1 = e.node;
                const n2 = e.opposite.node;
                nodes.push(n1.id, n2.id);
            }
        });
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_4__.Serie.create({ array: nodes, itemSize: 1 });
    }
    get borderNodes() {
        const nodes = [];
        this.halfedges.forEach((e) => {
            if (e.facet === undefined) {
                nodes.push(e.node, e.opposite.node);
            }
        });
        /*
        const visited = Array(this.halfedges.length).fill(false)
        this.halfedges.forEach( (e, i) => {
            if (visited[i] === false) {
                if (e.facet === undefined) {
                    // found a starting border
                    const start = e
                    do {
                        visited[i] = true
                        console.log(e.node.id)
                        nodes.push(e.node)
                        e = e.next
                    } while (e !== start )
                }
            }
        })
        */
        return nodes;
    }
    // -------------------------------- PRIVATE -------------------------------
    deleteEdge(h) {
        this.deleteHalfedge(h.opposite);
        this.deleteHalfedge(h);
    }
    deleteHalfedge(e) {
        this.list_e_ = this.list_e_.filter((value) => value === e);
    }
    deleteFacet(f) {
        this.list_f_ = this.list_f_.filter((value) => value === f);
    }
    newHalfedge(_rhs) {
        const result = new _combels__WEBPACK_IMPORTED_MODULE_0__.Halfedge();
        this.addNewHalfedge(result);
        return result;
    }
    newNode(rhs) {
        const result = new _combels__WEBPACK_IMPORTED_MODULE_0__.Node();
        if (rhs !== undefined) {
            result.setPos(rhs.pos[0], rhs.pos[1], rhs.pos[2]);
        }
        this.addNewNode(result);
        return result;
    }
    deleteNode(v) {
        this.list_n_ = this.list_n_.filter((value) => value === v);
    }
    addNewNode(n) {
        this.list_n_.push(n);
    }
    newFacet(_rhs) {
        const result = new _combels__WEBPACK_IMPORTED_MODULE_0__.Facet();
        this.addNewFacet(result);
        return result;
    }
    newEdge() {
        const h1 = this.newHalfedge();
        const h2 = this.newHalfedge();
        h1.setOpposite(h2);
        h2.setOpposite(h1);
        h1.setNext(h2);
        h2.setNext(h1);
        h1.setPrev(h2);
        h2.setPrev(h1);
        return h1;
    }
    getConnectedComponent(h, l) {
        const visited = new Map();
        this.nodes.forEach((node) => visited.set(node, false));
        const stack = new _Stack__WEBPACK_IMPORTED_MODULE_1__.Stack();
        stack.push(h);
        while (!stack.isEmpty) {
            const top = stack.top;
            stack.pop();
            if (!visited.get(top)) {
                visited.set(top, true);
                l.push(top);
                let cir = top.halfedge;
                do {
                    const cur = cir.opposite.node;
                    if (!visited.get(cur)) {
                        stack.push(cur);
                    }
                    cir = cir.nextAroundNode;
                } while (cir !== top.halfedge);
            }
        }
    }
    addNewHalfedge(h) {
        this.list_e_.push(h);
    }
    addNewFacet(f) {
        this.list_f_.push(f);
    }
}


/***/ }),

/***/ "./lib/he/SurfaceBuilder.ts":
/*!**********************************!*\
  !*** ./lib/he/SurfaceBuilder.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SurfaceBuilder": () => (/* binding */ SurfaceBuilder)
/* harmony export */ });
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ "./lib/he/observer.ts");

// type NodeObservable     = CombelObservable<Node>
// type FacetObservable    = CombelObservable<Facet>
// type HalfedgeObservable = CombelObservable<Halfedge>
// type Star               = CombelAttribute<Node, Array<Halfedge>>
// type Star               = Map<Node, Array<Halfedge>>
/**
 * @category Halfedge
 */
class SurfaceBuilder {
    constructor() {
        this.node_observable_ = new _observer__WEBPACK_IMPORTED_MODULE_0__.CombelObservable();
        this.facet_observable_ = new _observer__WEBPACK_IMPORTED_MODULE_0__.CombelObservable();
        this.halfedge_observable_ = new _observer__WEBPACK_IMPORTED_MODULE_0__.CombelObservable();
        this.surface_ = undefined;
        //star_: Star = new CombelAttribute<Node, Array<Halfedge>>()
        this.facet_node_ = new Array();
        this.nodes_ = new Array();
        this.current_facet_ = undefined;
        this.current_node_ = undefined;
        this.current_halfedge_ = undefined;
        this.first_node_in_facet_ = undefined;
        this.first_halfedge_in_facet_ = undefined;
        this.star_ = new Map();
    }
    beginSurface(s) {
        this.surface_ = s;
    }
    endSurface() {
        this.terminateSurface();
        this.nodes_ = [];
    }
    reset() {
        /* nothing to do */
    }
    /**
     * @param x Either nothing, the x component or an array of size 3
     * @param y Either nothing (if x is an array) or the y component
     * @param z Either nothing (default 0) or the z component
     */
    //addNode(x?: any, y?: any, z?: any) {
    addNode(p) {
        return this.addNodeInternal(p[0], p[1], p[2]);
    }
    beginFacet() {
        this.facet_node_ = [];
    }
    endFacet() {
        const nb_vertices = this.facet_node_.length;
        if (nb_vertices < 3) {
            throw new Error('SurfaceBuilder: Facet with less than 3 vertices');
        }
        // Detect and remove non-manifold edges by duplicating
        // the corresponding vertices.
        for (let from = 0; from < nb_vertices; from++) {
            const to = (from + 1) % nb_vertices;
            if (this.findHalfedgeBetween(this.facet_node_[from], this.facet_node_[to]) !== undefined) {
                this.facet_node_[from] = this.copyNode(this.facet_node_[from]);
                this.facet_node_[to] = this.copyNode(this.facet_node_[to]);
            }
        }
        this.beginFacetInternal();
        {
            for (let i = 0; i < nb_vertices; i++) {
                this.addNodeToFacetInternal(this.facet_node_[i]);
            }
        }
        this.endFacetInternal();
        return this.currentFacet();
    }
    addNodeToFacet(i) {
        if (i < 0 || i >= this.nodes_.length) {
            return;
        }
        this.facet_node_.push(this.nodes_[i]);
    }
    surface() {
        return this.surface_;
    }
    // --------------------------------------------------
    insertInStar(n) {
        this.star_.set(n, []);
    }
    getOrCreateFromStar(n) {
        if (this.star_.has(n) === false) {
            this.star_.set(n, []);
            return this.star_.get(n);
        }
        return this.star_.get(n);
    }
    deleteFromStarIfEmpty(n) {
        const t = this.star_.get(n);
        if (t !== undefined && t.length === 0) {
            this.star_.delete(n);
        }
    }
    // --------------------------------------------------
    // private currentNode(): Node {
    //     return this.nodes_[this.nodes_.length - 1]
    // }
    // private node(i: number): Node {
    //     return this.nodes_[i]
    // }
    currentFacet() {
        return this.current_facet_;
    }
    // ------------------ O B S E R V E R S ----------------------
    //
    // TODO: use functions instead of derived classes...
    //
    // -----------------------------------------------------------
    // private registerNodeObserser(c: NodeObserver) {
    //     this.node_observable_.registerObserver(c)
    // }
    // private unregisterNodeObserser(c: NodeObserver) {
    //     this.node_observable_.unregisterObserver(c)
    // }
    notifyRemoveNode(n) {
        this.node_observable_.notifyRemove(n);
    }
    registerFacetObserser(c) {
        this.facet_observable_.registerObserver(c);
    }
    unregisterFacetObserser(c) {
        this.facet_observable_.unregisterObserver(c);
    }
    notifyRemoveFacet(f) {
        this.facet_observable_.notifyRemove(f);
    }
    // private registerHalfedgeObserser(c: HalfedgeObserver) {
    //     this.halfedge_observable_.registerObserver(c)
    // }
    // private unregisterHalfedgeObserser(c: HalfedgeObserver) {
    //     this.halfedge_observable_.unregisterObserver(c)
    // }
    notifyRemoveHalfedge(h) {
        this.halfedge_observable_.notifyRemove(h);
    }
    // ----------------------------------------------------------
    reindexNodes() {
        let i = 0;
        this.nodes_.forEach((node) => node.setId(i++));
    }
    reindexFacets() {
        let i = 0;
        this.surface_.facets.forEach((facet) => facet.setId(i++));
    }
    // ----------------------------------------------------------
    setSurface(s) {
        this.surface_ = s;
    }
    addNodeInternal(x, y, z) {
        const new_v = this.newNode();
        if (Array.isArray(x)) {
            new_v.setPos(x[0], x[1], x[2]);
        }
        else {
            new_v.setPos(x, y, z !== undefined ? z : 0);
        }
        this.nodes_.push(new_v);
        this.insertInStar(new_v);
        return new_v;
    }
    beginFacetInternal() {
        this.current_facet_ = this.newFacet();
        this.first_node_in_facet_ = undefined;
        this.current_node_ = undefined;
        this.first_halfedge_in_facet_ = undefined;
        this.current_halfedge_ = undefined;
    }
    endFacetInternal() {
        const h = this.newHalfedgeBetween(this.current_node_, this.first_node_in_facet_);
        this.link(this.current_halfedge_, h, 1);
        this.link(h, this.first_halfedge_in_facet_, 1);
    }
    addNodeToFacetInternal(v) {
        if (this.first_node_in_facet_ === undefined) {
            this.first_node_in_facet_ = v;
        }
        else {
            const new_halfedge = this.newHalfedgeBetween(this.current_node_, v);
            if (this.first_halfedge_in_facet_ === undefined) {
                this.first_halfedge_in_facet_ = new_halfedge;
                this.makeFacetKey(this.first_halfedge_in_facet_);
            }
            else {
                this.link(this.current_halfedge_, new_halfedge, 1);
            }
            this.current_halfedge_ = new_halfedge;
        }
        this.current_node_ = v;
    }
    copyNode(from) {
        const result = this.newNode();
        result.setPos(from.pos[0], from.pos[1], from.pos[2]);
        return result;
    }
    // ------------------------------------
    // Link the 2 halfedge h1 and h2 accoding to the dimension:
    // dim 1: set next of h1 to be h1, and prev of h2 to be h1
    // dim 2: set opposite of h1 to be h2, and vis-versa
    link(h1, h2, dim) {
        switch (dim) {
            case 1:
                h1.setNext(h2);
                h2.setPrev(h1);
                break;
            case 2:
                h1.setOpposite(h2);
                h2.setOpposite(h1);
                break;
        }
    }
    // for each next linked halfedge around vertex stating at h,
    // set vertex to v
    setNodeOnOrbit(h, v) {
        let it = h;
        do {
            it.setNode(v);
            it = it.nextAroundNode;
        } while (it !== h);
    }
    // for each next linked halfedge stating at h,
    // set facet to f
    setFacetOnOrbit(h, f) {
        let it = h;
        do {
            it.setFacet(f);
            it = it.next;
        } while (it !== h);
    }
    makeNodeKey(h, v) {
        if (v === undefined) {
            h.node.setHalfedge(h);
        }
        else {
            v.setHalfedge(h);
            h.setNode(v);
        }
    }
    makeFacetKey(h, f) {
        if (f === undefined) {
            h.facet.setHalfedge(h);
        }
        else {
            f.setHalfedge(h);
            h.setFacet(f);
        }
    }
    newEdge() {
        return this.surface_.newEdge();
    }
    newNode(rhs) {
        return this.surface_.newNode(rhs);
    }
    newHalfedge(rhs) {
        return this.surface_.newHalfedge(rhs);
    }
    newFacet(rhs) {
        return this.surface_.newFacet(rhs);
    }
    deleteEdge(h) {
        this.notifyRemoveHalfedge(h);
        this.notifyRemoveHalfedge(h.opposite);
        this.surface_.deleteEdge(h);
    }
    deleteNode(v) {
        this.notifyRemoveNode(v);
        this.surface_.deleteNode(v);
    }
    deleteHalfedge(h) {
        this.notifyRemoveHalfedge(h);
        this.surface_.deleteHalfedge(h);
    }
    deleteFacet(f) {
        if (f === undefined) {
            return;
        }
        this.notifyRemoveFacet(f);
        this.surface_.deleteFacet(f);
    }
    // Set vertex halfedge pointing to h
    setNodeHalfedge(v, h) {
        v.setHalfedge(h);
    }
    // set opposite of h1 to be h2
    setHalfedgeOpposite(h1, h2) {
        h1.setOpposite(h2);
    }
    // Set next of h1 to be h2
    setHalfedgeNext(h1, h2) {
        h1.setNext(h2);
    }
    // set previous of h1 to be h2
    setHalfedgePrev(h1, h2) {
        h1.setPrev(h2);
    }
    // Set facet of h to be f
    setHalfedgeFacet(h, f) {
        h.setFacet(f);
    }
    // Set vertex of h to be v
    setHalfedgeNode(h, v) {
        h.setNode(v);
    }
    // Set halfedge of f to be h
    setFacetHalfedge(f, h) {
        f.setHalfedge(h);
    }
    // --------------------------------------------------
    newHalfedgeBetween(from, to) {
        // Non-manifold edges have been removed
        // by the higher level public functions.
        // Let us do a sanity check anyway ...
        console.assert(this.findHalfedgeBetween(from, to) === undefined);
        const result = this.newHalfedge();
        this.setHalfedgeFacet(result, this.current_facet_);
        this.setHalfedgeNode(result, to);
        const opposite = this.findHalfedgeBetween(to, from);
        if (opposite !== undefined) {
            this.link(result, opposite, 2);
        }
        this.getOrCreateFromStar(from).push(result);
        this.setNodeHalfedge(to, result);
        return result;
    }
    findHalfedgeBetween(from, to) {
        const star = this.getOrCreateFromStar(from);
        let sol = undefined;
        star.forEach((cur) => {
            if (cur.node == to) {
                sol = cur;
            }
        });
        return sol;
    }
    nodeIsManifold(v) {
        if (v.halfedge === undefined) {
            console.warn(`SurfaceBuilder: Warning, isolated vertex (${v.pos})`);
            return true;
        }
        return this.getOrCreateFromStar(v).length === v.degree;
    }
    splitNonManifoldNode(v) {
        if (this.nodeIsManifold(v)) {
            return false;
        }
        const star = new Set();
        this.getOrCreateFromStar(v).forEach((h) => star.add(h));
        // For the first wedge, reuse the vertex
        this.disconnectNode(v.halfedge.opposite, v, star);
        // There should be other wedges (else the vertex
        // would have been manifold)
        console.assert(star.size !== 0);
        // Create the vertices for the remaining wedges.
        while (star.size !== 0) {
            const new_v = this.copyNode(v);
            const h = star[0];
            this.disconnectNode(h, new_v, star);
        }
        return true;
    }
    disconnectNode(start_in, v, star) {
        let start = start_in;
        this.insertInStar(v);
        console.assert(star.has(start));
        while (!start.isBorder) {
            start = start.prev.opposite;
            if (start === start_in) {
                break;
            }
        }
        this.setNodeHalfedge(v, start.opposite);
        let cur = start;
        this.setHalfedgeNode(cur.opposite, v);
        this.getOrCreateFromStar(v).push(cur);
        // !!!
        star.delete(cur);
        while (!cur.opposite.isBorder) {
            cur = cur.opposite.next;
            if (cur === start) {
                break;
            }
            this.setHalfedgeNode(cur.opposite, v);
            // !!!
            star.delete(cur);
            this.getOrCreateFromStar(v).push(cur);
        }
        if (start.isBorder) {
            this.link(cur.opposite, start, 1);
        }
    }
    terminateSurface() {
        this.updateBorder(this.star_);
        // fix non-manifold vertices
        this.nodes_.forEach((node) => {
            if (this.splitNonManifoldNode(node)) {
                // output warning
            }
        });
        this.nodes_.forEach((node) => {
            this.deleteFromStarIfEmpty(node);
            // if (this.star_.get(node).length == 0) {
            //     this.deleteNode(node)
            // }
        });
        this.reindexNodes();
        this.reindexFacets();
    }
    // Update the border
    // private updateBorderNoArg() {
    //     // create the border halfedges, and setup the 'opposite' and
    //     // 'vertex' pointers.
    //     this.surface_.halfedges.forEach( h => {
    //         if(h.opposite === undefined) {
    //             const hh = this.newHalfedge()
    //             this.link(hh, h, 2)
    //             this.setHalfedgeNode(hh, h.prev.node) ;
    //         }
    //     })
    //     // setup the 'next' and 'prev' pointers of the border.
    //     this.surface_.halfedges.forEach( h => {
    //         if(h.facet === undefined) {
    //             let next = h.opposite
    //             while (next.facet !== undefined) {
    //                 next = next.prev.opposite
    //             }
    //             this.setHalfedgeNext(h, next)
    //             let prev = h.opposite
    //             while (prev.facet !== undefined) {
    //                 prev = prev.next.opposite
    //             }
    //             this.setHalfedgePrev(h, prev)
    //         }
    //     })
    // }
    updateBorder(star) {
        const tmp_list = [];
        this.surface_.halfedges.forEach((h) => {
            if (h.opposite === undefined) {
                tmp_list.push(h);
            }
        });
        if (tmp_list.length !== 0) {
            tmp_list.forEach((cur) => {
                const h = this.newHalfedge();
                this.link(h, cur, 2);
                this.setHalfedgeNode(h, cur.prev.node);
                // For fixing non-manifold vertices later on
                star.get(cur.node).push(h);
            });
        }
        // Link the border
        this.surface_.halfedges.forEach((cur) => {
            if (cur.facet === undefined) {
                let next = cur.opposite;
                while (next.facet !== undefined) {
                    next = next.prev.opposite;
                }
                this.setHalfedgeNext(cur, next);
                let prev = cur.opposite;
                while (prev.facet !== undefined) {
                    prev = prev.next.opposite;
                }
                this.setHalfedgePrev(cur, prev);
            }
        });
    }
}


/***/ }),

/***/ "./lib/he/SurfaceEditor.ts":
/*!*********************************!*\
  !*** ./lib/he/SurfaceEditor.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SurfaceEditor": () => (/* binding */ SurfaceEditor)
/* harmony export */ });
/* harmony import */ var _SurfaceBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SurfaceBuilder */ "./lib/he/SurfaceBuilder.ts");

/**
 * @category Halfedge
 */
class SurfaceEditor extends _SurfaceBuilder__WEBPACK_IMPORTED_MODULE_0__.SurfaceBuilder {
    constructor(mesh) {
        super();
        this.is_modified_ = false;
        this.setSurface(mesh);
    }
    beginModif() {
        this.is_modified_ = true;
    }
    endModif() {
        this.is_modified_ = false;
        this.reindexNodes();
        this.reindexFacets();
    }
    eraseFacet(facet) {
        console.assert(this.is_modified_);
        console.assert(facet !== undefined);
        let h = facet.halfedge;
        console.assert(!h.isBorder);
        const edges_to_delete = [];
        this.deleteFacet(h.facet);
        const end = h;
        do {
            this.setHalfedgeFacet(h, undefined);
            const g = h.next;
            const h_opp_on_border = h.opposite.isBorder;
            const g_opp_on_border = g.opposite.isBorder;
            if (h_opp_on_border) {
                if (g_opp_on_border) {
                    if (g.opposite.next == h.opposite) {
                        this.deleteNode(h.node);
                    }
                    else {
                        this.makeNodeKey(h.opposite.prev);
                        this.link(h.opposite.prev, g.opposite.next, 1);
                    }
                }
                edges_to_delete.push(h);
            }
            else {
                if (h.next.opposite.isBorder) {
                    this.link(h, h.next.opposite.next, 1);
                    this.makeNodeKey(h);
                }
                if (h.prev.opposite.isBorder) {
                    const prev = h.prev.opposite.prev;
                    this.link(prev, h, 1);
                    this.makeNodeKey(prev);
                }
            }
            h = g;
        } while (h !== end);
        edges_to_delete.forEach((edge) => this.deleteEdge(edge));
    }
    eraseNode(v) {
        console.assert(this.is_modified_);
        console.assert(v);
        console.assert(v.halfedge);
        const facets_to_delete = [];
        let e = v.halfedge;
        do {
            if (e.facet) {
                facets_to_delete.push(e.facet);
            }
            e = e.nextAroundNode;
        } while (e !== v.halfedge);
        facets_to_delete.forEach((facet) => this.eraseFacet(facet));
        return true;
    }
    /**
     * @returns undefined if failed, an halfedge of the new facet if succeed
     */
    collapse_node(v, triangulate = true) {
        console.assert(this.is_modified_);
        if (v.halfedge.opposite.isBorder && v.halfedge.next.opposite.isBorder) {
            return undefined;
        }
        {
            let b = undefined;
            let it = v.halfedge;
            do {
                if (it.isBorder) {
                    b = it;
                    break;
                }
                it = it.nextAroundNode;
            } while (it !== v.halfedge);
            if (b !== undefined) {
                if (b.prev == b.next) {
                    return undefined;
                }
                this.addFacetToBorder(b.prev, b.next);
            }
        }
        const h = v.halfedge.prev;
        let it = h;
        do {
            let jt = it.next;
            if (jt.node === v) {
                jt = jt.opposite.next;
                this.deleteEdge(it.next);
                this.deleteFacet(it.facet);
                this.link(it, jt, 1);
                this.makeNodeKey(it);
            }
            it = jt;
        } while (it !== h);
        this.setFacetOnOrbit(h, this.newFacet());
        this.makeFacetKey(h);
        this.deleteNode(v);
        // triangulate
        if (triangulate) {
            this.triangulateFacet(h);
        }
        return h;
    }
    addFacetToBorder(h, g) {
        console.assert(this.is_modified_);
        console.assert(h.isBorder);
        console.assert(g.isBorder);
        console.assert(h !== g);
        console.assert(this.halfedgesOnSameFacet(h, g));
        const h2 = h.next;
        const g2 = g.next;
        const n = this.newEdge();
        this.link(n, h2, 1);
        this.setHalfedgeNode(n, h.node);
        this.link(g, n, 1);
        this.setHalfedgeNode(n.opposite, g.node);
        this.link(h, n.opposite, 1);
        this.link(n.opposite, g2, 1);
        this.setFacetOnOrbit(n, this.newFacet());
        this.makeFacetKey(n);
        return n;
    }
    halfedgesOnSameFacet(h1, h2) {
        let it = h1;
        do {
            if (it == h2) {
                return true;
            }
            it = it.next;
        } while (it !== h1);
        return false;
    }
    // return true if the facet can be splited, false otherwise
    canSplitFacet(h, g) {
        if (h === g) {
            return false;
        }
        if (!this.halfedgesOnSameFacet(h, g)) {
            return false;
        }
        if (h.next === g || g.next === h) {
            return false;
        }
        return true;
    }
    /**
        Do the following operation:
    
        o----o      o----o
        |     \     |\    \
        |      o => | \    o
        |     /     |  \  /
        o----o      o----o
    */
    splitFacet(h, g) {
        console.assert(this.is_modified_);
        if (!this.canSplitFacet(h, g)) {
            return false;
        }
        const result = this.newEdge();
        this.link(result.opposite, g.next, 1);
        this.link(result, h.next, 1);
        this.link(g, result, 1);
        this.link(h, result.opposite, 1);
        this.setHalfedgeNode(result, h.node);
        this.setHalfedgeNode(result.opposite, g.node);
        this.makeFacetKey(result.opposite, h.facet);
        this.setFacetOnOrbit(result, this.newFacet());
        this.makeFacetKey(result);
        return true;
    }
    /**
     * Triangulate a facet using split_facet() (for non triangular facet)
     */
    triangulateFacet(start) {
        console.assert(this.is_modified_);
        let cur = start.next.next;
        while (cur.next != start) {
            this.splitFacet(start, cur);
            cur = cur.next.opposite.next;
        }
    }
    createCenterNode(f) {
        console.assert(this.is_modified_);
        const h = f.halfedge;
        const v = this.newNode();
        const p = f.barycenter;
        this.deleteFacet(f);
        let first = true;
        let it = h;
        do {
            const jt = it.next;
            const z = this.newEdge();
            this.link(it, z, 1);
            this.link(z.opposite, jt, 1);
            this.setHalfedgeNode(z, v);
            this.setHalfedgeNode(z.opposite, it.node);
            if (first) {
                first = false;
                this.makeNodeKey(z);
            }
            else {
                this.link(z, it.prev, 1);
                this.setFacetOnOrbit(it, this.newFacet());
                this.makeFacetKey(it);
            }
            it = jt;
        } while (it !== h);
        this.link(h.next, h.prev, 1);
        this.setFacetOnOrbit(h, this.newFacet());
        this.makeFacetKey(h);
        v.setPos(p);
        return v;
    }
    // =======================================================================================
    canSwitchEdge(e) {
        if (e.isBorder) {
            return false;
        }
        if (e.opposite.isBorder) {
            return false;
        }
        if (!e.facet) {
            return false;
        }
        if (!e.opposite.facet) {
            return false;
        }
        if (!e.facet.isTriangle) {
            return false;
        }
        if (!e.opposite.facet.isTriangle) {
            return false;
        }
        return true;
    }
    /**
        Do the following:
    
            o          o
        e1 /|\ e2o    / \
            / | \      /   \
        o  |  o => o-----o
            \ | /      \   /
        e2 \|/ e1o    \ /
            o          o
    */
    switchEdge(e0) {
        console.assert(this.is_modified_);
        if (!this.canSwitchEdge(e0)) {
            return false;
        }
        const e1 = e0.next;
        const e2 = e0.next.next;
        let e0_opp = e0.opposite;
        const e1_opp = e0_opp.next;
        const e2_opp = e0_opp.next.next;
        this.deleteFacet(e0.facet);
        this.deleteFacet(e0_opp.facet);
        this.deleteEdge(e0);
        e0 = this.newHalfedge();
        e0_opp = this.newHalfedge();
        this.link(e0, e0_opp, 2);
        this.setHalfedgeNode(e0, e1.node);
        this.setHalfedgeNode(e0_opp, e1_opp.node);
        this.link(e0, e2, 1);
        this.link(e2, e1_opp, 1);
        this.link(e1_opp, e0, 1);
        this.makeNodeKey(e0);
        this.makeNodeKey(e2);
        this.makeNodeKey(e1_opp);
        this.setFacetOnOrbit(e0, this.newFacet());
        this.makeFacetKey(e0);
        this.link(e0_opp, e2_opp, 1);
        this.link(e2_opp, e1, 1);
        this.link(e1, e0_opp, 1);
        this.makeNodeKey(e2_opp);
        this.setFacetOnOrbit(e0_opp, this.newFacet());
        this.makeFacetKey(e0_opp);
        return true;
    }
    fillHole(h, triangulate) {
        console.assert(this.is_modified_);
        if (!h.isBorder) {
            return undefined;
        }
        const facet = this.newFacet();
        this.setFacetOnOrbit(h, facet);
        this.makeFacetKey(h);
        if (triangulate) {
            this.triangulateFacet(h);
        }
        return h;
    }
    makePolygon(nb) {
        console.assert(this.is_modified_);
        let first = undefined;
        let cur = undefined;
        for (let i = 0; i < nb; i++) {
            if (first === undefined) {
                first = this.newEdge();
                cur = first;
                this.makeFacetKey(cur, this.newFacet());
            }
            else {
                this.link(cur, this.newEdge(), 1);
                this.link(cur.next.opposite, cur.opposite, 1);
                this.setHalfedgeFacet(cur.next, cur.facet);
                this.setHalfedgeNode(cur.next.opposite, cur.node);
                cur = cur ? cur.next : undefined;
            }
            this.makeNodeKey(cur, this.newNode());
        }
        this.link(cur, first, 1);
        this.link(first.opposite, cur.opposite, 1);
        this.setHalfedgeNode(first.opposite, cur.node);
        return first;
    }
    makeTriangle(p1, p2, p3) {
        console.assert(this.is_modified_);
        if (p1 === undefined) {
            return this.makePolygon(3);
        }
        console.assert(p2 !== undefined);
        console.assert(p3 !== undefined);
        if (Array.isArray(p1)) {
            const result = this.makeTriangle();
            result.node.setPos(p1);
            result.next.node.setPos(p2);
            result.next.next.node.setPos(p3);
            return result;
        }
        let first = undefined;
        let cur = undefined;
        const v = Array(3).fill(undefined);
        v[0] = p1;
        v[1] = p2;
        v[2] = p3;
        for (let i = 0; i < 3; i++) {
            if (first === undefined) {
                first = this.newEdge();
                cur = first;
                this.makeFacetKey(cur, this.newFacet());
            }
            else {
                this.link(cur, this.newEdge(), 1);
                this.link(cur.next.opposite, cur.opposite, 1);
                this.setHalfedgeFacet(cur.next, cur.facet);
                this.setHalfedgeNode(cur.next.opposite, cur.node);
                if (cur) {
                    cur = cur.next;
                }
                else {
                    throw new Error('cur is undefined');
                }
            }
            this.makeNodeKey(cur, v[i]);
        }
        this.link(cur, first, 1);
        this.link(first.opposite, cur.opposite, 1);
        this.setHalfedgeNode(first.opposite, cur.node);
        return first;
    }
    halfedgeBetween(v1, v2) {
        let cir = v2.halfedge;
        do {
            if (cir.opposite.node == v1) {
                return cir;
            }
            cir = cir.nextAroundNode;
        } while (cir !== v2.halfedge);
        return undefined;
    }
    swapNode(v1, v2) {
        const v = v1;
        v1 = v2;
        v2 = v;
    }
    createFacet(v1, v2, v3) {
        console.assert(this.is_modified_);
        const e12 = this.halfedgeBetween(v1, v2);
        const e23 = this.halfedgeBetween(v2, v3);
        const e31 = this.halfedgeBetween(v3, v1);
        if (e12 !== undefined && e12.node === v2) {
            this.swapNode(v1, v2);
        }
        if (e23 !== undefined && e23.node === v3) {
            this.swapNode(v2, v3);
        }
        if (e31 !== undefined && e31.node === v1) {
            this.swapNode(v3, v1);
        }
        const e = this.makeTriangle(v1, v2, v3);
        if (e12) {
            this.glue(e12.isBorder ? e12 : e12.opposite, e.next.isBorder ? e.next : e.next.opposite);
        }
        if (e23) {
            this.glue(e23.isBorder ? e23 : e23.opposite, e.next.next.isBorder ? e.next.next : e.next.next.opposite);
        }
        if (e31) {
            this.glue(e31.isBorder ? e31 : e31.opposite, e.isBorder ? e : e.opposite);
        }
        return true;
    }
    canGlue(h0, h1) {
        if (!h0.isBorder) {
            return false;
        }
        if (!h1.isBorder) {
            return false;
        }
        if (h0.opposite.facet == h1.opposite.facet) {
            return false;
        }
        if (this.halfedgeExistsBetweenNodes(h0.node, h1.opposite.node) ||
            this.halfedgeExistsBetweenNodes(h1.node, h0.opposite.node)) {
            return false;
        }
        if (!this.canMergeNodes(h0, h1.opposite) ||
            !this.canMergeNodes(h1, h0.opposite)) {
            return false;
        }
        return true;
    }
    barycenter(p1, p2) {
        return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];
    }
    glue(h0, h1) {
        console.assert(this.is_modified_);
        if (!this.canGlue(h0, h1)) {
            return false;
        }
        const new_p0 = this.barycenter(h0.node.pos, h1.opposite.node.pos);
        const new_p1 = this.barycenter(h1.node.pos, h0.opposite.node.pos);
        // merge vertices if necessary
        const dest0 = h0.node;
        const dest1 = h1.node;
        const org0 = h0.opposite.node;
        const org1 = h1.opposite.node;
        if (org0 != dest1) {
            this.setNodeOnOrbit(h1, org0);
            this.deleteNode(dest1);
        }
        if (org1 != dest0) {
            this.setNodeOnOrbit(h0, org1);
            this.deleteNode(dest0);
        }
        this.link(h1.prev, h0.next, 1);
        this.link(h0.prev, h1.next, 1);
        this.link(h0.opposite, h1.opposite, 2);
        this.makeNodeKey(h0.opposite);
        this.makeNodeKey(h1.opposite);
        org1.setPos(new_p0);
        org0.setPos(new_p1);
        this.deleteHalfedge(h0);
        this.deleteHalfedge(h1);
        return true;
    }
    canMergeNodes(h0, h1) {
        if (h0.node === h1.node) {
            return true;
        }
        return (this.orbitsAreCompatible(h0, h1) && this.orbitsAreCompatible(h1, h0));
    }
    halfedgeExistsBetweenNodes(v1, v2) {
        let cir = v1.halfedge;
        do {
            if (cir.opposite.node == v2) {
                return true;
            }
            cir = cir.nextAroundNode;
        } while (cir !== v1.halfedge);
        return false;
    }
    orbitsAreCompatible(h0, h1) {
        let cir_h0 = h0;
        do {
            // Number of potential opposites half_edges
            // (should not be greater than 1)
            let nb_common = 0;
            const hh0 = cir_h0.opposite;
            let cir_h1 = h1;
            do {
                const hh1 = cir_h1.opposite;
                if (hh0.node === hh1.node ||
                    (hh0.node === h0.opposite.node &&
                        hh1.node === h1.opposite.node) ||
                    (hh0.node === h1.opposite.node &&
                        hh1.node === h0.opposite.node)) {
                    if ((hh0.opposite.isBorder && hh1.isBorder) ||
                        (hh0.isBorder && hh1.opposite.isBorder)) {
                        // Found a potential opposite edge.
                        nb_common++;
                    }
                    else {
                        // Potential opposite edge not on the border.
                        return false;
                    }
                }
                cir_h1 = cir_h1.nextAroundNode;
            } while (cir_h1 !== h1);
            if (nb_common > 1) {
                return false;
            }
            cir_h0 = cir_h0.nextAroundNode;
        } while (cir_h0 !== h0);
        return true;
    }
    canUnglue(h) {
        if (h.isBorderEdge) {
            return false;
        }
        return h.node.isOnBorder || h.opposite.node.isOnBorder;
    }
    unglue(h0, check) {
        console.assert(this.is_modified_);
        if (check && !this.canUnglue(h0)) {
            return false;
        }
        if (h0.isBorderEdge) {
            return false;
        }
        const h1 = h0.opposite;
        const v0 = h0.node;
        const v1 = h1.node;
        const v0_on_border = v0.isOnBorder;
        const v1_on_border = v1.isOnBorder;
        console.assert(!check || v0_on_border || v1_on_border);
        const n0 = this.newEdge();
        const n1 = n0.opposite;
        this.link(h0, n0, 2);
        this.link(h1, n1, 2);
        // If v1 is on the border, find the predecessor and
        // the successor of the newly created edges, and
        // split v1 into two vertices.
        if (v1_on_border) {
            let next0 = h0.prev.opposite;
            while (!next0.isBorder) {
                next0 = next0.prev.opposite;
            }
            console.assert(next0 != h0);
            let prev1 = h1.next.opposite;
            while (!prev1.isBorder) {
                prev1 = prev1.next.opposite;
            }
            console.assert(prev1 != h1);
            console.assert(prev1.node == v1);
            console.assert(prev1.next == next0);
            this.link(n0, next0, 1);
            this.link(prev1, n1, 1);
            this.setNodeOnOrbit(n0, this.newNode(v1));
            this.makeNodeKey(n0);
            this.makeNodeKey(h1);
        }
        else {
            this.setHalfedgeNode(n0, v1);
        }
        // If v0 is on the border, find the predecessor and
        // the successor of the newly created edges, and
        // split v0 into two vertices.
        if (v0_on_border) {
            let prev0 = h0.next.opposite;
            while (!prev0.isBorder) {
                prev0 = prev0.next.opposite;
            }
            console.assert(prev0 != h0);
            let next1 = h1.prev.opposite;
            while (!next1.isBorder) {
                next1 = next1.prev.opposite;
            }
            console.assert(next1 != h1);
            console.assert(prev0.next == next1);
            this.link(prev0, n0, 1);
            this.link(n1, next1, 1);
            this.setNodeOnOrbit(n1, this.newNode(v0));
            this.makeNodeKey(n1);
            this.makeNodeKey(h0);
        }
        else {
            this.setHalfedgeNode(n1, v0);
        }
        return true;
    }
    flipNormals() {
        console.assert(this.is_modified_);
        this.surface_.facets.forEach((facet) => {
            this.flipNormal(facet.halfedge);
        });
        this.surface_.halfedges.forEach((h) => {
            if (h.isBorder && h.node === h.opposite.node) {
                this.flipNormal(h);
            }
        });
    }
    flipNormal(first) {
        console.assert(this.is_modified_);
        if (first === undefined) {
            return;
        }
        const last = first;
        let prev = first;
        const start = first;
        first = first.next;
        let new_v = start.node;
        while (first !== last) {
            const tmp_v = first.node;
            this.setHalfedgeNode(first, new_v);
            this.setNodeHalfedge(first.node, first);
            new_v = tmp_v;
            const next = first.next;
            this.setHalfedgeNext(first, prev);
            this.setHalfedgePrev(first, next);
            prev = first;
            first = next;
        }
        this.setHalfedgeNode(start, new_v);
        this.setNodeHalfedge(start.node, start);
        const next = start.next;
        this.setHalfedgeNext(start, prev);
        this.setHalfedgePrev(start, next);
    }
    zipEdge(src) {
        console.assert(this.is_modified_);
        let h1 = undefined;
        let h2 = undefined;
        let it = src.halfedge;
        do {
            if (it.isBorder) {
                if (h1 === undefined) {
                    h1 = it;
                }
                else {
                    h2 = it;
                }
            }
            if (it.opposite.isBorder) {
                if (h1 === undefined) {
                    h1 = it.opposite;
                }
                else {
                    h2 = it.opposite;
                }
            }
            it = it.nextAroundNode;
        } while (it !== src.halfedge);
        if (h1 !== undefined && h2 !== undefined) {
            this.glue(h1, h2);
        }
        return true;
    }
}


/***/ }),

/***/ "./lib/he/action.ts":
/*!**************************!*\
  !*** ./lib/he/action.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* binding */ Action),
/* harmony export */   "FunctionAction": () => (/* binding */ FunctionAction),
/* harmony export */   "MacroAction": () => (/* binding */ MacroAction),
/* harmony export */   "ActionPool": () => (/* binding */ ActionPool)
/* harmony export */ });
/* harmony import */ var _Stack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Stack */ "./lib/he/Stack.ts");

/**
 * @brief Base class for all actions. Note that it is not mandatory to use this class
 * to define an action (see ActionPool.execute())
 * @see ActionPool
 * @category Actions
 */
class Action {
    constructor(name) {
        this._valid = true;
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(n) {
        this._name = n;
    }
    get valid() {
        return this._valid;
    }
    set valid(v) {
        this._valid = v;
    }
}
/**
 * @brief Allow to build an Action from 2 functions or lambdas (do and undo)
 * @category Actions
 */
class FunctionAction extends Action {
    constructor(do_, undo_, name = 'function-action') {
        super(name);
        this._do = undefined;
        this._undo = undefined;
        this._do = do_;
        this._undo = undo_;
    }
    do() {
        this._do();
    }
    undo() {
        this._undo();
    }
}
/**
 * @brief A macro action is an ordered group of actions that can be undone and
 * redone all in one go.
 * @category Actions
 */
class MacroAction extends Action {
    constructor(name = 'macro-action') {
        super(name);
        this._actions = [];
    }
    register(do_, undo_) {
        if (do_ instanceof Action) {
            if (do_.valid === true) {
                this._actions.push(do_);
            }
        }
        else {
            console.assert(undo_ !== undefined);
            this._actions.push(new FunctionAction(do_, undo_));
        }
    }
    do() {
        this._actions.forEach((action) => action.do());
    }
    undo() {
        this._actions.reverse().forEach((action) => action.undo());
        this._actions.reverse();
    }
}
/**
 * @brief A Pool of actions for undo/redo purpose
 * @category Actions
 */
class ActionPool {
    constructor(size = 10) {
        this._undo = new _Stack__WEBPACK_IMPORTED_MODULE_0__.Stack();
        this._do = new _Stack__WEBPACK_IMPORTED_MODULE_0__.Stack();
        this._size = 10;
        this._size = size;
    }
    /**
     * Register and execute an action.
     * @note Only valid actions are registered in the pool (and then executed of couse).
     * @param do_ Can be either a function (or lambda) or an Action
     * @param undo_ If do_ is an Action, undo_ is irrelevant.
     */
    execute(do_, undo_, name) {
        let act = undefined;
        if (do_ instanceof Action) {
            if (do_.valid === false) {
                return false;
            }
            act = do_;
        }
        else {
            console.assert(undo_ !== undefined);
            act = new FunctionAction(do_, undo_, name);
        }
        this._do.push(act);
        act.do();
        if (this._do.count > this._size) {
            this._do.shift();
        }
        if (this._undo.count !== 0) {
            this._undo.clear();
        }
        return true;
    }
    undo(n = 1) {
        for (let i = 0; i < n; ++i) {
            this.__undo();
        }
    }
    redo(n = 1) {
        for (let i = 0; i < n; ++i) {
            this.__redo();
        }
    }
    clear() {
        this._do.clear();
        this._undo.clear();
    }
    get maxSize() {
        return this._size;
    }
    set maxSize(s) {
        this._size = s;
    }
    get undoActionNames() {
        return this._do.map((a) => a.name).reverse();
    }
    get redoActionNames() {
        return this._undo.map((a) => a.name).reverse();
    }
    __undo() {
        if (this._do.count === 0) {
            return undefined;
        }
        const act = this._do.last;
        this._do.pop();
        act.undo();
        this._undo.push(act);
        // Check the stack size limit
        if (this._undo.count > this._size) {
            this._undo.shift();
        }
        return act;
    }
    __redo() {
        if (this._undo.count === 0) {
            return undefined;
        }
        const act = this._undo.last;
        this._undo.pop();
        act.do();
        this._do.push(act);
        // Check the stack size limit
        if (this._do.count > this._size) {
            this._do.shift();
        }
        return act;
    }
}


/***/ }),

/***/ "./lib/he/combels.ts":
/*!***************************!*\
  !*** ./lib/he/combels.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Node": () => (/* binding */ Node),
/* harmony export */   "Facet": () => (/* binding */ Facet),
/* harmony export */   "Halfedge": () => (/* binding */ Halfedge)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./lib/he/helpers.ts");

/**
 * @category Halfedge
 */
class Node {
    constructor() {
        this.pos_ = [0, 0, 0];
        this.id_ = -1;
        this.he_ = undefined;
    }
    setPos(x, y, z) {
        if (Array.isArray(x)) {
            this.pos_[0] = x[0];
            this.pos_[1] = x[1];
            this.pos_[2] = x[2];
        }
        else {
            this.pos_[0] = x;
            this.pos_[1] = y;
            this.pos_[2] = z !== undefined ? z : 0;
        }
    }
    setId(i) {
        this.id_ = i;
    }
    get posVec3() {
        return this.pos_;
    }
    get pos() {
        return this.pos_;
    }
    get id() {
        return this.id_;
    }
    get halfedge() {
        return this.he_;
    }
    get isOnBorder() {
        let it = this.he_;
        if (it === undefined) {
            return true;
        }
        do {
            if (it.isBorder) {
                return true;
            }
            it = it.nextAroundNode;
        } while (it !== this.he_);
        return false;
    }
    get degree() {
        let it = this.he_;
        if (it === undefined) {
            return 0;
        }
        let result = 0;
        do {
            result++;
            it = it.nextAroundNode;
        } while (it !== this.he_);
        return result;
    }
    setHalfedge(h) {
        this.he_ = h;
    }
}
/**
 * @category Halfedge
 */
class Facet {
    constructor() {
        this.halfedge_ = undefined;
        this.id_ = -1;
    }
    get halfedge() {
        return this.halfedge_;
    }
    get degree() {
        let result = 0;
        let it = this.halfedge_;
        do {
            result++;
            it = it.next;
        } while (it !== this.halfedge_);
        return result;
    }
    get nbEdges() {
        return this.degree;
    }
    get nbNodes() {
        return this.degree;
    }
    get isOnBorder() {
        let it = this.halfedge_;
        do {
            if (it.opposite.isBorder) {
                return true;
            }
            it = it.next;
        } while (it !== this.halfedge_);
        return false;
    }
    get barycenter() {
        let pos = [0, 0, 0];
        let h = this.halfedge_;
        let nb = 0;
        do {
            const p = h.node.pos;
            pos = pos.map((coord, i) => coord + p[i]);
            h = h.next;
            ++nb;
        } while (h !== this.halfedge_);
        pos = pos.map((coord) => coord / nb);
        return pos;
    }
    get isTriangle() {
        return this.halfedge_.next.next.next === this.halfedge_;
    }
    get id() {
        return this.id_;
    }
    get opposite() {
        return this.halfedge_.opposite.facet;
    }
    setId(i) {
        this.id_ = i;
    }
    setHalfedge(h) {
        this.halfedge_ = h;
    }
    get nodes() {
        const ns = [];
        let h = this.halfedge_;
        do {
            ns.push(h.node);
            h = h.next;
        } while (h !== this.halfedge_);
        return ns;
    }
    get nodeIds() {
        const ns = [];
        let h = this.halfedge_;
        do {
            ns.push(h.node.id);
            h = h.next;
        } while (h !== this.halfedge_);
        return ns;
    }
    get area() {
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.facetArea)(this);
    }
    get normal() {
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.facetNormal)(this);
    }
}
/**
 * An halfedge is made of a end-point node, and support a facet or
 * none if on border.
 *
 * @category Halfedge
 */
class Halfedge {
    constructor() {
        this.node_ = undefined;
        this.opposite_ = undefined;
        this.next_ = undefined;
        this.prev_ = undefined;
        this.facet_ = undefined;
    }
    get opposite() {
        return this.opposite_;
    }
    get next() {
        return this.next_;
    }
    get prev() {
        return this.prev_;
    }
    get facet() {
        return this.facet_;
    }
    get node() {
        return this.node_;
    } // The end node
    get length() {
        const a = this.node.pos;
        const b = this.prev.node.pos;
        const u = [0, 0, 0];
        for (let i = 0; i < 3; ++i) {
            u[i] = a[i] - b[i];
        }
        return Math.sqrt(u[0] ** 2 + u[1] ** 2 + u[2] ** 2);
    }
    get nextAroundNode() {
        return this.opposite.prev;
    }
    get prevAroundNode() {
        return this.next.opposite;
    }
    get isBorder() {
        return this.facet_ === undefined;
    }
    get isBorderEdge() {
        return this.isBorder || this.opposite.isBorder;
    }
    //get nextOnBorder() ;
    //get prevOnBorder() ;
    setOpposite(h) {
        this.opposite_ = h;
    }
    setNext(h) {
        this.next_ = h;
    }
    setPrev(h) {
        this.prev_ = h;
    }
    setFacet(f) {
        this.facet_ = f;
    }
    setNode(n) {
        this.node_ = n;
    }
}


/***/ }),

/***/ "./lib/he/heActions.ts":
/*!*****************************!*\
  !*** ./lib/he/heActions.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MoveNodeAction": () => (/* binding */ MoveNodeAction),
/* harmony export */   "FillHoleAction": () => (/* binding */ FillHoleAction)
/* harmony export */ });
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action */ "./lib/he/action.ts");
/* harmony import */ var _SurfaceEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SurfaceEditor */ "./lib/he/SurfaceEditor.ts");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./observer */ "./lib/he/observer.ts");



/**
 * @category Halfedge
 */
class MoveNodeAction extends _action__WEBPACK_IMPORTED_MODULE_0__.Action {
    constructor(n, translation) {
        super('Move node');
        this.n = n;
        this.translation = translation;
        this.node = undefined;
        if (n === undefined) {
            this.valid = false;
        }
        this.node = n;
    }
    do() {
        const newPos = this.node.pos.map((x, i) => x + this.translation[i]);
        this.node.setPos(newPos);
    }
    undo() {
        const newPos = this.node.pos.map((x, i) => x - this.translation[i]);
        this.node.setPos(newPos);
    }
}
// -------------------------------------------------------------
/**
 * @category Halfedge
 */
class FacetRemovedObserver extends _observer__WEBPACK_IMPORTED_MODULE_2__.CombelObserver {
    constructor() {
        super(...arguments);
        this.facets = [];
    }
    notifiedRemove(f) {
        this.facets.push(f);
    }
    clear() {
        this.facets = [];
    }
}
// This one is a little more complex, but not the most complex
/**
 * @category Halfedge
 */
class FillHoleAction extends _action__WEBPACK_IMPORTED_MODULE_0__.Action {
    constructor(surface, h) {
        super('Fill hole');
        this.surface = surface;
        this.h = h;
        this.edt = undefined;
        this.observer = new FacetRemovedObserver();
        this.edt = new _SurfaceEditor__WEBPACK_IMPORTED_MODULE_1__.SurfaceEditor(surface);
        if (h === undefined || h.isBorder === false) {
            this.valid = false;
        }
    }
    do() {
        this.observer.clear();
        this.edt.registerFacetObserser(this.observer);
        this.edt.beginModif();
        this.edt.fillHole(this.h, true);
        this.edt.endModif();
        this.edt.unregisterFacetObserser(this.observer);
    }
    undo() {
        this.edt.beginModif();
        this.observer.facets.forEach((f) => this.edt.deleteFacet(f));
        this.edt.endModif();
    }
}
// -------------------------------------------------------------


/***/ }),

/***/ "./lib/he/helpers.ts":
/*!***************************!*\
  !*** ./lib/he/helpers.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "triangleArea": () => (/* binding */ triangleArea),
/* harmony export */   "triangleNormal": () => (/* binding */ triangleNormal),
/* harmony export */   "facetArea": () => (/* binding */ facetArea),
/* harmony export */   "facetNormal": () => (/* binding */ facetNormal)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);

/**
 * @category Halfedge
 */
function triangleArea(v1, v2, v3) {
    return (_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.norm(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.cross(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(v1, v2), _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(v1, v3))) * 0.5);
}
function triangleNormal(v1, v2, v3) {
    const V = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(v3, v2);
    const W = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(v1, v2);
    //console.log(v1, v2, v3, vec.cross(V, W))
    return _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.normalize(_youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.cross(V, W));
    // return vec.normalize( vec.cross( vec.create(v1,v2) as vec.Vector3, vec.create(v1,v3) as vec.Vector3 ) )
}
/**
 * @see Facet.area
 *
 * @category Halfedge
 */
function facetArea(f) {
    let result = 0;
    let h = f.halfedge;
    const p = h.node.pos;
    h = h.next;
    do {
        result += triangleArea(p, h.node.pos, h.next.node.pos);
        h = h.next;
    } while (h !== f.halfedge);
    return result;
}
/**
 * @see Facet.area
 *
 * @category Halfedge
 */
function facetNormal(f) {
    let result = [0, 0, 0];
    let h = f.halfedge;
    const p = h.node.pos;
    h = h.next;
    do {
        const r = triangleNormal(p, h.node.pos, h.next.node.pos);
        if (!Number.isNaN(r[0])) {
            result = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.add(result, r);
        }
        h = h.next;
    } while (h !== f.halfedge);
    return _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.normalize(result);
}


/***/ }),

/***/ "./lib/he/index.ts":
/*!*************************!*\
  !*** ./lib/he/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Facet": () => (/* reexport safe */ _combels__WEBPACK_IMPORTED_MODULE_0__.Facet),
/* harmony export */   "Halfedge": () => (/* reexport safe */ _combels__WEBPACK_IMPORTED_MODULE_0__.Halfedge),
/* harmony export */   "Node": () => (/* reexport safe */ _combels__WEBPACK_IMPORTED_MODULE_0__.Node),
/* harmony export */   "Surface": () => (/* reexport safe */ _Surface__WEBPACK_IMPORTED_MODULE_1__.Surface),
/* harmony export */   "facetsAroundNode": () => (/* reexport safe */ _iterators__WEBPACK_IMPORTED_MODULE_2__.facetsAroundNode),
/* harmony export */   "nodesAroundHalfedge": () => (/* reexport safe */ _iterators__WEBPACK_IMPORTED_MODULE_2__.nodesAroundHalfedge),
/* harmony export */   "nodesAroundNode": () => (/* reexport safe */ _iterators__WEBPACK_IMPORTED_MODULE_2__.nodesAroundNode),
/* harmony export */   "SurfaceBuilder": () => (/* reexport safe */ _SurfaceBuilder__WEBPACK_IMPORTED_MODULE_3__.SurfaceBuilder),
/* harmony export */   "SurfaceEditor": () => (/* reexport safe */ _SurfaceEditor__WEBPACK_IMPORTED_MODULE_4__.SurfaceEditor),
/* harmony export */   "facetArea": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_5__.facetArea),
/* harmony export */   "facetNormal": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_5__.facetNormal),
/* harmony export */   "triangleArea": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_5__.triangleArea),
/* harmony export */   "triangleNormal": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_5__.triangleNormal),
/* harmony export */   "Action": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_6__.Action),
/* harmony export */   "ActionPool": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_6__.ActionPool),
/* harmony export */   "FunctionAction": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_6__.FunctionAction),
/* harmony export */   "MacroAction": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_6__.MacroAction),
/* harmony export */   "FillHoleAction": () => (/* reexport safe */ _heActions__WEBPACK_IMPORTED_MODULE_7__.FillHoleAction),
/* harmony export */   "MoveNodeAction": () => (/* reexport safe */ _heActions__WEBPACK_IMPORTED_MODULE_7__.MoveNodeAction)
/* harmony export */ });
/* harmony import */ var _combels__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./combels */ "./lib/he/combels.ts");
/* harmony import */ var _Surface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Surface */ "./lib/he/Surface.ts");
/* harmony import */ var _iterators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./iterators */ "./lib/he/iterators.ts");
/* harmony import */ var _SurfaceBuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SurfaceBuilder */ "./lib/he/SurfaceBuilder.ts");
/* harmony import */ var _SurfaceEditor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SurfaceEditor */ "./lib/he/SurfaceEditor.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers */ "./lib/he/helpers.ts");
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./action */ "./lib/he/action.ts");
/* harmony import */ var _heActions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./heActions */ "./lib/he/heActions.ts");










/***/ }),

/***/ "./lib/he/iterators.ts":
/*!*****************************!*\
  !*** ./lib/he/iterators.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nodesAroundNode": () => (/* binding */ nodesAroundNode),
/* harmony export */   "nodesAroundHalfedge": () => (/* binding */ nodesAroundHalfedge),
/* harmony export */   "facetsAroundNode": () => (/* binding */ facetsAroundNode)
/* harmony export */ });
/**
 * Loop over all nodes around a node
 */
function nodesAroundNode(node, cb) {
    let cir = node.halfedge;
    let i = 0;
    do {
        const n = cir.opposite.node;
        cb(n, i++);
        cir = cir.nextAroundNode;
    } while (cir !== node.halfedge);
}
/**
 * Loop over all nodes around an halfedge
 */
function nodesAroundHalfedge(edge, cb) {
    let cir = edge;
    let i = 0;
    do {
        const e = cir.opposite.node;
        cb(e, i++);
        cir = cir.nextAroundNode;
    } while (cir !== edge);
}
/**
 * Loop over all facets around a node
 */
function facetsAroundNode(node, cb) {
    let cir = node.halfedge;
    let i = 0;
    do {
        const facet = cir.facet;
        cb(facet, i++);
        cir = cir.nextAroundNode;
    } while (cir !== node.halfedge);
}


/***/ }),

/***/ "./lib/he/observer.ts":
/*!****************************!*\
  !*** ./lib/he/observer.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CombelObserver": () => (/* binding */ CombelObserver),
/* harmony export */   "CombelObservable": () => (/* binding */ CombelObservable)
/* harmony export */ });
// TODO: remove this class
/**
 * @category Halfedge
 */
class CombelObserver {
    notifiedRemove(_c) {
        /* filled by derived classes */
    }
}
// TODO: replace registerObserver/unregisterObserver argument by a function
/**
 * @category Halfedge
 */
class CombelObservable {
    constructor() {
        this.list_ = [];
    }
    registerObserver(c) {
        this.list_.push(c);
    }
    unregisterObserver(c) {
        const index = this.list_.indexOf(c);
        if (index > -1) {
            this.list_.splice(index, 1);
        }
    }
    notifyRemove(c) {
        this.list_.forEach((item) => item.notifiedRemove(c));
    }
}


/***/ }),

/***/ "./lib/index.ts":
/*!**********************!*\
  !*** ./lib/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BBox": () => (/* reexport safe */ _bbox__WEBPACK_IMPORTED_MODULE_0__.BBox),
/* harmony export */   "inflateBBox": () => (/* reexport safe */ _bbox__WEBPACK_IMPORTED_MODULE_0__.inflateBBox),
/* harmony export */   "TriangleCSys": () => (/* reexport safe */ _plane__WEBPACK_IMPORTED_MODULE_1__.TriangleCSys),
/* harmony export */   "distanceFromPointToPlane": () => (/* reexport safe */ _plane__WEBPACK_IMPORTED_MODULE_1__.distanceFromPointToPlane),
/* harmony export */   "fittingPlane": () => (/* reexport safe */ _plane__WEBPACK_IMPORTED_MODULE_1__.fittingPlane),
/* harmony export */   "project": () => (/* reexport safe */ _plane__WEBPACK_IMPORTED_MODULE_1__.project),
/* harmony export */   "vectorFromPointsToPlane": () => (/* reexport safe */ _plane__WEBPACK_IMPORTED_MODULE_1__.vectorFromPointsToPlane),
/* harmony export */   "triangulate": () => (/* reexport safe */ _triangulate__WEBPACK_IMPORTED_MODULE_2__.triangulate),
/* harmony export */   "generateEllipse": () => (/* reexport safe */ _generate__WEBPACK_IMPORTED_MODULE_3__.generateEllipse),
/* harmony export */   "generateRectangle": () => (/* reexport safe */ _generate__WEBPACK_IMPORTED_MODULE_3__.generateRectangle),
/* harmony export */   "simplify": () => (/* reexport safe */ _simplify__WEBPACK_IMPORTED_MODULE_4__.simplify),
/* harmony export */   "generateSphere": () => (/* reexport safe */ _generateSphere__WEBPACK_IMPORTED_MODULE_5__.generateSphere),
/* harmony export */   "Grid2DHelper": () => (/* reexport safe */ _grid2DHelper__WEBPACK_IMPORTED_MODULE_6__.Grid2DHelper),
/* harmony export */   "Grid3DHelper": () => (/* reexport safe */ _grid3DHelper__WEBPACK_IMPORTED_MODULE_7__.Grid3DHelper),
/* harmony export */   "BackgroundGrid2D": () => (/* reexport safe */ _background2DGrid__WEBPACK_IMPORTED_MODULE_8__.BackgroundGrid2D),
/* harmony export */   "createBackgroundGrid2D": () => (/* reexport safe */ _background2DGrid__WEBPACK_IMPORTED_MODULE_8__.createBackgroundGrid2D),
/* harmony export */   "relaxMesh": () => (/* reexport safe */ _relaxMesh__WEBPACK_IMPORTED_MODULE_9__.relaxMesh),
/* harmony export */   "MarchingCubes": () => (/* reexport safe */ _MarchingCubes__WEBPACK_IMPORTED_MODULE_11__.MarchingCubes),
/* harmony export */   "InterpolateSerieFromCsysOnSurface": () => (/* reexport safe */ _InterpolateSerie__WEBPACK_IMPORTED_MODULE_12__.InterpolateSerieFromCsysOnSurface),
/* harmony export */   "reverseNormals": () => (/* reexport safe */ _reverseNormals__WEBPACK_IMPORTED_MODULE_13__.reverseNormals),
/* harmony export */   "extractSurfaceBorders": () => (/* reexport safe */ _extractSurfaceBorder__WEBPACK_IMPORTED_MODULE_14__.extractSurfaceBorders),
/* harmony export */   "generatePointInPolygon": () => (/* reexport safe */ _pointInPolygon__WEBPACK_IMPORTED_MODULE_15__.generatePointInPolygon),
/* harmony export */   "pointInPolygon": () => (/* reexport safe */ _pointInPolygon__WEBPACK_IMPORTED_MODULE_15__.pointInPolygon),
/* harmony export */   "InterpolateInGrid2D": () => (/* reexport safe */ _InterpolateInGrid2D__WEBPACK_IMPORTED_MODULE_16__.InterpolateInGrid2D),
/* harmony export */   "HarmonicDiffusion": () => (/* reexport safe */ _HarmonicDiffusion__WEBPACK_IMPORTED_MODULE_17__.HarmonicDiffusion),
/* harmony export */   "AnglesToNormal": () => (/* reexport safe */ _AnglesToNormal__WEBPACK_IMPORTED_MODULE_18__.AnglesToNormal),
/* harmony export */   "intersectTriangle": () => (/* reexport safe */ _intersection__WEBPACK_IMPORTED_MODULE_19__.intersectTriangle),
/* harmony export */   "Action": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.Action),
/* harmony export */   "ActionPool": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.ActionPool),
/* harmony export */   "Facet": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.Facet),
/* harmony export */   "FillHoleAction": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.FillHoleAction),
/* harmony export */   "FunctionAction": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.FunctionAction),
/* harmony export */   "Halfedge": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.Halfedge),
/* harmony export */   "MacroAction": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.MacroAction),
/* harmony export */   "MoveNodeAction": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.MoveNodeAction),
/* harmony export */   "Node": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.Node),
/* harmony export */   "Surface": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.Surface),
/* harmony export */   "SurfaceBuilder": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.SurfaceBuilder),
/* harmony export */   "SurfaceEditor": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.SurfaceEditor),
/* harmony export */   "facetArea": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.facetArea),
/* harmony export */   "facetNormal": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.facetNormal),
/* harmony export */   "facetsAroundNode": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.facetsAroundNode),
/* harmony export */   "nodesAroundHalfedge": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.nodesAroundHalfedge),
/* harmony export */   "nodesAroundNode": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.nodesAroundNode),
/* harmony export */   "triangleArea": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.triangleArea),
/* harmony export */   "triangleNormal": () => (/* reexport safe */ _he__WEBPACK_IMPORTED_MODULE_20__.triangleNormal),
/* harmony export */   "extrude": () => (/* reexport safe */ _extrude__WEBPACK_IMPORTED_MODULE_21__.extrude),
/* harmony export */   "mapToMnt": () => (/* reexport safe */ _extrude__WEBPACK_IMPORTED_MODULE_21__.mapToMnt),
/* harmony export */   "Normalizer": () => (/* reexport safe */ _streamlines__WEBPACK_IMPORTED_MODULE_22__.Normalizer),
/* harmony export */   "Vector": () => (/* reexport safe */ _streamlines__WEBPACK_IMPORTED_MODULE_22__.Vector),
/* harmony export */   "generateStreamLinesFromUnstructured": () => (/* reexport safe */ _streamlines__WEBPACK_IMPORTED_MODULE_22__.generateStreamLinesFromUnstructured),
/* harmony export */   "getDimsGrid2D": () => (/* reexport safe */ _streamlines__WEBPACK_IMPORTED_MODULE_22__.getDimsGrid2D),
/* harmony export */   "streamLinesExtractor": () => (/* reexport safe */ _streamlines__WEBPACK_IMPORTED_MODULE_22__.streamLinesExtractor),
/* harmony export */   "CurvatureDecomposer": () => (/* reexport safe */ _dataframe__WEBPACK_IMPORTED_MODULE_23__.CurvatureDecomposer),
/* harmony export */   "NormalsToNodeDecomposer": () => (/* reexport safe */ _dataframe__WEBPACK_IMPORTED_MODULE_23__.NormalsToNodeDecomposer),
/* harmony export */   "TriangleToNodeDecomposer": () => (/* reexport safe */ _dataframe__WEBPACK_IMPORTED_MODULE_23__.TriangleToNodeDecomposer),
/* harmony export */   "fromNodeToTriangle": () => (/* reexport safe */ _dataframe__WEBPACK_IMPORTED_MODULE_23__.fromNodeToTriangle),
/* harmony export */   "fromTriangleToNode": () => (/* reexport safe */ _dataframe__WEBPACK_IMPORTED_MODULE_23__.fromTriangleToNode),
/* harmony export */   "generateNormals": () => (/* reexport safe */ _dataframe__WEBPACK_IMPORTED_MODULE_23__.generateNormals)
/* harmony export */ });
/* harmony import */ var _bbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bbox */ "./lib/bbox.ts");
/* harmony import */ var _plane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plane */ "./lib/plane.ts");
/* harmony import */ var _triangulate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./triangulate */ "./lib/triangulate.ts");
/* harmony import */ var _generate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./generate */ "./lib/generate.ts");
/* harmony import */ var _simplify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./simplify */ "./lib/simplify.ts");
/* harmony import */ var _generateSphere__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./generateSphere */ "./lib/generateSphere.ts");
/* harmony import */ var _grid2DHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./grid2DHelper */ "./lib/grid2DHelper.ts");
/* harmony import */ var _grid3DHelper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./grid3DHelper */ "./lib/grid3DHelper.ts");
/* harmony import */ var _background2DGrid__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./background2DGrid */ "./lib/background2DGrid.ts");
/* harmony import */ var _relaxMesh__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./relaxMesh */ "./lib/relaxMesh.ts");
/* harmony import */ var _ImplicitGrid__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ImplicitGrid */ "./lib/ImplicitGrid.ts");
/* harmony import */ var _MarchingCubes__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MarchingCubes */ "./lib/MarchingCubes.ts");
/* harmony import */ var _InterpolateSerie__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./InterpolateSerie */ "./lib/InterpolateSerie.ts");
/* harmony import */ var _reverseNormals__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./reverseNormals */ "./lib/reverseNormals.ts");
/* harmony import */ var _extractSurfaceBorder__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./extractSurfaceBorder */ "./lib/extractSurfaceBorder.ts");
/* harmony import */ var _pointInPolygon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./pointInPolygon */ "./lib/pointInPolygon.ts");
/* harmony import */ var _InterpolateInGrid2D__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./InterpolateInGrid2D */ "./lib/InterpolateInGrid2D.ts");
/* harmony import */ var _HarmonicDiffusion__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./HarmonicDiffusion */ "./lib/HarmonicDiffusion.ts");
/* harmony import */ var _AnglesToNormal__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./AnglesToNormal */ "./lib/AnglesToNormal.ts");
/* harmony import */ var _intersection__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./intersection */ "./lib/intersection.ts");
/* harmony import */ var _he__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./he */ "./lib/he/index.ts");
/* harmony import */ var _extrude__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./extrude */ "./lib/extrude/index.ts");
/* harmony import */ var _streamlines__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./streamlines */ "./lib/streamlines/index.ts");
/* harmony import */ var _dataframe__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./dataframe */ "./lib/dataframe/index.ts");


























/***/ }),

/***/ "./lib/intersection.ts":
/*!*****************************!*\
  !*** ./lib/intersection.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "intersectTriangle": () => (/* binding */ intersectTriangle)
/* harmony export */ });
// from https://github.com/pmjoniak/GeometricTools/blob/master/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
/**
 * Compute the intersected point between a ray and a triangle in 3D.
 * @returns The intersected point or undefined if no intersection
 */
function intersectTriangle({ ray, p1, p2, p3, }) {
    const a = p1;
    const b = p2;
    const c = p3;
    let edge1 = sub(b, a);
    let edge2 = sub(c, a);
    const normal = cross(edge1, edge2);
    let DdN = dot(ray.direction, normal);
    let sign;
    if (DdN > 0) {
        sign = 1;
    }
    else if (DdN < 0) {
        sign = -1;
        DdN = -DdN;
    }
    else {
        return undefined;
    }
    const diff = sub(ray.origin, a);
    edge2 = cross(diff, edge2);
    const DdQxE2 = sign * dot(ray.direction, edge2);
    // b1 < 0, no intersection
    if (DdQxE2 < 0) {
        return undefined;
    }
    edge1 = cross(edge1, diff);
    const DdE1xQ = sign * dot(ray.direction, edge1);
    // b2 < 0, no intersection
    if (DdE1xQ < 0) {
        return undefined;
    }
    // b1+b2 > 1, no intersection
    if (DdQxE2 + DdE1xQ > DdN) {
        return undefined;
    }
    // Line intersects triangle, check if ray does.
    const QdN = -sign * dot(diff, normal);
    // t < 0, no intersection
    if (QdN < 0) {
        return undefined;
    }
    // Ray intersects triangle.
    return at(ray, QdN / DdN);
}
// ------------------------------------------------------------
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => {
    const ax = a[0], ay = a[1], az = a[2];
    const bx = b[0], by = b[1], bz = b[2];
    return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
};
const at = (ray, t) => {
    return [
        ray.direction[0] * t + ray.origin[0],
        ray.direction[1] * t + ray.origin[1],
        ray.direction[2] * t + ray.origin[2],
    ];
};


/***/ }),

/***/ "./lib/plane.ts":
/*!**********************!*\
  !*** ./lib/plane.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TriangleCSys": () => (/* binding */ TriangleCSys),
/* harmony export */   "fittingPlane": () => (/* binding */ fittingPlane),
/* harmony export */   "distanceFromPointToPlane": () => (/* binding */ distanceFromPointToPlane),
/* harmony export */   "vectorFromPointsToPlane": () => (/* binding */ vectorFromPointsToPlane),
/* harmony export */   "project": () => (/* binding */ project)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Some utility functions and classes
 * @module Utils
 */


/**
 * @brief Triangle coordinate system.
 * Allows to transform `math.Vector3` from global to triangle local coordinate system,
 * and vis versa
 * @category Utils
 */
class TriangleCSys {
    constructor(n = undefined) {
        this.mat_ = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        if (n) {
            this.setNormal(n);
        }
    }
    setBase(x, y, z) {
        const v1 = vector(y, x, true); // see bottom for vector()
        const v2 = vector(z, x, true);
        return this.setNormal(_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.cross(v1, v2));
    }
    setNormal(n) {
        const TINY_ANGLE_ = 1e-7;
        let x3 = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.clone(n);
        if (_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.norm(x3) < TINY_ANGLE_) {
            throw new Error('Cannot calculate element normal. Elt must have a very odd shape.');
        }
        x3 = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.normalize(x3);
        let x2 = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.cross([0, 0, 1], x3);
        if (_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.norm(x2) < TINY_ANGLE_) {
            x2 = [0, 1, 0];
        }
        x2 = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.normalize(x2);
        let x1 = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.cross(x2, x3);
        x1 = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.normalize(x1);
        this.mat_[0] = x1[0];
        this.mat_[1] = x2[0];
        this.mat_[2] = x3[0];
        this.mat_[3] = x1[1];
        this.mat_[4] = x2[1];
        this.mat_[5] = x3[1];
        this.mat_[6] = x1[2];
        this.mat_[7] = x2[2];
        this.mat_[8] = x3[2];
    }
    get matrix() {
        return this.mat_;
    }
    get dip() {
        return [this.mat_[0][0], this.mat_[1][0], this.mat_[2][0]];
    }
    get strike() {
        return [this.mat_[0][1], this.mat_[1][1], this.mat_[2][1]];
    }
    get normal() {
        return [this.mat_[0][2], this.mat_[1][2], this.mat_[2][2]];
    }
    toLocal(v) {
        return multVec(this.mat_, v);
    }
    toGlobal(v) {
        return multTVec(this.mat_, v);
    }
    shearComponent(t) {
        return _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.scale(_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.sub(t, this.normalComponent(t)), -1);
    }
    normalComponent(t) {
        return _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.scale(this.normal, -_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.dot(t, this.normal));
    }
}
// -------------------------------------------
/**
 * @brief Plane fitting to many 3D points
 * @param points The points coordinates in flat array
 * @return {point: Vec3, normal: Vec3} The plane parameters fitting the points
 * in a least squares sens
 */
function fittingPlane(points) {
    if (points.length < 3) {
        throw new Error('Not enough points to fit a plane');
    }
    const sum = [0, 0, 0];
    for (let i = 0; i < points.array.length; i += 3) {
        sum[0] += points.array[i];
        sum[1] += points.array[i + 1];
        sum[2] += points.array[i + 2];
    }
    const centroid = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.scale(sum, 1 / points.length);
    // Calc full 3x3 covariance matrix, excluding symmetries:
    let xx = 0.0, xy = 0.0, xz = 0.0;
    let yy = 0.0, yz = 0.0, zz = 0.0;
    for (let i = 0; i < points.length; i += 3) {
        const r = [
            points.array[i] - centroid[0],
            points.array[i + 1] - centroid[1],
            points.array[i + 2] - centroid[2],
        ];
        xx += r[0] ** 2;
        xy += r[0] * r[1];
        xz += r[0] * r[2];
        yy += r[1] ** 2;
        yz += r[1] * r[2];
        zz += r[2] ** 2;
    }
    const det_x = yy * zz - yz * yz;
    const det_y = xx * zz - xz * xz;
    const det_z = xx * yy - xy * xy;
    const det_max = Math.max(det_x, det_y, det_z);
    if (det_max <= 0) {
        throw new Error('determlinant is <0');
    }
    // Pick path with best conditioning:
    let dir = [0, 0, 0];
    if (det_max == det_x) {
        dir = [det_x, xz * yz - xy * zz, xy * yz - xz * yy];
    }
    else if (det_max == det_y) {
        dir = [xz * yz - xy * zz, det_y, xy * xz - yz * xx];
    }
    else {
        dir = [xy * yz - xz * yy, xy * xz - yz * xx, det_z];
    }
    return {
        point: centroid,
        normal: _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.normalize(dir),
    };
}
/**
 * @brief Get the distances from 3D points to a plane
 * @param pt The considered 3D points or one point
 * @param plane The plane defined with a point and its normal
 */
function distanceFromPointToPlane(pt, plane) {
    if (_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.isSerie(pt)) {
        const S = pt;
        if (S.itemSize !== 3) {
            throw new Error('points must have itemSize = 3 (coordinates)');
        }
        return S.map((point) => _distanceFromPointToPlane_(point, plane));
    }
    return _distanceFromPointToPlane_(pt, plane);
}
/**
 * @brief Get the vectors from 3D points to a plane
 * @param pt The considered 3D points or one point
 * @param plane The plane defined with a point and its normal
 */
function vectorFromPointsToPlane(pt, plane) {
    if (_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.isSerie(pt)) {
        const S = pt;
        if (S.itemSize !== 3) {
            throw new Error('points must have itemSize = 3 (coordinates)');
        }
        return S.map((point) => _vectorFromPointToPlane_(point, plane));
    }
    return _vectorFromPointToPlane_(pt, plane);
}
/**
 * Project a 3D vector onto the plane and get the in-plane coordinates (2D)
 * @param p The point to project
 * @param plane The plane
 * @returns [x,y] coordinates
 */
function project(p, plane) {
    // Like traction vector to be projected onto a plane with normal n
    // t - t.n n --> ts
    const _project = (t, n) => {
        const d = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.dot(t, n);
        return [t[0] - d * n[0], t[1] - d * n[1]];
    };
    if (_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.isSerie(p)) {
        const S = p;
        return S.map((point) => _project(point, plane.normal));
    }
    return _project(p, plane.normal);
}
// ----------------------------------------------------------------------
/**
 * @brief Get the distance from a 3D point to a plane
 * @param p The considered 3D point
 * @param plane The plane defined with a point and its normal
 */
function _distanceFromPointToPlane_(p, plane) {
    const sn = -_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.dot(plane.normal, vector(plane.point, p, true));
    const sd = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.dot(plane.normal, plane.normal);
    const sb = sn / sd;
    const B = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.add(p, _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.scale(plane.normal, sb));
    return _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.norm(vector(p, B));
}
function _vectorFromPointToPlane_(p, plane) {
    const sn = -_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.dot(plane.normal, vector(plane.point, p, true));
    const sd = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.dot(plane.normal, plane.normal);
    const sb = sn / sd;
    const B = _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.add(p, _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.scale(plane.normal, sb));
    return vector(p, B);
}
function vector(p1, p2, normalize = false) {
    if (normalize) {
        const x = p2[0] - p1[0];
        const y = p2[1] - p1[1];
        const z = p2[2] - p1[2];
        const n = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        return [x / n, y / n, z / n];
    }
    return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
}
function multVec(e, v) {
    const x = v[0], y = v[1], z = v[2];
    return [
        e[0] * x + e[3] * y + e[6] * z,
        e[1] * x + e[4] * y + e[7] * z,
        e[2] * x + e[5] * y + e[8] * z,
    ];
}
function multTVec(e, v) {
    const x = v[0], y = v[1], z = v[2];
    return [
        e[0] * x + e[1] * y + e[2] * z,
        e[3] * x + e[4] * y + e[5] * z,
        e[6] * x + e[7] * y + e[8] * z,
    ];
}


/***/ }),

/***/ "./lib/pointInPolygon.ts":
/*!*******************************!*\
  !*** ./lib/pointInPolygon.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pointInPolygon": () => (/* binding */ pointInPolygon),
/* harmony export */   "generatePointInPolygon": () => (/* binding */ generatePointInPolygon)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bbox */ "./lib/bbox.ts");


// type Point2d = [number, number]
/**
 * If the polygon is given by 3D points, set the flag `hasZ` to true.
 * The z component will be discarded.
 *
 * Usage:
 * ```js
 * const polygon = [1, 1,  1, 2,  2, 2,  2, 1]
 * console.log( pointInPolygon(1.5, 1.5, polygon)) // true
 * console.log( pointInPolygon(4.9, 1.2, polygon)) // false
 * console.log( pointInPolygon(1.8, 1.1, polygon)) // true
 * ```
 * @note based on https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
 */
// export function pointInPolygon(testx: number, testy: number, verts: number[], hasZ = false) {
//     let c = false
//     const shift = hasZ ? 3: 2
//     if (verts.length%shift !== 0) {
//         throw new Error('bad verts array length in '+(hasZ?'3D':'2D'))
//     }
//     const nvert = verts.length / shift
//     for (let i = 0, j = nvert - 1; i < nvert; j = i++) {
//         const xi = verts[shift * i]
//         const yi = verts[shift * i + 1]
//         const yj = verts[shift * j + 1]
//         if (((yi > testy) != (yj > testy)) && (testx < (verts[shift * j] - xi) * (testy - yi) / (yj - yi) + xi)) {
//             c = !c
//         }
//     }
//     return c
// }
function pointInPolygon(x, y, polyline) {
    let c = false;
    if (polyline.itemSize !== 2 && polyline.itemSize !== 3) {
        throw new Error('bad Serie for polyline. Should be coords in 2D or 3D');
    }
    const shift = polyline.itemSize;
    const nvert = polyline.count;
    const verts = polyline.array;
    for (let i = 0, j = nvert - 1; i < nvert; j = i++) {
        const xi = verts[shift * i];
        const yi = verts[shift * i + 1];
        const yj = verts[shift * j + 1];
        if (yi > y != yj > y &&
            x < ((verts[shift * j] - xi) * (y - yi)) / (yj - yi) + xi) {
            c = !c;
        }
    }
    return c;
}
function generatePointInPolygon(polyline, maxThrows = 100) {
    const bounds = (0,_youwol_math__WEBPACK_IMPORTED_MODULE_0__.minMax)(polyline);
    const bbox = new _bbox__WEBPACK_IMPORTED_MODULE_1__.BBox([bounds[0], bounds[1], polyline.itemSize === 3 ? bounds[2] : 0], [bounds[3], bounds[4], polyline.itemSize === 3 ? bounds[5] : 0]);
    let i = 0;
    /*eslint no-constant-condition: off -- stupid, so disablethis eslint error*/
    while (true) {
        const p = bbox.randPoint();
        if (pointInPolygon(p[0], p[1], polyline)) {
            return [p[0], p[1]];
        }
        if (i > maxThrows) {
            return undefined;
        }
        i++;
    }
}


/***/ }),

/***/ "./lib/relaxMesh.ts":
/*!**************************!*\
  !*** ./lib/relaxMesh.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "relaxMesh": () => (/* binding */ relaxMesh)
/* harmony export */ });
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./lib/index.ts");


/**
 * Beautify a flat triangulated surface
 * @returns
 */
function relaxMesh(positions, indices, iterations = 100, damp = 0.1) {
    const surface = ___WEBPACK_IMPORTED_MODULE_1__.Surface.create(positions, indices);
    let meanArea = 0;
    surface.forEachFace((f) => (meanArea += f.area));
    meanArea /= surface.nbFacets;
    const meanEdge = Math.sqrt((4 * meanArea) / Math.sqrt(3));
    for (let i = 0; i < iterations; ++i) {
        surface.forEachNode((n) => {
            if (n.isOnBorder === false) {
                let f = [0, 0, 0];
                (0,___WEBPACK_IMPORTED_MODULE_1__.nodesAroundNode)(n, (n1) => {
                    const f1 = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.create(n.pos, n1.pos); // force vector
                    const norm = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.norm(f1); // length force vector
                    f1[0] /= norm;
                    f1[1] /= norm;
                    f = _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.add(f, _youwol_math__WEBPACK_IMPORTED_MODULE_0__.vec.scale(f1, norm - meanEdge));
                });
                n.setPos(n.pos[0] + f[0] * damp, n.pos[1] + f[1] * damp, f[2]);
            }
        });
    }
    return surface.nodesAsSerie;
}


/***/ }),

/***/ "./lib/reverseNormals.ts":
/*!*******************************!*\
  !*** ./lib/reverseNormals.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reverseNormals": () => (/* binding */ reverseNormals)
/* harmony export */ });
/**
 * Reverse les normals given in a Serie.
 * @example
 * ```js
 * import { reverseNormals } from '@youwol/geometry'
 * import { decodeGocadTS } from '@youwol/io'
 *
 * const surfaces = io.decodeGocadTS(buffer)
 *
 * // Reverse all the normals for all the loaded surfaces
 * surfaces.forEach( surface => {
 *      surface.indices = reverseNormals(surface.indices)
 * })
 * ```
 * @param indices The indices of the triangles as a serie (flat-array)
 * @returns The new indices as a serie
 * @caterogy dataframe
 */
function reverseNormals(indices) {
    if (indices.itemSize !== 3) {
        throw new Error('Only triangles are allowed');
    }
    return indices.map((i) => [i[0], i[2], i[1]]);
}


/***/ }),

/***/ "./lib/simplify.ts":
/*!*************************!*\
  !*** ./lib/simplify.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "simplify": () => (/* binding */ simplify)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_1__);
/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/


/**
 * From `Simplify.js`, a high-performance JS polyline simplification library.
 *
 * Polyline simplification dramatically reduces the number of points in a polyline while
 * retaining its shape, giving a huge performance boost when processing it and also
 * reducing visual noise. For example, it's essential when rendering a 70k-points line
 * chart or a map route in the browser using Canvas or SVG.
 *
 * @param points Can be either 2D or 3D points defined in a Serie
 *
 * @github [mourner.github.io/simplify-js](mourner.github.io/simplify-js)
 * @copyright 2013, Vladimir Agafonkin
 * @license BSD-2-Clause "Simplified" License
 */
function simplify(points, tolerance = 1, highestQuality = false) {
    const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
    return simplifyDouglasPeucker(highestQuality ? points : simplifyRadialDistance(points, sqTolerance), sqTolerance);
}
// -------------------------------------------------------------------------------------
// square distance between 2 points
const getSquareDistance = (p1, p2) => _youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.norm2(_youwol_math__WEBPACK_IMPORTED_MODULE_1__.vec.sub(p1, p2));
// square distance from a point to a segment
function getSquareSegmentDistance(p, p1, p2) {
    if (p.length === 2) {
        let x = p1[0], y = p1[1], dx = p2[0] - x, dy = p2[1] - y;
        if (dx !== 0 || dy !== 0) {
            const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x = p2[0];
                y = p2[1];
            }
            else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }
        dx = p[0] - x;
        dy = p[1] - y;
        return dx * dx + dy * dy;
    }
    let x = p1[0], y = p1[1], z = p1[2], dx = p2[0] - x, dy = p2[1] - y, dz = p2[2] - z;
    if (dx !== 0 || dy !== 0 || dz !== 0) {
        const t = ((p[0] - x) * dx + (p[1] - y) * dy + (p[2] - z) * dz) /
            (dx * dx + dy * dy + dz * dz);
        if (t > 1) {
            x = p2[0];
            y = p2[1];
            z = p2[2];
        }
        else if (t > 0) {
            x += dx * t;
            y += dy * t;
            z += dz * t;
        }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    dz = p[2] - z;
    return dx * dx + dy * dy + dz * dz;
}
// basic distance-based simplification
function simplifyRadialDistance(points, sqTolerance) {
    let prevPoint = points.itemAt(0);
    const newPoints = [...prevPoint];
    let point = undefined;
    const itemSize = points.itemSize;
    for (let i = 1, len = points.count; i < len; ++i) {
        point = points.itemAt(i);
        if (getSquareDistance(point, prevPoint) > sqTolerance) {
            newPoints.push(...point);
            prevPoint = point;
        }
    }
    if (prevPoint !== point) {
        newPoints.push(...point);
    }
    const r = points.image(points.length / itemSize, itemSize);
    return (0,_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.copy)(newPoints, r);
}
// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {
    const len = points.length;
    const MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
    const markers = new MarkerArray(len);
    const stack = [];
    const newPoints = [];
    let first = 0, last = len - 1;
    let i, maxSqDist, sqDist, index;
    markers[first] = markers[last] = 1;
    while (last) {
        maxSqDist = 0;
        for (i = first + 1; i < last; i++) {
            sqDist = getSquareSegmentDistance(points.itemAt(i), points.itemAt(first), points.itemAt(last));
            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }
        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }
        last = stack.pop();
        first = stack.pop();
    }
    for (i = 0; i < len; i++) {
        if (markers[i]) {
            newPoints.push(points[i]);
        }
    }
    const itemSize = points.itemSize;
    const r = points.image(points.length / itemSize, itemSize);
    return (0,_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.copy)(newPoints, r);
}


/***/ }),

/***/ "./lib/streamlines/Normalizer.ts":
/*!***************************************!*\
  !*** ./lib/streamlines/Normalizer.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Normalizer": () => (/* binding */ Normalizer)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);

class Normalizer {
    constructor(bounds, scaling = 1) {
        this.bounds = [0, 0, 0, 0, 0, 0];
        this.width = 0;
        this.height = 0;
        this.length = 0;
        this.center = [0, 0];
        if (bounds.length !== 6) {
            throw new Error('bounds is an array of length 6 ([xmin,ymin,zmin, xmax,ymax,zmax])');
        }
        this.bounds = bounds;
        this.width = (bounds[3] - bounds[0]) * scaling;
        this.height = (bounds[4] - bounds[1]) * scaling;
        this.length = Math.max(this.width, this.height);
        this.center = [(bounds[3] + bounds[0]) / 2, (bounds[4] + bounds[1]) / 2];
    }
    normalize(p) {
        if (_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.isSerie(p)) {
            const s = p.map((q) => this.normalize(q));
            return s;
        }
        const X = (p[0] - this.center[0]) / this.length;
        const Y = (p[1] - this.center[1]) / this.length;
        if (p.length === 2) {
            return [X, Y];
        }
        else {
            return [X, Y, p[2]];
        }
    }
    denormalize(p) {
        if (p instanceof _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie) {
            return p.map((q) => this.denormalize(q));
        }
        const X = p[0] * this.length + this.center[0];
        const Y = p[1] * this.length + this.center[1];
        if (p.length === 2) {
            return [X, Y];
        }
        else {
            return [X, Y, p[2]];
        }
    }
}


/***/ }),

/***/ "./lib/streamlines/Vector.ts":
/*!***********************************!*\
  !*** ./lib/streamlines/Vector.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vector": () => (/* binding */ Vector)
/* harmony export */ });
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    mulScalar(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const l = this.length();
        this.x /= l;
        this.y /= l;
    }
    distanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}


/***/ }),

/***/ "./lib/streamlines/createLookupGrid.ts":
/*!*********************************************!*\
  !*** ./lib/streamlines/createLookupGrid.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cell": () => (/* binding */ Cell),
/* harmony export */   "createLookupGrid": () => (/* binding */ createLookupGrid)
/* harmony export */ });
class Cell {
    constructor() {
        this.children = undefined;
    }
    occupy(point) {
        if (this.children === undefined) {
            this.children = [];
        }
        this.children.push(point);
    }
    isTaken(x, y, checkCallback) {
        if (this.children === undefined) {
            return false;
        }
        for (let i = 0; i < this.children.length; ++i) {
            const p = this.children[i];
            const dx = p.x - x, dy = p.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (checkCallback(dist, p)) {
                return true;
            }
        }
        return false;
    }
}
function createLookupGrid(bbox, dSep, isOutsideFct) {
    const bboxSize = Math.max(bbox.width, bbox.height);
    const cellsCount = Math.ceil(bboxSize / dSep);
    const cells = new Map();
    // console.log(bbox, dSep)
    return {
        occupyCoordinates,
        isTaken,
        isOutside,
    };
    function isOutside(x, y) {
        return isOutsideFct !== undefined
            ? !isOutsideFct(x, y)
            : x < bbox.left ||
                x > bbox.left + bbox.width ||
                y < bbox.top ||
                y > bbox.top + bbox.height;
    }
    function occupyCoordinates(point) {
        // if (isInBounds(point.x, point.y)) {
        getCellByCoordinates(point.x, point.y).occupy(point);
        // }
    }
    function isTaken(x, y, checkCallback) {
        if (!cells) {
            return false;
        }
        const cx = gridX(x);
        const cy = gridY(y);
        for (let col = -1; col < 2; ++col) {
            const currentCellX = cx + col;
            if (currentCellX < 0 || currentCellX >= cellsCount) {
                continue;
            }
            const cellRow = cells.get(currentCellX);
            if (!cellRow) {
                continue;
            }
            for (let row = -1; row < 2; ++row) {
                const currentCellY = cy + row;
                if (currentCellY < 0 || currentCellY >= cellsCount) {
                    continue;
                }
                const cellCol = cellRow.get(currentCellY);
                if (!cellCol) {
                    continue;
                }
                if (cellCol.isTaken(x, y, checkCallback)) {
                    return true;
                }
            }
        }
        return false;
    }
    function getCellByCoordinates(x, y) {
        assertInBounds(x, y);
        const rowCoordinate = gridX(x);
        let row = cells.get(rowCoordinate);
        if (!row) {
            row = new Map();
            cells.set(rowCoordinate, row);
        }
        const colCoordinate = gridY(y);
        let cell = row.get(colCoordinate);
        if (!cell) {
            cell = new Cell();
            row.set(colCoordinate, cell);
        }
        return cell;
    }
    function gridX(x) {
        return Math.floor((cellsCount * (x - bbox.left)) / bboxSize);
    }
    function gridY(y) {
        return Math.floor((cellsCount * (y - bbox.top)) / bboxSize);
    }
    function assertInBounds(x, y) {
        if (bbox.left > x || bbox.left + bboxSize < x) {
            throw new Error(`x (${x}) is out of bounds (${bbox.left}, ${bbox.left + bboxSize})`);
        }
        if (bbox.top > y || bbox.top + bboxSize < y) {
            throw new Error(`y (${y}) is out of bounds (${bbox.top}, ${bbox.top + bboxSize})`);
        }
    }
    // function isInBounds(x: number, y: number) {
    //     if (bbox.left > x || bbox.left + bboxSize < x) {
    //         return false
    //     }
    //     if (bbox.top > y || bbox.top + bboxSize < y) {
    //         return false
    //     }
    //     return true
    // }
}


/***/ }),

/***/ "./lib/streamlines/generateStreamLinesFromUnstructured.ts":
/*!****************************************************************!*\
  !*** ./lib/streamlines/generateStreamLinesFromUnstructured.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateStreamLinesFromUnstructured": () => (/* binding */ generateStreamLinesFromUnstructured)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @youwol/math */ "@youwol/math");
/* harmony import */ var _youwol_math__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_youwol_math__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _InterpolateInGrid2D__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../InterpolateInGrid2D */ "./lib/InterpolateInGrid2D.ts");
/* harmony import */ var _Normalizer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Normalizer */ "./lib/streamlines/Normalizer.ts");
/* harmony import */ var _streamLinesExtractor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./streamLinesExtractor */ "./lib/streamlines/streamLinesExtractor.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Vector */ "./lib/streamlines/Vector.ts");






function generateStreamLinesFromUnstructured({ positions, indices, vectorField, seeds = undefined, nx = 100, ny = 100, maximumPointsPerLine = 50, dSep = 0.1, timeStep = 0.05, dTest = 0.05, maxTimePerIteration = 1000, }) {
    // Normalize the grid position
    //
    const normalizer = new _Normalizer__WEBPACK_IMPORTED_MODULE_3__.Normalizer((0,_youwol_math__WEBPACK_IMPORTED_MODULE_1__.minMax)(positions), 0.1);
    const npositions = normalizer.normalize(positions);
    const bounds = (0,_youwol_math__WEBPACK_IMPORTED_MODULE_1__.minMax)(npositions);
    // Prepare the interpolator
    //
    const interpolator = new _InterpolateInGrid2D__WEBPACK_IMPORTED_MODULE_2__.InterpolateInGrid2D({
        positions: npositions,
        indices: indices,
        attribute: vectorField,
        nx,
        ny,
        flatten: true,
        scaling: 1,
    });
    // Get the seed points and normalize them
    //
    let SEEDS = undefined;
    if (seeds) {
        SEEDS = [];
        const seeds1 = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: seeds, itemSize: 3 }).map((s) => normalizer.normalize(s));
        seeds1.forEach((v) => SEEDS.push({ x: v[0], y: v[1] }));
    }
    // Extract the streamlines
    //
    const lines = (0,_streamLinesExtractor__WEBPACK_IMPORTED_MODULE_4__.streamLinesExtractor)({
        vectorField: (p) => {
            const v = interpolator.interpolate([p.x, p.y]);
            if (v === undefined) {
                return undefined;
            }
            return new _Vector__WEBPACK_IMPORTED_MODULE_5__.Vector(v[0], v[1]);
            // const l = v[0]**2 + v[1]**2 + v[2]**2
            // return new Vector(v[0]/l, v[1]/l)
        },
        bounds,
        maximumPointsPerLine,
        maxTimePerIteration,
        dSep,
        timeStep,
        dTest,
        seedArray: SEEDS,
    });
    // Denormalize the generated streamlines
    //
    lines.forEach((line) => {
        line.series.positions = normalizer.denormalize(line.series.positions);
    });
    return lines;
}


/***/ }),

/***/ "./lib/streamlines/index.ts":
/*!**********************************!*\
  !*** ./lib/streamlines/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDimsGrid2D": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_0__.getDimsGrid2D),
/* harmony export */   "Vector": () => (/* reexport safe */ _Vector__WEBPACK_IMPORTED_MODULE_1__.Vector),
/* harmony export */   "Normalizer": () => (/* reexport safe */ _Normalizer__WEBPACK_IMPORTED_MODULE_2__.Normalizer),
/* harmony export */   "streamLinesExtractor": () => (/* reexport safe */ _streamLinesExtractor__WEBPACK_IMPORTED_MODULE_3__.streamLinesExtractor),
/* harmony export */   "generateStreamLinesFromUnstructured": () => (/* reexport safe */ _generateStreamLinesFromUnstructured__WEBPACK_IMPORTED_MODULE_4__.generateStreamLinesFromUnstructured)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./lib/streamlines/utils.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ "./lib/streamlines/Vector.ts");
/* harmony import */ var _Normalizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Normalizer */ "./lib/streamlines/Normalizer.ts");
/* harmony import */ var _streamLinesExtractor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./streamLinesExtractor */ "./lib/streamlines/streamLinesExtractor.ts");
/* harmony import */ var _generateStreamLinesFromUnstructured__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./generateStreamLinesFromUnstructured */ "./lib/streamlines/generateStreamLinesFromUnstructured.ts");
// export { BoundingBox, VelocityFunction, StreamLinesOptions } from './types'







/***/ }),

/***/ "./lib/streamlines/integrator.ts":
/*!***************************************!*\
  !*** ./lib/streamlines/integrator.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createStreamlineIntegrator": () => (/* binding */ createStreamlineIntegrator)
/* harmony export */ });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./lib/streamlines/Vector.ts");
/* harmony import */ var _createLookupGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createLookupGrid */ "./lib/streamlines/createLookupGrid.ts");
/* harmony import */ var _rk4__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rk4 */ "./lib/streamlines/rk4.ts");



/*eslint @typescript-eslint/no-explicit-any: off -- not our code, so disable eslint errors*/
/*eslint no-constant-condition: off -- not our code, so disable eslint errors*/
var State;
(function (State) {
    State[State["FORWARD"] = 0] = "FORWARD";
    State[State["BACKWARD"] = 1] = "BACKWARD";
    State[State["DONE"] = 2] = "DONE";
})(State || (State = {}));
function createStreamlineIntegrator(start, grid, config) {
    const points = [start];
    let pos = start;
    let state = State.FORWARD;
    let candidate = null;
    let lastCheckedSeed = -1;
    const ownGrid = (0,_createLookupGrid__WEBPACK_IMPORTED_MODULE_1__.createLookupGrid)(config.boundingBox, config.timeStep * 0.9, config.isOutsideFct);
    return {
        start: start,
        next: next,
        getStreamline: () => points,
        getNextValidSeed: getNextValidSeed,
    };
    function getNextValidSeed() {
        while (lastCheckedSeed < points.length - 1) {
            lastCheckedSeed += 1;
            const p = points[lastCheckedSeed];
            const v = normalizedVectorField(p);
            if (!v) {
                continue;
            }
            // Check one normal. We just set c = p + n, where n is orthogonal to v.
            // Since v is unit vector we can multiply it by scaler (config.dSep) to get to the
            // right point. It is also easy to find normal in 2d: normal to (x, y) is just (-y, x).
            // You can get it by applying 2d rotation matrix.)
            let cx = p.x - v.y * config.dSep;
            let cy = p.y + v.x * config.dSep;
            if (Array.isArray(config.seedArray) &&
                config.seedArray.length > 0) {
                const seed = config.seedArray.shift();
                cx = seed.x;
                cy = seed.y;
            }
            if (!grid.isOutside(cx, cy) && !grid.isTaken(cx, cy, checkDSep)) {
                // this will let us check the other side. When we get back
                // into this method, the point `cx, cy` will be taken (by construction of another streamline)
                // And we will throw through to the next orthogonal check.
                lastCheckedSeed -= 1;
                return new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(cx, cy);
            }
            // Check orthogonal coordinates on the other side (o = p - n).
            const ox = p.x + v.y * config.dSep;
            const oy = p.y - v.x * config.dSep;
            if (!grid.isOutside(ox, oy) && !grid.isTaken(ox, oy, checkDSep)) {
                return new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(ox, oy);
            }
        }
    }
    function checkDTest(distanceToCandidate) {
        if (isSame(distanceToCandidate, config.dTest)) {
            return false;
        }
        return distanceToCandidate < config.dTest;
    }
    function checkDSep(distanceToCandidate) {
        if (isSame(distanceToCandidate, config.dSep)) {
            return false;
        }
        return distanceToCandidate < config.dSep;
    }
    function next() {
        while (true) {
            candidate = null;
            if (config.maximumPointsPerLine &&
                points.length > config.maximumPointsPerLine) {
                state = State.DONE;
            }
            if (state === State.FORWARD) {
                const point = growForward();
                if (point) {
                    points.push(point);
                    ownGrid.occupyCoordinates(point);
                    pos = point;
                    if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
                        state = State.DONE;
                        config.onPointAdded(undefined, undefined, undefined);
                        return true;
                    }
                    else {
                        const shouldPause = notifyPointAdded(point);
                        if (shouldPause) {
                            return;
                        }
                    }
                }
                else {
                    // Reset position to start, and grow backwards:
                    if (config.forwardOnly) {
                        state = State.DONE;
                    }
                    else {
                        pos = start;
                        state = State.BACKWARD;
                        config.onPointAdded(undefined, undefined, undefined);
                    }
                }
            }
            if (state === State.BACKWARD) {
                const point = growBackward();
                if (point) {
                    points.unshift(point);
                    pos = point;
                    ownGrid.occupyCoordinates(point);
                    if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
                        state = State.DONE;
                        config.onPointAdded(undefined, undefined, undefined);
                        return true;
                    }
                    else {
                        const shouldPause = notifyPointAdded(point);
                        if (shouldPause) {
                            return;
                        }
                    }
                }
                else {
                    state = State.DONE;
                }
            }
            if (state === State.DONE) {
                // console.log(points)
                points.forEach(occupyPointInGrid);
                config.onPointAdded(undefined, undefined, undefined);
                return true;
            }
        }
    }
    function occupyPointInGrid(p) {
        grid.occupyCoordinates(p);
    }
    function growForward() {
        const velocity = (0,_rk4__WEBPACK_IMPORTED_MODULE_2__.rk4)(pos, config.timeStep, normalizedVectorField);
        if (!velocity) {
            return undefined; // Hit the singularity.
        }
        return growByVelocity(pos, velocity);
    }
    function growBackward() {
        let velocity = (0,_rk4__WEBPACK_IMPORTED_MODULE_2__.rk4)(pos, config.timeStep, normalizedVectorField);
        if (!velocity) {
            return undefined; // Singularity
        }
        velocity = velocity.mulScalar(-1);
        return growByVelocity(pos, velocity);
    }
    function growByVelocity(pos, velocity) {
        // console.log(pos, velocity)
        candidate = pos.add(velocity);
        if (grid.isOutside(candidate.x, candidate.y)) {
            return undefined;
        }
        if (grid.isTaken(candidate.x, candidate.y, checkDTest)) {
            return undefined;
        }
        // did we hit any of our points?
        if (ownGrid.isTaken(candidate.x, candidate.y, timeStepCheck)) {
            return undefined;
        }
        return candidate;
    }
    function timeStepCheck(distanceToCandidate) {
        return distanceToCandidate < config.timeStep * 0.9;
    }
    function notifyPointAdded(point) {
        let shouldPause = false;
        if (config.onPointAdded) {
            const otherPoint = points[state === State.FORWARD ? points.length - 2 : 1];
            shouldPause = config.onPointAdded(point, otherPoint, config);
        }
        return shouldPause;
    }
    function normalizedVectorField(P) {
        const p = config.vectorField(P);
        if (!p) {
            return;
        } // Assume singularity
        if (Number.isNaN(p.x) || Number.isNaN(p.y)) {
            return undefined; // Not defined. e.g. Math.log(-1);
        }
        let l = p.x ** 2 + p.y ** 2;
        if (l === 0) {
            return;
        } // the same, singularity
        l = Math.sqrt(l);
        // We need normalized field.
        return new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(p.x / l, p.y / l);
    }
}
function isSame(a, b) {
    // to avoid floating point error
    return Math.abs(a - b) < 1e-4;
}


/***/ }),

/***/ "./lib/streamlines/rk4.ts":
/*!********************************!*\
  !*** ./lib/streamlines/rk4.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rk4": () => (/* binding */ rk4)
/* harmony export */ });
function rk4(point, timeStep, getVelocity) {
    const k1 = getVelocity(point);
    if (!k1) {
        return;
    }
    const k2 = getVelocity(point.add(k1.mulScalar(timeStep * 0.5)));
    if (!k2) {
        return;
    }
    const k3 = getVelocity(point.add(k2.mulScalar(timeStep * 0.5)));
    if (!k3) {
        return;
    }
    const k4 = getVelocity(point.add(k3.mulScalar(timeStep)));
    if (!k4) {
        return;
    }
    return k1
        .mulScalar(timeStep / 6)
        .add(k2.mulScalar(timeStep / 3))
        .add(k3.mulScalar(timeStep / 3))
        .add(k4.mulScalar(timeStep / 6));
}


/***/ }),

/***/ "./lib/streamlines/streamLinesExtractor.ts":
/*!*************************************************!*\
  !*** ./lib/streamlines/streamLinesExtractor.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "streamLinesExtractor": () => (/* binding */ streamLinesExtractor)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _streamlines__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./streamlines */ "./lib/streamlines/streamlines.ts");


/**
 * @param seed Defines the first point where integration should start. If this is
 * not specified a random point inside boundingBox is selected
 * You can pass array of seed points, they are going to be used one by one
 * if they satisfy the rules
 * @param seedArray Same as seed but using an array of seed points
 * @param stepsPerIteration
 * @param timeStep Integration time step (passed to RK4 method)
 * @param dSep Separation distance between new streamlines
 * @param dTest Distance between streamlines when integration should stop
 * @param forwardOnly If set to true, lines are going to be drawn from the seed points
 * only in the direction of the vector field
 */
function streamLinesExtractor({ vectorField, isOutsideFct, bounds, seed = undefined, seedArray = undefined, maximumPointsPerLine = undefined, 
// maxTimePerIteration = 1000,
stepsPerIteration = 50, timeStep = 0.05, dSep = 0.2, dTest = 0.08, forwardOnly = false, }) {
    function addPoint(a, b) {
        const newPolyLine = () => {
            if (polyline.length > 1) {
                polylines.push([...polyline]);
            }
            polyline = [];
        };
        if (a === undefined) {
            newPolyLine();
            return false;
        }
        else {
            polyline.push(a.x, a.y, 0, b.x, b.y, 0);
        }
        return true;
    }
    // function vectorFieldFunction(p: Vector): Vector {
    //     const v = gridHelper.interpolate([p.y, p.x], vectorField) // WARNING: WE INVERTED  the x and y !
    //     if (v === undefined) return undefined
    //     return new Vector(v[0], v[1])
    // }
    // vectorField instead of attribute
    // const nx     = dims[0]
    // const ny     = dims[1]
    // const b      = new Bounds( minMax, 0.1 )
    // const bounds = b.normalized()
    // console.log(b, bounds)
    // const gridHelper = new Grid2DHelper([bounds[0],bounds[1]], [bounds[3],bounds[4]], nx, ny, 1e-7)
    // const bbox = {
    //     width : bounds[3]-bounds[0],
    //     height: bounds[4]-bounds[1],
    //     left  : bounds[0],
    //     top   : bounds[1],
    // }
    const polylines = [];
    let polyline = [];
    // 'bounds' is now a parameter of this function
    const bbox = {
        width: bounds[3] - bounds[0],
        height: bounds[4] - bounds[1],
        left: bounds[0],
        top: bounds[1],
    };
    const computer = (0,_streamlines__WEBPACK_IMPORTED_MODULE_1__.streamlines)({
        // vectorField: vectorFieldFunction,
        vectorField,
        isOutsideFct: isOutsideFct,
        onPointAdded: addPoint,
        onStreamlineAdded: undefined,
        maxTimePerIteration: 1,
        maximumPointsPerLine,
        seed,
        boundingBox: bbox,
        stepsPerIteration,
        timeStep,
        dSep,
        dTest,
        forwardOnly,
        seedArray,
    });
    computer.run();
    if (polyline.length !== 0) {
        polylines.push([...polyline]);
    }
    // polylines = b.denormalize(polylines)
    return polylines.map((polyline) => {
        const indices = [];
        for (let i = 0; i < polyline.length; i += 2) {
            indices.push(i, i + 1);
        }
        return _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.DataFrame.create({
            series: {
                positions: _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: polyline, itemSize: 3 }),
                indices: _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: indices, itemSize: 2 }),
            },
        });
    });
}
/*
class Bounds {
    private width: number
    private height: number
    private center: [number, number]

    constructor(private bounds: number[], scaling = 1) {
        this.width = (bounds[3] - bounds[0]) * scaling
        this.height = (bounds[4] - bounds[1]) * scaling
        this.center = [(bounds[3] + bounds[0]) / 2, (bounds[4] + bounds[1]) / 2]
    }

    normalized() {
        return [
            (this.bounds[0] - this.center[0]) / this.width,
            (this.bounds[1] - this.center[1]) / this.height,
            this.bounds[2],
            (this.bounds[3] - this.center[0]) / this.width,
            (this.bounds[4] - this.center[1]) / this.height,
            this.bounds[5],
        ]
    }

    denormalize(polylines: Polylines) {
        return polylines.map((polyline: Polyline) => {
            const p = [...polyline]
            for (let i = 0; i < polyline.length; i += 3) {
                // assume 3D
                p[i] = polyline[i] * this.width + this.center[0]
                p[i + 1] = polyline[i + 1] * this.height + this.center[1]
            }
            return p
        })
    }
}
*/


/***/ }),

/***/ "./lib/streamlines/streamlines.ts":
/*!****************************************!*\
  !*** ./lib/streamlines/streamlines.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "streamlines": () => (/* binding */ streamlines)
/* harmony export */ });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./lib/streamlines/Vector.ts");
/* harmony import */ var _createLookupGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createLookupGrid */ "./lib/streamlines/createLookupGrid.ts");
/* harmony import */ var _integrator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./integrator */ "./lib/streamlines/integrator.ts");
/**
 * See https://github.com/anvaka/streamlines from Ankava
 * MIT License
 */



var State;
(function (State) {
    State[State["STATE_INIT"] = 0] = "STATE_INIT";
    State[State["STATE_STREAMLINE"] = 1] = "STATE_STREAMLINE";
    State[State["STATE_PROCESS_QUEUE"] = 2] = "STATE_PROCESS_QUEUE";
    State[State["STATE_DONE"] = 3] = "STATE_DONE";
    State[State["STATE_SEED_STREAMLINE"] = 4] = "STATE_SEED_STREAMLINE";
})(State || (State = {}));
function streamlines(protoOptions) {
    const options = protoOptions;
    if (!protoOptions) {
        throw new Error('Configuration is required to compute streamlines');
    }
    if (!protoOptions.boundingBox) {
        throw new Error('No bounding box passed to streamline. Creating default one');
    }
    normalizeBoundingBox(options.boundingBox);
    const boundingBox = options.boundingBox;
    if (protoOptions.seedArray !== undefined &&
        Array.isArray(protoOptions.seedArray)) {
        const seed = protoOptions.seedArray.shift();
        options.seed = new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(seed.x, seed.y);
        options.seedArray = protoOptions.seedArray;
    }
    else if (protoOptions.seed !== undefined) {
        options.seed = protoOptions.seed;
    }
    else {
        options.seed = new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(Math.random() * boundingBox.width + boundingBox.left, Math.random() * boundingBox.height + boundingBox.top);
    }
    // Separation between streamlines. Naming according to the paper.
    options.dSep =
        protoOptions.dSep > 0
            ? protoOptions.dSep
            : 1 / Math.max(boundingBox.width, boundingBox.height);
    // When should we stop integrating a streamline.
    options.dTest =
        protoOptions.dTest > 0 ? protoOptions.dTest : options.dSep * 0.5;
    // Lookup grid helps to quickly tell if there are points nearby
    const grid = (0,_createLookupGrid__WEBPACK_IMPORTED_MODULE_1__.createLookupGrid)(boundingBox, options.dSep, options.isOutsideFct);
    // Integration time step.
    options.timeStep = protoOptions.timeStep > 0 ? protoOptions.timeStep : 0.01;
    options.stepsPerIteration =
        protoOptions.stepsPerIteration > 0 ? protoOptions.stepsPerIteration : 10;
    options.maxTimePerIteration =
        protoOptions.maxTimePerIteration > 0
            ? protoOptions.maxTimePerIteration
            : 1000;
    const stepsPerIteration = options.stepsPerIteration;
    //const resolve
    let state = State.STATE_INIT;
    const finishedStreamlineIntegrators = [];
    let streamlineIntegrator = (0,_integrator__WEBPACK_IMPORTED_MODULE_2__.createStreamlineIntegrator)(options.seed, grid, options);
    return {
        run: nextStep,
    };
    // Order:
    //   initProcessing()
    //   processQueue()
    function nextStep() {
        while (state !== State.STATE_DONE) {
            for (let i = 0; i < stepsPerIteration; ++i) {
                if (state === State.STATE_INIT) {
                    initProcessing();
                }
                else if (state === State.STATE_STREAMLINE) {
                    continueStreamline();
                }
                else if (state === State.STATE_PROCESS_QUEUE) {
                    processQueue();
                }
                else if (state === State.STATE_SEED_STREAMLINE) {
                    seedStreamline();
                }
            }
        }
    }
    function initProcessing() {
        const streamLineCompleted = streamlineIntegrator.next();
        if (streamLineCompleted) {
            addStreamLineToQueue();
            state = State.STATE_PROCESS_QUEUE;
        }
    }
    function seedStreamline() {
        const currentStreamLine = finishedStreamlineIntegrators[0];
        const validCandidate = currentStreamLine.getNextValidSeed();
        if (validCandidate) {
            streamlineIntegrator = (0,_integrator__WEBPACK_IMPORTED_MODULE_2__.createStreamlineIntegrator)(validCandidate, grid, options);
            state = State.STATE_STREAMLINE;
        }
        else {
            finishedStreamlineIntegrators.shift();
            state = State.STATE_PROCESS_QUEUE;
        }
    }
    function processQueue() {
        if (finishedStreamlineIntegrators.length === 0) {
            state = State.STATE_DONE;
        }
        else {
            state = State.STATE_SEED_STREAMLINE;
        }
    }
    function continueStreamline() {
        const isDone = streamlineIntegrator.next();
        if (isDone) {
            addStreamLineToQueue();
            state = State.STATE_SEED_STREAMLINE;
        }
    }
    function addStreamLineToQueue() {
        const streamLinePoints = streamlineIntegrator.getStreamline();
        if (streamLinePoints.length > 1) {
            finishedStreamlineIntegrators.push(streamlineIntegrator);
            if (options.onStreamlineAdded) {
                options.onStreamlineAdded(streamLinePoints, options);
            }
        }
    }
}
function assertNumber(x, msg) {
    if (typeof x !== 'number' || Number.isNaN(x)) {
        throw new Error(msg);
    }
}
function normalizeBoundingBox(bbox) {
    const msg = 'Bounding box {left, top, width, height} is required';
    if (!bbox) {
        throw new Error(msg);
    }
    assertNumber(bbox.left, msg);
    assertNumber(bbox.top, msg);
    if (typeof bbox.size === 'number') {
        bbox.width = bbox.size;
        bbox.height = bbox.size;
    }
    assertNumber(bbox.width, msg);
    assertNumber(bbox.height, msg);
    if (bbox.width <= 0 || bbox.height <= 0) {
        throw new Error('Bounding box cannot be empty');
    }
}


/***/ }),

/***/ "./lib/streamlines/utils.ts":
/*!**********************************!*\
  !*** ./lib/streamlines/utils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDimsGrid2D": () => (/* binding */ getDimsGrid2D)
/* harmony export */ });
/**
 * Detect the size of the 2D-grid and return `[nx, ny]` if valid.
 * Undefined otherwise.
 */
const getDimsGrid2D = (positions, eps = 1e-7) => {
    const start = positions.itemAt(0)[0];
    let nx = 0;
    positions.forEach((p) => {
        if (Math.abs(p[0] - start) < eps) {
            nx++;
        }
    });
    if (nx < 2) {
        console.warn('Seems that the grid is not regular');
        return undefined;
    }
    const ny = positions.count / nx;
    if (Number.isInteger(ny) === false) {
        console.warn('Seems that the grid is not regular');
        return undefined;
    }
    return [nx, ny];
};


/***/ }),

/***/ "./lib/triangulate.ts":
/*!****************************!*\
  !*** ./lib/triangulate.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "triangulate": () => (/* binding */ triangulate)
/* harmony export */ });
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @youwol/dataframe */ "@youwol/dataframe");
/* harmony import */ var _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _delaunay_delaunator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./delaunay/delaunator */ "./lib/delaunay/delaunator.ts");
/* harmony import */ var _plane__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plane */ "./lib/plane.ts");



/**
 * Unconstrained Delaunay triangulation in 2D.
 * @param points The point coordinates as a packed array
 * @param normal The normal to project th epoint to perform the triangulation
 * @license ISC
 * @copyright 2017, Mapbox
 * @github [This link](https://github.com/mapbox/delaunator)
 */
function triangulate(positions, normal = [0, 0, 1]) {
    let d = undefined;
    if (positions.itemSize === 2) {
        d = new _delaunay_delaunator__WEBPACK_IMPORTED_MODULE_1__.Delaunator(positions.array);
    }
    else {
        const newPts = positions.map((p) => (0,_plane__WEBPACK_IMPORTED_MODULE_2__.project)(p, { normal, point: [0, 0, 0] }));
        d = new _delaunay_delaunator__WEBPACK_IMPORTED_MODULE_1__.Delaunator(newPts.array);
    }
    // const max = array.max(d.triangles)
    // let indices: ASerie = undefined
    // if (max>65535) {
    //     indices = createSerie({data: createTyped(Uint32Array, d.triangles, true), itemSize: 3})
    // }
    // else {
    //     indices = createSerie({data: createTyped(Uint16Array, d.triangles, true), itemSize: 3})
    // }
    const indices = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.Serie.create({ array: d.triangles, itemSize: 3 });
    const df = _youwol_dataframe__WEBPACK_IMPORTED_MODULE_0__.DataFrame.create({
        series: {
            indices,
            positions,
        },
    });
    return df;
}


/***/ }),

/***/ "@youwol/dataframe":
/*!************************************!*\
  !*** external "@youwol/dataframe" ***!
  \************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__youwol_dataframe__;

/***/ }),

/***/ "@youwol/math":
/*!*******************************!*\
  !*** external "@youwol/math" ***!
  \*******************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__youwol_math__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Action),
/* harmony export */   "ActionPool": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.ActionPool),
/* harmony export */   "AnglesToNormal": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.AnglesToNormal),
/* harmony export */   "BBox": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.BBox),
/* harmony export */   "BackgroundGrid2D": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.BackgroundGrid2D),
/* harmony export */   "CurvatureDecomposer": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.CurvatureDecomposer),
/* harmony export */   "Facet": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Facet),
/* harmony export */   "FillHoleAction": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.FillHoleAction),
/* harmony export */   "FunctionAction": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.FunctionAction),
/* harmony export */   "Grid2DHelper": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Grid2DHelper),
/* harmony export */   "Grid3DHelper": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Grid3DHelper),
/* harmony export */   "Halfedge": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Halfedge),
/* harmony export */   "HarmonicDiffusion": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.HarmonicDiffusion),
/* harmony export */   "InterpolateInGrid2D": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.InterpolateInGrid2D),
/* harmony export */   "InterpolateSerieFromCsysOnSurface": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.InterpolateSerieFromCsysOnSurface),
/* harmony export */   "MacroAction": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.MacroAction),
/* harmony export */   "MarchingCubes": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.MarchingCubes),
/* harmony export */   "MoveNodeAction": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.MoveNodeAction),
/* harmony export */   "Node": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Node),
/* harmony export */   "Normalizer": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Normalizer),
/* harmony export */   "NormalsToNodeDecomposer": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.NormalsToNodeDecomposer),
/* harmony export */   "Surface": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Surface),
/* harmony export */   "SurfaceBuilder": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.SurfaceBuilder),
/* harmony export */   "SurfaceEditor": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.SurfaceEditor),
/* harmony export */   "TriangleCSys": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.TriangleCSys),
/* harmony export */   "TriangleToNodeDecomposer": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.TriangleToNodeDecomposer),
/* harmony export */   "Vector": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.Vector),
/* harmony export */   "createBackgroundGrid2D": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.createBackgroundGrid2D),
/* harmony export */   "distanceFromPointToPlane": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.distanceFromPointToPlane),
/* harmony export */   "extractSurfaceBorders": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.extractSurfaceBorders),
/* harmony export */   "extrude": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.extrude),
/* harmony export */   "facetArea": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.facetArea),
/* harmony export */   "facetNormal": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.facetNormal),
/* harmony export */   "facetsAroundNode": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.facetsAroundNode),
/* harmony export */   "fittingPlane": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.fittingPlane),
/* harmony export */   "fromNodeToTriangle": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.fromNodeToTriangle),
/* harmony export */   "fromTriangleToNode": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.fromTriangleToNode),
/* harmony export */   "generateEllipse": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.generateEllipse),
/* harmony export */   "generateNormals": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.generateNormals),
/* harmony export */   "generatePointInPolygon": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.generatePointInPolygon),
/* harmony export */   "generateRectangle": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.generateRectangle),
/* harmony export */   "generateSphere": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.generateSphere),
/* harmony export */   "generateStreamLinesFromUnstructured": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.generateStreamLinesFromUnstructured),
/* harmony export */   "getDimsGrid2D": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.getDimsGrid2D),
/* harmony export */   "inflateBBox": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.inflateBBox),
/* harmony export */   "intersectTriangle": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.intersectTriangle),
/* harmony export */   "mapToMnt": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.mapToMnt),
/* harmony export */   "nodesAroundHalfedge": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.nodesAroundHalfedge),
/* harmony export */   "nodesAroundNode": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.nodesAroundNode),
/* harmony export */   "pointInPolygon": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.pointInPolygon),
/* harmony export */   "project": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.project),
/* harmony export */   "relaxMesh": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.relaxMesh),
/* harmony export */   "reverseNormals": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.reverseNormals),
/* harmony export */   "simplify": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.simplify),
/* harmony export */   "streamLinesExtractor": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.streamLinesExtractor),
/* harmony export */   "triangleArea": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.triangleArea),
/* harmony export */   "triangleNormal": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.triangleNormal),
/* harmony export */   "triangulate": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.triangulate),
/* harmony export */   "vectorFromPointsToPlane": () => (/* reexport safe */ _lib__WEBPACK_IMPORTED_MODULE_0__.vectorFromPointsToPlane)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./lib/index.ts");
/*
 * Public API Surface of geometry
 */

// For documentation purpose
// export * from './lib/examples'

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=geometry.js.map