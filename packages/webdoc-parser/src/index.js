// @flow

import {parse} from './parse';

const code = `
/**
 * Yo yo
 * @class
 * @emitter
 */
class Babri
{
    constructor()
    {
        /**
         * What is kya?
         * @member {PIXI.filters}
         */
        this.kya = true;
    }

    /**
     * Do karta.
     * @param {{boolean} kyu
     */
    karta(kyu) {

    }
}
`;

const code2 = `
/**
 * Disturbed?
 */
class Kutta {
    /**
     * DOGGY_______________________________________________________________________434
     */
    constructor() {

    }
}

/**
 * @typedef {object} Typed
 * @property {Yolo} somethingofcourse
 * @property {(d): dkd}
 */
`;

require('util').inspect.defaultOptions.depth = 5;

const doc = parse(code2);

// parse(code2, doc);
console.log(doc);
