var kdTree = (function () {
    function kdTree(points, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        if (points.length == 1) {
            this.point = points[0];
            return;
        }
        this.axis = depth % 2;
        points.sort(function (a, b) { return a[_this.axis] - b[_this.axis]; });
        var medianElementIndex = Math.floor(points.length / 2);
        var leftPoints = points.splice(0, medianElementIndex);
        if (leftPoints.length > 0)
            this.leftChild = new kdTree(leftPoints, depth + 1);
        this.point = points.splice(0, 1)[0];
        this.median = this.point[this.axis];
        if (points.length > 0)
            this.rightChild = new kdTree(points, depth + 1);
    }
    kdTree.prototype.searchNearest = function (searchPoint) {
        return Math.sqrt(this._searchNearest(searchPoint).dist);
    };
    kdTree.prototype._searchNearest = function (searchPoint) {
        if (!this.leftChild && !this.rightChild)
            return { dist: this.distSquared(searchPoint), point: this.point };
        var best;
        var child = searchPoint[this.axis] < this.median ? this.leftChild : this.rightChild;
        if (child)
            best = child._searchNearest(searchPoint);
        else
            best = { dist: Number.MAX_VALUE, point: null };
        var dist = this.distSquared(searchPoint);
        if (dist < best.dist)
            best = { dist: dist, point: this.point };
        if (Math.pow(searchPoint[this.axis] - this.median, 2) < best.dist) {
            var otherChild = child == this.leftChild ? this.rightChild : this.leftChild;
            if (otherChild) {
                var maybeBetter = otherChild._searchNearest(searchPoint);
                if (maybeBetter.dist < best.dist)
                    return maybeBetter;
            }
        }
        return best;
    };
    kdTree.prototype.distSquared = function (other) {
        var dist = Math.pow(this.point[0] - other[0], 2) + Math.pow(this.point[1] - other[1], 2);
        return dist == 0 ? Number.MAX_VALUE : dist;
    };
    return kdTree;
}());
var ISearchNearestResult = (function () {
    function ISearchNearestResult() {
    }
    return ISearchNearestResult;
}());
