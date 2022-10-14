class Vector2d {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    normalize() {
        this.divide(this.length())
    }
    add(v) {
        if (v instanceof Vector2d) return new Vector2d(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector2d(this.x + v, this.y + v, this.z + v);
    }
    divide(v) {
        if (v instanceof Vector2d) return new Vector2d(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector2d(this.x / v, this.y / v, this.z / v);
    }
    length() {
        return Math.sqrt(this.dot(this));
    }
    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
}



// Vector2d.prototype = {,
//     subtract(v) {
//         if (v instanceof Vector2d) return new Vector2d(this.x - v.x, this.y - v.y, this.z - v.z);
//         else return new Vector2d(this.x - v, this.y - v, this.z - v);
//     },
//     multiply(v) {
//         if (v instanceof Vector2d) return new Vector2d(this.x * v.x, this.y * v.y, this.z * v.z);
//         else return new Vector2d(this.x * v, this.y * v, this.z * v);
//     },
//     ,
//     equals(v) {
//         return this.x == v.x && this.y == v.y && this.z == v.z;
//     },
//     dot(v) {
//         return this.x * v.x + this.y * v.y + this.z * v.z;
//     },
//     cross(v) {
//         return new Vector2d(
//             this.y * v.z - this.z * v.y,
//             this.z * v.x - this.x * v.z,
//             this.x * v.y - this.y * v.x
//         );
//     },
//     ,
//     unit() {
//         return this.divide(this.length());
//     },
//     min() {
//         return Math.min(Math.min(this.x, this.y), this.z);
//     },
//     max() {
//         return Math.max(Math.max(this.x, this.y), this.z);
//     },
//     toAngles() {
//         return {
//             thetan2(this.z, this.x),
//             phin(this.y / this.length())
//         };
//     },
//     angleTo(a) {
//         return Math.acos(this.dot(a) / (this.length() * a.length()));
//     },
//     toArray(n) {
//         return [this.x, this.y, this.z].slice(0, n || 3);
//     },
//     clone() {
//         return new Vector2d(this.x, this.y, this.z);
//     },
//     init(x, y, z) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//         return this;
//     }
// };